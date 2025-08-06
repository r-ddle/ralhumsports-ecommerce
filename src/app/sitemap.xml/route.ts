// src/app/sitemap.xml/route.ts
import { NextResponse } from 'next/server'

const DOMAIN = 'https://www.ralhumsports.lk'

async function getProducts() {
  try {
    const { getPayload } = await import('payload')
    const config = await import('@payload-config')
    const payload = await getPayload({ config: config.default })

    const products = await payload.find({
      collection: 'products',
      limit: 1000,
      where: {
        status: {
          equals: 'active',
        },
      },
      select: {
        slug: true,
        updatedAt: true,
      },
    })

    return products.docs
  } catch (error) {
    console.error('Error fetching products for sitemap:', error)
    return []
  }
}

async function getBrands() {
  try {
    const { getPayload } = await import('payload')
    const config = await import('@payload-config')
    const payload = await getPayload({ config: config.default })

    const brands = await payload.find({
      collection: 'brands',
      limit: 100,
      select: {
        slug: true,
        updatedAt: true,
      },
    })

    return brands.docs
  } catch (error) {
    console.error('Error fetching brands for sitemap:', error)
    return []
  }
}

async function getCategories() {
  try {
    const { getPayload } = await import('payload')
    const config = await import('@payload-config')
    const payload = await getPayload({ config: config.default })

    const categories = await payload.find({
      collection: 'categories',
      limit: 100,
      select: {
        slug: true,
        updatedAt: true,
      },
    })

    return categories.docs
  } catch (error) {
    console.error('Error fetching categories for sitemap:', error)
    return []
  }
}

export async function GET() {
  const [products, brands, categories] = await Promise.all([
    getProducts(),
    getBrands(), 
    getCategories(),
  ])

  const staticPages = [
    { url: '', changefreq: 'daily', priority: '1.0' },
    { url: '/products', changefreq: 'daily', priority: '0.9' },
    { url: '/brands', changefreq: 'weekly', priority: '0.8' },
    { url: '/about', changefreq: 'monthly', priority: '0.7' },
    { url: '/contact', changefreq: 'monthly', priority: '0.7' },
    { url: '/privacy-policy', changefreq: 'yearly', priority: '0.3' },
    { url: '/terms-conditions', changefreq: 'yearly', priority: '0.3' },
    { url: '/return-policy', changefreq: 'yearly', priority: '0.3' },
  ]

  const generateSitemapXml = () => {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`

    // Add static pages
    staticPages.forEach((page) => {
      xml += `  <url>
    <loc>${DOMAIN}${page.url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`
    })

    // Add product pages
    products.forEach((product) => {
      const lastmod = product.updatedAt
        ? new Date(product.updatedAt).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0]

      xml += `  <url>
    <loc>${DOMAIN}/products/${product.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`
    })

    // Add brand pages
    brands.forEach((brand) => {
      const lastmod = brand.updatedAt
        ? new Date(brand.updatedAt).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0]

      xml += `  <url>
    <loc>${DOMAIN}/products?brand=${brand.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
`
    })

    // Add category pages
    categories.forEach((category) => {
      const lastmod = category.updatedAt
        ? new Date(category.updatedAt).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0]

      xml += `  <url>
    <loc>${DOMAIN}/products?category=${category.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
`
    })

    xml += '</urlset>'
    return xml
  }

  const sitemap = generateSitemapXml()

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}