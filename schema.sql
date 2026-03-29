-- ╔═══════════════════════════════════════════════════════════════════════════════╗
-- ║ Reel Radar — Database Schema                                                ║
-- ║ Run this in your Supabase SQL Editor                                        ║
-- ╚═══════════════════════════════════════════════════════════════════════════════╝

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ─── Saved Items ──────────────────────────────────────────────────────────────
-- Stores trends a user has bookmarked
create table if not exists saved_items (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  item_type  text not null default 'trend',
  trend_data jsonb not null,
  created_at timestamptz not null default now()
);

-- Index for fast lookups by user
create index idx_saved_items_user on saved_items(user_id);

-- RLS: users can only read/write their own saved items
alter table saved_items enable row level security;

create policy "Users can view own saved items"
  on saved_items for select
  using (auth.uid() = user_id);

create policy "Users can insert own saved items"
  on saved_items for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own saved items"
  on saved_items for delete
  using (auth.uid() = user_id);


-- ─── Searches ─────────────────────────────────────────────────────────────────
-- Logs every search for analytics
create table if not exists searches (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid references auth.users(id) on delete set null,
  niche      text not null,
  created_at timestamptz not null default now()
);

create index idx_searches_niche on searches(niche);

-- RLS: anyone can insert (anonymous searches allowed), only own reads
alter table searches enable row level security;

create policy "Anyone can insert searches"
  on searches for insert
  with check (true);

create policy "Users can view own searches"
  on searches for select
  using (auth.uid() = user_id);


-- ─── Trends Cache ─────────────────────────────────────────────────────────────
-- Caches trend results per niche to reduce redundant generation
create table if not exists trends_cache (
  id         uuid primary key default uuid_generate_v4(),
  niche      text not null,
  trend_data jsonb not null,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '1 hour')
);

create unique index idx_trends_cache_niche on trends_cache(niche);

-- RLS: readable by all, writable by service role only (via API)
alter table trends_cache enable row level security;

create policy "Anyone can read cache"
  on trends_cache for select
  using (true);
