"use server";

import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";

export async function signOutAction(formData: FormData) {
  const supabase = await createServerClient();

  await supabase.auth.signOut();

  const redirectTo = formData.get("redirectTo") as string;
  redirect(redirectTo || "/login");
}
