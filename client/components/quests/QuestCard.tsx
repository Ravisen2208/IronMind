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
      const res = await apiRequest<{ success: boolean; data: CompletionResponse }>(
        "/api/tasks/complete",
        {
          method: "POST",
          body: JSON.stringify({ taskId: task.id }),
        }
      );

      if (res.success && res.data?.data) {
        onComplete(task.id, res.data.data);
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
      ? "text-red-600 bg-red-50 border-red-200/60"
      : task.priority === "medium"
      ? "text-amber-600 bg-amber-50 border-amber-200/60"
      : "text-slate-600 bg-slate-50 border-slate-200/60";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, height: 0 }}
      transition={{ duration: 0.35, ease: appleEasing }}
      className={`group relative p-4 sm:p-5 rounded-3xl bg-surface border transition-all duration-200 ${
        task.completed
          ? "border-divider/50 bg-slate-50/50"
          : "border-divider/80 hover:border-divider shadow-subtle hover:shadow-card hover:-translate-y-0.5"
      }`}
    >
      <div className="flex items-start justify-between gap-3 sm:gap-4">
        {/* Checkbox button */}
        <div className="flex items-start gap-3.5 flex-1 min-w-0">
          {!task.completed ? (
            <button
              onClick={handleComplete}
              disabled={isCompleting || isProcessing}
              aria-label={`Complete quest: ${task.title}`}
              className="w-7 h-7 mt-0.5 rounded-full border-2 border-divider hover:border-accent flex items-center justify-center transition-all group-hover:scale-105 active:scale-95 shrink-0 hover:bg-accent/5"
            >
              {isCompleting ? (
                <Loader2 className="w-3.5 h-3.5 text-accent animate-spin" />
              ) : (
                <Check className="w-3.5 h-3.5 text-transparent hover:text-accent transition-colors" />
              )}
            </button>
          ) : (
            <div className="w-7 h-7 mt-0.5 rounded-full bg-success text-cream flex items-center justify-center shrink-0 shadow-sm">
              <Check className="w-4 h-4 stroke-[3]" />
            </div>
          )}

          {/* Title & Metadata */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p
                className={`text-sm sm:text-base font-semibold tracking-tight transition-all ${
                  task.completed
                    ? "line-through text-text-muted"
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
              <div className="flex items-center gap-2 mt-2 text-xs text-text-secondary bg-orange-50/60 border border-orange-200/50 px-2.5 py-1 rounded-xl w-fit">
                <Dumbbell className="w-3.5 h-3.5 text-warm" />
                <span>
                  {task.gym.exercise || "Workout"} • {task.gym.muscleGroup || "Fitness"} •{" "}
                  {task.gym.sets ? `${task.gym.sets} sets × ${task.gym.reps || 10} reps` : `${task.gym.duration || 30} mins`}
                </span>
              </div>
            )}

            {/* Study specific metadata */}
            {task.type === "study" && task.study && (
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <div className="flex items-center gap-2 text-xs text-text-secondary bg-blue-50/60 border border-blue-200/50 px-2.5 py-1 rounded-xl w-fit">
                  <BookOpen className="w-3.5 h-3.5 text-accent" />
                  <span>
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
                    className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/60 px-2.5 py-1 rounded-xl transition-all shadow-subtle"
                  >
                    <Code2 className="w-3 h-3" />
                    <span>DSA Code Studio</span>
                  </Link>
                )}
              </div>
            )}

            {/* Tags row */}
            <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-text-secondary">
              <span className="inline-flex items-center gap-1 font-medium px-2 py-0.5 rounded-md bg-slate-100 text-text-secondary">
                <Tag className="w-3 h-3" />
                <span>{task.category}</span>
              </span>

              <span className="inline-flex items-center gap-1 font-semibold text-accent">
                <Sparkles className="w-3 h-3" />
                +{task.xpReward} XP
              </span>

              <span className="inline-flex items-center gap-1 font-semibold text-warning">
                <Coins className="w-3 h-3" />
                +{task.coinReward}
              </span>

              {task.dueDate && (
                <span className="inline-flex items-center gap-1 text-text-muted">
                  <Calendar className="w-3 h-3" />
                  Due {task.dueDate}
                </span>
              )}

              {task.completedAt && (
                <span className="text-text-muted">
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
              className="opacity-70 hover:opacity-100 text-text-secondary hover:text-text-primary p-2 rounded-xl hover:bg-slate-100 transition-all active:scale-95"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            aria-label={`Delete quest: ${task.title}`}
            className="opacity-60 hover:opacity-100 text-text-secondary hover:text-danger p-2 rounded-xl hover:bg-red-50 transition-all active:scale-95"
          >
            {isDeleting ? (
              <Loader2 className="w-4 h-4 animate-spin text-danger" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
