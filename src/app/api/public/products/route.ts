import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

type Where = {
  [key: string]:
    | { equals?: string | number | boolean }
    | { contains?: string }
    | { greater_than?: number }
    | { greater_than_equal?: number }
    | { less_than_equal?: number }
    | { in?: string[] }
    | unknown
  or?: Array<Record<string, any>>
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '12')
  const search = searchParams.get('search')
  const categorySlugs = searchParams.getAll('category')
  const brand = searchParams.get('brand')
  const sort = searchParams.get('sort') || 'createdAt'
  const order = searchParams.get('order') || 'desc'
  const status = searchParams.get('status') || 'active'
  const minPrice = searchParams.get('minPrice')
  const maxPrice = searchParams.get('maxPrice')
  const inStock = searchParams.get('inStock')
  const sport = searchParams.get('sport')
  const item = searchParams.get('item')

  console.log(`[Products API] Incoming GET request`)
  console.log(`[Products API] Query Params:`, {
    page,
    limit,
    search,
    categorySlugs,
    brand,
    sort,
    order,
    status,
    minPrice,
    maxPrice,
    inStock,
    sport,
    item,
  })

  try {
    const payload = await getPayload({ config })
    const whereConditions: Where = {}

    // Hierarchical filters
    if (categorySlugs && categorySlugs.length > 0) {
      if (categorySlugs.length === 1) {
        whereConditions['category.slug'] = { equals: categorySlugs[0] }
        whereConditions['category.type'] = { equals: 'category' }
      } else {
        whereConditions['category.slug'] = { in: categorySlugs }
        whereConditions['category.type'] = { equals: 'category' }
      }
    }
    if (sport) {
      whereConditions['sport.slug'] = { equals: sport }
      whereConditions['sport.type'] = { equals: 'sport' }
    }
    if (item) {
      whereConditions['item.slug'] = { equals: item }
      whereConditions['item.type'] = { equals: 'item' }
    }

    // Status filter
    if (status && status !== 'active') {
      whereConditions.status = { equals: status }
    } else {
      whereConditions.or = [
        { status: { equals: 'active' } },
        { status: { equals: 'out-of-stock' } },
      ]
    }

    // Search filter
    if (search) {
      whereConditions.or = [
        { name: { contains: search } },
        { sku: { contains: search } },
        { tags: { contains: search } },
      ]
    }

    // Brand filter (resolve slug to ID)
    if (brand) {
      try {
        const brandResult = await payload.find({
          collection: 'brands',
          where: { slug: { equals: brand } },
          limit: 1,
        })
        if (brandResult.docs.length > 0) {
          whereConditions.brand = { equals: brandResult.docs[0].id }
        } else {
          console.error(`[Products API ERROR] Brand not found for slug:`, brand)
          return NextResponse.json({
            success: true,
            data: [],
            pagination: {
              page: 1,
              limit,
              totalPages: 0,
              totalDocs: 0,
              hasNextPage: false,
              hasPrevPage: false,
            },
          })
        }
      } catch (brandError) {
        console.error(`[Products API ERROR] Error finding brand:`, brandError)
        return NextResponse.json({
          success: true,
          data: [],
          pagination: {
            page: 1,
            limit,
            totalPages: 0,
            totalDocs: 0,
            hasNextPage: false,
            hasPrevPage: false,
          },
        })
      }
    }

    // Price range filter
    if (minPrice || maxPrice) {
      whereConditions.price = {}
      if (minPrice)
        (whereConditions.price as Record<string, number>).greater_than_equal = parseFloat(minPrice)
      if (maxPrice)
        (whereConditions.price as Record<string, number>).less_than_equal = parseFloat(maxPrice)
    }

    // Stock filter
    if (inStock === 'true') {
      whereConditions.stock = { greater_than: 0 }
    }

    // Query the database
    let result
    try {
      result = await payload.find({
        collection: 'products',
        where: whereConditions as unknown as import('payload').Where,
        page,
        limit,
        sort: `${order === 'desc' ? '-' : ''}${sort}`,
        depth: 2,
      })
      console.log(`[Products API] DB Query Success`, {
        total: result.totalDocs,
        page: result.page,
        limit: result.limit,
      })
    } catch (dbError) {
      console.error(`[Products API ERROR] DB Query Failed:`, dbError)
      throw dbError
    }

    // Transform products for frontend
    const transformedProducts = result.docs.map((product: any) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      originalPrice: product.pricing?.originalPrice || null,
      sku: product.sku,
      stock: product.stock,
      status: product.status,
      images:
        product.images?.map((img: any) => ({
          url: typeof img.image === 'object' ? img.image.url : img.image,
          alt: img.altText || product.name,
        })) || [],
      variants:
        product.variants?.map((variant: any) => ({
          id: variant.id,
          name: variant.name,
          sku: variant.sku,
          size: variant.size,
          color: variant.color,
          price: variant.price,
          inventory: variant.inventory,
        })) || [],
      category:
        typeof product.category === 'object'
          ? {
              id: product.category.id,
              name: product.category.name,
              slug: product.category.slug,
              description: product.category.description,
            }
          : null,
      brand:
        typeof product.brand === 'object'
          ? {
              id: product.brand.id,
              name: product.brand.name,
              slug: product.brand.slug,
              description: product.brand.description,
              logo:
                typeof product.brand.logo === 'object'
                  ? {
                      url: product.brand.logo.url,
                      alt: product.brand.logo.alt || product.brand.name,
                    }
                  : undefined,
            }
          : null,
      description: product.description,
      features: product.features?.map((f: any) => f.feature) || [],
      specifications: product.specifications,
      seo: product.seo,
      analytics: product.analytics,
      relatedProducts: product.relatedProducts || [],
      tags: product.tags ? product.tags.split(',').map((t: string) => t.trim()) : [],
      createdBy: product.createdBy,
      lastModifiedBy: product.lastModifiedBy,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }))

    // Build and return response
    const response = NextResponse.json({
      success: true,
      data: transformedProducts,
      pagination: {
        page: result.page || 1,
        limit: result.limit,
        totalPages: result.totalPages,
        totalDocs: result.totalDocs,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage,
      },
    })
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300')
    return response
  } catch (error) {
    console.error(`[Products API ERROR]`, error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch products',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
