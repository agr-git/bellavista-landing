/**
 * lib/supabase.ts — server-only Supabase client factory.
 *
 * Uses the SERVICE_ROLE key so it can bypass Row-Level Security.
 * NEVER import this in client components or expose the key client-side.
 *
 * Usage:
 *   import { supabase } from "@/lib/supabase";
 *   const { data, error } = await supabase.from("bv_users").select("*");
 */

import { createClient } from "@supabase/supabase-js";

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  // Only warn — don't throw at module load time so the build still works
  // when Supabase is not yet configured (e.g. during local dev without .env).
  if (process.env.NODE_ENV !== "test") {
    console.warn(
      "[supabase] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set. " +
        "DB features (auth sync, waitlist, CMS) will be unavailable."
    );
  }
}

export const supabase = createClient(
  process.env.SUPABASE_URL ?? "https://placeholder.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? "placeholder-key",
  {
    auth: {
      // Disable the Supabase auth helper — we're using NextAuth, not Supabase Auth.
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  }
);

/** Upsert an authenticated user into bv_users. */
export async function upsertUser(user: {
  email: string;
  name?: string | null;
  picture_url?: string | null;
}): Promise<void> {
  const { error } = await supabase
    .from("bv_users")
    .upsert(
      {
        email: user.email,
        name: user.name ?? null,
        picture_url: user.picture_url ?? null,
      },
      { onConflict: "email", ignoreDuplicates: false }
    );
  if (error) {
    console.error("[supabase] upsertUser error:", error.message);
  }
}

/** Look up a user row by email. Returns null if not found or on error. */
export async function getUserByEmail(
  email: string
): Promise<{
  id: string;
  email: string;
  name: string | null;
  picture_url: string | null;
  created_at: string;
} | null> {
  const { data, error } = await supabase
    .from("bv_users")
    .select("id, email, name, picture_url, created_at")
    .eq("email", email)
    .single();
  if (error) return null;
  return data;
}
