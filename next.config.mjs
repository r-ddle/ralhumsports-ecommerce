import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // FIXED: Force HTTPS redirects in production (exclude API routes to prevent CORS issues)
  async redirects() {
    if (process.env.NODE_ENV === 'production') {
      return [
        {
          source: '/((?!api|_next|favicon.ico).*)',
          has: [
            {
              type: 'header',
              key: 'x-forwarded-proto',
              value: 'http',
            },
          ],
          destination: 'https://ralhumsports.lk/$1',
          permanent: true,
        },
      ]
    }
    return []
  },

  // ADDED: Enhanced headers for HTTPS and security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // CRITICAL: Preserve Referer header for PayHere
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ]
  },

  // UPDATED: Enhanced image configuration for HTTPS
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: '**.public.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: 'ralhumsports-ecommerce.vercel.app',
      },
      // ADDED: Support for your main domain
      {
        protocol: 'https',
        hostname: 'ralhumsports.lk',
      },
      {
        protocol: 'https',
        hostname: 'www.ralhumsports.lk',
      },
      {
        protocol: 'https',
        hostname: 'admin.ralhumsports.lk',
      },
    ],
    dangerouslyAllowSVG: true,
    formats: ['image/webp', 'image/avif'],
  },

  // ADDED: Safe performance settings
  poweredByHeader: false,
  compress: true,

  // ADDED: Safe optimizations that don't require extra packages
  swcMinify: true,

  // ADDED: Bundle analyzer in development (optional)
  ...(process.env.ANALYZE === 'true' && {
    experimental: {
      bundlePagesRouterDependencies: true,
    },
  }),

  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }
    return webpackConfig
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
