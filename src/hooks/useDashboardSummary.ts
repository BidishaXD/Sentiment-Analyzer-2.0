import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../storage/db";

export function useDashboardSummary() {
  return useLiveQuery(async () => {
    const conversations = await db.conversations
      .orderBy("updatedAt")
      .reverse()
      .toArray();

    const totalMessages = conversations.reduce(
      (total, conversation) => total + conversation.messageCount,
      0,
    );

    const latestConversation = conversations[0];

    return {
      conversations,
      totalConversations: conversations.length,
      totalMessages,
      latestConversation,
    };
  }, []);
}