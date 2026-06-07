import { PageHeader } from "../components/layout/PageHeader";
import { StoragePreferences } from "../components/settings/StoragePreferences";
import { PrivacyControls } from "../components/settings/PrivacyControls";
import { DataRetentionControls } from "../components/settings/DataRetentionControls";
import { DangerZone } from "../components/settings/DangerZone";

export function SettingsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        category="System Preferences"
        title="Application Settings"
        subtitle="Manage local encryption boundaries, garbage collection intervals, and local device database clearing passes."
      />

      <div className="grid gap-6 md:grid-cols-1">
        {/* Storage Preference Layer Blocks */}
        <StoragePreferences />

        {/* Security & Cryptographic Anonymization Toggle Modules */}
        <PrivacyControls />

        {/* Database Lifespan Maintenance Blocks */}
        <DataRetentionControls />

        {/* Destructive High-Alert Operations Group */}
        <DangerZone />
      </div>
    </div>
  );
}