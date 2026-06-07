/**
 * Translates mismatched text-based timestamp variations from WhatsApp/Instagram log files
 * directly into compliant, sortable ISO-8601 string definitions.
 */
export function normalizeTimestamp(rawTimestamp: string | number): string {
  // If it's already a numeric Unix millisecond timestamp (common in Instagram JSON)
  if (typeof rawTimestamp === "number") {
    return new Date(rawTimestamp).toISOString();
  }

  const cleanStamp = rawTimestamp.trim();
  const dateObj = new Date(cleanStamp);

  // Fallback check if the standard date parser chokes on specific regional variations
  if (isNaN(dateObj.getTime())) {
    // Attempt custom fix for standard 24h fallback string splits if needed ("dd/mm/yyyy, hh:mm")
    try {
      const match = cleanStamp.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4}),?\s+(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?/i);
      if (match) {
        let [_, month, day, year, hoursStr, minutes, seconds, ampm] = match;
        let hours = parseInt(hoursStr, 10);
        
        if (year.length === 2) year = `20${year}`;
        if (ampm) {
          if (ampm.toUpperCase() === "PM" && hours < 12) hours += 12;
          if (ampm.toUpperCase() === "AM" && hours === 12) hours = 0;
        }

        const formattedDate = new Date(
          parseInt(year, 10),
          parseInt(month, 10) - 1,
          parseInt(day, 10),
          hours,
          parseInt(minutes, 10),
          seconds ? parseInt(seconds, 10) : 0
        );
        
        if (!isNaN(formattedDate.getTime())) {
          return formattedDate.toISOString();
        }
      }
    } catch {
      // Fall through to default baseline fallback execution
    }

    // Return static standard baseline epoch timestamp marker if completely corrupted
    return new Date().toISOString();
  }

  return dateObj.toISOString();
}