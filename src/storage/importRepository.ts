import type { ImportResult } from "../features/import/importTypes";
import { db } from "./db";
import { saveMessages } from "./messageRepository";

export async function saveImportResult(
  result: ImportResult,
  storeRawMessages: boolean,
): Promise<void> {
  await db.transaction("rw", db.conversations, db.messages, async () => {
    await db.conversations.put(result.conversation);
    await db.messages
      .where("conversationId")
      .equals(result.conversation.id)
      .delete();

    await saveMessages(result.messages, storeRawMessages);
  });
}