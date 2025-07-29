import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Force HTTPS redirects in production
  async redirects() {
    if (process.env.NODE_ENV === 'production') {
      return [
        {
          source: '/(.*)',
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

  // Ensure proper headers for HTTPS
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
        ],
      },
    ]
  },

  // Additional production optimizations
  experimental: {
    optimizeCss: true,
  },

  // Ensure images work with HTTPS
  images: {
    domains: ['ralhumsports.lk', 'www.ralhumsports.lk'],
    formats: ['image/webp', 'image/avif'],
  },
}

module.exports = nextConfig
