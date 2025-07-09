import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(_request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const payload = await getPayload({ config })
    const { slug } = params

    // Find product by slug
    const result = await payload.find({
      collection: 'products',
      where: {
        slug: {
          equals: slug,
        },
      },
      limit: 1,
      depth: 3, // Include related data
    })

    if (!result.docs.length) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 })
    }

    const product = result.docs[0] as any

    // Transform product data to frontend format
    const transformedProduct = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      description: product.description,
      price: product.price,
      stock:
        product.variants?.length > 0
          ? product.variants.reduce((total: number, v: any) => total + (v.inventory || 0), 0)
          : product.stock || 0,
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
          color: variant.color,
          size: variant.size,
          inventory: variant.inventory || 0,
          price: variant.price || product.price,
        })) || [],
      category: product.category
        ? {
            id: product.category.id,
            name: product.category.name,
            slug: product.category.slug,
          }
        : null,
      brand: product.brand
        ? {
            id: product.brand.id,
            name: product.brand.name,
            slug: product.brand.slug,
            logo:
              typeof product.brand.logo === 'object'
                ? {
                    url: product.brand.logo.url,
                    alt: product.brand.logo.alt || product.brand.name,
                  }
                : undefined,
          }
        : null,
      features: product.features?.map((f: any) => f.feature) || [],
      specifications: product.specifications,
      shipping: product.shipping,
      seo: product.seo,
      analytics: product.analytics,
      relatedProducts: product.relatedProducts || [],
      tags: product.tags ? product.tags.split(',').map((t: string) => t.trim()) : [],
      createdBy: product.createdBy,
      lastModifiedBy: product.lastModifiedBy,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }

    const response = NextResponse.json({
      success: true,
      data: transformedProduct,
    })

    // Add caching headers for individual products
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
    return response
  } catch (error) {
    console.error('Product detail API error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch product' }, { status: 500 })
  }
}
