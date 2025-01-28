import { NextResponse } from 'next/server';

export function middleware(request) {
  // Get the token from the cookies
  const token = request.cookies.get('next-auth.session-token')?.value || 
                request.cookies.get('__session')?.value;

  const { pathname } = request.nextUrl;

  // Public paths that should be accessible without auth
  const publicPaths = ['/', '/signin', '/signup'];
  const isPublicPath = publicPaths.includes(pathname);

  // Protected routes that require authentication
  const protectedPaths = ['/dashboard', '/windsurfMap'];
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));

  // If user is not authenticated and tries to access protected routes
  if (isProtectedPath && !token) {
    const url = new URL('/signin', request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  // Only redirect to dashboard if user is authenticated and trying to access auth pages
  if (token && (pathname === '/signin' || pathname === '/signup')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
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
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
