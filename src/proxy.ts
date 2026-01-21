import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { validateAuth } from './lib/auth';

/**
 * Next.js Proxy for API authentication
 * Validates Bearer token on all /api/* routes
 */
export function proxy(request: NextRequest) {
  // Only authenticate API routes
  if (request.nextUrl.pathname.startsWith('/api')) {
    const authHeader = request.headers.get('authorization');
    const result = validateAuth(authHeader);

    if (!result.valid) {
      return result.response;
    }
  }

  return NextResponse.next();
}

/**
 * Configure which routes the proxy should run on
 */
export const config = {
  matcher: '/api/:path*',
};
