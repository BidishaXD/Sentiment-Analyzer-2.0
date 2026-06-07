import { db } from "./db";
import type { Conversation } from "../types/conversation";
import type { Message } from "../types/message";

/**
 * Persists both a Conversation header structure and its full array of analyzed messages
 * atomically inside an IndexedDB transaction sequence.
 */
export async function saveConversationWithMessages(
  conversation: Conversation,
  messages: Message[]
): Promise<void> {
  await db.transaction("rw", [db.conversations, db.messages], async () => {
    // 1. Write conversation profile card metrics entry
    await db.conversations.put(conversation);

    // 2. Safely wipe out any historic existing message nodes for this key context
    await db.messages.where("conversationId").equals(conversation.id).delete();

    // 3. Batch bulk insert message records maps
    if (messages.length > 0) {
      await db.messages.bulkAdd(messages);
    }
  });
}

/**
 * Grabs a single conversation entity from local workspace tables.
 */
export async function getConversationById(id: string): Promise<Conversation | undefined> {
  return await db.conversations.get(id);
}

/**
 * Drops all entries completely inside conversations and messages stores.
 */
export async function clearConversations(): Promise<void> {
  await db.transaction("rw", [db.conversations, db.messages], async () => {
    await db.conversations.clear();
    await db.messages.clear();
  });
}