import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// في الوقت الحالي، سنترك التحقق من authentication للـ frontend components
// لأن middleware لا يستطيع الوصول إلى localStorage
export function middleware(request: NextRequest) {
  // يمكن إضافة logic إضافي هنا في المستقبل مثل:
  // - rate limiting
  // - security headers
  // - redirects
  // - etc.

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
