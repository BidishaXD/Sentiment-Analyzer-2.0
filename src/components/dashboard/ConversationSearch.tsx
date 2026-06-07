interface ConversationSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedPlatform: string;
  onPlatformChange: (platform: string) => void;
}

export function ConversationSearch({
  searchTerm,
  onSearchChange,
  selectedPlatform,
  onPlatformChange,
}: ConversationSearchProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between mb-6">
      {/* Target Search Text Field Input */}
      <div className="relative w-full md:flex-1">
        <input
          type="text"
          placeholder="Query chat identities or participant fields..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-md border border-slate-300 bg-white pl-3 pr-10 py-2 text-sm text-slate-950 shadow-sm placeholder:text-slate-400 transition-all focus:border-slate-950 focus:outline-none focus:ring-1 focus:ring-slate-950"
        />
        <span className="absolute inset-y-0 right-3 flex items-center text-slate-400 text-sm pointer-events-none">🔍</span>
      </div>

      {/* Target Category Filter Switch Box */}
      <div className="w-full md:w-48 shrink-0">
        <select
          value={selectedPlatform}
          onChange={(e) => onPlatformChange(e.target.value)}
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 shadow-sm focus:border-slate-950 focus:outline-none focus:ring-1 focus:ring-slate-950"
        >
          <option value="all">All Source Channels</option>
          <option value="whatsapp">WhatsApp Backups</option>
          <option value="instagram">Instagram Logs</option>
        </select>
      </div>
    </div>
  );
}