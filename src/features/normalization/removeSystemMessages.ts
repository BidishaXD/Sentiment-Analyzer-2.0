/**
 * Scans raw text strings and flags true if they match known system messages,
 * encryption announcements, or media fallback strings from WhatsApp/Instagram.
 */
export function isSystemMessage(text: string): boolean {
  const cleanText = text.trim();

  // Known platform baseline system strings
  const systemPatterns = [
    /^Messages and calls are end-to-end encrypted/i,
    /^Your security code with .+ changed/i,
    /^You created group/i,
    /^You joined using this group's invite link/i,
    /^.+ changed the subject to/i,
    /^.+ added .+/i,
    /^.+ left/i,
    /^<Media omitted>$/i,
    /^This message was deleted$/i,
    /^📷 Photo$/i,
    /^🎥 Video$/i,
  ];

  return systemPatterns.some((pattern) => pattern.test(cleanText));
}