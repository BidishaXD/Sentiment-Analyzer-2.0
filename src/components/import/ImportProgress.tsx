interface ImportProgressProps {
  statusText: string | null;
  isProcessing: boolean;
}

export function ImportProgress({ statusText, isProcessing }: ImportProgressProps) {
  if (!statusText && !isProcessing) return null;

  return (
    <div className="w-full rounded-md p-4 border border-indigo-100 bg-indigo-50/50 flex items-start gap-3 animate-fade-in">
      {isProcessing && (
        <div className="mt-0.5 h-4 w-4 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
      )}
      <div>
        <h4 className="text-xs font-semibold text-indigo-900 uppercase tracking-wider">
          {isProcessing ? "Processing Execution Cycle" : "Engine Status Notification"}
        </h4>
        <p className="mt-1 text-xs font-medium text-indigo-700 leading-normal">
          {statusText || "Assembling operational runtime packages..."}
        </p>
      </div>
    </div>
  );
}