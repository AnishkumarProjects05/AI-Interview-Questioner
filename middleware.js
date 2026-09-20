import { updateSession } from '@/utils/supabase/middleware';
import { NextResponse } from 'next/server';
import { checkRateLimit } from './lib/rate-limit';

/**
 * Route-specific rate limiting configurations.
 * Protects login/signup against brute-force and AI/email APIs against resource exhaustion.
 */
const RATE_LIMIT_CONFIGS = [
  { match: (path) => path.startsWith('/auth'), maxRequests: 10, windowMs: 60000, keyPrefix: 'auth' },
  { match: (path) => path.startsWith('/api/aimodel'), maxRequests: 5, windowMs: 60000, keyPrefix: 'aimodel' },
  { match: (path) => path.startsWith('/api/analyze-resume'), maxRequests: 5, windowMs: 60000, keyPrefix: 'resume' },
  { match: (path) => path.startsWith('/api/verify-experience'), maxRequests: 5, windowMs: 60000, keyPrefix: 'verify' },
  { match: (path) => path.startsWith('/api/send-greeting-email'), maxRequests: 3, windowMs: 60000, keyPrefix: 'email' },
];

/**
 * Extracts the best candidate client IP address safely.
 */
function getClientIp(request) {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) {
    return xff.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return request.ip || '127.0.0.1';
}

/**
 * Attaches standard defensive security headers to the outgoing response.
 */
function applySecurityHeaders(response) {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  return response;
}

export async function middleware(request) {
  const pathname = request.nextUrl.pathname;
  const ip = getClientIp(request);

  // Find matching rate limit configuration if any
  const matchedConfig = RATE_LIMIT_CONFIGS.find((cfg) => cfg.match(pathname));

  if (matchedConfig) {
    const rateLimitKey = `${matchedConfig.keyPrefix}:${ip}`;
    const { isLimited, limit, remaining, resetTime, retryAfter } = checkRateLimit(rateLimitKey, {
      maxRequests: matchedConfig.maxRequests,
      windowMs: matchedConfig.windowMs,
    });

    if (isLimited) {
      const throttledResponse = new NextResponse(
        JSON.stringify({
          error: `Too many requests. Please try again in ${retryAfter} seconds.`,
          retryAfter,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(retryAfter),
            'X-RateLimit-Limit': String(limit),
            'X-RateLimit-Remaining': String(remaining),
            'X-RateLimit-Reset': String(Math.ceil(resetTime / 1000)),
          },
        }
      );
      return applySecurityHeaders(throttledResponse);
    }

    const response = await updateSession(request);
    response.headers.set('X-RateLimit-Limit', String(limit));
    response.headers.set('X-RateLimit-Remaining', String(remaining));
    response.headers.set('X-RateLimit-Reset', String(Math.ceil(resetTime / 1000)));
    return applySecurityHeaders(response);
  }

  const response = await updateSession(request);
  return applySecurityHeaders(response);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images and fonts
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
