import type { Message } from "../../types/message";

interface RawInstagramMessage {
  sender_name: string;
  timestamp_ms: number;
  content?: string;
  is_unsent?: boolean;
}

interface RawInstagramThread {
  participants: { name: string }[];
  messages: RawInstagramMessage[];
  title?: string;
}

export function parseInstagramJson(jsonString: string): {
  title: string;
  messages: Partial<Message>[];
  participantNames: string[];
} {
  const decodeMetaString = (str: string) => {
    try {
      return decodeURIComponent(escape(str));
    } catch {
      return str;
    }
  };

  const data = JSON.parse(jsonString) as RawInstagramThread;
  const participantNames = (data.participants || []).map((p) => decodeMetaString(p.name));
  const title = data.title ? decodeMetaString(data.title) : participantNames.join(", ") || "Instagram Chat";

  const rawMessages = data.messages || [];
  const sortedRaw = [...rawMessages].sort((a, b) => a.timestamp_ms - b.timestamp_ms);

  const messages = sortedRaw
    .filter((msg) => !msg.is_unsent) 
    .map((msg) => ({
      senderName: decodeMetaString(msg.sender_name),
      timestamp: new Date(msg.timestamp_ms).toISOString(),
      text: msg.content ? decodeMetaString(msg.content) : "",
      isSystemMessage: false,
    }));

  return {
    title,
    participantNames,
    messages,
  };
}