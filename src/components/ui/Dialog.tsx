import type { ReactNode } from "react";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Dialog({ isOpen, onClose, title, children }: DialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop overlay layer */}
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      
      {/* Structural Modal wrapper */}
      <div className="relative w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-xl animate-fade-in z-10">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-semibold text-slate-950">{title}</h3>
          <button 
            type="button" 
            className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <div className="mt-4 text-sm text-slate-600 leading-normal">
          {children}
        </div>
      </div>
    </div>
  );
}