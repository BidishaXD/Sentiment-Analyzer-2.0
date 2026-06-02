import type { SentimentResult } from "./sentiment";

export type MessagePlatform = "whatsapp" | "instagram";

export interface Message {
  id: string;
  conversationId: string;
  platform: MessagePlatform;
  senderName: string;
  text: string;
  timestamp: string;
  sentiment?: SentimentResult;
  isSystemMessage: boolean;
  createdAt: string;
}

export interface ParsedMessageInput {
  platform: MessagePlatform;
  senderName: string;
  text: string;
  timestamp: string;
  isSystemMessage?: boolean;
}