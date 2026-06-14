import { updateSession } from '@/utils/supabase/middleware'
import { NextResponse } from 'next/server'
import { checkRateLimit } from './lib/rate-limit'

export async function middleware(request) {
  const pathname = request.nextUrl.pathname

  if (pathname.startsWith('/api/aimodel')) {
    // Extract IP address
    const xff = request.headers.get('x-forwarded-for')
    let ip = '127.0.0.1'
    if (xff) {
      ip = xff.split(',')[0].trim()
    } else {
      const realIp = request.headers.get('x-real-ip')
      if (realIp) {
        ip = realIp
      } else if (request.ip) {
        ip = request.ip
      }
    }

    const { isLimited, limit, remaining, resetTime, retryAfter } = checkRateLimit(ip)

    if (isLimited) {
      return new NextResponse(
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
      )
    }

    const response = await updateSession(request)
    response.headers.set('X-RateLimit-Limit', String(limit))
    response.headers.set('X-RateLimit-Remaining', String(remaining))
    response.headers.set('X-RateLimit-Reset', String(Math.ceil(resetTime / 1000)))
    return response
  }

  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
