/**
 * Cleans up user identities, stripping out trailing phone symbols, country codes, 
 * or quotation markers to provide crisp display tokens.
 */
export function normalizeSender(rawName: string): string {
  let name = rawName.trim();

  if (!name) return "Unknown Participant";

  // 1. Strip out wrapped phone markers if WhatsApp format fell back to string numbers
  // e.g., "+91 98765 43210" or "+1 (555) 019-2834" -> "9876543210"
  if (/^\+?[\d\s\-()]+$/.test(name)) {
    name = name.replace(/[\s\-()]/g, ""); // strip spacing/brackets
  }

  // 2. Clear out surrounding string quotes if any JSON parser artifact left them attached
  name = name.replace(/^["']|["']$/g, "");

  return name || "Unknown Participant";
}