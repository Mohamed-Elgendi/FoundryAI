import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from './supabase-middleware';

// Protected routes that require authentication
const PROTECTED_ROUTES = [
  '/dashboard',
  '/build',
  '/launch',
  '/revenue',
  '/settings',
  '/profile',
];

// Auth routes that should redirect if already logged in
const AUTH_ROUTES = [
  '/login',
  '/signup',
  '/forgot-password',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Update session
  const response = await updateSession(request);
  
  // Check if route is protected
  const isProtectedRoute = PROTECTED_ROUTES.some(route => 
    pathname.startsWith(route)
  );
  
  const isAuthRoute = AUTH_ROUTES.some(route => 
    pathname.startsWith(route)
  );

  // Get user from session
  const supabase = (response as unknown as { supabase?: { auth?: { getUser: () => Promise<{ data: { user: unknown } }> } } }).supabase;
  let user = null;
  
  try {
    const { data } = await supabase?.auth?.getUser() || { data: { user: null } };
    user = data.user;
  } catch {
    user = null;
  }

  // Redirect unauthenticated users from protected routes
  if (isProtectedRoute && !user) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth routes
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
