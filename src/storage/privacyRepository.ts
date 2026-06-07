import { db } from "./db";

export async function deleteStoredRawMessageText(): Promise<void> {
  await db.messages.toCollection().modify((message) => {
    message.text = "";
  });
}

export async function countMessagesWithRawText(): Promise<number> {
  const messages = await db.messages.toArray();

  return messages.filter((message) => message.text.trim().length > 0).length;
}