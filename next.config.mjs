import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    const cspHeader = `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.payhere.lk https://sandbox.payhere.lk https://va.vercel-scripts.com;
      style-src 'self' 'unsafe-inline';
      img-src 'self' blob: data: https://*.blob.vercel-storage.com https://placehold.co;
      font-src 'self';
      connect-src 'self' https://www.payhere.lk https://sandbox.payhere.lk https://vitals.vercel-insights.com;
      frame-src 'self' https://www.payhere.lk https://sandbox.payhere.lk;
      object-src 'none';
      base-uri 'self';
      form-action 'self' https://www.payhere.lk https://sandbox.payhere.lk;
      frame-ancestors 'self';
    `
      .replace(/\s{2,}/g, ' ')
      .trim()

    return [
      {
        source: '/:path*',
        headers: [
          {
            // Use 'Content-Security-Policy' to enforce the rules
            key: 'Content-Security-Policy',
            value: cspHeader,
          },
        ],
      },
    ]
  },
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
    ],
    dangerouslyAllowSVG: true,
  },
  // Your Next.js config here
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
