import React from "react";
import { Compass, CheckCircle2 } from "lucide-react";

interface EmptyStateProps {
  type: "active" | "completed";
  onAction?: () => void;
  actionText?: string;
}

export function EmptyState({ type, onAction, actionText }: EmptyStateProps) {
  const isActive = type === "active";

  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-3xl bg-surface border border-divider/60 shadow-subtle my-4">
      <div className="w-14 h-14 rounded-2xl bg-accent-light/50 flex items-center justify-center text-accent mb-4">
        {isActive ? (
          <Compass className="w-7 h-7" />
        ) : (
          <CheckCircle2 className="w-7 h-7 text-success" />
        )}
      </div>

      <h3 className="text-base font-semibold text-text-primary mb-1">
        {isActive ? "No active quests in your queue" : "No completed quests yet"}
      </h3>
      <p className="text-sm text-text-secondary max-w-sm mb-6">
        {isActive
          ? "Create a custom quest or click Generate Quest with Gemini AI to train your mind and build your character."
          : "Complete active quests to level up, build your daily streak, and unlock rewards."}
      </p>

      {isActive && onAction && (
        <button
          onClick={onAction}
          className="text-xs font-semibold px-4 py-2 rounded-full bg-accent text-white hover:bg-accent-hover transition-all active:scale-95 shadow-sm"
        >
          {actionText || "Get Started"}
        </button>
      )}
    </div>
  );
}
