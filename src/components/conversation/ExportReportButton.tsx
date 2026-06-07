import { buildConversationCsvReport } from "../../features/reports/buildCsvReport";
import { buildConversationJsonReport } from "../../features/reports/buildJsonReport";
import { downloadTextFile, safeFileName } from "../../lib/download";
import type { Conversation } from "../../types/conversation";
import type { Message } from "../../types/message";

interface ExportReportButtonProps {
  conversation: Conversation;
  messages: Message[];
}

export function ExportReportButton({
  conversation,
  messages,
}: ExportReportButtonProps) {
  function handleCsvExport() {
    const csv = buildConversationCsvReport(conversation, messages);
    const fileName = `${safeFileName(conversation.title)}-sentiment-report.csv`;
    downloadTextFile(fileName, csv, "text/csv;charset=utf-8");
  }

  function handleJsonExport() {
    const json = buildConversationJsonReport(conversation, messages);
    const fileName = `${safeFileName(conversation.title)}-sentiment-report.json`;
    downloadTextFile(fileName, json, "application/json;charset=utf-8");
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        onClick={handleCsvExport}
      >
        Export CSV
      </button>
      <button
        type="button"
        className="rounded-md bg-slate-950 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
        onClick={handleJsonExport}
      >
        Export JSON
      </button>
    </div>
  );
}