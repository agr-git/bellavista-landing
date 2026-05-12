-- Bellavista Coffee — initial schema
-- Run once in your Supabase project SQL editor or via `supabase db push`.
--
-- Design notes:
--   - Prefixed `bv_` to avoid collisions with Supabase-managed tables.
--   - NextAuth uses JWT strategy → no sessions table needed.
--   - CMS blocks use jsonb payload so the schema stays flexible as copy evolves.
--   - Waitlist enforces uniqueness per (user, tier) with a partial index trick
--     so duplicate clicks are a DB-level no-op.

-- ─── Users ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bv_users (
  id          uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  email       text    UNIQUE NOT NULL,
  name        text,
  picture_url text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ─── Waitlist ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bv_waitlist (
  id          uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid    REFERENCES bv_users(id) ON DELETE CASCADE,
  tier_slug   text    NOT NULL,          -- 'honey' | 'natural' | 'on-demand'
  source      text    NOT NULL DEFAULT 'members-page',
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, tier_slug)
);
CREATE INDEX IF NOT EXISTS bv_waitlist_tier_idx ON bv_waitlist (tier_slug);

-- ─── CMS blocks ───────────────────────────────────────────────────────────────
-- key examples: 'coffee', 'stay'
CREATE TABLE IF NOT EXISTS bv_cms_blocks (
  id          uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  key         text    UNIQUE NOT NULL,
  payload     jsonb   NOT NULL DEFAULT '{}',
  updated_at  timestamptz NOT NULL DEFAULT now(),
  updated_by  text                              -- admin email
);

-- ─── CMS images ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bv_cms_images (
  id           uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  key          text    NOT NULL,               -- logical slot, e.g. 'stay-hero-1'
  storage_path text    NOT NULL,               -- Supabase Storage object path
  alt          text    NOT NULL DEFAULT '',
  updated_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (key)
);

-- ─── RLS — disable for now; this is a single-admin app with server-only access
-- Enable row-level security only if you expose the Supabase anon key client-side.
-- ALTER TABLE bv_users ENABLE ROW LEVEL SECURITY;
