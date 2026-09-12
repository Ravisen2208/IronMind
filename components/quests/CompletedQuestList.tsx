"use client";

import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { TaskItem } from "@/types";
import { QuestCard } from "./QuestCard";
import { EmptyState } from "../ui/EmptyState";
import { CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";

interface CompletedQuestListProps {
  tasks: TaskItem[];
  onDeleteQuest: (taskId: string) => void;
}

export function CompletedQuestList({
  tasks,
  onDeleteQuest,
}: CompletedQuestListProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="space-y-4 pt-4 border-t border-divider">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-left group"
        >
          <div className="w-5 h-5 rounded-md bg-emerald-50 text-success flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <h3 className="text-lg font-bold text-text-primary tracking-tight">
            Completed Quests ({tasks.length})
          </h3>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-text-secondary group-hover:text-text-primary transition-colors" />
          ) : (
            <ChevronDown className="w-4 h-4 text-text-secondary group-hover:text-text-primary transition-colors" />
          )}
        </button>

        <span className="text-xs text-text-secondary font-medium">
          Authoritative History
        </span>
      </div>

      {isExpanded && (
        <>
          {tasks.length === 0 ? (
            <EmptyState type="completed" />
          ) : (
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {tasks.map((task) => (
                  <QuestCard
                    key={task.id}
                    task={task}
                    onDelete={onDeleteQuest}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </>
      )}
    </div>
  );
}
