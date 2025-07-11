/**
 * Products API Route
 * Handles GET requests for fetching products with advanced filtering, logging, and error handling.
 *
 * @param request - Next.js API request object
 * @returns JSON response with product data or error
 */
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

// Type for Payload where conditions
type Where = {
  [key: string]:
    | { equals?: string | number | boolean }
    | { contains?: string }
    | { greater_than?: number }
    | { greater_than_equal?: number }
    | { less_than_equal?: number }
    | unknown
  or?: Array<Record<string, any>>
}

/**
 * GET /api/products
 * Fetches a paginated, filtered list of products.
 * Adds detailed logging and comments for debugging.
 */
export async function GET(request: NextRequest) {
  // --- Parse query parameters ---
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '12')
  const search = searchParams.get('search')
  const categorySlug = searchParams.get('category')
  const brand = searchParams.get('brand') // This will be a slug
  const sort = searchParams.get('sort') || 'createdAt'
  const order = searchParams.get('order') || 'desc'
  const status = searchParams.get('status') || 'active'
  const minPrice = searchParams.get('minPrice')
  const maxPrice = searchParams.get('maxPrice')
  const inStock = searchParams.get('inStock')

  // --- Logging input parameters ---
  console.log(`\x1b[36m[Products API] Incoming GET request\x1b[0m`)
  console.log(`\x1b[36m[Products API] Query Params:\x1b[0m`, {
    page,
    limit,
    search,
    categorySlug,
    brand,
    sort,
    order,
    status,
    minPrice,
    maxPrice,
    inStock,
  })

  try {
    const payload = await getPayload({ config })
    const whereConditions: Where = {}

    // --- Status filter ---
    if (status && status !== 'active') {
      whereConditions.status = { equals: status }
    } else {
      // Default: show active and out-of-stock products
      whereConditions.or = [
        { status: { equals: 'active' } },
        { status: { equals: 'out-of-stock' } },
      ]
    }

    // --- Search filter ---
    if (search) {
      whereConditions.or = [
        { name: { contains: search } },
        { sku: { contains: search } },
        { tags: { contains: search } },
      ]
    }

    // --- Category filter ---
    if (categorySlug) {
      whereConditions.category = { equals: categorySlug }
    }

    // --- Brand filter (resolve slug to ID) ---
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
          console.error(`\x1b[31m[Products API ERROR]\x1b[0m Brand not found for slug:`, brand)
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
        console.error(`\x1b[31m[Products API ERROR]\x1b[0m Error finding brand:`, brandError)
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

    // --- Price range filter ---
    if (minPrice || maxPrice) {
      whereConditions.price = {}
      if (minPrice)
        (whereConditions.price as Record<string, number>).greater_than_equal = parseFloat(minPrice)
      if (maxPrice)
        (whereConditions.price as Record<string, number>).less_than_equal = parseFloat(maxPrice)
    }

    // --- Stock filter ---
    if (inStock === 'true') {
      whereConditions.stock = { greater_than: 0 }
    }

    // --- Query the database ---
    let result
    try {
      result = await payload.find({
        collection: 'products',
        where: whereConditions as unknown as import('payload').Where,
        page,
        limit,
        sort: `${order === 'desc' ? '-' : ''}${sort}`,
        depth: 2, // Include related data
      })
      console.log(`\x1b[32m[Products API] DB Query Success\x1b[0m`, {
        total: result.totalDocs,
        page: result.page,
        limit: result.limit,
      })
    } catch (dbError) {
      console.error(`\x1b[31m[Products API ERROR]\x1b[0m DB Query Failed:`, dbError)
      throw dbError
    }

    // --- Transform products for frontend ---
    const transformedProducts = result.docs.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      originalPrice: product.pricing?.originalPrice || null,
      sku: product.sku,
      stock: product.stock,
      status: product.status,
      images:
        product.images?.map((img) => ({
          url: typeof img.image === 'object' ? img.image.url : img.image,
          alt: img.altText || product.name,
        })) || [],
      variants:
        product.variants?.map((variant) => ({
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
      features: product.features?.map((f) => f.feature) || [],
      specifications: product.specifications,
      shipping: product.shipping,
      seo: product.seo,
      analytics: product.analytics,
      relatedProducts: product.relatedProducts || [],
      tags: product.tags ? product.tags.split(',').map((t) => t.trim()) : [],
      createdBy: product.createdBy,
      lastModifiedBy: product.lastModifiedBy,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }))

    // --- Build and return response ---
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
    // --- Error logging with color ---
    console.error(`\x1b[41m\x1b[37m[Products API ERROR]\x1b[0m`, error)
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
