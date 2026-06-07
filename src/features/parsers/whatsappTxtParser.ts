import type { Conversation } from "../../types/conversation";
import type { Message } from "../../types/message";
import { analyzeMessages } from "../sentiment/ruleBasedSentiment";
import { aggregateSentiment } from "../sentiment/aggregateSentiment";
import type { ParserResult } from "./types";

export async function parseWhatsAppTxt(
  text: string,
  conversationTitle: string
): Promise<ParserResult> {
  const lines = text.split(/\r?\n/);
  const rawMessages: Omit<Message, "id">[] = [];
  const skippedLines: string[] = [];
  const participantNamesSet = new Set<string>();

  // 1. Matches bracket formats: "[6/1/2026, 10:00:00 AM] Name: text"
  const bracketRegex = /^\[(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}),\s*(\d{1,2}:\d{2}(?::\d{2})?.*?)[\]?]\s*([^:]+):\s(.*)$/;
  
  // 2. UPDATED: Matches your exact format: "6/1/2026, 10:00 AM - John: This is great"
  const hyphenRegex = /^(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}),\s*(\d{1,2}:\d{2}(?::\d{2})?\s*[A-Z]{2})\s*-\s*([^:]+):\s(.*)$/i;

  const conversationId = `wa-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  for (const line of lines) {
    if (!line.trim()) continue;

    let match = line.match(bracketRegex);
    let rawDate = "";
    let rawTime = "";
    let senderName = "";
    let messageText = "";

    if (match) {
      [, rawDate, rawTime, senderName, messageText] = match;
    } else {
      match = line.match(hyphenRegex);
      if (match) {
        [, rawDate, rawTime, senderName, messageText] = match;
      }
    }

    if (match) {
      const cleanSender = senderName.trim();
      participantNamesSet.add(cleanSender);

      let ISOString = new Date().toISOString();
      try {
        // Clean up text format anomalies before passing to Date constructor
        const cleanDateStr = rawDate.trim();
        const cleanTimeStr = rawTime.trim().replace(/\s+/g, " ");
        const parsedDate = new Date(`${cleanDateStr} ${cleanTimeStr}`);
        
        if (!isNaN(parsedDate.getTime())) {
          ISOString = parsedDate.toISOString();
        }
      } catch {
        // Fallback silently to current execution timestamp
      }

      rawMessages.push({
        conversationId,
        senderName: cleanSender,
        timestamp: ISOString,
        text: messageText.trim(),
        isSystemMessage: false,
      });
    } else {
      // Handle multiline continuation or log metadata splits
      if (rawMessages.length > 0 && !line.includes("Messages and calls are end-to-end encrypted")) {
        rawMessages[rawMessages.length - 1].text += `\n${line.trim()}`;
      } else {
        skippedLines.push(line);
      }
    }
  }

  const baseMessages: Message[] = rawMessages.map((msg, index) => ({
    ...msg,
    id: `${conversationId}-msg-${index}`,
  }));

  const analyzedMessages = await analyzeMessages(baseMessages);
  const summaryMetrics = aggregateSentiment(analyzedMessages);

  const nowString = new Date().toISOString();
  const participantNames = Array.from(participantNamesSet);

  const conversation: Conversation = {
    id: conversationId,
    title: conversationTitle,
    platform: "whatsapp",
    participantNames,
    messageCount: analyzedMessages.length,
    firstMessageAt: analyzedMessages[0]?.timestamp,
    lastMessageAt: analyzedMessages[analyzedMessages.length - 1]?.timestamp,
    updatedAt: nowString,
    sentimentSummary: {
      dominantSentiment: summaryMetrics.dominantSentiment,
      averageScore: summaryMetrics.averageScore,
      positiveCount: summaryMetrics.positiveCount,
      neutralCount: summaryMetrics.neutralCount,
      negativeCount: summaryMetrics.negativeCount,
    },
  };

  return {
    conversation,
    messages: analyzedMessages,
    skippedLines,
  };
}