/**
 * Brands API Route
 * Handles GET requests for fetching active brands with logging and error handling.
 *
 * @returns JSON response with brand data or error
 */
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET() {
  // --- Logging incoming request ---
  console.log('\x1b[36m[Brands API] Incoming GET request\x1b[0m')
  try {
    const payload = await getPayload({ config })
    // --- Query active brands ---
    const result = await payload.find({
      collection: 'brands',
      where: { status: { equals: 'active' } },
      sort: 'name',
      limit: 100,
      depth: 1,
    })
    // --- Transform for frontend ---
    const transformedBrands = result.docs.map((brand) => ({
      id: brand.id,
      name: brand.name,
      slug: brand.slug,
      description: brand.description,
      logo:
        typeof brand.logo === 'object'
          ? {
              url: brand.logo.url,
              alt: brand.logo.alt || brand.name,
            }
          : undefined,
      website: brand.website,
      countryOfOrigin: brand.countryOfOrigin,
      isFeatured: brand.isFeatured,
      isPremium: brand.isPremium,
      priceRange: brand.priceRange,
      productCount: brand.productCount,
    }))
    // --- Log result count ---
    console.log(`\x1b[32m[Brands API] Returned ${transformedBrands.length} brands\x1b[0m`)
    return NextResponse.json({
      success: true,
      data: transformedBrands,
    })
  } catch (error) {
    // --- Error logging with color ---
    console.error('\x1b[41m\x1b[37m[Brands API ERROR]\x1b[0m', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch brands',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
