import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

const cleanEnvVar = (val) => {
  if (!val) return val;
  return val.trim().replace(/^['"]|['"]$/g, '').trim();
};

export async function updateSession(request) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = cleanEnvVar(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const supabaseKey = cleanEnvVar(process.env.NEXT_PUBLIC_SUPABASE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value, options))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Handle PKCE code exchange in the middleware
  const code = request.nextUrl.searchParams.get('code')
  if (code) {
    try {
      await supabase.auth.exchangeCodeForSession(code)
      
      const url = request.nextUrl.clone()
      url.searchParams.delete('code')
      url.searchParams.delete('next')
      
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        if (url.pathname === '/' || url.pathname === '/auth') {
          url.pathname = '/dashboard'
        }
      } else {
        url.pathname = '/auth'
      }
      return NextResponse.redirect(url)
    } catch (err) {
      console.error('Error exchanging code for session in middleware:', err)
      const url = request.nextUrl.clone()
      url.pathname = '/auth'
      url.searchParams.delete('code')
      url.searchParams.delete('next')
      return NextResponse.redirect(url)
    }
  }

  // Get user session to refresh tokens automatically
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  if (user) {
    if (pathname === '/auth' || pathname === '/') {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
  } else {
    // If not authenticated, redirect to /auth (excluding api, static assets, etc.)
    if (
      pathname !== '/auth' &&
      !pathname.startsWith('/api') &&
      !pathname.includes('.')
    ) {
      const url = request.nextUrl.clone()
      url.pathname = '/auth'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
