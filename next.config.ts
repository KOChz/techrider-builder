// middleware.ts
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Only handle basic redirects, let components handle auth
  const path = request.nextUrl.pathname;

  // Skip middleware for static assets and API routes
  if (path.startsWith("/_next") || path.startsWith("/api")) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
