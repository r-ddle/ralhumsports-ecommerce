// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import payloadConfig from '@payload-config' // rename import to avoid clash

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // 1. Skip public routes
  const publicRoutes = [
    '/about',
    '/brands',
    '/checkout',
    '/contact',
    '/orders',
    '/privacy-policy',
    '/products',
    '/return-policy',
    '/terms-conditions',
    '/favicon',
    '/public',
    '/static',
    '/images',
    '/icons',
    '/robots.txt',
    '/sitemap.xml',
    '/assets',
    '/fonts',
    '/health',
    '/status',
    '/api',
    '/_next',
    '/docs',
    '/help',
    '/support',
    '/legal',
    '/blog',
  ]
  if (publicRoutes.some((p) => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  // 2. Only protect /dashboard/**
  if (!pathname.startsWith('/dashboard')) return NextResponse.next()

  // 3. Ask Payload who is logged in
  let user
  try {
    const payload = await getPayload({ config: payloadConfig })
    const cookieHeader = request.headers.get('cookie') ?? ''
    const { user: maybeUser } = await payload.auth({
      headers: new Headers({ cookie: cookieHeader }),
    })
    user = maybeUser
  } catch (err) {
    console.error('Auth check failed:', err)
    user = null
  }

  // 4. Not logged in → redirect
  if (!user) {
    const loginUrl = new URL('/dashboard/login', request.url)
    loginUrl.searchParams.set('from', pathname)

    const res = NextResponse.redirect(loginUrl)
    res.cookies.set('payload-token', '', {
      expires: new Date(0),
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    })
    return res
  }

  // 5. Role checks
  const role = (user.role as string) || ''
  const roleRules: Record<string, string[]> = {
    '/dashboard/users': ['super-admin'],
    '/dashboard/orders': ['admin', 'super-admin'],
    '/dashboard/customers': ['admin', 'super-admin'],
    '/dashboard/products': ['admin', 'product-manager', 'super-admin'],
    '/dashboard/inventory': ['admin', 'product-manager', 'super-admin'],
  }

  for (const [prefix, allowed] of Object.entries(roleRules)) {
    if (pathname.startsWith(prefix) && !allowed.includes(role)) {
      const noAccess = new URL('/dashboard', request.url)
      noAccess.searchParams.set('error', 'access_denied')
      return NextResponse.redirect(noAccess)
    }
  }

  // 6. All good
  return NextResponse.next()
}

export const middlewareConfig = {
  matcher: ['/dashboard/:path*', '/dashboard'],
}
