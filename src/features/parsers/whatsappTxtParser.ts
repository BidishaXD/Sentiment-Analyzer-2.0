import type { Conversation } from "../../types/conversation";
import type { Message } from "../../types/message";

export interface WhatsAppParseResult {
  conversation: Conversation;
  messages: Message[];
  skippedLines: string[];
}

interface WhatsAppLineMatch {
  timestamp: string;
  body: string;
}

const PLATFORM = "whatsapp" as const;

export function parseWhatsAppTxt(
  fileText: string,
  conversationTitle = "WhatsApp Conversation",
): WhatsAppParseResult {
  const lines = fileText
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n");

  const conversationId = createStableId(`${PLATFORM}:${conversationTitle}`);
  const now = new Date().toISOString();

  const messages: Message[] = [];
  const skippedLines: string[] = [];
  const participants = new Set<string>();

  let currentMessage: Message | null = null;

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (!line.trim()) {
      continue;
    }

    const parsedLine = parseWhatsAppLine(line);

    if (!parsedLine) {
      if (currentMessage) {
        currentMessage.text = `${currentMessage.text}\n${line}`;
      } else {
        skippedLines.push(line);
      }

      continue;
    }

    if (currentMessage) {
      messages.push(currentMessage);
    }

    const { senderName, text, isSystemMessage } = parseMessageBody(
      parsedLine.body,
    );

    if (!isSystemMessage) {
      participants.add(senderName);
    }

    const timestamp = parseWhatsAppTimestamp(parsedLine.timestamp);
    const messageSeed = `${conversationId}:${parsedLine.timestamp}:${senderName}:${text}`;

    currentMessage = {
      id: createStableId(messageSeed),
      conversationId,
      platform: PLATFORM,
      senderName,
      text,
      timestamp,
      isSystemMessage,
      createdAt: now,
    };
  }

  if (currentMessage) {
    messages.push(currentMessage);
  }

  const conversation: Conversation = {
    id: conversationId,
    platform: PLATFORM,
    title: conversationTitle,
    participantNames: Array.from(participants).sort(),
    messageCount: messages.length,
    firstMessageAt: messages[0]?.timestamp,
    lastMessageAt: messages[messages.length - 1]?.timestamp,
    createdAt: now,
    updatedAt: now,
  };

  return {
    conversation,
    messages,
    skippedLines,
  };
}

function parseWhatsAppLine(line: string): WhatsAppLineMatch | null {
  const androidMatch = line.match(
    /^(\d{1,2}\/\d{1,2}\/\d{2,4},\s*\d{1,2}:\d{2}(?::\d{2})?\s*(?:AM|PM|am|pm)?)\s-\s(.+)$/,
  );

  if (androidMatch) {
    return {
      timestamp: androidMatch[1],
      body: androidMatch[2],
    };
  }

  const iosMatch = line.match(
    /^\[(\d{1,2}\/\d{1,2}\/\d{2,4},\s*\d{1,2}:\d{2}(?::\d{2})?\s*(?:AM|PM|am|pm)?)\]\s(.+)$/,
  );

  if (iosMatch) {
    return {
      timestamp: iosMatch[1],
      body: iosMatch[2],
    };
  }

  return null;
}

function parseMessageBody(body: string): {
  senderName: string;
  text: string;
  isSystemMessage: boolean;
} {
  const senderMatch = body.match(/^([^:]+):\s([\s\S]*)$/);

  if (!senderMatch) {
    return {
      senderName: "System",
      text: body.trim(),
      isSystemMessage: true,
    };
  }

  return {
    senderName: senderMatch[1].trim(),
    text: senderMatch[2].trim(),
    isSystemMessage: false,
  };
}

function parseWhatsAppTimestamp(timestamp: string): string {
  const cleaned = timestamp
    .replace(/\u202f/g, " ")
    .replace(/\u00a0/g, " ")
    .trim();

  const match = cleaned.match(
    /^(\d{1,2})\/(\d{1,2})\/(\d{2,4}),\s*(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM|am|pm)?$/,
  );

  if (!match) {
    return new Date().toISOString();
  }

  const first = Number(match[1]);
  const second = Number(match[2]);
  const yearRaw = Number(match[3]);
  let hour = Number(match[4]);
  const minute = Number(match[5]);
  const secondValue = Number(match[6] ?? 0);
  const meridiem = match[7]?.toLowerCase();

  const year = yearRaw < 100 ? 2000 + yearRaw : yearRaw;

  if (meridiem === "pm" && hour < 12) {
    hour += 12;
  }

  if (meridiem === "am" && hour === 12) {
    hour = 0;
  }

  const { day, month } = inferDayAndMonth(first, second);
  const date = new Date(year, month - 1, day, hour, minute, secondValue);

  return Number.isNaN(date.getTime())
    ? new Date().toISOString()
    : date.toISOString();
}

function inferDayAndMonth(
  first: number,
  second: number,
): { day: number; month: number } {
  if (first > 12) {
    return { day: first, month: second };
  }

  if (second > 12) {
    return { day: second, month: first };
  }

  return { day: first, month: second };
}

function createStableId(value: string): string {
  let hash = 5381;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 33) ^ value.charCodeAt(index);
  }

  return Math.abs(hash >>> 0).toString(36);
}