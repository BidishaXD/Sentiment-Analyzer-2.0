import type { Message } from "../../types/message";
import type { SentimentLabel, SentimentSummary } from "../../types/sentiment";

export function aggregateSentiment(messages: Message[]): SentimentSummary {
  let positiveCount = 0;
  let neutralCount = 0;
  let negativeCount = 0;
  let scoreTotal = 0;
  let totalAnalyzed = 0;

  for (const message of messages) {
    if (!message.sentiment) {
      continue;
    }

    totalAnalyzed += 1;
    scoreTotal += message.sentiment.score;

    if (message.sentiment.label === "positive") {
      positiveCount += 1;
    } else if (message.sentiment.label === "negative") {
      negativeCount += 1;
    } else {
      neutralCount += 1;
    }
  }

  return {
    positiveCount,
    neutralCount,
    negativeCount,
    totalAnalyzed,
    averageScore: totalAnalyzed > 0 ? round(scoreTotal / totalAnalyzed) : 0,
    dominantSentiment: getDominantSentiment({
      positiveCount,
      neutralCount,
      negativeCount,
    }),
  };
}

function getDominantSentiment(counts: {
  positiveCount: number;
  neutralCount: number;
  negativeCount: number;
}): SentimentLabel {
  if (
    counts.positiveCount >= counts.neutralCount &&
    counts.positiveCount >= counts.negativeCount
  ) {
    return "positive";
  }

  if (
    counts.negativeCount >= counts.positiveCount &&
    counts.negativeCount >= counts.neutralCount
  ) {
    return "negative";
  }

  return "neutral";
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}