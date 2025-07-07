import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET() {
  try {
    const payload = await getPayload({ config })

    const result = await payload.find({
      collection: 'brands',
      where: {
        status: {
          equals: 'active',
        },
      },
      sort: 'name',
      limit: 100,
      depth: 1,
    })

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

    return NextResponse.json({
      success: true,
      data: transformedBrands,
    })
  } catch (error) {
    console.error('Brands API error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch brands' }, { status: 500 })
  }
}

