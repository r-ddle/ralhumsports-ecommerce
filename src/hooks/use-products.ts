import { useState, useEffect, useCallback, useRef } from 'react'
import { getProducts, getProduct, getCategories, getBrands } from '@/lib/api'
import { ProductListItem, Product, Category, Brand, ProductQueryParams } from '@/types/api'

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
const CACHE_KEY_PREFIX = 'ralhum_products_cache_'

interface CacheEntry<T> {
  data: T
  timestamp: number
}

// Helper to get/set cache
function getCachedData<T>(key: string): T | null {
  try {
    const cached = localStorage.getItem(key)
    if (!cached) return null

    const entry: CacheEntry<T> = JSON.parse(cached)
    const now = Date.now()

    if (now - entry.timestamp > CACHE_DURATION) {
      localStorage.removeItem(key)
      return null
    }

    return entry.data
  } catch {
    return null
  }
}

function setCachedData<T>(key: string, data: T): void {
  try {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
    }
    localStorage.setItem(key, JSON.stringify(entry))
  } catch (error) {
    // Silently fail if localStorage is full
    console.warn('Failed to cache data:', error)
  }
}

// Hook for product listing pages with caching
export function useProducts(initialParams: ProductQueryParams = {}) {
  const [products, setProducts] = useState<ProductListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    totalPages: 1,
    totalDocs: 0,
    hasNextPage: false,
    hasPrevPage: false,
  })
  const [params, setParams] = useState<ProductQueryParams>(initialParams)
  const abortControllerRef = useRef<AbortController | null>(null)

  const fetchProducts = useCallback(
    async (newParams: ProductQueryParams = {}, forceRefresh = false) => {
      try {
        // Cancel previous request if any
        if (abortControllerRef.current) {
          abortControllerRef.current.abort()
        }

        abortControllerRef.current = new AbortController()

        setLoading(true)
        setError(null)

        const mergedParams = { ...params, ...newParams }
        const cacheKey = `${CACHE_KEY_PREFIX}${JSON.stringify(mergedParams)}`

        // Check cache first
        if (!forceRefresh) {
          const cachedResponse = getCachedData<{
            products: ProductListItem[]
            pagination: typeof pagination
          }>(cacheKey)

          if (cachedResponse) {
            setProducts(cachedResponse.products)
            setPagination(cachedResponse.pagination)
            setParams(mergedParams)
            setLoading(false)
            return
          }
        }

        const response = await getProducts(mergedParams)

        if (response.success) {
          setProducts(response.data)
          setPagination(response.pagination)
          setParams(mergedParams)

          // Cache the response
          setCachedData(cacheKey, {
            products: response.data,
            pagination: response.pagination,
          })
        } else {
          setError('Failed to fetch products')
        }
      } catch (err: unknown) {
        if ((err as any)?.name !== 'AbortError') {
          setError(err instanceof Error ? err.message : 'An error occurred')
        }
      } finally {
        setLoading(false)
      }
    },
    [params],
  )

  const updateFilters = useCallback(
    (newParams: ProductQueryParams) => {
      fetchProducts({ ...newParams, page: 1 })
    },
    [fetchProducts],
  )

  const changePage = useCallback(
    (page: number) => {
      fetchProducts({ page })
    },
    [fetchProducts],
  )

  const changeSort = useCallback(
    (sort: 'name' | 'price' | 'createdAt' | 'updatedAt' | undefined, order: 'asc' | 'desc') => {
      fetchProducts({ sort, order, page: 1 })
    },
    [fetchProducts],
  )

  const search = useCallback(
    (query: string) => {
      fetchProducts({ search: query, page: 1 })
    },
    [fetchProducts],
  )

  const clearFilters = useCallback(() => {
    fetchProducts({
      page: 1,
      limit: params.limit,
      sort: 'createdAt',
      order: 'desc',
    })
  }, [fetchProducts, params.limit])

  const clearCache = useCallback(() => {
    // Clear all product cache entries
    const keys = Object.keys(localStorage)
    keys.forEach((key) => {
      if (key.startsWith(CACHE_KEY_PREFIX)) {
        localStorage.removeItem(key)
      }
    })
  }, [])

  // Initial fetch
  useEffect(() => {
    fetchProducts()

    // Cleanup on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, []) // Empty dependency array for initial fetch only

  return {
    products,
    loading,
    error,
    pagination,
    params,
    updateFilters,
    changePage,
    changeSort,
    search,
    clearFilters,
    refetch: (forceRefresh = true) => fetchProducts(params, forceRefresh),
    clearCache,
  }
}

// The rest of the hooks remain the same...
export function useProduct(slug: string) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return

    const fetchProduct = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await getProduct(slug)

        if (response.success) {
          setProduct(response.data!)
        } else {
          setError(response.error || 'Product not found')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [slug])

  return { product, loading, error }
}

// Hook for categories
export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await getCategories()

        if (response.success) {
          setCategories(response.data!)
        } else {
          setError(response.error || 'Failed to fetch categories')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return { categories, loading, error }
}

// Hook for brands
export function useBrands() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await getBrands()

        if (response.success) {
          setBrands(response.data!)
        } else {
          setError(response.error || 'Failed to fetch brands')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchBrands()
  }, [])

  return { brands, loading, error }
}

// Hook for product filters (categories, brands, price range)
export function useProductFilters() {
  const [filters, setFilters] = useState({
    categories: [] as Category[],
    brands: [] as Brand[],
    priceRange: { min: 0, max: 0 },
    totalProducts: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        setLoading(true)
        setError(null)

        // Use the optimized endpoint
        const response = await fetch('/api/products/filters-meta')
        const data = await response.json()

        if (data.success && data.data) {
          setFilters({
            categories: data.data.categories,
            brands: data.data.brands,
            priceRange: data.data.priceRange,
            totalProducts: data.data.totalProducts,
          })
        } else {
          setError('Failed to fetch filter metadata')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchFilters()
  }, [])

  return { filters, loading, error }
}

// Hook for product search with debouncing
export function useProductSearch(delay: number = 300) {
  const [query, setQuery] = useState('')
  const [products, setProducts] = useState<ProductListItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchProducts = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setProducts([])
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await getProducts({ search: searchQuery, limit: 10 })

      if (response.success) {
        setProducts(response.data)
      } else {
        setError('Search failed')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      searchProducts(query)
    }, delay)

    return () => clearTimeout(timer)
  }, [query, delay, searchProducts])

  return {
    query,
    setQuery,
    products,
    loading,
    error,
  }
}
