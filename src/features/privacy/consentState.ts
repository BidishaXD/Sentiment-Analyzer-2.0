const CONSENT_STORAGE_KEY = "sentiment_analyzer_user_consent";

interface UserConsentState {
  hasGrantedConsent: boolean;
  timestamp: string | null;
  version: string;
}

/**
 * Retrieves the local device user diagnostic permission metadata matrix.
 */
export function getConsentState(): UserConsentState {
  try {
    const rawData = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (rawData) {
      return JSON.parse(rawData);
    }
  } catch (err) {
    console.error("Failed to read consent parameters from LocalStorage space:", err);
  }

  return {
    hasGrantedConsent: false,
    timestamp: null,
    version: "2.0.0"
  };
}

/**
 * Commits fresh diagnostic user permissions directly down to LocalStorage layers.
 */
export function saveConsentState(granted: boolean): void {
  const newState: UserConsentState = {
    hasGrantedConsent: granted,
    timestamp: granted ? new Date().toISOString() : null,
    version: "2.0.0"
  };

  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(newState));
  } catch (err) {
    console.error("Failed to write consent matrix state payload to disk:", err);
  }
}