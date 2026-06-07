import { useSettings } from "../../hooks/useSettings";

export function PrivacyControls() {
  const { settings, isLoading, saveSettings } = useSettings();

  if (isLoading || !settings) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500 animate-pulse">Loading privacy systems...</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="border-b border-slate-100 pb-3">
        <h2 className="text-lg font-semibold text-slate-950">Security & Cryptography Controls</h2>
        <p className="mt-1 text-sm text-slate-500">
          Enforce localized sandbox safety thresholds on incoming analytical data layers.
        </p>
      </div>

      <div className="mt-5 space-y-5">
        {/* Toggle Option: Strict Local Anonymization */}
        <div className="flex items-start justify-between gap-6 group">
          <div className="max-w-xl">
            <span className="block text-sm font-medium text-slate-950">
              Anonymize Participant Identity Tokens
            </span>
            <span className="mt-1 block text-xs text-slate-500 leading-relaxed">
              Dynamically maps actual sender names to randomized hashes (e.g., User_A, User_B) 
              during raw parsing to ensure maximum profiling safety inside report models.
            </span>
          </div>
          <div className="flex h-5 items-center">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-slate-950 focus:ring-slate-950 accent-slate-950 cursor-pointer"
              checked={!settings.storeRawMessages} // Utilizing structural state inversion logic safely
              onChange={(e) => saveSettings({ storeRawMessages: !e.target.checked })}
            />
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* Informational Box: Local Execution Assurance */}
        <div className="rounded-md bg-slate-50 p-4 border border-slate-200/60">
          <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
            Zero-Trust Architectural Context
          </h4>
          <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
            All text evaluation passes use deterministic rule-sets executed straight within your 
            browser tab instance. No outbound API vectors, telemetry trackers, or external cloud LLM wrappers 
            are instantiated by this environment.
          </p>
        </div>
      </div>
    </div>
  );
}