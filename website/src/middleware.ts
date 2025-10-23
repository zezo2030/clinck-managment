import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // حماية صفحات الإدارة - التحقق من وجود admin_token في cookies
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const adminToken = request.cookies.get('admin_token')?.value;
    
    if (!adminToken) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // حماية صفحات تتطلب تسجيل دخول عادي (منع admin_token)
  const protectedRoutes = ['/dashboard', '/profile', '/consultations'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  if (isProtectedRoute) {
    const regularToken = request.cookies.get('auth_token')?.value;
    const adminToken = request.cookies.get('admin_token')?.value;
    
    // إذا كان هناك admin token، امسحه واعيد التوجيه
    if (adminToken && !regularToken) {
      const response = NextResponse.redirect(new URL('/admin', request.url));
      return response;
    }
    
    if (!regularToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // إعادة توجيه المستخدمين المسجلين من صفحات التسجيل
  if (pathname === '/login' || pathname === '/register') {
    const regularToken = request.cookies.get('auth_token')?.value;
    const adminToken = request.cookies.get('admin_token')?.value;
    
    if (regularToken) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    
    if (adminToken) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  // إعادة توجيه الأدمن من صفحة تسجيل الدخول العادية
  if (pathname === '/login') {
    const adminToken = request.cookies.get('admin_token')?.value;
    
    if (adminToken) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
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
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
