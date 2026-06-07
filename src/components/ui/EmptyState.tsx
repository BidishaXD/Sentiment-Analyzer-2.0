import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon = "🔍", title, description, action }: EmptyStateProps) {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 p-8 text-center bg-white">
      <span className="text-4xl mb-3">{icon}</span>
      <h3 className="text-sm font-semibold text-slate-950">{title}</h3>
      <p className="mt-1.5 text-xs text-slate-500 max-w-sm leading-normal">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}