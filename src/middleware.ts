/**
 * Middleware
 * 
 * Handles authentication, redirects, and feature gating.
 */

import { createSupabaseMiddlewareClient } from "@/lib/supabase/middleware";
import { type NextRequest } from "next/server";

// Paths that don't require authentication
const PUBLIC_PATHS = [
  "/",
  "/sign-in",
  "/sign-up",
  "/magic-link",
  "/forgot-password",
  "/landing",
  "/api/webhooks/stripe",
];

// Paths that require authentication
const PROTECTED_PATHS = [
  "/teacher",
  "/student",
];

// Paths that redirect authenticated users away
const AUTH_REDIRECT_PATHS = [
  "/sign-in",
  "/sign-up",
];

export async function middleware(request: NextRequest) {
  const { supabase, response } = createSupabaseMiddlewareClient(request);

  // Refresh session if expired
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = request.nextUrl;

  // Check if this is a public path
  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));

  // Check if this is a protected path
  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));

  // Check if this is an auth redirect path
  const isAuthRedirect = AUTH_REDIRECT_PATHS.some((p) => pathname.startsWith(p));

  // Redirect authenticated users away from auth pages
  if (session && isAuthRedirect) {
    // Check role and redirect to appropriate dashboard
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("role")
      .eq("id", session.user.id)
      .single();

    const redirectPath = profile?.role === "teacher"
      ? "/teacher/dashboard"
      : "/student/dashboard";

    return Response.redirect(new URL(redirectPath, request.url));
  }

  // Redirect unauthenticated users to sign-in
  if (!session && isProtected) {
    return Response.redirect(new URL("/sign-in", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public images)
     * - api (API routes) - except webhooks
     */
    "/((?!_next/static|_next/image|favicon.ico|images|api/webhooks).*)",
  ],
};
