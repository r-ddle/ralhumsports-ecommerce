import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET() {
  try {
    const payload = await getPayload({ config })

    // Get all active categories with their relationships
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
        description: true,
        icon: true,
        image: true,
        displayOrder: true,
        isFeature: true,
        showInNavigation: true,
        productCount: true,
        type: true, // <-- Add type field for hierarchy
      },
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
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        logo: true,
        website: true,
        isFeature: true,
        country: true,
        foundedYear: true,
      },
      sort: 'name',
    })

    // Get price range from actual products
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
    })

    // Calculate actual price range from products
    const prices = productsResult.docs
      .map((product: any) => product.price)
      .filter((price: any) => typeof price === 'number' && price > 0)

    const priceRange = {
      min: prices.length > 0 ? Math.min(...prices) : 0,
      max: prices.length > 0 ? Math.max(...prices) : 1000,
    }

    // Get product counts per category for navigation
    const categoryProductCounts = await Promise.all(
      categoriesResult.docs.map(async (category: any) => {
        const productCount = await payload.count({
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
        })
        return {
          categoryId: category.id,
          count: productCount.totalDocs,
        }
      }),
    )

    // Get product counts per brand for navigation
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

    // Transform categories for frontend with product counts
    const transformedCategories = categoriesResult.docs.map((category: any) => {
      const productCount =
        categoryProductCounts.find((count) => count.categoryId === category.id)?.count || 0

      // Populate related brands (array of brand objects)
      let relatedBrands: any[] = []
      if (Array.isArray(category.relatedBrands) && category.relatedBrands.length > 0) {
        relatedBrands = category.relatedBrands.map((brand: any) => {
          if (typeof brand === 'object' && brand.id) {
            // Already populated
            return {
              id: brand.id,
              name: brand.name,
              slug: brand.slug,
              logo:
                brand.logo && brand.logo.url
                  ? { url: brand.logo.url, alt: brand.logo.alt || brand.name }
                  : null,
              website: brand.website,
              isFeature: brand.isFeature || false,
              country: brand.country,
              foundedYear: brand.foundedYear,
            }
          }
          // If not populated, fallback to ID only
          return { id: brand }
        })
      }

      return {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        icon: category.icon,
        image:
          typeof category.image === 'object' && category.image?.url
            ? {
                url: category.image.url,
                alt: category.image.alt || category.name,
              }
            : null,
        displayOrder: category.displayOrder || 0,
        isFeature: category.isFeature || false,
        showInNavigation: category.showInNavigation !== false,
        productCount,
        type: category.type || null, // <-- Pass type to frontend
        relatedBrands,
      }
    })

    // Transform brands for frontend with product counts
    const transformedBrands = brandsResult.docs.map((brand: any) => {
      const productCount =
        brandProductCounts.find((count) => count.brandId === brand.id)?.count || 0

      return {
        id: brand.id,
        name: brand.name,
        slug: brand.slug,
        description: brand.description,
        logo:
          typeof brand.logo === 'object' && brand.logo?.url
            ? {
                url: brand.logo.url,
                alt: brand.logo.alt || brand.name,
              }
            : null,
        website: brand.website,
        isFeature: brand.isFeature || false,
        country: brand.country,
        foundedYear: brand.foundedYear,
        productCount,
      }
    })

    const response = NextResponse.json({
      success: true,
      data: {
        categories: transformedCategories,
        brands: transformedBrands,
        priceRange,
        totalProducts: productsResult.totalDocs,
        totalCategories: categoriesResult.totalDocs,
        totalBrands: brandsResult.totalDocs,
      },
    })

    // Add caching headers - cache for 5 minutes, stale-while-revalidate for 10 minutes
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
