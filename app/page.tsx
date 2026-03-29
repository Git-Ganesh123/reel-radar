"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Radar, ArrowRight } from "lucide-react";
import { SearchBar } from "@/components/ui/search-bar";
import { TrendCard } from "@/components/ui/trend-card";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { useTrends } from "@/hooks/use-trends";

export default function HomePage() {
  const [searchNiche, setSearchNiche] = useState<string | null>(null);
  const { data, isLoading, isError } = useTrends(searchNiche);

  const hasResults = data && data.trends.length > 0;
  const showHero = !searchNiche && !isLoading;

  function handleSearch(niche: string) {
    setSearchNiche(niche);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6">
      {/* ── Hero Section ─────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {showHero && (
          <motion.div
            key="hero"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="pt-24 pb-12 text-center"
          >
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500 text-white shadow-lg shadow-brand-500/20">
              <Radar className="h-7 w-7" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-semibold text-ink-900 tracking-tight">
              Find your next
              <br />
              <span className="text-brand-500">viral trend</span>
            </h1>
            <p className="mt-4 text-lg text-ink-500 max-w-md mx-auto leading-relaxed">
              Discover the top trending Reels and TikTok formats in any niche.
              Get data-driven intelligence to create content that goes viral.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Search Bar ───────────────────────────────────────────── */}
      <div className={showHero ? "pb-20" : "pt-8 pb-8"}>
        <SearchBar onSearch={handleSearch} isLoading={isLoading} />
      </div>

      {/* ── Loading State ────────────────────────────────────────── */}
      {isLoading && (
        <div className="pb-16">
          <LoadingSkeleton />
        </div>
      )}

      {/* ── Error State ──────────────────────────────────────────── */}
      {isError && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center"
        >
          <p className="text-sm font-medium text-red-600">
            Something went wrong. Please try searching again.
          </p>
        </motion.div>
      )}

      {/* ── Results ──────────────────────────────────────────────── */}
      {hasResults && !isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="pb-16"
        >
          {/* Results header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-ink-900">
                Top trends in{" "}
                <span className="text-brand-600 capitalize">
                  {data.niche}
                </span>
              </h2>
              <p className="mt-0.5 text-sm text-ink-400">
                {data.trends.length} trends ranked by opportunity
              </p>
            </div>
            <button
              onClick={() => setSearchNiche(null)}
              className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-ink-500 transition-colors hover:bg-ink-50 hover:text-ink-900"
            >
              New search
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          {/* Trend cards */}
          <div className="space-y-4">
            {data.trends.map((trend, i) => (
              <TrendCard key={trend.trend_id} trend={trend} index={i} />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
