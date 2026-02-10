"use client";

import { useState, useEffect, createContext, useContext, useCallback, type ReactNode } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { CheckCircle2, Info, AlertTriangle, Bell } from "lucide-react";

interface Toast {
  id: string;
  message: string;
  type?: "success" | "info" | "warning" | "reminder";
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type?: Toast["type"], duration?: number) => void;
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export function useLocuToast() {
  return useContext(ToastContext);
}

export function LocuToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: Toast["type"] = "info", duration = 2500) => {
    const id = Math.random().toString(36).slice(2, 9);
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container - fixed above bottom nav, below nothing */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2 pointer-events-none lg:bottom-6">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDone={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onDone }: { toast: Toast; onDone: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 300);
    }, toast.duration || 2500);
    return () => clearTimeout(timer);
  }, [toast.duration, onDone]);

  const iconMap = {
    success: CheckCircle2,
    info: Info,
    warning: AlertTriangle,
    reminder: Bell,
  };
  const colorMap = {
    success: "text-[#10B981]",
    info: "text-primary",
    warning: "text-[#F59E0B]",
    reminder: "text-[#3B82F6]",
  };

  const Icon = iconMap[toast.type || "info"];

  return (
    <div
      className={cn(
        "pointer-events-auto flex items-center gap-3 px-4 py-3 bg-card border border-border rounded-xl shadow-2xl transition-all duration-300 max-w-[340px]",
        visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"
      )}
    >
      <div className="flex items-center gap-2.5 shrink-0">
        <Image src="/locu-logo.png" alt="Locu" width={40} height={16} className="h-4 w-auto" />
        <Icon className={cn("w-4 h-4", colorMap[toast.type || "info"])} />
      </div>
      <p className="text-sm font-medium text-foreground leading-snug">{toast.message}</p>
    </div>
  );
}
