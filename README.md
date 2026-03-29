# Reel Radar — Viral Trend Intelligence Platform

A production-grade SaaS web application that helps creators discover trending Reels and TikTok formats in their niche. Search any niche and receive the top 10 trends with detailed intelligence data including virality scores, opportunity scores, example videos, hashtags, sounds, and a replication guide.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                     Next.js 14 (App Router)             │
├──────────────────┬──────────────────────────────────────┤
│   Client Layer   │           Server Layer               │
│                  │                                      │
│  React Query     │   API Routes (/api/*)                │
│  Auth Context    │   ┌──────────────────────────┐       │
│  Framer Motion   │   │  Trend Engine (mock)     │       │
│  shadcn/ui       │   │  ↕ swap for real APIs    │       │
│                  │   └──────────────────────────┘       │
│                  │                                      │
│                  │   Supabase                            │
│                  │   ├─ Auth (email/password)            │
│                  │   ├─ Postgres (RLS enabled)           │
│                  │   └─ Row Level Security               │
└──────────────────┴──────────────────────────────────────┘
```

### Key Design Decisions

- **Trend Engine abstraction**: `lib/trend-engine.ts` implements a `TrendProvider` interface. The current `MockTrendProvider` generates realistic data. Swap in a real provider (TikTok API, Instagram Graph API, etc.) without changing any other code.
- **API-first**: All data flows through Next.js API routes, making it trivial to add rate limiting, caching, or billing middleware.
- **Auth on every mutation**: Save/remove endpoints validate the Supabase JWT on every request. RLS provides a second layer of defense at the database level.
- **React Query caching**: Search results are cached client-side for 5 minutes, reducing redundant API calls.

## Folder Structure

```
reel-radar/
├── app/
│   ├── api/
│   │   ├── trends/route.ts        # POST — fetch trends for a niche
│   │   ├── save-trend/route.ts    # POST — save a trend (auth required)
│   │   ├── saved/route.ts         # GET  — list saved items (auth required)
│   │   └── remove-saved/route.ts  # POST — remove saved item (auth required)
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── saved/page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                   # Homepage with search
├── components/
│   ├── layout/
│   │   └── navbar.tsx
│   ├── ui/
│   │   ├── auth-form.tsx
│   │   ├── caption-list.tsx
│   │   ├── hashtag-list.tsx
│   │   ├── lifecycle-badge.tsx
│   │   ├── loading-skeleton.tsx
│   │   ├── login-prompt-modal.tsx
│   │   ├── replication-guide.tsx
│   │   ├── save-button.tsx
│   │   ├── saved-grid.tsx
│   │   ├── search-bar.tsx
│   │   ├── sound-list.tsx
│   │   ├── trend-card.tsx
│   │   ├── trend-score.tsx
│   │   └── video-carousel.tsx
│   └── providers.tsx
├── hooks/
│   ├── use-auth.tsx
│   ├── use-saved.ts
│   └── use-trends.ts
├── lib/
│   ├── auth.ts
│   ├── constants.ts
│   ├── db.ts
│   ├── supabase.ts
│   ├── trend-engine.ts
│   └── utils.ts
├── types/
│   └── index.ts
├── schema.sql
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Setup Instructions

### 1. Install Dependencies

```bash
cd reel-radar
npm install
```

### 2. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Copy your **Project URL** and **anon/public key** from Settings → API.

### 3. Configure Environment Variables

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run Database Schema

1. Open the Supabase Dashboard → SQL Editor.
2. Paste the contents of `schema.sql` and run it.
3. This creates `saved_items`, `searches`, and `trends_cache` tables with RLS policies.

### 5. Configure Auth

In Supabase Dashboard → Authentication → Settings:
- Enable **Email** sign-in provider.
- For development, you can disable email confirmation in Authentication → Settings → Email → Toggle off "Confirm email".

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Usage

1. **Search** — Enter any niche in the search bar or click a quick-select button.
2. **Browse** — View the top 10 trends with scores, lifecycle stages, and growth data.
3. **Expand** — Click "View details" on any trend to see videos, hashtags, captions, sounds, and the replication guide.
4. **Save** — Click "Save" on a trend. If not logged in, you'll be prompted to create an account.
5. **Saved Page** — Access your saved trends from the navbar.

## Future Extension Suggestions

### Real API Integration
Replace `MockTrendProvider` in `lib/trend-engine.ts` with:
- **TikTok Research API** for real trending content data
- **Instagram Graph API / CrowdTangle** for Reels trends
- **YouTube Data API** for Shorts trends
- **Social listening APIs** (Brandwatch, Sprout Social) for cross-platform trend detection

### Monetization
- **Freemium**: Limit free users to 3 searches/day, premium gets unlimited
- **Tiered plans**: Basic (10 searches), Pro (unlimited + export), Team (collaboration)
- **Search credits**: Sell search packs via Stripe
- Add a `subscriptions` table and middleware to enforce limits

### Features to Add
- **Trend alerts**: Email/push notifications when a trend in your niche is emerging
- **Competitor tracking**: Monitor specific creators' trending content
- **Content calendar**: Schedule trend-based content ideas
- **Analytics dashboard**: Track which saved trends you've replicated and their performance
- **Export**: PDF/CSV export of trend reports
- **Team workspaces**: Shared saved trends for agencies
- **AI replication assistant**: Use an LLM to generate scripts, hooks, and captions based on the replication guide

### Technical Improvements
- Add Redis caching layer for trend results
- Implement rate limiting on API routes
- Add Sentry for error monitoring
- Set up CI/CD with Vercel
- Add E2E tests with Playwright
- Implement ISR for marketing pages
