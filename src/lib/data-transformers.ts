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
    id: String(media.id),
    url: media.url || '',
    alt: media.alt || '',
    filename: media.filename || '',
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
    description: payloadCategory.description || undefined,
    image:
      payloadCategory.image && typeof payloadCategory.image === 'object'
        ? {
            url: payloadCategory.image.url || '',
            alt: payloadCategory.image.alt || payloadCategory.name,
          }
        : undefined,
    icon: payloadCategory.icon || undefined,
    displayOrder: payloadCategory.displayOrder || 0,
    productCount: payloadCategory.productCount || 0,
    isFeature: payloadCategory.isFeature || false,
    showInNavigation: payloadCategory.showInNavigation || false,
  }
}

/**
 * Transform Payload Brand to frontend Brand
 */
export function transformBrand(payloadBrand: PayloadBrand | number | null): Brand | null {
  if (!payloadBrand || typeof payloadBrand === 'number') return null

  return {
    id: payloadBrand.id,
    name: payloadBrand.name,
    slug: payloadBrand.slug,
    description: payloadBrand.description || undefined,
    logo:
      payloadBrand.logo && typeof payloadBrand.logo === 'object'
        ? {
            url: payloadBrand.logo.url || '',
            alt: payloadBrand.logo.alt || payloadBrand.name,
          }
        : undefined,
    website: payloadBrand.website || undefined,
    countryOfOrigin: payloadBrand.countryOfOrigin || undefined,
    isFeatured: payloadBrand.isFeatured || false,
    isPremium: payloadBrand.isPremium || false,
    priceRange: payloadBrand.priceRange || undefined,
    productCount: payloadBrand.productCount || 0,
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

  return {
    id: payloadProduct.id,
    name: payloadProduct.name,
    slug: payloadProduct.slug,
    price: payloadProduct.price,
    originalPrice: payloadProduct.pricing?.originalPrice || undefined,
    sku: payloadProduct.sku,
    stock: effectiveStock, // Use calculated effective stock
    status: payloadProduct.status,
    sizes: (payloadProduct.variants?.map((v) => v.size).filter(Boolean) as string[]) || [],
    colors: (payloadProduct.variants?.map((v) => v.color).filter(Boolean) as string[]) || [],
    images:
      payloadProduct.images?.map((img) => ({
        id: typeof img.image === 'object' ? String(img.image.id) : String(img.image),
        url: typeof img.image === 'object' ? img.image.url || '' : '',
        alt: img.altText || payloadProduct.name,
        filename: typeof img.image === 'object' ? img.image.filename || '' : '',
      })) || [],
    category: transformCategory(payloadProduct.category),
    brand: (() => {
      const brand = transformBrand(payloadProduct.brand)
      if (!brand) return null
      return {
        ...brand,
        logo: typeof brand.logo === 'object' && brand.logo ? brand.logo.url : undefined,
      }
    })(),
    description: payloadProduct.description ?? undefined,
    features: payloadProduct.features?.map((f) => f.feature) || [],
    specifications: payloadProduct.specifications
      ? {
          material: payloadProduct.specifications.material ?? undefined,
          weight: payloadProduct.specifications.weight ?? undefined,
          dimensions: payloadProduct.specifications.dimensions ?? undefined,
          careInstructions: payloadProduct.specifications.careInstructions ?? undefined,
        }
      : undefined,
    shipping: payloadProduct.shipping
      ? {
          freeShipping:
            payloadProduct.shipping.freeShipping !== null
              ? payloadProduct.shipping.freeShipping
              : undefined,
          islandWideDelivery:
            payloadProduct.shipping.islandWideDelivery !== null
              ? payloadProduct.shipping.islandWideDelivery
              : undefined,
          easyReturn:
            payloadProduct.shipping.easyReturn !== null
              ? payloadProduct.shipping.easyReturn
              : undefined,
          shippingWeight:
            payloadProduct.shipping.shippingWeight !== null
              ? payloadProduct.shipping.shippingWeight
              : undefined,
        }
      : undefined,
    seo: payloadProduct.seo
      ? {
          title: payloadProduct.seo.title ?? undefined,
          description: payloadProduct.seo.description ?? undefined,
        }
      : undefined,
    rating: undefined, // Add if you implement ratings
    reviewCount: undefined, // Add if you implement reviews
    tags: payloadProduct.tags?.split(',').map((t) => t.trim()) || [],
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
    status: listItem.status as 'active' | 'inactive' | 'draft' | 'out-of-stock' | 'discontinued',
    relatedProducts:
      payloadProduct.relatedProducts?.map((rp) =>
        typeof rp === 'number' ? String(rp) : String(rp.id),
      ) || [],
    viewCount: undefined, // Add if you track views
  }
}

/**
 * Transform API variant to include proper inventory
 */
export function transformVariant(variant: any): any {
  return {
    id: variant.id || crypto.randomUUID(),
    name: variant.name || 'Default',
    sku: variant.sku || '',
    size: variant.size || undefined,
    color: variant.color || undefined,
    price: variant.price || 0,
    inventory: variant.inventory || variant.stock || 0,
    options: {
      ...(variant.size && { size: variant.size }),
      ...(variant.color && { color: variant.color }),
    },
  }
}
