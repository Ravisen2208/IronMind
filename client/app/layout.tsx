import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { ToastProvider } from "@/components/ui/Toast";
import { Navbar } from "@/components/ui/Navbar";
import { MobileBottomNav } from "@/components/ui/MobileBottomNav";
import { AnimatedBackground } from "@/components/animations/AnimatedBackground";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { WebsiteIntroLoader } from "@/components/animations/WebsiteIntroLoader";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#EDE8E3" },
    { media: "(prefers-color-scheme: dark)", color: "#0C0D12" },
  ],
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const stored = localStorage.getItem('ironmind_theme');
                  const isDark = stored === 'dark' || (!stored && true) || (stored === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.style.colorScheme = 'dark';
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.style.colorScheme = 'light';
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-background text-text-primary antialiased selection:bg-champagne/40 selection:text-text-primary transition-colors duration-200">
        <ThemeProvider>
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
        </ThemeProvider>
      </body>
    </html>
  );
}
