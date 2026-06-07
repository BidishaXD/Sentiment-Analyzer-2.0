import { normalizeMessage } from "../normalization/normalizeMessage";
import type { Message } from "../../types/message";

interface InstagramJsonStructure {
  participants?: { name: string }[];
  messages?: {
    sender_name: string;
    timestamp_ms: number;
    content?: string;
    type?: string;
  }[];
}

/**
 * Parses raw Instagram JSON conversation strings and transforms them 
 * into clean, typed, and normalized Message schemas.
 */
export function parseInstagramJson(rawJson: string, conversationId: string): Message[] {
  if (!rawJson.trim()) {
    throw new Error("Instagram JSON file payload is completely empty.");
  }

  const parsedData: InstagramJsonStructure = JSON.parse(rawJson);
  
  if (!parsedData.messages || !Array.isArray(parsedData.messages)) {
    throw new Error("Invalid structure: Target JSON missing expected 'messages' tracking array.");
  }

  const normalizedCollection: Message[] = [];

  // Instagram indexes messages backwards (newest first). Let's reverse to restore chronological order.
  const chronologicalMessages = [...parsedData.messages].reverse();

  chronologicalMessages.forEach((rawMsg, index) => {
    // Drop records that don't contain pure text contents (like shared posts, story reactions, or calls)
    if (!rawMsg.content || rawMsg.type === "Call") return;

    // Fix Instagram's explicit ISO-8859-1 decoding bug to render native UTF-8 strings correctly (e.g. emojis/accents)
    let correctText = "";
    try {
      correctText = decodeURIComponent(escape(rawMsg.content));
    } catch {
      correctText = rawMsg.content; // Fallback if string manipulation exceptions trigger
    }

    let correctSender = "";
    try {
      correctSender = decodeURIComponent(escape(rawMsg.sender_name));
    } catch {
      correctSender = rawMsg.sender_name;
    }

    // Run the row straight through our comprehensive normalization loop core
    const cleanMessage = normalizeMessage({
      id: `ig-${conversationId}-${index}-${rawMsg.timestamp_ms}`,
      conversationId,
      senderName: correctSender,
      text: correctText,
      timestamp: rawMsg.timestamp_ms, // Passes Unix milliseconds directly
    });

    if (cleanMessage) {
      normalizedCollection.push(cleanMessage);
    }
  });

  return normalizedCollection;
}