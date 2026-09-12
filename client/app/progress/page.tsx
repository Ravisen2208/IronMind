"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { TaskItem } from "@/types";
import { apiRequest } from "@/lib/api";
import { ProgressCharts } from "@/components/progress/ProgressCharts";
import { FadeIn } from "@/components/animations/MotionWrapper";

export default function ProgressPage() {
  const { user, isDemoMode, loading } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<TaskItem[]>([]);

  useEffect(() => {
    if (!loading && !user && !isDemoMode) {
      router.push("/login");
    }
  }, [user, isDemoMode, loading, router]);

  useEffect(() => {
    if (user || isDemoMode) {
      apiRequest<{ success: boolean; tasks: TaskItem[] }>("/api/tasks")
        .then((res) => {
          if (res.success && res.data?.tasks) {
            setTasks(res.data.tasks);
          }
        })
        .catch(() => {});
    }
  }, [user, isDemoMode]);

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 py-8 space-y-6">
      <FadeIn yOffset={10}>
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-serif tracking-tight text-text-primary">
            Progress & Analytics
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            Holistic view of your consistency, focus hours, workout sessions, and milestone streaks.
          </p>
        </div>
      </FadeIn>

      <ProgressCharts tasks={tasks} />
    </div>
  );
}
