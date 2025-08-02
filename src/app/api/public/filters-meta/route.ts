import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET() {
  try {
    const payload = await getPayload({ config })

    // Get all active categories with proper relationship population
    const categoriesResult = await payload.find({
      collection: 'categories',
      where: {
        status: {
          equals: 'active',
        },
      },
      limit: 1000,
      depth: 2, // Ensure related brands are populated
      sort: 'displayOrder',
    })

    // Get all active brands with their logos
    const brandsResult = await payload.find({
      collection: 'brands',
      where: {
        status: {
          equals: 'active',
        },
      },
      limit: 1000,
      depth: 1, // Include logo details
      sort: 'name',
    })

    // Get price range from actual products - use essentials.price field
    const productsResult = await payload.find({
      collection: 'products',
      where: {
        and: [
          {
            status: {
              in: ['active', 'out-of-stock'],
            },
          },
        ],
      },
      limit: 1000,
      select: {
        essentials: {
          price: true,
        },
        variants: true,
      },
    })

    // Calculate price range from products (including variants)
    const prices: number[] = []
    productsResult.docs.forEach((product: any) => {
      // Add base price
      if (product.essentials?.price && typeof product.essentials.price === 'number') {
        prices.push(product.essentials.price)
      }
      // Add variant prices
      if (product.variants && Array.isArray(product.variants)) {
        product.variants.forEach((variant: any) => {
          if (variant.price && typeof variant.price === 'number') {
            prices.push(variant.price)
          }
        })
      }
    })

    const priceRange = {
      min: prices.length > 0 ? Math.min(...prices) : 0,
      max: prices.length > 0 ? Math.max(...prices) : 100000,
    }

    // Get accurate product counts per category using the correct schema
    const categoryProductCounts = await Promise.all(
      categoriesResult.docs.map(async (category: any) => {
        let whereClause: any
        
        // Build query based on category type
        if (category.type === 'sports-category') {
          whereClause = {
            and: [
              {
                status: {
                  in: ['active', 'out-of-stock'],
                },
              },
              {
                'categorySelection.sportsCategory': {
                  equals: category.id,
                },
              },
            ],
          }
        } else if (category.type === 'sports') {
          whereClause = {
            and: [
              {
                status: {
                  in: ['active', 'out-of-stock'],
                },
              },
              {
                'categorySelection.sports': {
                  equals: category.id,
                },
              },
            ],
          }
        } else if (category.type === 'sports-item') {
          whereClause = {
            and: [
              {
                status: {
                  in: ['active', 'out-of-stock'],
                },
              },
              {
                'categorySelection.sportsItem': {
                  equals: category.id,
                },
              },
            ],
          }
        } else {
          // Fallback for categories without type
          whereClause = {
            status: {
              in: ['active', 'out-of-stock'],
            },
          }
        }

        const productCount = await payload.count({
          collection: 'products',
          where: whereClause,
        })
        
        return {
          categoryId: category.id,
          count: productCount.totalDocs,
        }
      }),
    )

    // Get product counts per brand
    const brandProductCounts = await Promise.all(
      brandsResult.docs.map(async (brand: any) => {
        const productCount = await payload.count({
          collection: 'products',
          where: {
            and: [
              {
                status: {
                  in: ['active', 'out-of-stock'],
                },
              },
              {
                'essentials.brand': {
                  equals: brand.id,
                },
              },
            ],
          },
        })
        return {
          brandId: brand.id,
          count: productCount.totalDocs,
        }
      }),
    )

    // Transform categories with hierarchical structure
    const transformedCategories = categoriesResult.docs.map((category: any) => {
      const productCount =
        categoryProductCounts.find((count) => count.categoryId === category.id)?.count || 0

      // Handle related brands safely
      let relatedBrands: any[] = []
      if (Array.isArray(category.relatedBrands) && category.relatedBrands.length > 0) {
        relatedBrands = category.relatedBrands.map((brand: any) => {
          if (typeof brand === 'object' && brand.id) {
            return {
              id: brand.id,
              name: brand.name,
              slug: brand.slug,
              logo: brand.branding?.logo?.url ? {
                url: brand.branding.logo.url,
                alt: brand.branding.logo.alt || brand.name,
              } : null,
              website: brand.website,
              isFeature: brand.isFeature || false,
              country: brand.country,
              foundedYear: brand.foundedYear,
            }
          }
          return { id: brand }
        })
      }

      return {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        icon: category.visual?.icon,
        image: category.visual?.image?.url ? {
          url: category.visual.image.url,
          alt: category.visual.image.alt || category.name,
        } : null,
        displayOrder: category.displayOrder || 0,
        isFeature: category.isFeature || false,
        showInNavigation: category.showInNavigation !== false,
        productCount,
        type: category.type,
        level: category.level,
        fullPath: category.fullPath,
        parentCategory: typeof category.parentCategory === 'object' && category.parentCategory 
          ? {
              id: category.parentCategory.id,
              name: category.parentCategory.name,
              slug: category.parentCategory.slug,
              type: category.parentCategory.type,
            }
          : null,
        relatedBrands,
      }
    })

    // Transform brands with proper logo handling
    const transformedBrands = brandsResult.docs.map((brand: any) => {
      const productCount =
        brandProductCounts.find((count) => count.brandId === brand.id)?.count || 0

      return {
        id: brand.id,
        name: brand.name,
        slug: brand.slug,
        description: brand.description,
        logo: brand.branding?.logo?.url ? {
          url: brand.branding.logo.url,
          alt: brand.branding.logo.alt || brand.name,
        } : null,
        website: brand.website,
        isFeature: brand.isFeature || false,
        country: brand.country,
        foundedYear: brand.foundedYear,
        productCount,
      }
    })

    // Structure categories hierarchically for easier frontend consumption
    const hierarchicalCategories = {
      sportsCategories: transformedCategories.filter(cat => cat.type === 'sports-category'),
      sports: transformedCategories.filter(cat => cat.type === 'sports'),
      sportsItems: transformedCategories.filter(cat => cat.type === 'sports-item'),
    }

    const response = NextResponse.json({
      success: true,
      data: {
        categories: transformedCategories,
        hierarchicalCategories,
        brands: transformedBrands,
        priceRange,
        totalProducts: productsResult.totalDocs,
        totalCategories: categoriesResult.totalDocs,
        totalBrands: brandsResult.totalDocs,
        cacheVersion: (globalThis as any).__CACHE_VERSION || 0,
        timestamp: Date.now(),
      },
    })

    // Add caching headers
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
    return response
  } catch (error) {
    console.error('Filter metadata API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch filter metadata',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
