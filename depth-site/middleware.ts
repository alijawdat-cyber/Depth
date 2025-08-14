import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip next internals and auth endpoints and static assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/public') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  const token = await getToken({ req: request });

  const isApi = pathname.startsWith('/api/');
  const isAdminArea = pathname.startsWith('/admin') || pathname.startsWith('/api/portal/admin');
  const isPortalAuth = pathname.startsWith('/portal/auth');
  const isPortalAbout = pathname.startsWith('/portal/about');
  const isPortalArea = pathname.startsWith('/portal') && !isPortalAuth && !isPortalAbout;

  // Admin protection: requires admin role
  if (isAdminArea) {
    if (!token || token.role !== 'admin') {
      if (isApi) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
      }
      const url = request.nextUrl.clone();
      url.pathname = '/portal/auth/signin';
      url.searchParams.set('from', 'admin');
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Portal protection: requires any authenticated user (client or admin)
  if (isPortalArea) {
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = '/portal/auth/signin';
      url.searchParams.set('from', 'portal');
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin',
    '/api/portal/admin/:path*',
    '/portal',
    '/portal/profile',
    '/portal/(?!auth|about)(.*)',
  ],
};


