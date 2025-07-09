import { cache } from 'react'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@payload-config'
import { transformProductToListItem, transformProductToDetail } from './data-transformers'
import { ProductListItem, Product } from '@/types/api'

/**
 * React cache for deduping requests in the same render
 */
export const getProductBySlug = cache(async (slug: string): Promise<Product | null> => {
  try {
    const payload = await getPayload({ config })

    const result = await payload.find({
      collection: 'products',
      where: {
        slug: { equals: slug },
        status: { equals: 'active' },
      },
      limit: 1,
      depth: 3,
    })

    if (result.docs.length === 0) return null

    return transformProductToDetail(result.docs[0])
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
})

/**
 * Next.js unstable_cache for persistent caching across requests
 */
export const getCachedProducts = unstable_cache(
  async (
    params: {
      page?: number
      limit?: number
      category?: string
      brand?: string
      sort?: string
      order?: 'asc' | 'desc'
    } = {},
  ): Promise<{
    products: ProductListItem[]
    pagination: any
  }> => {
    const payload = await getPayload({ config })

    const whereConditions: any = {
      status: { equals: 'active' },
    }

    if (params.category) {
      const categoryResult = await payload.find({
        collection: 'categories',
        where: { slug: { equals: params.category } },
        limit: 1,
      })

      if (categoryResult.docs.length > 0) {
        whereConditions.category = { equals: categoryResult.docs[0].id }
      }
    }

    if (params.brand) {
      const brandResult = await payload.find({
        collection: 'brands',
        where: { slug: { equals: params.brand } },
        limit: 1,
      })

      if (brandResult.docs.length > 0) {
        whereConditions.brand = { equals: brandResult.docs[0].id }
      }
    }

    const result = await payload.find({
      collection: 'products',
      where: whereConditions,
      page: params.page || 1,
      limit: params.limit || 12,
      sort: `${params.order === 'desc' ? '-' : ''}${params.sort || 'createdAt'}`,
      depth: 2,
    })

    return {
      products: result.docs.map(transformProductToListItem),
      pagination: {
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
        totalDocs: result.totalDocs,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage,
      },
    }
  },
  ['products-list'],
  {
    revalidate: 60, // Cache for 1 minute
    tags: ['products'],
  },
)

/**
 * Get featured products with caching
 */
export const getCachedFeaturedProducts = unstable_cache(
  async (limit: number = 8): Promise<ProductListItem[]> => {
    const payload = await getPayload({ config })

    const result = await payload.find({
      collection: 'products',
      where: {
        status: { equals: 'active' },
        'features.0': { exists: true }, // Has at least one feature
      },
      limit,
      sort: '-createdAt',
      depth: 2,
    })

    return result.docs.map(transformProductToListItem)
  },
  ['featured-products'],
  {
    revalidate: 300, // Cache for 5 minutes
    tags: ['products', 'featured'],
  },
)
