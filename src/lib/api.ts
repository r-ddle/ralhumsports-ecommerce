import {
  ApiResponse,
  PaginatedResponse,
  Product,
  ProductListItem,
  ProductQueryParams,
  Category,
  Brand,
  Customer,
  CustomerInput,
  Order,
  OrderInput,
  OrderResponse,
  SearchResult,
  SearchParams,
  SKUVerificationResponse,
  OrderTrackingResponse,
} from '@/types/api'
import { useState } from 'react'

const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`

    // Add Next.js caching options
    const cacheOptions: RequestInit = {
      // Cache product listings for 1 minute
      ...(endpoint.includes('/products') &&
        !endpoint.includes('/products/') && {
          next: { revalidate: 60 },
        }),
      // Cache individual products for 5 minutes
      ...(endpoint.includes('/products/') && {
        next: { revalidate: 300 },
      }),
      // Cache categories and brands for 10 minutes
      ...(endpoint.includes('/categories') && {
        next: { revalidate: 600 },
      }),
      ...(endpoint.includes('/brands') && {
        next: { revalidate: 600 },
      }),
      // Cache filter metadata for 5 minutes
      ...(endpoint.includes('/filters-meta') && {
        next: { revalidate: 300 },
      }),
    }

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
      ...cacheOptions,
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error)
      throw error
    }
  }

  // Product API methods
  async getProducts(params: ProductQueryParams = {}): Promise<PaginatedResponse<ProductListItem>> {
    const searchParams = new URLSearchParams()

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString())
      }
    })

    const endpoint = `/api/public/products${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
    return this.request<PaginatedResponse<ProductListItem>>(endpoint)
  }

  async getProduct(slug: string): Promise<ApiResponse<Product>> {
    return this.request<ApiResponse<Product>>(`/api/public/products/${slug}`)
  }

  async getProductsByCategory(
    categorySlug: string,
    params: ProductQueryParams = {},
  ): Promise<PaginatedResponse<ProductListItem>> {
    return this.getProducts({ ...params, category: categorySlug })
  }

  async getProductsByBrand(
    brandSlug: string,
    params: ProductQueryParams = {},
  ): Promise<PaginatedResponse<ProductListItem>> {
    return this.getProducts({ ...params, brand: brandSlug })
  }

  async searchProducts(
    query: string,
    params: ProductQueryParams = {},
  ): Promise<PaginatedResponse<ProductListItem>> {
    return this.getProducts({ ...params, search: query })
  }

  // Category API methods
  async getCategories(): Promise<ApiResponse<Category[]>> {
    return this.request<ApiResponse<Category[]>>('/api/public/category')
  }

  async getFeaturedCategories(): Promise<ApiResponse<Category[]>> {
    const response = await this.getCategories()
    if (response.success && response.data) {
      const featuredCategories = response.data.filter((cat) => cat.isFeature)
      return { ...response, data: featuredCategories }
    }
    return response
  }

  async getNavigationCategories(): Promise<ApiResponse<Category[]>> {
    const response = await this.getCategories()
    if (response.success && response.data) {
      const navCategories = response.data.filter((cat) => cat.showInNavigation)
      return { ...response, data: navCategories }
    }
    return response
  }

  // Brand API methods
  async getBrands(): Promise<ApiResponse<Brand[]>> {
    return this.request<ApiResponse<Brand[]>>('/api/public/brands')
  }

  async getFeaturedBrands(): Promise<ApiResponse<Brand[]>> {
    const response = await this.getBrands()
    if (response.success && response.data) {
      const featuredBrands = response.data.filter((brand) => brand.isFeatured)
      return { ...response, data: featuredBrands }
    }
    return response
  }

  async getPremiumBrands(): Promise<ApiResponse<Brand[]>> {
    const response = await this.getBrands()
    if (response.success && response.data) {
      const premiumBrands = response.data.filter((brand) => brand.isPremium)
      return { ...response, data: premiumBrands }
    }
    return response
  }

  // Customer API methods
  async createOrUpdateCustomer(customerData: CustomerInput): Promise<ApiResponse<Customer>> {
    return this.request<ApiResponse<Customer>>('/api/customers', {
      method: 'POST',
      body: JSON.stringify(customerData),
    })
  }

  // Order API methods
  async createOrder(orderData: OrderInput): Promise<ApiResponse<OrderResponse>> {
    return this.request<ApiResponse<OrderResponse>>('/api/public/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    })
  }

  async getOrder(orderId: string): Promise<ApiResponse<Order>> {
    return this.request<ApiResponse<Order>>(`/api/public/orders/${orderId}`)
  }

  // Search API methods
  async search(params: SearchParams): Promise<ApiResponse<SearchResult>> {
    const searchParams = new URLSearchParams()

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString())
      }
    })

    return this.request<ApiResponse<SearchResult>>(`/api/public/search?${searchParams.toString()}`)
  }

  // Combined methods for complex operations
  async getProductFilters(): Promise<{
    categories: Category[]
    brands: Brand[]
    priceRange: { min: number; max: number }
  }> {
    const [categoriesResponse, brandsResponse, productsResponse] = await Promise.all([
      this.getCategories(),
      this.getBrands(),
      this.getProducts({ limit: 1000 }), // Get all products to calculate price range
    ])

    const categories = categoriesResponse.success ? categoriesResponse.data! : []
    const brands = brandsResponse.success ? brandsResponse.data! : []

    let priceRange = { min: 0, max: 0 }
    if (productsResponse.success && productsResponse.data.length > 0) {
      const prices = productsResponse.data.map((p) => p.price)
      priceRange = {
        min: Math.min(...prices),
        max: Math.max(...prices),
      }
    }

    return { categories, brands, priceRange }
  }

  async getRelatedProducts(
    productId: string,
    relatedProductIds: string[],
  ): Promise<ProductListItem[]> {
    if (relatedProductIds.length === 0) return []

    try {
      // For now, we'll get random products from the same category
      // In a real implementation, you'd want to fetch specific products by IDs
      const response = await this.getProducts({ limit: 4 })
      return response.success ? response.data.filter((p) => p.id.toString() !== productId) : []
    } catch (error) {
      console.error('Error fetching related products:', error)
      return []
    }
  }

  // Utility methods
  async getPopularProducts(limit: number = 8): Promise<ProductListItem[]> {
    try {
      const response = await this.getProducts({
        limit,
        sort: 'createdAt',
        order: 'desc',
      })
      return response.success ? response.data : []
    } catch (error) {
      console.error('Error fetching popular products:', error)
      return []
    }
  }

  async getFeaturedProducts(limit: number = 8): Promise<ProductListItem[]> {
    try {
      // Since we don't have a featured flag in products, we'll use newest products
      const response = await this.getProducts({
        limit,
        sort: 'createdAt',
        order: 'desc',
      })
      return response.success ? response.data : []
    } catch (error) {
      console.error('Error fetching featured products:', error)
      return []
    }
  }

  async getProductsByCategorySlug(
    categorySlug: string,
    limit: number = 8,
  ): Promise<ProductListItem[]> {
    try {
      const response = await this.getProductsByCategory(categorySlug, { limit })
      return response.success ? response.data : []
    } catch (error) {
      console.error('Error fetching products by category:', error)
      return []
    }
  }

  async getProductsByBrandSlug(brandSlug: string, limit: number = 8): Promise<ProductListItem[]> {
    try {
      const response = await this.getProductsByBrand(brandSlug, { limit })
      return response.success ? response.data : []
    } catch (error) {
      console.error('Error fetching products by brand:', error)
      return []
    }
  }

  async verifySKU(sku: string): Promise<ApiResponse<SKUVerificationResponse>> {
    return this.request<ApiResponse<SKUVerificationResponse>>('/api/public/products/verify-sku', {
      method: 'POST',
      body: JSON.stringify({ sku }),
    })
  }

  async trackOrder(
    orderNumber: string,
    email?: string,
    phone?: string,
  ): Promise<ApiResponse<OrderTrackingResponse>> {
    const params = new URLSearchParams({ orderNumber })
    if (email) params.append('email', email)
    if (phone) params.append('phone', phone)

    return this.request<ApiResponse<OrderTrackingResponse>>(`/api/public/orders/track?${params}`)
  }
}

// Create singleton instance
export const api = new ApiClient()

// Export individual functions for convenience
export const {
  getProducts,
  getProduct,
  getProductsByCategory,
  getProductsByBrand,
  searchProducts,
  getCategories,
  getFeaturedCategories,
  getNavigationCategories,
  getBrands,
  getFeaturedBrands,
  getPremiumBrands,
  createOrUpdateCustomer,
  createOrder,
  getOrder,
  search,
  getProductFilters,
  getRelatedProducts,
  getPopularProducts,
  getFeaturedProducts,
  getProductsByCategorySlug,
  getProductsByBrandSlug,
} = api

// Error handling utilities
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public details?: Record<string, unknown>, // ✅ Fix: Line 345
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export function isApiError(error: unknown): error is ApiError {
  // ✅ Fix: Line 357
  return error instanceof ApiError
}

export function handleApiError(error: unknown): string {
  if (isApiError(error)) {
    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'An unexpected error occurred'
}

// React hooks for common API operations
export function useApiError() {
  const [error, setError] = useState<string | null>(null)

  const handleError = (err: unknown) => {
    const message = handleApiError(err)
    setError(message)
    console.error('API Error:', err)
  }

  const clearError = () => setError(null)

  return { error, handleError, clearError }
}

// Helper function to build query parameters
export function buildQueryParams(
  params: Record<string, string | number | boolean | Array<string | number | boolean>>,
): string {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach((v) => searchParams.append(key, v.toString()))
      } else {
        searchParams.append(key, value.toString())
      }
    }
  })

  return searchParams.toString()
}

// Helper function to handle API responses
export function handleApiResponse<T>(response: ApiResponse<T>): T {
  if (!response.success) {
    throw new ApiError('API request failed')
  }

  if (response.data === undefined) {
    throw new ApiError('No data returned from API')
  }

  return response.data
}

// Helper function to handle paginated responses
export function handlePaginatedResponse<T>(response: PaginatedResponse<T>): {
  data: T[]
  pagination: PaginatedResponse<T>['pagination']
} {
  if (!response.success) {
    throw new ApiError('API request failed')
  }

  return {
    data: response.data,
    pagination: response.pagination,
  }
}

// Export default api client
export default api
