import { createServerClientService } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Handles OAuth callback from Supabase Auth
 * Exchanges the auth code for a session and redirects to the app
 *
 * @returns Redirect to destination on success, or login page with error on failure
 */
export async function GET(request: NextRequest) {
  console.log("🚀 ~ GET ~ request:", request);
  const requestUrl = new URL(request.url) || process.env.NEXT_PUBLIC_SITE_URL;
  console.log("🚀 ~ GET ~ requestUrl:", requestUrl);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/";
  const error = requestUrl.searchParams.get("error");
  const errorDescription = requestUrl.searchParams.get("error_description");

  // Get the actual origin - critical for production environments
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto");

  const origin = forwardedHost
    ? `${forwardedProto || "https"}://${forwardedHost}`
    : requestUrl.origin;

  console.log("🔍 Callback Debug:", {
    requestUrl: request.url,
    forwardedHost,
    forwardedProto,
    calculatedOrigin: origin,
    next,
  });

  if (error) {
    console.error("❌ OAuth provider error:", { error, errorDescription });
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(errorDescription || error)}`
    );
  }

  if (!code) {
    console.error("❌ No auth code provided");
    return NextResponse.redirect(`${origin}/login?error=auth_code_missing`);
  }

  try {
    const supabase = await createServerClientService();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(
      code
    );

    if (exchangeError) {
      console.error("❌ Session exchange error:", exchangeError.message);
      return NextResponse.redirect(
        `${origin}/login?error=${encodeURIComponent(exchangeError.message)}`
      );
    }

    const redirectUrl = `${origin}${next}`;
    console.log("✅ Auth success, redirecting to:", redirectUrl);

    return NextResponse.redirect(redirectUrl);
  } catch (err) {
    console.error("❌ Unexpected callback error:", err);
    return NextResponse.redirect(`${origin}/login?error=callback_failed`);
  }
}
