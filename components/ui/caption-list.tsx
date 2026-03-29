import { MessageSquare } from "lucide-react";

interface CaptionListProps {
  captions: string[];
}

export function CaptionList({ captions }: CaptionListProps) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-2">
        <MessageSquare className="h-3.5 w-3.5 text-ink-400" />
        <span className="text-xs font-medium uppercase tracking-wider text-ink-400">
          Caption Ideas
        </span>
      </div>
      <div className="space-y-1.5">
        {captions.map((caption, i) => (
          <p
            key={i}
            className="rounded-lg bg-ink-50 px-3 py-2 text-sm text-ink-700"
          >
            {caption}
          </p>
        ))}
      </div>
    </div>
  );
}
