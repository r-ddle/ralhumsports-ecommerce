import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params

    if (!slug) {
      return NextResponse.json(
        { success: false, error: 'Product slug is required' },
        { status: 400 },
      )
    }

    const payload = await getPayload({ config })

    // Find product by slug
    const result = await payload.find({
      collection: 'products',
      where: {
        slug: {
          equals: slug,
        },
        status: {
          equals: 'active',
        },
      },
      limit: 1,
      depth: 3, // Include deep related data
    })

    if (result.docs.length === 0) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 })
    }

    const product = result.docs[0]

    // Transform product to match frontend interface
    const transformedProduct = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      originalPrice: product.pricing?.originalPrice || null,
      sku: product.sku,
      stock: product.stock,
      status: product.status,
      variants: product.variants || [],
      images:
        product.images?.map((img) => ({
          id: typeof img.image === 'object' ? img.image.id : img.image,
          url: typeof img.image === 'object' ? img.image.url : '',
          alt: img.altText || product.name,
          filename: typeof img.image === 'object' ? img.image.filename : '',
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
              website: product.brand.website,
            }
          : null,
      description: product.description,
      features: product.features?.map((f) => f.feature) || [],
      specifications: product.specifications,
      shipping: product.shipping,
      seo: product.seo,
      // rating: product.analytics?.rating,
      // reviewCount: product.analytics?.reviewCount,
      // viewCount: product.analytics?.viewCount,
      tags: product.tags ? product.tags.split(',').map((t) => t.trim()) : [],
      relatedProducts: Array.isArray(product.relatedProducts)
        ? product.relatedProducts.map((p) =>
            typeof p === 'object' && p !== null
              ? {
                  id: p.id,
                  name: p.name,
                  slug: p.slug,
                  price: p.price,
                  images: p.images,
                }
              : p,
          )
        : [],
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }

    return NextResponse.json({
      success: true,
      data: transformedProduct,
    })
  } catch (error) {
    console.error('Single product API error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch product' }, { status: 500 })
  }
}
