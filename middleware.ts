import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Return immediately without any processing
  return;
}

export const config = {
  matcher: "/:path*",
};
