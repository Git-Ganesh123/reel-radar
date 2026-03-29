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
      videoDuration: "short",
      order: "viewCount",
      maxResults: String(maxResults),
      key: apiKey,
    });

    const searchRes = await fetch(
      `${YOUTUBE_API_BASE}/search?${searchParams}`,
      { next: { revalidate: 3600 } }
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

/**
 * Discover real trending topics for any niche by searching YouTube
 * and extracting common patterns/themes from video titles.
 * Uses 1 search call (100 units) to discover up to 50 video titles,
 * then clusters them into trend names.
 */
export async function discoverTrendingTopics(
  niche: string,
  count: number = 10
): Promise<string[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) return [];

  try {
    const searchParams = new URLSearchParams({
      part: "snippet",
      q: `${niche} trending #shorts`,
      type: "video",
      videoDuration: "short",
      order: "viewCount",
      maxResults: "50",
      publishedAfter: getRecentDateISO(30), // Last 30 days only
      key: apiKey,
    });

    const res = await fetch(
      `${YOUTUBE_API_BASE}/search?${searchParams}`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) return [];

    const data = await res.json();
    const items: YouTubeSearchItem[] = data.items ?? [];

    if (items.length === 0) return [];

    // Extract and clean up video titles into trend-style names
    const titles = items.map((item) => cleanTitle(item.snippet.title, niche));

    // Deduplicate similar titles and pick the best ones
    const unique = deduplicateTitles(titles);

    return unique.slice(0, count);
  } catch (error) {
    console.error("YouTube topic discovery failed:", error);
    return [];
  }
}

/** Get an ISO date string for N days ago */
function getRecentDateISO(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
}

/** Clean a YouTube title into a short trend-style name */
function cleanTitle(title: string, niche: string): string {
  let cleaned = title
    // Remove common YouTube junk
    .replace(/#\w+/g, "")
    .replace(/\|.*$/, "")
    .replace(/\(.*?\)/g, "")
    .replace(/\[.*?\]/g, "")
    .replace(/🔥|😂|💀|🤯|😱|👀|✅|❌|💪|🧠|💰|🎯|⚡|🚀|😍|🥵|💯/g, "")
    .replace(/\s+/g, " ")
    .trim();

  // Cap at reasonable length
  if (cleaned.length > 60) {
    cleaned = cleaned.slice(0, 57) + "...";
  }

  // If the title is too short or generic, prefix with niche
  if (cleaned.length < 10) {
    cleaned = `${niche} ${cleaned}`.trim();
  }

  // Capitalize first letter of each word
  return cleaned
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** Remove near-duplicate titles (same first 5 words) */
function deduplicateTitles(titles: string[]): string[] {
  const seen = new Set<string>();
  const results: string[] = [];

  for (const title of titles) {
    const key = title.toLowerCase().split(" ").slice(0, 5).join(" ");
    if (!seen.has(key) && title.length > 5) {
      seen.add(key);
      results.push(title);
    }
  }

  return results;
}
