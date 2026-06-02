export type SentimentLabel = "positive" | "neutral" | "negative";

export interface SentimentResult {
  label: SentimentLabel;
  score: number;
  positive: number;
  neutral: number;
  negative: number;
  analyzedAt: string;
}

export interface SentimentSummary {
  positiveCount: number;
  neutralCount: number;
  negativeCount: number;
  totalAnalyzed: number;
  averageScore: number;
  dominantSentiment: SentimentLabel;
}