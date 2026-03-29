"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { LOADING_MESSAGES } from "@/lib/constants";

export function LoadingSkeleton() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) =>
        prev < LOADING_MESSAGES.length - 1 ? prev + 1 : prev
      );
    }, 1400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Loading message */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <Loader2 className="h-4 w-4 animate-spin text-brand-500" />
        <AnimatePresence mode="wait">
          <motion.span
            key={messageIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="text-sm font-medium text-ink-500"
          >
            {LOADING_MESSAGES[messageIndex]}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Skeleton cards */}
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl border border-ink-200 bg-white p-6"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-3 flex-1">
                <div className="h-5 w-48 rounded-lg bg-ink-100 animate-pulse" />
                <div className="h-4 w-72 rounded-lg bg-ink-100/70 animate-pulse" />
                <div className="flex gap-2 mt-2">
                  <div className="h-6 w-16 rounded-full bg-ink-100 animate-pulse" />
                  <div className="h-6 w-20 rounded-full bg-ink-100 animate-pulse" />
                  <div className="h-6 w-14 rounded-full bg-ink-100 animate-pulse" />
                </div>
              </div>
              <div className="flex gap-3">
                <div className="h-12 w-12 rounded-xl bg-ink-100 animate-pulse" />
                <div className="h-12 w-12 rounded-xl bg-ink-100 animate-pulse" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
