import type { Conversation } from "../../types/conversation";
import type { Message } from "../../types/message";

export function buildConversationCsvReport(
  conversation: Conversation,
  messages: Message[],
): string {
  const headers = [
    "conversation",
    "platform",
    "sender",
    "timestamp",
    "sentiment",
    "score",
    "message",
  ];
  
  const rows = messages.map((message) => [
    String(conversation.title ?? "Untitled Conversation"),
    String(conversation.platform ?? "unknown"),
    String(message.senderName ?? "Unknown Sender"),
    String(message.timestamp ?? ""),
    String(message.sentiment?.label ?? "unknown"),
    String(message.sentiment?.score ?? ""),
    String(message.text || "Raw message text was not stored"),
  ]);

  return [headers, ...rows].map((row) => row.map(escapeCsv).join(",")).join("\n");
}

function escapeCsv(value: string): string {
  const safeValue = value.replaceAll('"', '""');
  if (safeValue.includes(",") || safeValue.includes("\n") || safeValue.includes('"')) {
    return `"${safeValue}"`;
  }
  return safeValue;
}