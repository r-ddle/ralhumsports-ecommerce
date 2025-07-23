<<<<<<< HEAD
// Export createProduct as named export for static import compatibility
// Create a new product via PayloadCMS API
export async function createProduct(productData: Partial<Product>): Promise<Product> {
  // Map frontend Product type to PayloadCMS expected format
  const payload = {
    name: productData.title,
    slug: productData.slug,
    description: productData.description,
    seo: productData.seo,
    brand: productData.brand?.id,
    categories: productData.categories?.map((cat) => cat.id),
    price: productData.variants?.[0]?.price,
    sku: productData.sku,
    stock: productData.variants?.[0]?.inventory,
    images: productData.images?.map((img) => ({ image: img.id, altText: img.alt })),
    specifications: productData.specifications,
    status: productData.status,
    tags: productData.tags?.join(','),
    featured: productData.featured,
  }
  const response = await api.createProduct(payload)
  if (!response.success || !response.data) {
    throw new Error('Failed to create product')
  }
  return transformPayloadProduct(response.data)
}
=======
>>>>>>> parent of eca111b (Add admin dashboard and login pages)
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
  const images =
    payloadProduct.images?.map((img) => ({
      id: typeof img.image === 'object' ? String(img.image.id) : String(img.image),
      url: typeof img.image === 'object' ? img.image.url || '' : '',
      alt: img.altText || payloadProduct.name,
    })) || []

<<<<<<< HEAD
  // Accept both PayloadCMS and API product shapes
  let brand: Brand = {
    id: '',
    name: '',
    slug: '',
    description: undefined,
    logo: undefined,
    website: undefined,
    featured: false,
    createdAt: '',
    updatedAt: '',
  }
  if (payloadProduct.brand) {
    if (typeof payloadProduct.brand === 'object') {
      // API ProductBrand or Payload Brand
      brand = {
        id: String((payloadProduct.brand as any).id ?? payloadProduct.brand),
        name: (payloadProduct.brand as any).name ?? '',
        slug: (payloadProduct.brand as any).slug ?? '',
        description: (payloadProduct.brand as any).description ?? undefined,
        logo:
          typeof (payloadProduct.brand as any).logo === 'object' &&
          (payloadProduct.brand as any).logo !== null
            ? ((payloadProduct.brand as any).logo.url ?? undefined)
            : typeof (payloadProduct.brand as any).logo === 'string'
              ? (payloadProduct.brand as any).logo
              : undefined,
        website: (payloadProduct.brand as any).website ?? undefined,
        featured: !!(
          (payloadProduct.brand as any).isFeatured ?? (payloadProduct.brand as any).featured
        ),
        createdAt: (payloadProduct.brand as any).createdAt ?? '',
        updatedAt: (payloadProduct.brand as any).updatedAt ?? '',
      }
    } else if (
      typeof payloadProduct.brand === 'string' ||
      typeof payloadProduct.brand === 'number'
    ) {
      brand.id = String(payloadProduct.brand)
    }
  }

  // Use categories array if available, else empty
  // Fallback: use single category if available, else empty array
  let categories: Category[] = []
  if (Array.isArray((payloadProduct as any).categories)) {
    categories = (payloadProduct as any).categories.map((cat: any) => ({
      id: String(cat.id),
      name: cat.name,
      slug: cat.slug,
      description: cat.description || undefined,
      image: typeof cat.image === 'object' ? (cat.image?.url ?? undefined) : undefined,
      parentCategory: cat.parentCategory || undefined,
      createdAt: cat.createdAt,
      updatedAt: cat.updatedAt,
    }))
  } else if ((payloadProduct as any).category) {
    const cat = (payloadProduct as any).category
    categories = [
      {
        id: String(cat.id),
        name: cat.name,
        slug: cat.slug,
        description: cat.description || undefined,
        image: typeof cat.image === 'object' ? (cat.image?.url ?? undefined) : undefined,
        parentCategory: cat.parentCategory || undefined,
        createdAt: cat.createdAt,
        updatedAt: cat.updatedAt,
      },
    ]
  }
=======
  const brand = typeof payloadProduct.brand === 'object' ? payloadProduct.brand : null
  const category = typeof payloadProduct.category === 'object' ? payloadProduct.category : null
>>>>>>> parent of eca111b (Add admin dashboard and login pages)

  return {
    id: String(payloadProduct.id),
    title: payloadProduct.name,
    slug: payloadProduct.slug ?? '',
    description: typeof payloadProduct.description === 'string' ? payloadProduct.description : '',
    shortDescription: payloadProduct.seo?.description || '',
    brand: brand
      ? {
          id: String(brand.id),
          name: brand.name,
          slug: brand.slug,
          description: brand.description || undefined,
          logo: typeof brand.logo === 'object' ? (brand.logo.url ?? undefined) : undefined,
          website: brand.website || undefined,
          featured: brand.isFeatured || false,
          createdAt: brand.createdAt,
          updatedAt: brand.updatedAt,
        }
      : ({} as Brand),
    categories: category
      ? [
          {
            id: String(category.id),
            name: category.name,
            slug: category.slug,
            description: category.description || undefined,
            image:
              typeof category.image === 'object' ? (category.image?.url ?? undefined) : undefined,
            parentCategory: category.parentCategory || undefined,
            createdAt: category.createdAt,
            updatedAt: category.updatedAt,
          },
        ]
      : [],
    images,
    variants: [
      {
        id: '1',
        name: 'Default',
        price: payloadProduct.price,
        compareAtPrice: payloadProduct.pricing?.originalPrice || undefined,
        sku: payloadProduct.sku ?? '',
        inventory: payloadProduct.stock || 0,
        weight:
          payloadProduct.specifications?.weight !== undefined
            ? Number(payloadProduct.specifications.weight)
            : undefined,
        options: {},
      },
    ],
    tags: payloadProduct.tags?.split(',').map((t) => t.trim()) || [],
    status:
      payloadProduct.status === 'active'
        ? 'active'
        : payloadProduct.status === 'draft'
          ? 'draft'
          : 'archived',
    seo: payloadProduct.seo
      ? {
          title: payloadProduct.seo.title || undefined,
          description: payloadProduct.seo.description || undefined,
        }
      : undefined,
    specifications: payloadProduct.specifications
      ? {
          material: payloadProduct.specifications.material ?? '',
          weight: payloadProduct.specifications.weight ?? '',
          dimensions: payloadProduct.specifications.dimensions ?? '',
          careInstructions: payloadProduct.specifications.careInstructions ?? '',
        }
      : undefined,
    createdAt: payloadProduct.createdAt,
    updatedAt: payloadProduct.updatedAt,
    sku: payloadProduct.sku ?? '',
    featured: !!payloadProduct.features, // Add this line to fix the error
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
