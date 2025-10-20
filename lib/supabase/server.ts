import { cookies } from "next/headers";
import { createServerClient as createServerClientSupabase } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function createServerClient(): Promise<SupabaseClient> {
  const cookieStore = await cookies();

  return createServerClientSupabase(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Server Component context - cookies will be set on next request
          }
        },
      },
    }
  ) as SupabaseClient;
}
