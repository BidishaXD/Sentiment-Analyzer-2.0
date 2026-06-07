import type { Conversation } from "../../types/conversation";
import type { Message, MessagePlatform } from "../../types/message";

export interface ParserInput {
  file: File;
  text: string;
  platform: MessagePlatform;
  conversationTitle?: string;
}

export interface ParserResult {
  conversation: Conversation;
  messages: Message[];
  skippedLines: string[];
}

export interface ImportParser {
  platform: MessagePlatform;
  extensions: string[];
  mimeTypes: string[];
  parse(input: ParserInput): ParserResult | Promise<ParserResult>;
}