/**
 * Trend Engine
 *
 * This module generates realistic mock trend data for a given niche.
 * Architecture is designed so a real API integration (TikTok, Instagram, etc.)
 * can replace the mock generator without changing the interface.
 *
 * To integrate a real API:
 * 1. Create a new provider implementing TrendProvider
 * 2. Swap the provider in getTrendsForNiche()
 */

import type {
  Trend,
  TrendVideo,
  ReplicationGuide,
  LifecycleStage,
  Platform,
} from "@/types";

// ─── Provider Interface ───────────────────────────────────────────────────────

interface TrendProvider {
  fetchTrends(niche: string, count: number): Promise<Trend[]>;
}

// ─── Niche Seed Data ──────────────────────────────────────────────────────────
// Each niche has curated seed data for realistic generation

interface NicheSeed {
  trends: string[];
  hashtags: string[];
  sounds: string[];
  hooks: string[];
  creators: string[];
  captions: string[];
}

const NICHE_SEEDS: Record<string, NicheSeed> = {
  gym: {
    trends: [
      "5AM Club Morning Routine",
      "Progressive Overload Check",
      "Gym Villain Era Arc",
      "Protein Shake ASMR",
      "PR Day Celebration",
      "Gym Couple Goals",
      "Newbie to Beast Transformation",
      "Workout Split Breakdown",
      "Gym Fail Compilation React",
      "Supplement Stack Reveal",
      "Leg Day Never Skip",
      "Home Gym Setup Tour",
    ],
    hashtags: [
      "#gymtok",
      "#fitness",
      "#gymmotivation",
      "#workout",
      "#gains",
      "#fitcheck",
      "#personaltrainer",
      "#bulking",
      "#cutting",
      "#deadlift",
      "#benchpress",
      "#legday",
    ],
    sounds: [
      "Close Eyes — DVRST",
      "Industry Baby — Lil Nas X",
      "Original Sound — gym.motivation",
      "Phonk — KORDHELL",
      "Eye of the Tiger — Survivor",
    ],
    hooks: [
      "POV: You finally hit your PR after 6 months",
      "Day 1 vs Day 365 of going to the gym",
      "Nobody talks about this exercise but it changed everything",
      "Watch this if you can't grow your arms",
    ],
    creators: [
      "cbum", "jeff_nippard", "noel.deyzel", "sam_sulek", "david.laid",
      "gymshark", "will.tennyson", "zacperna", "natachaoceane", "breonma"
    ],
    captions: [
      "This one change added 20lbs to my bench 🔥",
      "Stop doing curls wrong. Here's the fix.",
      "My 3-year transformation. Consistency > everything.",
      "The workout that got me shredded for summer",
    ],
  },
  fashion: {
    trends: [
      "Quiet Luxury Outfit Check",
      "Thrift Flip Challenge",
      "GRWM Office Siren",
      "Capsule Wardrobe Build",
      "Dupe vs Real Comparison",
      "Outfit Rating on Strangers",
      "Color Analysis Reveal",
      "Pinterest Board to Reality",
      "Runway to Streetwear Adapt",
      "Seasonal Closet Cleanout",
      "Accessory Stacking Guide",
      "One Piece Five Ways",
    ],
    hashtags: [
      "#fashiontok",
      "#ootd",
      "#grwm",
      "#styleinspo",
      "#thriftflip",
      "#fashiontrends",
      "#outfitideas",
      "#streetstyle",
      "#quietluxury",
      "#capsulewardrobe",
    ],
    sounds: [
      "Femininomenon — Chappell Roan",
      "Original Sound — fashion.daily",
      "That Girl — Jvke",
      "APT — ROSÉ & Bruno Mars",
      "Espresso — Sabrina Carpenter",
    ],
    hooks: [
      "POV: You finally found your personal style",
      "Rating outfits I see in NYC today",
      "How to look expensive on a budget",
      "The trend that's replacing quiet luxury",
    ],
    creators: [
      "wisdomkaye", "brittanybathgate", "lydiamillen", "stylebysal",
      "bestaesthetic", "jenn.muriel", "alyssainthecity", "devanondeck",
      "chloeplumstead", "marianodivaio"
    ],
    captions: [
      "This $30 outfit looks like $300 💅",
      "My stylist friend rated my wardrobe and I'm shook",
      "3 rules for looking put-together without trying",
      "The accessory that elevates every outfit instantly",
    ],
  },
  sports: {
    trends: [
      "Impossible Trick Shot Series",
      "Mic'd Up Hilarious Moments",
      "Athlete Day in the Life",
      "Pre-Game Ritual ASMR",
      "Fan Reaction Compilation",
      "Slowmo Replay Breakdown",
      "Underdog Story Edit",
      "Sports Hot Take Debate",
      "Training Camp Behind Scenes",
      "Rookie vs Veteran Challenge",
      "Game Day Fit Check",
      "Last Second Clutch Moments",
    ],
    hashtags: [
      "#sportstok",
      "#highlights",
      "#gameday",
      "#athlete",
      "#sports",
      "#nba",
      "#nfl",
      "#football",
      "#basketball",
      "#soccertok",
    ],
    sounds: [
      "Remember The Name — Fort Minor",
      "Original Sound — espn",
      "Lose Yourself — Eminem",
      "All I Do Is Win — DJ Khaled",
      "Centuries — Fall Out Boy",
    ],
    hooks: [
      "This play shouldn't be physically possible",
      "The greatest comeback in sports history?",
      "Nobody expected this rookie to do THIS",
      "Watch this and try not to get chills",
    ],
    creators: [
      "espn", "overtime", "house.of.highlights", "ballislife",
      "sportscenter", "brfreel", "theScore", "balldontstop",
      "whistlesports", "thecheckdown"
    ],
    captions: [
      "This play broke the internet 🤯",
      "Name a better duo. I'll wait.",
      "The ref's face says it all 😂",
      "Generational talent. No debate.",
    ],
  },
  business: {
    trends: [
      "Side Hustle Income Reveal",
      "Day in the Life of a CEO",
      "Startup Failure Story",
      "Cold Email That Got Me a Deal",
      "Revenue Dashboard Walkthrough",
      "Passive Income Tier List",
      "Client Red Flag Storytime",
      "Networking Tips Nobody Shares",
      "First Dollar Online Story",
      "Business Book Speed Review",
      "Quit My 9-5 Journey",
      "AI Tools for Business 2024",
    ],
    hashtags: [
      "#entrepreneur",
      "#business",
      "#startup",
      "#sidehustle",
      "#passiveincome",
      "#marketing",
      "#ceo",
      "#smallbusiness",
      "#money",
      "#growthmindset",
    ],
    sounds: [
      "Rich Flex — Drake",
      "Original Sound — garyvee",
      "Money — Cardi B",
      "Started From The Bottom — Drake",
      "Boss B**** — Doja Cat",
    ],
    hooks: [
      "I made $10K in one month with this simple business",
      "3 businesses you can start with $0 today",
      "The email template that books meetings every time",
      "Why 95% of startups fail (and how mine didn't)",
    ],
    creators: [
      "garyvee", "alexhormozi", "codie.sanchez", "thefutur",
      "noahkagan", "samuellthomas", "jasonfladlien", "lauraroeder",
      "patflynn", "justinwelsh"
    ],
    captions: [
      "This side hustle pays more than my old salary 💰",
      "The skill that will make you rich in 2025",
      "Stop trading time for money. Here's how.",
      "I wish someone told me this before starting my business",
    ],
  },
  brainrot: {
    trends: [
      "Skibidi Toilet Lore Explained",
      "Sigma Male Grindset Edit",
      "NPC Streaming Moments",
      "Mewing Transformation",
      "Ohio Final Boss Edit",
      "Rizz Tutorial Parody",
      "POV: You're the Main Character",
      "AI Generated Fever Dream",
      "Subway Surfers Gameplay + Story",
      "Would You Rather Extreme",
      "Gen Alpha Slang Test",
      "Brainrot Vocabulary Quiz",
    ],
    hashtags: [
      "#brainrot",
      "#skibidi",
      "#sigma",
      "#mewing",
      "#ohio",
      "#rizz",
      "#npc",
      "#fyp",
      "#meme",
      "#slay",
      "#edits",
      "#foryou",
    ],
    sounds: [
      "Phonk — KORDHELL",
      "Skibidi Toilet Theme",
      "Better Than You Grind Edit",
      "Original Sound — brainrot.daily",
      "Aura Sound — memes.wav",
    ],
    hooks: [
      "POV: You have infinite aura",
      "Only 1% of people can understand this",
      "This is the most sigma thing I've ever seen",
      "Gen Alpha humor hits different",
    ],
    creators: [
      "brainrot.daily", "sigma.edits", "ohio.memes", "npc.clips",
      "skibidi.lore", "mewing.coach", "aura.calculator", "rizz.academy",
      "gen.alpha.translator", "chaos.content"
    ],
    captions: [
      "My last brain cell after watching this 💀",
      "This is actually peak content and I'm not ashamed",
      "Tell me your aura points in the comments",
      "POV: you showed this to someone over 30",
    ],
  },
};

// Default seed for any niche not explicitly mapped
const DEFAULT_SEED: NicheSeed = {
  trends: [
    "Day in the Life Format",
    "Hot Take Debate",
    "Tutorial Speed Run",
    "Before and After Reveal",
    "Storytime with Gameplay",
    "Rating Things in My Niche",
    "Tier List Challenge",
    "Myth Busting Series",
    "Secret Tips Nobody Shares",
    "Beginner vs Pro Compare",
    "Aesthetic Montage Edit",
    "Viral Sound Remix",
  ],
  hashtags: ["#trending", "#viral", "#fyp", "#foryou", "#explore", "#content", "#creator"],
  sounds: [
    "Original Sound — trending.audio",
    "Popular Sound — viral.beat",
    "Remix — tiktok.sounds",
  ],
  hooks: [
    "You need to see this",
    "Nobody is talking about this",
    "Watch until the end",
    "This changed everything for me",
  ],
  creators: [
    "creator.one", "viral.maker", "trend.setter", "content.king",
    "niche.expert", "daily.dose", "best.of.niche", "real.talk"
  ],
  captions: [
    "This is the one 🔥",
    "Save this for later, trust me",
    "Comment your thoughts below",
    "Share this with someone who needs it",
  ],
};

// ─── Deterministic Seeded Random ──────────────────────────────────────────────
// Generates consistent results for the same niche (for caching)

function seededRandom(seed: string): () => number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return () => {
    hash = (hash * 1664525 + 1013904223) | 0;
    return (hash >>> 0) / 4294967296;
  };
}

function pick<T>(arr: T[], rand: () => number): T {
  return arr[Math.floor(rand() * arr.length)];
}

function pickN<T>(arr: T[], n: number, rand: () => number): T[] {
  const shuffled = [...arr].sort(() => rand() - 0.5);
  return shuffled.slice(0, Math.min(n, arr.length));
}

// ─── Score Calculators ────────────────────────────────────────────────────────

function calculateViralityScore(
  stage: LifecycleStage,
  rand: () => number
): number {
  const baseScores: Record<LifecycleStage, [number, number]> = {
    Emerging: [40, 65],
    Growing: [60, 82],
    Peak: [78, 98],
    Declining: [25, 55],
  };
  const [min, max] = baseScores[stage];
  return Math.round(min + rand() * (max - min));
}

function calculateOpportunityScore(
  stage: LifecycleStage,
  saturation: number,
  rand: () => number
): number {
  // Emerging + low saturation = highest opportunity
  const stageMultiplier: Record<LifecycleStage, number> = {
    Emerging: 1.3,
    Growing: 1.1,
    Peak: 0.7,
    Declining: 0.4,
  };
  const base = 50 + rand() * 40;
  const saturationPenalty = saturation * 0.3;
  return Math.min(
    99,
    Math.max(10, Math.round(base * stageMultiplier[stage] - saturationPenalty))
  );
}

// ─── Video Generator ──────────────────────────────────────────────────────────

// Gradient pairs for generated thumbnail backgrounds
const THUMBNAIL_GRADIENTS = [
  ["#6ee7b7", "#059669"],
  ["#93c5fd", "#2563eb"],
  ["#fca5a5", "#dc2626"],
  ["#fcd34d", "#d97706"],
  ["#c4b5fd", "#7c3aed"],
  ["#f9a8d4", "#db2777"],
  ["#67e8f9", "#0891b2"],
  ["#fdba74", "#ea580c"],
];

function generateVideos(
  seed: NicheSeed,
  rand: () => number,
  count: number,
  trendName?: string,
  niche?: string
): TrendVideo[] {
  const platforms: Platform[] = ["TikTok", "Instagram", "YouTube Shorts"];
  // Use the trend name for search links so they actually find relevant content
  const searchQuery = trendName && niche
    ? `${trendName} ${niche}`
    : trendName || niche || "trending";

  return Array.from({ length: count }, (_, i) => {
    const creator = pick(seed.creators, rand);
    const platform = pick(platforms, rand);
    const gradient = THUMBNAIL_GRADIENTS[Math.floor(rand() * THUMBNAIL_GRADIENTS.length)];
    return {
      id: `vid_${Math.floor(rand() * 100000)}`,
      thumbnail_url: `gradient:${gradient[0]}:${gradient[1]}`,
      creator_name: creator.replace(/[._]/g, " "),
      creator_handle: `@${creator}`,
      platform,
      views: Math.floor(rand() * 5_000_000) + 50_000,
      likes: Math.floor(rand() * 500_000) + 5_000,
      link: platform === "TikTok"
        ? `https://www.tiktok.com/search?q=${encodeURIComponent(searchQuery)}`
        : platform === "Instagram"
          ? `https://www.instagram.com/explore/search/keyword/?q=${encodeURIComponent(searchQuery)}`
          : `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}+shorts`,
    };
  });
}

// ─── Replication Guide Generator ──────────────────────────────────────────────

function generateReplicationGuide(
  seed: NicheSeed,
  rand: () => number
): ReplicationGuide {
  const formats = [
    "Talking head with B-roll",
    "POV first-person",
    "Split-screen comparison",
    "Voiceover with montage",
    "Green screen reaction",
    "Slideshow with text overlay",
  ];
  const lengths = [
    "7–15 seconds (short hook)",
    "15–30 seconds (standard)",
    "30–60 seconds (storytelling)",
    "60–90 seconds (deep dive)",
  ];
  const editingStyles = [
    "Fast cuts, high energy",
    "Smooth transitions, cinematic",
    "Raw and unedited (authentic)",
    "Text-heavy with zoom ins",
    "Aesthetic with color grading",
  ];
  const musicTypes = [
    "Trending sound (original audio)",
    "Phonk / bass-heavy",
    "Lo-fi / chill background",
    "Upbeat pop remix",
    "Dramatic / cinematic",
    "No music (voiceover only)",
  ];
  const ctas = [
    "Follow for more",
    "Save this for later",
    "Comment your experience",
    "Share with a friend who needs this",
    "Link in bio",
    "Part 2? Comment below",
  ];

  return {
    hook: pick(seed.hooks, rand),
    format: pick(formats, rand),
    length: pick(lengths, rand),
    editing_style: pick(editingStyles, rand),
    music_type: pick(musicTypes, rand),
    cta: pick(ctas, rand),
  };
}

// ─── Hybrid Provider ──────────────────────────────────────────────────────────
// Known niches: curated seed data + real YouTube videos
// Unknown niches: generated niche-specific trend names + real YouTube videos
// YouTube topic discovery used as enrichment, not a requirement

import { fetchYouTubeShorts, discoverTrendingTopics } from "./youtube";

/**
 * Generate niche-specific trend names from templates.
 * Works for ANY niche — no seed data required.
 */
function generateNicheTrendNames(niche: string, count: number): string[] {
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  const niceCap = niche.split(" ").map(capitalize).join(" ");

  const templates = [
    `${niceCap} Day in the Life`,
    `${niceCap} Beginner vs Pro`,
    `${niceCap} Tips Nobody Talks About`,
    `${niceCap} Transformation Reveal`,
    `${niceCap} Hot Takes`,
    `POV: You're Into ${niceCap}`,
    `Rating ${niceCap} Content`,
    `${niceCap} Tier List`,
    `${niceCap} Myths Debunked`,
    `${niceCap} Aesthetic Montage`,
    `${niceCap} Routine Breakdown`,
    `${niceCap} Starter Pack`,
    `What I Wish I Knew About ${niceCap}`,
    `${niceCap} Challenge Gone Wrong`,
    `${niceCap} Story Time`,
  ];

  return templates.slice(0, count);
}

class HybridTrendProvider implements TrendProvider {
  async fetchTrends(niche: string, count: number): Promise<Trend[]> {
    const normalizedNiche = niche.toLowerCase().trim();
    const hasSeeds = normalizedNiche in NICHE_SEEDS;
    const seed = NICHE_SEEDS[normalizedNiche] ?? DEFAULT_SEED;
    const rand = seededRandom(normalizedNiche + "_v1");
    const stages: LifecycleStage[] = [
      "Emerging",
      "Growing",
      "Peak",
      "Declining",
    ];

    // Step 1: Get trend names
    let trendNames: string[];

    if (hasSeeds) {
      // Known niche — use curated seed trends
      trendNames = pickN(seed.trends, count, rand);
    } else {
      // Unknown niche — start with guaranteed niche-specific names
      const fallbackNames = generateNicheTrendNames(normalizedNiche, count);

      // Try to enrich with real YouTube-discovered trend names (non-blocking)
      try {
        const discovered = await discoverTrendingTopics(normalizedNiche, count);
        if (discovered.length >= 3) {
          // Merge: use discovered names first, fill remaining with fallbacks
          const combined = [...discovered];
          for (const name of fallbackNames) {
            if (combined.length >= count) break;
            if (!combined.some((d) => d.toLowerCase().includes(name.split(" ")[0].toLowerCase()))) {
              combined.push(name);
            }
          }
          trendNames = combined.slice(0, count);
        } else {
          trendNames = fallbackNames;
        }
      } catch {
        // YouTube discovery failed — no problem, fallbacks always work
        trendNames = fallbackNames;
      }
    }

    // Step 2: Generate niche-relevant hashtags
    const nicheTag = normalizedNiche.replace(/\s+/g, "");
    const nicheHashtags = hasSeeds
      ? seed.hashtags
      : [
          `#${nicheTag}`,
          `#${nicheTag}tok`,
          `#${nicheTag}community`,
          `#${nicheTag}tips`,
          `#${nicheTag}life`,
          "#trending",
          "#viral",
          "#fyp",
          "#foryou",
          "#explore",
        ];

    // Step 3: Fetch real YouTube Shorts for each trend in parallel
    const videoResults = await Promise.all(
      trendNames.map((name) =>
        fetchYouTubeShorts(`${name} ${niche}`, 4).catch(() => [])
      )
    );

    // Step 4: Build trend objects
    return trendNames.map((name, index) => {
      const stage = stages[index % stages.length];
      const saturation = Math.round(rand() * 100);
      const virality = calculateViralityScore(stage, rand);
      const opportunity = calculateOpportunityScore(stage, saturation, rand);

      const realVideos = videoResults[index] ?? [];
      const videos =
        realVideos.length > 0
          ? realVideos
          : generateVideos(seed, rand, 3 + Math.floor(rand() * 3), name, niche);

      const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
      const niceCap = niche.split(" ").map(capitalize).join(" ");

      return {
        trend_id: `trend_${normalizedNiche}_${index}_${Math.floor(rand() * 10000)}`,
        trend_name: name,
        virality_score: virality,
        opportunity_score: opportunity,
        lifecycle_stage: stage,
        description: `${name} is ${stage === "Emerging" ? "a rising format gaining traction" : stage === "Growing" ? "rapidly gaining momentum across platforms" : stage === "Peak" ? "at maximum visibility and engagement" : "showing declining engagement but still relevant"} in the ${niceCap} niche. Creators are ${stage === "Emerging" ? "starting to experiment with this format" : stage === "Growing" ? "seeing strong engagement and follower growth" : stage === "Peak" ? "seeing massive reach but increasing saturation" : "pivoting to newer variations"}.`,
        videos,
        hashtags: pickN(nicheHashtags, 5 + Math.floor(rand() * 4), rand),
        captions: hasSeeds
          ? pickN(seed.captions, 3, rand)
          : [
              `This ${niceCap} content is next level`,
              `Save this for later — ${niceCap} tips you need`,
              `Who else is into ${niceCap}? Comment below`,
            ],
        sounds: pickN(seed.sounds, 2 + Math.floor(rand() * 2), rand),
        replication_guide: generateReplicationGuide(seed, rand),
        growth_rate: Math.round((rand() * 200 - 30) * 10) / 10,
        saturation_level: saturation,
      };
    });
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

const provider: TrendProvider = new HybridTrendProvider();

export async function getTrendsForNiche(
  niche: string,
  count: number = 10
): Promise<Trend[]> {
  return provider.fetchTrends(niche, count);
}

export type { TrendProvider };
