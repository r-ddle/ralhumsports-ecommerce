/**
 * Category-Grouped Products API Route
 * Returns products organized by sports categories for carousel display
 * 
 * @param request - Next.js API request object
 * @returns JSON response with category-grouped product data
 */
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getSecurityHeaders } from '@/lib/response-filter'

export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin')
  const { searchParams } = new URL(request.url)
  
  // Parameters for controlling the response
  const limit = parseInt(searchParams.get('limit') || '8') // Products per category
  const includeEmpty = searchParams.get('includeEmpty') === 'true' // Include categories with no products
  const sort = searchParams.get('sort') || 'createdAt'
  const order = searchParams.get('order') || 'desc'

  console.log(`\x1b[36m[Category Groups API] Incoming GET request\x1b[0m`)
  console.log(`\x1b[36m[Category Groups API] Query Params:\x1b[0m`, {
    limit,
    includeEmpty,
    sort,
    order,
  })

  try {
    const payload = await getPayload({ config })

    // First, get all sports items (most specific level)
    const categoriesResult = await payload.find({
      collection: 'categories',
      where: { 
        type: { equals: 'sports-item' }
      },
      sort: 'name',
      limit: 100,
      depth: 0,
    })

    console.log(`\x1b[32m[Category Groups API] Found ${categoriesResult.docs.length} sports items\x1b[0m`)

    // Build category groups with products
    const categoryGroups = await Promise.all(
      categoriesResult.docs.map(async (category) => {
        try {
          // Find products for this sports item
          const productsResult = await payload.find({
            collection: 'products',
            where: {
              and: [
                { status: { equals: 'active' } },
                { 'categorySelection.sportsItem': { equals: category.id } }
              ]
            },
            limit,
            sort: `${order === 'desc' ? '-' : ''}${sort === 'price' ? 'essentials.price' : sort}`,
            depth: 2,
          })

          // Transform products for frontend
          const transformedProducts = productsResult.docs.map((product) => ({
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
            tags: product.productDetails?.tags
              ? product.productDetails.tags.split(',').map((t) => t.trim())
              : [],
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
          }))

          // Return category group data
          return {
            category: {
              id: category.id,
              name: category.name,
              slug: category.slug,
              description: category.description,
              image: typeof category.image === 'object' 
                ? {
                    url: category.image.url,
                    alt: category.image.alt || category.name,
                  }
                : null,
            },
            products: transformedProducts,
            productCount: productsResult.totalDocs,
            hasMore: productsResult.hasNextPage,
          }
        } catch (error) {
          console.error(`\x1b[31m[Category Groups API ERROR]\x1b[0m Error fetching products for sports item ${category.name}:`, error)
          return {
            category: {
              id: category.id,
              name: category.name,
              slug: category.slug,
              description: category.description,
              image: typeof category.image === 'object' 
                ? {
                    url: category.image.url,
                    alt: category.image.alt || category.name,
                  }
                : null,
            },
            products: [],
            productCount: 0,
            hasMore: false,
          }
        }
      })
    )

    // Filter out empty categories if requested
    const filteredGroups = includeEmpty 
      ? categoryGroups 
      : categoryGroups.filter(group => group.products.length > 0)

    console.log(`\x1b[32m[Category Groups API] Returning ${filteredGroups.length} category groups\x1b[0m`)

    // Calculate totals
    const totalProducts = filteredGroups.reduce((sum, group) => sum + group.productCount, 0)
    const totalCategories = filteredGroups.length

    const response = NextResponse.json(
      {
        success: true,
        data: {
          categoryGroups: filteredGroups,
          meta: {
            totalCategories,
            totalProducts,
            productsPerCategory: limit,
            sort,
            order,
            includeEmpty,
          }
        },
      },
      { headers: getSecurityHeaders(origin || undefined) },
    )
    
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
    return response

  } catch (error) {
    console.error(`\x1b[41m\x1b[37m[Category Groups API ERROR]\x1b[0m`, error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch category groups',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500, headers: getSecurityHeaders(origin || undefined) },
    )
  }
}

// OPTIONS handler for CORS
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin')
  return new NextResponse(null, {
    status: 200,
    headers: getSecurityHeaders(origin || undefined),
  })
}