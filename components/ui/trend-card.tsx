"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, TrendingUp, BarChart3 } from "lucide-react";
import type { Trend } from "@/types";
import { cn } from "@/lib/utils";
import { TrendScore } from "./trend-score";
import { LifecycleBadge } from "./lifecycle-badge";
import { VideoCarousel } from "./video-carousel";
import { HashtagList } from "./hashtag-list";
import { CaptionList } from "./caption-list";
import { SoundList } from "./sound-list";
import { ReplicationGuide } from "./replication-guide";
import { SaveButton } from "./save-button";

interface TrendCardProps {
  trend: Trend;
  index: number;
}

export function TrendCard({ trend, index }: TrendCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
      className="group rounded-2xl border border-ink-200 bg-white shadow-card transition-shadow hover:shadow-card-hover"
    >
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          {/* Left: info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-ink-400">
                #{index + 1}
              </span>
              <LifecycleBadge stage={trend.lifecycle_stage} />
            </div>

            <h3 className="text-lg font-semibold text-ink-900 leading-snug">
              {trend.trend_name}
            </h3>

            <p className="mt-1.5 text-sm text-ink-500 leading-relaxed line-clamp-2">
              {trend.description}
            </p>

            {/* Quick stats */}
            <div className="mt-3 flex items-center gap-4 text-xs text-ink-400">
              <span className="flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5" />
                {trend.growth_rate > 0 ? "+" : ""}
                {trend.growth_rate}% growth
              </span>
              <span className="flex items-center gap-1">
                <BarChart3 className="h-3.5 w-3.5" />
                {trend.saturation_level}% saturated
              </span>
            </div>
          </div>

          {/* Right: scores + actions */}
          <div className="flex items-center gap-2 sm:flex-col sm:items-end sm:gap-3">
            <div className="flex gap-2">
              <TrendScore value={trend.virality_score} label="Viral" />
              <TrendScore value={trend.opportunity_score} label="Opp." />
            </div>
            <SaveButton trend={trend} />
          </div>
        </div>

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-4 flex w-full items-center justify-center gap-1 rounded-lg py-1.5 text-xs font-medium text-ink-400 transition-colors hover:bg-ink-50 hover:text-ink-700"
        >
          {expanded ? "Show less" : "View details"}
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 transition-transform",
              expanded && "rotate-180"
            )}
          />
        </button>
      </div>

      {/* ── Expanded Detail ────────────────────────────────────────── */}
      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          transition={{ duration: 0.25 }}
          className="border-t border-ink-100"
        >
          <div className="p-5 sm:p-6 space-y-6">
            {/* Example Videos */}
            {trend.videos.length > 0 && (
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-ink-400 mb-2">
                  Example Videos
                </p>
                <VideoCarousel videos={trend.videos} />
              </div>
            )}

            {/* Hashtags */}
            <HashtagList hashtags={trend.hashtags} />

            {/* Captions */}
            <CaptionList captions={trend.captions} />

            {/* Sounds */}
            <SoundList sounds={trend.sounds} />

            {/* Replication Guide */}
            <ReplicationGuide guide={trend.replication_guide} />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
