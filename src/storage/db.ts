import Dexie, { type Table } from "dexie";
import type { Conversation } from "../types/conversation";
import type { Message } from "../types/message";
import type { AppSettings } from "./schema";

class SentimentAnalyzerDb extends Dexie {
  conversations!: Table<Conversation, string>;
  messages!: Table<Message, string>;
  settings!: Table<AppSettings, string>;

  constructor() {
    super("sentiment-analyzer-2-db");

    this.version(1).stores({
      conversations: "id, platform, title, lastMessageAt, updatedAt",
      messages: "id, conversationId, platform, senderName, timestamp",
      settings: "id",
    });
  }
}

export const db = new SentimentAnalyzerDb();