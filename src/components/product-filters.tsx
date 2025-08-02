'use client'

import type React from 'react'
import { useState, useEffect, useMemo } from 'react'
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
import { Search, X, ChevronDown, RotateCcw, SlidersHorizontal, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useProductFilters } from '@/hooks/useProductFilters'

// Types for hierarchical API data
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
}

export function EnhancedProductFilters({
  categories,
  hierarchicalCategories,
  brands,
  priceRange,
  loading = false,
}: ProductFiltersProps) {
  const { filters, addFilter, removeFilter, clearFilters, setMultipleFilters } = useProductFilters()

  // Local state for form inputs
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [hierarchicalFilters, setHierarchicalFilters] = useState({
    sportsCategory: '',
    sport: '',
    sportsItem: '',
  })
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [priceFilter, setPriceFilter] = useState<[number, number]>([priceRange.min, priceRange.max])
  const [stockFilter, setStockFilter] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    search: true,
    sort: true,
    hierarchical: true,
    categories: true,
    brands: true,
    price: true,
    stock: true,
  })

  // Derived state for hierarchical filtering
  const [availableSports, setAvailableSports] = useState<Category[]>([])
  const [availableSportsItems, setAvailableSportsItems] = useState<Category[]>([])

  // Update available options based on parent selection
  useEffect(() => {
    if (hierarchicalFilters.sportsCategory) {
      const filteredSports = hierarchicalCategories.sports.filter(
        (sport) => sport.parentCategory?.id.toString() === hierarchicalFilters.sportsCategory,
      )
      setAvailableSports(filteredSports)
    } else {
      setAvailableSports([])
    }
  }, [hierarchicalFilters.sportsCategory, hierarchicalCategories.sports])

  useEffect(() => {
    if (hierarchicalFilters.sport) {
      const filteredSportsItems = hierarchicalCategories.sportsItems.filter(
        (sportsItem) => sportsItem.parentCategory?.id.toString() === hierarchicalFilters.sport,
      )
      setAvailableSportsItems(filteredSportsItems)
    } else {
      setAvailableSportsItems([])
    }
  }, [hierarchicalFilters.sport, hierarchicalCategories.sportsItems])

  // Sync local state with URL filters
  useEffect(() => {
    setSearchTerm(filters.search || '')
    setSelectedCategories(filters.categories || [])
    setSelectedBrands(filters.brands || [])
    setPriceFilter([filters.minPrice || priceRange.min, filters.maxPrice || priceRange.max])
    setStockFilter(filters.inStock || false)

    // Sync hierarchical filters
    setHierarchicalFilters({
      sportsCategory: filters.sportsCategory || '',
      sport: filters.sport || '',
      sportsItem: filters.sportsItem || '',
    })
  }, [filters, priceRange])

  const handleCategoryChange = (categorySlug: string, checked: boolean) => {
    const newCategories = checked
      ? [...selectedCategories, categorySlug]
      : selectedCategories.filter((c) => c !== categorySlug)

    setSelectedCategories(newCategories)

    if (newCategories.length > 0) {
      addFilter('categories', newCategories)
    } else {
      removeFilter('categories')
    }
  }

  const handleBrandChange = (brandSlug: string, checked: boolean) => {
    const newBrands = checked
      ? [...selectedBrands, brandSlug]
      : selectedBrands.filter((b) => b !== brandSlug)

    setSelectedBrands(newBrands)

    if (newBrands.length > 0) {
      addFilter('brands', newBrands)
    } else {
      removeFilter('brands')
    }
  }

  const handlePriceChange = (value: [number, number]) => {
    setPriceFilter(value)

    const newFilters: any = {}
    if (value[0] > priceRange.min) newFilters.minPrice = value[0]
    if (value[1] < priceRange.max) newFilters.maxPrice = value[1]

    if (Object.keys(newFilters).length > 0) {
      Object.entries(newFilters).forEach(([key, val]) => {
        addFilter(key as any, val)
      })
    } else {
      removeFilter('minPrice')
      removeFilter('maxPrice')
    }
  }

  const handleStockChange = (checked: boolean) => {
    setStockFilter(checked)

    if (checked) {
      addFilter('inStock', true)
    } else {
      removeFilter('inStock')
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (searchTerm.trim()) {
      addFilter('search', searchTerm.trim())
    } else {
      removeFilter('search')
    }
  }

  // Debounced search for real-time updates
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchTerm.trim() !== (filters.search || '')) {
        if (searchTerm.trim()) {
          addFilter('search', searchTerm.trim())
        } else {
          removeFilter('search')
        }
      }
    }, 300) // 300ms debounce

    return () => clearTimeout(debounceTimer)
  }, [searchTerm, filters.search, addFilter, removeFilter])

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split('-')
    addFilter('sort', sortBy)
    addFilter('order', sortOrder)
  }

  const handleHierarchicalCategoryChange = (
    level: 'sportsCategory' | 'sport' | 'sportsItem',
    value: string,
  ) => {
    setHierarchicalFilters((prev) => {
      const newFilters = { ...prev }

      // Set the selected level
      newFilters[level] = value

      // Clear child levels when parent changes
      if (level === 'sportsCategory') {
        newFilters.sport = ''
        newFilters.sportsItem = ''
        removeFilter('sport')
        removeFilter('sportsItem')
      } else if (level === 'sport') {
        newFilters.sportsItem = ''
        removeFilter('sportsItem')
      }

      // Update URL filters
      if (value) {
        addFilter(level, value)
      } else {
        removeFilter(level)
      }

      return newFilters
    })
  }

  const handleReset = () => {
    setSearchTerm('')
    setSelectedCategories([])
    setSelectedBrands([])
    setPriceFilter([priceRange.min, priceRange.max])
    setStockFilter(false)
    setHierarchicalFilters({
      sportsCategory: '',
      sport: '',
      sportsItem: '',
    })
    clearFilters()
  }

  const handleSectionToggle = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  // Calculate active filters count
  const activeFiltersCount = useMemo(() => {
    return [
      filters.search,
      filters.categories?.length,
      filters.brands?.length,
      filters.minPrice || filters.maxPrice,
      filters.inStock,
      filters.sportsCategory,
      filters.sport,
      filters.sportsItem,
    ].filter(Boolean).length
  }, [filters])

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <Skeleton className="h-8 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5" />
            Filters
          </CardTitle>
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {activeFiltersCount}
              </Badge>
            )}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-xs h-7 px-2"
              disabled={activeFiltersCount === 0}
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Reset
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Search */}
        <Collapsible
          open={expandedSections.search}
          onOpenChange={() => handleSectionToggle('search')}
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full p-0 hover:no-underline">
            <h3 className="text-sm font-semibold">Search</h3>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${expandedSections.search ? 'rotate-180' : ''}`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-10"
                />
                {searchTerm && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchTerm('')
                      removeFilter('search')
                    }}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100"
                    title="Clear search"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                )}
              </div>
              {searchTerm && (
                <div className="mt-2 text-xs text-muted-foreground">
                  Press Enter to search or wait for auto-search
                </div>
              )}
            </form>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Sort */}
        <Collapsible open={expandedSections.sort} onOpenChange={() => handleSectionToggle('sort')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-0 hover:no-underline">
            <h3 className="text-sm font-semibold">Sort By</h3>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${expandedSections.sort ? 'rotate-180' : ''}`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">
            <Select onValueChange={handleSortChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select sorting" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt-desc">Newest First</SelectItem>
                <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                <SelectItem value="name-asc">Name: A to Z</SelectItem>
                <SelectItem value="name-desc">Name: Z to A</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Hierarchical Category Selection */}
        <Collapsible
          open={expandedSections.hierarchical}
          onOpenChange={() => handleSectionToggle('hierarchical')}
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full p-0 hover:no-underline">
            <h3 className="text-sm font-semibold">Category Navigation</h3>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${expandedSections.hierarchical ? 'rotate-180' : ''}`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">
            <div className="space-y-4">
              {/* Sports Category (Level 1) */}
              <div>
                <Label className="text-xs font-medium text-gray-600 mb-2 block">
                  🏆 Sports Category
                </Label>
                <Select
                  value={hierarchicalFilters.sportsCategory}
                  onValueChange={(value) =>
                    handleHierarchicalCategoryChange('sportsCategory', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select sports category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {hierarchicalCategories.sportsCategories.map((category) => (
                      <SelectItem
                        key={`sports-category-${category.id}`}
                        value={category.id.toString()}
                      >
                        {category.name} ({category.productCount})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sport (Level 2) */}
              {hierarchicalFilters.sportsCategory && (
                <div className="animate-fade-in">
                  <Label className="text-xs font-medium text-gray-600 mb-2 block">⚽ Sport</Label>
                  <Select
                    value={hierarchicalFilters.sport}
                    onValueChange={(value) => handleHierarchicalCategoryChange('sport', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select sport" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sports</SelectItem>
                      {availableSports.map((category) => (
                        <SelectItem key={`sport-${category.id}`} value={category.id.toString()}>
                          {category.name} ({category.productCount})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Sports Item (Level 3) */}
              {hierarchicalFilters.sport && (
                <div className="animate-fade-in">
                  <Label className="text-xs font-medium text-gray-600 mb-2 block">
                    👕 Sports Item
                  </Label>
                  <Select
                    value={hierarchicalFilters.sportsItem}
                    onValueChange={(value) => handleHierarchicalCategoryChange('sportsItem', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select sports item" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Items</SelectItem>
                      {availableSportsItems.map((category) => (
                        <SelectItem
                          key={`sports-item-${category.id}`}
                          value={category.id.toString()}
                        >
                          {category.name} ({category.productCount})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Categories */}
        {/* Hierarchical Category Display */}
        {(hierarchicalFilters.sportsCategory ||
          hierarchicalFilters.sport ||
          hierarchicalFilters.sportsItem) && (
          <>
            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-sm font-semibold text-blue-800 mb-2">Active Navigation Path</h3>
              <div className="flex items-center gap-2 text-sm">
                {hierarchicalFilters.sportsCategory && (
                  <>
                    <span className="px-2 py-1 bg-blue-600 text-white rounded text-xs font-medium">
                      {hierarchicalFilters.sportsCategory
                        .replace(/-/g, ' ')
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </span>
                    {(hierarchicalFilters.sport || hierarchicalFilters.sportsItem) && (
                      <ChevronRight className="w-3 h-3 text-blue-600" />
                    )}
                  </>
                )}
                {hierarchicalFilters.sport && (
                  <>
                    <span className="px-2 py-1 bg-blue-500 text-white rounded text-xs font-medium">
                      {hierarchicalFilters.sport
                        .replace(/-/g, ' ')
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </span>
                    {hierarchicalFilters.sportsItem && (
                      <ChevronRight className="w-3 h-3 text-blue-600" />
                    )}
                  </>
                )}
                {hierarchicalFilters.sportsItem && (
                  <span className="px-2 py-1 bg-blue-400 text-white rounded text-xs font-medium">
                    {hierarchicalFilters.sportsItem
                      .replace(/-/g, ' ')
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </span>
                )}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  removeFilter('sportsCategory')
                  removeFilter('sport')
                  removeFilter('sportsItem')
                  removeFilter('categories')
                }}
                className="text-xs h-6 px-2 mt-2 text-blue-700 hover:text-blue-900"
              >
                <X className="w-3 h-3 mr-1" />
                Clear Path
              </Button>
            </div>
            <Separator />
          </>
        )}

        <Collapsible
          open={expandedSections.categories}
          onOpenChange={() => handleSectionToggle('categories')}
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full p-0 hover:no-underline">
            <h3 className="text-sm font-semibold">Additional Categories</h3>
            <div className="flex items-center gap-2">
              {selectedCategories.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {selectedCategories.length}
                </Badge>
              )}
              <ChevronDown
                className={`w-4 h-4 transition-transform ${expandedSections.categories ? 'rotate-180' : ''}`}
              />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {categories.map((category) => (
                <div key={`category-${category.id}`} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={selectedCategories.includes(category.slug)}
                    onCheckedChange={(checked) =>
                      handleCategoryChange(category.slug, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`category-${category.id}`}
                    className="text-sm font-medium cursor-pointer flex-1 hover:text-primary transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span>{category.name}</span>
                      <span className="text-xs text-muted-foreground">{category.productCount}</span>
                    </div>
                  </Label>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Brands */}
        <Collapsible
          open={expandedSections.brands}
          onOpenChange={() => handleSectionToggle('brands')}
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full p-0 hover:no-underline">
            <h3 className="text-sm font-semibold">Brands</h3>
            <div className="flex items-center gap-2">
              {selectedBrands.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {selectedBrands.length}
                </Badge>
              )}
              <ChevronDown
                className={`w-4 h-4 transition-transform ${expandedSections.brands ? 'rotate-180' : ''}`}
              />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {brands.map((brand) => (
                <div key={`brand-${brand.id}`} className="flex items-center space-x-3">
                  <Checkbox
                    id={`brand-${brand.id}`}
                    checked={selectedBrands.includes(brand.slug)}
                    onCheckedChange={(checked) => handleBrandChange(brand.slug, checked as boolean)}
                  />
                  {brand.logo && (
                    <div className="w-6 h-6 flex-shrink-0">
                      <img
                        src={brand.logo.url}
                        alt={brand.logo.alt}
                        className="w-full h-full object-contain rounded-sm"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                        }}
                      />
                    </div>
                  )}
                  <Label
                    htmlFor={`brand-${brand.id}`}
                    className="text-sm font-medium cursor-pointer flex-1 hover:text-primary transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span>{brand.name}</span>
                      <span className="text-xs text-muted-foreground">{brand.productCount}</span>
                    </div>
                  </Label>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Price Range */}
        <Collapsible
          open={expandedSections.price}
          onOpenChange={() => handleSectionToggle('price')}
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full p-0 hover:no-underline">
            <h3 className="text-sm font-semibold">Price Range</h3>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${expandedSections.price ? 'rotate-180' : ''}`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="min-price" className="text-xs text-muted-foreground">
                    Min Price
                  </Label>
                  <Input
                    id="min-price"
                    type="number"
                    placeholder="Min"
                    value={priceFilter[0]}
                    onChange={(e) => {
                      const value = Number.parseInt(e.target.value) || priceRange.min
                      handlePriceChange([value, priceFilter[1]])
                    }}
                    className="text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="max-price" className="text-xs text-muted-foreground">
                    Max Price
                  </Label>
                  <Input
                    id="max-price"
                    type="number"
                    placeholder="Max"
                    value={priceFilter[1]}
                    onChange={(e) => {
                      const value = Number.parseInt(e.target.value) || priceRange.max
                      handlePriceChange([priceFilter[0], value])
                    }}
                    className="text-sm"
                  />
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                Range: Rs.{priceRange.min.toLocaleString()} - Rs.{priceRange.max.toLocaleString()}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Availability */}
        <Collapsible
          open={expandedSections.stock}
          onOpenChange={() => handleSectionToggle('stock')}
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full p-0 hover:no-underline">
            <h3 className="text-sm font-semibold">Availability</h3>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${expandedSections.stock ? 'rotate-180' : ''}`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">
            <div className="flex items-center space-x-2">
              <Checkbox id="in-stock" checked={stockFilter} onCheckedChange={handleStockChange} />
              <Label
                htmlFor="in-stock"
                className="text-sm font-medium cursor-pointer hover:text-primary transition-colors"
              >
                In Stock Only
              </Label>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  )
}
