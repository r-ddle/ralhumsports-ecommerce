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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  Search,
  X,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  Filter,
  RotateCcw,
  Check,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Checkbox } from '@/components/ui/checkbox'

interface ProductFiltersProps {
  categories: Array<{ id: number; name: string; slug: string }>
  brands: Array<{ id: number; name: string; slug: string }>
  priceRange: { min: number; max: number }
  currentFilters: {
    search?: string
    category?: string
    brand?: string
    sort?: string
    order?: string
    minPrice?: number
    maxPrice?: number
    inStock?: boolean
  }
  onFiltersChange: (filters: any) => void
  onSortChange: (sort: string, order: string) => void
  onSearchChange: (search: string) => void
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
  onSearchChange,
  onReset,
  isOpen,
  onToggle,
  loading = false,
}: ProductFiltersProps) {
  // State management
  const [searchTerm, setSearchTerm] = useState(currentFilters.search || '')
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    currentFilters.category ? [currentFilters.category] : [],
  )
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    currentFilters.brand ? [currentFilters.brand] : [],
  )
  const [priceFilter, setPriceFilter] = useState<[number, number]>([
    currentFilters.minPrice || priceRange.min,
    currentFilters.maxPrice || priceRange.max,
  ])
  const [stockFilter, setStockFilter] = useState(currentFilters.inStock || false)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    search: true,
    sort: true,
    categories: true,
    brands: true,
    price: true,
    stock: true,
  })

  // Handlers now only update local state
  const handleCategoryChange = (categorySlug: string, checked: boolean) => {
    let newCategories: string[]
    if (checked) {
      newCategories = [...selectedCategories, categorySlug]
    } else {
      newCategories = selectedCategories.filter((c) => c !== categorySlug)
    }
    setSelectedCategories(newCategories)
  }

  const handleBrandChange = (brandSlug: string, checked: boolean) => {
    let newBrands: string[]
    if (checked) {
      newBrands = [...selectedBrands, brandSlug]
    } else {
      newBrands = selectedBrands.filter((b) => b !== brandSlug)
    }
    setSelectedBrands(newBrands)
  }

  const handlePriceChange = (value: [number, number]) => {
    setPriceFilter(value)
  }

  const handleStockChange = (checked: boolean) => {
    setStockFilter(checked)
  }

  // Apply filters only when button is clicked
  const handleApplyFilters = () => {
    onFiltersChange({
      category: selectedCategories.length > 0 ? selectedCategories[0] : undefined,
      brand: selectedBrands.length > 0 ? selectedBrands[0] : undefined,
      minPrice: priceFilter[0] > priceRange.min ? priceFilter[0] : undefined,
      maxPrice: priceFilter[1] < priceRange.max ? priceFilter[1] : undefined,
      inStock: stockFilter || undefined,
    })
    onSearchChange(searchTerm)
    // Optionally close the filter panel on mobile
    if (onToggle) onToggle()
  }

  const handleSectionToggle = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const handleReset = () => {
    setSearchTerm('')
    setSelectedCategories([])
    setSelectedBrands([])
    setPriceFilter([priceRange.min, priceRange.max])
    setStockFilter(false)
    onReset()
  }

  // Get active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (searchTerm) count++
    if (selectedCategories.length > 0) count++
    if (selectedBrands.length > 0) count++
    if (priceFilter[0] > priceRange.min || priceFilter[1] < priceRange.max) count++
    if (stockFilter) count++
    return count
  }, [searchTerm, selectedCategories, selectedBrands, priceFilter, priceRange, stockFilter])

  // Performance optimization
  const prefersReducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false

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
        return false
      }}
      className="w-full"
    >
      {/* Header */}
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-text-primary flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-brand-primary" />
            Filters
          </CardTitle>
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {activeFiltersCount}
              </Badge>
            )}
            <Button
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
            <h3 className="text-sm font-semibold text-text-primary">Search</h3>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${expandedSections.search ? 'rotate-180' : ''}`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                  }
                }}
                className="pl-10 pr-10 bg-brand-background border-brand-border focus:border-brand-primary"
              />
              {searchTerm && (
                <Button
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
            <h3 className="text-sm font-semibold text-text-primary">Sort By</h3>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${expandedSections.sort ? 'rotate-180' : ''}`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">
            <div className="space-y-2">
              <Select
                value={`${currentFilters.sort || 'createdAt'}-${currentFilters.order || 'desc'}`}
                onValueChange={(value) => {
                  const [sort, order] = value.split('-')
                  onSortChange(sort, order)
                }}
              >
                <SelectTrigger className="bg-brand-background border-brand-border">
                  <SelectValue />
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
            <h3 className="text-sm font-semibold text-text-primary">Categories</h3>
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
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {categories.map((category) => (
                <motion.div
                  key={category.id}
                  className="flex items-center space-x-2"
                  initial={prefersReducedMotion ? false : { opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
                >
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={selectedCategories.includes(category.slug)}
                    onCheckedChange={(checked) =>
                      handleCategoryChange(category.slug, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`category-${category.id}`}
                    className="text-sm font-medium text-text-primary cursor-pointer flex-1 hover:text-brand-primary transition-colors"
                  >
                    {category.name}
                  </Label>
                </motion.div>
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
            <h3 className="text-sm font-semibold text-text-primary">Brands</h3>
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
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {brands.map((brand) => (
                <motion.div
                  key={brand.id}
                  className="flex items-center space-x-2"
                  initial={prefersReducedMotion ? false : { opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
                >
                  <Checkbox
                    id={`brand-${brand.id}`}
                    checked={selectedBrands.includes(brand.slug)}
                    onCheckedChange={(checked) => handleBrandChange(brand.slug, checked as boolean)}
                  />
                  <Label
                    htmlFor={`brand-${brand.id}`}
                    className="text-sm font-medium text-text-primary cursor-pointer flex-1 hover:text-brand-primary transition-colors"
                  >
                    {brand.name}
                  </Label>
                </motion.div>
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
            <h3 className="text-sm font-semibold text-text-primary">Price Range</h3>
            <div className="flex items-center gap-2">
              {(priceFilter[0] > priceRange.min || priceFilter[1] < priceRange.max) && (
                <Badge variant="secondary" className="text-xs">
                  Active
                </Badge>
              )}
              <ChevronDown
                className={`w-4 h-4 transition-transform ${expandedSections.price ? 'rotate-180' : ''}`}
              />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={priceFilter[0]}
                  onChange={(e) => {
                    e.preventDefault()
                    const value = parseInt(e.target.value) || priceRange.min
                    handlePriceChange([value, priceFilter[1]])
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                    }
                  }}
                  className="text-sm bg-brand-background border-brand-border"
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={priceFilter[1]}
                  onChange={(e) => {
                    e.preventDefault()
                    const value = parseInt(e.target.value) || priceRange.max
                    handlePriceChange([priceFilter[0], value])
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                    }
                  }}
                  className="text-sm bg-brand-background border-brand-border"
                />
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
            <h3 className="text-sm font-semibold text-text-primary">Availability</h3>
            <div className="flex items-center gap-2">
              {stockFilter && (
                <Badge variant="secondary" className="text-xs">
                  In Stock
                </Badge>
              )}
              <ChevronDown
                className={`w-4 h-4 transition-transform ${expandedSections.stock ? 'rotate-180' : ''}`}
              />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">
            <div className="flex items-center space-x-2">
              <Checkbox id="in-stock" checked={stockFilter} onCheckedChange={handleStockChange} />
              <Label
                htmlFor="in-stock"
                className="text-sm font-medium text-text-primary cursor-pointer hover:text-brand-primary transition-colors"
              >
                In Stock Only
              </Label>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Apply Filters Button */}
        <div className="pt-4">
          <Button
            type="button"
            onClick={handleApplyFilters}
            className="w-full bg-brand-primary hover:bg-primary-600"
          >
            <Check className="w-4 h-4 mr-2" />
            Apply Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </Button>
        </div>
      </CardContent>
    </form>
  )
}
