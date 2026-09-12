import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/components/ui/Toast";
import { Navbar } from "@/components/ui/Navbar";
import { MobileBottomNav } from "@/components/ui/MobileBottomNav";
import { AnimatedBackground } from "@/components/animations/AnimatedBackground";

export const viewport: Viewport = {
  themeColor: "#EDE8E3",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "IronMind — Train your mind. Complete your quests. Become stronger.",
  description:
    "IronMind turns real-life tasks into an authoritative RPG progression system. Complete quests, build streaks, earn coins, and advance your attributes with Apple-grade design.",
  keywords: [
    "IronMind",
    "RPG Productivity",
    "Task Management",
    "Habit Tracking",
    "Mindset",
    "Self Improvement",
    "Focus",
  ],
  authors: [{ name: "IronMind Team" }],
};

import { CustomCursor } from "@/components/ui/CustomCursor";
import { WebsiteIntroLoader } from "@/components/animations/WebsiteIntroLoader";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-background text-text-primary antialiased selection:bg-champagne/40 selection:text-text-primary">
        <AuthProvider>
          <ToastProvider>
            <WebsiteIntroLoader />
            <CustomCursor />
            <AnimatedBackground />
            <Navbar />
            <main className="flex-1 pb-20 md:pb-8">{children}</main>
            <MobileBottomNav />
            <footer className="hidden md:block py-8 text-center text-xs text-text-secondary border-t border-divider/60">
              <div className="w-full px-4 sm:px-8 lg:px-12 text-center">
                <p className="font-medium">
                  IronMind &copy; {new Date().getFullYear()} — Train your mind. Complete your quests. Become stronger.
                </p>
                <p className="mt-1 text-[11px] opacity-70">
                  Built with Next.js 14, Firebase Authentication, Firestore Admin, and Gemini AI.
                </p>
              </div>
            </footer>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
