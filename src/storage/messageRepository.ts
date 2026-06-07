import type { Message } from "../types/message";
import { db } from "./db";

export async function saveMessages(
  messages: Message[],
  storeRawMessages: boolean,
): Promise<void> {
  const safeMessages = storeRawMessages
    ? messages
    : messages.map((message) => ({
        ...message,
        text: "",
      }));

  await db.messages.bulkPut(safeMessages);
}

export async function getMessagesByConversationId(
  conversationId: string,
): Promise<Message[]> {
  return db.messages
    .where("conversationId")
    .equals(conversationId)
    .sortBy("timestamp");
}

export async function deleteMessagesByConversationId(
  conversationId: string,
): Promise<void> {
  await db.messages.where("conversationId").equals(conversationId).delete();
}

export async function clearMessages(): Promise<void> {
  await db.messages.clear();
}