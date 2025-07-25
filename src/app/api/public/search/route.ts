import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { withRateLimit, rateLimitConfigs } from '@/lib/rate-limit'
import { getSecurityHeaders } from '@/lib/response-filter'

export const GET = withRateLimit(
  rateLimitConfigs.search, // Special rate limiting for search
  async (request: NextRequest) => {
    try {
      const payload = await getPayload({ config }) // ✅ Fixed: Use getPayload instead of getPayloadHMR
      const { searchParams } = new URL(request.url)

      const query = searchParams.get('query') || ''
      const type = searchParams.get('type') || 'all'
      const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50) // Max 50 results

      // Validate search query
      if (!query.trim()) {
        return NextResponse.json(
          { success: false, error: 'Search query is required' },
          { status: 400, headers: getSecurityHeaders() },
        )
      }

      // Minimum search length to prevent abuse
      if (query.trim().length < 2) {
        return NextResponse.json(
          { success: false, error: 'Search query must be at least 2 characters' },
          { status: 400, headers: getSecurityHeaders() },
        )
      }

      // Sanitize search query (remove special characters that could cause issues)
      const sanitizedQuery = query.trim().replace(/[<>\"']/g, '')

      type ProductResult = {
        id: number | string
        name: string
        slug: string
        price: number
        originalPrice?: number | null
        sku: string
        stock: string
        status: 'active' | 'inactive' | 'discontinued' | 'draft' | 'out-of-stock'
        images: { id: string | number; url: string; alt: string }[]
        category: { id: string | number; name: string; slug: string } | null
        brand: { id: string | number; name: string; slug: string } | null
        features: string[]
        tags: string[]
        variants?: {
          id: number | string
          name: string
          sku: string
          color?: string
          size?: string
          inventory: number
          price: number
        }[]
      }

      type CategoryResult = {
        id: number | string
        name: string
        slug: string
        description: string
        productCount: number
      }

      type BrandResult = {
        id: number | string
        name: string
        slug: string
        description: string
        logo: { url: string; alt: string } | null
        productCount: number
        isFeatured: boolean
      }

      const results: {
        products: ProductResult[]
        categories: CategoryResult[]
        brands: BrandResult[]
        totalResults: number
      } = {
        products: [],
        categories: [],
        brands: [],
        totalResults: 0,
      }

      if (type === 'all' || type === 'products') {
        const productsResponse = await payload.find({
          collection: 'products',
          where: {
            and: [
              { status: { equals: 'active' } },
              {
                or: [
                  { name: { contains: sanitizedQuery } },
                  { tags: { contains: sanitizedQuery } },
                  { sku: { contains: sanitizedQuery } },
                ],
              },
            ],
          },
          limit: type === 'products' ? limit : Math.min(limit, 20),
          depth: 2, // ✅ Fixed: Use depth instead of populate
        })

        // Filter and sanitize product results (remove sensitive fields)
        results.products = productsResponse.docs.map((product) => ({
          id: product.id,
          name: product.name,
          slug: typeof product.slug === 'string' ? product.slug : '',
          price: product.essentials.price,
          originalPrice: product.productDetails?.originalPrice,
          sku: typeof product.productDetails?.sku === 'string' ? product.productDetails.sku : '',
          stock: (product.inventory?.stock || 0) > 0 ? 'In Stock' : 'Out of Stock', // Don't expose exact stock numbers
          status: product.status,
          variants:
            product.variants?.map((variant) => ({
              id:
                typeof variant.id === 'string' || typeof variant.id === 'number' ? variant.id : '',
              name: typeof variant.name === 'string' ? variant.name : '',
              sku:
                typeof variant.sku === 'string' || typeof variant.sku === 'number'
                  ? String(variant.sku)
                  : '',
              color: typeof variant.color === 'string' ? variant.color : undefined,
              size: typeof variant.size === 'string' ? variant.size : undefined,
              inventory: typeof variant.stock === 'number' ? variant.stock : 0, // Don't expose exact stock numbers
              price: typeof variant.price === 'number' ? variant.price : product.essentials.price, // Fallback to product price if no variant price
            })) || [],
          images:
            product.images?.slice(0, 2).map((img) => ({
              // Limit to 2 images
              id:
                typeof img.image === 'object' && img.image.id != null
                  ? img.image.id
                  : typeof img.id === 'string' || typeof img.id === 'number'
                    ? img.id
                    : '',
              url:
                typeof img.image === 'object' && typeof img.image.url === 'string'
                  ? img.image.url
                  : '',
              alt:
                typeof img.altText === 'string'
                  ? img.altText
                  : typeof img.image === 'object' && typeof img.image.attribution === 'string'
                    ? img.image.attribution
                    : product.name,
            })) || [],
          category:
            typeof product.categorySelection.sportsItem === 'object' &&
            product.categorySelection.sportsItem?.id != null &&
            product.categorySelection.sportsItem?.name != null &&
            product.categorySelection.sportsItem?.slug != null
              ? {
                  id: product.categorySelection.sportsItem.id as string | number,
                  name: product.categorySelection.sportsItem.name as string,
                  slug: product.categorySelection.sportsItem.slug as string,
                }
              : null,
          brand:
            typeof product.essentials.brand === 'object'
              ? {
                  id: product.essentials.brand.id,
                  name: product.essentials.brand.name,
                  slug: product.essentials.brand.slug,
                }
              : null,
          features: Array.isArray(product.features)
            ? product.features
                .slice(0, 3)
                .map((f) =>
                  typeof f === 'object' && typeof f.feature === 'string' ? f.feature : '',
                )
                .filter(Boolean)
            : [],
          tags:
            typeof product.productDetails?.tags === 'string'
              ? product.productDetails.tags
                  .split(',')
                  .map((t) => t.trim())
                  .slice(0, 5)
              : [],
        }))

        results.totalResults += productsResponse.totalDocs
      }

      if (type === 'all' || type === 'categories') {
        const categoriesResponse = await payload.find({
          collection: 'categories',
          where: {
            and: [
              { status: { equals: 'active' } },
              { showInNavigation: { equals: true } }, // Only show navigable categories
              {
                or: [
                  { name: { contains: sanitizedQuery } },
                  { description: { contains: sanitizedQuery } },
                ],
              },
            ],
          },
          limit: type === 'categories' ? limit : Math.min(limit, 10),
          depth: 1, // ✅ Fixed: Use depth instead of populate
        })

        results.categories = categoriesResponse.docs.map((category) => ({
          id: category.id,
          name: category.name,
          slug: category.slug,
          description: typeof category.description === 'string' ? category.description : '',
          productCount: typeof category.productCount === 'number' ? category.productCount : 0,
        }))

        results.totalResults += categoriesResponse.totalDocs
      }

      if (type === 'all' || type === 'brands') {
        const brandsResponse = await payload.find({
          collection: 'brands',
          where: {
            and: [
              { status: { equals: 'active' } },
              {
                or: [
                  { name: { contains: sanitizedQuery } },
                  { description: { contains: sanitizedQuery } },
                ],
              },
            ],
          },
          limit: type === 'brands' ? limit : Math.min(limit, 10),
          depth: 1, // ✅ Fixed: Use depth instead of populate
        })

        results.brands = brandsResponse.docs.map((brand) => ({
          id: brand.id,
          name: brand.name,
          slug: brand.slug,
          description:
            typeof brand.branding.description === 'string' ? brand.branding.description : '',
          logo:
            brand.branding.logo && typeof brand.branding.logo === 'object'
              ? {
                  url: typeof brand.branding.logo.url === 'string' ? brand.branding.logo.url : '',
                  alt:
                    typeof brand.branding.logo.attribution === 'string'
                      ? brand.branding.logo.attribution
                      : brand.name,
                }
              : null,
          productCount: typeof brand.productCount === 'number' ? brand.productCount : 0,
          isFeatured: !!brand.isFeatured,
        }))

        results.totalResults += brandsResponse.totalDocs
      }

      return NextResponse.json({ success: true, data: results }, { headers: getSecurityHeaders() })
    } catch (error) {
      console.error('Search error:', error)
      return NextResponse.json(
        { success: false, error: 'Search failed' },
        { status: 500, headers: getSecurityHeaders() },
      )
    }
  },
)
