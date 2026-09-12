import React from "react";
import { cn } from "@/lib/utils";
import { CoolLoadingSpinner } from "./CoolLoadingAnimation";

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-surface/80 dark:bg-white/5 border border-divider/60 backdrop-blur-sm",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 dark:via-white/5 to-transparent animate-[shimmer_2s_infinite]" />
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 py-8 space-y-8">
      {/* Top Banner Loader */}
      <div className="relative overflow-hidden rounded-3xl bg-surface/90 dark:bg-surface-card border border-divider/70 p-8 shadow-card flex items-center justify-center">
        <CoolLoadingSpinner size="md" text="Loading Warrior Profile & RPG Attributes..." />
      </div>

      {/* Attributes Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>

      {/* Quests Section Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-10 w-48 rounded-2xl" />
        <Skeleton className="h-28 rounded-3xl" />
        <Skeleton className="h-28 rounded-3xl" />
      </div>
    </div>
  );
}
