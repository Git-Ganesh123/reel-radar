"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, LogIn } from "lucide-react";
import Link from "next/link";

interface LoginPromptModalProps {
  open: boolean;
  onClose: () => void;
}

export function LoginPromptModal({ open, onClose }: LoginPromptModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-sm rounded-2xl border border-ink-200 bg-white p-6 shadow-xl">
              <button
                onClick={onClose}
                className="absolute right-4 top-4 rounded-lg p-1 text-ink-400 hover:bg-ink-50 hover:text-ink-700"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-50">
                  <LogIn className="h-6 w-6 text-brand-600" />
                </div>
                <h3 className="text-lg font-semibold text-ink-900">
                  Sign in to save trends
                </h3>
                <p className="mt-1.5 text-sm text-ink-500">
                  Create a free account to save trends and access them anytime.
                </p>

                <div className="mt-6 space-y-2.5">
                  <Link
                    href="/auth/login"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-ink-900 py-2.5 text-sm font-medium text-white transition-colors hover:bg-ink-700"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-ink-200 bg-white py-2.5 text-sm font-medium text-ink-700 transition-colors hover:bg-ink-50"
                  >
                    Create account
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
