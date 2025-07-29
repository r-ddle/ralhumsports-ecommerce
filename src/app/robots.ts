import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://ralhumsports.lk'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/products',
          '/products/*',
          '/brands',
          '/about',
          '/contact',
          '/privacy-policy',
          '/terms-conditions',
          '/return-policy',
          '/orders/track',
        ],
        disallow: [
          '/admin',
          '/admin/*',
          '/api',
          '/api/*',
          '/_next',
          '/_next/*',
          '/checkout',
          '/checkout/*',
          '/*.json',
          '/private',
          '/private/*',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/products',
          '/products/*',
          '/brands',
          '/about',
          '/contact',
          '/privacy-policy',
          '/terms-conditions',
          '/return-policy',
          '/orders/track',
        ],
        disallow: [
          '/admin',
          '/admin/*',
          '/api',
          '/api/*',
          '/_next',
          '/_next/*',
          '/checkout',
          '/checkout/*',
          '/*.json',
          '/private',
          '/private/*',
        ],
        crawlDelay: 1,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}