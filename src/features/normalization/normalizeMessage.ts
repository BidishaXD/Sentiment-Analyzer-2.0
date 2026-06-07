import { isSystemMessage } from "./removeSystemMessages";
import { normalizeSender } from "./normalizeSender";
import { normalizeTimestamp } from "./normalizeTimestamp";
import type { Message } from "../../types/message";

/**
 * Normalization Pipeline: Cleans sender tags, formats the temporal boundaries, 
 * and returns the normalized Message object, or null if it's a system notification.
 */
export function normalizeMessage(rawMessage: {
  id: string;
  conversationId: string;
  senderName: string;
  text: string;
  timestamp: string | number;
}): Message | null {
  
  // 1. Immediately drop message if it flags as an unneeded system artifact
  if (isSystemMessage(rawMessage.text)) {
    return null;
  }

  // 2. Perform deep sanitization over inner property contexts sequentially
  const cleanText = rawMessage.text.replace(/\u200E/g, "").trim(); // Strips hidden left-to-right markers
  
  // Guard clause against empty string contents after marker scrubs
  if (!cleanText) return null;

  return {
    id: rawMessage.id,
    conversationId: rawMessage.conversationId,
    senderName: normalizeSender(rawMessage.senderName),
    text: cleanText,
    timestamp: normalizeTimestamp(rawMessage.timestamp),
    // Fixes TS2741: Explicitly map the required boolean flag requested by your strict schema
    isSystemMessage: false, 
  };
}