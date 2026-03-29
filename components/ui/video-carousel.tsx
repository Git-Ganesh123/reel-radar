"use client";

import { useState } from "react";
import type { TrendVideo } from "@/types";
import { formatNumber } from "@/lib/utils";
import { Play, Eye, Heart, ExternalLink } from "lucide-react";

interface VideoCarouselProps {
  videos: TrendVideo[];
}

function PlatformIcon({ platform }: { platform: string }) {
  const colors: Record<string, string> = {
    TikTok: "bg-ink-900 text-white",
    Instagram: "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
    "YouTube Shorts": "bg-red-500 text-white",
  };
  return (
    <span
      className={`rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${colors[platform] ?? "bg-ink-200 text-ink-700"}`}
    >
      {platform === "YouTube Shorts" ? "YT" : platform === "Instagram" ? "IG" : "TT"}
    </span>
  );
}

function isRealThumbnail(url: string): boolean {
  return url.startsWith("http");
}

function parseThumbnailGradient(url: string): [string, string] | null {
  if (!url.startsWith("gradient:")) return null;
  const parts = url.split(":");
  if (parts.length >= 3) return [parts[1], parts[2]];
  return null;
}

function Thumbnail({ video }: { video: TrendVideo }) {
  const [imgError, setImgError] = useState(false);
  const isReal = isRealThumbnail(video.thumbnail_url) && !imgError;
  const gradient = !isReal ? parseThumbnailGradient(video.thumbnail_url) : null;

  return (
    <div
      className="relative h-56 flex items-center justify-center overflow-hidden"
      style={
        !isReal
          ? {
              background: gradient
                ? `linear-gradient(135deg, ${gradient[0]} 0%, ${gradient[1]} 100%)`
                : "linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)",
            }
          : undefined
      }
    >
      {isReal && (
        <img
          src={video.thumbnail_url}
          alt={video.creator_name}
          onError={() => setImgError(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      {/* Play overlay */}
      <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 shadow-sm backdrop-blur-sm group-hover:bg-black/60 group-hover:scale-110 transition-all">
        <Play className="h-4 w-4 text-white ml-0.5" fill="white" />
      </div>

      {/* Creator initial */}
      <span className="absolute bottom-2 left-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-xs font-bold text-ink-700 shadow-sm">
        {video.creator_name.charAt(0).toUpperCase()}
      </span>

      {/* Platform badge */}
      <div className="absolute top-2 left-2 z-10">
        <PlatformIcon platform={video.platform} />
      </div>
    </div>
  );
}

export function VideoCarousel({ videos }: VideoCarouselProps) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {videos.map((video) => (
        <a
          key={video.id}
          href={video.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 w-40 rounded-xl border border-ink-200 bg-ink-50 overflow-hidden group hover:shadow-card-hover transition-shadow"
        >
          <Thumbnail video={video} />

          {/* Info */}
          <div className="p-2.5 space-y-1.5">
            <p className="text-xs font-medium text-ink-900 truncate">
              {video.creator_name}
            </p>
            <p className="text-[11px] text-ink-400 truncate">
              {video.creator_handle}
            </p>
            {(video.views > 0 || video.likes > 0) && (
              <div className="flex items-center gap-3 text-[11px] text-ink-400">
                <span className="flex items-center gap-0.5">
                  <Eye className="h-3 w-3" />
                  {formatNumber(video.views)}
                </span>
                <span className="flex items-center gap-0.5">
                  <Heart className="h-3 w-3" />
                  {formatNumber(video.likes)}
                </span>
              </div>
            )}
            <span className="mt-1 flex items-center gap-1 text-[11px] font-medium text-brand-600 group-hover:text-brand-700 transition-colors">
              {video.views > 0 ? "Watch" : "Search"} <ExternalLink className="h-3 w-3 flex-shrink-0" />
            </span>
          </div>
        </a>
      ))}
    </div>
  );
}
