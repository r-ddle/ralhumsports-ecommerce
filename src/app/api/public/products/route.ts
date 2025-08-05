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
import { getSecurityHeaders } from '@/lib/response-filter'

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
  const origin = request.headers.get('origin')
  // --- Parse query parameters ---
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '12')
  const search = searchParams.get('search')
  // Support multiple category params
  const categorySlugs = searchParams.getAll('category')
  // Support both 'brand' and 'brands' parameters for flexibility
  const brands = [...searchParams.getAll('brand'), ...searchParams.getAll('brands')].filter(Boolean)
  const sort = searchParams.get('sort') || 'createdAt'
  const order = searchParams.get('order') || 'desc'
  const status = searchParams.get('status') || 'active'
  const minPrice = searchParams.get('minPrice')
  const maxPrice = searchParams.get('maxPrice')
  const inStock = searchParams.get('inStock')

  // Hierarchical category filters
  const sportsCategory = searchParams.get('sportsCategory')
  const sport = searchParams.get('sport')
  const sportsItem = searchParams.get('sportsItem')

  // --- Logging input parameters ---
  console.log(`\x1b[36m[Products API] Incoming GET request\x1b[0m`)
  console.log(`\x1b[36m[Products API] Query Params:\x1b[0m`, {
    page,
    limit,
    search,
    categorySlugs,
    brands,
    sort,
    order,
    status,
    minPrice,
    maxPrice,
    inStock,
    sportsCategory,
    sport,
    sportsItem,
  })

  try {
    const payload = await getPayload({ config })
    let whereConditions: Where = {}

    // --- Status filter ---
    const statusConditions = []
    if (status && status !== 'active') {
      statusConditions.push({ status: { equals: status } })
    } else {
      // Default: show active and out-of-stock products
      statusConditions.push(
        { status: { equals: 'active' } },
        { status: { equals: 'out-of-stock' } },
      )
    }

    // --- Search filter ---
    const searchConditions = []
    if (search) {
      searchConditions.push(
        { name: { contains: search } },
        { 'productDetails.sku': { contains: search } },
        { 'productDetails.tags': { contains: search } },
        // Note: description is richText/JSONB field and cannot be searched with contains
      )
    }

    // --- Combine status and search conditions properly ---
    if (searchConditions.length > 0 && statusConditions.length > 1) {
      // Both search and multiple status conditions exist
      whereConditions.and = [{ or: statusConditions }, { or: searchConditions }]
    } else if (searchConditions.length > 0) {
      // Only search conditions
      whereConditions.and = [statusConditions[0], { or: searchConditions }]
    } else if (statusConditions.length > 1) {
      // Only multiple status conditions
      whereConditions.or = statusConditions
    } else if (statusConditions.length === 1) {
      // Single status condition
      Object.assign(whereConditions, statusConditions[0])
    }

    // --- Build additional filter conditions ---
    const additionalConditions = []

    // --- Hierarchical category filters (priority over legacy category filter) ---
    if (sportsCategory || sport || sportsItem) {
      try {
        // Handle both slugs and IDs for hierarchical filters
        const hierarchicalIdentifiers = []
        if (sportsCategory) hierarchicalIdentifiers.push(sportsCategory)
        if (sport) hierarchicalIdentifiers.push(sport)
        if (sportsItem) hierarchicalIdentifiers.push(sportsItem)

        // Check if identifiers are numeric IDs or string slugs
        const isNumericId = (identifier: string) => /^\d+$/.test(identifier)
        
        const categoryMap = new Map()
        
        for (const identifier of hierarchicalIdentifiers) {
          if (isNumericId(identifier)) {
            // If it's a numeric ID, use it directly
            categoryMap.set(identifier, parseInt(identifier))
          } else {
            // If it's a slug, find the category by slug
            const categoryResult = await payload.find({
              collection: 'categories',
              where: { slug: { equals: identifier } },
              limit: 1,
            })
            if (categoryResult.docs.length > 0) {
              categoryMap.set(identifier, categoryResult.docs[0].id)
            }
          }
        }

        // Apply hierarchical category filters
        if (sportsCategory) {
          const categoryId = isNumericId(sportsCategory) 
            ? parseInt(sportsCategory) 
            : categoryMap.get(sportsCategory)
          if (categoryId) {
            additionalConditions.push({
              'categorySelection.sportsCategory': { equals: categoryId },
            })
          }
        }
        if (sport) {
          const sportId = isNumericId(sport) 
            ? parseInt(sport) 
            : categoryMap.get(sport)
          if (sportId) {
            additionalConditions.push({
              'categorySelection.sports': { equals: sportId },
            })
          }
        }
        if (sportsItem) {
          const itemId = isNumericId(sportsItem) 
            ? parseInt(sportsItem) 
            : categoryMap.get(sportsItem)
          if (itemId) {
            additionalConditions.push({
              'categorySelection.sportsItem': { equals: itemId },
            })
          }
        }
        
        console.log(`\x1b[32m[Products API] Applied hierarchical filters:\x1b[0m`, {
          sportsCategory: sportsCategory && categoryMap.get(sportsCategory),
          sport: sport && categoryMap.get(sport),
          sportsItem: sportsItem && categoryMap.get(sportsItem),
          conditions: additionalConditions
        })
        
      } catch (categoryError) {
        console.error(
          `\x1b[31m[Products API ERROR]\x1b[0m Error finding hierarchical categories:`,
          categoryError,
        )
      }
    } else if (categorySlugs && categorySlugs.length > 0) {
      // Legacy category filter (by slug) - fallback when hierarchical filters are not used
      try {
        // Find category IDs from slugs
        const categoryResults = await payload.find({
          collection: 'categories',
          where: { slug: { in: categorySlugs } },
          limit: 100,
        })

        if (categoryResults.docs.length > 0) {
          const categoryIds = categoryResults.docs.map((cat) => cat.id)

          // Check which category field to use based on category type
          const sampleCategory = categoryResults.docs[0]

          if (sampleCategory.type === 'sports-category') {
            additionalConditions.push({
              'categorySelection.sportsCategory':
                categoryIds.length === 1 ? { equals: categoryIds[0] } : { in: categoryIds },
            })
          } else if (sampleCategory.type === 'sports') {
            additionalConditions.push({
              'categorySelection.sports':
                categoryIds.length === 1 ? { equals: categoryIds[0] } : { in: categoryIds },
            })
          } else if (sampleCategory.type === 'sports-item') {
            additionalConditions.push({
              'categorySelection.sportsItem':
                categoryIds.length === 1 ? { equals: categoryIds[0] } : { in: categoryIds },
            })
          }
        }
      } catch (categoryError) {
        console.error(
          `\x1b[31m[Products API ERROR]\x1b[0m Error finding categories:`,
          categoryError,
        )
      }
    }

    // --- Brand filter (resolve slugs to IDs) ---
    if (brands && brands.length > 0) {
      try {
        const brandResults = await payload.find({
          collection: 'brands',
          where: { slug: { in: brands } },
          limit: 100,
        })
        if (brandResults.docs.length > 0) {
          const brandIds = brandResults.docs.map((brand) => brand.id)
          // FIXED: Brand is nested in essentials group
          additionalConditions.push({
            'essentials.brand': brandIds.length === 1 ? { equals: brandIds[0] } : { in: brandIds },
          })
        } else {
          console.error(`\x1b[31m[Products API ERROR]\x1b[0m Brands not found for slugs:`, brands)
          return NextResponse.json(
            {
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
            },
            { headers: getSecurityHeaders(origin || undefined) },
          )
        }
      } catch (brandError) {
        console.error(`\x1b[31m[Products API ERROR]\x1b[0m Error finding brands:`, brandError)
        return NextResponse.json(
          {
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
          },
          { headers: getSecurityHeaders(origin || undefined) },
        )
      }
    }

    // --- Price range filter ---
    if (minPrice || maxPrice) {
      const priceCondition: any = {}
      if (minPrice) priceCondition.greater_than_equal = parseFloat(minPrice)
      if (maxPrice) priceCondition.less_than_equal = parseFloat(maxPrice)
      additionalConditions.push({ 'essentials.price': priceCondition })
    }

    // --- Stock filter ---
    if (inStock === 'true') {
      additionalConditions.push({ 'inventory.stock': { greater_than: 0 } })
    }

    // --- Combine all conditions ---
    if (additionalConditions.length > 0) {
      if (whereConditions.and) {
        // Already has and conditions, append additional ones
        whereConditions.and = [
          ...(Array.isArray(whereConditions.and) ? whereConditions.and : [whereConditions.and]),
          ...additionalConditions,
        ]
      } else if (whereConditions.or || Object.keys(whereConditions).length > 0) {
        // Has existing conditions (or/other), combine with additional ones
        const existingConditions = { ...whereConditions }
        whereConditions = { and: [existingConditions, ...additionalConditions] }
      } else {
        // No existing conditions, just use additional ones
        if (additionalConditions.length === 1) {
          Object.assign(whereConditions, additionalConditions[0])
        } else {
          whereConditions.and = additionalConditions
        }
      }
    }

    // --- Query the database ---
    let result
    try {
      result = await payload.find({
        collection: 'products',
        where: whereConditions as unknown as import('payload').Where,
        page,
        limit,
        sort: `${order === 'desc' ? '-' : ''}${sort === 'price' ? 'essentials.price' : sort}`,
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
      price: product.essentials.price,
      originalPrice: product.productDetails?.originalPrice || null,
      sku: product.productDetails?.sku,
      stock: product.inventory?.stock,
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
          inventory: variant.stock,
        })) || [],
      category:
        typeof product.categorySelection.sportsItem === 'object'
          ? {
              id: product.categorySelection.sportsItem?.id,
              name: product.categorySelection.sportsItem?.name,
              slug: product.categorySelection.sportsItem?.slug,
              description: product.categorySelection.sportsItem?.description,
            }
          : null,
      brand:
        typeof product.essentials.brand === 'object'
          ? {
              id: product.essentials.brand.id,
              name: product.essentials.brand.name,
              slug: product.essentials.brand.slug,
              description: product.essentials.brand.branding.description,
              logo:
                typeof product.essentials.brand.branding.logo === 'object'
                  ? {
                      url: product.essentials.brand.branding.logo.url,
                      alt: product.essentials.brand.name,
                    }
                  : undefined,
            }
          : null,
      description: product.description,
      features: product.features?.map((f) => f.feature) || [],
      specifications: product.specifications,
      seo: product.seo,
      relatedProducts: product.relatedProducts || [],
      tags: product.productDetails?.tags
        ? product.productDetails.tags.split(',').map((t) => t.trim())
        : [],
      createdBy: product.createdBy,
      lastModifiedBy: product.lastModifiedBy,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }))

    // --- Build and return response ---
    const response = NextResponse.json(
      {
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
      },
      { headers: getSecurityHeaders(origin || undefined) },
    )
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
      { status: 500, headers: getSecurityHeaders(origin || undefined) },
    )
  }
}

// OPTIONS /api/public/products - Handle CORS preflight
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin')
  return new NextResponse(null, {
    status: 200,
    headers: getSecurityHeaders(origin || undefined),
  })
}
