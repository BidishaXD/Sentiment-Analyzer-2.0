import type { Conversation } from "../../types/conversation";

interface ConversationSummaryProps {
  conversation: Conversation;
}

export function ConversationSummary({ conversation }: ConversationSummaryProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="border-b border-slate-100 pb-3">
        <h3 className="text-sm font-semibold text-slate-950">Channel Profile Context</h3>
        <p className="text-xs text-slate-400 font-mono tracking-tight mt-0.5">ID: {conversation.id}</p>
      </div>

      <dl className="mt-4 space-y-3 text-xs">
        <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
          <dt className="font-medium text-slate-500">Source Platform</dt>
          <dd className="font-semibold text-slate-950 uppercase tracking-wide bg-slate-100 px-2 py-0.5 rounded text-[10px]">
            {conversation.platform}
          </dd>
        </div>

        <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
          <dt className="font-medium text-slate-500">Total Indexed Message Nodes</dt>
          <dd className="font-bold text-slate-950 tracking-tight text-sm">
            {(conversation.messageCount ?? 0).toLocaleString()}
          </dd>
        </div>

        <div className="flex flex-col gap-1 py-1.5 border-b border-slate-50">
          <dt className="font-medium text-slate-500">Unique Chat Participants</dt>
          <dd className="mt-1 flex flex-wrap gap-1.5">
            {conversation.participantNames.map((name) => (
              <span key={name} className="inline-block rounded bg-slate-50 border border-slate-200 px-2 py-0.5 font-medium text-slate-700 text-[11px]">
                👤 {name}
              </span>
            ))}
          </dd>
        </div>

        <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
          <dt className="font-medium text-slate-500">First Capture Entry</dt>
          <dd className="font-semibold text-slate-700">{formatDate(conversation.firstMessageAt)}</dd>
        </div>

        <div className="flex items-center justify-between py-1.5">
          <dt className="font-medium text-slate-500">Terminal Capture Entry</dt>
          <dd className="font-semibold text-slate-700">{formatDate(conversation.lastMessageAt)}</dd>
        </div>
      </dl>
    </div>
  );
}

function formatDate(timestamp?: string): string {
  if (!timestamp) return "N/A";
  const dateObj = new Date(timestamp);
  return isNaN(dateObj.getTime()) ? "N/A" : dateObj.toLocaleString();
}