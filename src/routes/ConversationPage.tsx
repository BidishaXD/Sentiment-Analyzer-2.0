import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../storage/db";
import { PageHeader } from "../components/layout/PageHeader";
import { ConversationSummary } from "../components/conversation/ConversationSummary";
import { SentimentBreakdown } from "../components/conversation/SentimentBreakdown";
import { MessageSampleList } from "../components/conversation/MessageSampleList";

interface ConversationPageProps {
  conversationId: string;
  onBackToDashboard: () => void;
}

export function ConversationPage({ conversationId, onBackToDashboard }: ConversationPageProps) {
  // Query targeted channel header records using key indices safely
  const conversation = useLiveQuery(() => db.conversations.get(conversationId), [conversationId]);
  
  // Collect all dependent messages bound to this conversation key reference point
  const messages = useLiveQuery(
    () => db.messages.where("conversationId").equals(conversationId).toArray(),
    [conversationId]
  ) || [];

  if (!conversation) {
    return (
      <div className="py-12 text-center space-y-4 animate-pulse">
        <p className="text-sm font-semibold text-slate-500">Retrieving conversation profile matrix from local data logs...</p>
        <button type="button" onClick={onBackToDashboard} className="text-xs font-bold text-slate-950 underline">
          Return to Workspace Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        category="Granular Inspection"
        title={conversation.title}
        subtitle="Inspect fine-grained text scores, distribution counts, and message-by-message profiling charts."
        action={
          <button
            type="button"
            onClick={onBackToDashboard}
            className="rounded-md border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950"
          >
            ← Back to Dashboard
          </button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3 items-start">
        {/* Left Grid: Left Profile Card Columns */}
        <div className="lg:col-span-1 space-y-6">
          <ConversationSummary conversation={conversation} />
          <SentimentBreakdown 
            summary={conversation.sentimentSummary} 
            messageCount={conversation.messageCount} 
          />
        </div>

        {/* Right Grid: Granular Search Message Feed Row Matrix */}
        <div className="lg:col-span-2">
          <MessageSampleList messages={messages} />
        </div>
      </div>
    </div>
  );
}