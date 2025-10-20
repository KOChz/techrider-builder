import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Handles Supabase email confirmation callback.
 * Exchanges the authorization code for a session and redirects the user.
 *
 * @param request - The incoming request with code and next query parameters
 * @returns Redirect response to the specified destination or error page
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();

    // Exchange the code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Error exchanging code for session:", error);
      return NextResponse.redirect(
        `${requestUrl.origin}/auth/error?message=${encodeURIComponent(
          error.message
        )}`
      );
    }

    // Successful verification - redirect to app
    return NextResponse.redirect(`${requestUrl.origin}${next}`);
  }

  // No code provided - redirect to error page
  return NextResponse.redirect(
    `${requestUrl.origin}/auth/error?message=No+code+provided`
  );
}
