"use client";

import React, { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { useToast } from "../ui/Toast";

interface AISuggestButtonProps {
  category: "intellect" | "willpower";
  onSelectSuggestion: (questText: string) => void;
}

export function AISuggestButton({
  category,
  onSelectSuggestion,
}: AISuggestButtonProps) {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await apiRequest<{ success: boolean; quest: string }>(
        "/api/quest-ai",
        {
          method: "POST",
          body: JSON.stringify({ category }),
        }
      );

      if (res.success && res.data?.quest) {
        onSelectSuggestion(res.data.quest);
        showToast("Gemini AI generated a customized quest!", "success");
      } else {
        showToast("Using offline quest template.", "info");
      }
    } catch {
      showToast("Unable to reach AI service; applied default quest.", "info");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGenerate}
      disabled={loading}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-accent-light text-accent hover:bg-accent/20 transition-all active:scale-95 disabled:opacity-60"
      aria-label="Generate AI quest suggestion"
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <Sparkles className="w-3.5 h-3.5" />
      )}
      <span>{loading ? "Generating..." : "AI Suggestion"}</span>
    </button>
  );
}
