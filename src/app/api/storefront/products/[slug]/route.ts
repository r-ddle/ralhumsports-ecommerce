import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Product, Brand as BrandType, Category as CategoryType, Media } from '@/payload-types'
import { getSecurityHeaders } from '@/lib/response-filter'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }, // params is already an object
) {
  const payload = await getPayload({ config })
  const { slug } = params

  if (!slug || typeof slug !== 'string' || slug.trim() === '') {
    return NextResponse.json(
      { success: false, error: 'Product slug is required and must be a non-empty string.' },
      { status: 400, headers: getSecurityHeaders() },
    )
  }

  try {
    const result = await payload.find({
      collection: 'products',
      where: {
        slug: { equals: slug },
        status: { equals: 'active' }, // Only fetch active products for storefront
      },
      limit: 1,
      depth: 3, // Ensure related data like images, category, brand are well populated
    })

    if (result.docs.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Product not found or not active.' },
        { status: 404, headers: getSecurityHeaders() },
      )
    }

    const product = result.docs[0] as Product // Cast to Product type

    // Transform product to match frontend interface, with strong typing
    const category = product.category as CategoryType | undefined;
    const brand = product.brand as BrandType | undefined;

    const transformedProduct = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      originalPrice: product.pricing?.originalPrice ?? null,
      sku: product.sku,
      stock: product.stock,
      status: product.status,
      sizes: product.sizes?.split(',').map((s) => s.trim()) ?? [],
      colors: product.colors?.split(',').map((c) => c.trim()) ?? [],
      images:
        product.images?.map((img) => {
          const imageFile = img.image as Media | undefined;
          return {
            id: imageFile?.id ?? String(img.image) ?? '', // Handle populated vs ID
            url: imageFile?.url ?? '',
            alt: img.altText || product.name, // Fallback alt text
            filename: imageFile?.filename ?? '',
          };
        }) ?? [],
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
            logo: brand.logo && typeof brand.logo === 'object'
                ? { url: (brand.logo as Media).url ?? '', alt: (brand.logo as Media).alt ?? brand.name }
                : undefined,
            website: brand.website,
          }
        : null,
      description: product.description, // Assuming RichText is handled by consumer
      features: product.features?.map((f) => f.feature) ?? [],
      specifications: product.specifications,
      shipping: product.shipping,
      seo: product.seo,
      rating: product.analytics?.rating,
      reviewCount: product.analytics?.reviewCount,
      viewCount: product.analytics?.viewCount, // Included this field
      tags: product.tags?.split(',').map((t) => t.trim()) ?? [],
      relatedProducts: product.relatedProducts?.split(',').map((p) => p.trim()) ?? [],
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }

    return NextResponse.json(
      { success: true, data: transformedProduct },
      { headers: getSecurityHeaders() },
    )
  } catch (error) {
    const err = error as Error;
    payload.logger.error({ msg: `Single product API error for slug: ${slug}`, error: err.message, stack: err.stack })
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch product.',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined,
      },
      { status: 500, headers: getSecurityHeaders() },
    )
  }
}
