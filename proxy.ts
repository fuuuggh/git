import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  // Authentication is verified by the protected layout and server actions.
  // A second network verification here made every protected navigation wait on
  // Supabase before page rendering, especially on an intermittent connection.
  return NextResponse.next({ request: { headers: request.headers } });
}

// Public pages do not need a blocking session refresh. Limiting this to routes
// that actually require an authenticated server session avoids an extra remote
// Supabase round trip on every homepage, resource and article visit.
export const config = {
  matcher: ["/admin/:path*", "/bookmarks/:path*", "/editor/:path*", "/settings/:path*"],
};
