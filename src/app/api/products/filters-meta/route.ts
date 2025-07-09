import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'

// Type for filter metadata response
interface FilterMetadata {
  categories: Array<{
    id: number
    name: string
    slug: string
    productCount: number
  }>
  brands: Array<{
    id: number
    name: string
    slug: string
    productCount: number
  }>
  priceRange: {
    min: number
    max: number
  }
  totalProducts: number
}

// Cache the filter metadata for 5 minutes
const getCachedFilterMetadata = unstable_cache(
  async (): Promise<FilterMetadata> => {
    const payload = await getPayload({ config })

    // Get categories with product counts
    const categoriesResult = await payload.find({
      collection: 'categories',
      where: {
        status: { equals: 'active' },
      },
      limit: 100,
      sort: 'displayOrder',
    })

    // Get brands with product counts
    const brandsResult = await payload.find({
      collection: 'brands',
      where: {
        status: { equals: 'active' },
      },
      limit: 100,
      sort: 'name',
    })

    // Get all active products' prices to compute price range
    const productsResult = await payload.find({
      collection: 'products',
      where: {
        status: { equals: 'active' },
        price: { greater_than: 0 },
      },
      limit: 1000, // adjust as needed for your dataset size
      depth: 0,
    })

    const prices = productsResult.docs.map((doc) => doc.price).filter((p) => typeof p === 'number')
    const minPrice = prices.length ? Math.min(...prices) : 0
    const maxPrice = prices.length ? Math.max(...prices) : 0
    const count = prices.length

    const priceData = { minPrice, maxPrice, count }

    return {
      categories: categoriesResult.docs.map((cat) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        productCount: cat.productCount || 0,
      })),
      brands: brandsResult.docs.map((brand) => ({
        id: brand.id,
        name: brand.name,
        slug: brand.slug,
        productCount: brand.productCount || 0,
      })),
      priceRange: {
        min: Math.floor(priceData.minPrice || 0),
        max: Math.ceil(priceData.maxPrice || 0),
      },
      totalProducts: priceData.count,
    }
  },
  ['product-filters-meta'],
  {
    revalidate: 300, // Cache for 5 minutes
    tags: ['products', 'categories', 'brands'],
  },
)

export async function GET(_request: NextRequest) {
  try {
    const filterMetadata = await getCachedFilterMetadata()

    return NextResponse.json(
      {
        success: true,
        data: filterMetadata,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      },
    )
  } catch (error) {
    console.error('Filter metadata error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch filter metadata' },
      { status: 500 },
    )
  }
}
