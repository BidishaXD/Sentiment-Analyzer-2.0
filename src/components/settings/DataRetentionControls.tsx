import { useSettings } from "../../hooks/useSettings";

export function DataRetentionControls() {
  const { settings, isLoading, saveSettings } = useSettings();

  if (isLoading || !settings) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500 animate-pulse">Loading retention protocols...</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="border-b border-slate-100 pb-3">
        <h2 className="text-lg font-semibold text-slate-950">Data Retention & Lifespan</h2>
        <p className="mt-1 text-sm text-slate-500">
          Configure how long historical metrics persist inside the localized relational storage block.
        </p>
      </div>

      <div className="mt-5 space-y-5">
        {/* Retention Option: Auto-Delete Buffers */}
        <div className="flex items-start justify-between gap-6">
          <div className="max-w-xl">
            <span className="block text-sm font-medium text-slate-950">
              Aggressive Volatile Buffer Flushing
            </span>
            <span className="mt-1 block text-xs text-slate-500 leading-relaxed">
              Forces garbage collection execution on internal raw string text buffers immediately 
              following calculation runs. Minimizes browser RAM spikes during massive file uploads.
            </span>
          </div>
          <div className="flex h-5 items-center">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-slate-950 focus:ring-slate-950 accent-slate-950 cursor-pointer"
              checked={settings.autoDeleteImportedFiles}
              onChange={(e) => saveSettings({ autoDeleteImportedFiles: e.target.checked })}
            />
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* Dropdown Selection Mockup: Auto-Purge Interval */}
        <div>
          <label className="block text-sm font-medium text-slate-950">
            Database Auto-Purge Cycle
          </label>
          <p className="mt-0.5 text-xs text-slate-500">
            Automatically drop conversation nodes older than a configured threshold limit.
          </p>
          <select 
            disabled
            className="mt-2.5 block w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs text-slate-600 cursor-not-allowed focus:border-slate-950 focus:outline-none"
            defaultValue="indefinite"
          >
            <option value="indefinite">Keep Indefinitely (Manual Maintenance Only)</option>
            <option value="30days">Purge Automatically After 30 Days</option>
            <option value="90days">Purge Automatically After 90 Days</option>
          </select>
        </div>
      </div>
    </div>
  );
}