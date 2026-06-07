import { analyzeMessages } from "../features/sentiment/ruleBasedSentiment";
import { aggregateSentiment } from "../features/sentiment/aggregateSentiment";
import type { WorkerRequestPayload, WorkerResponsePayload } from "./workerMessages";
import type { Message } from "../types/message";

// Accessing the global worker execution context instance safely
const ctx: Worker = self as any;

/**
 * Global message listener event block mapping inbound array payloads
 * to the synchronous core evaluation algorithms.
 */
ctx.addEventListener("message", async (event: MessageEvent<WorkerRequestPayload>) => {
  const { action, messages, conversationTitle, conversationId } = event.data;

  if (action === "RUN_ANALYSIS") {
    try {
      // 1. Execute rule-based token tracking evaluation over text blocks array safely
      const analyzedMessages = await analyzeMessages(messages);

      // 2. Compute aggregate distribution summaries metrics matrices
      const summaryMetrics = aggregateSentiment(analyzedMessages);

      const nowString = new Date().toISOString();

      // Gather distinct speaker identities arrays dynamically
      const participantNamesSet = new Set<string>();
      analyzedMessages.forEach((msg: Message) => {
        if (msg.senderName) participantNamesSet.add(msg.senderName);
      });

      // Assemble complete Conversation structural model card
      const conversation = {
        id: conversationId,
        title: conversationTitle,
        // Enforce the explicit union literal type constraint to prevent TS2322 widening errors
        platform: (conversationId.startsWith("ig-") ? "instagram" : "whatsapp") as "instagram" | "whatsapp",
        participantNames: Array.from(participantNamesSet),
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

      // 3. Post serialized computational payloads back to client controller
      const successResponse: WorkerResponsePayload = {
        success: true,
        conversation,
        messages: analyzedMessages,
      };

      ctx.postMessage(successResponse);
    } catch (error: any) {
      const errorResponse: WorkerResponsePayload = {
        success: false,
        error: error?.message || "Internal Web Worker execution failure processing batch chunks.",
      };
      ctx.postMessage(errorResponse);
    }
  }
});