"use client";

import React, { useState } from "react";
import { Plus, Brain, Dumbbell, Loader2 } from "lucide-react";
import { AISuggestButton } from "./AISuggestButton";
import { useToast } from "../ui/Toast";
import { apiRequest } from "@/lib/api";
import { TaskItem } from "@/lib/db";

interface QuestFormProps {
  onQuestCreated: (task: TaskItem) => void;
}

export function QuestForm({ onQuestCreated }: QuestFormProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<"intellect" | "willpower">("intellect");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      showToast("Please enter a quest title.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await apiRequest<{ success: boolean; task: TaskItem }>("/api/tasks", {
        method: "POST",
        body: JSON.stringify({
          title: trimmedTitle,
          category,
        }),
      });

      if (res.success && res.data?.task) {
        onQuestCreated(res.data.task);
        setTitle("");
        showToast("New quest embarked!", "success");
      } else {
        showToast(res.error || "Failed to create quest.", "error");
      }
    } catch {
      showToast("Failed to create quest. Please check connection.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 rounded-3xl bg-surface border border-divider/70 shadow-subtle space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-text-primary tracking-tight">
          Embark on a New Quest
        </h3>
        <AISuggestButton
          category={category}
          onSelectSuggestion={(suggestion) => setTitle(suggestion)}
        />
      </div>

      {/* Category Selector Pills */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setCategory("intellect")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-2xl text-xs font-semibold border transition-all ${
            category === "intellect"
              ? "bg-accent text-white border-accent shadow-sm"
              : "bg-slate-50 text-text-secondary border-divider hover:bg-slate-100"
          }`}
        >
          <Brain className="w-4 h-4" />
          <span>Intellect (+35 XP, +15 Coins)</span>
        </button>

        <button
          type="button"
          onClick={() => setCategory("willpower")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-2xl text-xs font-semibold border transition-all ${
            category === "willpower"
              ? "bg-orange-500 text-white border-orange-500 shadow-sm"
              : "bg-slate-50 text-text-secondary border-divider hover:bg-slate-100"
          }`}
        >
          <Dumbbell className="w-4 h-4" />
          <span>Willpower (+40 XP, +20 Coins)</span>
        </button>
      </div>

      {/* Quest Input & Submit */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={
              category === "intellect"
                ? "e.g., Read 15 pages of system architecture..."
                : "e.g., Run 3km or complete 30 pushups..."
            }
            maxLength={120}
            className="w-full px-4 py-3 rounded-2xl border border-divider bg-slate-50/50 text-text-primary placeholder:text-text-secondary/60 text-sm focus:bg-white transition-all outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !title.trim()}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-accent text-white font-semibold text-sm hover:bg-accent-hover transition-all active:scale-95 disabled:opacity-50 shadow-sm shrink-0"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          <span>Add Quest</span>
        </button>
      </div>
    </form>
  );
}
