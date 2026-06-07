import { parseInstagramJson } from "./instagramParser";
import { parseWhatsAppTxt } from "../parsers/whatsappTxtParser";
import { analyzeMessages } from "../sentiment/ruleBasedSentiment";
import { aggregateSentiment } from "../sentiment/aggregateSentiment";
import type { ImportResult } from "./importTypes";
import type { Message } from "../../types/message";

/**
 * Orchestrates the full conversation import pipeline.
 * Reads file contents, selects the appropriate platform parsing engine,
 * runs the sentiment calculation algorithms, and prepares the data payload for local database storage.
 */
export async function importMessageFile(
  file: File,
  options: { platform: "whatsapp" | "instagram"; storeRawMessages: boolean }
): Promise<ImportResult> {
  const textContent = await file.text();

  // Handle Instagram Parsing Route
  if (options.platform === "instagram") {
    const parsed = parseInstagramJson(textContent);
    const conversationId = `ig-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    // Cast raw partial structures to fulfill the complete strict Message layout
    const baseMessages: Message[] = parsed.messages.map((msg, index) => ({
      id: `${conversationId}-msg-${index}`,
      conversationId: conversationId,
      senderName: msg.senderName || "Unknown",
      timestamp: msg.timestamp || new Date().toISOString(),
      text: msg.text || "",
      isSystemMessage: !!msg.isSystemMessage,
    }));

    // Pass structured array through our analytical engines
    const analyzedMessages = await analyzeMessages(baseMessages);
    const summaryMetrics = aggregateSentiment(analyzedMessages);

    return {
      conversation: {
        id: conversationId,
        title: parsed.title,
        platform: "instagram",
        participantNames: parsed.participantNames,
        messageCount: analyzedMessages.length,
        firstMessageAt: analyzedMessages[0]?.timestamp,
        lastMessageAt: analyzedMessages[analyzedMessages.length - 1]?.timestamp,
        updatedAt: new Date().toISOString(),
        sentimentSummary: {
          dominantSentiment: summaryMetrics.dominantSentiment,
          averageScore: summaryMetrics.averageScore,
          positiveCount: summaryMetrics.positiveCount,
          neutralCount: summaryMetrics.neutralCount,
          negativeCount: summaryMetrics.negativeCount,
        },
      },
      messages: analyzedMessages,
      skippedLines: [],
      preview: {
        fileName: file.name,
        fileSize: file.size,
        platform: { id: "instagram", label: "Instagram" },
        conversationTitle: parsed.title,
        messageCount: analyzedMessages.length,
        participantCount: parsed.participantNames.length,
        skippedLineCount: 0,
        rawMessageStorageEnabled: options.storeRawMessages,
        firstMessageAt: analyzedMessages[0]?.timestamp,
        lastMessageAt: analyzedMessages[analyzedMessages.length - 1]?.timestamp,
      },
    };
  }

  // Handle WhatsApp Parsing Route (Using the updated regex parser engine)
  const conversationTitle = file.name.replace(/\.txt$/i, "");
  const parsedResult = await parseWhatsAppTxt(textContent, conversationTitle);

  return {
    conversation: parsedResult.conversation,
    messages: parsedResult.messages,
    skippedLines: parsedResult.skippedLines,
    preview: {
      fileName: file.name,
      fileSize: file.size,
      platform: { id: "whatsapp", label: "WhatsApp" },
      conversationTitle: parsedResult.conversation.title,
      messageCount: parsedResult.messages.length,
      participantCount: parsedResult.conversation.participantNames.length,
      skippedLineCount: parsedResult.skippedLines.length,
      rawMessageStorageEnabled: options.storeRawMessages,
      firstMessageAt: parsedResult.conversation.firstMessageAt,
      lastMessageAt: parsedResult.conversation.lastMessageAt,
    },
  };
}