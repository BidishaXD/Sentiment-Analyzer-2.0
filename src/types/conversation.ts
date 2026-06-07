export interface Conversation {
  id: string; // Made strictly required to fix TS2345 & Dexie index queries
  title: string;
  platform: "whatsapp" | "instagram";
  participantNames: string[];
  messageCount: number;
  firstMessageAt?: string;
  lastMessageAt?: string;
  createdAt?: string; // Standardized for historical sorting
  updatedAt?: string;
  sentimentSummary?: {
    dominantSentiment: "positive" | "neutral" | "negative" | "unknown";
    averageScore: number;
    positiveCount: number; // Restored for structural dashboards
    neutralCount: number;
    negativeCount: number;
  };
}