import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Enforce canonical trailing slash on all page routes while exempting:
 * 1. Non-GET/HEAD methods (POST, PUT, DELETE for forms/actions are never redirected)
 * 2. Next.js Server Actions (next-action header)
 * 3. /api/* routes (so webhooks like Razorpay / WhatsApp are NEVER 308-redirected)
 * 4. Next.js internals (_next/static, _next/image, etc.)
 * 5. Static asset files (containing file extensions like .png, .jpg, .ico, .svg, .json)
 */
export function middleware(request: NextRequest) {
  // Only redirect safe read-only navigation requests
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return NextResponse.next();
  }

  // Never redirect Next.js Server Actions
  if (request.headers.has('next-action')) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  // Never redirect API routes, internal Next assets, or files with extensions
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Redirect pages missing a trailing slash (e.g. /cart -> /cart/, /admin -> /admin/)
  if (!pathname.endsWith('/')) {
    const proto =
      request.headers.get('x-forwarded-proto') ||
      request.nextUrl.protocol.replace(':', '');
    const host =
      request.headers.get('x-forwarded-host') ||
      request.headers.get('host') ||
      request.nextUrl.host;
    const search = request.nextUrl.search || '';

    const targetUrl = `${proto}://${host}${pathname}/${search}`;
    return NextResponse.redirect(new URL(targetUrl), 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt, icons
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|icon.png).*)',
  ],
};
