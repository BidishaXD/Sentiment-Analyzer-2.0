import { db } from "../../storage/db";

/**
 * Sweeps through local tables and purges any message nodes or conversation headers 
 * that exceed the user's active retention span parameters.
 */
export async function applyDataRetentionSweep(daysToKeep: number): Promise<{ purgedChannels: number }> {
  if (daysToKeep <= 0) {
    // A value of 0 implies an infinite retention strategy index; skip execution entirely
    return { purgedChannels: 0 };
  }

  const cutoffTime = new Date();
  cutoffTime.setDate(cutoffTime.getDate() - daysToKeep);
  const cutoffIsoString = cutoffTime.toISOString();

  let purgedChannels = 0;

  await db.transaction("rw", [db.conversations, db.messages], async () => {
    // 1. Identify target conversation headers that are older than the retention threshold
    const expiredConversations = await db.conversations
      .where("updatedAt")
      .below(cutoffIsoString)
      .toArray();

    purgedChannels = expiredConversations.length;

    for (const conv of expiredConversations) {
      // 2. Cascade delete dependent message items matching the dead conversation ID
      await db.messages.where("conversationId").equals(conv.id).delete();
      
      // 3. Remove the parent conversation entry
      await db.conversations.delete(conv.id);
    }
  });

  return { purgedChannels };
}