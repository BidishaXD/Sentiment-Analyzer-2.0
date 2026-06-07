import { useState } from "react";
import { PageHeader } from "../components/layout/PageHeader";
import { PlatformSelector } from "../components/import/PlatformSelector";
import { FileDropzone } from "../components/import/FileDropzone";
import { ConsentPanel } from "../components/import/ConsentPanel";
import { ImportProgress } from "../components/import/ImportProgress";
import { ImportPreview } from "../components/import/ImportPreview";
import { importMessageFile } from "../features/import/importController";
import { saveConversationWithMessages } from "../storage/conversationRepository";
import type { ImportResult } from "../features/import/importTypes";

export function ImportPage() {
  const [platform, setPlatform] = useState<"whatsapp" | "instagram">("whatsapp");
  const [file, setFile] = useState<File | null>(null);
  const [hasConsent, setHasConsent] = useState(false);
  const [storeRawMessages, setStoreRawMessages] = useState(true);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);

  async function handleExecutePipeline() {
    if (!file || !hasConsent) return;
    
    setIsProcessing(true);
    setError(null);
    setImportResult(null);
    setStatusText("Reading file payload array buffers...");

    try {
      // 1. Run the platform parsing and rule-based sentiment calculation loop
      const result = await importMessageFile(file, {
        platform,
        storeRawMessages,
      });

      setStatusText("Writing structured sentiment schemas to local IndexedDB...");
      
      // 2. Persist the complete conversation and analyzed message array into database nodes
      await saveConversationWithMessages(result.conversation, result.messages);

      setImportResult(result);
      setStatusText("Metrics ingestion and sentiment processing complete!");
      
      // Reset state for subsequent imports safely
      setFile(null);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Critical failure running text parse pipeline chunks.");
      setStatusText(null);
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        category="Ingestion Core"
        title="Import Data Streams" 
        subtitle="Mount encrypted local platform chat dumps straight into your private execution sandbox."
      />

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Side: Pipeline Inputs Grid Block */}
        <div className="md:col-span-2 rounded-lg border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <PlatformSelector 
            selectedPlatform={platform}
            onPlatformChange={setPlatform}
            disabled={isProcessing}
          />

          <FileDropzone 
            platform={platform}
            file={file}
            onFileChange={setFile}
            disabled={isProcessing}
          />

          <ConsentPanel 
            hasConsent={hasConsent}
            onConsentChange={setHasConsent}
            storeRawMessages={storeRawMessages}
            onStoreRawChange={setStoreRawMessages}
            disabled={isProcessing}
          />

          {error && (
            <div className="rounded-md bg-red-50 p-3 border border-red-100 text-xs font-semibold text-red-600">
              ⚠️ {error}
            </div>
          )}

          <button
            type="button"
            className="w-full rounded-md bg-slate-950 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300 transition-all"
            disabled={isProcessing || !file || !hasConsent}
            onClick={handleExecutePipeline}
          >
            {isProcessing ? "Processing Data Stack..." : "Run Engine Processing Pipeline"}
          </button>
        </div>

        {/* Right Side: Execution Feedback Panel */}
        <div className="space-y-4">
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-950 mb-1">Pipeline Directives</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Ensure data drops match source schemas. The engine runs deterministic localized evaluations. 
              No outbound cloud telemetry arrays are loaded during calculation passes.
            </p>
          </div>

          <ImportProgress statusText={statusText} isProcessing={isProcessing} />
          <ImportPreview result={importResult} />
        </div>
      </div>
    </div>
  );
}