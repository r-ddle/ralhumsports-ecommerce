import { NextRequest } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import jwt from 'jsonwebtoken'

export interface AuthUser {
  id: number
  email: string
  role: 'super-admin' | 'admin' | 'product-manager' | 'content-editor'
  isActive: boolean
}

export interface AuthContext {
  user: AuthUser | null
  isAuthenticated: boolean
  isAdmin: boolean
  isAdminOrManager: boolean
}

// JWT Payload type definition
interface JWTPayload {
  id: number
  email?: string
  collection?: string
  iat?: number
  exp?: number
}

/**
 * Extract and validate PayloadCMS JWT token from request
 */
export async function getAuthContext(
  cookies: ReturnType<typeof import('next/headers').cookies>,
  headers?: ReturnType<typeof import('next/headers').headers>,
): Promise<AuthContext> {
  try {
    // Extract token from Authorization header or cookie
    let token: string | undefined
    let authHeader: string | undefined
    if (headers) {
      authHeader = headers.get('authorization') || undefined
    }
    token = authHeader?.replace('Bearer ', '') || cookies.get('payload-token')?.value

    if (!token) {
      return {
        user: null,
        isAuthenticated: false,
        isAdmin: false,
        isAdminOrManager: false,
      }
    }

    // Verify JWT token (PayloadCMS uses the PAYLOAD_SECRET)
    const secret = process.env.PAYLOAD_SECRET
    if (!secret) {
      throw new Error('PAYLOAD_SECRET not configured')
    }

    // Type-safe JWT verification
    const decoded = jwt.verify(token, secret) as JWTPayload

    if (!decoded.id) {
      throw new Error('Invalid token payload')
    }

    // Get user from database to ensure they're still active
    const payload = await getPayload({ config })
    const user = await payload.findByID({
      collection: 'users',
      id: decoded.id,
    })

    if (!user || !user.isActive) {
      throw new Error('User not found or inactive')
    }

    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      role: user.role || 'content-editor',
      isActive: user.isActive ?? true,
    }

    return {
      user: authUser,
      isAuthenticated: true,
      isAdmin: ['super-admin', 'admin'].includes(authUser.role),
      isAdminOrManager: ['super-admin', 'admin', 'product-manager'].includes(authUser.role),
    }
  } catch (error) {
    console.error('Auth error:', error)
    return {
      user: null,
      isAuthenticated: false,
      isAdmin: false,
      isAdminOrManager: false,
    }
  }
}

/**
 * Middleware to require authentication
 */
export function requireAuth(
  handler: (request: NextRequest, auth: AuthContext) => Promise<Response>,
) {
  return async (request: NextRequest) => {
    const auth = await getAuthContext(request)

    if (!auth.isAuthenticated) {
      return new Response(JSON.stringify({ success: false, error: 'Authentication required' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return handler(request, auth)
  }
}

/**
 * Middleware to require admin access
 */
export function requireAdmin(
  handler: (request: NextRequest, auth: AuthContext) => Promise<Response>,
) {
  return async (request: NextRequest) => {
    const auth = await getAuthContext(request)

    if (!auth.isAuthenticated) {
      return new Response(JSON.stringify({ success: false, error: 'Authentication required' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    if (!auth.isAdmin) {
      return new Response(JSON.stringify({ success: false, error: 'Admin access required' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return handler(request, auth)
  }
}

/**
 * Middleware to require admin or product manager access
 */
export function requireAdminOrManager(
  handler: (request: NextRequest, auth: AuthContext) => Promise<Response>,
) {
  return async (request: NextRequest) => {
    const auth = await getAuthContext(request)

    if (!auth.isAuthenticated) {
      return new Response(JSON.stringify({ success: false, error: 'Authentication required' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    if (!auth.isAdminOrManager) {
      return new Response(
        JSON.stringify({ success: false, error: 'Admin or product manager access required' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } },
      )
    }

    return handler(request, auth)
  }
}
