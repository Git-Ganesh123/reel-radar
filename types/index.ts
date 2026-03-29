// ─── Trend Engine Types ───────────────────────────────────────────────────────

export type LifecycleStage = "Emerging" | "Growing" | "Peak" | "Declining";

export type Platform = "TikTok" | "Instagram" | "YouTube Shorts";

export interface TrendVideo {
  id: string;
  thumbnail_url: string;
  creator_name: string;
  creator_handle: string;
  platform: Platform;
  views: number;
  likes: number;
  link: string;
}

export interface ReplicationGuide {
  hook: string;
  format: string;
  length: string;
  editing_style: string;
  music_type: string;
  cta: string;
}

export interface Trend {
  trend_id: string;
  trend_name: string;
  virality_score: number;
  opportunity_score: number;
  lifecycle_stage: LifecycleStage;
  description: string;
  videos: TrendVideo[];
  hashtags: string[];
  captions: string[];
  sounds: string[];
  replication_guide: ReplicationGuide;
  growth_rate: number;
  saturation_level: number;
}

// ─── API Types ────────────────────────────────────────────────────────────────

export interface TrendsRequest {
  niche: string;
}

export interface TrendsResponse {
  trends: Trend[];
  niche: string;
  generated_at: string;
}

export interface SaveTrendRequest {
  trend_data: Trend;
}

export interface SavedItem {
  id: string;
  user_id: string;
  item_type: string;
  trend_data: Trend;
  created_at: string;
}

// ─── Database Types ───────────────────────────────────────────────────────────

export interface DbSavedItem {
  id: string;
  user_id: string;
  item_type: string;
  trend_data: Trend;
  created_at: string;
}

export interface DbSearch {
  id: string;
  user_id: string | null;
  niche: string;
  created_at: string;
}

export interface DbTrendsCache {
  id: string;
  niche: string;
  trend_data: Trend[];
  created_at: string;
  expires_at: string;
}

// ─── UI Types ─────────────────────────────────────────────────────────────────

export interface NicheOption {
  label: string;
  value: string;
  emoji: string;
}
