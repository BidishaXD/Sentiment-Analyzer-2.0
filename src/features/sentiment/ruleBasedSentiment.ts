import type { Message } from "../../types/message";
import type { MessageSentiment } from "../../types/message";

const POSITIVE_WORDS = new Set([
  "good", "great", "excellent", "amazing", "awesome", "happy", "love", 
  "liked", "thanks", "thank", "perfect", "nice", "best", "cool", 
  "helpful", "successful", "done", "resolved", "appreciate", "wonderful"
]);

const NEGATIVE_WORDS = new Set([
  "bad", "terrible", "awful", "angry", "sad", "hate", "hated", "problem", 
  "issue", "wrong", "failed", "fail", "late", "delay", "delayed", 
  "broken", "worst", "annoyed", "disappointed", "unhappy", "not", "never"
]);

/**
 * Evaluates a raw string slice using local bag-of-words rules to generate a sentiment snapshot score.
 */
export function analyzeTextWithRules(text: string): MessageSentiment {
  const tokens = tokenize(text);

  if (tokens.length === 0) {
    return { label: "neutral", score: 0.5 };
  }

  let positiveHits = 0;
  let negativeHits = 0;

  for (const token of tokens) {
    if (POSITIVE_WORDS.has(token)) {
      positiveHits += 1;
    }
    if (NEGATIVE_WORDS.has(token)) {
      negativeHits += 1;
    }
  }

  const signalCount = positiveHits + negativeHits;

  if (signalCount === 0) {
    return { label: "neutral", score: 0.5 };
  }

  const positiveRatio = positiveHits / signalCount;
  const negativeRatio = negativeHits / signalCount;

  if (positiveRatio > negativeRatio) {
    return { label: "positive", score: round(0.5 + (positiveRatio * 0.5)) };
  }
  if (negativeRatio > positiveRatio) {
    return { label: "negative", score: round(0.5 - (negativeRatio * 0.5)) };
  }

  return { label: "neutral", score: 0.5 };
}

/**
 * Loops through an array of Messages, computes individual sentiment weights,
 * and appends the final evaluations onto the returned objects.
 */
export async function analyzeMessages(messages: Message[]): Promise<Message[]> {
  const analyzedMessages: Message[] = [];

  for (const message of messages) {
    if (message.isSystemMessage || !message.text || !message.text.trim()) {
      analyzedMessages.push({
        ...message,
        sentiment: { label: "neutral", score: 0.5 }
      });
      continue;
    }

    analyzedMessages.push({
      ...message,
      sentiment: analyzeTextWithRules(message.text)
    });
  }

  return analyzedMessages;
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}