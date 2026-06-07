import { useState } from "react";
import { AppShell } from "./components/layout/AppShell";
import { ImportPage } from "./routes/ImportPage";
import { DashboardPage } from "./routes/DashboardPage";
import { ConversationPage } from "./routes/ConversationPage";
import { SettingsPage } from "./routes/SettingsPage";

type Page = "import" | "dashboard" | "settings" | "conversation";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("import");
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  function handleNavigateToConversation(id: string) {
    setActiveConversationId(id);
    setCurrentPage("conversation");
  }

  function handleBackToDashboard() {
    setActiveConversationId(null);
    setCurrentPage("dashboard");
  }

  // Safe navigation view switcher
  function renderActiveRoute() {
    switch (currentPage) {
      case "import":
        return <ImportPage />;
      case "dashboard":
        return <DashboardPage onNavigateToConversation={handleNavigateToConversation} />;
      case "conversation":
        return activeConversationId ? (
          <ConversationPage
            conversationId={activeConversationId}
            onBackToDashboard={handleBackToDashboard}
          />
        ) : (
          <DashboardPage onNavigateToConversation={handleNavigateToConversation} />
        );
      case "settings":
        return <SettingsPage />;
      default:
        return <ImportPage />;
    }
  }

  // Maps the active shell navigation highlighting tab rules accurately
  const shellTabKey = currentPage === "conversation" ? "dashboard" : currentPage;

  return (
    <AppShell currentPage={shellTabKey} onPageChange={(page) => setCurrentPage(page)}>
      {renderActiveRoute()}
    </AppShell>
  );
}