import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Product } from '@/payload-types'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const payload = await getPayload({ config })
    const { slug } = await params

    // Find product by slug, ensuring deep population of related fields
    const result = await payload.find({
      collection: 'products',
      where: {
        slug: {
          equals: slug,
        },
      },
      limit: 1,
      depth: 3, // Depth 3 is good to get brand and category details
    })

    if (!result.docs.length) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 })
    }

    const product = result.docs[0] as Product

    // --- FIX: Transform product data correctly from the new nested schema ---
    const transformedProduct = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      sku: product.productDetails?.sku,
      description: product.description,
      price: product.essentials.price, // Correctly access price from the 'essentials' group
      originalPrice: product.productDetails?.originalPrice,
      stock:
        product.variants && product.variants.length > 0
          ? product.variants.reduce((total: number, v: any) => total + (v.stock || 0), 0)
          : product.inventory?.stock || 0, // Correctly access stock from the 'inventory' group
      status: product.status,
      images:
        product.images?.map((img: any) => ({
          id: img.id,
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
          inventory: variant.stock || 0, // Variants use 'stock' not 'inventory'
          price: variant.price || product.essentials.price,
        })) || [],
      // Correctly extract the most specific category from the 'categorySelection' group
      category: (() => {
        const selection = product.categorySelection
        if (!selection) return null

        // Use the most specific category available (Level 3 > Level 2 > Level 1)
        const categoryData = selection.sportsItem || selection.sports || selection.sportsCategory

        if (categoryData && typeof categoryData === 'object') {
          return {
            id: categoryData.id,
            name: categoryData.name,
            slug: categoryData.slug,
          }
        }
        return null
      })(),
      brand:
        product.essentials.brand && typeof product.essentials.brand === 'object'
          ? {
              id: product.essentials.brand.id,
              name: product.essentials.brand.name,
              slug: product.essentials.brand.slug,
              logo:
                product.essentials.brand.branding.logo &&
                typeof product.essentials.brand.branding.logo === 'object'
                  ? product.essentials.brand.branding.logo.url
                  : undefined,
            }
          : null,
      features: product.features?.map((f: any) => f.feature) || [],
      specifications: product.specifications,
      relatedProducts: product.relatedProducts || [],
      tags: product.productDetails?.tags
        ? product.productDetails.tags.split(',').map((t: string) => t.trim())
        : [],
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
