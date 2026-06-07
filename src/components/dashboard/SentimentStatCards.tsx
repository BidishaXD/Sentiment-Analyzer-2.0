interface SentimentStatCardsProps {
  totalConversations: number;
  totalMessages: number;
  globalPositiveCount: number;
  globalNeutralCount: number;
  globalNegativeCount: number;
}

export function SentimentStatCards({
  totalConversations,
  totalMessages,
  globalPositiveCount,
  globalNeutralCount,
  globalNegativeCount,
}: SentimentStatCardsProps) {
  const totalSignals = globalPositiveCount + globalNeutralCount + globalNegativeCount || 1;
  const positiveRatio = Math.round((globalPositiveCount / totalSignals) * 100);

  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-6">
      <StatCard 
        title="Active Channels" 
        value={totalConversations.toLocaleString()} 
        subtitle="Indexed communication logs" 
        icon="💬" 
      />
      <StatCard 
        title="Analyzed Clusters" 
        value={totalMessages.toLocaleString()} 
        subtitle="Processed message weights" 
        icon="⚡" 
      />
      <StatCard 
        title="Positive Ratio" 
        value={`${positiveRatio}%`} 
        subtitle={`${globalPositiveCount.toLocaleString()} text nodes flag pos`} 
        icon="📈" 
        className="border-l-4 border-l-emerald-500"
      />
      <StatCard 
        title="Attention Targets" 
        value={globalNegativeCount.toLocaleString()} 
        subtitle="Flags matching critical bounds" 
        icon="⚠️" 
        className={globalNegativeCount > 0 ? "border-l-4 border-l-red-400 bg-red-50/10" : ""}
      />
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: string;
  className?: string;
}

function StatCard({ title, value, subtitle, icon, className = "" }: StatCardProps) {
  return (
    <div className={`rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md flex items-start justify-between gap-3 ${className}`}>
      <div className="space-y-1">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-bold tracking-tight text-slate-950">{value}</p>
        <p className="text-[11px] text-slate-400 font-medium leading-tight">{subtitle}</p>
      </div>
      <span className="text-2xl bg-slate-50 p-2 rounded-md border border-slate-100 shrink-0">{icon}</span>
    </div>
  );
}