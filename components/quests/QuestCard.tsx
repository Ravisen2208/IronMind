"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TaskItem, CompletionResponse } from "@/lib/db";
import { Brain, Dumbbell, Check, Trash2, Loader2, Sparkles, Coins } from "lucide-react";
import { appleEasing } from "../animations/MotionWrapper";
import { formatDate } from "@/lib/utils";

interface QuestCardProps {
  task: TaskItem;
  onComplete?: (taskId: string, result: CompletionResponse) => void;
  onDelete?: (taskId: string) => void;
  isProcessing?: boolean;
}

export function QuestCard({
  task,
  onComplete,
  onDelete,
  isProcessing = false,
}: QuestCardProps) {
  const [isCompleting, setIsCompleting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isIntellect = task.category === "intellect";
  const CategoryIcon = isIntellect ? Brain : Dumbbell;

  const handleComplete = async () => {
    if (task.completed || isCompleting || !onComplete) return;

    setIsCompleting(true);
    try {
      const res = await fetch("/api/tasks/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(typeof window !== "undefined" && localStorage.getItem("ironmind_demo_uid")
            ? { "x-ironmind-demo-uid": localStorage.getItem("ironmind_demo_uid")! }
            : {}),
        },
        body: JSON.stringify({ taskId: task.id }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        onComplete(task.id, data.data);
      }
    } catch (err) {
      console.error("Task completion failed:", err);
    } finally {
      setIsCompleting(false);
    }
  };

  const handleDelete = async () => {
    if (isDeleting || !onDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: "DELETE",
        headers: {
          ...(typeof window !== "undefined" && localStorage.getItem("ironmind_demo_uid")
            ? { "x-ironmind-demo-uid": localStorage.getItem("ironmind_demo_uid")! }
            : {}),
        },
      });

      if (res.ok) {
        onDelete(task.id);
      }
    } catch (err) {
      console.error("Task deletion failed:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, height: 0 }}
      transition={{ duration: 0.35, ease: appleEasing }}
      className={`group relative p-4 sm:p-5 rounded-3xl bg-surface border transition-all duration-200 ${
        task.completed
          ? "border-divider/50 bg-slate-50/60"
          : "border-divider/80 hover:border-divider shadow-subtle hover:shadow-card"
      }`}
    >
      <div className="flex items-start sm:items-center justify-between gap-4">
        {/* Checkbox button */}
        <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
          {!task.completed ? (
            <button
              onClick={handleComplete}
              disabled={isCompleting || isProcessing}
              aria-label={`Complete quest: ${task.title}`}
              className="w-7 h-7 mt-0.5 sm:mt-0 rounded-full border-2 border-divider hover:border-accent flex items-center justify-center transition-all group-hover:scale-105 active:scale-95 shrink-0 hover:bg-accent/5"
            >
              {isCompleting ? (
                <Loader2 className="w-3.5 h-3.5 text-accent animate-spin" />
              ) : (
                <Check className="w-3.5 h-3.5 text-transparent hover:text-accent transition-colors" />
              )}
            </button>
          ) : (
            <div className="w-7 h-7 mt-0.5 sm:mt-0 rounded-full bg-success text-white flex items-center justify-center shrink-0 shadow-sm">
              <Check className="w-4 h-4 stroke-[3]" />
            </div>
          )}

          {/* Title & Metadata */}
          <div className="flex-1 min-w-0">
            <p
              className={`text-sm sm:text-base font-semibold tracking-tight transition-all truncate ${
                task.completed
                  ? "line-through text-text-secondary"
                  : "text-text-primary"
              }`}
            >
              {task.title}
            </p>

            <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-text-secondary">
              <span
                className={`inline-flex items-center gap-1 font-medium px-2 py-0.5 rounded-md ${
                  isIntellect
                    ? "bg-accent-light text-accent"
                    : "bg-orange-50 text-orange-600"
                }`}
              >
                <CategoryIcon className="w-3 h-3" />
                <span className="capitalize">{task.category}</span>
              </span>

              <span className="inline-flex items-center gap-1 font-medium text-accent">
                <Sparkles className="w-3 h-3" />
                +{task.xpReward} XP
              </span>

              <span className="inline-flex items-center gap-1 font-medium text-warm">
                <Coins className="w-3 h-3" />
                +{task.coinReward}
              </span>

              {task.completedAt && (
                <span className="text-text-secondary/70">
                  • Completed {formatDate(task.completedAt)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            aria-label={`Delete quest: ${task.title}`}
            className="opacity-60 hover:opacity-100 text-text-secondary hover:text-red-600 p-2 rounded-xl hover:bg-red-50 transition-all active:scale-95"
          >
            {isDeleting ? (
              <Loader2 className="w-4 h-4 animate-spin text-red-500" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
