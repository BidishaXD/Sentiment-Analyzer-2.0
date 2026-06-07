interface ConsentPanelProps {
  hasConsent: boolean;
  onConsentChange: (consent: boolean) => void;
  storeRawMessages: boolean;
  onStoreRawChange: (storeRaw: boolean) => void;
  disabled?: boolean;
}

export function ConsentPanel({
  hasConsent,
  onConsentChange,
  storeRawMessages,
  onStoreRawChange,
  disabled = false,
}: ConsentPanelProps) {
  return (
    <div className="w-full space-y-4 border-t border-slate-100 pt-4">
      {/* Target Item 1: Legal Consent Drop Check */}
      <label className="flex items-start gap-3 text-sm cursor-pointer select-none group">
        <input
          type="checkbox"
          disabled={disabled}
          className="h-4 w-4 rounded border-slate-300 text-slate-950 focus:ring-slate-950 accent-slate-950 mt-0.5 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          checked={hasConsent}
          onChange={(e) => onConsentChange(e.target.checked)}
        />
        <span className="text-slate-600 group-hover:text-slate-900 transition-colors disabled:opacity-50">
          I verify that I hold explicit authorization and administrative permission to analyze the textual information inside this chat stream.
        </span>
      </label>

      {/* Target Item 2: Staging Storage Options Switch */}
      <label className="flex items-start gap-3 text-sm cursor-pointer select-none group">
        <input
          type="checkbox"
          disabled={disabled}
          className="h-4 w-4 rounded border-slate-300 text-slate-950 focus:ring-slate-950 accent-slate-950 mt-0.5 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          checked={storeRawMessages}
          onChange={(e) => onStoreRawChange(e.target.checked)}
        />
        <span className="text-slate-600 group-hover:text-slate-900 transition-colors disabled:opacity-50">
          Commit complete message body text strings into browser IndexedDB storage nodes. 
          <span className="block mt-0.5 text-xs text-slate-400">
            If left unchecked, text data is wiped immediately post-calculation, saving only diagnostic scoring hashes.
          </span>
        </span>
      </label>
    </div>
  );
}