import React from "react";
import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-slate-200/70 dark:bg-slate-700/40",
        className
      )}
      {...props}
    />
  );
}

export function DashboardSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-pulse">
      {/* Top Banner Skeleton */}
      <div className="h-44 rounded-3xl bg-slate-200/70 w-full" />

      {/* Attributes Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="h-28 rounded-2xl bg-slate-200/70" />
        <div className="h-28 rounded-2xl bg-slate-200/70" />
        <div className="h-28 rounded-2xl bg-slate-200/70" />
        <div className="h-28 rounded-2xl bg-slate-200/70" />
      </div>

      {/* Quests Section Skeleton */}
      <div className="space-y-4">
        <div className="h-10 w-48 rounded-xl bg-slate-200/70" />
        <div className="h-24 rounded-2xl bg-slate-200/70" />
        <div className="h-24 rounded-2xl bg-slate-200/70" />
      </div>
    </div>
  );
}
