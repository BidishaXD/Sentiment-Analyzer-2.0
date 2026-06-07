import type { Conversation } from "../../types/conversation";
import type { Message } from "../../types/message";

export interface ImportPreview {
  fileName: string;
  fileSize: number;
  platform: { id: "whatsapp" | "instagram"; label: string };
  conversationTitle: string;
  messageCount: number;
  participantCount: number;
  skippedLineCount: number;
  rawMessageStorageEnabled: boolean;
  firstMessageAt?: string;
  lastMessageAt?: string;
}

export interface ImportResult {
  conversation: Conversation;
  messages: Message[];
  skippedLines: string[];
  preview: ImportPreview;
}