import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-3xl bg-accent-light text-accent flex items-center justify-center mb-4">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-bold text-text-primary tracking-tight">
        404 — Quest Not Found
      </h1>
      <p className="text-sm text-text-secondary mt-2 max-w-sm">
        The realm or quest you are looking for has moved, expired, or does not exist.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent text-white text-sm font-semibold hover:bg-accent-hover transition-all active:scale-95 shadow-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to IronMind</span>
      </Link>
    </div>
  );
}
