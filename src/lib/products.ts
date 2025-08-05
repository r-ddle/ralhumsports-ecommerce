import { Product as PayloadProduct } from '@/payload-types'
import {
  Product,
  Brand,
  Category,
  ProductsResponse,
  ProductFilters,
  ProductSort,
} from '@/types/product'
import { api } from '@/lib/api'

/**
 * Transform PayloadCMS product to frontend Product type
 */
export function transformPayloadProduct(payloadProduct: PayloadProduct): Product {
  // Transform the PayloadCMS product to match the frontend Product interface
  // Images
  const images = Array.isArray(payloadProduct.images)
    ? payloadProduct.images.map((img) => ({
        id: typeof img.image === 'object' ? String(img.image.id ?? '') : String(img.image ?? ''),
        url: typeof img.image === 'object' ? (img.image.url ?? '') : '',
        alt: img.altText ?? payloadProduct.name ?? '',
      }))
    : []
  // Brand
  const brandObj =
    typeof payloadProduct.essentials?.brand === 'object' ? payloadProduct.essentials.brand : null
  const brand = brandObj
    ? {
        id: String(brandObj.id),
        name: brandObj.name,
        slug: brandObj.slug,
        description: brandObj.branding?.description ?? undefined,
        logo:
          typeof brandObj.branding?.logo === 'object'
            ? (brandObj.branding.logo.url ?? undefined)
            : undefined,
        website: brandObj.details?.website ?? undefined,
        featured: brandObj.isFeatured ?? false,
        createdAt: brandObj.createdAt,
        updatedAt: brandObj.updatedAt,
      }
    : ({} as Brand)
  // Category
  const categoryObj =
    typeof payloadProduct.categorySelection?.sportsCategory === 'object'
      ? payloadProduct.categorySelection.sportsCategory
      : null
  const categories = categoryObj
    ? [
        {
          id: String(categoryObj.id),
          name: categoryObj.name,
          slug: categoryObj.slug,
          description: categoryObj.description ?? undefined,
          image:
            categoryObj.visual?.image && typeof categoryObj.visual.image === 'object'
              ? (categoryObj.visual.image.url ?? undefined)
              : undefined,
          parentCategory:
            typeof categoryObj.parentCategory === 'object'
              ? categoryObj.parentCategory
                ? String(categoryObj.parentCategory.id)
                : undefined
              : typeof categoryObj.parentCategory === 'number'
                ? String(categoryObj.parentCategory)
                : undefined,
          createdAt: categoryObj.createdAt,
          updatedAt: categoryObj.updatedAt,
        },
      ]
    : []
  // Variants
  const variants = Array.isArray(payloadProduct.variants)
    ? payloadProduct.variants.map((variant, idx) => ({
        id: String(variant.id ?? idx + 1),
        name: variant.name ?? 'Default',
        price: variant.price ?? payloadProduct.essentials?.price ?? 0,
        compareAtPrice: undefined,
        sku: variant.sku ?? '',
        inventory: variant.stock ?? 0,
        weight:
          payloadProduct.specifications?.weight !== undefined
            ? Number(payloadProduct.specifications.weight)
            : undefined,
        options: {
          ...(variant.size ? { size: variant.size } : {}),
          ...(variant.color ? { color: variant.color } : {}),
        },
      }))
    : [
        {
          id: '1',
          name: 'Default',
          price: payloadProduct.essentials?.price ?? 0,
          compareAtPrice: payloadProduct.productDetails?.originalPrice ?? undefined,
          sku: payloadProduct.productDetails?.sku ?? '',
          inventory: payloadProduct.inventory?.stock ?? 0,
          weight:
            payloadProduct.specifications?.weight !== undefined
              ? Number(payloadProduct.specifications.weight)
              : undefined,
          options: {},
        },
      ]
  // Tags
  const tags =
    typeof payloadProduct.productDetails?.tags === 'string'
      ? payloadProduct.productDetails.tags.split(',').map((t) => t.trim())
      : []
  // Description
  const description = payloadProduct.description
    ? typeof payloadProduct.description === 'string'
      ? payloadProduct.description
      : JSON.stringify(payloadProduct.description)
    : ''
  // Status
  let status: Product['status'] = 'archived'
  if (payloadProduct.status === 'active') status = 'active'
  else if (payloadProduct.status === 'draft') status = 'draft'
  // SEO
  const seo = payloadProduct.seo
    ? {
        title: payloadProduct.seo.title ?? undefined,
        description: payloadProduct.seo.description ?? undefined,
      }
    : undefined
  // Specifications
  const specifications = payloadProduct.specifications
    ? {
        material: payloadProduct.specifications.material ?? '',
        weight: payloadProduct.specifications.weight ?? '',
        dimensions: payloadProduct.specifications.dimensions ?? '',
        careInstructions: payloadProduct.specifications.careInstructions ?? '',
      }
    : undefined
  return {
    id: String(payloadProduct.id),
    title: payloadProduct.name,
    slug: payloadProduct.slug ?? '',
    description,
    shortDescription: payloadProduct.seo?.description ?? '',
    brand,
    categories,
    images,
    variants,
    tags,
    status,
    seo,
    specifications,
    createdAt: payloadProduct.createdAt,
    updatedAt: payloadProduct.updatedAt,
    sku: payloadProduct.productDetails?.sku ?? '',
    featured: Array.isArray(payloadProduct.features) && payloadProduct.features.length > 0,
  }
}

/**
 * Get products from the API instead of mock data
 */
export async function getProducts(
  filters: ProductFilters = {},
  sort: ProductSort = { field: 'createdAt', direction: 'desc' },
  page: number = 1,
  limit: number = 12,
): Promise<ProductsResponse> {
  try {
    const response = await api.getProducts({
      page,
      limit,
      search: filters.search,
      status: 'active',
      sort: sort.field === 'title' ? 'name' : sort.field === 'featured' ? 'createdAt' : sort.field,
      order: sort.direction,
      minPrice: filters.priceRange?.min,
      maxPrice: filters.priceRange?.max,
      inStock: filters.inStock,
      // Add hierarchical category filters
      sportsCategory: filters.sportsCategory,
      sport: filters.sport,
      sportsItem: filters.sportsItem,
      // Add legacy filters for backward compatibility
      category: filters.categories && filters.categories.length > 0 ? filters.categories[0] : undefined,
      brand: filters.brands && filters.brands.length > 0 ? filters.brands[0] : undefined,
    })

    if (!response.success) {
      throw new Error('Failed to fetch products')
    }

    // Transform the API response to match ProductsResponse
    const products = response.data.map((apiProduct) => {
      // Transform API product to frontend Product type
      const product: Product = {
        id: String(apiProduct.id),
        title: apiProduct.name,
        slug: apiProduct.slug,
        description: typeof apiProduct.description === 'string' ? apiProduct.description : '',
        shortDescription: apiProduct.seo?.description || '',
        brand: apiProduct.brand
          ? {
              id: String(apiProduct.brand.id),
              name: apiProduct.brand.name,
              slug: apiProduct.brand.slug,
              description: apiProduct.brand.description || undefined,
              logo:
                apiProduct.brand.logo &&
                typeof apiProduct.brand.logo === 'object' &&
                'url' in apiProduct.brand.logo
                  ? ((apiProduct.brand.logo as { url?: string }).url ?? undefined)
                  : (apiProduct.brand.logo ?? undefined),
              website: apiProduct.brand.website || undefined,
              featured: false,
              createdAt: '',
              updatedAt: '',
            }
          : {
              id: '',
              name: '',
              slug: '',
              description: undefined,
              logo: undefined,
              website: undefined,
              featured: false,
              createdAt: '',
              updatedAt: '',
            },
        categories: apiProduct.category
          ? [
              {
                ...apiProduct.category,
                id: String(apiProduct.category.id),
                createdAt: '',
                updatedAt: '',
              },
            ]
          : [],
        images: apiProduct.images.map((img) => ({
          id: String(img.id),
          url: img.url,
          alt: img.alt,
        })),
        variants: [
          {
            id: '1',
            name: 'Default',
            price: apiProduct.price,
            compareAtPrice: apiProduct.originalPrice || undefined,
            sku: apiProduct.sku,
            inventory: apiProduct.stock,
            options: {},
          },
        ],
        tags: apiProduct.tags,
        featured: apiProduct.rating ? apiProduct.rating > 4 : false,
        status: 'active',
        seo: apiProduct.seo,
        specifications: apiProduct.specifications
          ? Object.fromEntries(
              Object.entries(apiProduct.specifications).filter(
                ([, value]) => typeof value === 'string',
              ),
            )
          : undefined,
        createdAt: apiProduct.createdAt,
        updatedAt: apiProduct.updatedAt,
        sku: apiProduct.sku,
      }
      return product
    })

    return {
      products,
      pagination: {
        currentPage: response.pagination.page,
        totalPages: response.pagination.totalPages,
        totalItems: response.pagination.totalDocs,
        itemsPerPage: response.pagination.limit,
        hasNextPage: response.pagination.hasNextPage,
        hasPrevPage: response.pagination.hasPrevPage,
      },
      filters,
      appliedSort: sort,
    }
  } catch (error) {
    console.error('Error fetching products:', error)
    return {
      products: [],
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        itemsPerPage: limit,
        hasNextPage: false,
        hasPrevPage: false,
      },
      filters,
      appliedSort: sort,
    }
  }
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  try {
    const response = await api.getProduct(slug)
    if (!response.success || !response.data) {
      return undefined
    }

    // Transform the API product to frontend Product type
    const apiProduct = response.data
    return {
      id: String(apiProduct.id),
      title: apiProduct.name,
      slug: apiProduct.slug,
      description: typeof apiProduct.description === 'string' ? apiProduct.description : '',
      shortDescription: apiProduct.seo?.description || '',
      brand: apiProduct.brand
        ? {
            id: String(apiProduct.brand.id),
            name: apiProduct.brand.name,
            slug: apiProduct.brand.slug,
            description: apiProduct.brand.description || undefined,
            logo:
              apiProduct.brand.logo &&
              typeof apiProduct.brand.logo === 'object' &&
              'url' in apiProduct.brand.logo
                ? ((apiProduct.brand.logo as { url?: string }).url ?? undefined)
                : (apiProduct.brand.logo ?? undefined),
            website: apiProduct.brand.website || undefined,
            featured: false,
            createdAt: '',
            updatedAt: '',
          }
        : {
            id: '',
            name: '',
            slug: '',
            description: undefined,
            logo: undefined,
            website: undefined,
            featured: false,
            createdAt: '',
            updatedAt: '',
          },
      categories: apiProduct.category
        ? [
            {
              ...apiProduct.category,
              id: String(apiProduct.category.id),
              createdAt: '',
              updatedAt: '',
            },
          ]
        : [],
      images: apiProduct.images.map((img) => ({
        id: String(img.id),
        url: img.url,
        alt: img.alt,
      })),
      variants: [
        {
          id: '1',
          name: 'Default',
          price: apiProduct.price,
          compareAtPrice: apiProduct.originalPrice || undefined,
          sku: apiProduct.sku,
          inventory: apiProduct.stock,
          options: {},
        },
      ],
      tags: apiProduct.tags,
      featured: apiProduct.rating ? apiProduct.rating > 4 : false,
      status: 'active',
      seo: apiProduct.seo,
      specifications: apiProduct.specifications
        ? Object.fromEntries(
            Object.entries(apiProduct.specifications).filter(
              ([, value]) => typeof value === 'string',
            ),
          )
        : undefined,
      relatedProducts: apiProduct.relatedProducts,
      createdAt: apiProduct.createdAt,
      updatedAt: apiProduct.updatedAt,
      sku: apiProduct.sku,
    }
  } catch (error) {
    console.error('Error fetching product by slug:', error)
    return undefined
  }
}

export async function getFeaturedProducts(limit: number = 4): Promise<Product[]> {
  const response = await getProducts(
    { featured: true },
    { field: 'createdAt', direction: 'desc' },
    1,
    limit,
  )
  return response.products
}

export async function getProductsByBrand(brandSlug: string, limit?: number): Promise<Product[]> {
  const response = await getProducts(
    { brands: [brandSlug] },
    { field: 'createdAt', direction: 'desc' },
    1,
    limit || 100,
  )
  return response.products
}

export async function getProductsByCategory(
  categorySlug: string,
  limit?: number,
): Promise<Product[]> {
  const response = await getProducts(
    { categories: [categorySlug] },
    { field: 'createdAt', direction: 'desc' },
    1,
    limit || 100,
  )
  return response.products
}

export async function getAllBrands(): Promise<Brand[]> {
  const response = await api.getBrands()
  if (!response.success || !response.data) {
    return []
  }
  // ✅ Fix: Line 372 - Properly type brand instead of any
  return response.data.map((brand) => ({
    id: String(brand.id || ''),
    name: String(brand.name || ''),
    slug: String(brand.slug || ''),
    description: brand.description ? String(brand.description) : undefined,
    logo: brand.logo ? String(brand.logo) : undefined,
    website: brand.website ? String(brand.website) : undefined,
    featured: Boolean(brand.isFeatured),
    createdAt: String(''),
    updatedAt: String(''),
  }))
}

export async function getAllCategories(): Promise<Category[]> {
  const response = await api.getCategories()
  if (!response.success || !response.data) {
    return []
  }
  // ✅ Fix: Line 385 - Properly type category instead of any
  return response.data.map((category) => ({
    id: String(category.id || ''),
    name: String(category.name || ''),
    slug: String(category.slug || ''),
    description: category.description ? String(category.description) : undefined,
    image: category.image ? String(category.image) : undefined,
    parentCategory: undefined,
    createdAt: String(''),
    updatedAt: String(''),
  }))
}
// Price utilities
export function getProductPrice(product: Product): {
  min: number
  max: number
} {
  const prices = product.variants.map((v) => v.price)
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  }
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'LKR',
  }).format(price)
}
