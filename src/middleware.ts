import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Enforce canonical trailing slash on all page routes while exempting:
 * 1. /api/* routes (so webhooks like Razorpay / WhatsApp are NEVER 308-redirected)
 * 2. Next.js internals (_next/static, _next/image)
 * 3. Static asset files (containing file extensions like .png, .jpg, .ico, .svg, .json)
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Never redirect API routes, internal Next assets, or files with extensions
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Redirect pages missing a trailing slash (e.g. /books/savi-kannada-class-1 -> /books/savi-kannada-class-1/)
  if (!pathname.endsWith('/')) {
    const url = request.nextUrl.clone();
    url.pathname = `${pathname}/`;
    return NextResponse.redirect(url, 308);
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
