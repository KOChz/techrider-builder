import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/auth/callback", "/auth/error"];
const AUTH_ROUTES = ["/login", "/signup"];
const DASHBOARD_PREFIX = "/dashboard";
const DEFAULT_REDIRECT = "/dashboard/my-projects";
const LOGIN_PATH = "/login";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Early returns for public routes
  if (PUBLIC_ROUTES.some((route) => path.startsWith(route))) {
    return NextResponse.next();
  }

  // Redirect root to default dashboard
  if (path === "/") {
    return NextResponse.redirect(new URL(DEFAULT_REDIRECT, request.url));
  }

  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const isProtectedRoute = path.startsWith(DASHBOARD_PREFIX);
  const isAuthRoute = AUTH_ROUTES.includes(path);

  if (isProtectedRoute || isAuthRoute) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user && isProtectedRoute) {
        const redirectUrl = new URL(LOGIN_PATH, request.url);
        redirectUrl.searchParams.set("redirect", path);
        return NextResponse.redirect(redirectUrl);
      }

      if (user && isAuthRoute) {
        return NextResponse.redirect(new URL(DEFAULT_REDIRECT, request.url));
      }
    } catch (error) {
      console.error("Unexpected middleware error:", error);

      if (isProtectedRoute) {
        const redirectUrl = new URL(LOGIN_PATH, request.url);
        redirectUrl.searchParams.set("redirect", path);
        return NextResponse.redirect(redirectUrl);
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
