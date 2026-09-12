"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X, Sparkles } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "warning";

interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2.5 pointer-events-none max-w-sm w-full px-4 sm:px-0">
        <AnimatePresence>
          {toasts.map((toast) => {
            const isSuccess = toast.type === "success";
            const isError = toast.type === "error";
            const isWarning = toast.type === "warning";

            const borderClass = isSuccess
              ? "border-emerald-500/40 dark:border-emerald-500/60 shadow-[0_8px_30px_rgba(16,185,129,0.2)]"
              : isError
              ? "border-red-500/40 dark:border-red-500/60 shadow-[0_8px_30px_rgba(239,68,68,0.2)]"
              : isWarning
              ? "border-amber-500/40 dark:border-amber-500/60 shadow-[0_8px_30px_rgba(245,158,11,0.2)]"
              : "border-divider dark:border-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.35)]";

            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 20, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.92 }}
                transition={{ duration: 0.25, ease: [0.28, 0.11, 0.32, 1] }}
                className={`pointer-events-auto relative overflow-hidden flex items-center justify-between gap-3.5 px-4 py-3.5 rounded-2xl bg-white/95 dark:bg-[#161822]/95 backdrop-blur-xl border ${borderClass} transition-all`}
              >
                {/* Accent glow bar on the left */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1 ${
                    isSuccess
                      ? "bg-emerald-500"
                      : isError
                      ? "bg-red-500"
                      : isWarning
                      ? "bg-amber-500"
                      : "bg-accent dark:bg-amber-400"
                  }`}
                />

                <div className="flex items-center gap-3 pl-1.5">
                  {isSuccess && (
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-sm">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  )}
                  {isError && (
                    <div className="w-8 h-8 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0 shadow-sm">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                  )}
                  {isWarning && (
                    <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 shadow-sm">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                  )}
                  {toast.type === "info" && (
                    <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-accent dark:text-amber-300 flex items-center justify-center shrink-0 shadow-sm">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  )}

                  <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 leading-snug">
                    {toast.message}
                  </p>
                </div>

                <button
                  onClick={() => removeToast(toast.id)}
                  aria-label="Dismiss notification"
                  className="text-slate-400 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white p-1 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
