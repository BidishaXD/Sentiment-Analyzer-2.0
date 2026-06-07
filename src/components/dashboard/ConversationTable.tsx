import type { ReactNode } from "react";
import { SentimentBadge } from "../conversation/SentimentBadge";
import type { Conversation } from "../../types/conversation";

interface ConversationTableProps {
  conversations: Conversation[];
  onOpenConversation: (conversationId: string) => void;
}

export function ConversationTable({
  conversations,
  onOpenConversation,
}: ConversationTableProps) {
  if (conversations.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
        <h2 className="text-lg font-semibold text-slate-950">
          No conversations imported yet
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Import a WhatsApp export file to see conversation insights here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <TableHead>Conversation</TableHead>
            <TableHead>Platform</TableHead>
            <TableHead>Participants</TableHead>
            <TableHead>Messages</TableHead>
            <TableHead>Sentiment</TableHead>
            <TableHead>Last Message</TableHead>
            <TableHead>Action</TableHead>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-200">
          {conversations.map((conversation) => (
            <tr key={conversation.id}>
              <TableCell>
                <span className="font-medium text-slate-950">
                  {conversation.title}
                </span>
              </TableCell>
              <TableCell>{capitalize(conversation.platform)}</TableCell>
              <TableCell>
                {conversation.participantNames.length > 0
                  ? conversation.participantNames.join(", ")
                  : "N/A"}
              </TableCell>
              <TableCell>{conversation.messageCount.toLocaleString()}</TableCell>
              <TableCell>
                <SentimentBadge
                  label={conversation.sentimentSummary?.dominantSentiment ?? "unknown"}
                />
              </TableCell>
              <TableCell>{formatDate(conversation.lastMessageAt)}</TableCell>
              <TableCell>
                <button
                  type="button"
                  className="rounded-md bg-slate-950 px-3 py-2 text-sm font-medium text-white"
                  onClick={() => onOpenConversation(conversation.id || "")}
                >
                  Open
                </button>
              </TableCell>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TableHead({ children }: { children: ReactNode }) {
  return (
    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
      {children}
    </th>
  );
}

function TableCell({ children }: { children: ReactNode }) {
  return <td className="px-4 py-4 text-sm text-slate-700">{children}</td>;
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatDate(value?: string): string {
  if (!value) return "N/A";

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "N/A" : date.toLocaleString();
}