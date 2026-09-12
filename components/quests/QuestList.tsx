"use client";

import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { TaskItem, CompletionResponse } from "@/types";
import { QuestCard } from "./QuestCard";
import { EmptyState } from "../ui/EmptyState";
import { Target, Brain, Dumbbell } from "lucide-react";

interface QuestListProps {
  tasks: TaskItem[];
  onCompleteQuest: (taskId: string, result: CompletionResponse) => void;
  onDeleteQuest: (taskId: string) => void;
  onOpenCreate?: () => void;
}

export function QuestList({
  tasks,
  onCompleteQuest,
  onDeleteQuest,
  onOpenCreate,
}: QuestListProps) {
  const [filter, setFilter] = useState<"all" | "intellect" | "willpower">("all");

  const filteredTasks = tasks.filter((t) => {
    if (filter === "all") return true;
    return t.category === filter;
  });

  return (
    <div className="space-y-4">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-accent" />
          <h3 className="text-lg font-bold text-text-primary tracking-tight">
            Active Quests ({tasks.length})
          </h3>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-slate-100/80 border border-divider/60 self-start sm:self-auto">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              filter === "all"
                ? "bg-white text-text-primary shadow-subtle"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("intellect")}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              filter === "intellect"
                ? "bg-white text-accent shadow-subtle"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <Brain className="w-3 h-3" />
            <span>Intellect</span>
          </button>
          <button
            onClick={() => setFilter("willpower")}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              filter === "willpower"
                ? "bg-white text-orange-600 shadow-subtle"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <Dumbbell className="w-3 h-3" />
            <span>Willpower</span>
          </button>
        </div>
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <EmptyState
          type="active"
          actionText="Create a Quest"
          onAction={onOpenCreate}
        />
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredTasks.map((task) => (
              <QuestCard
                key={task.id}
                task={task}
                onComplete={onCompleteQuest}
                onDelete={onDeleteQuest}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
