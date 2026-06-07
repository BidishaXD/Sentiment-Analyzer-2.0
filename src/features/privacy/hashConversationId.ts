/**
 * Generates a deterministic, secure cryptographic string hash from raw channel titles.
 * This prevents human-readable identifiers from landing on disk in the IndexedDB primary keys.
 */
export async function hashConversationId(rawId: string): Promise<string> {
  const cleanId = rawId.trim().toLowerCase();
  
  try {
    // 1. Encode text string to Uint8Array vector bytes
    const msgUint8 = new TextEncoder().encode(cleanId);
    
    // 2. Compute SHA-256 cryptographic hash using browser WebCrypto primitives
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
    
    // 3. Convert ArrayBuffer matrix to standard hex string sequence
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
    
    return hashHex;
  } catch {
    // Fallback pseudo-hash layout matching if crypto layer is restricted by security bounds
    let hash = 0;
    for (let i = 0; i < cleanId.length; i++) {
      const char = cleanId.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0; // Convert to 32bit integer
    }
    return `fallback-${Math.abs(hash)}`;
  }
}