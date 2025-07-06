import { useState, useEffect, useCallback } from 'react'
import { getProducts, getProduct, getCategories, getBrands, getProductFilters } from '@/lib/api'
import { ProductListItem, Product, Category, Brand, ProductQueryParams } from '@/types/api'

// Hook for product listing pages
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

  const fetchProducts = useCallback(
    async (newParams: ProductQueryParams = {}) => {
      try {
        setLoading(true)
        setError(null)

        const mergedParams = { ...params, ...newParams }
        const response = await getProducts(mergedParams)

        if (response.success) {
          setProducts(response.data)
          setPagination(response.pagination)
          setParams(mergedParams)
        } else {
          setError('Failed to fetch products')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    },
    [params],
  )

  const updateFilters = useCallback(
    (newParams: ProductQueryParams) => {
      fetchProducts({ ...newParams, page: 1 }) // Reset to first page when filtering
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

  // Initial fetch
  useEffect(() => {
    fetchProducts()
  }, [fetchProducts]) // Empty dependency array for initial fetch only

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
    refetch: fetchProducts,
  }
}

// Hook for single product pages
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
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await getProductFilters()
        setFilters(response)
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

  // Debounced search
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
    clearSearch: () => {
      setQuery('')
      setProducts([])
    },
  }
}
