import { useState, useMemo } from "react";
import type { Message } from "../../types/message";

interface MessageSampleListProps {
  messages: Message[];
}

export function MessageSampleList({ messages }: MessageSampleListProps) {
  const [searchFilter, setSearchFilter] = useState("");

  const filteredMessages = useMemo(() => {
    if (!searchFilter.trim()) return messages;
    const cleanTerm = searchFilter.toLowerCase();
    return messages.filter(
      (m) =>
        m.text.toLowerCase().includes(cleanTerm) ||
        m.senderName.toLowerCase().includes(cleanTerm),
    );
  }, [messages, searchFilter]);

  const sentimentStyleMap = {
    positive: "border-l-4 border-l-emerald-500 bg-emerald-50/20",
    negative: "border-l-4 border-l-red-400 bg-red-50/20",
    neutral: "border-l-4 border-l-slate-300",
  };

  const badgeStyleMap = {
    positive: "bg-emerald-50 text-emerald-700 border-emerald-100",
    negative: "bg-red-50 text-red-700 border-red-100",
    neutral: "bg-slate-50 text-slate-500 border-slate-200",
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm flex flex-col h-[520px]">
      <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-950">Granular Message Stream</h3>
          <p className="text-xs text-slate-400">Search logs and review targeted metric markers.</p>
        </div>

        {/* Local Inline Fast Search Filter */}
        <input
          type="text"
          placeholder="Filter text or names..."
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-950 shadow-sm focus:border-slate-950 focus:outline-none focus:ring-1 focus:ring-slate-950 sm:w-56"
        />
      </div>

      {/* Dynamic List Container Node */}
      <div className="mt-4 flex-1 overflow-y-auto space-y-2.5 pr-1">
        {filteredMessages.length === 0 ? (
          <div className="text-center py-12 text-xs font-medium text-slate-400">
            No matching indexed message rows detected.
          </div>
        ) : (
          filteredMessages.map((msg) => {
            const sentimentLabel = msg.sentiment?.label || "neutral";
            const scoreVal = msg.sentiment?.score ?? 0.5;

            return (
              <div key={msg.id} className={`p-3 rounded border border-slate-150 transition-all hover:bg-slate-50/50 flex flex-col gap-1.5 ${sentimentStyleMap[sentimentLabel as "positive" | "negative" | "neutral"]}`}>
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800">{msg.senderName}</span>
                    <span className="text-slate-400 font-mono">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  
                  <span className={`rounded border px-1.5 py-0.5 text-[9px] font-bold tracking-tight uppercase ${badgeStyleMap[sentimentLabel as "positive" | "negative" | "neutral"]}`}>
                    {sentimentLabel} ({scoreVal.toFixed(1)})
                  </span>
                </div>

                <p className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed tracking-tight">
                  {msg.text || <span className="italic text-slate-300 font-light">[Raw Text Stripped out by Data Privacy Rules]</span>}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}