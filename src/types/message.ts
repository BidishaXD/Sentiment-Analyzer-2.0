// Added string declaration aliases so parsing lookups don't crash components
export type MessagePlatform = "whatsapp" | "instagram";

export interface MessageSentiment {
  label: "positive" | "neutral" | "negative";
  score: number;
}

export interface Message {
  id: string; // Required for key index loops
  conversationId: string;
  senderName: string;
  timestamp: string;
  text: string;
  isSystemMessage: boolean;
  platform?: "whatsapp" | "instagram"; // Optional structural tag for parsing lookups
  sentiment?: MessageSentiment;
}