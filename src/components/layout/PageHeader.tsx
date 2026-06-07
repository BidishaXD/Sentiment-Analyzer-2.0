import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  category?: string;
  action?: ReactNode;
}

export function PageHeader({ title, subtitle, category, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-slate-200 pb-5 mb-8">
      <div>
        {category && (
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
            {category}
          </p>
        )}
        <h1 className="text-3xl font-bold tracking-tight text-slate-950">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1.5 text-sm text-slate-500 max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      
      {action && (
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {action}
        </div>
      )}
    </div>
  );
}