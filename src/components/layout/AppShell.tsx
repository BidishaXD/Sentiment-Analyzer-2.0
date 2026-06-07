import type { ReactNode } from "react";
import { TopNav } from "./TopNav";

type Page = "import" | "dashboard" | "settings";

interface AppShellProps {
  children: ReactNode;
  currentPage: Page;
  onPageChange: (page: Page) => void;
}

export function AppShell({ children, currentPage, onPageChange }: AppShellProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased selection:bg-slate-950 selection:text-white">
      {/* Universal Sticky Top Bar */}
      <TopNav currentPage={currentPage} onPageChange={onPageChange} />

      {/* Primary Injected Container Context View */}
      <main className="flex-1 px-4 py-8 md:px-8 max-w-6xl w-full mx-auto animate-fade-in">
        {children}
      </main>

      {/* Minimal Footer Signature */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-400 mt-auto">
        <p>Local Context Mode — High Assurance Private Sandbox Environment</p>
      </footer>
    </div>
  );
}