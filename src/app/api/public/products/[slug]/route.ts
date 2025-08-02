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

    // Transform product data correctly from the nested schema
    const transformedProduct = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      sku: product.productDetails?.sku,
      description: product.description,
      price: product.essentials?.price || 0,
      originalPrice: product.productDetails?.originalPrice,
      stock:
        product.hasVariants && product.variants && product.variants.length > 0
          ? product.variants.reduce((total: number, v: any) => total + (v.stock || 0), 0)
          : product.inventory?.stock || 0,
      status: product.status,
      images:
        product.images?.map((img: any) => ({
          id: img.id,
          url: typeof img.image === 'object' ? img.image.url : img.image,
          alt: img.altText || product.name,
        })) || [],
      // Always include variants array - even if there's only one "default" variant
      variants:
        product.hasVariants && product.variants && product.variants.length > 0
          ? product.variants.map((variant: any) => ({
              id: variant.id,
              name: variant.name,
              sku: variant.sku,
              color: variant.color,
              size: variant.size,
              material: variant.material,
              inventory: variant.stock || 0,
              price: variant.price || product.essentials?.price || 0,
            }))
          : [
              // Create a single default variant for products without explicit variants
              {
                id: `${product.id}-default`,
                name: 'Standard',
                sku: product.productDetails?.sku || `${product.id}-std`,
                inventory: product.inventory?.stock || 0,
                price: product.essentials?.price || 0,
              },
            ],
      // Extract category hierarchy for breadcrumbs and navigation
      categoryHierarchy: (() => {
        const selection = product.categorySelection
        if (!selection) return []

        const hierarchy = []
        if (selection.sportsCategory && typeof selection.sportsCategory === 'object') {
          hierarchy.push({
            id: selection.sportsCategory.id,
            name: selection.sportsCategory.name,
            slug: selection.sportsCategory.slug,
            type: 'sports-category',
            level: 1,
          })
        }
        if (selection.sports && typeof selection.sports === 'object') {
          hierarchy.push({
            id: selection.sports.id,
            name: selection.sports.name,
            slug: selection.sports.slug,
            type: 'sports',
            level: 2,
          })
        }
        if (selection.sportsItem && typeof selection.sportsItem === 'object') {
          hierarchy.push({
            id: selection.sportsItem.id,
            name: selection.sportsItem.name,
            slug: selection.sportsItem.slug,
            type: 'sports-item',
            level: 3,
          })
        }
        return hierarchy
      })(),
      // Primary category (most specific)
      category: (() => {
        const selection = product.categorySelection
        if (!selection) return null

        // Use the most specific category available
        const categoryData = selection.sportsItem || selection.sports || selection.sportsCategory

        if (categoryData && typeof categoryData === 'object') {
          return {
            id: categoryData.id,
            name: categoryData.name,
            slug: categoryData.slug,
            type: categoryData.type,
            level: categoryData.level,
          }
        }
        return null
      })(),
      brand:
        product.essentials?.brand && typeof product.essentials.brand === 'object'
          ? {
              id: product.essentials.brand.id,
              name: product.essentials.brand.name,
              slug: product.essentials.brand.slug,
              description: product.essentials.brand.description,
              logo:
                product.essentials.brand.branding?.logo?.url
                  ? {
                      url: product.essentials.brand.branding.logo.url,
                      alt: product.essentials.brand.branding.logo.alt || product.essentials.brand.name,
                    }
                  : null,
              website: product.essentials.brand.website,
            }
          : null,
      features: product.features?.map((f: any) => f.feature) || [],
      specifications: {
        weight: product.specifications?.weight,
        dimensions: product.specifications?.dimensions,
        material: product.specifications?.material,
        gender: product.specifications?.gender,
        careInstructions: product.specifications?.careInstructions,
        ...(product.specifications || {}),
      },
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
