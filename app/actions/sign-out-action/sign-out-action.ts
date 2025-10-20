"use server";

import { redirect } from "next/navigation";
import { createServerClientService } from "@/lib/supabase/server";

export async function signOutAction(formData: FormData) {
  const supabase = await createServerClientService();

  await supabase.auth.signOut();

  const redirectTo = formData.get("redirectTo") as string;
  redirect(redirectTo || "/login");
}
