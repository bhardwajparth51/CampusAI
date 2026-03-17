import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware for authentication and route protection.
 */
export function middleware(request: NextRequest) {
  // Use a fallback or ensure the env is loaded. 
  // Next.js Edge runtime can sometimes be picky with env variables.
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "69b907400023414ffd36";
  const sessionCookieName = `a_session_${projectId}`;
  const session = request.cookies.get(sessionCookieName);

  const isDashboardRoute = request.nextUrl.pathname.startsWith("/dashboard");

  if (isDashboardRoute) {
    const allCookies = request.cookies.getAll().map(c => c.name);
    console.log(`Middleware: Checking route ${request.nextUrl.pathname}`);
    console.log(`Middleware: Project ID used: ${projectId}`);
    console.log(`Middleware: Looking for cookie: ${sessionCookieName}`);
    console.log(`Middleware: All Cookies: ${allCookies.join(", ")}`);
    console.log(`Middleware: Session found: ${!!session}`);
    
    if (!session) {
      // Check if there's ANY appwrite session cookie
      const anyAppwriteSession = allCookies.find(name => name.startsWith("a_session_"));
      if (anyAppwriteSession) {
        console.log(`Middleware: Found DIFFERENT appwrite session: ${anyAppwriteSession}. Redirection loop might be due to project ID mismatch.`);
        return NextResponse.redirect(new URL("/login?error=project_mismatch", request.url));
      }

      console.log("Middleware: No session cookie found. If you just logged in, this might be a cross-domain cookie issue on localhost.");
      // In development, we might want to let the client handle it if cookies are being weird
      // return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
