import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../storage/db";

export function useConversationDetail(conversationId: string | null) {
  return useLiveQuery(async () => {
    if (!conversationId) {
      return null;
    }

    const conversation = await db.conversations.get(conversationId);

    if (!conversation) {
      return null;
    }

    const messages = await db.messages
      .where("conversationId")
      .equals(conversationId)
      .sortBy("timestamp");

    return {
      conversation,
      messages,
    };
  }, [conversationId]);
}