import { useEffect, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import type { AppSettings } from "../storage/schema";
import { db } from "../storage/db";
import { ensureSettings, updateSettings } from "../storage/settingsRepository";

export function useSettings() {
  const [isInitializing, setIsInitializing] = useState(true);

  const settings = useLiveQuery(() => db.settings.get("default"), []);

  useEffect(() => {
    let cancelled = false;

    ensureSettings().finally(() => {
      if (!cancelled) {
        setIsInitializing(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  async function saveSettings(
    updates: Partial<Omit<AppSettings, "id" | "createdAt">>,
  ) {
    return updateSettings(updates);
  }

  return {
    settings,
    isLoading: isInitializing || !settings,
    saveSettings,
  };
}