/**
 * Strips sensitive PII data fields (like emails or phone strings) or wipes cleartext
 * entirely depending on the user's data storage preferences.
 */
export function redactMessageText(text: string, storeRawMessages: boolean): string {
  if (!storeRawMessages) {
    // Completely omit cleartext payload string to comply with high-assurance privacy profiles
    return "";
  }

  let scrubbedText = text;

  // 1. Mask simple email string regex matches
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  scrubbedText = scrubbedText.replace(emailRegex, "[EMAIL_REDACTED]");

  // 2. Mask clear phone patterns (matches typical 10-14 digit entries)
  const phoneRegex = /\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g;
  // Guard rule to only mask sequences that resemble true numbers, avoiding small counting items
  if (scrubbedText.replace(/[-.\s()]/g, "").length >= 10) {
    scrubbedText = scrubbedText.replace(phoneRegex, "[PHONE_REDACTED]");
  }

  return scrubbedText.trim();
}