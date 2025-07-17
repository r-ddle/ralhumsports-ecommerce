import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { SITE_CONFIG } from '@/config/site-config'

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

    // Create sports categories mapping for filtering
    const sportsCategories = [
      { name: 'Cricket', slug: 'cricket', category: 'Ball Sports' },
      { name: 'Rugby', slug: 'rugby', category: 'Ball Sports' },
      { name: 'Basketball', slug: 'basketball', category: 'Ball Sports' },
      { name: 'Volleyball', slug: 'volleyball', category: 'Ball Sports' },
      { name: 'Tennis', slug: 'tennis', category: 'Racquet Sports' },
      { name: 'Badminton', slug: 'badminton', category: 'Racquet Sports' },
      { name: 'Squash', slug: 'squash', category: 'Racquet Sports' },
      { name: 'Hockey', slug: 'hockey', category: 'Field Sports' },
      { name: 'Football', slug: 'football', category: 'Field Sports' },
      { name: 'Training', slug: 'training', category: 'Training & Fitness' },
    ]

    // Get brand info from SITE_CONFIG with logos
    const brandInfo = SITE_CONFIG.brands.map((brand) => ({
      id: brand.slug,
      name: brand.name,
      slug: brand.slug,
      image: brand.image,
      category: brand.category,
      tagline: brand.tagline,
    }))

    const response = NextResponse.json({
      success: true,
      data: {
        categories: categoriesResult.docs,
        brands: brandsResult.docs,
        sportsCategories,
        brandInfo,
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
