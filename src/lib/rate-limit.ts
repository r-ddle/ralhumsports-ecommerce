import { NextRequest } from 'next/server'

interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Max requests per window
  message?: string
  skipSuccessfulRequests?: boolean
}

interface RateLimitEntry {
  count: number
  resetTime: number
}

// In-memory store for rate limiting
// Note: This resets on server restart, which is fine for basic protection
const rateLimitStore = new Map<string, RateLimitEntry>()

// Clean up old entries every 5 minutes
setInterval(
  () => {
    const now = Date.now()
    for (const [key, entry] of rateLimitStore.entries()) {
      if (now > entry.resetTime) {
        rateLimitStore.delete(key)
      }
    }
  },
  5 * 60 * 1000,
)

/**
 * Get client IP address from request
 */
function getClientIP(request: NextRequest): string {
  // Try to get real IP from various headers (for proxies/load balancers)
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const cfConnectingIp = request.headers.get('cf-connecting-ip') // Cloudflare

  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }

  if (realIp) {
    return realIp
  }

  if (cfConnectingIp) {
    return cfConnectingIp
  }

  // Fallback to unknown if no IP header is found
  return 'unknown'
}

/**
 * Rate limiting middleware
 */
export function rateLimit(config: RateLimitConfig) {
  return async (request: NextRequest, next: () => Promise<Response>): Promise<Response> => {
    // ADDED: Skip rate limiting in development mode
    if (process.env.NODE_ENV === 'development') {
      console.log('[Rate Limit] Skipping in development mode')
      return next()
    }

    const ip = getClientIP(request)
    const key = `${ip}:${request.nextUrl.pathname}`
    const now = Date.now()

    console.log(
      `[Rate Limit] Checking ${key}, Current count: ${rateLimitStore.get(key)?.count || 0}/${config.maxRequests}`,
    )

    // Get or create rate limit entry
    let entry = rateLimitStore.get(key)

    if (!entry || now > entry.resetTime) {
      // Create new entry or reset expired one
      entry = {
        count: 0,
        resetTime: now + config.windowMs,
      }
    }

    // Increment request count
    entry.count++
    rateLimitStore.set(key, entry)

    // Check if limit exceeded
    if (entry.count > config.maxRequests) {
      const retryAfter = Math.ceil((entry.resetTime - now) / 1000)

      console.log(`[Rate Limit] BLOCKED ${key}, Count: ${entry.count}/${config.maxRequests}`)

      return new Response(
        JSON.stringify({
          success: false,
          error: config.message || 'Too many requests',
          retryAfter,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': retryAfter.toString(),
            'X-RateLimit-Limit': config.maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': entry.resetTime.toString(),
            // ADDED: CORS headers for error responses
            'Access-Control-Allow-Origin': 'https://ralhumsports.lk,https://www.ralhumsports.lk',
            'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
          },
        },
      )
    }

    console.log(`[Rate Limit] ALLOWED ${key}, Count: ${entry.count}/${config.maxRequests}`)

    // Continue to next handler
    const response = await next()

    // Add rate limit headers to successful responses
    const remaining = Math.max(0, config.maxRequests - entry.count)
    response.headers.set('X-RateLimit-Limit', config.maxRequests.toString())
    response.headers.set('X-RateLimit-Remaining', remaining.toString())
    response.headers.set('X-RateLimit-Reset', entry.resetTime.toString())

    return response
  }
}

/**
 * Predefined rate limit configurations - UPDATED for production testing
 */
export const rateLimitConfigs = {
  // RELAXED: For order creation (was too strict)
  strict: {
    windowMs: 5 * 60 * 1000, // 5 minutes (reduced from 15)
    maxRequests: 20, // Increased from 5 to 20
    message: 'Too many order requests. Please try again in a few minutes.',
  },

  // RELAXED: Moderate for API operations
  moderate: {
    windowMs: 10 * 60 * 1000, // 10 minutes (reduced from 15)
    maxRequests: 200, // Increased from 100 to 200
    message: 'Too many requests. Please try again later.',
  },

  // Lenient for public browsing
  lenient: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100, // Increased from 60 to 100
    message: 'Too many requests. Please slow down.',
  },

  // Search-specific (protect against search spam)
  search: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 30, // Increased from 20 to 30
    message: 'Too many search requests. Please wait a moment.',
  },

  // NEW: Very lenient for testing PayHere integration
  payment: {
    windowMs: 2 * 60 * 1000, // 2 minutes
    maxRequests: 10, // 10 payment attempts per 2 minutes
    message: 'Too many payment requests. Please wait before trying again.',
  },
}

/**
 * Apply rate limiting to handler
 */
export function withRateLimit(
  config: RateLimitConfig,
  handler: (request: NextRequest) => Promise<Response>,
) {
  const rateLimitMiddleware = rateLimit(config)

  return async (request: NextRequest) => {
    return rateLimitMiddleware(request, () => handler(request))
  }
}
