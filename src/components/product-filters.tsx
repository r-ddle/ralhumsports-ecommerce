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
import { Search, X, ChevronDown, RotateCcw, Check, SlidersHorizontal } from 'lucide-react'

// Define a more specific type for filters, mirroring ProductQueryParams from the parent
interface FilterState {
  search?: string
  categories?: string[]
  brands?: string[]
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
}

interface ProductFiltersProps {
  categories: Array<{ id: number; name: string; slug: string }>
  brands: Array<{ id: number; name: string; slug: string }>
  priceRange: { min: number; max: number }
  currentFilters: FilterState
  onFiltersChange: (filters: FilterState) => void
  onSortChange: (sort: string, order: string) => void
  onReset: () => void
  isOpen: boolean
  onToggle: () => void
  loading?: boolean
}

export function ProductFilters({
  categories,
  brands,
  priceRange,
  currentFilters,
  onFiltersChange,
  onSortChange,
  onReset,
  loading = false,
}: ProductFiltersProps) {
  // Local state for filter inputs
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [priceFilter, setPriceFilter] = useState<[number, number]>([priceRange.min, priceRange.max])
  const [stockFilter, setStockFilter] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    search: true,
    sort: true,
    categories: true,
    brands: true,
    price: true,
    stock: true,
  })

  // Effect to synchronize local state when parent filters change (e.g., on reset)
  useEffect(() => {
    // Guard against undefined props during initial renders
    if (!loading && currentFilters) {
      setSearchTerm(currentFilters.search || '')
      setSelectedCategories(currentFilters.categories || [])
      setSelectedBrands(currentFilters.brands || [])
      // Ensure priceRange is valid before setting state
      if (priceRange.min !== undefined && priceRange.max !== undefined) {
        setPriceFilter([
          currentFilters.minPrice || priceRange.min,
          currentFilters.maxPrice || priceRange.max,
        ])
      }
      setStockFilter(currentFilters.inStock || false)
    }
  }, [currentFilters, priceRange, loading])

  const handleCategoryChange = (categorySlug: string, checked: boolean) => {
    setSelectedCategories((prev) =>
      checked ? [...prev, categorySlug] : prev.filter((c) => c !== categorySlug),
    )
  }

  const handleBrandChange = (brandSlug: string, checked: boolean) => {
    setSelectedBrands((prev) =>
      checked ? [...prev, brandSlug] : prev.filter((b) => b !== brandSlug),
    )
  }

  const handlePriceChange = (value: [number, number]) => {
    setPriceFilter(value)
  }

  const handleStockChange = (checked: boolean) => {
    setStockFilter(checked)
  }

  // Combine all local filter states and send them to the parent
  const handleApplyFilters = () => {
    onFiltersChange({
      search: searchTerm || undefined,
      categories: selectedCategories.length > 0 ? selectedCategories : undefined,
      brands: selectedBrands.length > 0 ? selectedBrands : undefined,
      minPrice: priceFilter[0] > priceRange.min ? priceFilter[0] : undefined,
      maxPrice: priceFilter[1] < priceRange.max ? priceFilter[1] : undefined,
      inStock: stockFilter || undefined,
    })
  }

  const handleReset = () => {
    // Reset local state and then call parent's reset function
    setSearchTerm('')
    setSelectedCategories([])
    setSelectedBrands([])
    setPriceFilter([priceRange.min, priceRange.max])
    setStockFilter(false)
    onReset()
  }

  const handleSectionToggle = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  // Memoize active filters count for performance
  const activeFiltersCount = useMemo(() => {
    return [
      searchTerm,
      selectedCategories.length > 0,
      selectedBrands.length > 0,
      priceFilter[0] > priceRange.min || priceFilter[1] < priceRange.max,
      stockFilter,
    ].filter(Boolean).length
  }, [searchTerm, selectedCategories, selectedBrands, priceFilter, priceRange, stockFilter])

  if (loading) {
    return (
      <div className="space-y-4 p-6">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    )
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        handleApplyFilters()
      }}
      className="w-full"
    >
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
                  onClick={() => setSearchTerm('')}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>
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
            <div className="space-y-2">
              <Select
                onValueChange={(value) => {
                  const [sort, order] = value.split('-')
                  onSortChange(sort, order)
                }}
              >
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
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Categories */}
        <Collapsible
          open={expandedSections.categories}
          onOpenChange={() => handleSectionToggle('categories')}
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full p-0 hover:no-underline">
            <h3 className="text-sm font-semibold">Categories</h3>
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
                <div key={category.id} className="flex items-center space-x-2">
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
                    {category.name}
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
                <div key={brand.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`brand-${brand.id}`}
                    checked={selectedBrands.includes(brand.slug)}
                    onCheckedChange={(checked) => handleBrandChange(brand.slug, checked as boolean)}
                  />
                  <Label
                    htmlFor={`brand-${brand.id}`}
                    className="text-sm font-medium cursor-pointer flex-1 hover:text-primary transition-colors"
                  >
                    {brand.name}
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
                      const value = parseInt(e.target.value) || priceRange.min
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
                      const value = parseInt(e.target.value) || priceRange.max
                      handlePriceChange([priceFilter[0], value])
                    }}
                    className="text-sm"
                  />
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                Range: ${priceRange.min.toLocaleString()} - ${priceRange.max.toLocaleString()}
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

        {/* Apply Filters Button */}
        <div className="pt-4">
          <Button type="submit" className="w-full">
            <Check className="w-4 h-4 mr-2" />
            Apply Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </Button>
        </div>
      </CardContent>
    </form>
  )
}
