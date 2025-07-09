'use client'

import { useState, useEffect, useCallback } from 'react'
import { ProductCard } from '@/components/product-card'
import { ProductFilters as FiltersComponent } from '@/components/product-filters'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Grid3X3,
  List,
  Filter,
  Package,
  Star,
  TrendingUp,
  Zap,
  AlertCircle,
  ChevronDown,
} from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { ProductListItem, Category, Brand } from '@/types/api'
import Link from 'next/link'

interface ProductFilters {
  categories: Category[]
  brands: Brand[]
  priceRange: { min: number; max: number }
}

interface ProductQueryParams {
  page?: number
  limit?: number
  search?: string
  category?: string
  brand?: string
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
    priceRange: { min: 0, max: 0 },
  })
  const [loading, setLoading] = useState(true)
  const [filtersLoading, setFiltersLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    totalPages: 1,
    totalDocs: 0,
    hasNextPage: false,
    hasPrevPage: false,
  })
  const [currentFilters, setCurrentFilters] = useState<ProductQueryParams>({
    page: 1,
    limit: 12,
    sort: 'createdAt',
    order: 'desc',
    status: 'active',
  })

  // Helper: get lowest variant price (if variants exist)
  // Patch: allow variant price display if present in any (unknown) product object
  function getDisplayPrice(
    product: ProductListItem & { variants?: Array<{ price: number }> },
  ): number {
    if (product.variants && product.variants.length > 0) {
      return Math.min(...product.variants.map((v) => v.price))
    }
    return product.price
  }

  // Fetch products
  const fetchProducts = useCallback(
    async (filters: ProductQueryParams = currentFilters) => {
      try {
        setLoading(true)
        setError(null)

        const params = new URLSearchParams()
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.append(key, value.toString())
          }
        })

        const response = await fetch(`/api/products?${params}`)
        const data = await response.json()

        if (data.success) {
          // Patch: attach _displayPrice (not typed) to each product
          const patched = data.data.map(
            (p: ProductListItem & { variants?: { price: number }[] }) => ({
              ...p,
              _displayPrice: getDisplayPrice(p),
            }),
          )
          setProducts(patched)
          setPagination(data.pagination)
        } else {
          setError(data.error || 'Failed to fetch products')
        }
      } catch (err) {
        setError('Failed to fetch products')
        console.error('Products fetch error:', err)
      } finally {
        setLoading(false)
      }
    },
    [currentFilters],
  )

  // Fetch filter options
  const fetchFilterOptions = useCallback(async () => {
    try {
      setFiltersLoading(true)

      // Use the optimized endpoint
      const response = await fetch('/api/products/filters-meta')
      const data = await response.json()

      if (data.success && data.data) {
        setFilterOptions({
          categories: data.data.categories,
          brands: data.data.brands,
          priceRange: data.data.priceRange,
        })
      }
    } catch (err) {
      console.error('Filter options fetch error:', err)
    } finally {
      setFiltersLoading(false)
    }
  }, [])

  // Initial data fetch
  useEffect(() => {
    fetchProducts()
    fetchFilterOptions()
  }, [fetchProducts, fetchFilterOptions])

  const handleFiltersChange = (newFilters: ProductQueryParams) => {
    const updatedFilters = { ...currentFilters, ...newFilters, page: 1 }
    setCurrentFilters(updatedFilters)
    fetchProducts(updatedFilters)
  }

  const handleSortChange = (
    sortField: 'name' | 'createdAt' | 'updatedAt' | 'price',
    sortOrder: 'asc' | 'desc',
  ) => {
    const updatedFilters = { ...currentFilters, sort: sortField, order: sortOrder, page: 1 }
    setCurrentFilters(updatedFilters)
    fetchProducts(updatedFilters)
  }

  const handleSearchChange = (query: string) => {
    const updatedFilters = { ...currentFilters, search: query, page: 1 }
    setCurrentFilters(updatedFilters)
    fetchProducts(updatedFilters)
  }

  const handleResetFilters = () => {
    const resetFilters: ProductQueryParams = {
      page: 1,
      limit: 12,
      sort: 'createdAt',
      order: 'desc',
      status: 'active',
    }
    setCurrentFilters(resetFilters)
    fetchProducts(resetFilters)
  }

  const handlePageChange = (page: number) => {
    const updatedFilters = { ...currentFilters, page }
    setCurrentFilters(updatedFilters)
    fetchProducts(updatedFilters)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <main className="min-h-screen pt-16 bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-br from-[#003DA5] to-[#1A1A1A] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-[#FFD700] rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-[#AEEA00] rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center">
            <Badge className="bg-[#FFD700] text-[#1A1A1A] px-4 sm:px-6 py-2 text-xs sm:text-sm font-bold mb-4">
              PREMIUM SPORTS STORE
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
              PROFESSIONAL
              <span className="block text-[#FF3D00]">SPORTS EQUIPMENT</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-6 sm:mb-8 leading-relaxed">
              Discover hundreds of premium sports products from world-renowned brands. From
              professional athletes to weekend warriors, find everything you need to excel.
            </p>

            {/* Stats - Mobile optimized */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
              {[
                {
                  icon: Package,
                  label: 'Products',
                  value: pagination.totalDocs > 0 ? `${pagination.totalDocs}+` : '500+',
                },
                {
                  icon: Star,
                  label: 'Brands',
                  value:
                    filterOptions.brands.length > 0 ? `${filterOptions.brands.length}+` : '25+',
                },
                {
                  icon: TrendingUp,
                  label: 'Categories',
                  value:
                    filterOptions.categories.length > 0
                      ? `${filterOptions.categories.length}+`
                      : '12+',
                },
                { icon: Zap, label: 'Featured', value: '50+' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <stat.icon className="w-6 sm:w-8 h-6 sm:h-8 mx-auto mb-2 text-[#FFD700]" />
                  <div className="text-lg sm:text-2xl font-black">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-gray-300">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* All Products Section - Mobile Optimized */}
      <section id="all-products" className="py-12 sm:py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <Badge className="bg-[#AEEA00] text-[#1A1A1A] px-4 sm:px-6 py-2 text-xs sm:text-sm font-bold mb-4">
              COMPLETE CATALOG
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1A1A1A] dark:text-white mb-4 leading-tight">
              ALL
              <span className="block text-[#FF3D00] dark:text-[#FF6B47]">PRODUCTS</span>
            </h2>
          </div>

          {/* Error Display */}
          {error && (
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="w-full mb-4 border-2 border-[#003DA5] dark:border-[#4A90E2] text-[#003DA5] dark:text-[#4A90E2] font-bold"
              >
                <Filter className="w-4 h-4 mr-2" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
                <ChevronDown
                  className={`w-4 h-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`}
                />
              </Button>
            </div>

            {/* Filters Sidebar - Mobile Responsive */}
            <div
              className={`lg:w-80 flex-shrink-0 ${showFilters || (typeof window !== 'undefined' && window.innerWidth >= 1024) ? 'block' : 'hidden lg:block'}`}
            >
              <div className="sticky top-24">
                <FiltersComponent
                  categories={filterOptions.categories}
                  brands={filterOptions.brands}
                  priceRange={filterOptions.priceRange}
                  currentFilters={currentFilters}
                  onFiltersChange={handleFiltersChange}
                  onSortChange={handleSortChange}
                  onSearchChange={handleSearchChange}
                  onReset={handleResetFilters}
                  isOpen={
                    showFilters || (typeof window !== 'undefined' && window.innerWidth >= 1024)
                  }
                  onToggle={() => setShowFilters(!showFilters)}
                  loading={filtersLoading}
                />
              </div>
            </div>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Toolbar - Mobile Optimized */}
              <Card className="mb-4 sm:mb-6 bg-white dark:bg-gray-700">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center justify-between flex-wrap gap-3 sm:gap-4">
                    <div className="flex items-center gap-2 sm:gap-4">
                      {pagination.totalDocs > 0 && (
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                          Showing {(pagination.page - 1) * pagination.limit + 1}-
                          {Math.min(pagination.page * pagination.limit, pagination.totalDocs)} of{' '}
                          {pagination.totalDocs} products
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant={viewMode === 'grid' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('grid')}
                        className={`${viewMode === 'grid' ? 'bg-[#003DA5] text-white' : ''} p-2`}
                      >
                        <Grid3X3 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant={viewMode === 'list' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('list')}
                        className={`${viewMode === 'list' ? 'bg-[#003DA5] text-white' : ''} p-2`}
                      >
                        <List className="w-4 h-4" />
                      </Button>

                      <Separator orientation="vertical" className="h-6 mx-1" />

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowFilters(!showFilters)}
                        className="lg:hidden p-2"
                      >
                        <Filter className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Products - Mobile Optimized Grid */}
              {loading ? (
                <div
                  className={`grid gap-3 sm:gap-4 md:gap-6 ${
                    viewMode === 'grid'
                      ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4'
                      : 'grid-cols-1'
                  }`}
                >
                  {Array.from({ length: 12 }).map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                      <CardContent className="p-0">
                        <Skeleton className="h-32 sm:h-48 w-full" />
                        <div className="p-2 sm:p-4 space-y-2 sm:space-y-3">
                          <Skeleton className="h-3 sm:h-4 w-3/4" />
                          <Skeleton className="h-4 sm:h-6 w-1/2" />
                          <Skeleton className="h-3 sm:h-4 w-full" />
                          <Skeleton className="h-3 sm:h-4 w-full" />
                          <div className="flex gap-2">
                            <Skeleton className="h-6 sm:h-8 flex-1" />
                            <Skeleton className="h-6 sm:h-8 w-16 sm:w-20" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : products.length > 0 ? (
                <>
                  <div
                    className={`grid gap-3 sm:gap-4 md:gap-6 ${
                      viewMode === 'grid'
                        ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4'
                        : 'grid-cols-1'
                    }`}
                  >
                    {products.map((product: ProductListItem & { _displayPrice?: number }) => (
                      <ProductCard
                        key={product.id}
                        product={{ ...product, price: product._displayPrice ?? product.price }}
                        variant={viewMode}
                        showBrand={true}
                        showCategory={true}
                        className="mobile-optimized"
                      />
                    ))}
                  </div>

                  {/* Pagination - Mobile Optimized */}
                  {pagination.totalPages > 1 && (
                    <div className="mt-8 sm:mt-12 flex justify-center">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(pagination.page - 1)}
                          disabled={!pagination.hasPrevPage}
                          className="text-xs sm:text-sm px-2 sm:px-4"
                        >
                          Previous
                        </Button>

                        {Array.from({ length: Math.min(5, pagination.totalPages) }).map((_, i) => {
                          const page = i + Math.max(1, pagination.page - 2)
                          if (page > pagination.totalPages) return null

                          return (
                            <Button
                              key={page}
                              variant={page === pagination.page ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => handlePageChange(page)}
                              className={`${page === pagination.page ? 'bg-[#003DA5] text-white' : ''} text-xs sm:text-sm w-8 sm:w-10 h-8 sm:h-10`}
                            >
                              {page}
                            </Button>
                          )
                        })}

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(pagination.page + 1)}
                          disabled={!pagination.hasNextPage}
                          className="text-xs sm:text-sm px-2 sm:px-4"
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <Card className="p-8 sm:p-12 text-center bg-white dark:bg-gray-700">
                  <Package className="w-12 sm:w-16 h-12 sm:h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
                    No Products Found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm sm:text-base">
                    Try adjusting your filters or search terms to find what you&apos;re looking for.
                  </p>
                  <Button
                    onClick={handleResetFilters}
                    className="bg-[#003DA5] hover:bg-[#003DA5]/90 text-white"
                  >
                    Clear All Filters
                  </Button>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Mobile Optimized */}
      <section className="py-12 sm:py-16 bg-gradient-to-r from-[#003DA5] to-[#FF3D00] text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-4 leading-tight">
            NEED HELP FINDING THE RIGHT GEAR?
          </h2>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 opacity-90 leading-relaxed">
            Our sports equipment experts are here to help you find the perfect products for your
            needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-[#003DA5] hover:bg-gray-100 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base md:text-lg font-bold rounded-full"
              asChild
            >
              <Link href="/contact">Contact Our Experts</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-[#003DA5] px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base md:text-lg font-bold rounded-full bg-transparent"
              asChild
            >
              <Link href="/contact">Request Bulk Quote</Link>
            </Button>
          </div>

          {/* Product Verification CTA - Mobile Optimized */}
          <div className="mt-8 sm:mt-12 bg-white/10 rounded-2xl p-4 sm:p-6 backdrop-blur-sm">
            <h3 className="text-lg sm:text-xl font-bold mb-2">🔍 VERIFY YOUR PRODUCTS</h3>
            <p className="text-xs sm:text-sm opacity-90 mb-4">
              Check if your sports equipment is authentic using our verification system.
            </p>
            <Button
              size="sm"
              className="bg-[#FFD700] text-[#1A1A1A] hover:bg-[#FFD700]/90 font-bold text-xs sm:text-sm"
              asChild
            >
              <Link href="/products/verify">Verify Product</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
