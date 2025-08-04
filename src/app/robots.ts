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
          '/*?*utm_*', // Block UTM parameters
          '/*?*ref=*', // Block referral parameters
          '/search?*', // Block search parameters
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
          '/checkout',
          '/checkout/*',
          '/*.json',
          '/private',
          '/private/*',
          '/*?*utm_*',
          '/*?*ref=*',
        ],
        crawlDelay: 1,
      },
      {
        userAgent: 'Bingbot',
        allow: ['/', '/products', '/products/*', '/brands', '/about', '/contact'],
        disallow: ['/admin', '/api', '/_next', '/checkout', '/private'],
        crawlDelay: 2,
      },
      // Block bad bots
      {
        userAgent: ['AhrefsBot', 'SemrushBot', 'MJ12bot', 'DotBot', 'AspiegelBot'],
        disallow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
