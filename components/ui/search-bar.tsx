"use client";

import { useState, type FormEvent } from "react";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { NICHE_OPTIONS } from "@/lib/constants";

interface SearchBarProps {
  onSearch: (niche: string) => void;
  isLoading?: boolean;
}

export function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [value, setValue] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed && !isLoading) {
      onSearch(trimmed);
    }
  }

  function handleQuickSelect(niche: string) {
    if (!isLoading) {
      setValue(niche);
      onSearch(niche);
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="relative group">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <Search className="h-5 w-5 text-ink-400 transition-colors group-focus-within:text-brand-500" />
          </div>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Search a niche (gym, fashion, business…)"
            disabled={isLoading}
            className="w-full rounded-2xl border border-ink-200 bg-white py-4 pl-12 pr-4 text-[15px] text-ink-900 placeholder:text-ink-400 shadow-soft transition-all focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:opacity-60"
          />
          {value.trim() && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              type="submit"
              disabled={isLoading}
              className="absolute inset-y-2 right-2 flex items-center rounded-xl bg-brand-500 px-5 text-sm font-medium text-white transition-colors hover:bg-brand-600 disabled:opacity-60"
            >
              Search
            </motion.button>
          )}
        </div>
      </form>

      {/* Quick-select niche buttons */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <span className="text-xs text-ink-400 mr-1">Try:</span>
        {NICHE_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => handleQuickSelect(option.value)}
            disabled={isLoading}
            className="rounded-full border border-ink-200 bg-white px-3.5 py-1.5 text-xs font-medium text-ink-700 transition-all hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 active:scale-95 disabled:opacity-50"
          >
            {option.emoji} {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
