import { Hash } from "lucide-react";

interface HashtagListProps {
  hashtags: string[];
}

export function HashtagList({ hashtags }: HashtagListProps) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-2">
        <Hash className="h-3.5 w-3.5 text-ink-400" />
        <span className="text-xs font-medium uppercase tracking-wider text-ink-400">
          Hashtags
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {hashtags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
