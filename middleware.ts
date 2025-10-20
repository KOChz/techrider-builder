// middleware.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Define protected routes
const protectedRoutes = ["/dashboard", "/profile", "/settings"];
const authRoutes = ["/login", "/signup"];

export async function middleware(request: NextRequest) {
  try {
    // Initialize response
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    // Create Supabase client with improved cookie handling
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            // Set cookies on both request and response
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

    // Get current user
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    // Handle auth errors gracefully
    if (error) {
      console.error("Auth error in middleware:", error.message);
      // Continue without auth check if there's an error
      return response;
    }

    const path = request.nextUrl.pathname;
    const isProtectedRoute = protectedRoutes.some((route) =>
      path.startsWith(route)
    );
    const isAuthRoute = authRoutes.includes(path);

    // Redirect logic
    if (!user && isProtectedRoute) {
      // Redirect to login if accessing protected route without auth
      const redirectUrl = new URL("/login", request.url);
      redirectUrl.searchParams.set("redirect", path);
      return NextResponse.redirect(redirectUrl);
    }

    if (user && isAuthRoute) {
      // Redirect to dashboard if accessing auth routes while logged in
      const redirectUrl = new URL("/dashboard", request.url);
      return NextResponse.redirect(redirectUrl);
    }

    return response;
  } catch (error) {
    // Log error and continue without auth check
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
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - public folder
     * - API routes that don't need auth
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|public|api/webhooks).*)",
  ],
};
