/**
 * Transform Payload Brand to ProductBrand (for ProductListItem/Product)
 */
export function transformProductBrand(
  payloadBrand: PayloadBrand | number | null,
): import('@/types/api').ProductBrand | null {
  if (!payloadBrand || typeof payloadBrand === 'number') return null
  let logoUrl: string | undefined = undefined
  if (payloadBrand.branding?.logo) {
    if (typeof payloadBrand.branding.logo === 'object') {
      logoUrl = payloadBrand.branding.logo.url ?? ''
    } else if (typeof payloadBrand.branding.logo === 'string') {
      logoUrl = payloadBrand.branding.logo
    }
  }
  return {
    id: payloadBrand.id,
    name: payloadBrand.name,
    slug: payloadBrand.slug,
    logo: logoUrl,
    description: payloadBrand.branding?.description ?? undefined,
    website: payloadBrand.details?.website ?? undefined,
  }
}
import {
  Product as PayloadProduct,
  Category as PayloadCategory,
  Brand as PayloadBrand,
  Media as PayloadMedia,
} from '@/payload-types'
import { Product, ProductListItem, Category, Brand, ProductImage } from '@/types/api'
import { hasAvailableStock, getTotalAvailableInventory } from './product-utils'

/**
 * Transform Payload Media to ProductImage
 */
export function transformMedia(media: PayloadMedia | number | null): ProductImage | null {
  if (!media || typeof media === 'number') return null
  return {
    id: String(media.id ?? ''),
    url: media.url ?? '',
    alt: media.details?.alt ?? media.filename ?? '',
    filename: media.filename ?? '',
  }
}

/**
 * Transform Payload Category to frontend Category
 */
export function transformCategory(
  payloadCategory: PayloadCategory | number | null,
): Category | null {
  if (!payloadCategory || typeof payloadCategory === 'number') return null
  return {
    id: payloadCategory.id,
    name: payloadCategory.name,
    slug: payloadCategory.slug,
    description: payloadCategory.description ?? undefined,
    image:
      payloadCategory.visual?.image && typeof payloadCategory.visual.image === 'object'
        ? {
            url: payloadCategory.visual.image.url ?? '',
            alt: payloadCategory.visual.image.details?.alt ?? payloadCategory.name ?? '',
          }
        : undefined,
    icon: payloadCategory.visual?.icon ?? undefined,
    displayOrder: payloadCategory.displayOrder,
    productCount: payloadCategory.productCount ?? 0,
    isFeature: payloadCategory.isFeature ?? false,
    showInNavigation: payloadCategory.showInNavigation ?? false,
  }
}

/**
 * Transform Payload Brand to frontend Brand
 */
export function transformBrand(payloadBrand: PayloadBrand | number | null): Brand | null {
  if (!payloadBrand || typeof payloadBrand === 'number') return null
  let logoObj: { url: string; alt: string } | undefined = undefined
  if (payloadBrand.branding?.logo && typeof payloadBrand.branding.logo === 'object') {
    logoObj = {
      url: payloadBrand.branding.logo.url ?? '',
      alt: payloadBrand.branding.logo.details?.alt ?? payloadBrand.name ?? '',
    }
  }
  return {
    id: payloadBrand.id,
    name: payloadBrand.name,
    slug: payloadBrand.slug,
    description: payloadBrand.branding?.description ?? undefined,
    logo: logoObj,
    website: payloadBrand.details?.website ?? undefined,
    countryOfOrigin: payloadBrand.details?.countryOfOrigin ?? undefined,
    isFeatured: payloadBrand.isFeatured ?? false,
    isPremium: payloadBrand.isPremium ?? false,
    priceRange: payloadBrand.details?.priceRange ?? undefined,
    productCount: payloadBrand.productCount ?? 0,
  }
}

/**
 * Transform Payload Product to ProductListItem (for lists)
 */
export function transformProductToListItem(payloadProduct: PayloadProduct): ProductListItem {
  // Calculate effective stock based on variants or base stock
  const effectiveStock = hasAvailableStock(payloadProduct)
    ? getTotalAvailableInventory(payloadProduct)
    : 0
  // Extract essentials and productDetails
  const essentials = payloadProduct.essentials ?? {}
  const productDetails = payloadProduct.productDetails ?? {}
  // Extract variants
  const variants = Array.isArray(payloadProduct.variants)
    ? payloadProduct.variants.map((variant) => ({
        id: variant.id ?? '',
        name: variant.name ?? 'Default',
        sku: variant.sku ?? '',
        size: variant.size ?? undefined,
        color: variant.color ?? undefined,
        price: variant.price ?? 0,
        inventory: variant.stock ?? 0,
      }))
    : undefined
  // Sizes/colors
  const sizes = variants ? variants.map((v) => v.size).filter((s): s is string => !!s) : []
  const colors = variants ? variants.map((v) => v.color).filter((c): c is string => !!c) : []
  // Tags
  const tags =
    typeof productDetails.tags === 'string'
      ? productDetails.tags.split(',').map((t) => t.trim())
      : []
  return {
    id: payloadProduct.id,
    name: payloadProduct.name,
    slug: payloadProduct.slug ?? '',
    price: essentials.price ?? 0,
    originalPrice: productDetails.originalPrice ?? undefined,
    sku: productDetails.sku ?? '',
    stock: effectiveStock,
    status: payloadProduct.status ?? 'inactive',
    sizes,
    colors,
    images: Array.isArray(payloadProduct.images)
      ? payloadProduct.images.map((img) => ({
          id: typeof img.image === 'object' ? String(img.image.id ?? '') : String(img.image ?? ''),
          url: typeof img.image === 'object' ? (img.image.url ?? '') : '',
          alt: img.altText ?? payloadProduct.name ?? '',
          filename: typeof img.image === 'object' ? (img.image.filename ?? '') : '',
        }))
      : [],
    variants,
    category: transformCategory(payloadProduct.categorySelection?.sportsCategory ?? null),
    brand: transformProductBrand(essentials.brand ?? null),
    description: payloadProduct.description ?? undefined,
    features: Array.isArray(payloadProduct.features)
      ? payloadProduct.features.map((f) => f.feature)
      : [],
    specifications: payloadProduct.specifications
      ? {
          material: payloadProduct.specifications.material ?? undefined,
          weight: payloadProduct.specifications.weight ?? undefined,
          dimensions: payloadProduct.specifications.dimensions ?? undefined,
          careInstructions: payloadProduct.specifications.careInstructions ?? undefined,
        }
      : undefined,
    seo: payloadProduct.seo
      ? {
          title: payloadProduct.seo.title ?? undefined,
          description: payloadProduct.seo.description ?? undefined,
        }
      : undefined,
    rating: undefined,
    reviewCount: undefined,
    tags,
    createdAt: payloadProduct.createdAt,
    updatedAt: payloadProduct.updatedAt,
  }
}

/**
 * Transform Payload Product to full Product (for detail pages)
 */
export function transformProductToDetail(payloadProduct: PayloadProduct): Product {
  const listItem = transformProductToListItem(payloadProduct)
  return {
    ...listItem,
    status: (listItem.status ?? 'inactive') as
      | 'active'
      | 'inactive'
      | 'draft'
      | 'out-of-stock'
      | 'discontinued',
    relatedProducts: Array.isArray(payloadProduct.relatedProducts)
      ? payloadProduct.relatedProducts.map((rp) =>
          typeof rp === 'number' ? String(rp) : String(rp?.id ?? ''),
        )
      : [],
    viewCount: undefined,
  }
}

/**
 * Transform API variant to include proper inventory
 */
export function transformVariant(variant: any): any {
  return {
    id:
      variant.id ?? (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : ''),
    name: variant.name ?? 'Default',
    sku: variant.sku ?? '',
    size: variant.size ?? undefined,
    color: variant.color ?? undefined,
    price: variant.price ?? 0,
    inventory: variant.inventory ?? variant.stock ?? 0,
    options: {
      ...(variant.size ? { size: variant.size } : {}),
      ...(variant.color ? { color: variant.color } : {}),
    },
  }
}
