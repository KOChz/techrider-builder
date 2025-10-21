import { createServerClientService } from "@/lib/supabase/server";
import { validateRedirectUrl } from "@/lib/utils/validate-redirect-url";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Handles OAuth callback from Supabase Auth
 *
 * Flow:
 * 1. Receives auth code from OAuth provider via query params
 * 2. Exchanges code for session using Supabase
 * 3. Validates and redirects to safe internal path
 *
 * Query Parameters:
 * - code: Auth code from OAuth provider (required for success)
 * - next: Redirect destination after auth (optional, validated for security)
 * - error: Error code from OAuth provider (optional)
 * - error_description: Detailed error message (optional)
 *
 * @param request - Next.js request object
 * @returns Redirect response to destination on success, or login page with error on failure
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next");
  const error = requestUrl.searchParams.get("error");
  const errorDescription = requestUrl.searchParams.get("error_description");

  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto");

  const origin = forwardedHost
    ? `${forwardedProto ?? "https"}://${forwardedHost}`
    : requestUrl.origin;

  if (error) {
    console.error("OAuth provider error:", { error, errorDescription });
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(errorDescription ?? error)}`
    );
  }

  if (!code) {
    console.error("No auth code provided in callback");
    return NextResponse.redirect(`${origin}/login?error=auth_code_missing`);
  }

  try {
    const supabase = await createServerClientService();

    const { data, error: exchangeError } =
      await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error("Session exchange failed:", exchangeError.message);
      return NextResponse.redirect(
        `${origin}/login?error=${encodeURIComponent(exchangeError.message)}`
      );
    }

    if (!data.session) {
      console.error("Session exchange succeeded but no session returned");
      return NextResponse.redirect(
        `${origin}/login?error=session_creation_failed`
      );
    }

    const safePath = validateRedirectUrl(next, "/");

    return NextResponse.redirect(`${origin}${safePath}`);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("Unexpected callback error:", errorMessage, err);
    return NextResponse.redirect(`${origin}/login?error=callback_failed`);
  }
}
