"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { FadeIn } from "@/components/animations/MotionWrapper";
import { useToast } from "@/components/ui/Toast";
import {
  User,
  Shield,
  Sparkles,
  Flame,
  Coins,
  Bell,
  Eye,
  LogOut,
  Moon,
  CheckCircle2,
  Lock,
} from "lucide-react";

export default function ProfilePage() {
  const { user, userStats, isDemoMode, logout, loading } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();

  const [reducedMotion, setReducedMotion] = useState(false);
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    if (!loading && !user && !isDemoMode) {
      router.push("/login");
    }
  }, [user, isDemoMode, loading, router]);

  const handleLogout = async () => {
    await logout();
    showToast("Signed out of IronMind.", "info");
    router.push("/");
  };

  const toggleReducedMotion = () => {
    const next = !reducedMotion;
    setReducedMotion(next);
    if (next) {
      document.documentElement.classList.add("reduced-motion");
      showToast("Reduced motion enabled.", "info");
    } else {
      document.documentElement.classList.remove("reduced-motion");
      showToast("Default fluid animations restored.", "info");
    }
  };

  const toggleNotifications = () => {
    setNotifications(!notifications);
    showToast(`Notifications ${!notifications ? "enabled" : "muted"}.`, "info");
  };

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 py-8 space-y-6">
      <FadeIn yOffset={10}>
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight text-text-primary">
            Profile & Settings
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            Manage your account credentials, RPG progression records, and preferences.
          </p>
        </div>
      </FadeIn>

      {/* Account Identity Card */}
      <div className="p-6 rounded-3xl bg-surface border border-divider/70 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-accent-hover text-white flex items-center justify-center shadow-md shadow-accent/20">
            <User className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-text-primary">
                {user?.email ? user.email.split("@")[0] : "IronMind Warrior"}
              </h2>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-success border border-success/20">
                {isDemoMode ? "Guest Sandbox" : "Verified Account"}
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-0.5">
              {user?.email || "demo@ironmind.app"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right sm:block hidden">
            <div className="text-xs font-bold text-text-primary">
              Level {userStats?.level ?? 1}
            </div>
            <div className="text-[11px] text-accent font-semibold">
              {userStats?.xp ?? 0} XP
            </div>
          </div>
        </div>
      </div>

      {/* Progression Records Summary */}
      <div className="p-6 rounded-3xl bg-surface border border-divider/70 shadow-subtle space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary">
          Progression Overview
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-divider/60 text-center">
            <div className="text-[10px] uppercase font-bold text-text-secondary">Level</div>
            <div className="text-xl font-bold text-text-primary mt-0.5">
              {userStats?.level ?? 1}
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-divider/60 text-center">
            <div className="text-[10px] uppercase font-bold text-text-secondary">XP</div>
            <div className="text-xl font-bold text-accent mt-0.5">
              {userStats?.xp ?? 0}
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-divider/60 text-center">
            <div className="text-[10px] uppercase font-bold text-text-secondary">Coins</div>
            <div className="text-xl font-bold text-warm mt-0.5">
              {userStats?.coins ?? 50}
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-divider/60 text-center">
            <div className="text-[10px] uppercase font-bold text-text-secondary">Streak</div>
            <div className="text-xl font-bold text-success mt-0.5">
              {userStats?.streak ?? 0}d
            </div>
          </div>
        </div>
      </div>

      {/* Settings Group */}
      <div className="p-6 rounded-3xl bg-surface border border-divider/70 shadow-subtle space-y-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary">
          Preferences & Accessibility
        </h3>

        {/* Reduced Motion Toggle */}
        <div className="flex items-center justify-between py-2 border-b border-divider/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-text-secondary flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-text-primary">Reduced Motion</div>
              <div className="text-xs text-text-secondary">
                Minimizes background parallax and continuous animations
              </div>
            </div>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={reducedMotion}
            onClick={toggleReducedMotion}
            className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
              reducedMotion ? "bg-accent" : "bg-slate-200"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                reducedMotion ? "translate-x-5 shadow-sm" : "translate-x-0 shadow-sm"
              }`}
            />
          </button>
        </div>

        {/* Notifications Toggle */}
        <div className="flex items-center justify-between py-2 border-b border-divider/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-text-secondary flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-text-primary">In-App Notifications</div>
              <div className="text-xs text-text-secondary">
                Toasts and sound cues upon quest completion & level-up
              </div>
            </div>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={notifications}
            onClick={toggleNotifications}
            className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
              notifications ? "bg-accent" : "bg-slate-200"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                notifications ? "translate-x-5 shadow-sm" : "translate-x-0 shadow-sm"
              }`}
            />
          </button>
        </div>

        {/* Logout Action */}
        <div className="pt-2 flex justify-between items-center">
          <div>
            <div className="text-sm font-semibold text-text-primary">Sign Out</div>
            <div className="text-xs text-text-secondary">End current active session</div>
          </div>

          <button
            onClick={handleLogout}
            className="px-5 py-2.5 rounded-full bg-red-50 hover:bg-red-100 text-danger text-xs font-semibold transition-all active:scale-95 flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
