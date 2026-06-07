import type { Conversation } from "../../types/conversation";
import type { Message } from "../../types/message";

export function buildConversationJsonReport(
  conversation: Conversation,
  messages: Message[],
): string {
  return JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      conversation: {
        id: conversation.id,
        title: conversation.title,
        platform: conversation.platform,
        participantNames: conversation.participantNames,
        messageCount: conversation.messageCount,
        firstMessageAt: conversation.firstMessageAt,
        lastMessageAt: conversation.lastMessageAt,
        sentimentSummary: conversation.sentimentSummary,
      },
      messages: messages.map((message) => ({
        id: message.id,
        senderName: message.senderName,
        timestamp: message.timestamp,
        text: message.text || null,
        isSystemMessage: message.isSystemMessage,
        sentiment: message.sentiment ?? null,
      })),
    },
    null,
    2,
  );
}