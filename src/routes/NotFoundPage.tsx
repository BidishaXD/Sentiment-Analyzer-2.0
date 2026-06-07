import { PageHeader } from "../components/layout/PageHeader";
import { EmptyState } from "../components/ui/EmptyState";

interface NotFoundPageProps {
  onReturnToSafeZone: () => void;
}

export function NotFoundPage({ onReturnToSafeZone }: NotFoundPageProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        category="System Status"
        title="Page Not Found"
        subtitle="The layout layer or conversation record index you are trying to view does not exist inside this local execution sandbox."
      />

      <EmptyState
        icon="🧭"
        title="404 - Lost Orbit"
        description="The navigation route parameters specified are invalid or the historical thread index has been purged from your local device browser tables."
        action={
          <button
            type="button"
            onClick={onReturnToSafeZone}
            className="rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2"
          >
            Return to Dashboard Workspace
          </button>
        }
      />
    </div>
  );
}