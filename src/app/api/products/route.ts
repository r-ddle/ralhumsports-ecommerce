import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import type { Where } from 'payload/types'
import config from '@/payload.config'
import type { Product, Brand as BrandType, Category as CategoryType, Media } from '@/payload-types'
import { getSecurityHeaders } from '@/lib/response-filter' // Assuming this is for security headers

// Define a more specific type for the transformed product if needed for frontend
// For now, we'll rely on strong typing during transformation.

export async function GET(request: NextRequest) {
  const payload = await getPayload({ config })
  try {
    const { searchParams } = new URL(request.url)

    // Parse and validate query parameters
    const pageParam = searchParams.get('page')
    const limitParam = searchParams.get('limit')
    const minPriceParam = searchParams.get('minPrice')
    const maxPriceParam = searchParams.get('maxPrice')

    const page = pageParam ? parseInt(pageParam, 10) : 1
    const limit = limitParam ? parseInt(limitParam, 10) : 12
    const search = searchParams.get('search')
    const categorySlug = searchParams.get('category') // Assuming category is passed as slug
    const brandSlug = searchParams.get('brand')
    const sort = searchParams.get('sort') || 'createdAt'
    const order = searchParams.get('order') === 'asc' ? 'asc' : 'desc' // Default to desc
    const status = searchParams.get('status') || 'active'
    const minPrice = minPriceParam ? parseFloat(minPriceParam) : undefined
    const maxPrice = maxPriceParam ? parseFloat(maxPriceParam) : undefined
    const inStock = searchParams.get('inStock') === 'true'

    // Validate numeric parameters
    if (isNaN(page) || page < 1) {
      return NextResponse.json(
        { success: false, error: 'Invalid page number.' },
        { status: 400, headers: getSecurityHeaders() },
      )
    }
    if (isNaN(limit) || limit < 1 || limit > 100) {
      // Cap limit for performance
      return NextResponse.json(
        { success: false, error: 'Invalid limit. Must be between 1 and 100.' },
        { status: 400, headers: getSecurityHeaders() },
      )
    }
    if (minPrice !== undefined && isNaN(minPrice)) {
      return NextResponse.json(
        { success: false, error: 'Invalid minimum price.' },
        { status: 400, headers: getSecurityHeaders() },
      )
    }
    if (maxPrice !== undefined && isNaN(maxPrice)) {
      return NextResponse.json(
        { success: false, error: 'Invalid maximum price.' },
        { status: 400, headers: getSecurityHeaders() },
      )
    }

    const whereConditions: Where = {
      status: { equals: status }, // Assuming 'active' is a valid ProductStatus
    }

    if (search) {
      whereConditions.or = [
        { name: { contains: search } },
        { sku: { contains: search } },
        { tags: { contains: search } },
      ]
    }

    if (categorySlug) {
      try {
        const categoryResult = await payload.find({
          collection: 'categories',
          where: { slug: { equals: categorySlug } },
          limit: 1,
          depth: 0,
        })
        if (categoryResult.docs.length > 0) {
          whereConditions.category = { equals: categoryResult.docs[0].id }
        } else {
          return NextResponse.json({ success: true, data: [], pagination: { page, limit, totalPages: 0, totalDocs: 0, hasNextPage: false, hasPrevPage: false, }, }, { headers: getSecurityHeaders() })
        }
      } catch(e) {
         payload.logger.error({msg: 'Error fetching category by slug', slug: categorySlug, error: e})
      }
    }

    if (brandSlug) {
      try {
        const brandResult = await payload.find({
          collection: 'brands',
          where: { slug: { equals: brandSlug } },
          limit: 1,
          depth: 0,
        })
        if (brandResult.docs.length > 0) {
          whereConditions.brand = { equals: brandResult.docs[0].id }
        } else {
           return NextResponse.json({ success: true, data: [], pagination: { page, limit, totalPages: 0, totalDocs: 0, hasNextPage: false, hasPrevPage: false, }, }, { headers: getSecurityHeaders() })
        }
      } catch(e) {
        payload.logger.error({msg: 'Error fetching brand by slug', slug: brandSlug, error: e})
      }
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      const priceQuery: { greater_than_equal?: number; less_than_equal?: number } = {}
      if (minPrice !== undefined) priceQuery.greater_than_equal = minPrice
      if (maxPrice !== undefined) priceQuery.less_than_equal = maxPrice
      whereConditions.price = priceQuery
    }

    if (inStock) {
      whereConditions.stock = { greater_than: 0 }
    }

    const result = await payload.find({
      collection: 'products',
      where: whereConditions,
      page,
      limit,
      sort: `${order === 'desc' ? '-' : ''}${sort}`,
      depth: 2, // Ensure related data like images, category, brand are populated
    })

    const transformedProducts = result.docs.map((product: Product) => {
      const category = product.category as CategoryType | undefined;
      const brand = product.brand as BrandType | undefined;

      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        originalPrice: product.pricing?.originalPrice || null,
        sku: product.sku,
        stock: product.stock,
        status: product.status,
        sizes: product.sizes ? product.sizes.split(',').map((s) => s.trim()) : [],
        colors: product.colors ? product.colors.split(',').map((c) => c.trim()) : [],
        images:
          product.images?.map((img) => {
            const imageFile = img.image as Media | undefined; // Assuming image is populated due to depth
            return {
              id: imageFile?.id || String(img.image) || '', // Handle populated vs ID
              url: imageFile?.url || '',
              alt: img.altText || product.name,
              filename: imageFile?.filename || '',
            };
          }) || [],
        category: category
          ? {
              id: category.id,
              name: category.name,
              slug: category.slug,
              description: category.description,
            }
          : null,
        brand: brand
          ? {
              id: brand.id,
              name: brand.name,
              slug: brand.slug,
              description: brand.description,
              logo: brand.logo && typeof brand.logo === 'object' // Check if logo is populated
                  ? { url: (brand.logo as Media).url || '', alt: (brand.logo as Media).alt || brand.name }
                  : undefined,
            }
          : null,
        description: product.description, // Assuming RichText is handled by consumer
        features: product.features?.map((f) => f.feature) || [],
        specifications: product.specifications,
        shipping: product.shipping,
        seo: product.seo,
        rating: product.analytics?.rating,
        reviewCount: product.analytics?.reviewCount,
        tags: product.tags ? product.tags.split(',').map((t) => t.trim()) : [],
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      }
    })

    return NextResponse.json(
      {
        success: true,
        data: transformedProducts,
        pagination: {
          page: result.page ?? 1,
          limit: result.limit,
          totalPages: result.totalPages,
          totalDocs: result.totalDocs,
          hasNextPage: result.hasNextPage,
          hasPrevPage: result.hasPrevPage,
        },
      },
      { headers: getSecurityHeaders() },
    )
  } catch (error) {
    const err = error as Error;
    payload.logger.error({ msg: 'Products API error', error: err.message, stack: err.stack })
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch products.',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined,
      },
      { status: 500, headers: getSecurityHeaders() },
    )
  }
}
