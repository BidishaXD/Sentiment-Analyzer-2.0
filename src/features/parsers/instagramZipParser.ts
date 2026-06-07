import { unzipSync, strFromU8 } from "fflate";
import { parseInstagramJson } from "./instagramJsonParser";
import type { Message } from "../../types/message";

/**
 * Accepts a raw binary file stream ArrayBuffer from an Instagram zip dump, 
 * extracts the core JSON chat logs, and maps them to normalized tracking rows.
 */
export async function parseInstagramZip(fileBuffer: ArrayBuffer, conversationId: string): Promise<Message[]> {
  // Convert ArrayBuffer context down to a clean Uint8Array vector for fflate consumption
  const zipUint8Array = new Uint8Array(fileBuffer);
  
  let unzippedFiles: Record<string, Uint8Array>;
  try {
    unzippedFiles = unzipSync(zipUint8Array);
  } catch (err) {
    throw new Error("Failed to decompress archive. Ensure the .zip payload is uncorrupted.");
  }

  // Look for the standard single-chat message descriptor log inside Instagram's export tree structure
  // Typically structured as: your_activity/messages/inbox/chat_name/message_1.json
  const jsonFileKey = Object.keys(unzippedFiles).find(
    (filePath) => filePath.endsWith("message_1.json") || filePath.includes("messages.json")
  );

  if (!jsonFileKey) {
    throw new Error("Could not detect a valid 'message_1.json' chat log stream entry inside the archive file.");
  }

  // Decompress the target file bytes array straight into a clean text string layout
  const rawJsonBytes = unzippedFiles[jsonFileKey];
  const decompressedJsonText = strFromU8(rawJsonBytes);

  // Route the clean text chunk string cleanly straight down to our JSON engine parser module
  return parseInstagramJson(decompressedJsonText, conversationId);
}