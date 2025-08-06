'use client'

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Menu, X, Phone, ChevronRight, ShoppingBag, StoreIcon, Sparkles } from 'lucide-react'
import { CartButton } from '@/components/cart/cart-button'
import { OrdersButton } from '@/components/orders/orders-button'
import Link from 'next/link'
import { SITE_CONFIG } from '@/config/site-config'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

// Updated types for the 4-layer hierarchy
type CategoryItem = {
  id: string | number
  slug: string
  name: string
  description?: string | null
  icon?: string
  image?: { url: string; alt: string } | null
  displayOrder: number
  isFeature: boolean
  showInNavigation: boolean
  productCount: number
  type: 'sports-category' | 'sports' | 'sports-item'
  parentCategory?: {
    id: string | number
    name: string
    slug: string
    type: string
  } | null
  relatedBrands?: Brand[]
}

type Brand = {
  id: string | number
  slug: string
  name: string
  description?: string | null
  logo?: { url: string; alt: string } | null
  website?: string
  isFeature: boolean
  country?: string
  foundedYear?: number
  productCount: number
}

type FilterMetadata = {
  categories: CategoryItem[]
  hierarchicalCategories?: {
    sportsCategories: CategoryItem[]
    sports: CategoryItem[]
    sportsItems: CategoryItem[]
  }
  brands: Brand[]
  priceRange: { min: number; max: number }
  totalProducts: number
  totalCategories: number
  totalBrands: number
}

// Hierarchical structure for navigation
type NavigationHierarchy = {
  sportsCategories: CategoryItem[]
  sports: { [categorySlug: string]: CategoryItem[] }
  sportsItems: { [sportSlug: string]: CategoryItem[] }
}

// Optimized cache utilities outside component for better performance
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

const cacheUtils = {
  get<T>(key: string): T | null {
    if (typeof window === 'undefined') return null
    try {
      const cached = localStorage.getItem(key)
      if (!cached) return null
      const { data, timestamp } = JSON.parse(cached)
      if (Date.now() - timestamp > CACHE_DURATION) {
        localStorage.removeItem(key)
        return null
      }
      return data as T
    } catch {
      return null
    }
  },

  set<T>(key: string, data: T): void {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }))
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Failed to cache data:', error)
      }
    }
  },
}

export default function EnhancedNavigation() {
  // State for real API data
  const [filterMetadata, setFilterMetadata] = useState<FilterMetadata | null>(null)
  const [navigationHierarchy, setNavigationHierarchy] = useState<NavigationHierarchy | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Navigation state
  const [isOpen, setIsOpen] = useState(false)
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const [megaMenuOpen, setMegaMenuOpen] = useState(false)
  const [megaMenuType, setMegaMenuType] = useState<'shop' | 'brands' | null>(null)
  const [hoveredSportsCategory, setHoveredSportsCategory] = useState<string | null>(null)
  const [hoveredSport, setHoveredSport] = useState<string | null>(null)
  const [hoveredSportsItem, setHoveredSportsItem] = useState<string | null>(null)
  const [selectedSportsCategory, setSelectedSportsCategory] = useState<string | null>(null)
  const [selectedSport, setSelectedSport] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  // Refs for managing hover timeouts and click outside detection
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const navigationRef = useRef<HTMLDivElement>(null)
  const megaMenuRef = useRef<HTMLDivElement>(null)

  // Helper functions for menu management
  const openMegaMenu = (type: 'shop' | 'brands') => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
    setMegaMenuOpen(true)
    setMegaMenuType(type)
    setHoveredIdx(null)
  }

  const closeMegaMenu = (delay = 200) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
    }
    closeTimeoutRef.current = setTimeout(() => {
      setMegaMenuOpen(false)
      setMegaMenuType(null)
      setHoveredSportsCategory(null)
      setHoveredSport(null)
      setHoveredSportsItem(null)
      setHoveredIdx(null)
    }, delay)
  }

  const closeMegaMenuImmediately = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
    setMegaMenuOpen(false)
    setMegaMenuType(null)
    setHoveredSportsCategory(null)
    setHoveredSport(null)
    setHoveredSportsItem(null)
    setHoveredIdx(null)
  }

  const cancelClose = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
  }

  // Process API data into hierarchical structure using the new hierarchicalCategories
  const processHierarchicalData = (data: FilterMetadata): NavigationHierarchy => {
    // Use the hierarchicalCategories structure if available
    if (data.hierarchicalCategories) {
      const sportsCategories = data.hierarchicalCategories.sportsCategories.filter(
        (cat) => cat.showInNavigation,
      )
      const sports: { [categorySlug: string]: CategoryItem[] } = {}
      const sportsItems: { [sportSlug: string]: CategoryItem[] } = {}

      // Group sports by their parent category
      data.hierarchicalCategories.sports.forEach((sport) => {
        if (sport.showInNavigation && sport.parentCategory) {
          const parentSlug = sport.parentCategory.slug
          if (!sports[parentSlug]) sports[parentSlug] = []
          sports[parentSlug].push(sport)
        }
      })

      // Group sports items by their parent sport
      data.hierarchicalCategories.sportsItems.forEach((item) => {
        if (item.showInNavigation && item.parentCategory) {
          const parentSlug = item.parentCategory.slug
          if (!sportsItems[parentSlug]) sportsItems[parentSlug] = []
          sportsItems[parentSlug].push(item)
        }
      })

      return { sportsCategories, sports, sportsItems }
    }

    // Fallback to old logic if hierarchicalCategories is not available
    const sportsCategories = data.categories.filter(
      (cat) => cat.type === 'sports-category' && cat.showInNavigation,
    )
    const sports: { [categorySlug: string]: CategoryItem[] } = {}
    const sportsItems: { [sportSlug: string]: CategoryItem[] } = {}

    // Group sports by category using parent relationships
    data.categories
      .filter((cat) => cat.type === 'sports' && cat.showInNavigation)
      .forEach((sport) => {
        if (sport.parentCategory) {
          const parentSlug = sport.parentCategory.slug
          if (!sports[parentSlug]) sports[parentSlug] = []
          sports[parentSlug].push(sport)
        }
      })

    // Group sports items by sport using parent relationships
    data.categories
      .filter((cat) => cat.type === 'sports-item' && cat.showInNavigation)
      .forEach((item) => {
        if (item.parentCategory) {
          const parentSlug = item.parentCategory.slug
          if (!sportsItems[parentSlug]) sportsItems[parentSlug] = []
          sportsItems[parentSlug].push(item)
        }
      })

    return { sportsCategories, sports, sportsItems }
  }

  // Fetch real filter metadata from API
  useEffect(() => {
    async function fetchFilterMetadata() {
      try {
        // Check cache first
        const cachedData = window.localStorage.getItem('nav_filter_metadata')
        if (cachedData) {
          const parsedData: FilterMetadata = JSON.parse(cachedData)
          setFilterMetadata(parsedData)
          setNavigationHierarchy(processHierarchicalData(parsedData))
          setLoading(false)
          return
        }

        // Fetch from API
        const response = await fetch('/api/public/filters-meta')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()
        if (result.success && result.data) {
          setFilterMetadata(result.data)
          setNavigationHierarchy(processHierarchicalData(result.data))
          window.localStorage.setItem('nav_filter_metadata', JSON.stringify(result.data))
          setError(null)
        } else {
          throw new Error(result.error || 'Failed to fetch filter metadata')
        }
      } catch (error) {
        console.error('Failed to fetch filter metadata:', error)
        setError(error instanceof Error ? error.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchFilterMetadata()
  }, [])

  const navItems = [
    { name: 'Brands', href: '/brands' },
    { name: 'Shop', href: '/products', hasDropdown: true },
    { name: 'About', href: '/about' },
    { name: 'Track', href: '/orders/track' },
    { name: 'Verify', href: '/products/verify' },
  ]

  // Build preselect URL for navigation (doesn't apply filters immediately)
  const buildPreselectUrl = (params: {
    sportsCategory?: string
    sport?: string
    sportsItem?: string
    brand?: string
  }) => {
    const searchParams = new URLSearchParams()

    // Use preselect parameters instead of direct filtering
    if (params.sportsCategory) {
      searchParams.append('preselected', 'sportsCategory')
      searchParams.append('preselectValue', params.sportsCategory)
    } else if (params.sport) {
      searchParams.append('preselected', 'sport')
      searchParams.append('preselectValue', params.sport)
    } else if (params.sportsItem) {
      searchParams.append('preselected', 'sportsItem')
      searchParams.append('preselectValue', params.sportsItem)
    } else if (params.brand) {
      searchParams.append('preselected', 'brand')
      searchParams.append('preselectValue', params.brand)
    }

    const queryString = searchParams.toString()
    return `/products${queryString ? `?${queryString}` : ''}`
  }

  // Build filter URL for immediate filtering (used when user confirms selection)
  const buildFilterUrl = (params: {
    sportsCategory?: string
    sport?: string
    sportsItem?: string
    brand?: string
    brands?: string[]
  }) => {
    const searchParams = new URLSearchParams()

    // Add individual hierarchical filters for proper filter display
    if (params.sportsCategory) searchParams.append('sportsCategory', params.sportsCategory)
    if (params.sport) searchParams.append('sport', params.sport)
    if (params.sportsItem) searchParams.append('sportsItem', params.sportsItem)

    if (params.brand) searchParams.append('brand', params.brand)
    if (params.brands && params.brands.length > 0) {
      params.brands.forEach((brand) => searchParams.append('brand', brand))
    }

    const queryString = searchParams.toString()
    return `/products${queryString ? `?${queryString}` : ''}`
  }

  // Handle category selection (show next layer)
  const handleCategorySelect = (categorySlug: string) => {
    if (selectedSportsCategory === categorySlug) {
      // If already selected, go to products page with preselected category
      window.location.href = buildPreselectUrl({ sportsCategory: categorySlug })
      closeMegaMenuImmediately()
    } else {
      // Select this category and show sports layer
      setSelectedSportsCategory(categorySlug)
      setSelectedSport(null)
      setHoveredSport(null)
      setHoveredSportsItem(null)
    }
  }

  const handleSportSelect = (categorySlug: string, sportSlug: string) => {
    if (selectedSport === sportSlug) {
      // If already selected, go to products page with preselected sport
      window.location.href = buildPreselectUrl({ sport: sportSlug })
      closeMegaMenuImmediately()
    } else {
      // Select this sport and show sports items layer
      setSelectedSport(sportSlug)
      setHoveredSportsItem(null)
    }
  }

  // Handle navigation clicks with preselection (for final selection)
  const handleCategoryClick = (categorySlug: string) => {
    window.location.href = buildPreselectUrl({ sportsCategory: categorySlug })
    closeMegaMenuImmediately()
  }

  const handleSportClick = (categorySlug: string, sportSlug: string) => {
    window.location.href = buildPreselectUrl({ sport: sportSlug })
    closeMegaMenuImmediately()
  }

  const handleSportsItemClick = (categorySlug: string, sportSlug: string, itemSlug: string) => {
    // Don't navigate immediately - just set the hover state for "Shop Category" button
    setHoveredSportsItem(itemSlug)
    setHoveredSportsCategory(categorySlug)
    setHoveredSport(sportSlug)
  }

  const handleBrandClick = (brandSlug: string) => {
    window.location.href = buildPreselectUrl({ brand: brandSlug })
    closeMegaMenuImmediately()
  }

  const handleAllBrandsClick = () => {
    window.location.href = '/brands'
    closeMegaMenuImmediately()
  }

  const handleFeaturedBrandsClick = (brands: string[]) => {
    window.location.href = buildFilterUrl({ brands })
    closeMegaMenuImmediately()
  }

  const getCurrentShopLink = () => {
    if (hoveredSportsItem && hoveredSport && hoveredSportsCategory) {
      return buildFilterUrl({
        sportsCategory: hoveredSportsCategory ?? undefined,
        sport: hoveredSport,
        sportsItem: hoveredSportsItem,
      })
    }
    if (hoveredSport && hoveredSportsCategory) {
      return buildFilterUrl({
        sportsCategory: hoveredSportsCategory ?? undefined,
        sport: hoveredSport,
      })
    }
    if (hoveredSportsCategory) {
      return buildFilterUrl({ sportsCategory: hoveredSportsCategory })
    }
    return '/products'
  }

  const getCurrentBrandsLink = () => {
    return '/brands'
  }

  // Handle click outside to close mega menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node

      // Check if click is outside the navigation and mega menu
      if (
        megaMenuOpen &&
        navigationRef.current &&
        megaMenuRef.current &&
        !navigationRef.current.contains(target) &&
        !megaMenuRef.current.contains(target)
      ) {
        closeMegaMenuImmediately()
      }
    }

    if (megaMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [megaMenuOpen])

  // Detect mobile and reduced motion
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    setReducedMotion(mediaQuery.matches)
    checkMobile()

    const handleMotionChange = () => setReducedMotion(mediaQuery.matches)

    window.addEventListener('resize', checkMobile)
    mediaQuery.addEventListener('change', handleMotionChange)

    return () => {
      window.removeEventListener('resize', checkMobile)
      mediaQuery.removeEventListener('change', handleMotionChange)
      // Clear any pending timeouts
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current)
      }
    }
  }, [])

  // Render Shop Mega Menu with Clean, Brand-Style Design
  // Render Shop Mega Menu with Clean 4-Layer Design
  const renderShopMegaMenu = () => (
    <div className="flex h-[500px]">
      {/* Layer 1: Sports Categories */}
      <div className="w-72 bg-gradient-to-b from-blue-50 to-blue-100 border-r border-brand-border p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
          <h3 className="text-xl font-bold text-text-primary">Categories</h3>
          <div className="text-sm text-text-secondary ml-auto">
            {navigationHierarchy?.sportsCategories.length || 0}
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-12 bg-blue-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-red-500 text-sm p-4 bg-red-50 rounded-xl border border-red-200">
            <div className="font-semibold">Failed to load categories</div>
            <div className="text-xs mt-1">Please try refreshing the page</div>
          </div>
        ) : (
          <div className="space-y-2">
            {navigationHierarchy?.sportsCategories.slice(0, 8).map((category) => (
              <div
                key={category.id}
                className={`group p-4 rounded-lg cursor-pointer transition-all duration-200 relative ${
                  selectedSportsCategory === category.slug
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'hover:bg-white hover:shadow-sm border border-transparent hover:border-blue-200'
                }`}
                onClick={() => handleCategorySelect(category.slug)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-base">{category.name}</div>
                    <div
                      className={`text-sm ${
                        selectedSportsCategory === category.slug
                          ? 'text-white/80'
                          : 'text-text-secondary'
                      }`}
                    >
                      {category.productCount} products
                    </div>
                  </div>
                  {selectedSportsCategory === category.slug ? (
                    <ChevronRight className="w-5 h-5 text-white" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Layer 2: Sports */}
      {selectedSportsCategory && navigationHierarchy?.sports[selectedSportsCategory] && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          className="w-64 bg-gradient-to-b from-green-50 to-green-100 border-r border-brand-border p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            <h4 className="text-lg font-bold text-text-primary">Sports</h4>
            <div className="text-sm text-text-secondary ml-auto">
              {navigationHierarchy.sports[selectedSportsCategory].length}
            </div>
          </div>

          <div className="space-y-2">
            {navigationHierarchy.sports[selectedSportsCategory].slice(0, 10).map((sport) => (
              <div
                key={sport.id}
                className={`group p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedSport === sport.slug
                    ? 'bg-green-600 text-white shadow-md'
                    : 'hover:bg-white hover:shadow-sm border border-transparent hover:border-green-200'
                }`}
                onClick={() => handleSportSelect(selectedSportsCategory!, sport.slug)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sm">{sport.name}</div>
                    <div
                      className={`text-xs ${
                        selectedSport === sport.slug ? 'text-white/80' : 'text-text-secondary'
                      }`}
                    >
                      {sport.productCount} items
                    </div>
                  </div>
                  {selectedSport === sport.slug ? (
                    <ChevronRight className="w-4 h-4 text-white" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Layer 3: Equipment/Sports Items */}
      {selectedSport && navigationHierarchy?.sportsItems[selectedSport] && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          className="w-64 bg-gradient-to-b from-orange-50 to-orange-100 border-r border-brand-border p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
            <h4 className="text-lg font-bold text-text-primary">Equipment</h4>
            <div className="text-sm text-text-secondary ml-auto">
              {navigationHierarchy.sportsItems[selectedSport].length}
            </div>
          </div>

          <div className="space-y-2">
            {navigationHierarchy.sportsItems[selectedSport].slice(0, 12).map((item) => (
              <div
                key={item.id}
                className={`group p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  hoveredSportsItem === item.slug
                    ? 'bg-orange-600 text-white shadow-md'
                    : 'hover:bg-white hover:shadow-sm border border-transparent hover:border-orange-200'
                }`}
                onClick={() =>
                  handleSportsItemClick(selectedSportsCategory!, selectedSport!, item.slug)
                }
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sm">{item.name}</div>
                    <div
                      className={`text-xs ${
                        hoveredSportsItem === item.slug ? 'text-white/80' : 'text-text-secondary'
                      }`}
                    >
                      {item.productCount} products
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Layer 4: Shop by Brands (Only show when category is selected) */}
      {selectedSportsCategory && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          className="flex-1 p-6 bg-gradient-to-br from-white to-gray-50"
        >
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-primary mx-auto mb-4"></div>
                <p className="text-text-secondary font-medium">Loading brands...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-sm">
                <div className="text-5xl mb-4">⚠️</div>
                <h4 className="text-xl font-bold text-text-primary mb-2">Navigation Unavailable</h4>
                <p className="text-text-secondary mb-6 text-sm leading-relaxed">{error}</p>
                <Link
                  href="/products"
                  className="inline-flex items-center px-6 py-3 bg-brand-primary text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors shadow-lg"
                  onClick={() => closeMegaMenuImmediately()}
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Browse Products
                </Link>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col">
              {/* Current Selection Breadcrumb */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-6 border border-blue-200">
                <div className="text-sm text-text-secondary mb-1">Current Selection:</div>
                <div className="flex items-center gap-2 text-text-primary flex-wrap">
                  <span className="font-bold px-3 py-1 bg-blue-100 rounded-lg">
                    {
                      navigationHierarchy?.sportsCategories.find(
                        (c) => c.slug === selectedSportsCategory,
                      )?.name
                    }
                  </span>
                  {selectedSport && (
                    <>
                      <ChevronRight className="w-3 h-3 text-text-secondary" />
                      <span className="font-semibold px-3 py-1 bg-green-100 rounded-lg">
                        {
                          navigationHierarchy?.sports[selectedSportsCategory]?.find(
                            (s) => s.slug === selectedSport,
                          )?.name
                        }
                      </span>
                    </>
                  )}
                  {hoveredSportsItem && selectedSport && (
                    <>
                      <ChevronRight className="w-3 h-3 text-text-secondary" />
                      <span className="text-text-secondary px-3 py-1 bg-orange-100 rounded-lg">
                        {
                          navigationHierarchy?.sportsItems[selectedSport]?.find(
                            (i: CategoryItem) => i.slug === hoveredSportsItem,
                          )?.name
                        }
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Shop by Brands Section */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  <h3 className="text-lg font-bold text-text-primary">Shop by Brand</h3>
                  <div className="text-sm text-text-secondary ml-auto">
                    Optional • {filterMetadata?.totalBrands} available
                  </div>
                </div>

                {/* Featured Brands */}
                {filterMetadata?.brands &&
                  filterMetadata.brands.filter((b) => b.isFeature).length > 0 && (
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                        <h4 className="font-bold text-text-primary">Featured</h4>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {filterMetadata.brands
                          .filter((b) => b.isFeature)
                          .slice(0, 4)
                          .map((brand) => (
                            <div
                              key={brand.id}
                              className="group p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-white hover:shadow-md border border-transparent hover:border-purple-200"
                              onClick={() => {
                                // Use preselect URL for brand selection
                                window.location.href = buildPreselectUrl({ brand: brand.slug })
                                closeMegaMenuImmediately()
                              }}
                            >
                              <div className="flex items-center gap-3">
                                {brand.logo?.url && (
                                  <div className="w-10 h-10 flex-shrink-0 rounded-lg overflow-hidden bg-white p-1 shadow-sm">
                                    <Image
                                      src={brand.logo.url || '/placeholder.svg'}
                                      alt={brand.logo.alt || brand.name}
                                      width={40}
                                      height={40}
                                      className="w-full h-full object-contain"
                                    />
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <div className="font-semibold text-xl text-text-primary truncate">
                                    {brand.name}
                                  </div>
                                  <div className="text-xs text-text-secondary">
                                    {brand.productCount} products
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                {/* All Brands Compact Grid */}
                <div>
                  <h4 className="font-bold text-text-primary mb-3">All Brands</h4>
                  <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                    {filterMetadata?.brands.map((brand) => (
                      <div
                        key={brand.id}
                        className="group p-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200"
                        onClick={() => {
                          // Use preselect URL for brand selection
                          window.location.href = buildPreselectUrl({ brand: brand.slug })
                          closeMegaMenuImmediately()
                        }}
                      >
                        <div className="flex items-center gap-2">
                          {brand.logo?.url && (
                            <div className="w-6 h-6 flex-shrink-0 rounded overflow-hidden bg-white p-0.5">
                              <Image
                                src={brand.logo.url || '/placeholder.svg'}
                                alt={brand.logo.alt || brand.name}
                                width={24}
                                height={24}
                                className="w-full h-full object-contain"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-xs text-text-primary truncate">
                              {brand.name}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-gray-200 mt-2">
                <div className="flex gap-3 justify-between">
                  <Link
                    href="/brands"
                    className="inline-flex items-center px-4 py-2 border-2 border-purple-600 text-purple-600 rounded-lg font-semibold hover:bg-purple-600 hover:text-white transition-all duration-200"
                    onClick={() => closeMegaMenuImmediately()}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    All Brands
                  </Link>
                  <Link
                    href={getCurrentShopLink()}
                    className="inline-flex items-center px-6 py-2 bg-brand-primary text-white rounded-lg font-bold hover:bg-primary-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                    onClick={() => closeMegaMenuImmediately()}
                  >
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    {hoveredSportsItem
                      ? 'Shop Equipment'
                      : hoveredSport
                        ? 'Shop Sport'
                        : 'Shop Category'}
                  </Link>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Default State: No Category Selected */}
      {!hoveredSportsCategory && !selectedSportsCategory && !loading && !error && (
        <div className="flex-1 p-6 bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
          <div className="text-center max-w-sm">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h4 className="text-xl font-bold text-text-primary mb-2">Choose a Category</h4>
            <p className="text-text-secondary mb-6 text-sm leading-relaxed">
              Select a sports category from the left to explore sports, equipment, and brands
            </p>
            <Link
              href="/products"
              className="inline-flex items-center px-6 py-3 bg-brand-primary text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors shadow-lg"
              onClick={() => closeMegaMenuImmediately()}
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Browse All Products
            </Link>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <>
      {/* Main Navigation */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 w-[95%] sm:w-[90%] max-w-[1000px] rounded-2xl sm:rounded-3xl mt-2 sm:mt-3 mx-auto border border-brand-border bg-brand-surface/90 backdrop-blur-lg shadow-xl transition-all duration-300"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="mx-auto px-3 sm:px-4 lg:px-8 max-w-7xl">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0">
              <Link
                href="/"
                className="text-xl sm:text-2xl font-black tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 rounded-lg"
                style={{ color: SITE_CONFIG.branding.colors.primary }}
                aria-label="Ralhum Sports - Home"
              >
                <Image
                  width={80}
                  height={80}
                  src={SITE_CONFIG.branding.logoImage || '/placeholder.svg'}
                  alt={SITE_CONFIG.branding.logoText}
                  className="h-16 sm:h-20 lg:h-24 w-auto"
                  priority
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div
              className="hidden md:flex items-center space-x-1 relative"
              style={{ minHeight: 48 }}
            >
              {navItems.map((item, index) => (
                <div key={item.name} className="relative">
                  {item.hasDropdown ? (
                    <div className="relative" ref={navigationRef}>
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          if (item.name === 'Shop') {
                            // On mobile, go directly to products page
                            if (isMobile) {
                              window.location.href = '/products'
                            } else {
                              // Desktop: toggle mega menu
                              if (megaMenuOpen && megaMenuType === 'shop') {
                                closeMegaMenuImmediately()
                              } else {
                                openMegaMenu('shop')
                              }
                            }
                          } else {
                            window.location.href = getCurrentBrandsLink()
                          }
                        }}
                        className={`relative px-3 lg:px-4 py-2 text-sm lg:text-base font-semibold rounded-xl transition-all duration-300 group overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 flex items-center gap-1
                          ${megaMenuOpen && megaMenuType === (item.name === 'Shop' ? 'shop' : 'brands') ? 'text-white bg-brand-primary font-bold' : 'text-text-primary hover:text-brand-primary hover:bg-brand-background/50'}`}
                        aria-label={item.name === 'Shop' ? 'Toggle shop menu' : 'Browse brands'}
                      >
                        {item.name}
                        <ChevronRight
                          className={`w-3 h-3 transition-transform duration-200 ${megaMenuOpen && megaMenuType === (item.name === 'Shop' ? 'shop' : 'brands') ? 'rotate-90' : ''}`}
                        />
                      </button>

                      {/* Mega Menu - Desktop Only */}
                      {!isMobile && (
                        <AnimatePresence>
                          {megaMenuOpen &&
                            megaMenuType === (item.name === 'Shop' ? 'shop' : 'brands') && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.2 }}
                                className="absolute top-full mt-4 bg-brand-surface border border-brand-border shadow-2xl rounded-2xl overflow-hidden z-50"
                                style={{
                                  width: '1300px',
                                  maxWidth: '125vw',
                                  left: '-450%',
                                  transform: 'translateX(-50%)',
                                }}
                                ref={megaMenuRef}
                              >
                                {megaMenuType === 'shop' && renderShopMegaMenu()}
                              </motion.div>
                            )}
                        </AnimatePresence>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className={`relative px-3 lg:px-4 py-2 text-sm lg:text-base font-semibold rounded-xl transition-all duration-300 ease-out group overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2
                        ${hoveredIdx === index ? 'text-white bg-gradient-to-r from-brand-primary to-orange-500 font-bold shadow-lg transform scale-105' : 'text-text-primary hover:text-brand-primary hover:bg-brand-background/30 hover:shadow-md'}`}
                      onMouseEnter={() => setHoveredIdx(index)}
                      onMouseLeave={() => setHoveredIdx(null)}
                      role="menuitem"
                      aria-label={`Navigate to ${item.name}`}
                    >
                      <span className="relative z-10">{item.name}</span>
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-2 lg:space-x-3">
              <div style={{ transform: 'scale(1.1)' }}>
                <OrdersButton />
              </div>
              <div style={{ transform: 'scale(1.1)' }}>
                <CartButton />
              </div>
              <Button
                size="sm"
                className="font-bold px-3 lg:px-5 py-2 text-sm lg:text-base rounded-full transition-all text-white shadow-lg hover:shadow-xl focus-visible:ring-2 focus-visible:ring-offset-2"
                style={{ background: 'linear-gradient(135deg, var(--primary-orange), #FF8B35)' }}
                asChild
              >
                <Link href="/contact">
                  <Phone className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                  <span className="hidden lg:inline">{SITE_CONFIG.branding.cta.contact}</span>
                  <span className="lg:hidden">Contact</span>
                </Link>
              </Button>
            </div>

            {/* Mobile Actions */}
            <div className="md:hidden flex items-center space-x-2">
              <div style={{ transform: 'scale(1.1)' }}>
                <OrdersButton />
              </div>
              <div style={{ transform: 'scale(1.1)' }}>
                <CartButton />
              </div>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                style={{ backgroundColor: 'transparent' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--surface-hover)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isOpen}
                aria-controls="mobile-menu"
              >
                <AnimatePresence mode="wait">
                  {isOpen ? (
                    <motion.div
                      key="close"
                      initial={!reducedMotion ? { rotate: -90, opacity: 0 } : { opacity: 1 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={!reducedMotion ? { rotate: 90, opacity: 0 } : { opacity: 0 }}
                      transition={{ duration: reducedMotion ? 0.1 : 0.2 }}
                    >
                      <X className="w-5 h-5 sm:w-6 sm:h-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={!reducedMotion ? { rotate: 90, opacity: 0 } : { opacity: 1 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={!reducedMotion ? { rotate: -90, opacity: 0 } : { opacity: 0 }}
                      transition={{ duration: reducedMotion ? 0.1 : 0.2 }}
                    >
                      <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reducedMotion ? 0.1 : 0.2 }}
              className="fixed inset-0 backdrop-blur-sm z-40 md:hidden"
              style={{ backgroundColor: 'rgba(45, 52, 54, 0.2)' }}
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />

            {/* Mobile Menu */}
            <motion.div
              id="mobile-menu"
              initial={!reducedMotion ? { opacity: 0, y: -20, scale: 0.95 } : { opacity: 0 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={!reducedMotion ? { opacity: 0, y: -20, scale: 0.95 } : { opacity: 0 }}
              transition={
                reducedMotion
                  ? { duration: 0.1 }
                  : {
                      type: 'spring',
                      stiffness: 300,
                      damping: 30,
                    }
              }
              className="fixed top-16 sm:top-20 left-3 right-3 sm:left-4 sm:right-4 bg-brand-surface/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-brand-border z-50 md:hidden overflow-hidden"
              role="menu"
              aria-label="Mobile navigation menu"
            >
              <div className="p-4 sm:p-6">
                <div className="space-y-1">
                  {/* Regular Nav Items */}
                  {navItems.map((item) => (
                    <div key={item.name}>
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="block w-full text-left px-3 sm:px-4 py-2 sm:py-3 text-text-primary hover:text-brand-primary hover:bg-gray-50 font-medium rounded-xl sm:rounded-2xl transition-all duration-200 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
                        role="menuitem"
                      >
                        {item.name}
                      </Link>
                    </div>
                  ))}

                  <div className="pt-3 sm:pt-4 border-t border-brand-border mt-3 sm:mt-4">
                    <Button
                      size="lg"
                      className="w-full font-bold py-3 text-base rounded-xl sm:rounded-2xl text-white shadow-lg focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 bg-brand-primary hover:bg-primary-600"
                      onClick={() => setIsOpen(false)}
                      asChild
                    >
                      <Link href="/contact">
                        <Phone className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        {SITE_CONFIG.branding.cta.contact}
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
