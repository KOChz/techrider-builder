import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const protectedRoutes = [
  "/dashboard/create-new",
  "/dashboard/profile",
  "/dashboard/settings",
];
const authRoutes = ["/login", "/signup"];
const publicRoutes = ["/auth/callback", "/auth/confirm"];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Skip middleware for auth callback routes - they handle their own auth
  if (publicRoutes.some((route) => path.startsWith(route))) {
    return NextResponse.next();
  }

  try {
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    if (path === "/") {
      return NextResponse.redirect(
        new URL("/dashboard/my-projects", request.url)
      );
    }

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => {
              request.cookies.set(name, value);
            });

            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            });

            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error("Auth error in middleware:", error.message);
      return response;
    }

    const isProtectedRoute = protectedRoutes.some((route) =>
      path.startsWith(route)
    );
    const isAuthRoute = authRoutes.includes(path);

    if (!user && isProtectedRoute) {
      const redirectUrl = new URL("/login", request.url);
      redirectUrl.searchParams.set("redirect", path);
      return NextResponse.redirect(redirectUrl);
    }

    if (user && isAuthRoute) {
      return NextResponse.redirect(
        new URL("/dashboard/my-projects", request.url)
      );
    }

    return response;
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/signup",
    "/dashboard/:path*",
    "/profile/:path*",
    "/settings/:path*",
  ],

  // matcher: [
  //   "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|public|api/webhooks).*)",
  // ],
};
