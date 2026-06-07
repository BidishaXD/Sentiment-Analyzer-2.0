import type { SentimentLabel } from "../../types/sentiment";

interface SentimentBadgeProps {
  label: SentimentLabel | "unknown";
}

const BADGE_CLASSES: Record<SentimentLabel | "unknown", string> = {
  positive: "border-emerald-200 bg-emerald-50 text-emerald-700",
  neutral: "border-slate-200 bg-slate-50 text-slate-700",
  negative: "border-red-200 bg-red-50 text-red-700",
  unknown: "border-slate-200 bg-white text-slate-500",
};

export function SentimentBadge({ label }: SentimentBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${BADGE_CLASSES[label]}`}
    >
      {label}
    </span>
  );
}