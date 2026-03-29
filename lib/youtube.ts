/**
 * YouTube Data API v3 Integration
 *
 * Fetches real YouTube Shorts for a given search query.
 * Each search costs 100 quota units (free tier = 10,000/day = ~100 searches).
 * Video details cost 1 unit each.
 *
 * Quota strategy:
 * - 1 search call per trend keyword (returns up to 5 results)
 * - 1 videos.list call per batch to get view/like counts
 * - ~10 trends × (100 + 1) = ~1,010 units per niche search
 * - Allows ~9 niche searches per day on free tier
 */

import type { TrendVideo, Platform } from "@/types";

const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";

interface YouTubeSearchItem {
  id: { videoId: string };
  snippet: {
    title: string;
    channelTitle: string;
    thumbnails: {
      high?: { url: string };
      medium?: { url: string };
      default?: { url: string };
    };
  };
}

interface YouTubeVideoItem {
  id: string;
  statistics: {
    viewCount?: string;
    likeCount?: string;
  };
}

/**
 * Search YouTube for Shorts matching a query.
 * Returns up to `maxResults` videos with real thumbnails, links, and stats.
 */
export async function fetchYouTubeShorts(
  query: string,
  maxResults: number = 5
): Promise<TrendVideo[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    console.warn("YOUTUBE_API_KEY not set — falling back to empty videos");
    return [];
  }

  try {
    // Step 1: Search for short-form videos
    const searchParams = new URLSearchParams({
      part: "snippet",
      q: `${query} #shorts`,
      type: "video",
      videoDuration: "short", // Under 4 minutes — catches most Shorts
      order: "viewCount",
      maxResults: String(maxResults),
      key: apiKey,
    });

    const searchRes = await fetch(
      `${YOUTUBE_API_BASE}/search?${searchParams}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour to save quota
    );

    if (!searchRes.ok) {
      const err = await searchRes.json();
      console.error("YouTube search error:", err);
      return [];
    }

    const searchData = await searchRes.json();
    const items: YouTubeSearchItem[] = searchData.items ?? [];

    if (items.length === 0) return [];

    // Step 2: Get view/like counts in a single batch call (1 unit total)
    const videoIds = items.map((item) => item.id.videoId).join(",");
    const statsParams = new URLSearchParams({
      part: "statistics",
      id: videoIds,
      key: apiKey,
    });

    const statsRes = await fetch(
      `${YOUTUBE_API_BASE}/videos?${statsParams}`,
      { next: { revalidate: 3600 } }
    );

    const statsMap = new Map<string, { views: number; likes: number }>();

    if (statsRes.ok) {
      const statsData = await statsRes.json();
      (statsData.items ?? []).forEach((v: YouTubeVideoItem) => {
        statsMap.set(v.id, {
          views: parseInt(v.statistics.viewCount ?? "0", 10),
          likes: parseInt(v.statistics.likeCount ?? "0", 10),
        });
      });
    }

    // Step 3: Map to our TrendVideo format
    return items.map((item) => {
      const videoId = item.id.videoId;
      const stats = statsMap.get(videoId) ?? { views: 0, likes: 0 };
      const thumb =
        item.snippet.thumbnails.high?.url ??
        item.snippet.thumbnails.medium?.url ??
        item.snippet.thumbnails.default?.url ??
        "";

      return {
        id: videoId,
        thumbnail_url: thumb,
        creator_name: item.snippet.channelTitle,
        creator_handle: `@${item.snippet.channelTitle.replace(/\s+/g, "").toLowerCase()}`,
        platform: "YouTube Shorts" as Platform,
        views: stats.views,
        likes: stats.likes,
        link: `https://www.youtube.com/shorts/${videoId}`,
      };
    });
  } catch (error) {
    console.error("YouTube API fetch failed:", error);
    return [];
  }
}
