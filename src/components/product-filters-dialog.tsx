'use client'

import type React from 'react'
import { useState, useEffect, useMemo, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Search,
  X,
  ChevronDown,
  RotateCcw,
  SlidersHorizontal,
  Filter,
  Sparkles,
} from 'lucide-react'
import { useProductFilters } from '@/hooks/useProductFilters'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'

// Constants for "all" values in selects
const ALL_CATEGORIES = 'all-categories'
const ALL_SPORTS = 'all-sports'
const ALL_ITEMS = 'all-items'

// Type definitions aligned with API responses
interface Category {
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

interface Brand {
  id: string | number
  name: string
  slug: string
  productCount: number
  logo?: {
    url: string
    alt: string
  } | null
  description?: string
}

interface HierarchicalCategories {
  sportsCategories: Category[]
  sports: Category[]
  sportsItems: Category[]
}

interface ProductFiltersDialogProps {
  categories: Category[]
  hierarchicalCategories: HierarchicalCategories
  brands: Brand[]
  priceRange: { min: number; max: number }
  loading?: boolean
  onApplyFilters?: () => void
  activeFiltersCount?: number
  children?: React.ReactNode
}

interface PendingFilters {
  search: string
  sportsCategory: string
  sport: string
  sportsItem: string
  brands: string[]
  priceRange: [number, number]
  inStock: boolean
  sort: string
}

export function ProductFiltersDialog({
  categories,
  hierarchicalCategories,
  brands,
  priceRange,
  loading = false,
  onApplyFilters,
  activeFiltersCount = 0,
  children,
}: ProductFiltersDialogProps) {
  const { filters, setMultipleFilters, clearFilters, getPreselectedValues } = useProductFilters()
  const [open, setOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Pending filters state (before applying)
  const [pendingFilters, setPendingFilters] = useState<PendingFilters>({
    search: '',
    sportsCategory: ALL_CATEGORIES,
    sport: ALL_SPORTS,
    sportsItem: ALL_ITEMS,
    brands: [],
    priceRange: [priceRange.min, priceRange.max],
    inStock: false,
    sort: 'createdAt-desc',
  })

  // UI state optimized for dialog
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    search: true,
    sort: true,
    categories: true,
    brands: true,
    price: true,
    stock: false,
  })

  // Derived state for hierarchical filtering
  const availableSports = useMemo(() => {
    if (pendingFilters.sportsCategory === ALL_CATEGORIES) return []
    return hierarchicalCategories.sports.filter(
      (sport) => sport.parentCategory?.id.toString() === pendingFilters.sportsCategory.toString(),
    )
  }, [pendingFilters.sportsCategory, hierarchicalCategories.sports])

  const availableSportsItems = useMemo(() => {
    if (pendingFilters.sport === ALL_SPORTS) return []
    return hierarchicalCategories.sportsItems.filter(
      (item) => item.parentCategory?.id.toString() === pendingFilters.sport.toString(),
    )
  }, [pendingFilters.sport, hierarchicalCategories.sportsItems])

  // Initialize pending filters from URL filters and preselected values
  useEffect(() => {
    const preselected = getPreselectedValues()

    const newPendingFilters: PendingFilters = {
      search: filters.search || '',
      sportsCategory: filters.sportsCategory || ALL_CATEGORIES,
      sport: filters.sport || ALL_SPORTS,
      sportsItem: filters.sportsItem || ALL_ITEMS,
      brands: filters.brands || [],
      priceRange: [filters.minPrice || priceRange.min, filters.maxPrice || priceRange.max],
      inStock: filters.inStock || false,
      sort: `${filters.sort || 'createdAt'}-${filters.order || 'desc'}`,
    }

    // Handle preselected values from navigation
    if (preselected.type && preselected.value) {
      if (preselected.type === 'sportsCategory') {
        newPendingFilters.sportsCategory = preselected.value
        newPendingFilters.sport = ALL_SPORTS
        newPendingFilters.sportsItem = ALL_ITEMS
      } else if (preselected.type === 'sport') {
        newPendingFilters.sport = preselected.value
        newPendingFilters.sportsItem = ALL_ITEMS
      } else if (preselected.type === 'sportsItem') {
        newPendingFilters.sportsItem = preselected.value
      } else if (preselected.type === 'brand') {
        newPendingFilters.brands = [preselected.value]
      }
    }

    setPendingFilters(newPendingFilters)
  }, [filters, priceRange, getPreselectedValues])

  // Calculate active filters count from current filters
  const currentActiveFiltersCount = useMemo(() => {
    return [
      pendingFilters.search,
      pendingFilters.sportsCategory !== ALL_CATEGORIES,
      pendingFilters.sport !== ALL_SPORTS,
      pendingFilters.sportsItem !== ALL_ITEMS,
      pendingFilters.brands.length > 0,
      pendingFilters.priceRange[0] > priceRange.min ||
        pendingFilters.priceRange[1] < priceRange.max,
      pendingFilters.inStock,
    ].filter(Boolean).length
  }, [pendingFilters, priceRange])

  // Check if filters have changed
  const hasChanges = useMemo(() => {
    return (
      pendingFilters.search !== (filters.search || '') ||
      pendingFilters.sportsCategory !== (filters.sportsCategory || ALL_CATEGORIES) ||
      pendingFilters.sport !== (filters.sport || ALL_SPORTS) ||
      pendingFilters.sportsItem !== (filters.sportsItem || ALL_ITEMS) ||
      JSON.stringify(pendingFilters.brands) !== JSON.stringify(filters.brands || []) ||
      pendingFilters.priceRange[0] !== (filters.minPrice || priceRange.min) ||
      pendingFilters.priceRange[1] !== (filters.maxPrice || priceRange.max) ||
      pendingFilters.inStock !== (filters.inStock || false) ||
      pendingFilters.sort !== `${filters.sort || 'createdAt'}-${filters.order || 'desc'}`
    )
  }, [pendingFilters, filters, priceRange])

  const handleApplyFilters = useCallback(() => {
    const [sortBy, sortOrder] = pendingFilters.sort.split('-')
    const preselected = getPreselectedValues()

    // When applying filters with preselected values, we need to set up the proper hierarchy
    const finalFilters: any = {
      search: pendingFilters.search || undefined,
      sportsCategory:
        pendingFilters.sportsCategory !== ALL_CATEGORIES
          ? pendingFilters.sportsCategory
          : undefined,
      sport: pendingFilters.sport !== ALL_SPORTS ? pendingFilters.sport : undefined,
      sportsItem: pendingFilters.sportsItem !== ALL_ITEMS ? pendingFilters.sportsItem : undefined,
      brands: pendingFilters.brands.length > 0 ? pendingFilters.brands : undefined,
      minPrice:
        pendingFilters.priceRange[0] > priceRange.min ? pendingFilters.priceRange[0] : undefined,
      maxPrice:
        pendingFilters.priceRange[1] < priceRange.max ? pendingFilters.priceRange[1] : undefined,
      inStock: pendingFilters.inStock || undefined,
      sort: sortBy,
      order: sortOrder,
    }

    // Handle preselected values - ensure proper hierarchy
    if (preselected.type && preselected.value) {
      if (preselected.type === 'sportsCategory') {
        finalFilters.sportsCategory = preselected.value
      } else if (preselected.type === 'sport') {
        finalFilters.sport = preselected.value
        // Find parent category for sport
        const sport = hierarchicalCategories.sports.find((s) => s.slug === preselected.value)
        if (sport?.parentCategory) {
          finalFilters.sportsCategory = sport.parentCategory.slug
        }
      } else if (preselected.type === 'sportsItem') {
        finalFilters.sportsItem = preselected.value
        // Find parent sport and category
        const item = hierarchicalCategories.sportsItems.find((i) => i.slug === preselected.value)
        if (item?.parentCategory) {
          finalFilters.sport = item.parentCategory.slug
          // Find sport's parent category
          const sport = hierarchicalCategories.sports.find(
            (s) => s.slug === item.parentCategory?.slug,
          )
          if (sport?.parentCategory) {
            finalFilters.sportsCategory = sport.parentCategory.slug
          }
        }
      } else if (preselected.type === 'brand') {
        finalFilters.brands = [preselected.value]
      }
    }

    // Remove undefined values
    Object.keys(finalFilters).forEach((key) => {
      if (finalFilters[key] === undefined) {
        delete finalFilters[key]
      }
    })

    setMultipleFilters(finalFilters)
    setOpen(false)
    onApplyFilters?.()
  }, [
    pendingFilters,
    priceRange,
    setMultipleFilters,
    onApplyFilters,
    getPreselectedValues,
    hierarchicalCategories,
  ])

  const handleReset = useCallback(() => {
    setPendingFilters({
      search: '',
      sportsCategory: ALL_CATEGORIES,
      sport: ALL_SPORTS,
      sportsItem: ALL_ITEMS,
      brands: [],
      priceRange: [priceRange.min, priceRange.max],
      inStock: false,
      sort: 'createdAt-desc',
    })
    clearFilters()
    setOpen(false)
  }, [priceRange, clearFilters])

  const handleSectionToggle = useCallback((section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }, [])

  const handleHierarchicalChange = useCallback(
    (level: 'sportsCategory' | 'sport' | 'sportsItem', value: string) => {
      setPendingFilters((prev) => {
        const updated = { ...prev, [level]: value }

        // Clear child levels when parent changes
        if (level === 'sportsCategory') {
          updated.sport = ALL_SPORTS
          updated.sportsItem = ALL_ITEMS
        } else if (level === 'sport') {
          updated.sportsItem = ALL_ITEMS
        }

        return updated
      })
    },
    [],
  )

  const handleBrandToggle = useCallback((brandSlug: string) => {
    setPendingFilters((prev) => ({
      ...prev,
      brands: prev.brands.includes(brandSlug)
        ? prev.brands.filter((b) => b !== brandSlug)
        : [...prev.brands, brandSlug],
    }))
  }, [])

  const renderFilterContent = () => {
    if (loading) {
      return (
        <div className="space-y-4 p-4">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      )
    }

    return (
      <ScrollArea className="h-[60vh] px-4 sm:px-6">
        <div className="space-y-4 py-4">
          {/* Preselected Filter Notice */}
          {(() => {
            const preselected = getPreselectedValues()
            if (preselected.type && preselected.value) {
              const getPreselectedName = () => {
                if (preselected.type === 'sportsCategory') {
                  const category = hierarchicalCategories.sportsCategories.find(
                    (c) => c.slug === preselected.value,
                  )
                  return category?.name || preselected.value
                } else if (preselected.type === 'sport') {
                  const sport = hierarchicalCategories.sports.find(
                    (s) => s.slug === preselected.value,
                  )
                  return sport?.name || preselected.value
                } else if (preselected.type === 'sportsItem') {
                  const item = hierarchicalCategories.sportsItems.find(
                    (i) => i.slug === preselected.value,
                  )
                  return item?.name || preselected.value
                } else if (preselected.type === 'brand') {
                  const brand = brands.find((b) => b.slug === preselected.value)
                  return brand?.name || preselected.value
                }
                return preselected.value
              }

              return (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-blue-900 mb-1">Selected from Navigation</h4>
                      <p className="text-blue-700 text-sm">
                        {preselected.type === 'sportsCategory'
                          ? 'Category'
                          : preselected.type === 'sport'
                            ? 'Sport'
                            : preselected.type === 'sportsItem'
                              ? 'Equipment'
                              : 'Brand'}
                        : <strong>{getPreselectedName()}</strong>
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={handleApplyFilters}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              )
            }
            return null
          })()}

          {/* Search */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search products..."
                value={pendingFilters.search}
                onChange={(e) => setPendingFilters((prev) => ({ ...prev, search: e.target.value }))}
                className="pl-10 pr-10"
              />
              {pendingFilters.search && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPendingFilters((prev) => ({ ...prev, search: '' }))}
                  className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>

          {/* Sort */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Sort By</Label>
            <Select
              value={pendingFilters.sort}
              onValueChange={(value) => setPendingFilters((prev) => ({ ...prev, sort: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select sort order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt-desc">Newest First</SelectItem>
                <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="name-asc">Name: A to Z</SelectItem>
                <SelectItem value="name-desc">Name: Z to A</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category Navigation */}
          <Collapsible
            open={expandedSections.categories}
            onOpenChange={() => handleSectionToggle('categories')}
          >
            <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-sm font-medium hover:bg-gray-50 rounded px-2"></CollapsibleTrigger>
            <CollapsibleContent className="pt-2 space-y-3">
              {/* Sports Category */}
              <div className="space-y-1">
                <Label className="text-xs text-gray-600">Sports Category</Label>
                <Select
                  value={pendingFilters.sportsCategory}
                  onValueChange={(value) => handleHierarchicalChange('sportsCategory', value)}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL_CATEGORIES}>All Categories</SelectItem>
                    {hierarchicalCategories.sportsCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                        {cat.productCount > 0 && (
                          <span className="text-gray-500 ml-1">({cat.productCount})</span>
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sport */}
              {pendingFilters.sportsCategory &&
                pendingFilters.sportsCategory !== ALL_CATEGORIES && (
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-600">Sport</Label>
                    <Select
                      value={pendingFilters.sport}
                      onValueChange={(value) => handleHierarchicalChange('sport', value)}
                      disabled={!availableSports.length}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Select sport" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={ALL_SPORTS}>All Sports</SelectItem>
                        {availableSports.map((sport) => (
                          <SelectItem key={sport.id} value={sport.id.toString()}>
                            {sport.name}
                            {sport.productCount > 0 && (
                              <span className="text-gray-500 ml-1">({sport.productCount})</span>
                            )}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

              {/* Sports Item */}
              {pendingFilters.sport && pendingFilters.sport !== ALL_SPORTS && (
                <div className="space-y-1">
                  <Label className="text-xs text-gray-600">Sports Item</Label>
                  <Select
                    value={pendingFilters.sportsItem}
                    onValueChange={(value) => handleHierarchicalChange('sportsItem', value)}
                    disabled={!availableSportsItems.length}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Select item" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ALL_ITEMS}>All Items</SelectItem>
                      {availableSportsItems.map((item) => (
                        <SelectItem key={item.id} value={item.id.toString()}>
                          {item.name}
                          {item.productCount > 0 && (
                            <span className="text-gray-500 ml-1">({item.productCount})</span>
                          )}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>

          {/* Brands */}
          <Collapsible
            open={expandedSections.brands}
            onOpenChange={() => handleSectionToggle('brands')}
          >
            <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-sm font-medium hover:bg-gray-50 rounded px-2">
              <div className="flex items-center gap-2">
                Brands
                {pendingFilters.brands.length > 0 && (
                  <Badge variant="secondary" className="bg-brand-primary text-white text-xs">
                    {pendingFilters.brands.length}
                  </Badge>
                )}
              </div>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  expandedSections.brands ? 'rotate-180' : ''
                }`}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2">
              <ScrollArea className="max-h-40 pr-2">
                <div className="space-y-2">
                  {brands.map((brand) => (
                    <div key={brand.id} className="flex items-center space-x-2 text-sm">
                      <Checkbox
                        id={`brand-${brand.id}`}
                        checked={pendingFilters.brands.includes(brand.slug)}
                        onCheckedChange={() => handleBrandToggle(brand.slug)}
                      />
                      <Label
                        htmlFor={`brand-${brand.id}`}
                        className="cursor-pointer flex-1 text-sm"
                      >
                        {brand.name}
                        {brand.productCount > 0 && (
                          <span className="text-gray-500 ml-1 text-xs">({brand.productCount})</span>
                        )}
                      </Label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CollapsibleContent>
          </Collapsible>

          {/* Price Range */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Price Range</Label>
            <div className="px-1">
              <Slider
                value={pendingFilters.priceRange}
                onValueChange={(value) =>
                  setPendingFilters((prev) => ({ ...prev, priceRange: value as [number, number] }))
                }
                min={priceRange.min}
                max={priceRange.max}
                step={100}
                className="w-full"
              />
              <div className="flex items-center justify-between text-xs mt-2">
                <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                  LKR {pendingFilters.priceRange[0].toLocaleString()}
                </span>
                <span className="text-gray-500">to</span>
                <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                  LKR {pendingFilters.priceRange[1].toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    )
  }

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          {children || (
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 hover:bg-gray-50"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="bg-brand-primary text-white ml-1">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          )}
        </SheetTrigger>
        <SheetContent
          side="right"
          className="w-full p-0 flex flex-col bg-white h-full max-h-[100vh] overflow-hidden"
        >
          <SheetHeader className="flex-shrink-0 px-4 py-4 border-b bg-white">
            <SheetTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <SlidersHorizontal className="h-5 w-5 text-gray-600" />
              Filters
              {currentActiveFiltersCount > 0 && (
                <Badge variant="secondary" className="bg-brand-primary text-white text-xs">
                  {currentActiveFiltersCount}
                </Badge>
              )}
            </SheetTitle>
            <SheetDescription className="text-gray-600 text-sm">
              Filter products to find what you&apos;re looking for
            </SheetDescription>
          </SheetHeader>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-hidden min-h-0">
            <ScrollArea className="h-full px-4">
              <div className="space-y-4 py-4">
                {loading ? (
                  <div className="space-y-4 p-4">
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                  </div>
                ) : (
                  <>
                    {/* Preselected Filter Notice */}
                    {(() => {
                      const preselected = getPreselectedValues()
                      if (preselected.type && preselected.value) {
                        const getPreselectedName = () => {
                          if (preselected.type === 'sportsCategory') {
                            const category = hierarchicalCategories.sportsCategories.find(
                              (c) => c.slug === preselected.value,
                            )
                            return category?.name || preselected.value
                          } else if (preselected.type === 'sport') {
                            const sport = hierarchicalCategories.sports.find(
                              (s) => s.slug === preselected.value,
                            )
                            return sport?.name || preselected.value
                          } else if (preselected.type === 'sportsItem') {
                            const item = hierarchicalCategories.sportsItems.find(
                              (i) => i.slug === preselected.value,
                            )
                            return item?.name || preselected.value
                          } else if (preselected.type === 'brand') {
                            const brand = brands.find((b) => b.slug === preselected.value)
                            return brand?.name || preselected.value
                          }
                          return preselected.value
                        }

                        return (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium text-blue-900 mb-1">
                                  Selected from Navigation
                                </h4>
                                <p className="text-blue-700 text-sm">
                                  {preselected.type === 'sportsCategory'
                                    ? 'Category'
                                    : preselected.type === 'sport'
                                      ? 'Sport'
                                      : preselected.type === 'sportsItem'
                                        ? 'Equipment'
                                        : 'Brand'}
                                  : <strong>{getPreselectedName()}</strong>
                                </p>
                              </div>
                              <Button
                                size="sm"
                                onClick={handleApplyFilters}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                              >
                                Apply
                              </Button>
                            </div>
                          </div>
                        )
                      }
                      return null
                    })()}

                    {/* Search */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Search</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                          type="text"
                          placeholder="Search products..."
                          value={pendingFilters.search}
                          onChange={(e) =>
                            setPendingFilters((prev) => ({ ...prev, search: e.target.value }))
                          }
                          className="pl-10 pr-10"
                        />
                        {pendingFilters.search && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setPendingFilters((prev) => ({ ...prev, search: '' }))}
                            className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Sort */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Sort By</Label>
                      <Select
                        value={pendingFilters.sort}
                        onValueChange={(value) =>
                          setPendingFilters((prev) => ({ ...prev, sort: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select sort order" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="createdAt-desc">Newest First</SelectItem>
                          <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                          <SelectItem value="price-asc">Price: Low to High</SelectItem>
                          <SelectItem value="price-desc">Price: High to Low</SelectItem>
                          <SelectItem value="name-asc">Name: A to Z</SelectItem>
                          <SelectItem value="name-desc">Name: Z to A</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Category Navigation */}
                    <Collapsible
                      open={expandedSections.categories}
                      onOpenChange={() => handleSectionToggle('categories')}
                    >
                      <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-sm font-medium hover:bg-gray-50 rounded px-2">
                        Categories
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${
                            expandedSections.categories ? 'rotate-180' : ''
                          }`}
                        />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="pt-2 space-y-3">
                        {/* Sports Category */}
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-600">Sports Category</Label>
                          <Select
                            value={pendingFilters.sportsCategory}
                            onValueChange={(value) =>
                              handleHierarchicalChange('sportsCategory', value)
                            }
                          >
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={ALL_CATEGORIES}>All Categories</SelectItem>
                              {hierarchicalCategories.sportsCategories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id.toString()}>
                                  {cat.name}
                                  {cat.productCount > 0 && (
                                    <span className="text-gray-500 ml-1">({cat.productCount})</span>
                                  )}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Sport */}
                        {pendingFilters.sportsCategory &&
                          pendingFilters.sportsCategory !== ALL_CATEGORIES && (
                            <div className="space-y-1">
                              <Label className="text-xs text-gray-600">Sport</Label>
                              <Select
                                value={pendingFilters.sport}
                                onValueChange={(value) => handleHierarchicalChange('sport', value)}
                                disabled={!availableSports.length}
                              >
                                <SelectTrigger className="h-9">
                                  <SelectValue placeholder="Select sport" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value={ALL_SPORTS}>All Sports</SelectItem>
                                  {availableSports.map((sport) => (
                                    <SelectItem key={sport.id} value={sport.id.toString()}>
                                      {sport.name}
                                      {sport.productCount > 0 && (
                                        <span className="text-gray-500 ml-1">
                                          ({sport.productCount})
                                        </span>
                                      )}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}

                        {/* Sports Item */}
                        {pendingFilters.sport && pendingFilters.sport !== ALL_SPORTS && (
                          <div className="space-y-1">
                            <Label className="text-xs text-gray-600">Sports Item</Label>
                            <Select
                              value={pendingFilters.sportsItem}
                              onValueChange={(value) =>
                                handleHierarchicalChange('sportsItem', value)
                              }
                              disabled={!availableSportsItems.length}
                            >
                              <SelectTrigger className="h-9">
                                <SelectValue placeholder="Select item" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value={ALL_ITEMS}>All Items</SelectItem>
                                {availableSportsItems.map((item) => (
                                  <SelectItem key={item.id} value={item.id.toString()}>
                                    {item.name}
                                    {item.productCount > 0 && (
                                      <span className="text-gray-500 ml-1">
                                        ({item.productCount})
                                      </span>
                                    )}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </CollapsibleContent>
                    </Collapsible>

                    {/* Brands */}
                    <Collapsible
                      open={expandedSections.brands}
                      onOpenChange={() => handleSectionToggle('brands')}
                    >
                      <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-sm font-medium hover:bg-gray-50 rounded px-2">
                        <div className="flex items-center gap-2">
                          Brands
                          {pendingFilters.brands.length > 0 && (
                            <Badge
                              variant="secondary"
                              className="bg-brand-primary text-white text-xs"
                            >
                              {pendingFilters.brands.length}
                            </Badge>
                          )}
                        </div>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${
                            expandedSections.brands ? 'rotate-180' : ''
                          }`}
                        />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="pt-2">
                        <ScrollArea className="max-h-40 pr-2">
                          <div className="space-y-2">
                            {brands.map((brand) => (
                              <div key={brand.id} className="flex items-center space-x-2 text-sm">
                                <Checkbox
                                  id={`brand-${brand.id}`}
                                  checked={pendingFilters.brands.includes(brand.slug)}
                                  onCheckedChange={() => handleBrandToggle(brand.slug)}
                                />
                                <Label
                                  htmlFor={`brand-${brand.id}`}
                                  className="cursor-pointer flex-1 text-sm"
                                >
                                  {brand.name}
                                  {brand.productCount > 0 && (
                                    <span className="text-gray-500 ml-1 text-xs">
                                      ({brand.productCount})
                                    </span>
                                  )}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </CollapsibleContent>
                    </Collapsible>

                    {/* Price Range */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Price Range</Label>
                      <div className="px-1">
                        <Slider
                          value={pendingFilters.priceRange}
                          onValueChange={(value) =>
                            setPendingFilters((prev) => ({
                              ...prev,
                              priceRange: value as [number, number],
                            }))
                          }
                          min={priceRange.min}
                          max={priceRange.max}
                          step={100}
                          className="w-full"
                        />
                        <div className="flex items-center justify-between text-xs mt-2">
                          <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                            LKR {pendingFilters.priceRange[0].toLocaleString()}
                          </span>
                          <span className="text-gray-500">to</span>
                          <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                            LKR {pendingFilters.priceRange[1].toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Fixed Footer */}
          <div className="flex-shrink-0 px-4 py-4 border-t bg-white">
            <div className="flex gap-3 w-full flex-col">
              {currentActiveFiltersCount > 0 && (
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="flex items-center gap-2 justify-center"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </Button>
              )}
              <Button
                onClick={handleApplyFilters}
                disabled={!hasChanges}
                className="bg-brand-primary hover:bg-brand-primary/90 text-white disabled:bg-gray-300 disabled:text-gray-500"
              >
                Apply Filters
                {currentActiveFiltersCount > 0 && ` (${currentActiveFiltersCount})`}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm" className="flex items-center gap-2 hover:bg-gray-50">
            <Filter className="h-4 w-4" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="bg-brand-primary text-white ml-1">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 gap-0 bg-white border shadow-lg rounded-lg flex flex-col">
        <DialogHeader className="flex-shrink-0 px-6 py-4 border-b bg-white">
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <SlidersHorizontal className="h-5 w-5 text-gray-600" />
            Filters
            {currentActiveFiltersCount > 0 && (
              <Badge variant="secondary" className="bg-brand-primary text-white text-xs">
                {currentActiveFiltersCount}
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-sm">
            Filter products to find what you&apos;re looking for
          </DialogDescription>
        </DialogHeader>

        {renderFilterContent()}

        <DialogFooter className="flex-shrink-0 px-6 py-4 border-t bg-white flex flex-row gap-3">
          <div className="flex gap-3 w-full">
            {currentActiveFiltersCount > 0 && (
              <Button variant="outline" onClick={handleReset} className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            )}
            <Button
              onClick={handleApplyFilters}
              disabled={!hasChanges}
              className="flex-1 bg-brand-primary hover:bg-brand-primary/90 text-white disabled:bg-gray-300 disabled:text-gray-500"
            >
              Apply Filters
              {currentActiveFiltersCount > 0 && ` (${currentActiveFiltersCount})`}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
