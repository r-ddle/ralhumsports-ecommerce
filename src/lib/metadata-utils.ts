import type { Metadata } from 'next'

/**
 * Get the appropriate base URL for the current environment
 * Follows Vercel best practices for URL resolution and ensures www consistency
 */
export function getBaseUrl(): string {
  // Production environment - always use www subdomain for consistency
  if (process.env.VERCEL_ENV === 'production') {
    return 'https://www.ralhumsports.lk'
  }

  // Preview environment - use project production URL if available
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }

  // Fallback to deployment URL for Vercel previews
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  // Development environment
  return `http://localhost:${process.env.PORT || 3000}`
}

/**
 * Create consistent MetadataBase configuration
 */
export function createMetadataBase(): URL {
  return new URL(getBaseUrl())
}

/**
 * Resolve image URL to absolute path
 * Handles both relative and absolute URLs
 */
export function resolveImageUrl(imageUrl: string): string {
  if (!imageUrl) return `${getBaseUrl()}/ralhumbanner.png`

  // If already absolute, return as-is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl
  }

  // Convert relative to absolute
  const baseUrl = getBaseUrl()
  return imageUrl.startsWith('/') ? `${baseUrl}${imageUrl}` : `${baseUrl}/${imageUrl}`
}

/**
 * Create standardized OpenGraph configuration
 */
export interface OpenGraphConfig {
  title: string
  description: string
  url: string
  images?: {
    url: string
    width?: number
    height?: number
    alt?: string
  }[]
  type?: 'website' | 'article'
  siteName?: string
}

export function createOpenGraphMetadata(config: OpenGraphConfig): Metadata['openGraph'] {
  return {
    title: config.title,
    description: config.description,
    url: config.url,
    siteName: config.siteName || 'Ralhum Sports Sri Lanka',
    type: config.type || 'website',
    locale: 'en_LK',
    images: config.images || [
      {
        url: '/ralhumbanner.png', // Will resolve via metadataBase
        width: 1200,
        height: 630,
        alt: 'Ralhum Sports Sri Lanka - Premium Sports Equipment Store',
      },
    ],
  }
}

/**
 * Create standardized Twitter Card configuration
 */
export interface TwitterConfig {
  title: string
  description: string
  images?: string[]
  card?: 'summary' | 'summary_large_image' | 'app' | 'player'
}

export function createTwitterMetadata(config: TwitterConfig): Metadata['twitter'] {
  return {
    card: config.card || 'summary_large_image',
    site: '@ralhumsports',
    creator: '@ralhumsports',
    title: config.title,
    description: config.description,
    images: config.images || ['/ralhumbanner.png'], // Will resolve via metadataBase
  }
}

/**
 * Create comprehensive metadata for products
 */
export interface ProductMetadataConfig {
  name: string
  description: string
  slug: string
  brand?: string
  price?: number
  images?: string[]
  category?: string
  sku?: string
  inStock?: boolean
}

export function createProductMetadata(config: ProductMetadataConfig): Metadata {
  const title = `${config.name} ${config.brand ? `- ${config.brand}` : ''} | Ralhum Sports Sri Lanka`
  const description = `Buy ${config.name} ${config.brand ? `from ${config.brand}` : ''} at Ralhum Sports Sri Lanka (ralhumsports.lk). ${config.description} ${config.price ? `Starting from Rs. ${config.price.toLocaleString('en-LK')}` : ''} with fast delivery.`

  const productImage = config.images?.[0] || '/ralhumbanner.png'

  return {
    metadataBase: createMetadataBase(),
    title,
    description,
    keywords: [
      config.name.toLowerCase(),
      config.brand?.toLowerCase(),
      'ralhumsports.lk',
      'ralhum sports sri lanka',
      'ralhum store',
      'sports equipment sri lanka',
      `${config.name.toLowerCase()} sri lanka`,
      `${config.brand?.toLowerCase()} sri lanka`,
      'buy sports equipment online',
      'premium sports gear',
    ]
      .filter(Boolean)
      .join(', '),
    openGraph: createOpenGraphMetadata({
      title: `${config.name} - Ralhum Sports Sri Lanka`,
      description,
      url: `/products/${config.slug}`,
      type: 'website',
      images: [
        {
          url: productImage,
          width: 1200,
          height: 630,
          alt: `${config.name} - Ralhum Sports Sri Lanka`,
        },
      ],
    }),
    twitter: createTwitterMetadata({
      title: `${config.name} - Ralhum Sports Sri Lanka`,
      description: `Buy ${config.name} at ralhumsports.lk - your trusted Ralhum Store.`,
      images: [productImage],
    }),
    alternates: {
      canonical: `/products/${config.slug}`,
    },
    other: {
      'product:price:amount': config.price?.toString() || '',
      'product:price:currency': 'LKR',
      'product:availability': config.inStock ? 'in stock' : 'out of stock',
    },
  }
}

/**
 * Create comprehensive metadata for category pages
 */
export interface CategoryMetadataConfig {
  name: string
  description: string
  slug: string
  productCount?: number
}

export function createCategoryMetadata(config: CategoryMetadataConfig): Metadata {
  const title = `${config.name} Equipment - Ralhum Sports Sri Lanka`
  const description = `Browse ${config.name.toLowerCase()} equipment at Ralhum Sports Sri Lanka (ralhumsports.lk). ${config.description} ${config.productCount ? `${config.productCount}+ products available` : ''} with fast delivery across Sri Lanka.`

  return {
    metadataBase: createMetadataBase(),
    title,
    description,
    keywords: [
      `${config.name.toLowerCase()} equipment sri lanka`,
      `${config.name.toLowerCase()} gear`,
      'ralhumsports.lk',
      'ralhum sports sri lanka',
      'sports equipment sri lanka',
      'premium sports gear',
    ].join(', '),
    openGraph: createOpenGraphMetadata({
      title: `${config.name} Equipment - Ralhum Sports Sri Lanka`,
      description,
      url: `/products?category=${config.slug}`,
    }),
    twitter: createTwitterMetadata({
      title: `${config.name} Equipment - Ralhum Sports Sri Lanka`,
      description: `Browse ${config.name.toLowerCase()} equipment at ralhumsports.lk`,
    }),
    alternates: {
      canonical: `/products?category=${config.slug}`,
    },
  }
}

/**
 * Generate structured data for products
 */
export function generateProductStructuredData(config: ProductMetadataConfig): string {
  const baseUrl = getBaseUrl()

  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${baseUrl}/products/${config.slug}#product`,
    name: config.name,
    description: config.description,
    image: config.images?.map((img) => resolveImageUrl(img)) || [
      resolveImageUrl('/ralhumbanner.png'),
    ],
    brand: config.brand
      ? {
          '@type': 'Brand',
          name: config.brand,
        }
      : undefined,
    sku: config.sku,
    category: config.category || 'Sports Equipment',
    offers: {
      '@type': 'Offer',
      url: `${baseUrl}/products/${config.slug}`,
      priceCurrency: 'LKR',
      price: config.price,
      availability: config.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        '@id': `${baseUrl}/#organization`,
        name: 'Ralhum Sports Sri Lanka',
        url: baseUrl,
      },
    },
  })
}
