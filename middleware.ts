import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // --- Force HTTPS in production ---
  if (
    process.env.NODE_ENV === 'production' &&
    request.headers.get('x-forwarded-proto') === 'http' &&
    !request.headers.get('host')?.startsWith('localhost') &&
    !request.headers.get('host')?.includes('vercel.app')
  ) {
    const url = request.nextUrl.clone()
    url.protocol = 'https:'
    url.host = request.headers.get('host') || ''
    return NextResponse.redirect(url, 308)
  }
  const { headers, nextUrl } = request
  const host = headers.get('host')

  // --- Subdomain routing for the admin panel ---
  // If the request is for the admin subdomain, rewrite to the /admin path unless already on /admin, /api, or /_next
  if (host === process.env.NEXT_PUBLIC_ADMIN_DOMAIN) {
    if (
      !nextUrl.pathname.startsWith('/admin') &&
      !nextUrl.pathname.startsWith('/api') &&
      !nextUrl.pathname.startsWith('/_next')
    ) {
      nextUrl.pathname = '/admin'
      return NextResponse.rewrite(nextUrl)
    }
  }

  // Restrict /admin route access to admin.ralhumsports.lk in production, localhost:3000 in development
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const origin = request.headers.get('origin') || ''
    const isDev = process.env.NODE_ENV === 'development'
    const isProd = process.env.NODE_ENV === 'production'
    const allowedDev = host === 'localhost:3000' || origin === 'http://localhost:3000'
    const allowedProd =
      host === process.env.NEXT_PUBLIC_ADMIN_DOMAIN ||
      origin === `https://${process.env.NEXT_PUBLIC_ADMIN_DOMAIN}`

    if ((isProd && !allowedProd) || (isDev && !allowedDev)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Admin dashboard access denied' }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }
  }
  const response = NextResponse.next()

  // Add security headers to all responses
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  // CORS headers for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Define allowed origins
    const allowedOrigins = [
      process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
      'https://ralhumsports.lk', // Replace with your production domain
      'https://ralhumsports.lk', // Replace with your actual domain
    ].filter(Boolean)

    const origin = request.headers.get('origin') || ''

    // Check if the origin is allowed
    if (allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin)
    } else if (process.env.NODE_ENV === 'development') {
      // Allow localhost in development
      response.headers.set('Access-Control-Allow-Origin', 'http://localhost:3000')
    }

    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH')
    response.headers.set(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, X-Requested-With',
    )
    response.headers.set('Access-Control-Allow-Credentials', 'true')
    response.headers.set('Access-Control-Max-Age', '86400') // 24 hours

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: response.headers })
    }
  }

  // Basic request size limit (10MB)
  const contentLength = request.headers.get('content-length')
  if (contentLength && parseInt(contentLength) > 10 * 1024 * 1024) {
    return new Response(JSON.stringify({ success: false, error: 'Request too large' }), {
      status: 413,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Block suspicious user agents
  const userAgent = request.headers.get('user-agent')
  if (!userAgent || userAgent.length < 10) {
    // Allow empty user agents for legitimate tools, but log it
    console.log('Request with suspicious user agent:', userAgent)
  }

  // Basic bot protection for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const suspiciousBots = ['curl', 'wget', 'python-requests', 'scrapy']
    if (userAgent && suspiciousBots.some((bot) => userAgent.toLowerCase().includes(bot))) {
      return new Response(JSON.stringify({ success: false, error: 'Access denied' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      })
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
