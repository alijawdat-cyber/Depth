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
    pathname === '/favicon.ico' ||
    pathname.startsWith('/join') ||
    pathname.startsWith('/auth')
  ) {
    return NextResponse.next();
  }

  const token = await getToken({ req: request });

  const isApi = pathname.startsWith('/api/');
  
  // تحديد المناطق المحمية
  const isAdminArea = pathname.startsWith('/admin') || pathname.startsWith('/api/admin');
  const isCreatorArea = pathname.startsWith('/creators') || pathname.startsWith('/api/creators');
  const isEmployeeArea = pathname.startsWith('/employees') || pathname.startsWith('/api/employees');
  const isPortalAuth = pathname.startsWith('/portal/auth');
  const isPortalAbout = pathname.startsWith('/portal/about');
  const isPortalArea = pathname.startsWith('/portal') && !isPortalAuth && !isPortalAbout;

  // توحيد الوصول لصفحات البروفايل وفق الدور
  if (pathname === '/portal/profile' || pathname === '/admin/profile' || pathname === '/creators/profile' || pathname === '/employees/profile') {
    const role = token?.role as string | undefined;
    const profileForRole = (r?: string) => {
      switch (r) {
        case 'admin':
          return '/admin/profile';
        case 'creator':
          return '/creators/profile';
        case 'employee':
          return '/employees/profile';
        case 'client':
          return '/portal/profile';
        default:
          return '/auth/signin?from=profile';
      }
    };
    const expected = profileForRole(role);
    if (pathname !== expected) {
      const url = request.nextUrl.clone();
      url.pathname = expected;
      return NextResponse.redirect(url);
    }
  }

  // حماية منطقة الأدمن: يتطلب دور admin
  if (isAdminArea) {
    if (!token || token.role !== 'admin') {
      if (isApi) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
      }
      const url = request.nextUrl.clone();
      url.pathname = '/auth/signin';
      url.searchParams.set('from', 'admin');
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // حماية منطقة المبدعين: يتطلب دور creator
  if (isCreatorArea) {
    if (!token || token.role !== 'creator') {
      if (isApi) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
      }
      const url = request.nextUrl.clone();
      url.pathname = '/auth/signin';
      url.searchParams.set('from', 'creators');
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // حماية منطقة الموظفين: يتطلب دور employee
  if (isEmployeeArea) {
    if (!token || token.role !== 'employee') {
      if (isApi) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
      }
      const url = request.nextUrl.clone();
      url.pathname = '/auth/signin';
      url.searchParams.set('from', 'employees');
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // حماية بوابة العملاء: يتطلب دور client أو admin
  if (isPortalArea) {
    if (!token || (token.role !== 'client' && token.role !== 'admin')) {
      if (isApi) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
      }
      const url = request.nextUrl.clone();
      url.pathname = '/auth/signin';
      url.searchParams.set('from', 'portal');
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Admin routes
    '/admin/:path*',
    '/api/admin/:path*',
    
    // Creator routes
    '/creators/:path*',
    '/api/creators/:path*',
    
    // Employee routes
    '/employees/:path*',
    '/api/employees/:path*',
    
    // Client portal routes
    '/portal/:path*',
    '/api/portal/:path*',
    
    // Exclude auth and public routes
    '/((?!api/auth|_next|favicon.ico|join|auth).*)',
  ],
};


