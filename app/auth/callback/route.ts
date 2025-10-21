// import { createServerClientService } from "@/lib/supabase/server";
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// /**
//  * Handles OAuth callback from Supabase Auth
//  * Exchanges the auth code for a session and redirects to the app
//  *
//  * @returns Redirect to destination on success, or login page with error on failure
//  */
// export async function GET(request: NextRequest) {
//   const { searchParams, origin } = new URL(request.url);
//   console.log("🚀 ~ GET ~ request:", request);
//   console.log("🚀 ~ GET ~ origin:", origin);
//   const code = searchParams.get("code");
//   const next = searchParams.get("next") ?? "/";
//   console.log("🚀 ~ GET ~ next:", next);
//   const error = searchParams.get("error");
//   const errorDescription = searchParams.get("error_description");

//   if (error) {
//     console.error("OAuth provider error:", { error, errorDescription });
//     return NextResponse.redirect(
//       `${origin}/login?error=${encodeURIComponent(errorDescription || error)}`
//     );
//   }

//   if (!code) {
//     return NextResponse.redirect(`${origin}/login?error=auth_code_missing`);
//   }

//   const supabase = await createServerClientService();
//   const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(
//     code
//   );

//   if (exchangeError) {
//     console.error("Session exchange error:", exchangeError.message);
//     return NextResponse.redirect(
//       `${origin}/login?error=${encodeURIComponent(exchangeError.message)}`
//     );
//   }

//   const redirectLink = `${origin}${next}`;
//   console.log("🚀 ~ GET ~ redirectLink:", redirectLink);

//   return NextResponse.redirect(redirectLink);
// }

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
  const requestUrl = new URL(request.url);
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
