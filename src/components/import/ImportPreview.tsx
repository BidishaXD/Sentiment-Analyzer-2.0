// Explicitly referencing our core layout types directly to prevent TS compiler errors
import type { ImportResult } from "../../features/import/importTypes";

interface ImportPreviewProps {
  result: ImportResult | null;
}

export function ImportPreview({ result }: ImportPreviewProps) {
  if (!result) return null;

  const preview = result.preview;

  return (
    <div className="w-full rounded-lg border border-slate-200 bg-white p-6 shadow-sm animate-fade-in">
      <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-950">
          Analysis Metadata Summary
        </h3>
        <span className="rounded bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 border border-emerald-100">
          Ready for View
        </span>
      </div>

      <dl className="mt-4 grid gap-x-4 gap-y-3 text-sm sm:grid-cols-2">
        <MetadataItem label="Conversation Context Identity" value={preview.conversationTitle} />
        <MetadataItem label="Platform Interface Node" value={preview.platform.label} />
        <MetadataItem label="Computed Text Messages Matrix" value={preview.messageCount.toLocaleString()} />
        <MetadataItem label="Tracked Unique Communicators" value={preview.participantCount.toString()} />
        <MetadataItem label="Initial Log Array Entry" value={formatDate(preview.firstMessageAt)} />
        <MetadataItem label="Terminal Log Array Entry" value={formatDate(preview.lastMessageAt)} />
      </dl>
    </div>
  );
}

function MetadataItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
      <dt className="text-slate-500 text-xs font-medium">{label}</dt>
      <dd className="font-semibold text-slate-950 mt-0.5 tracking-tight">{value}</dd>
    </div>
  );
}

function formatDate(timestamp?: string): string {
  if (!timestamp) return "N/A";
  const d = new Date(timestamp);
  return isNaN(d.getTime()) ? "N/A" : d.toLocaleString();
}