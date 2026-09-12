"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Lock, Mail, Loader2, ArrowRight, Sparkles, ShieldCheck } from "lucide-react";
import { ErrorMessage } from "../ui/ErrorMessage";

export function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup, loginAsDemo } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const res = await signup(email.trim(), password);
    if (res.success) {
      router.push("/dashboard");
    } else {
      setError(res.error || "Failed to create account.");
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    loginAsDemo();
    router.push("/dashboard");
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 rounded-3xl bg-surface border border-divider/70 shadow-card">
      <div className="text-center mb-6">
        <div className="w-12 h-12 rounded-2xl bg-accent-light text-accent flex items-center justify-center mx-auto mb-3">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-text-primary tracking-tight">
          Begin Your IronMind Journey
        </h2>
        <p className="text-xs sm:text-sm text-text-secondary mt-1">
          Forge discipline, complete quests, and build unbreakable habits.
        </p>
      </div>

      {error && (
        <div className="mb-4">
          <ErrorMessage message={error} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-text-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="warrior@ironmind.app"
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-divider bg-slate-50/50 text-text-primary text-sm focus:bg-white transition-all outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">
            Create Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-text-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-divider bg-slate-50/50 text-text-primary text-sm focus:bg-white transition-all outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-text-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat password"
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-divider bg-slate-50/50 text-text-primary text-sm focus:bg-white transition-all outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-full bg-accent hover:bg-accent-hover text-white text-sm font-semibold shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <span>Initialize Character</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="relative my-6 text-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-divider" />
        </div>
        <span className="relative px-3 bg-surface text-xs uppercase tracking-wider text-text-secondary">
          Or Quick Test
        </span>
      </div>

      <button
        type="button"
        onClick={handleDemoLogin}
        className="w-full py-3 rounded-full bg-slate-100 hover:bg-slate-200/80 text-text-primary text-xs font-semibold transition-all active:scale-95 flex items-center justify-center gap-2 border border-divider/60"
      >
        <Sparkles className="w-3.5 h-3.5 text-accent" />
        <span>Try Instant Demo Mode</span>
      </button>

      <p className="text-center text-xs text-text-secondary mt-6">
        Already registered?{" "}
        <Link href="/" className="text-accent font-semibold hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
}
