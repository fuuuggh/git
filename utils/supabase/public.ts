import { env } from "@/lib/env";
import { createClient } from "@supabase/supabase-js";

// Read-only public content never needs request cookies or a session refresh.
// Keeping it separate from the authenticated server client lets Next cache it.
export const createPublicClient = () =>
  createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
