/**
 * Categories API Route
 * Handles GET requests for fetching active categories with logging and error handling.
 *
 * @returns JSON response with category data or error
 */
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET() {
  // --- Logging incoming request ---
  console.log('\x1b[36m[Categories API] Incoming GET request\x1b[0m')
  try {
    const payload = await getPayload({ config })
    // --- Query active categories ---
    const result = await payload.find({
      collection: 'categories',
      where: { status: { equals: 'active' } },
      sort: 'displayOrder',
      limit: 100,
      depth: 1,
    })
    // --- Transform for frontend ---
    const transformedCategories = result.docs.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      image:
        typeof category.visual?.image === 'object'
          ? {
              url: category.visual.image?.url || '',
              alt: category.name,
            }
          : undefined,
      icon: category.visual?.icon,
      displayOrder: category.displayOrder,
      productCount: category.productCount,
      isFeature: category.isFeature,
      showInNavigation: category.showInNavigation,
    }))
    // --- Log result count ---
    console.log(
      `\x1b[32m[Categories API] Returned ${transformedCategories.length} categories\x1b[0m`,
    )
    return NextResponse.json({
      success: true,
      data: transformedCategories,
    })
  } catch (error) {
    // --- Error logging with color ---
    console.error('\x1b[41m\x1b[37m[Categories API ERROR]\x1b[0m', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch categories',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
