import type { MessagePlatform } from "./message";
import type { SentimentSummary } from "./sentiment";

export interface Conversation {
  id: string;
  platform: MessagePlatform;
  title: string;
  participantNames: string[];
  messageCount: number;
  firstMessageAt?: string;
  lastMessageAt?: string;
  sentimentSummary?: SentimentSummary;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationPreview extends Conversation {
  latestMessageText?: string;
}