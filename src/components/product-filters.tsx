'use client'

import type React from 'react'
import { useState, useEffect, useMemo, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Search, X, ChevronDown, RotateCcw, SlidersHorizontal } from 'lucide-react'
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

interface ProductFiltersProps {
  categories: Category[]
  hierarchicalCategories: HierarchicalCategories
  brands: Brand[]
  priceRange: { min: number; max: number }
  loading?: boolean
  onApplyFilters?: () => void
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

export function EnhancedProductFilters({
  categories,
  hierarchicalCategories,
  brands,
  priceRange,
  loading = false,
  onApplyFilters,
}: ProductFiltersProps) {
  const { filters, setMultipleFilters, clearFilters, getPreselectedValues } = useProductFilters()

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

  // UI state with mobile-optimized defaults
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    search: true,
    sort: false, // Collapsed on mobile by default
    categories: false,
    brands: false,
    price: false,
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

  // Calculate active filters count
  const activeFiltersCount = useMemo(() => {
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

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <Skeleton className="h-8 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full sticky top-4">
      <CardHeader className="pb-3 sm:pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-1.5 sm:gap-2 text-base sm:text-lg">
            <SlidersHorizontal className="h-4 w-4 sm:h-5 sm:w-5" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-1 sm:ml-2 text-xs">
                {activeFiltersCount}
              </Badge>
            )}
          </CardTitle>
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="h-7 sm:h-8 px-2 text-xs"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Reset
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3 sm:space-y-4 pb-3 sm:pb-4">
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
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">Selected from Navigation</h4>
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
                    Apply Filter
                  </Button>
                </div>
              </div>
            )
          }
          return null
        })()}

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search products..."
            value={pendingFilters.search}
            onChange={(e) => setPendingFilters((prev) => ({ ...prev, search: e.target.value }))}
            className="pl-9 pr-9 h-9 sm:h-10"
          />
          {pendingFilters.search && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPendingFilters((prev) => ({ ...prev, search: '' }))}
              className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <Separator />

        {/* Sort */}
        <Collapsible open={true} onOpenChange={() => handleSectionToggle('sort')}>
          <CollapsibleTrigger className="flex w-full items-center justify-between font-medium text-sm hover:text-primary">
            Sort By
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                expandedSections.sort ? 'rotate-180' : ''
              }`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2">
            <Select
              value={pendingFilters.sort}
              onValueChange={(value) => setPendingFilters((prev) => ({ ...prev, sort: value }))}
            >
              <SelectTrigger className="h-9 sm:h-10">
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
          </CollapsibleContent>
        </Collapsible>

        {/* Category Navigation */}
        <Collapsible
          open={expandedSections.categories}
          onOpenChange={() => handleSectionToggle('categories')}
        >
          <CollapsibleTrigger className="flex w-full items-center justify-between py-1.5 sm:py-2 font-medium text-sm hover:text-primary">
            Category Navigation
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                expandedSections.categories ? 'rotate-180' : ''
              }`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 space-y-2 sm:space-y-3">
            {/* Sports Category */}
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Sports Category</Label>
              <Select
                value={pendingFilters.sportsCategory}
                onValueChange={(value) => handleHierarchicalChange('sportsCategory', value)}
              >
                <SelectTrigger className="w-full h-9 sm:h-10">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_CATEGORIES}>All Categories</SelectItem>
                  {hierarchicalCategories.sportsCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                      {cat.productCount > 0 && (
                        <span className="text-muted-foreground ml-1">({cat.productCount})</span>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sport */}
            {pendingFilters.sportsCategory && pendingFilters.sportsCategory !== ALL_CATEGORIES && (
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Sport</Label>
                <Select
                  value={pendingFilters.sport}
                  onValueChange={(value) => handleHierarchicalChange('sport', value)}
                  disabled={!availableSports.length}
                >
                  <SelectTrigger className="w-full h-9 sm:h-10">
                    <SelectValue placeholder="Select sport" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL_SPORTS}>All Sports</SelectItem>
                    {availableSports.map((sport) => (
                      <SelectItem key={sport.id} value={sport.id.toString()}>
                        {sport.name}
                        {sport.productCount > 0 && (
                          <span className="text-muted-foreground ml-1">({sport.productCount})</span>
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Sports Item */}
            {pendingFilters.sport && pendingFilters.sport !== ALL_SPORTS && (
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Sports Item</Label>
                <Select
                  value={pendingFilters.sportsItem}
                  onValueChange={(value) => handleHierarchicalChange('sportsItem', value)}
                  disabled={!availableSportsItems.length}
                >
                  <SelectTrigger className="w-full h-9 sm:h-10">
                    <SelectValue placeholder="Select item" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL_ITEMS}>All Items</SelectItem>
                    {availableSportsItems.map((item) => (
                      <SelectItem key={item.id} value={item.id.toString()}>
                        {item.name}
                        {item.productCount > 0 && (
                          <span className="text-muted-foreground ml-1">({item.productCount})</span>
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
        <Collapsible open={true} onOpenChange={() => handleSectionToggle('brands')}>
          <CollapsibleTrigger className="flex w-full items-center justify-between py-1.5 sm:py-2 font-medium text-sm hover:text-primary">
            Brands
            {pendingFilters.brands.length > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {pendingFilters.brands.length}
              </Badge>
            )}
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                expandedSections.brands ? 'rotate-180' : ''
              }`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2">
            <div className="space-y-1.5 sm:space-y-2 max-h-48 sm:max-h-64 overflow-y-auto">
              {brands.map((brand) => (
                <div key={brand.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`brand-${brand.id}`}
                    checked={pendingFilters.brands.includes(brand.slug)}
                    onCheckedChange={() => handleBrandToggle(brand.slug)}
                  />
                  <Label
                    htmlFor={`brand-${brand.id}`}
                    className="text-sm font-normal cursor-pointer flex-1 leading-none"
                  >
                    {brand.name}
                    {brand.productCount > 0 && (
                      <span className="text-muted-foreground ml-1 text-xs">
                        ({brand.productCount})
                      </span>
                    )}
                  </Label>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Price Range */}
        <Collapsible open={true} onOpenChange={() => handleSectionToggle('price')}>
          <CollapsibleTrigger className="flex w-full items-center justify-between py-1.5 sm:py-2 font-medium text-sm hover:text-primary">
            Price Range
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                expandedSections.price ? 'rotate-180' : ''
              }`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2">
            <div className="space-y-3 sm:space-y-4">
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
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="font-medium">
                  LKR {pendingFilters.priceRange[0].toLocaleString()}
                </span>
                <span className="text-muted-foreground">to</span>
                <span className="font-medium">
                  LKR {pendingFilters.priceRange[1].toLocaleString()}
                </span>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Stock Status
        <Collapsible
          open={expandedSections.stock}
          onOpenChange={() => handleSectionToggle('stock')}
        >
          <CollapsibleTrigger className="flex w-full items-center justify-between py-1.5 sm:py-2 font-medium text-sm hover:text-primary">
            Stock Status
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                expandedSections.stock ? 'rotate-180' : ''
              }`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="in-stock" className="text-sm font-normal cursor-pointer">
                Only show in-stock items
              </Label>
              <Switch
                id="in-stock"
                checked={pendingFilters.inStock}
                onCheckedChange={(checked) =>
                  setPendingFilters((prev) => ({ ...prev, inStock: checked }))
                }
              />
            </div>
          </CollapsibleContent>
        </Collapsible> */}

        {/* Apply Filters Button */}
        <Button
          onClick={handleApplyFilters}
          disabled={!hasChanges}
          className="w-full h-10 sm:h-11"
          size="lg"
        >
          Apply Filters
          {activeFiltersCount > 0 && ` (${activeFiltersCount})`}
        </Button>
      </CardContent>
    </Card>
  )
}
