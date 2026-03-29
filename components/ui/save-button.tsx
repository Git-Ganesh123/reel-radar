"use client";

import { useState } from "react";
import { Bookmark, Check, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { useSaveTrend } from "@/hooks/use-saved";
import type { Trend } from "@/types";
import { LoginPromptModal } from "./login-prompt-modal";

interface SaveButtonProps {
  trend: Trend;
  isSaved?: boolean;
  onSaved?: () => void;
}

export function SaveButton({ trend, isSaved: initialSaved, onSaved }: SaveButtonProps) {
  const { user } = useAuth();
  const saveMutation = useSaveTrend();
  const [saved, setSaved] = useState(initialSaved ?? false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  async function handleSave() {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    if (saved) return;

    try {
      await saveMutation.mutateAsync(trend);
      setSaved(true);
      onSaved?.();
    } catch {
      // If already saved (409), mark as saved
      setSaved(true);
    }
  }

  return (
    <>
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={handleSave}
        disabled={saveMutation.isPending || saved}
        className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
          saved
            ? "bg-brand-50 text-brand-600 border border-brand-200"
            : "bg-white text-ink-700 border border-ink-200 hover:border-brand-300 hover:text-brand-600"
        } disabled:opacity-70`}
      >
        {saveMutation.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : saved ? (
          <Check className="h-4 w-4" />
        ) : (
          <Bookmark className="h-4 w-4" />
        )}
        {saved ? "Saved" : "Save"}
      </motion.button>

      <LoginPromptModal
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
}
