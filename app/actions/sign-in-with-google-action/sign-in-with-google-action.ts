"use server";

import { redirect } from "next/navigation";
import { createServerClientService } from "@/lib/supabase/server";

/**
 * Initiates Google OAuth sign-in flow
 * Redirects user to Google's consent screen, then back to /auth/callback
 */
export async function signInWithGoogleAction() {
  const supabase = await createServerClientService();

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  console.log("🚀 ~ signInWithGoogleAction ~ baseUrl:", baseUrl);
  const redirectUrl = `${baseUrl}/auth/callback`;

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
    console.error("Google OAuth error:", error);
    redirect("/login?error=oauth_failed");
  }

  if (data.url) {
    redirect(data.url);
  }
}
