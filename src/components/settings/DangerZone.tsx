import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { clearConversations } from "../../storage/conversationRepository";
import {
  countMessagesWithRawText,
  deleteStoredRawMessageText,
} from "../../storage/privacyRepository";

export function DangerZone() {
  const rawMessageCount = useLiveQuery(() => countMessagesWithRawText(), []);
  const [status, setStatus] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  async function handleDeleteRawText() {
    const confirmed = window.confirm(
      "Are you absolutely sure you want to delete all stored raw message text?\n\nSentiment scores, metrics, and conversation metadata will remain completely intact.",
    );
    if (!confirmed) return;

    setIsProcessing(true);
    setStatus("Purging raw text layers from local database...");

    try {
      await deleteStoredRawMessageText();
      setStatus("Raw message text successfully deleted.");
    } catch (error) {
      console.error(error);
      setStatus("Error encountered during text purge execution.");
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleDeleteAllData() {
    const confirmed = window.confirm(
      "WARNING: CRITICAL DATA DESTRUCTION\n\nThis will permanently delete ALL imported conversations, analyzed messages, summaries, and metrics from this browser's local storage.\n\nThis action cannot be undone. Proceed?",
    );
    if (!confirmed) return;

    setIsProcessing(true);
    setStatus("Wiping local database storage instances...");

    try {
      await clearConversations();
      setStatus("All local conversation data permanently deleted.");
    } catch (error) {
      console.error(error);
      setStatus("Error encountered during global storage database wipe.");
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="mt-6 rounded-lg border border-red-200 bg-white p-6 shadow-sm">
      <div className="border-b border-red-100 pb-3">
        <h2 className="text-lg font-semibold text-red-700">Danger Zone</h2>
        <p className="mt-1 text-sm text-slate-500">
          Irreversible destructive actions regarding your local application data indexes.
        </p>
      </div>

      <div className="mt-5 space-y-6">
        {/* Action 1: Clear Raw Text Only */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <h3 className="text-sm font-medium text-slate-950">Purge Raw Message Text</h3>
            <p className="mt-1 text-xs text-slate-500">
              Removes the underlying message strings to compress storage size and ensure maximum privacy. 
              Currently stored messages with text:{" "}
              <span className="font-semibold text-slate-800">
                {(rawMessageCount ?? 0).toLocaleString()}
              </span>
            </p>
          </div>
          <button
            type="button"
            disabled={isProcessing || !rawMessageCount}
            className="w-full rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            onClick={handleDeleteRawText}
          >
            Delete Raw Text
          </button>
        </div>

        <hr className="border-slate-100" />

        {/* Action 2: Wipe Everything */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <h3 className="text-sm font-medium text-red-700">Nuke All Local Storage Data</h3>
            <p className="mt-1 text-xs text-slate-500">
              Permanently destroys all imported channels, metrics, cached profiles, and sentiment structures. 
              Resets IndexedDB tables back to initialization parameters.
            </p>
          </div>
          <button
            type="button"
            disabled={isProcessing}
            className="w-full rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-400 sm:w-auto"
            onClick={handleDeleteAllData}
          >
            Delete All Data
          </button>
        </div>
      </div>

      {status && (
        <div className="mt-5 rounded-md bg-slate-50 p-3 border border-slate-200">
          <p className="text-xs font-medium text-slate-700">{status}</p>
        </div>
      )}
    </div>
  );
}