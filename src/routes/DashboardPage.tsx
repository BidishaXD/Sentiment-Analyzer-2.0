import { useState, useMemo } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../storage/db";
import { PageHeader } from "../components/layout/PageHeader";
import { SentimentStatCards } from "../components/dashboard/SentimentStatCards";
import { ConversationSearch } from "../components/dashboard/ConversationSearch";
import { DateRangeFilter } from "../components/dashboard/DateRangeFilter";
import { SentimentTimeline } from "../components/dashboard/SentimentTimeline";
import { EmptyState } from "../components/ui/EmptyState";

interface DashboardPageProps {
  onNavigateToConversation: (id: string) => void;
}

export function DashboardPage({ onNavigateToConversation }: DashboardPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const channels = useLiveQuery(() => db.conversations.toArray(), []) || [];

  const filteredChannels = useMemo(() => {
    return channels.filter((channel) => {
      const matchSearch =
        channel.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        channel.participantNames.some((p) => p.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchPlatform = platformFilter === "all" || channel.platform === platformFilter;

      let matchDate = true;
      if (startDate && channel.firstMessageAt) {
        matchDate = matchDate && new Date(channel.firstMessageAt) >= new Date(startDate);
      }
      if (endDate && channel.lastMessageAt) {
        matchDate = matchDate && new Date(channel.lastMessageAt) <= new Date(endDate + "T23:59:59");
      }

      return matchSearch && matchPlatform && matchDate;
    });
  }, [channels, searchTerm, platformFilter, startDate, endDate]);

  const stats = useMemo(() => {
    let msgCount = 0;
    let pos = 0;
    let neu = 0;
    let neg = 0;

    filteredChannels.forEach((c) => {
      msgCount += c.messageCount || 0;
      if (c.sentimentSummary) {
        pos += c.sentimentSummary.positiveCount || 0;
        neu += c.sentimentSummary.neutralCount || 0;
        neg += c.sentimentSummary.negativeCount || 0;
      }
    });

    return { msgCount, pos, neu, neg };
  }, [filteredChannels]);

  function handleClearFilters() {
    setStartDate("");
    setEndDate("");
    setSearchTerm("");
    setPlatformFilter("all");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        category="Analytics Desk"
        title="Workspace Dashboard"
        subtitle="Monitor rule-based sentiment indexes, historical timeline tracks, and metric profiles across channels."
      />

      {channels.length === 0 ? (
        <EmptyState
          icon="📥"
          title="No Channels Found"
          description="Your local device IndexedDB storage tables are currently empty. Import a data backup log archive to populate your statistics charts."
        />
      ) : (
        <>
          <SentimentStatCards
            totalConversations={filteredChannels.length}
            totalMessages={stats.msgCount}
            globalPositiveCount={stats.pos}
            globalNeutralCount={stats.neu}
            globalNegativeCount={stats.neg}
          />

          <ConversationSearch
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedPlatform={platformFilter}
            onPlatformChange={setPlatformFilter}
          />

          <DateRangeFilter
            startDate={startDate}
            onStartDateChange={setStartDate}
            endDate={endDate}
            onEndDateChange={setEndDate}
            onReset={handleClearFilters}
          />

          <SentimentTimeline conversations={filteredChannels} />

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-900 px-1">Monitored Chat Channels</h3>
            
            {filteredChannels.length === 0 ? (
              <p className="text-xs font-medium text-slate-400 text-center py-6 border border-dashed rounded-lg bg-white">
                No indexed communication channels match the current search criteria bounds.
              </p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {filteredChannels.map((channel) => (
                  <div
                    key={channel.id}
                    onClick={() => onNavigateToConversation(channel.id)}
                    className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md cursor-pointer transition-all flex flex-col justify-between group hover:border-slate-400"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <h4 className="font-bold text-slate-950 truncate group-hover:text-slate-800">
                          {channel.title}
                        </h4>
                        <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                          {channel.platform}
                        </span>
                      </div>
                      
                      <p className="mt-1 text-xs text-slate-400 font-medium truncate">
                        {channel.participantNames.join(", ")}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-medium text-slate-500">
                      <span>{(channel.messageCount || 0).toLocaleString()} text blocks</span>
                      <span className="font-mono font-bold text-slate-700 bg-slate-50 border px-1.5 py-0.5 rounded">
                        Idx: {(channel.sentimentSummary?.averageScore ?? 0.5).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}