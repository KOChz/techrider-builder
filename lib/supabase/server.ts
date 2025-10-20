import { SupabaseClient } from "@supabase/supabase-js";

export interface CookieOptions {
  path?: string;
  domain?: string;
  maxAge?: number;
  expires?: Date;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "lax" | "strict" | "none";
}
declare module "@supabase/ssr" {
  export function createServerClient(
    supabaseUrl: string,
    supabaseKey: string,
    options: {
      cookies: {
        getAll(): Array<{ name: string; value: string }>;
        setAll(
          cookies: Array<{
            name: string;
            value: string;
            options: CookieOptions;
          }>
        ): void;
      };
    }
  ): SupabaseClient;
}
