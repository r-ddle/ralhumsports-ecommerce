import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  console.log('[Middleware] Processing request:', request.nextUrl.pathname)
  console.log('[Middleware] Host:', request.headers.get('host'))
  console.log('[Middleware] Environment:', process.env.NODE_ENV)

  const { headers, nextUrl } = request
  const host = headers.get('host')
  const pathname = nextUrl.pathname

  // --- Force HTTPS in production ---
  if (
    process.env.NODE_ENV === 'production' &&
    request.headers.get('x-forwarded-proto') === 'http' &&
    !request.headers.get('host')?.startsWith('localhost') &&
    !request.headers.get('host')?.includes('vercel.app')
  ) {
    console.log('[Middleware] Redirecting HTTP to HTTPS')
    const url = request.nextUrl.clone()
    url.protocol = 'https:'
    url.host = request.headers.get('host') || ''
    return NextResponse.redirect(url, 308)
  }

  // --- FIXED: Admin subdomain routing ---
  // Check if this is the admin subdomain
  if (host === process.env.NEXT_PUBLIC_ADMIN_DOMAIN) {
    console.log('[Middleware] Admin subdomain detected:', host)

    // Don't rewrite if already on admin path, API routes, or static assets
    if (
      !pathname.startsWith('/admin') &&
      !pathname.startsWith('/api') &&
      !pathname.startsWith('/_next') &&
      !pathname.startsWith('/favicon') &&
      pathname !== '/robots.txt' &&
      pathname !== '/sitemap.xml'
    ) {
      console.log('[Middleware] Rewriting to /admin for path:', pathname)

      // Rewrite root requests to /admin
      if (pathname === '/') {
        const adminUrl = new URL('/admin', request.url)
        console.log('[Middleware] Rewriting root to:', adminUrl.toString())
        return NextResponse.rewrite(adminUrl)
      }

      // For other paths, rewrite to /admin + the path
      const adminUrl = new URL(`/admin${pathname}`, request.url)
      console.log('[Middleware] Rewriting path to:', adminUrl.toString())
      return NextResponse.rewrite(adminUrl)
    }
  }

  // --- FIXED: Admin route access control ---
  if (pathname.startsWith('/admin')) {
    console.log('[Middleware] Admin route access check for:', pathname)

    const origin = request.headers.get('origin') || ''
    const referer = request.headers.get('referer') || ''
    const isDev = process.env.NODE_ENV === 'development'
    const isProd = process.env.NODE_ENV === 'production'

    // Development access control
    const allowedDev =
      host === 'localhost:3000' ||
      origin === 'http://localhost:3000' ||
      referer.includes('localhost:3000')

    // Production access control
    const allowedProd =
      host === process.env.NEXT_PUBLIC_ADMIN_DOMAIN ||
      origin === `https://${process.env.NEXT_PUBLIC_ADMIN_DOMAIN}` ||
      referer.includes(process.env.NEXT_PUBLIC_ADMIN_DOMAIN || '')

    console.log('[Middleware] Access control check:', {
      isDev,
      isProd,
      allowedDev,
      allowedProd,
      host,
      origin,
      adminDomain: process.env.NEXT_PUBLIC_ADMIN_DOMAIN,
    })

    // Block access if not allowed
    if ((isProd && !allowedProd) || (isDev && !allowedDev)) {
      console.log('[Middleware] Admin access denied')
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Admin dashboard access denied',
          allowedDomain: process.env.NEXT_PUBLIC_ADMIN_DOMAIN,
        }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }
  }

  const response = NextResponse.next()

  // --- Enhanced security headers with PayHere compatibility ---
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')

  // CRITICAL: Use strict-origin-when-cross-origin to preserve Referer header for PayHere
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  // --- Enhanced CORS for API routes ---
  if (pathname.startsWith('/api/')) {
    console.log('[Middleware] Processing API route:', pathname)

    // Define allowed origins including PayHere domains
    const allowedOrigins = [
      process.env.NEXT_PUBLIC_SERVER_URL || 'https://ralhumsports.lk',
      'https://ralhumsports.lk',
      'https://www.ralhumsports.lk',
      'https://admin.ralhumsports.lk',
      // PayHere domains for webhook callbacks
      'https://www.payhere.lk',
      'https://sandbox.payhere.lk',
      // Development
      'http://localhost:3000',
      'https://localhost:3000',
    ].filter(Boolean)

    const origin = request.headers.get('origin') || ''

    // Special handling for PayHere notification endpoint
    if (pathname === '/api/payhere/notify') {
      console.log('[Middleware] PayHere notification endpoint')

      // Allow PayHere to send notifications without strict CORS
      response.headers.set('Access-Control-Allow-Origin', '*')
      response.headers.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
      response.headers.set(
        'Access-Control-Allow-Headers',
        'Content-Type, Referer, User-Agent, X-Forwarded-For',
      )

      // Handle preflight requests
      if (request.method === 'OPTIONS') {
        console.log('[Middleware] PayHere preflight request')
        return new Response(null, { status: 204, headers: response.headers })
      }
    } else {
      // Regular CORS handling for other API routes
      console.log('[Middleware] Regular API CORS for origin:', origin)

      if (allowedOrigins.includes(origin)) {
        response.headers.set('Access-Control-Allow-Origin', origin)
        console.log('[Middleware] Origin allowed:', origin)
      } else if (process.env.NODE_ENV === 'development') {
        // Allow localhost in development
        response.headers.set('Access-Control-Allow-Origin', 'http://localhost:3000')
        console.log('[Middleware] Development mode - allowing localhost')
      } else {
        console.log('[Middleware] Origin not in allowlist:', origin)
      }

      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH')
      response.headers.set(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization, X-Requested-With, Referer, X-Forwarded-For',
      )
      response.headers.set('Access-Control-Allow-Credentials', 'true')
      response.headers.set('Access-Control-Max-Age', '86400') // 24 hours

      // Handle preflight requests
      if (request.method === 'OPTIONS') {
        console.log('[Middleware] Regular API preflight request')
        return new Response(null, { status: 204, headers: response.headers })
      }
    }
  }

  // --- Request size limit ---
  const contentLength = request.headers.get('content-length')
  if (contentLength && parseInt(contentLength) > 10 * 1024 * 1024) {
    console.log('[Middleware] Request too large:', contentLength)
    return new Response(JSON.stringify({ success: false, error: 'Request too large' }), {
      status: 413,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // --- User agent filtering (but allow PayHere) ---
  const userAgent = request.headers.get('user-agent') || ''
  const isPayHereRequest = pathname === '/api/payhere/notify'

  if (!userAgent || userAgent.length < 10) {
    if (!isPayHereRequest) {
      console.log('[Middleware] Suspicious user agent:', userAgent)
    }
  }

  // --- Bot protection (but allow PayHere) ---
  if (pathname.startsWith('/api/') && !isPayHereRequest) {
    const suspiciousBots = ['curl', 'wget', 'python-requests', 'scrapy']
    if (userAgent && suspiciousBots.some((bot) => userAgent.toLowerCase().includes(bot))) {
      console.log('[Middleware] Blocking suspicious bot:', userAgent)
      return new Response(JSON.stringify({ success: false, error: 'Access denied' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      })
    }
  }

  console.log('[Middleware] Request processed successfully')
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder assets
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
}
