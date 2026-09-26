import { createClient } from "@supabase/supabase-js";

// Keep the demo buildable before Supabase is connected. `lib/data.ts` avoids
// network calls when these public variables are missing.
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

// Client used in the browser and in server components for public reads.
// Writes (admin panel) go through this same client but are protected by
// Supabase Row Level Security — only an authenticated admin user can
// insert/update/delete. See supabase/schema.sql for the policies.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
