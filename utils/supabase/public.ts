import { env } from "@/lib/env";
import { createClient } from "@supabase/supabase-js";

const publicFetch: typeof fetch = (input, init) =>
  fetch(input, {
    ...init,
    // Public pages should render a useful empty state instead of waiting on an
    // intermittent remote database connection for tens of seconds.
    signal: AbortSignal.timeout(3500),
  });

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
      global: { fetch: publicFetch },
    },
  );
