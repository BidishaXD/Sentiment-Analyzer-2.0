import { SentimentBadge } from "./SentimentBadge";
import type { Message } from "../../types/message";

interface MessageSentimentListProps {
  messages: Message[];
}

export function MessageSentimentList({ messages }: MessageSentimentListProps) {
  if (messages.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
        <p className="text-sm text-slate-500">No messages found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-lg font-semibold text-slate-950">
          Message Sentiment
        </h2>
      </div>

      <div className="max-h-[560px] divide-y divide-slate-100 overflow-y-auto">
        {messages.map((message) => (
          <div key={message.id} className="grid gap-3 px-5 py-4 sm:grid-cols-[1fr_auto]">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-medium text-slate-950">
                  {message.senderName}
                </p>
                <p className="text-xs text-slate-500">
                  {formatDate(message.timestamp)}
                </p>
              </div>

              <p className="mt-2 text-sm text-slate-700">
                {message.text.trim() || "Raw message text was not stored."}
              </p>
            </div>

            <div className="sm:text-right">
              <SentimentBadge label={message.sentiment?.label ?? "unknown"} />
              {message.sentiment ? (
                <p className="mt-2 text-xs text-slate-500">
                  Score {(message.sentiment.score * 100).toFixed(0)}%
                </p>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "N/A" : date.toLocaleString();
}