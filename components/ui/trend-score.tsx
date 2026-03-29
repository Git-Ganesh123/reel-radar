"use client";

import { cn } from "@/lib/utils";

interface TrendScoreProps {
  value: number;
  label: string;
  size?: "sm" | "md";
}

function getScoreColor(value: number): string {
  if (value >= 80) return "text-brand-500";
  if (value >= 60) return "text-emerald-500";
  if (value >= 40) return "text-amber-500";
  return "text-ink-400";
}

function getScoreBg(value: number): string {
  if (value >= 80) return "bg-brand-50";
  if (value >= 60) return "bg-emerald-50";
  if (value >= 40) return "bg-amber-50";
  return "bg-ink-50";
}

export function TrendScore({ value, label, size = "md" }: TrendScoreProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-1 rounded-xl",
        getScoreBg(value),
        size === "md" ? "px-4 py-3" : "px-3 py-2"
      )}
    >
      <span
        className={cn(
          "font-semibold tabular-nums",
          getScoreColor(value),
          size === "md" ? "text-xl" : "text-lg"
        )}
      >
        {value}
      </span>
      <span className="text-[10px] font-medium uppercase tracking-wider text-ink-400">
        {label}
      </span>
    </div>
  );
}
