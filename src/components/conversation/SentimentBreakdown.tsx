import type { Conversation } from "../../types/conversation";

interface SentimentBreakdownProps {
  summary?: Conversation["sentimentSummary"]; // Marked optional to align perfectly with schema rules
  messageCount: number;
}

export function SentimentBreakdown({ summary, messageCount }: SentimentBreakdownProps) {
  // Graceful fallback to prevent TS18048 if summary metadata layer is missing
  if (!summary) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm text-center">
        <p className="text-xs font-medium text-slate-400">No sentiment metrics cached for this channel.</p>
      </div>
    );
  }

  // Safe math bounds matching to protect against division by zero
  const total = messageCount || 1;
  const posPct = Math.round((summary.positiveCount / total) * 100);
  const neuPct = Math.round((summary.neutralCount / total) * 100);
  const negPct = Math.round((summary.negativeCount / total) * 100);

  const dominantColors = {
    positive: "bg-emerald-600 text-emerald-700 border-emerald-200",
    neutral: "bg-slate-500 text-slate-600 border-slate-200",
    negative: "bg-red-600 text-red-700 border-red-200",
  };

  const currentDominant = (summary.dominantSentiment || "neutral") as "positive" | "neutral" | "negative";

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="text-sm font-semibold text-slate-950">Sentiment Distribution Profile</h3>
        <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${dominantColors[currentDominant] || "bg-slate-100 text-slate-700"}`}>
          Dominant: {currentDominant}
        </span>
      </div>

      {/* Stacked Percentage Progress Bar Chart */}
      <div className="mt-5 h-4 w-full overflow-hidden rounded-full bg-slate-100 flex shadow-inner">
        <div style={{ width: `${posPct}%` }} className="bg-emerald-500 transition-all duration-500" title={`Positive: ${posPct}%`} />
        <div style={{ width: `${neuPct}%` }} className="bg-slate-300 transition-all duration-500" title={`Neutral: ${neuPct}%`} />
        <div style={{ width: `${negPct}%` }} className="bg-red-400 transition-all duration-500" title={`Negative: ${negPct}%`} />
      </div>

      {/* Grid List Statistics Blocks */}
      <div className="mt-5 grid grid-cols-3 gap-4 text-center">
        <div className="rounded-md bg-emerald-50/50 p-2.5 border border-emerald-100/50">
          <dt className="text-xs font-medium text-emerald-700">Positive</dt>
          <dd className="mt-0.5 text-lg font-bold text-slate-950 tracking-tight">{posPct}%</dd>
          <dd className="text-[10px] text-slate-400 font-medium">{summary.positiveCount} messages</dd>
        </div>
        
        <div className="rounded-md bg-slate-50 p-2.5 border border-slate-200/50">
          <dt className="text-xs font-medium text-slate-600">Neutral</dt>
          <dd className="mt-0.5 text-lg font-bold text-slate-950 tracking-tight">{neuPct}%</dd>
          <dd className="text-[10px] text-slate-400 font-medium">{summary.neutralCount} messages</dd>
        </div>

        <div className="rounded-md bg-red-50/50 p-2.5 border border-red-100/50">
          <dt className="text-xs font-medium text-red-700">Negative</dt>
          <dd className="mt-0.5 text-lg font-bold text-slate-950 tracking-tight">{negPct}%</dd>
          <dd className="text-[10px] text-slate-400 font-medium">{summary.negativeCount} messages</dd>
        </div>
      </div>

      <div className="mt-4 text-center text-[11px] text-slate-400 font-medium bg-slate-50 py-1.5 rounded border border-slate-100">
        Aggregated Score Index Weights Average: <span className="font-bold text-slate-700">{(summary.averageScore ?? 0.5).toFixed(2)}</span>
      </div>
    </div>
  );
}