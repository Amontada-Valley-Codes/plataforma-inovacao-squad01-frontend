import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const pathname = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const publicPaths = ['/', '/login'];
  
  // Check if the current path is public
  const isPublicPath = publicPaths.includes(pathname);

  // Get the token from cookies (in a real app, you'd check for a proper auth token)
  // For this demo, we'll check if there's any user data in the request
  const userAgent = request.headers.get('user-agent');
  
  // If it's a protected route and user is not authenticated
  if (!isPublicPath) {
    // In a real application, you'd check for a valid authentication token here
    // For now, we'll allow all requests to pass through since we handle auth client-side
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};