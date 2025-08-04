import { Suspense } from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

// Import the existing client component
import ProductDetailClientPage from './client-page'

interface ProductDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

// Server-side function to fetch product data for metadata
async function getProductData(slug: string) {
  try {
    // Use API call approach with better error handling
    const baseUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3000'
      : process.env.NEXT_PUBLIC_BASE_URL || 'https://ralhumsports.lk'
    
    const response = await fetch(`${baseUrl}/api/public/products/${slug}`, {
      next: { revalidate: 3600 }, // Revalidate every hour
      headers: {
        'User-Agent': 'ralhumsports-seo-bot',
      }
    })

    if (!response.ok) {
      console.error(`Failed to fetch product: ${response.status} ${response.statusText}`)
      return null
    }

    const data = await response.json()
    return data.success ? data.data : null
  } catch (error) {
    console.error('Error fetching product for metadata:', error)
    return null
  }
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const product = await getProductData(resolvedParams.slug)

  // Fallback for when API is not available or product not found
  if (!product) {
    // Generate a basic title from the slug
    const formattedTitle = resolvedParams.slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
    
    return {
      title: `${formattedTitle} - Ralhum Sports Sri Lanka`,
      description: `Find ${formattedTitle} at Ralhum Sports Sri Lanka (ralhumsports.lk). Browse our premium sports equipment collection with fast delivery across Sri Lanka.`,
      keywords: [
        formattedTitle.toLowerCase(),
        'ralhumsports.lk',
        'ralhum sports sri lanka',
        'ralhum store',
        'sports equipment sri lanka',
        'premium sports gear'
      ].join(', '),
      metadataBase: new URL('https://ralhumsports.lk'),
      openGraph: {
        title: `${formattedTitle} - Ralhum Sports Sri Lanka`,
        description: `Find ${formattedTitle} at ralhumsports.lk - your trusted Ralhum Store.`,
        url: `https://ralhumsports.lk/products/${resolvedParams.slug}`,
        siteName: 'Ralhum Sports Sri Lanka',
        images: [
          {
            url: 'https://ralhumsports.lk/ralhumbanner.png',
            width: 1200,
            height: 630,
            alt: `${formattedTitle} - Ralhum Sports Sri Lanka`,
          }
        ],
        type: 'website',
        locale: 'en_LK',
      },
      twitter: {
        card: 'summary_large_image',
        site: '@ralhumsports',
        creator: '@ralhumsports',
        title: `${formattedTitle} - Ralhum Sports Sri Lanka`,
        description: `Find ${formattedTitle} at ralhumsports.lk`,
        images: ['https://ralhumsports.lk/ralhumbanner.png'],
      },
      alternates: {
        canonical: `https://ralhumsports.lk/products/${resolvedParams.slug}`,
      },
    }
  }

  const productName = product.name || 'Sports Product'
  const brandName = product.brand?.name || ''
  const price = product.price || product.variants?.[0]?.price
  const description =
    typeof product.description === 'string'
      ? product.description.replace(/<[^>]*>/g, '').substring(0, 160)
      : `${productName} from ${brandName} at Ralhum Sports Sri Lanka`

  const title = `${productName} ${brandName ? `- ${brandName}` : ''} | Ralhum Sports Sri Lanka`
  const fullDescription = `Buy ${productName} ${brandName ? `from ${brandName}` : ''} at Ralhum Sports Sri Lanka (ralhumsports.lk). ${description} ${price ? `Starting from Rs. ${price.toLocaleString('en-LK')}` : ''} with fast delivery.`

  const productImage = product.images?.[0]?.url || '/ralhumbanner.png'

  return {
    title,
    description: fullDescription,
    keywords: [
      productName.toLowerCase(),
      brandName.toLowerCase(),
      'ralhumsports.lk',
      'ralhum sports sri lanka',
      'ralhum store',
      'sports equipment sri lanka',
      `${productName.toLowerCase()} sri lanka`,
      `${brandName.toLowerCase()} sri lanka`,
      'buy sports equipment online',
      'premium sports gear',
    ]
      .filter(Boolean)
      .join(', '),
    metadataBase: new URL('https://ralhumsports.lk'),
    openGraph: {
      title: `${productName} - Ralhum Sports Sri Lanka`,
      description: fullDescription,
      url: `https://ralhumsports.lk/products/${resolvedParams.slug}`,
      siteName: 'Ralhum Sports Sri Lanka',
      images: [
        {
          url: productImage.startsWith('http') ? productImage : `https://ralhumsports.lk${productImage}`,
          width: 1200,
          height: 630,
          alt: `${productName} - Ralhum Sports Sri Lanka`,
        },
      ],
      type: 'website',
      locale: 'en_LK',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@ralhumsports',
      creator: '@ralhumsports',
      title: `${productName} - Ralhum Sports Sri Lanka`,
      description: `Buy ${productName} at ralhumsports.lk - your trusted Ralhum Store.`,
      images: [productImage.startsWith('http') ? productImage : `https://ralhumsports.lk${productImage}`],
    },
    alternates: {
      canonical: `https://ralhumsports.lk/products/${resolvedParams.slug}`,
    },
    other: {
      'product:price:amount': price?.toString() || '',
      'product:price:currency': 'LKR',
    },
  }
}

// Generate static params for ISR
export async function generateStaticParams() {
  try {
    const { getPayload } = await import('payload')
    const config = await import('@payload-config')
    const payload = await getPayload({ config: config.default })

    const products = await payload.find({
      collection: 'products',
      limit: 100, // Get first 100 products for static generation
      where: {
        status: {
          equals: 'active',
        },
      },
    })

    return products.docs.map((product) => ({
      slug: product.slug,
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const resolvedParams = await params
  const product = await getProductData(resolvedParams.slug)

  return (
    <>
      {/* Add comprehensive product schema markup */}
      {product && (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'Product',
                '@id': `https://ralhumsports.lk/products/${resolvedParams.slug}#product`,
                name: product.name,
                description:
                  typeof product.description === 'string'
                    ? product.description.replace(/<[^>]*>/g, '')
                    : `${product.name} from ${product.brand?.name || ''} at Ralhum Sports Sri Lanka`,
                image: product.images?.map((img: any) => img.url) || [
                  '/ralhumbanner.png',
                ],
                brand: product.brand
                  ? {
                      '@type': 'Brand',
                      name: product.brand.name,
                      url: `https://ralhumsports.lk/products?brand=${product.brand.slug}`,
                    }
                  : undefined,
                manufacturer: product.brand
                  ? {
                      '@type': 'Organization',
                      name: product.brand.name,
                    }
                  : undefined,
                sku: product.sku,
                category: product.categories?.[0]?.name || 'Sports Equipment',
                offers: {
                  '@type': 'AggregateOffer',
                  url: `https://ralhumsports.lk/products/${resolvedParams.slug}`,
                  priceCurrency: 'LKR',
                  lowPrice:
                    product.variants && product.variants.length > 0
                      ? Math.min(...product.variants.map((v: any) => v.price))
                      : product.price,
                  highPrice:
                    product.variants && product.variants.length > 0
                      ? Math.max(...product.variants.map((v: any) => v.price))
                      : product.price,
                  offerCount: product.variants?.length || 1,
                  availability:
                    product.variants?.some((v: any) => v.inventory > 0) || product.inventory > 0
                      ? 'https://schema.org/InStock'
                      : 'https://schema.org/OutOfStock',
                  seller: {
                    '@type': 'Organization',
                    '@id': 'https://ralhumsports.lk/#organization',
                    name: 'Ralhum Sports Sri Lanka',
                    url: 'https://ralhumsports.lk',
                  },
                },
                aggregateRating: product.rating
                  ? {
                      '@type': 'AggregateRating',
                      ratingValue: product.rating,
                      reviewCount: product.reviewCount || 1,
                      bestRating: 5,
                      worstRating: 1,
                    }
                  : undefined,
              }),
            }}
          />

          {/* Breadcrumb Schema */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'BreadcrumbList',
                itemListElement: [
                  {
                    '@type': 'ListItem',
                    position: 1,
                    name: 'Home',
                    item: 'https://ralhumsports.lk',
                  },
                  {
                    '@type': 'ListItem',
                    position: 2,
                    name: 'Products',
                    item: 'https://ralhumsports.lk/products',
                  },
                  {
                    '@type': 'ListItem',
                    position: 3,
                    name: product.name,
                    item: `https://ralhumsports.lk/products/${resolvedParams.slug}`,
                  },
                ],
              }),
            }}
          />
        </>
      )}

      <Suspense fallback={<div>Loading product...</div>}>
        <ProductDetailClientPage params={params} />
      </Suspense>
    </>
  )
}
