'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Menu, X, Phone, ChevronRight, ShoppingBag, StoreIcon } from 'lucide-react'
import { CartButton } from '@/components/cart/cart-button'
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

export default function EnhancedNavigation() {
  // Cache duration: 5 minutes
  const CACHE_DURATION = 5 * 60 * 1000

  function getCached<T>(key: string): T | null {
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
  }

  function setCached<T>(key: string, data: T): void {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }))
    } catch (error) {
      console.warn('Failed to cache data:', error)
    }
  }

  // State for real API data
  const [filterMetadata, setFilterMetadata] = useState<FilterMetadata | null>(null)
  const [navigationHierarchy, setNavigationHierarchy] = useState<NavigationHierarchy | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Navigation state
  const [isOpen, setIsOpen] = useState(false)
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const [megaMenuOpen, setMegaMenuOpen] = useState(false)
  const [hoveredSportsCategory, setHoveredSportsCategory] = useState<string | null>(null)
  const [hoveredSport, setHoveredSport] = useState<string | null>(null)
  const [hoveredSportsItem, setHoveredSportsItem] = useState<string | null>(null)
  const [squircle, setSquircle] = useState({ left: 0, top: 0, width: 0, height: 0, visible: false })
  const [isMobile, setIsMobile] = useState(false)
  const [squircleAnimated, setSquircleAnimated] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  const lastSquircle = useRef({ left: 0, top: 0, width: 0, height: 0 })

  // Process API data into hierarchical structure
  const processHierarchicalData = (data: FilterMetadata): NavigationHierarchy => {
    const sportsCategories = data.categories.filter(
      (cat) => cat.type === 'sports-category' && cat.showInNavigation,
    )
    const sports: { [categorySlug: string]: CategoryItem[] } = {}
    const sportsItems: { [sportSlug: string]: CategoryItem[] } = {}

    // Group sports by category (you might need to add parent relationships in your API)
    data.categories
      .filter((cat) => cat.type === 'sports' && cat.showInNavigation)
      .forEach((sport) => {
        // For now, we'll show all sports under each category
        // Ideally, you'd have parent-child relationships in your API
        sportsCategories.forEach((category) => {
          if (!sports[category.slug]) sports[category.slug] = []
          sports[category.slug].push(sport)
        })
      })

    // Group sports items by sport
    data.categories
      .filter((cat) => cat.type === 'sports-item' && cat.showInNavigation)
      .forEach((item) => {
        // For now, we'll show all items under each sport
        // Ideally, you'd have parent-child relationships in your API
        Object.values(sports)
          .flat()
          .forEach((sport) => {
            if (!sportsItems[sport.slug]) sportsItems[sport.slug] = []
            sportsItems[sport.slug].push(item)
          })
      })

    return { sportsCategories, sports, sportsItems }
  }

  // Fetch real filter metadata from API
  useEffect(() => {
    async function fetchFilterMetadata() {
      try {
        // Check cache first
        const cachedData = getCached<FilterMetadata>('nav_filter_metadata')
        if (cachedData) {
          setFilterMetadata(cachedData)
          setNavigationHierarchy(processHierarchicalData(cachedData))
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
          setCached('nav_filter_metadata', result.data)
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

  const navRefs = React.useRef<React.RefObject<HTMLAnchorElement>[]>([])
  if (navRefs.current.length !== navItems.length) {
    navRefs.current = Array.from({ length: navItems.length }, () =>
      React.createRef<HTMLAnchorElement>(),
    ) as React.RefObject<HTMLAnchorElement>[]
  }

  // Build filter URL based on current selection
  const buildFilterUrl = (params: {
    category?: string
    sport?: string
    item?: string
    brand?: string
  }) => {
    const searchParams = new URLSearchParams()

    if (params.category) searchParams.append('category', params.category)
    if (params.sport) searchParams.append('sport', params.sport)
    if (params.item) searchParams.append('item', params.item)
    if (params.brand) searchParams.append('brand', params.brand)

    const queryString = searchParams.toString()
    return `/products${queryString ? `?${queryString}` : ''}`
  }

  // Handle navigation clicks with proper filtering
  const handleCategoryClick = (categorySlug: string) => {
    window.location.href = buildFilterUrl({ category: categorySlug })
    setMegaMenuOpen(false)
  }

  const handleSportClick = (categorySlug: string, sportSlug: string) => {
    window.location.href = buildFilterUrl({ category: categorySlug, sport: sportSlug })
    setMegaMenuOpen(false)
  }

  const handleSportsItemClick = (categorySlug: string, sportSlug: string, itemSlug: string) => {
    window.location.href = buildFilterUrl({
      category: categorySlug,
      sport: sportSlug,
      item: itemSlug,
    })
    setMegaMenuOpen(false)
  }

  const handleBrandClick = (brandSlug: string) => {
    window.location.href = buildFilterUrl({ brand: brandSlug })
    setMegaMenuOpen(false)
  }

  const getCurrentShopLink = () => {
    if (hoveredSportsItem && hoveredSport && hoveredSportsCategory) {
      return buildFilterUrl({
        category: hoveredSportsCategory,
        sport: hoveredSport,
        item: hoveredSportsItem,
      })
    }
    if (hoveredSport && hoveredSportsCategory) {
      return buildFilterUrl({ category: hoveredSportsCategory, sport: hoveredSport })
    }
    if (hoveredSportsCategory) {
      return buildFilterUrl({ category: hoveredSportsCategory })
    }
    return '/products'
  }

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
    }
  }, [])

  // Update squircle position/size on hover (desktop only)
  useEffect(() => {
    if (isMobile || reducedMotion) {
      setSquircle((s) => ({ ...s, visible: false }))
      return
    }
    if (hoveredIdx !== null && navRefs.current[hoveredIdx]?.current) {
      const rect = navRefs.current[hoveredIdx]!.current!.getBoundingClientRect()
      const parentRect =
        navRefs.current[hoveredIdx]!.current!.parentElement!.parentElement!.getBoundingClientRect()
      const newSquircle = {
        left: rect.left - parentRect.left,
        top: rect.top - parentRect.top,
        width: rect.width,
        height: rect.height,
        visible: true,
      }
      setSquircle((prev) => {
        if (!prev.visible) {
          lastSquircle.current = newSquircle
          if (!squircleAnimated) setSquircleAnimated(true)
          return newSquircle
        }
        lastSquircle.current = newSquircle
        return newSquircle
      })
    } else {
      setSquircle((s) => ({ ...s, visible: false }))
    }
  }, [hoveredIdx, isMobile, reducedMotion])

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
                    <div
                      className="relative"
                      onMouseEnter={() => {
                        setMegaMenuOpen(true)
                        setHoveredIdx(null)
                      }}
                      onMouseLeave={() => {
                        setMegaMenuOpen(false)
                        setHoveredSportsCategory(null)
                        setHoveredSport(null)
                        setHoveredSportsItem(null)
                        setHoveredIdx(null)
                      }}
                    >
                      <Link
                        href={getCurrentShopLink()}
                        className={`relative px-3 lg:px-4 py-2 text-sm lg:text-base font-semibold rounded-xl transition-all duration-150 group overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 flex items-center gap-1
                          ${megaMenuOpen ? 'text-white bg-brand-primary font-bold' : 'text-text-primary hover:text-brand-primary hover:bg-brand-background'}`}
                        aria-label="Shop filtered products"
                      >
                        {item.name}
                        <ChevronRight
                          className={`w-3 h-3 transition-transform duration-200 ${megaMenuOpen ? 'rotate-90' : ''}`}
                        />
                      </Link>

                      {/* Hierarchical Mega Menu */}
                      <AnimatePresence>
                        {megaMenuOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full mt-4 bg-brand-surface border border-brand-border shadow-2xl rounded-2xl overflow-hidden z-50"
                            style={{
                              width: '1200px',
                              maxWidth: '95vw',
                              left: 'calc(-500px + 50%)',
                            }}
                          >
                            <div className="flex h-fit min-h-[420px]">
                              {/* Level 1: Sports Categories */}
                              <div className="w-64 bg-gradient-to-b from-gray-50 to-gray-100 border-r border-brand-border p-5">
                                <div className="flex items-center gap-2 mb-5">
                                  <div className="w-2 h-2 bg-brand-primary rounded-full"></div>
                                  <h3 className="text-lg font-bold text-text-primary">
                                    Sports Categories
                                  </h3>
                                </div>
                                <div className="space-y-2 max-h-80 overflow-hidden">
                                  {loading ? (
                                    <div className="space-y-3">
                                      {[1, 2, 3, 4, 5].map((i) => (
                                        <div key={i} className="animate-pulse">
                                          <div className="h-14 bg-gray-200 rounded-xl"></div>
                                        </div>
                                      ))}
                                    </div>
                                  ) : error ? (
                                    <div className="text-red-500 text-sm p-3 bg-red-50 rounded-xl border border-red-200">
                                      <div className="font-semibold">Failed to load categories</div>
                                      <div className="text-xs mt-1">
                                        Please try refreshing the page
                                      </div>
                                    </div>
                                  ) : (
                                    navigationHierarchy?.sportsCategories.map((category) => (
                                      <div
                                        key={category.id}
                                        className={`group p-4 rounded-xl cursor-pointer transition-all duration-300 relative overflow-hidden ${
                                          hoveredSportsCategory === category.slug
                                            ? 'bg-brand-primary text-white shadow-lg transform scale-[1.02]'
                                            : 'hover:bg-white hover:shadow-md border border-transparent hover:border-gray-200'
                                        }`}
                                        onMouseEnter={() => {
                                          setHoveredSportsCategory(category.slug)
                                          setHoveredSport(null)
                                          setHoveredSportsItem(null)
                                        }}
                                        onClick={() => handleCategoryClick(category.slug)}
                                      >
                                        {/* Hover gradient background */}
                                        <div
                                          className={`absolute inset-0 bg-gradient-to-r from-brand-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${hoveredSportsCategory === category.slug ? 'opacity-100' : ''}`}
                                        ></div>

                                        <div className="flex items-center gap-4 relative z-10">
                                          <div className="flex-shrink-0"></div>
                                          <div className="flex-1 min-w-0">
                                            <div className="font-semibold text-sm truncate">
                                              {category.name}
                                            </div>
                                            <div
                                              className={`text-xs mt-1 ${
                                                hoveredSportsCategory === category.slug
                                                  ? 'text-white/80'
                                                  : 'text-text-secondary'
                                              }`}
                                            >
                                              {category.productCount} products
                                            </div>
                                          </div>
                                          <ChevronRight
                                            className={`w-4 h-4 transition-transform duration-200 ${
                                              hoveredSportsCategory === category.slug
                                                ? 'transform translate-x-1'
                                                : ''
                                            }`}
                                          />
                                        </div>
                                      </div>
                                    ))
                                  )}
                                </div>
                              </div>

                              {/* Level 2: Sports */}
                              {hoveredSportsCategory &&
                                navigationHierarchy?.sports[hoveredSportsCategory] && (
                                  <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="w-60 bg-gradient-to-b from-white to-gray-50 border-r border-brand-border p-5"
                                  >
                                    <div className="flex items-center gap-2 mb-5">
                                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                      <h4 className="text-lg font-bold text-text-primary">
                                        Sports
                                      </h4>
                                    </div>
                                    <div className="space-y-2 max-h-80 overflow-hidden">
                                      {navigationHierarchy.sports[hoveredSportsCategory].map(
                                        (sport) => (
                                          <div
                                            key={sport.id}
                                            className={`group p-3 rounded-lg cursor-pointer transition-all duration-200 relative ${
                                              hoveredSport === sport.slug
                                                ? 'bg-blue-500 text-white shadow-md transform scale-[1.02]'
                                                : 'hover:bg-gray-100 hover:shadow-sm'
                                            }`}
                                            onMouseEnter={() => {
                                              setHoveredSport(sport.slug)
                                              setHoveredSportsItem(null)
                                            }}
                                            onClick={() =>
                                              handleSportClick(hoveredSportsCategory, sport.slug)
                                            }
                                          >
                                            <div className="flex items-center gap-3">
                                              <div className="flex-shrink-0"></div>
                                              <div className="flex-1 min-w-0">
                                                <div className="font-medium text-sm truncate">
                                                  {sport.name}
                                                </div>
                                                <div
                                                  className={`text-xs ${
                                                    hoveredSport === sport.slug
                                                      ? 'text-white/80'
                                                      : 'text-text-secondary'
                                                  }`}
                                                >
                                                  {sport.productCount} items
                                                </div>
                                              </div>
                                              <ChevronRight
                                                className={`w-3 h-3 transition-transform duration-200 ${
                                                  hoveredSport === sport.slug
                                                    ? 'transform translate-x-1'
                                                    : ''
                                                }`}
                                              />
                                            </div>
                                          </div>
                                        ),
                                      )}
                                    </div>
                                  </motion.div>
                                )}

                              {/* Level 3: Sports Items */}
                              {hoveredSport && navigationHierarchy?.sportsItems[hoveredSport] && (
                                <motion.div
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="w-56 bg-white border-r border-brand-border p-5"
                                >
                                  <div className="flex items-center gap-2 mb-5">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <h4 className="text-lg font-bold text-text-primary">
                                      Equipment
                                    </h4>
                                  </div>
                                  <div className="space-y-2 max-h-80 overflow-hidden">
                                    {navigationHierarchy.sportsItems[hoveredSport].map((item) => (
                                      <div
                                        key={item.id}
                                        className={`group p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                                          hoveredSportsItem === item.slug
                                            ? 'bg-green-500 text-white shadow-md transform scale-[1.02]'
                                            : 'hover:bg-gray-50 hover:shadow-sm border border-transparent hover:border-gray-200'
                                        }`}
                                        onMouseEnter={() => setHoveredSportsItem(item.slug)}
                                        onClick={() =>
                                          handleSportsItemClick(
                                            hoveredSportsCategory!,
                                            hoveredSport,
                                            item.slug,
                                          )
                                        }
                                      >
                                        <div className="flex items-center gap-3">
                                          <div className="flex-shrink-0"></div>
                                          <div className="flex-1 min-w-0">
                                            <div className="font-medium text-sm truncate">
                                              {item.name}
                                            </div>
                                            <div
                                              className={`text-xs ${
                                                hoveredSportsItem === item.slug
                                                  ? 'text-white/80'
                                                  : 'text-text-secondary'
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

                              {/* Level 4: Brands & Actions */}
                              <div className="flex-1 p-6 bg-gradient-to-br from-gray-50 to-white relative">
                                {loading ? (
                                  <div className="flex items-center justify-center h-full">
                                    <div className="text-center">
                                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-primary mx-auto mb-4"></div>
                                      <p className="text-text-secondary font-medium">
                                        Loading navigation...
                                      </p>
                                    </div>
                                  </div>
                                ) : error ? (
                                  <div className="flex items-center justify-center h-full">
                                    <div className="text-center max-w-sm">
                                      <div className="text-5xl mb-4">⚠️</div>
                                      <h4 className="text-xl font-bold text-text-primary mb-2">
                                        Navigation Unavailable
                                      </h4>
                                      <p className="text-text-secondary mb-6 text-sm leading-relaxed">
                                        {error}
                                      </p>
                                      <Link
                                        href="/products"
                                        className="inline-flex items-center px-6 py-3 bg-brand-primary text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors shadow-lg"
                                        onClick={() => setMegaMenuOpen(false)}
                                      >
                                        <ShoppingBag className="w-4 h-4 mr-2" />
                                        Browse Products
                                      </Link>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="h-full flex flex-col">
                                    {/* Featured Brands Section */}
                                    <div className="flex-1">
                                      {filterMetadata?.brands &&
                                        filterMetadata.brands.filter((b) => b.isFeature).length >
                                          0 && (
                                          <div className="mb-6">
                                            <div className="flex items-center gap-2 mb-4">
                                              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                              <h4 className="text-lg font-bold text-text-primary">
                                                Featured Brands
                                              </h4>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                              {filterMetadata.brands
                                                .filter((b) => b.isFeature)
                                                .slice(0, 6)
                                                .map((brand) => (
                                                  <div
                                                    key={brand.id}
                                                    className="group p-3 rounded-xl cursor-pointer transition-all duration-200 hover:bg-white hover:shadow-md border border-transparent hover:border-gray-200 relative overflow-hidden"
                                                    onClick={() => handleBrandClick(brand.slug)}
                                                  >
                                                    {/* Subtle hover effect */}
                                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                                    <div className="flex items-center gap-3 relative z-10">
                                                      {brand.logo?.url && (
                                                        <div className="w-8 h-8 flex-shrink-0 rounded-lg overflow-hidden bg-white p-1 shadow-sm">
                                                          <Image
                                                            src={
                                                              brand.logo.url || '/placeholder.svg'
                                                            }
                                                            alt={brand.logo.alt}
                                                            width={32}
                                                            height={32}
                                                            className="w-full h-full object-contain"
                                                          />
                                                        </div>
                                                      )}
                                                      <div className="flex-1 min-w-0">
                                                        <div className="font-semibold text-sm text-text-primary truncate">
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

                                      {/* Welcome Message for No Selection */}
                                      {!hoveredSportsCategory && (
                                        <div className="text-center py-8">
                                          <div className="text-6xl mb-4">🏆</div>
                                          <h4 className="text-2xl font-bold text-text-primary mb-3">
                                            Discover Sports Equipment
                                          </h4>
                                          <p className="text-text-secondary mb-2 text-lg">
                                            Explore {filterMetadata?.totalCategories} categories
                                          </p>
                                          <p className="text-text-secondary text-sm">
                                            From {filterMetadata?.totalBrands} trusted brands
                                          </p>
                                        </div>
                                      )}

                                      {/* Current Selection Info */}
                                      {hoveredSportsCategory && (
                                        <div className="bg-white/60 rounded-xl p-4 mb-4 border border-gray-200">
                                          <div className="text-sm text-text-secondary mb-1">
                                            Currently browsing:
                                          </div>
                                          <div className="flex items-center gap-2 text-text-primary">
                                            <span className="font-semibold">
                                              {
                                                navigationHierarchy?.sportsCategories.find(
                                                  (c) => c.slug === hoveredSportsCategory,
                                                )?.name
                                              }
                                            </span>
                                            {hoveredSport && (
                                              <>
                                                <ChevronRight className="w-3 h-3 text-text-secondary" />
                                                <span className="font-medium">
                                                  {
                                                    navigationHierarchy?.sports[
                                                      hoveredSportsCategory
                                                    ]?.find((s) => s.slug === hoveredSport)?.name
                                                  }
                                                </span>
                                              </>
                                            )}
                                            {hoveredSportsItem && hoveredSport && (
                                              <>
                                                <ChevronRight className="w-3 h-3 text-text-secondary" />
                                                <span className="text-text-secondary">
                                                  {
                                                    navigationHierarchy?.sportsItems[
                                                      hoveredSport
                                                    ]?.find(
                                                      (i: CategoryItem) =>
                                                        i.slug === hoveredSportsItem,
                                                    )?.name
                                                  }
                                                </span>
                                              </>
                                            )}
                                          </div>

                                          {/* Related Brands for the selected category */}
                                          {(() => {
                                            const selectedCategory =
                                              filterMetadata?.categories.find(
                                                (cat) => cat.slug === hoveredSportsCategory,
                                              )
                                            if (
                                              selectedCategory &&
                                              Array.isArray(selectedCategory.relatedBrands) &&
                                              selectedCategory.relatedBrands.length > 0
                                            ) {
                                              return (
                                                <div className="mt-4">
                                                  <div className="text-xs text-text-secondary mb-2 font-semibold">
                                                    Related Brands:
                                                  </div>
                                                  <div className="flex flex-wrap gap-2">
                                                    {selectedCategory.relatedBrands.map(
                                                      (brand: any) => (
                                                        <button
                                                          key={brand.id}
                                                          className="flex items-center gap-2 px-3 py-1 rounded-lg bg-brand-surface border border-brand-border hover:bg-brand-primary hover:text-white transition-colors text-xs font-medium shadow-sm"
                                                          onClick={() =>
                                                            handleBrandClick(brand.slug)
                                                          }
                                                        >
                                                          {brand.logo?.url && (
                                                            <Image
                                                              src={brand.logo.url}
                                                              alt={brand.logo.alt || brand.name}
                                                              width={20}
                                                              height={20}
                                                              className="rounded-full w-5 h-5 object-contain"
                                                            />
                                                          )}
                                                          <span>{brand.name}</span>
                                                        </button>
                                                      ),
                                                    )}
                                                  </div>
                                                </div>
                                              )
                                            }
                                            return null
                                          })()}
                                        </div>
                                      )}
                                    </div>

                                    {/* Bottom Action Buttons */}
                                    <div className="pt-4 border-t border-gray-200">
                                      <div className="flex gap-3 justify-end">
                                        <Link
                                          href="/products"
                                          className="inline-flex items-center px-5 py-3 border-2 border-brand-primary text-brand-primary rounded-xl font-bold hover:bg-brand-primary hover:text-white transition-all duration-200 shadow-sm hover:shadow-md"
                                          onClick={() => setMegaMenuOpen(false)}
                                        >
                                          <StoreIcon className="w-4 h-4 mr-2" />
                                          Shop All
                                        </Link>
                                        <Link
                                          href={getCurrentShopLink()}
                                          className="inline-flex items-center px-6 py-3 bg-brand-primary text-white rounded-xl font-bold hover:bg-primary-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                                          onClick={() => setMegaMenuOpen(false)}
                                        >
                                          <ShoppingBag className="w-4 h-4 mr-2" />
                                          Shop Category
                                        </Link>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      ref={navRefs.current[index]}
                      className={`relative px-3 lg:px-4 py-2 text-sm lg:text-base font-semibold rounded-xl transition-all duration-150 group overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2
                        ${hoveredIdx === index ? 'text-white bg-brand-primary font-bold' : 'text-text-primary hover:text-brand-primary hover:bg-brand-background'}`}
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

              {/* Shared rectangle background for non-dropdown items */}
              <AnimatePresence>
                {!isMobile &&
                  !reducedMotion &&
                  squircle.visible &&
                  hoveredIdx !== null &&
                  !navItems[hoveredIdx]?.hasDropdown &&
                  !megaMenuOpen && (
                    <motion.div
                      key="squircle-bg"
                      initial={
                        squircleAnimated
                          ? {
                              opacity: 1,
                              scale: 1,
                              left: squircle.left,
                              top: squircle.top,
                              width: squircle.width,
                              height: squircle.height,
                            }
                          : {
                              opacity: 0,
                              scale: 0.98,
                              left: lastSquircle.current.left,
                              top: lastSquircle.current.top,
                              width: lastSquircle.current.width,
                              height: lastSquircle.current.height,
                            }
                      }
                      animate={{
                        opacity: 1,
                        scale: 1,
                        left: squircle.left,
                        top: squircle.top,
                        width: squircle.width,
                        height: squircle.height,
                      }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ type: 'spring', stiffness: 600, damping: 30, mass: 0.7 }}
                      style={{
                        position: 'absolute',
                        zIndex: 1,
                        borderRadius: '0.75rem',
                        background: '#FF6B35',
                        pointerEvents: 'none',
                      }}
                    />
                  )}
              </AnimatePresence>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-2 lg:space-x-3">
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
                  {/* Mobile Categories */}
                  {!loading && !error && navigationHierarchy?.sportsCategories && (
                    <div className="mb-4">
                      <h4 className="text-sm font-bold text-text-secondary uppercase tracking-wide mb-2 px-3">
                        Categories
                      </h4>
                      {navigationHierarchy.sportsCategories.slice(0, 3).map((category) => (
                        <Link
                          key={category.id}
                          href={buildFilterUrl({ category: category.slug })}
                          onClick={() => setIsOpen(false)}
                          className="block w-full text-left px-3 sm:px-4 py-2 sm:py-3 text-text-primary hover:text-brand-primary hover:bg-gray-50 font-medium rounded-xl sm:rounded-2xl transition-all duration-200 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
                          role="menuitem"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-lg">{category.icon || '🏆'}</span>
                            <div>
                              <div>{category.name}</div>
                              <div className="text-xs text-text-secondary">
                                {category.productCount} products
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

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
