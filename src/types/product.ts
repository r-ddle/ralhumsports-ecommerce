export interface Brand {
  id: string
  name: string
  slug: string
  description?: string
  logo?: string
  website?: string
  featured: boolean
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  parentCategory?: string
  createdAt: string
  updatedAt: string
}

export interface ProductImage {
  id: string
  url: string
  alt: string
  width?: number
  height?: number
}

export interface ProductVariant {
  id: string
  name: string
  price: number
  compareAtPrice?: number
  sku: string
  inventory: number
  weight?: number
  size?: string
  color?: string
  options: Record<string, string> // e.g., { size: "Large", color: "Red" }
}

export interface Product {
  id: string
  title: string
  slug: string
  description: string
  shortDescription?: string
  brand: Brand
  categories: Category[]
  images: ProductImage[]
  variants: ProductVariant[]
  tags: string[]
  featured: boolean
  status: 'active' | 'draft' | 'archived'
  seo?: {
    title?: string
    description?: string
    keywords?: string[]
  }
  specifications?: Record<string, string>
  relatedProducts?: string[]
  createdAt: string
  updatedAt: string
  sku: string
}

export interface ProductFilters {
  brands?: string[]
  categories?: string[]
  priceRange?: {
    min: number
    max: number
  }
  inStock?: boolean
  featured?: boolean
  tags?: string[]
  search?: string
}

export interface ProductSort {
  field: 'title' | 'price' | 'createdAt' | 'updatedAt' | 'featured'
  direction: 'asc' | 'desc'
}

export interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface ProductsResponse {
  products: Product[]
  pagination: PaginationInfo
  filters: ProductFilters
  appliedSort: ProductSort
}
