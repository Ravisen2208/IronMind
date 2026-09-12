"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "@/lib/firebase";
import { apiRequest } from "@/lib/api";

export interface UserStats {
  uid: string;
  email: string | null;
  level: number;
  xp: number;
  coins: number;
  streak: number;
  longestStreak?: number;
  lastCompletedDate: string | null;
  attributes: {
    intellect: number;
    willpower: number;
  };
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  userStats: UserStats | null;
  loading: boolean;
  isDemoMode: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  loginAsDemo: () => void;
  logout: () => Promise<void>;
  refreshStats: () => Promise<void>;
  updateLocalStats: (stats: UserStats) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);

  const fetchProfile = async () => {
    const res = await apiRequest<{ success: boolean; profile: UserStats }>("/api/user/me");
    if (res.success && res.data?.profile) {
      setUserStats(res.data.profile);
    }
  };

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      // Check if previously logged in as demo
      const savedDemoUid = localStorage.getItem("ironmind_demo_uid");
      if (savedDemoUid) {
        setIsDemoMode(true);
        fetchProfile().finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await fetchProfile();
      } else {
        setUserStats(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
      if (!isFirebaseConfigured()) {
        loginAsDemo();
        return { success: true };
      }

      const userCred = await signInWithEmailAndPassword(auth, email, pass);
      setUser(userCred.user);
      await fetchProfile();
      return { success: true };
    } catch (err: any) {
      console.error("Login error:", err);
      let message = "Invalid email or password.";
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        message = "Incorrect email or password.";
      } else if (err.code === "auth/too-many-requests") {
        message = "Too many attempts. Please try again later.";
      } else if (err.message) {
        message = err.message;
      }
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, pass: string) => {
    setLoading(true);
    try {
      if (!isFirebaseConfigured()) {
        loginAsDemo();
        return { success: true };
      }

      const userCred = await createUserWithEmailAndPassword(auth, email, pass);
      setUser(userCred.user);

      // Initialize character in Firestore via verified server API
      const initRes = await apiRequest<{ success: boolean; profile: UserStats }>("/api/user/init", {
        method: "POST",
      });

      if (initRes.success && initRes.data?.profile) {
        setUserStats(initRes.data.profile);
      }

      return { success: true };
    } catch (err: any) {
      console.error("Signup error:", err);
      let message = "Failed to create account.";
      if (err.code === "auth/email-already-in-use") {
        message = "This email is already registered. Please log in.";
      } else if (err.code === "auth/weak-password") {
        message = "Password should be at least 6 characters.";
      } else if (err.message) {
        message = err.message;
      }
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const loginAsDemo = () => {
    let demoUid = localStorage.getItem("ironmind_demo_uid");
    if (!demoUid) {
      demoUid = `warrior_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem("ironmind_demo_uid", demoUid);
    }
    setIsDemoMode(true);
    fetchProfile().finally(() => setLoading(false));
  };

  const logout = async () => {
    setLoading(true);
    try {
      if (isFirebaseConfigured()) {
        await signOut(auth);
      }
      localStorage.removeItem("ironmind_demo_uid");
      setUser(null);
      setUserStats(null);
      setIsDemoMode(false);
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateLocalStats = (stats: UserStats) => {
    setUserStats(stats);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userStats,
        loading,
        isDemoMode,
        login,
        signup,
        loginAsDemo,
        logout,
        refreshStats: fetchProfile,
        updateLocalStats,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
