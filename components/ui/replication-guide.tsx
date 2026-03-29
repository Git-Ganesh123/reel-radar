import type { ReplicationGuide as ReplicationGuideType } from "@/types";
import {
  Sparkles,
  Film,
  Clock,
  Scissors,
  Music2,
  Megaphone,
} from "lucide-react";

interface ReplicationGuideProps {
  guide: ReplicationGuideType;
}

const GUIDE_FIELDS = [
  { key: "hook" as const, label: "Hook", icon: Sparkles },
  { key: "format" as const, label: "Format", icon: Film },
  { key: "length" as const, label: "Length", icon: Clock },
  { key: "editing_style" as const, label: "Editing", icon: Scissors },
  { key: "music_type" as const, label: "Music", icon: Music2 },
  { key: "cta" as const, label: "CTA", icon: Megaphone },
];

export function ReplicationGuide({ guide }: ReplicationGuideProps) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-3">
        <Sparkles className="h-3.5 w-3.5 text-brand-500" />
        <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">
          Replication Guide
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {GUIDE_FIELDS.map(({ key, label, icon: Icon }) => (
          <div
            key={key}
            className="flex items-start gap-2.5 rounded-lg border border-ink-100 bg-ink-50/50 px-3 py-2.5"
          >
            <Icon className="h-4 w-4 text-ink-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-ink-400">
                {label}
              </p>
              <p className="text-sm text-ink-700 mt-0.5">{guide[key]}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
