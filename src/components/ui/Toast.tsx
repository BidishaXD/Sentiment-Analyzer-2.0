import { useEffect } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type = "success", onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const backgrounds = {
    success: "bg-slate-900 text-white border-emerald-500",
    error: "bg-red-50 text-red-900 border-red-200",
    info: "bg-slate-50 text-slate-900 border-slate-200",
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-md border-l-4 p-4 shadow-lg animate-slide-up ${backgrounds[type]}`}>
      <span className="text-xs font-medium tracking-tight">{message}</span>
      <button 
        type="button" 
        onClick={onClose} 
        className="ml-2 text-xs opacity-60 hover:opacity-100 font-bold"
      >
        ✕
      </button>
    </div>
  );
}