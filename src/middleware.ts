import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware for authentication and route protection.
 */
export function middleware(request: NextRequest) {
  // Placeholder for auth protection logic
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
