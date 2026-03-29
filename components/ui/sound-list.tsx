import { Music } from "lucide-react";

interface SoundListProps {
  sounds: string[];
}

export function SoundList({ sounds }: SoundListProps) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-2">
        <Music className="h-3.5 w-3.5 text-ink-400" />
        <span className="text-xs font-medium uppercase tracking-wider text-ink-400">
          Trending Sounds
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {sounds.map((sound) => (
          <span
            key={sound}
            className="flex items-center gap-1.5 rounded-lg border border-ink-200 bg-white px-3 py-1.5 text-xs text-ink-700"
          >
            <Music className="h-3 w-3 text-brand-500" />
            {sound}
          </span>
        ))}
      </div>
    </div>
  );
}
