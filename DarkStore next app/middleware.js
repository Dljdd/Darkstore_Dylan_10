import { NextResponse } from 'next/server';

export function middleware(request) {
  // Get the token from the cookies
  const token = request.cookies.get('next-auth.session-token')?.value || 
                request.cookies.get('__session')?.value;

  const { pathname } = request.nextUrl;

  // Public paths that don't require authentication
  const publicPaths = ['/', '/signin', '/signup'];
  const isPublicPath = publicPaths.includes(pathname);

  // Protected routes
  const protectedPaths = ['/dashboard', '/windsurfMap'];
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));

  // Redirect to signin if accessing protected route without auth
  if (isProtectedPath && !token) {
    const url = new URL('/signin', request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  // Redirect to dashboard if accessing auth pages while authenticated
  if (token && isPublicPath) {
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
