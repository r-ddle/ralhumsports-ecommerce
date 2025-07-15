'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { ProductCard } from '@/components/product-card'
import { ProductFilters as FiltersComponent } from '@/components/product-filters'
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
import { ProductListItem, Category, Brand } from '@/types/api'
import { motion, AnimatePresence } from 'framer-motion'

interface ProductFilters {
  categories: Category[]
  brands: Brand[]
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
}

export default function StorePage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [products, setProducts] = useState<ProductListItem[]>([])
  const [filterOptions, setFilterOptions] = useState<ProductFilters>({
    categories: [],
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
      const response = await fetch('/api/public/products/filters-meta')
      if (!response.ok) throw new Error('Failed to fetch filter options')
      const data = await response.json()
      if (data.success && data.data) {
        setFilterOptions({
          categories: data.data.categories || [],
          brands: data.data.brands || [],
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
    setCurrentFilters((prev) => ({
      page: 1,
      limit: prev.limit,
      sort: 'createdAt',
      order: 'desc',
      status: 'active',
    }))
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
        if (value === undefined || value === null || value === '') return
        // Special handling for categories/brands arrays
        if (key === 'categories' && Array.isArray(value)) {
          value.forEach((v) => params.append('category', v))
        } else if (key === 'brands' && Array.isArray(value)) {
          value.forEach((v) => params.append('brand', v))
        } else if (Array.isArray(value)) {
          value.forEach((v) => params.append(key, v))
        } else {
          params.append(key, String(value))
        }
      })

      try {
        const response = await fetch(`/api/public/products?${params.toString()}`)
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
        const data = await response.json()

        if (data.success && data.data) {
          const productsWithDisplayPrice = data.data.map((product: any) => ({
            ...product,
            _displayPrice: getDisplayPrice(product),
          }))
          setProducts(productsWithDisplayPrice)
          setPagination(data.pagination)
        } else {
          throw new Error(data.error || 'Failed to load products')
        }
      } catch (err: any) {
        console.error('Error fetching products:', err)
        setError(err.message)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [currentFilters])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const gridClasses = useMemo(() => {
    return viewMode === 'list'
      ? 'grid-cols-1'
      : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4'
  }, [viewMode])

  const activeFiltersCount = useMemo(() => {
    const { search, categories, brands, minPrice, maxPrice, inStock } = currentFilters
    return [search, categories?.length, brands?.length, minPrice, maxPrice, inStock].filter(Boolean)
      .length
  }, [currentFilters])

  return (
    <main className="min-h-screen pt-8 mt-5 bg-brand-background">
      <section className="relative py-8 sm:py-12 overflow-hidden bg-brand-background">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-1/4 left-1/6 w-72 h-72 bg-gradient-to-br from-brand-secondary/10 to-brand-primary/10 rounded-full blur-3xl"
            animate={
              prefersReducedMotion
                ? {}
                : { scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3], x: [0, 30, 0], y: [0, -20, 0] }
            }
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-br from-brand-accent/10 to-brand-primary/10 rounded-full blur-3xl"
            animate={
              prefersReducedMotion
                ? {}
                : { scale: [1, 0.8, 1], opacity: [0.4, 0.7, 0.4], x: [0, -40, 0], y: [0, 30, 0] }
            }
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          />
        </div>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm mb-6 bg-brand-accent text-white shadow-lg"
            >
              <Sparkles className="w-4 h-4" />
              PREMIUM SPORTS STORE
            </motion.div>
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 leading-tight"
            >
              <span className="text-text-primary">PROFESSIONAL</span>
              <span className="block bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">
                SPORTS EQUIPMENT
              </span>
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg md:text-xl text-text-secondary max-w-3xl mx-auto mb-6 sm:mb-8 leading-relaxed"
            >
              Discover hundreds of premium sports products from world-renowned brands. From
              professional athletes to weekend warriors, find everything you need to excel.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-brand-background">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="mb-6"
              >
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col lg:flex-row gap-8">
            <motion.aside
              className={`lg:w-80 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="sticky top-24">
                <Card className="bg-brand-surface border-brand-border shadow-xl">
                  <FiltersComponent
                    categories={filterOptions.categories}
                    brands={filterOptions.brands}
                    priceRange={filterOptions.priceRange}
                    currentFilters={currentFilters}
                    onFiltersChange={handleFiltersChange}
                    onSortChange={handleSortChange}
                    onReset={handleResetFilters}
                    isOpen={
                      showFilters || (typeof window !== 'undefined' && window.innerWidth >= 1024)
                    }
                    onToggle={() => setShowFilters(!showFilters)}
                    loading={filtersLoading}
                  />
                </Card>
              </div>
            </motion.aside>

            <div className="flex-1">
              <Card className="mb-6 bg-brand-surface border-brand-border shadow-lg">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      {!loading && pagination.totalDocs > 0 && (
                        <p className="text-sm text-text-secondary font-medium">
                          Showing {(pagination.page - 1) * pagination.limit + 1}-
                          {Math.min(pagination.page * pagination.limit, pagination.totalDocs)} of{' '}
                          <span className="font-bold text-text-primary">
                            {pagination.totalDocs}
                          </span>{' '}
                          products
                        </p>
                      )}
                      {activeFiltersCount > 0 && (
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''} active
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleResetFilters}
                            className="text-xs h-6 px-2"
                          >
                            Clear all
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowFilters(!showFilters)}
                        className="lg:hidden"
                      >
                        <SlidersHorizontal className="w-4 h-4 mr-2" />
                        Filters
                        {activeFiltersCount > 0 && (
                          <Badge variant="secondary" className="ml-1 text-xs h-4 px-1">
                            {activeFiltersCount}
                          </Badge>
                        )}
                      </Button>
                      <Separator orientation="vertical" className="h-6" />
                      <div className="flex items-center border border-brand-border rounded-lg p-1">
                        <Button
                          variant={viewMode === 'grid' ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setViewMode('grid')}
                          className="h-7 px-2"
                        >
                          <Grid3X3 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant={viewMode === 'list' ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setViewMode('list')}
                          className="h-7 px-2"
                        >
                          <List className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`grid gap-4 ${gridClasses}`}
                  >
                    {Array.from({ length: pagination.limit }).map((_, i) =>
                      viewMode === 'grid' ? (
                        <ProductCardSkeleton key={i} />
                      ) : (
                        <ProductListSkeleton key={i} />
                      ),
                    )}
                  </motion.div>
                ) : products.length > 0 ? (
                  <motion.div
                    key="products"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`grid gap-4 sm:gap-6 ${gridClasses}`}
                  >
                    {products.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                      >
                        <ProductCard
                          product={{ ...product, price: product.price ?? product.price }}
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

              {!loading && pagination.totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4"
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
                      Previous
                    </Button>
                    <div className="flex items-center gap-1 mx-2">
                      {/* Pagination logic can be improved, but is functional */}
                      {Array.from({ length: Math.min(5, pagination.totalPages) }).map((_, i) => {
                        let page = i + 1
                        // Basic logic to center current page
                        if (pagination.page > 3 && pagination.totalPages > 5) {
                          page = pagination.page - 2 + i
                        }
                        if (page > pagination.totalPages) return null
                        return (
                          <Button
                            key={page}
                            variant={page === pagination.page ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handlePageChange(page)}
                            className="h-9 w-9"
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
                      Next
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 text-sm">
                    <span className="text-text-secondary">Go to page:</span>
                    <input
                      type="number"
                      min={1}
                      max={pagination.totalPages}
                      defaultValue={pagination.page}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const page = parseInt((e.target as HTMLInputElement).value)
                          if (page >= 1 && page <= pagination.totalPages) handlePageChange(page)
                        }
                      }}
                      className="w-16 h-8 px-2 text-center border border-brand-border rounded bg-brand-surface"
                    />
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
