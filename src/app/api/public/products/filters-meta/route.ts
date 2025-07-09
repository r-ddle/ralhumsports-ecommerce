import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET() {
  try {
    const payload = await getPayload({ config })

    // Get all categories
    const categoriesResult = await payload.find({
      collection: 'categories',
      where: {
        status: {
          equals: 'active',
        },
      },
      limit: 1000,
      select: {
        id: true,
        name: true,
        slug: true,
      },
      sort: 'name',
    })

    // Get all brands
    const brandsResult = await payload.find({
      collection: 'brands',
      where: {
        status: {
          equals: 'active',
        },
      },
      limit: 1000,
      select: {
        id: true,
        name: true,
        slug: true,
      },
      sort: 'name',
    })

    // Get price range from products
    const priceAggregation = await payload.find({
      collection: 'products',
      where: {
        or: [{ status: { equals: 'active' } }, { status: { equals: 'out-of-stock' } }],
      },
      limit: 1000,
      select: {
        price: true,
      },
    })

    // Calculate price range
    const prices = priceAggregation.docs
      .map((product: any) => product.price)
      .filter((price: any) => typeof price === 'number' && price > 0)

    const priceRange = {
      min: prices.length > 0 ? Math.min(...prices) : 0,
      max: prices.length > 0 ? Math.max(...prices) : 1000,
    }

    const response = NextResponse.json({
      success: true,
      data: {
        categories: categoriesResult.docs,
        brands: brandsResult.docs,
        priceRange,
      },
    })

    // Add caching headers for filter metadata
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
    return response
  } catch (error) {
    console.error('Filter metadata API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch filter metadata' },
      { status: 500 },
    )
  }
}
