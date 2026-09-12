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
      const res = await apiRequest<{
        success: boolean;
        suggestion?: {
          title: string;
          type?: string;
          category?: string;
          priority?: string;
        };
        quest?: string;
        source?: string;
      }>("/api/quest-ai", {
        method: "POST",
        body: JSON.stringify({ category }),
      });

      const generatedTitle = res.data?.suggestion?.title || res.data?.quest;

      if (res.success && generatedTitle) {
        onSelectSuggestion(generatedTitle);
        if (res.data?.source === "gemini-ai") {
          showToast("Gemini AI generated a customized quest!", "success");
        } else {
          showToast("Quest suggestion applied (fallback template).", "info");
        }
      } else {
        showToast(res.error || "Unable to generate quest suggestion.", "error");
      }
    } catch {
      showToast("Unable to reach AI service; please try again.", "error");
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
