interface DateRangeFilterProps {
  startDate: string;
  onStartDateChange: (date: string) => void;
  endDate: string;
  onEndDateChange: (date: string) => void;
  onReset: () => void;
}

export function DateRangeFilter({
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  onReset,
}: DateRangeFilterProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-700">
        <div className="flex items-center gap-2">
          <span>From:</span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="rounded-md border border-slate-300 px-2.5 py-1.5 font-sans focus:border-slate-950 focus:outline-none focus:ring-1 focus:ring-slate-950 text-slate-950 bg-white shadow-sm"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <span>To:</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="rounded-md border border-slate-300 px-2.5 py-1.5 font-sans focus:border-slate-950 focus:outline-none focus:ring-1 focus:ring-slate-950 text-slate-950 bg-white shadow-sm"
          />
        </div>
      </div>

      {(startDate || endDate) && (
        <button
          type="button"
          onClick={onReset}
          className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all"
        >
          Clear Temporal Bounds
        </button>
      )}
    </div>
  );
}