import React from "react";
import { AlertCircle } from "lucide-react";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  if (!message) return null;

  return (
    <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-50 border border-red-200/80 text-red-800 text-sm">
      <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="font-medium">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-xs font-semibold underline text-red-700 hover:text-red-900 shrink-0"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
