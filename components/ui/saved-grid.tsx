"use client";

import { motion } from "framer-motion";
import { Trash2, Loader2, TrendingUp, Calendar } from "lucide-react";
import { useRemoveSaved } from "@/hooks/use-saved";
import { LifecycleBadge } from "./lifecycle-badge";
import { TrendScore } from "./trend-score";
import type { SavedItem } from "@/types";
import { formatDate } from "@/lib/utils";

interface SavedGridProps {
  items: SavedItem[];
}

export function SavedGrid({ items }: SavedGridProps) {
  const removeMutation = useRemoveSaved();

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-ink-50">
          <TrendingUp className="h-6 w-6 text-ink-300" />
        </div>
        <h3 className="text-lg font-medium text-ink-900">No saved trends</h3>
        <p className="mt-1 text-sm text-ink-500">
          Search for a niche and save trends you want to replicate.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item, i) => {
        const trend = item.trend_data;
        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="rounded-2xl border border-ink-200 bg-white p-5 shadow-card transition-shadow hover:shadow-card-hover"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <LifecycleBadge stage={trend.lifecycle_stage} />
                <h3 className="mt-2 text-[15px] font-semibold text-ink-900 leading-snug truncate">
                  {trend.trend_name}
                </h3>
              </div>
              <button
                onClick={() => removeMutation.mutate(item.id)}
                disabled={removeMutation.isPending}
                className="flex-shrink-0 rounded-lg p-1.5 text-ink-400 transition-colors hover:bg-red-50 hover:text-red-500"
                title="Remove"
              >
                {removeMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </button>
            </div>

            <div className="mt-3 flex gap-2">
              <TrendScore
                value={trend.virality_score}
                label="Viral"
                size="sm"
              />
              <TrendScore
                value={trend.opportunity_score}
                label="Opp."
                size="sm"
              />
            </div>

            <div className="mt-3 flex items-center gap-1 text-xs text-ink-400">
              <Calendar className="h-3 w-3" />
              Saved {formatDate(item.created_at)}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
