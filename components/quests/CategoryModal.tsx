"use client";

import React, { useState } from "react";
import { X, Plus, Loader2, Tag, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { appleEasing } from "../animations/MotionWrapper";
import { apiRequest } from "@/lib/api";
import { CategoryItem } from "@/types";
import { useToast } from "../ui/Toast";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCategoryCreated: (cat: CategoryItem) => void;
}

const PALETTE = [
  "#0071E3", // Apple Blue
  "#34C759", // Apple Green
  "#FF9F0A", // Apple Orange
  "#5856D6", // Apple Purple
  "#AF52DE", // Apple Indigo
  "#FF2D55", // Apple Pink
  "#6E6E73", // Apple Slate
];

const ICONS = ["Tag", "Code", "Book", "Briefcase", "Dumbbell", "Sparkles", "Heart", "Music", "Coffee", "Compass"];

export function CategoryModal({ isOpen, onClose, onCategoryCreated }: CategoryModalProps) {
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState(PALETTE[0]);
  const [selectedIcon, setSelectedIcon] = useState(ICONS[0]);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) {
      showToast("Please enter a category name.", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await apiRequest<{ success: boolean; category: CategoryItem }>("/api/categories", {
        method: "POST",
        body: JSON.stringify({
          name: cleanName,
          color: selectedColor,
          icon: selectedIcon,
        }),
      });

      if (res.success && res.data?.category) {
        onCategoryCreated(res.data.category);
        showToast(`Category "${cleanName}" created!`, "success");
        setName("");
        onClose();
      } else {
        showToast(res.error || "Failed to create category.", "error");
      }
    } catch {
      showToast("Error creating category.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/35 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.25, ease: appleEasing }}
            className="relative z-10 w-full max-w-md rounded-3xl bg-surface p-6 border border-divider shadow-float space-y-5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-sm"
                  style={{ backgroundColor: selectedColor }}
                >
                  <Tag className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-text-primary tracking-tight">
                  New Custom Category
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-full text-text-secondary hover:text-text-primary hover:bg-slate-100 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  maxLength={24}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Interview Prep, Music, Finance"
                  className="w-full px-4 py-2.5 rounded-xl border border-divider bg-slate-50 text-text-primary text-sm focus:bg-white transition-all outline-none"
                />
              </div>

              {/* Color Swatches */}
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-2 uppercase tracking-wider">
                  Accent Color
                </label>
                <div className="flex items-center gap-2.5">
                  {PALETTE.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className="w-7 h-7 rounded-full transition-transform flex items-center justify-center relative hover:scale-110 active:scale-95 shadow-sm"
                      style={{ backgroundColor: color }}
                    >
                      {selectedColor === color && (
                        <Check className="w-4 h-4 text-white stroke-[3]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-full border border-divider text-xs font-semibold text-text-secondary hover:bg-slate-50 transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !name.trim()}
                  className="flex-1 py-2.5 rounded-full bg-accent hover:bg-accent-hover text-white text-xs font-semibold shadow-sm transition-all active:scale-95 flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  <span>Create Category</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
