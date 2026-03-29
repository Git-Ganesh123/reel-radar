import { cn } from "@/lib/utils";
import type { LifecycleStage } from "@/types";
import { TrendingUp, Zap, Crown, TrendingDown } from "lucide-react";

const STAGE_CONFIG: Record<
  LifecycleStage,
  { color: string; bg: string; icon: typeof TrendingUp }
> = {
  Emerging: { color: "text-blue-600", bg: "bg-blue-50 border-blue-200", icon: Zap },
  Growing: { color: "text-brand-600", bg: "bg-brand-50 border-brand-200", icon: TrendingUp },
  Peak: { color: "text-amber-600", bg: "bg-amber-50 border-amber-200", icon: Crown },
  Declining: { color: "text-ink-500", bg: "bg-ink-50 border-ink-200", icon: TrendingDown },
};

interface LifecycleBadgeProps {
  stage: LifecycleStage;
}

export function LifecycleBadge({ stage }: LifecycleBadgeProps) {
  const config = STAGE_CONFIG[stage];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        config.bg,
        config.color
      )}
    >
      <Icon className="h-3 w-3" />
      {stage}
    </span>
  );
}
