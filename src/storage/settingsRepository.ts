import type { AppSettings } from "./schema";
import { db } from "./db";

function createDefaultSettings(): AppSettings {
  const now = new Date().toISOString();

  return {
    id: "default",
    storeRawMessages: false,
    autoDeleteImportedFiles: true,
    createdAt: now,
    updatedAt: now,
  };
}

export async function getSettings(): Promise<AppSettings | undefined> {
  return db.settings.get("default");
}

export async function ensureSettings(): Promise<AppSettings> {
  const existingSettings = await getSettings();

  if (existingSettings) {
    return existingSettings;
  }

  const defaultSettings = createDefaultSettings();
  await db.settings.put(defaultSettings);

  return defaultSettings;
}

export async function updateSettings(
  updates: Partial<Omit<AppSettings, "id" | "createdAt">>,
): Promise<AppSettings> {
  const currentSettings = await ensureSettings();

  const nextSettings: AppSettings = {
    ...currentSettings,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  await db.settings.put(nextSettings);
  return nextSettings;
}