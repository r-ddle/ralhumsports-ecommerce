import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET() {
  try {
    const payload = await getPayload({ config })

    const result = await payload.find({
      collection: 'categories',
      where: {
        status: {
          equals: 'active',
        },
      },
      sort: 'displayOrder',
      limit: 100,
      depth: 1,
    })

    const transformedCategories = result.docs.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      image:
        typeof category.image === 'object'
          ? {
              url: category.image?.url || '',
              alt: category.image?.alt || category.name,
            }
          : undefined,
      icon: category.icon,
      displayOrder: category.displayOrder,
      productCount: category.productCount,
      isFeature: category.isFeature,
      showInNavigation: category.showInNavigation,
    }))

    return NextResponse.json({
      success: true,
      data: transformedCategories,
    })
  } catch (error) {
    console.error('Categories API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 },
    )
  }
}
