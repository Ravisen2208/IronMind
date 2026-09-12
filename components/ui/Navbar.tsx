"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Shield, Sparkles, LogOut, User as UserIcon } from "lucide-react";

export function Navbar() {
  const { user, userStats, isDemoMode, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const isLoggedIn = Boolean(user || isDemoMode);

  return (
    <header className="sticky top-0 z-40 w-full glass-nav transition-all duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link
          href={isLoggedIn ? "/dashboard" : "/"}
          className="flex items-center gap-2.5 group transition-transform active:scale-95"
        >
          <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center text-white shadow-sm shadow-accent/30 group-hover:bg-accent-hover transition-colors">
            <Shield className="w-5 h-5 fill-white/20" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold tracking-tight text-text-primary leading-tight">
              IronMind
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-accent leading-none">
              Progression
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <Link
                href="/dashboard"
                className={`text-sm font-medium px-3.5 py-1.5 rounded-full transition-all ${
                  pathname === "/dashboard"
                    ? "bg-accent/10 text-accent font-semibold"
                    : "text-text-secondary hover:text-text-primary hover:bg-black/5"
                }`}
              >
                Dashboard
              </Link>

              {userStats && (
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface border border-divider shadow-subtle text-xs font-semibold text-text-primary">
                  <Sparkles className="w-3.5 h-3.5 text-accent" />
                  <span>Level {userStats.level}</span>
                </div>
              )}

              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-red-600 px-3 py-1.5 rounded-full hover:bg-red-50 transition-colors active:scale-95"
                aria-label="Log out of IronMind"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="text-sm font-medium text-text-secondary hover:text-text-primary px-3 py-1.5 transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="text-sm font-medium bg-accent text-white px-4 py-1.5 rounded-full hover:bg-accent-hover shadow-sm transition-all active:scale-95"
              >
                Sign Up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
