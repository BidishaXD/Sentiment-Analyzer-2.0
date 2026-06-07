import type { Conversation } from "../../types/conversation";

interface SentimentTimelineProps {
  conversations: Conversation[];
}

export function SentimentTimeline({ conversations }: SentimentTimelineProps) {
  // Sort conversations chronologically by first message timestamp
  const sortedChannels = [...conversations].sort((a, b) => {
    const tA = a.firstMessageAt ? new Date(a.firstMessageAt).getTime() : 0;
    const tB = b.firstMessageAt ? new Date(b.firstMessageAt).getTime() : 0;
    return tA - tB;
  });

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm mb-6">
      <div className="border-b border-slate-100 pb-3">
        <h3 className="text-sm font-semibold text-slate-950">Chronological Channel Progression</h3>
        <p className="text-xs text-slate-400 mt-0.5">Scans historic index milestones across your loaded channels.</p>
      </div>

      <div className="mt-6 overflow-x-auto">
        {sortedChannels.length === 0 ? (
          <div className="py-8 text-center text-xs font-medium text-slate-400">
            No temporal channel profiles mapped.
          </div>
        ) : (
          <div className="min-w-[640px] px-2 py-4 flex flex-col gap-4 relative before:absolute before:left-32 before:top-0 before:bottom-0 before:w-0.5 before:bg-slate-100">
            {sortedChannels.map((channel) => {
              const score = channel.sentimentSummary?.averageScore ?? 0.5;
              const dateLabel = channel.firstMessageAt 
                ? new Date(channel.firstMessageAt).toLocaleDateString([], { month: "short", day: "numeric" }) 
                : "N/A";

              // Map numeric weights to layout coloring variants
              const scoreColor = score >= 0.6 
                ? "bg-emerald-500 text-emerald-700" 
                : score <= 0.4 
                  ? "bg-red-400 text-red-700" 
                  : "bg-slate-300 text-slate-600";

              return (
                <div key={channel.id} className="flex items-center gap-6 group relative">
                  {/* Left Side: Mapped Timestamp Label Block */}
                  <div className="w-24 text-right text-xs font-mono font-bold text-slate-400 tabular-nums">
                    {dateLabel}
                  </div>

                  {/* Bullet Node Intersection Element */}
                  <div className="w-4 h-4 rounded-full bg-white border-2 border-slate-300 group-hover:border-slate-950 transition-colors z-10 shrink-0" />

                  {/* Right Side: Data Metrics Node Detail Block */}
                  <div className="flex-1 bg-slate-50 p-3 rounded border border-slate-100/80 flex items-center justify-between transition-all group-hover:bg-slate-100/50">
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-slate-800 tracking-tight">{channel.title}</p>
                      <p className="text-[10px] text-slate-400 font-medium">
                        {(channel.messageCount ?? 0).toLocaleString()} text blocks • {channel.participantNames.length} participants
                      </p>
                    </div>

                    <div className={`text-xs font-mono font-bold px-2 py-0.5 rounded tracking-tighter shadow-sm ${scoreColor}`}>
                      Idx: {score.toFixed(2)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}