"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createServerClientService } from "@/lib/supabase/server";
import { signupSchema, type TSignUpState } from "@/types/auth";

/**
 * Creates a new Supabase user via email/password.
 * Handles both flows:
 *  - Email confirmation OFF: session exists -> redirect("/")
 *  - Email confirmation ON: no session -> return success + CTA message
 */
export async function signUpAction(
  _prev: TSignUpState,
  formData: FormData
): Promise<TSignUpState> {
  const raw = {
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const parsed = signupSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createServerClientService();

  // Optional: provide post-confirm redirect target if you use email confirmations
  const headersList = await headers();
  const origin =
    headersList.get("origin") ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000";

  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    // Normalize error to non-leaky message
    return {
      success: false,
      message: "Unable to sign up with these credentials",
      errors: {
        email: [error.message],
      },
    };
  }

  // If email confirmations are enabled, Supabase returns no session.
  if (!data.session) {
    return {
      success: true,
      needsEmailConfirmation: true,
      message:
        "Account created. Check your email to confirm your address before signing in.",
    };
  }

  // Session exists -> straight to app
  redirect("/");
}
