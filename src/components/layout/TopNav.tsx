type Page = "import" | "dashboard" | "settings";

interface TopNavProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
}

export function TopNav({ currentPage, onPageChange }: TopNavProps) {
  return (
    <nav className="border-b border-slate-200 bg-white px-6 py-3 sticky top-0 z-50 shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        {/* Core Identity */}
        <div className="flex items-center gap-2">
          <span className="text-xl">📊</span>
          <span className="text-sm font-semibold text-slate-950 tracking-tight">
            Sentiment Analyzer 2.0
          </span>
        </div>

        {/* Dynamic Nav Tabs */}
        <div className="flex gap-1.5">
          <button
            type="button"
            className={getNavClass(currentPage === "import")}
            onClick={() => onPageChange("import")}
          >
            Import
          </button>
          <button
            type="button"
            className={getNavClass(currentPage === "dashboard" || currentPage === "conversation" as any)}
            onClick={() => onPageChange("dashboard")}
          >
            Dashboard
          </button>
          <button
            type="button"
            className={getNavClass(currentPage === "settings")}
            onClick={() => onPageChange("settings")}
          >
            Settings
          </button>
        </div>
      </div>
    </nav>
  );
}

function getNavClass(isActive: boolean): string {
  return isActive
    ? "rounded-md bg-slate-950 px-3 py-1.5 text-sm font-medium text-white transition-all shadow-sm"
    : "rounded-md px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all";
}