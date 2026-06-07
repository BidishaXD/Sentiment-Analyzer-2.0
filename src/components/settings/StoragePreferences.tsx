import { useSettings } from "../../hooks/useSettings";

export function StoragePreferences() {
  const { settings, isLoading, saveSettings } = useSettings();

  if (isLoading || !settings) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500 animate-pulse">Loading preferences...</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="border-b border-slate-100 pb-3">
        <h2 className="text-lg font-semibold text-slate-950">Storage Preferences</h2>
        <p className="mt-1 text-sm text-slate-500">
          Control how conversation data archives are handled inside your local browser sandbox.
        </p>
      </div>

      <div className="mt-5 space-y-5">
        {/* Preference 1: Store Raw Messages Toggle */}
        <label className="flex items-start justify-between gap-6 cursor-pointer group">
          <span className="max-w-xl">
            <span className="block text-sm font-medium text-slate-950 group-hover:text-slate-800">
              Store raw message text
            </span>
            <span className="mt-1 block text-xs text-slate-500 leading-relaxed">
              When enabled, full message text is written to IndexedDB for viewing within chat details. 
              When disabled, only metadata, timestamps, and generated sentiment metrics are saved.
            </span>
          </span>
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-slate-300 text-slate-950 focus:ring-slate-950 accent-slate-950 mt-1 cursor-pointer"
            checked={settings.storeRawMessages}
            onChange={(event) =>
              saveSettings({ storeRawMessages: event.target.checked })
            }
          />
        </label>

        <hr className="border-slate-100" />

        {/* Preference 2: Auto-delete Files Toggle */}
        <label className="flex items-start justify-between gap-6 cursor-pointer group">
          <span className="max-w-xl">
            <span className="block text-sm font-medium text-slate-950 group-hover:text-slate-800">
              Auto-delete imported files after analysis
            </span>
            <span className="mt-1 block text-xs text-slate-500 leading-relaxed">
              Automatically clear browser memory buffers once structural indexing finishes. 
              The application executes entirely locally and never uploads data logs to external clouds.
            </span>
          </span>
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-slate-300 text-slate-950 focus:ring-slate-950 accent-slate-950 mt-1 cursor-pointer"
            checked={settings.autoDeleteImportedFiles}
            onChange={(event) =>
              saveSettings({
                autoDeleteImportedFiles: event.target.checked,
              })
            }
          />
        </label>
      </div>
    </div>
  );
}