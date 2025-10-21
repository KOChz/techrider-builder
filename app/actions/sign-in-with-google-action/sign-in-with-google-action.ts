"use server";

import { redirect } from "next/navigation";
import { createServerClientService } from "@/lib/supabase/server";
import { headers } from "next/headers";

/**
 * Initiates Google OAuth sign-in flow
 * Dynamically detects the correct callback URL for both production and preview deployments
 *
 * @returns Redirects to Google OAuth consent screen
 */
export async function signInWithGoogleAction() {
  const supabase = await createServerClientService();
  const headersList = await headers();

  // Get the actual host from the request
  const host = headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") || "https";

  // This will work for:
  // - Production: headeacheetechrider.vercel.app
  // - Preview: headeacheetechrider-anvyv6jy0-kyrylo-chs-projects.vercel.app
  // - Local: localhost:3000
  const baseUrl = `${protocol}://${host}`;
  const redirectUrl = `${baseUrl}/auth/callback`;

  console.log("🔐 OAuth Config:", {
    host,
    protocol,
    redirectUrl,
    environment: process.env.NODE_ENV,
  });

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: redirectUrl,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    console.error("❌ Google OAuth error:", error);
    redirect("/login?error=oauth_failed");
  }

  if (data.url) {
    console.log("✅ Redirecting to Google OAuth");
    redirect(data.url);
  }
}
