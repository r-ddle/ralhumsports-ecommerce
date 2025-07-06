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
    const ip = getClientIP(request)
    const key = `${ip}:${request.nextUrl.pathname}`
    const now = Date.now()

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
          },
        },
      )
    }

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
 * Predefined rate limit configurations
 */
export const rateLimitConfigs = {
  // Very restrictive for write operations
  strict: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
    message: 'Too many requests. Please try again later.',
  },

  // Moderate for API operations
  moderate: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
    message: 'Too many requests. Please try again later.',
  },

  // Lenient for public browsing
  lenient: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 60,
    message: 'Too many requests. Please slow down.',
  },

  // Search-specific (protect against search spam)
  search: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 20,
    message: 'Too many search requests. Please wait a moment.',
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
