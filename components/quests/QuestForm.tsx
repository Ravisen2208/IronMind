"use client";

import React, { useState, useEffect } from "react";
import { Plus, Loader2, Sparkles, Tag, Calendar, AlertCircle } from "lucide-react";
import { AISuggestButton } from "./AISuggestButton";
import { CategoryModal } from "./CategoryModal";
import { useToast } from "../ui/Toast";
import { apiRequest } from "@/lib/api";
import { TaskItem, CategoryItem, DEFAULT_CATEGORIES, TaskPriority, TaskType } from "@/types";

interface QuestFormProps {
  onQuestCreated: (task: TaskItem) => void;
  defaultType?: TaskType;
}

export function QuestForm({ onQuestCreated, defaultType = "general" }: QuestFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Personal");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [type, setType] = useState<TaskType>(defaultType);
  const [dueDate, setDueDate] = useState("");
  const [categories, setCategories] = useState<CategoryItem[]>(DEFAULT_CATEGORIES);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    // Fetch categories
    apiRequest<{ success: boolean; categories: CategoryItem[] }>("/api/categories")
      .then((res) => {
        if (res.success && res.data?.categories) {
          setCategories(res.data.categories);
        }
      })
      .catch(() => {});
  }, []);

  const handleCategorySelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === "__create_custom__") {
      setIsCategoryModalOpen(true);
    } else {
      setCategory(e.target.value);
    }
  };

  const handleCategoryCreated = (newCat: CategoryItem) => {
    setCategories((prev) => [...prev, newCat]);
    setCategory(newCat.name);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      showToast("Please enter a quest title.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const derivedType: TaskType =
        category.toLowerCase() === "gym" ? "gym" : category.toLowerCase() === "study" ? "study" : type;

      const payload: any = {
        title: trimmedTitle,
        description: description.trim(),
        type: derivedType,
        category,
        priority,
        dueDate: dueDate || null,
      };

      if (derivedType === "gym") {
        payload.gym = {
          exercise: trimmedTitle,
          muscleGroup: "Fitness",
          sets: 4,
          reps: 10,
          duration: 30,
        };
      } else if (derivedType === "study") {
        payload.study = {
          subject: trimmedTitle,
          topic: "Deep Focus",
          duration: 30,
        };
      }

      const res = await apiRequest<{ success: boolean; task: TaskItem }>("/api/tasks", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (res.success && res.data?.task) {
        onQuestCreated(res.data.task);
        setTitle("");
        setDescription("");
        setDueDate("");
        setShowAdvanced(false);
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

  const aiCategory =
    category.toLowerCase().includes("gym") || category.toLowerCase().includes("health")
      ? "willpower"
      : "intellect";

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 rounded-3xl bg-surface border border-divider/70 shadow-subtle space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-accent-light text-accent flex items-center justify-center">
            <Plus className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-text-primary tracking-tight">
            Embark on a Quest
          </h3>
        </div>

        <AISuggestButton
          category={aiCategory}
          onSelectSuggestion={(suggestion) => setTitle(suggestion)}
        />
      </div>

      {/* Main Quest Title Input */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Read 15 pages on system architecture or do 30 pushups..."
          maxLength={120}
          className="flex-1 px-4 py-3 rounded-2xl border border-divider bg-slate-50 text-text-primary placeholder:text-text-muted text-sm focus:bg-white transition-all outline-none"
        />

        <button
          type="submit"
          disabled={isSubmitting || !title.trim()}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-accent text-cream font-semibold text-sm hover:bg-accent-hover transition-all active:scale-95 disabled:opacity-50 shadow-sm shrink-0"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          <span>Create Quest</span>
        </button>
      </div>

      {/* Primary Category & Priority Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <div>
          <label className="block text-[11px] font-semibold text-text-secondary uppercase tracking-wider mb-1">
            Category
          </label>
          <select
            value={category}
            onChange={handleCategorySelectChange}
            className="w-full px-3.5 py-2.5 rounded-xl border border-divider bg-slate-50 text-text-primary text-xs font-semibold focus:bg-white transition-all outline-none"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
            <option value="__create_custom__">+ Create Custom Category</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-text-secondary uppercase tracking-wider mb-1">
            Priority Tier
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-divider bg-slate-50 text-text-primary text-xs font-semibold focus:bg-white transition-all outline-none"
          >
            <option value="low">Low (25 XP, 10 Coins)</option>
            <option value="medium">Medium (40 XP, 18 Coins)</option>
            <option value="high">High (60 XP, 30 Coins)</option>
          </select>
        </div>
      </div>

      {/* Optional Details Toggle */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-xs font-semibold text-accent hover:underline flex items-center gap-1"
        >
          {showAdvanced ? "— Hide Details" : "+ Add Description & Due Date"}
        </button>

        {showAdvanced && (
          <div className="mt-3 space-y-3 pt-2 border-t border-divider/60">
            <div>
              <label className="block text-[11px] font-semibold text-text-secondary uppercase tracking-wider mb-1">
                Description
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Key milestones, checklist, or targets..."
                className="w-full px-3 py-2 rounded-xl border border-divider bg-slate-50 text-text-primary text-xs focus:bg-white transition-all outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-text-secondary uppercase tracking-wider mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full sm:w-64 px-3 py-2 rounded-xl border border-divider bg-slate-50 text-text-primary text-xs focus:bg-white transition-all outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Category Creation Modal */}
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onCategoryCreated={handleCategoryCreated}
      />
    </form>
  );
}
