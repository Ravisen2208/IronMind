"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  Target,
  Dumbbell,
  GraduationCap,
  BarChart3,
  User,
} from "lucide-react";

export function MobileBottomNav() {
  const { user, isDemoMode } = useAuth();
  const pathname = usePathname();

  const isLoggedIn = Boolean(user || isDemoMode);
  if (!isLoggedIn) return null;

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Quests", href: "/quests", icon: Target },
    { label: "Gym", href: "/gym", icon: Dumbbell },
    { label: "Study", href: "/study", icon: GraduationCap },
    { label: "Progress", href: "/progress", icon: BarChart3 },
    { label: "Profile", href: "/profile", icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/90 backdrop-blur-xl border-t border-divider/60 py-1.5 px-2 safe-area-pb">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all active:scale-95 ${
                isActive
                  ? "text-accent font-semibold"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <item.icon
                className={`w-5 h-5 transition-transform ${
                  isActive ? "scale-110 stroke-[2.5]" : "stroke-[1.8]"
                }`}
              />
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
