'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { ProductCard } from '@/components/product-card'
import { EnhancedProductFilters as FiltersComponent } from '@/components/product-filters'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ProductCardSkeleton, ProductListSkeleton } from '@/components/ui/lazy-image'
import {
  Grid3X3,
  List,
  Package,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { ProductListItem, Category as ApiCategory, Brand as ApiBrand } from '@/types/api'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams } from 'next/navigation'

// Type adapters for ProductFilters component
interface FilterCategory {
  id: string | number
  name: string
  slug: string
  productCount: number
  type: 'sports-category' | 'sports' | 'sports-item'
  level: number
  fullPath?: string
  parentCategory?: {
    id: string | number
    name: string
    slug: string
    type: string
  } | null
}

interface FilterBrand {
  id: string | number
  name: string
  slug: string
  productCount: number
  image?: {
    url: string
    alt: string
  } | null
  description?: string
}

interface FilterHierarchicalCategories {
  sportsCategories: FilterCategory[]
  sports: FilterCategory[]
  sportsItems: FilterCategory[]
}

// Helper functions to convert API types to filter component types
const convertApiCategoryToFilterCategory = (apiCategory: ApiCategory): FilterCategory => ({
  id: apiCategory.id,
  name: apiCategory.name,
  slug: apiCategory.slug,
  productCount: apiCategory.productCount,
  type: 'sports-category', // Default type, should be determined by API
  level: 0, // Default level, should be determined by API
  fullPath: `/${apiCategory.slug}`,
  parentCategory: null,
})

const convertApiBrandToFilterBrand = (apiBrand: ApiBrand): FilterBrand => ({
  id: apiBrand.id,
  name: apiBrand.name,
  slug: apiBrand.slug,
  productCount: 0, // This should come from API
  image: apiBrand.logo
    ? {
        url: apiBrand.logo.url,
        alt: apiBrand.logo.alt || `${apiBrand.name} logo`,
      }
    : null,
  description: apiBrand.description,
})

const convertHierarchicalCategories = (hierarchical: any): FilterHierarchicalCategories => ({
  sportsCategories: (hierarchical?.sportsCategories || []).map(convertApiCategoryToFilterCategory),
  sports: (hierarchical?.sports || []).map(convertApiCategoryToFilterCategory),
  sportsItems: (hierarchical?.sportsItems || []).map(convertApiCategoryToFilterCategory),
})

interface ProductFilters {
  categories: FilterCategory[]
  hierarchicalCategories: FilterHierarchicalCategories
  brands: FilterBrand[]
  priceRange: { min: number; max: number }
}

interface ProductQueryParams {
  page?: number
  limit?: number
  search?: string
  categories?: string[]
  brands?: string[]
  sort?: 'name' | 'createdAt' | 'updatedAt' | 'price'
  order?: 'asc' | 'desc'
  status?: 'active' | 'inactive' | 'draft' | 'out-of-stock' | 'discontinued'
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  // Hierarchical category filters
  sportsCategory?: string
  sport?: string
  sportsItem?: string
}

export default function StorePage() {
  const searchParams = useSearchParams()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [products, setProducts] = useState<ProductListItem[]>([])
  const [filterOptions, setFilterOptions] = useState<ProductFilters>({
    categories: [],
    hierarchicalCategories: {
      sportsCategories: [],
      sports: [],
      sportsItems: [],
    },
    brands: [],
    priceRange: { min: 0, max: 100000 }, // Default range
  })
  const [loading, setLoading] = useState(true)
  const [filtersLoading, setFiltersLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 24,
    totalPages: 1,
    totalDocs: 0,
    hasNextPage: false,
    hasPrevPage: false,
  })
  const [currentFilters, setCurrentFilters] = useState<ProductQueryParams>({
    page: 1,
    limit: 24,
    sort: 'createdAt',
    order: 'desc',
    status: 'active',
  })

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Read URL parameters and sync with currentFilters
  useEffect(() => {
    const urlFilters: ProductQueryParams = {
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '24'),
      sort: (searchParams.get('sort') as any) || 'createdAt',
      order: (searchParams.get('order') as any) || 'desc',
      status: 'active',
    }

    // Handle search
    const search = searchParams.get('search')
    if (search) urlFilters.search = search

    // Handle hierarchical categories (keep them separate, don't merge into categories array)
    const sportsCategory = searchParams.get('sportsCategory')
    const sport = searchParams.get('sport')
    const sportsItem = searchParams.get('sportsItem')

    if (sportsCategory) urlFilters.sportsCategory = sportsCategory
    if (sport) urlFilters.sport = sport
    if (sportsItem) urlFilters.sportsItem = sportsItem

    // Handle legacy categories array (only if no hierarchical filters)
    if (!sportsCategory && !sport && !sportsItem) {
      const categories = searchParams.get('categories')
      if (categories) {
        urlFilters.categories = categories.split(',')
      }
    }

    // Handle brands (support both 'brand' and 'brands' parameters)
    const brands = [...searchParams.getAll('brand'), ...searchParams.getAll('brands')].filter(
      Boolean,
    )
    if (brands.length > 0) {
      urlFilters.brands = brands
    }

    // Handle price range
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    if (minPrice) urlFilters.minPrice = parseInt(minPrice)
    if (maxPrice) urlFilters.maxPrice = parseInt(maxPrice)

    // Handle stock filter
    const inStock = searchParams.get('inStock')
    if (inStock === 'true') urlFilters.inStock = true

    setCurrentFilters(urlFilters)
  }, [searchParams])

  const getDisplayPrice = (
    product: ProductListItem & { variants?: Array<{ price: number }> },
  ): number => {
    if (product.variants && product.variants.length > 0) {
      return Math.min(...product.variants.map((v) => v.price))
    }
    return product.price
  }

  const fetchFilterOptions = useCallback(async () => {
    try {
      setFiltersLoading(true)
      const response = await fetch('/api/public/filters-meta')
      if (!response.ok) throw new Error('Failed to fetch filter options')
      const data = await response.json()
      if (data.success && data.data) {
        setFilterOptions({
          categories: (data.data.categories || []).map(convertApiCategoryToFilterCategory),
          hierarchicalCategories: convertHierarchicalCategories(data.data.hierarchicalCategories),
          brands: (data.data.brands || []).map(convertApiBrandToFilterBrand),
          priceRange: data.data.priceRange || { min: 0, max: 100000 },
        })
      }
    } catch (err) {
      console.error('Error fetching filter options:', err)
    } finally {
      setFiltersLoading(false)
    }
  }, [])

  const handleFiltersChange = (filters: Partial<ProductQueryParams>) => {
    setCurrentFilters((prev) => ({
      ...prev,
      ...filters,
      page: 1,
    }))
  }

  const handleSortChange = (sort: string, order: string) => {
    setCurrentFilters((prev) => ({
      ...prev,
      sort: sort as any,
      order: order as any,
      page: 1,
    }))
  }

  const handleResetFilters = () => {
    // Reset URL to trigger filter component reset
    window.history.pushState({}, '', '/products')

    setCurrentFilters({
      page: 1,
      limit: 24,
      sort: 'createdAt',
      order: 'desc',
      status: 'active',
    })
  }

  const handlePageChange = (page: number) => {
    if (page < 1 || page > pagination.totalPages) return
    setCurrentFilters((prev) => ({ ...prev, page }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    fetchFilterOptions()
  }, [fetchFilterOptions])

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      setError(null)
      const params = new URLSearchParams()

      Object.entries(currentFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            // Handle arrays - use singular form for URLSearchParams
            const paramKey = key === 'brands' ? 'brand' : key === 'categories' ? 'category' : key
            value.forEach((v) => params.append(paramKey, v.toString()))
          } else {
            params.append(key, value.toString())
          }
        }
      })

      try {
        const response = await fetch(`/api/public/products?${params.toString()}`)
        if (!response.ok) throw new Error('Failed to fetch products')

        const data = await response.json()
        if (data.success) {
          const products = data.data || []
          setProducts(products)
          setPagination({
            page: data.pagination?.page || 1,
            limit: data.pagination?.limit || 24,
            totalPages: data.pagination?.totalPages || 1,
            totalDocs: data.pagination?.totalDocs || 0,
            hasNextPage: data.pagination?.hasNextPage || false,
            hasPrevPage: data.pagination?.hasPrevPage || false,
          })
        } else {
          setError(data.error || 'Failed to load products')
        }
      } catch (err) {
        console.error('Error fetching products:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [currentFilters])

  const activeFiltersCount = useMemo(() => {
    return Object.entries(currentFilters).filter(([key, value]) => {
      if (
        key === 'page' ||
        key === 'limit' ||
        key === 'sort' ||
        key === 'order' ||
        key === 'status'
      )
        return false
      if (Array.isArray(value)) return value.length > 0
      return !!value
    }).length
  }, [currentFilters])

  if (error) {
    return (
      <main className="min-h-screen pt-16 bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen pt-16 bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-text-primary mb-2">
                Sports Products
                <Sparkles className="inline-block w-6 h-6 sm:w-8 sm:h-8 ml-2 text-brand-primary" />
              </h1>
              <p className="text-text-secondary text-sm sm:text-base">
                Discover premium sports equipment and gear
              </p>
            </div>

            {/* Mobile Filter Toggle */}
            <div className="flex items-center gap-2 sm:hidden">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Mobile Filters Overlay */}
          {showFilters && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)} />
              <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white p-4 overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                    ×
                  </Button>
                </div>
                <FiltersComponent
                  categories={filterOptions.categories}
                  hierarchicalCategories={filterOptions.hierarchicalCategories}
                  brands={filterOptions.brands}
                  priceRange={filterOptions.priceRange}
                  loading={filtersLoading}
                  onApplyFilters={() => setShowFilters(false)}
                />
              </div>
            </div>
          )}

          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <FiltersComponent
              categories={filterOptions.categories}
              hierarchicalCategories={filterOptions.hierarchicalCategories}
              brands={filterOptions.brands}
              priceRange={filterOptions.priceRange}
              loading={filtersLoading}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Results Header */}
            <Card className="mb-4 sm:mb-6">
              <CardContent className="p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <p className="text-sm text-text-secondary">
                      {loading ? (
                        'Loading products...'
                      ) : (
                        <>
                          Showing {products.length} of {pagination.totalDocs} products
                          {activeFiltersCount > 0 && ` (${activeFiltersCount} filters applied)`}
                        </>
                      )}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* View Mode Toggle - Hidden on mobile */}
                    <div className="hidden sm:flex items-center gap-1 mr-2">
                      <Button
                        variant={viewMode === 'grid' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('grid')}
                        className="h-8 w-8 p-0"
                      >
                        <Grid3X3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={viewMode === 'list' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('list')}
                        className="h-8 w-8 p-0"
                      >
                        <List className="h-4 w-4" />
                      </Button>
                    </div>

                    {activeFiltersCount > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleResetFilters}
                        className="text-xs"
                      >
                        Clear All
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Products Grid with Enhanced Mobile Layout */}
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`grid gap-3 sm:gap-4 lg:gap-6 ${
                    viewMode === 'grid'
                      ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4' // Enhanced mobile: 2 columns on mobile, 3 on tablet, 4 on desktop
                      : 'grid-cols-1'
                  }`}
                >
                  {Array.from({ length: 12 }).map((_, i) => (
                    <ProductCardSkeleton key={i} />
                  ))}
                </motion.div>
              ) : products.length > 0 ? (
                <motion.div
                  key="products"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`grid gap-3 sm:gap-4 lg:gap-6 ${
                    viewMode === 'grid'
                      ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4' // Enhanced mobile: 2 columns on mobile, 3 on tablet, 4 on desktop
                      : 'grid-cols-1'
                  }`}
                >
                  {products.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                      className="h-full" // Ensure consistent height
                    >
                      <ProductCard
                        product={product}
                        variant={viewMode}
                        showBrand={true}
                        showCategory={true}
                        className="h-full"
                      />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-12"
                >
                  <Package className="w-16 h-16 text-text-secondary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    No products found
                  </h3>
                  <p className="text-text-secondary mb-6">
                    Try adjusting your filters or search terms
                  </p>
                  <Button onClick={handleResetFilters} variant="outline">
                    Reset Filters
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pagination */}
            {!loading && pagination.totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center justify-between gap-4"
              >
                <div className="text-sm text-text-secondary">
                  Page {pagination.page} of {pagination.totalPages}
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={!pagination.hasPrevPage}
                    className="h-9 px-3"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">Previous</span>
                    <span className="sm:hidden">Prev</span>
                  </Button>
                  <div className="flex items-center gap-1 mx-2">
                    {/* Simplified pagination for mobile */}
                    {Array.from({ length: Math.min(3, pagination.totalPages) }).map((_, i) => {
                      let page = i + 1
                      // Center current page
                      if (pagination.page > 2 && pagination.totalPages > 3) {
                        page = pagination.page - 1 + i
                      }
                      if (page > pagination.totalPages) return null
                      return (
                        <Button
                          key={page}
                          variant={page === pagination.page ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                          className="h-9 w-9 p-0"
                        >
                          {page}
                        </Button>
                      )
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={!pagination.hasNextPage}
                    className="h-9 px-3"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <span className="sm:hidden">Next</span>
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
