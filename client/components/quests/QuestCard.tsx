"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { TaskItem, CompletionResponse } from "@/types";
import { apiRequest } from "@/lib/api";
import Link from "next/link";
import {
  Check,
  Trash2,
  Loader2,
  Sparkles,
  Coins,
  Edit3,
  Calendar,
  Dumbbell,
  BookOpen,
  Tag,
  Code2,
  CheckCircle2,
} from "lucide-react";
import { appleEasing } from "../animations/MotionWrapper";
import { formatDate } from "@/lib/utils";

interface QuestCardProps {
  task: TaskItem;
  onComplete?: (taskId: string, result: CompletionResponse) => void;
  onEdit?: (task: TaskItem) => void;
  onDelete?: (taskId: string) => void;
  isProcessing?: boolean;
}

export function QuestCard({
  task,
  onComplete,
  onEdit,
  onDelete,
  isProcessing = false,
}: QuestCardProps) {
  const [isCompleting, setIsCompleting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleComplete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (task.completed || isCompleting || isProcessing || !onComplete) return;

    setIsCompleting(true);
    try {
      const res = await apiRequest<CompletionResponse>(
        "/api/tasks/complete",
        {
          method: "POST",
          body: JSON.stringify({ taskId: task.id }),
        }
      );

      // Extract result whether nested or flat
      const completionData: CompletionResponse | undefined =
        (res.data as any)?.data?.task
          ? (res.data as any).data
          : (res.data as any)?.task
          ? (res.data as any)
          : undefined;

      if (res.success && completionData) {
        onComplete(task.id, completionData);
      } else if (res.error) {
        console.error("Task completion error:", res.error);
      }
    } catch (err) {
      console.error("Task completion failed:", err);
    } finally {
      setIsCompleting(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (isDeleting || !onDelete) return;
    setIsDeleting(true);
    try {
      const res = await apiRequest(`/api/tasks/${task.id}`, {
        method: "DELETE",
      });

      if (res.success) {
        onDelete(task.id);
      }
    } catch (err) {
      console.error("Task deletion failed:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const priorityColor =
    task.priority === "high"
      ? "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800/50"
      : task.priority === "medium"
      ? "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/50"
      : "text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -28 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      exit={{ opacity: 0, scale: 0.96, height: 0 }}
      transition={{ duration: 0.45, ease: appleEasing }}
      className={`group relative p-4 sm:p-5 rounded-3xl bg-surface border transition-all duration-200 ${
        task.completed
          ? "border-divider/50 bg-surface/50 opacity-80"
          : "border-divider hover:border-accent/40 shadow-subtle hover:shadow-card hover:-translate-y-0.5"
      }`}
    >
      <div className="flex items-start justify-between gap-3 sm:gap-4">
        {/* Checkbox button */}
        <div className="flex items-start gap-3.5 flex-1 min-w-0">
          {!task.completed ? (
            <button
              onClick={handleComplete}
              disabled={isCompleting || isProcessing}
              aria-label={`Mark as completed: ${task.title}`}
              title="Click to complete quest"
              className="relative w-8 h-8 mt-0.5 rounded-full border-2 border-divider dark:border-divider/80 hover:border-emerald-500 dark:hover:border-emerald-400 flex items-center justify-center transition-all duration-200 group-hover:scale-105 active:scale-95 shrink-0 bg-surface hover:bg-emerald-500/10 dark:hover:bg-emerald-500/20 shadow-sm"
            >
              {isCompleting ? (
                <Loader2 className="w-4 h-4 text-accent animate-spin" />
              ) : (
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 opacity-0 group-hover:opacity-80 transition-opacity" />
              )}
            </button>
          ) : (
            <div className="w-8 h-8 mt-0.5 rounded-full bg-emerald-600 dark:bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(16,185,129,0.35)]">
              <Check className="w-4 h-4 stroke-[3]" />
            </div>
          )}

          {/* Title & Metadata */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p
                className={`text-sm sm:text-base font-semibold tracking-tight transition-all ${
                  task.completed
                    ? "line-through text-text-muted opacity-75"
                    : "text-text-primary"
                }`}
              >
                {task.title}
              </p>

              {task.priority && (
                <span
                  className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${priorityColor}`}
                >
                  {task.priority}
                </span>
              )}
            </div>

            {task.description && (
              <p className="text-xs text-text-secondary mt-1 line-clamp-2 leading-relaxed">
                {task.description}
              </p>
            )}

            {/* Gym specific metadata */}
            {task.type === "gym" && task.gym && (
              <div className="flex items-center gap-2 mt-2 text-xs text-orange-800 dark:text-orange-200 bg-orange-50/80 dark:bg-orange-950/40 border border-orange-200/70 dark:border-orange-800/40 px-3 py-1.5 rounded-xl w-fit">
                <Dumbbell className="w-3.5 h-3.5 text-amber-500" />
                <span className="font-medium">
                  {task.gym.exercise || "Workout"} • {task.gym.muscleGroup || "Fitness"} •{" "}
                  {task.gym.sets ? `${task.gym.sets} sets × ${task.gym.reps || 10} reps` : `${task.gym.duration || 30} mins`}
                </span>
              </div>
            )}

            {/* Study specific metadata */}
            {task.type === "study" && task.study && (
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <div className="flex items-center gap-2 text-xs text-blue-800 dark:text-blue-200 bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/70 dark:border-blue-800/40 px-3 py-1.5 rounded-xl w-fit">
                  <BookOpen className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span className="font-medium">
                    {task.study.subject || "Study"} • {task.study.topic || "Deep Focus"} •{" "}
                    {task.study.duration || 25} mins
                  </span>
                </div>
                {(task.title.toLowerCase().includes("dsa") ||
                  task.study.subject?.toLowerCase().includes("dsa") ||
                  task.study.topic?.toLowerCase().includes("algorithm") ||
                  task.title.toLowerCase().includes("code")) && (
                  <Link
                    href="/study"
                    className="flex items-center gap-1 text-[11px] font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200/70 dark:border-indigo-700/50 px-2.5 py-1 rounded-xl transition-all shadow-subtle"
                  >
                    <Code2 className="w-3 h-3" />
                    <span>DSA Code Studio</span>
                  </Link>
                )}
              </div>
            )}

            {/* Tags row */}
            <div className="flex flex-wrap items-center gap-2.5 mt-2.5 text-xs text-text-secondary">
              <span className="inline-flex items-center gap-1 font-semibold px-2.5 py-0.5 rounded-lg bg-surface-secondary border border-divider/60 text-text-secondary">
                <Tag className="w-3 h-3" />
                <span>{task.category}</span>
              </span>

              <span className="inline-flex items-center gap-1 font-bold text-accent dark:text-amber-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                +{task.xpReward} XP
              </span>

              <span className="inline-flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400">
                <Coins className="w-3.5 h-3.5 text-amber-500" />
                +{task.coinReward}
              </span>

              {task.dueDate && (
                <span className="inline-flex items-center gap-1 text-text-muted">
                  <Calendar className="w-3 h-3" />
                  Due {task.dueDate}
                </span>
              )}

              {task.completedAt && (
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                  • Completed {formatDate(task.completedAt)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          {!task.completed && onEdit && (
            <button
              onClick={() => onEdit(task)}
              aria-label={`Edit quest: ${task.title}`}
              className="opacity-70 hover:opacity-100 text-text-secondary hover:text-text-primary p-2 rounded-xl hover:bg-surface-secondary transition-all active:scale-95"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            aria-label={`Delete quest: ${task.title}`}
            className="opacity-60 hover:opacity-100 text-text-secondary hover:text-red-500 p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 transition-all active:scale-95"
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
