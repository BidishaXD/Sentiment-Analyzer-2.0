import type { SentimentLabel } from "../../types/sentiment";

export const SENTIMENT_LABELS: Record<SentimentLabel, string> = {
  positive: "Positive",
  neutral: "Neutral",
  negative: "Negative",
};

export const SENTIMENT_COLORS: Record<SentimentLabel, string> = {
  positive: "text-emerald-700 bg-emerald-50 border-emerald-200",
  neutral: "text-slate-700 bg-slate-50 border-slate-200",
  negative: "text-red-700 bg-red-50 border-red-200",
};