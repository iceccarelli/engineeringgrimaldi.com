import { NextResponse, type NextRequest } from 'next/server';

/**
 * Locale routing without breaking the canonical origin:
 * - '/'            → rewritten to /en (English serves at the apex, 200)
 * - '/de/...'      → served as-is (German tree, 200)
 * - '/en/...'      → 308 to the unprefixed path (no duplicate content)
 * - anything else  → rewritten into the en tree; unknown paths hit the
 *                    [...missing] catch-all and return a real 404.
 * Assets, API routes and metadata files are excluded by the matcher.
 */

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  if (pathname === '/en' || pathname.startsWith('/en/')) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(3) || '/';
    return NextResponse.redirect(url, 308);
  }

  if (pathname === '/de' || pathname.startsWith('/de/')) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `/en${pathname === '/' ? '' : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    // Everything except: api, Next internals, static files with an extension,
    // and root metadata routes.
    '/((?!api|_next|_vercel|favicon\\.svg|icon\\.svg|robots\\.txt|sitemap\\.xml|opengraph-image|.*\\..*).*)',
  ],
};
