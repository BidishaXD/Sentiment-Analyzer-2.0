interface PlatformSelectorProps {
  selectedPlatform: "whatsapp" | "instagram";
  onPlatformChange: (platform: "whatsapp" | "instagram") => void;
  disabled?: boolean;
}

export function PlatformSelector({
  selectedPlatform,
  onPlatformChange,
  disabled = false,
}: PlatformSelectorProps) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-slate-700">
        Select Platform Source
      </label>
      <p className="text-xs text-slate-500 mt-0.5">
        Choose the application source layout matching your raw export file.
      </p>
      
      <div className="mt-3 flex gap-3">
        <button
          type="button"
          disabled={disabled}
          className={`flex-1 rounded-md py-2.5 px-4 text-sm font-medium border transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
            selectedPlatform === "whatsapp"
              ? "bg-slate-950 text-white border-slate-950 shadow-sm"
              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
          }`}
          onClick={() => onPlatformChange("whatsapp")}
        >
          WhatsApp (.txt)
        </button>
        
        <button
          type="button"
          disabled={disabled}
          className={`flex-1 rounded-md py-2.5 px-4 text-sm font-medium border transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
            selectedPlatform === "instagram"
              ? "bg-slate-950 text-white border-slate-950 shadow-sm"
              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
          }`}
          onClick={() => onPlatformChange("instagram")}
        >
          Instagram (.json)
        </button>
      </div>
    </div>
  );
}