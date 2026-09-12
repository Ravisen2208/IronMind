"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import {
  Shield,
  Sparkles,
  LayoutDashboard,
  Target,
  Dumbbell,
  GraduationCap,
  BarChart3,
  User,
  LogOut,
} from "lucide-react";

export function Navbar() {
  const { user, userStats, isDemoMode, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const isLoggedIn = Boolean(user || isDemoMode);

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Quests", href: "/quests", icon: Target },
    { label: "Gym", href: "/gym", icon: Dumbbell },
    { label: "Study", href: "/study", icon: GraduationCap },
    { label: "Progress", href: "/progress", icon: BarChart3 },
    { label: "Profile", href: "/profile", icon: User },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-nav transition-all duration-200">
      <div className="w-full px-4 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link
          href={isLoggedIn ? "/dashboard" : "/"}
          className="flex items-center gap-2.5 group transition-transform active:scale-95 shrink-0"
        >
          <div className="w-9 h-9 rounded-2xl bg-accent flex items-center justify-center text-cream dark:text-dark-bg shadow-sm group-hover:bg-accent-hover transition-colors">
            <Shield className="w-5 h-5 fill-current opacity-20" />
          </div>
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-heading font-extrabold tracking-tight text-text-primary leading-tight">
              IronMind
            </span>
            <span className="text-[10px] uppercase font-bold tracking-[0.18em] text-bronze leading-none font-sans">
              Progression
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1.5">
          {isLoggedIn ? (
            <>
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <MagneticButton key={item.href} strength={0.25} dataCursorText={item.label}>
                    <Link
                      href={item.href}
                      className={`text-xs font-semibold px-3.5 py-2 rounded-full transition-all flex items-center gap-1.5 ${
                        isActive
                          ? "bg-accent/10 text-accent font-bold"
                          : "text-text-secondary hover:text-text-primary hover:bg-surface-secondary"
                      }`}
                    >
                      <item.icon className="w-3.5 h-3.5" />
                      <span>{item.label}</span>
                    </Link>
                  </MagneticButton>
                );
              })}
            </>
          ) : null}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          {/* Theme Switcher Toggle */}
          <ThemeToggle />

          {isLoggedIn ? (
            <>
              {userStats && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface border border-divider shadow-subtle text-xs font-semibold text-text-primary">
                  <Sparkles className="w-3.5 h-3.5 text-bronze" />
                  <span>Lv.{userStats.level}</span>
                </div>
              )}

              <MagneticButton strength={0.2}>
                <button
                  onClick={handleLogout}
                  className="hidden md:flex items-center gap-1 text-xs text-text-secondary hover:text-danger px-3 py-1.5 rounded-full hover:bg-danger-light transition-colors active:scale-95"
                  aria-label="Log out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </MagneticButton>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="text-xs font-semibold text-text-secondary hover:text-text-primary px-3 py-1.5 transition-colors"
              >
                Sign In
              </Link>
              <MagneticButton strength={0.3} dataCursorText="Start">
                <Link
                  href="/signup"
                  className="text-xs font-semibold bg-accent text-cream dark:text-dark-bg px-5 py-2.5 rounded-full hover:bg-accent-hover shadow-sm tracking-wide uppercase transition-all active:scale-95"
                >
                  Start Building
                </Link>
              </MagneticButton>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
