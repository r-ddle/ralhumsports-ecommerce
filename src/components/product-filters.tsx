'use client'

import { useState } from 'react'
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
import { Filter, Search, X, ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react'
import { Category, Brand, ProductQueryParams } from '@/types/api'
import { PRODUCT_SORT_OPTIONS } from '@/types/api'

interface ProductFiltersProps {
  categories: Category[]
  brands: Brand[]
  priceRange: { min: number; max: number }
  currentFilters: ProductQueryParams
  onFiltersChange: (filters: ProductQueryParams) => void
  onSortChange: (
    sortField: 'name' | 'createdAt' | 'updatedAt' | 'price',
    sortOrder: 'asc' | 'desc',
  ) => void
  onSearchChange: (query: string) => void
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
  const [searchQuery, setSearchQuery] = useState(currentFilters.search || '')
  const [selectedCategory, setSelectedCategory] = useState(currentFilters.category || '')
  const [selectedBrand, setSelectedBrand] = useState(currentFilters.brand || '')
  const [minPrice, setMinPrice] = useState(currentFilters.minPrice?.toString() || '')
  const [maxPrice, setMaxPrice] = useState(currentFilters.maxPrice?.toString() || '')
  const [inStockOnly, setInStockOnly] = useState(currentFilters.inStock || false)

  const [categoryOpen, setCategoryOpen] = useState(true)
  const [brandOpen, setBrandOpen] = useState(true)
  const [priceOpen, setPriceOpen] = useState(true)

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearchChange(searchQuery)
  }

  const handleCategoryChange = (categorySlug: string) => {
    setSelectedCategory(categorySlug)
    onFiltersChange({ ...currentFilters, category: categorySlug || undefined })
  }

  const handleBrandChange = (brandSlug: string) => {
    setSelectedBrand(brandSlug)
    onFiltersChange({ ...currentFilters, brand: brandSlug || undefined })
  }

  const handlePriceChange = () => {
    const filters = { ...currentFilters }

    if (minPrice) {
      filters.minPrice = parseFloat(minPrice)
    } else {
      delete filters.minPrice
    }

    if (maxPrice) {
      filters.maxPrice = parseFloat(maxPrice)
    } else {
      delete filters.maxPrice
    }

    onFiltersChange(filters)
  }

  const handleInStockChange = (checked: boolean) => {
    setInStockOnly(checked)
    onFiltersChange({ ...currentFilters, inStock: checked || undefined })
  }

  const handleSortChange = (value: string) => {
    const sortOption = PRODUCT_SORT_OPTIONS.find((option) => option.value === value)
    if (sortOption) {
      onSortChange(
        sortOption.field as 'name' | 'createdAt' | 'updatedAt' | 'price',
        sortOption.order as 'asc' | 'desc',
      )
    }
  }

  const handleReset = () => {
    setSearchQuery('')
    setSelectedCategory('')
    setSelectedBrand('')
    setMinPrice('')
    setMaxPrice('')
    setInStockOnly(false)
    onReset()
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (currentFilters.search) count++
    if (currentFilters.category) count++
    if (currentFilters.brand) count++
    if (currentFilters.minPrice || currentFilters.maxPrice) count++
    if (currentFilters.inStock) count++
    return count
  }

  const activeFiltersCount = getActiveFiltersCount()

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onToggle} className="lg:hidden">
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
      </CardHeader>

      <CardContent className={`space-y-6 ${!isOpen ? 'hidden lg:block' : ''}`}>
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search">Search Products</Label>
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <Input
              id="search"
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="sm" variant="outline">
              <Search className="w-4 h-4" />
            </Button>
          </form>
        </div>

        {/* Sort */}
        <div className="space-y-2">
          <Label>Sort By</Label>
          <Select
            value={`${currentFilters.sort}-${currentFilters.order}`}
            onValueChange={handleSortChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              {PRODUCT_SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Categories */}
        <Collapsible open={categoryOpen} onOpenChange={setCategoryOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0">
              <span className="font-medium">Categories</span>
              {categoryOpen ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 mt-2">
            <div className="space-y-2">
              <Button
                variant={selectedCategory === '' ? 'default' : 'outline'}
                size="sm"
                className="w-full justify-start"
                onClick={() => handleCategoryChange('')}
              >
                All Categories
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.slug ? 'default' : 'outline'}
                  size="sm"
                  className="w-full justify-between"
                  onClick={() => handleCategoryChange(category.slug)}
                >
                  <span className="truncate">{category.name}</span>
                  {category.productCount !== undefined && (
                    <Badge variant="secondary" className="ml-2">
                      {category.productCount}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Brands */}
        <Collapsible open={brandOpen} onOpenChange={setBrandOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0">
              <span className="font-medium">Brands</span>
              {brandOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 mt-2">
            <div className="space-y-2">
              <Button
                variant={selectedBrand === '' ? 'default' : 'outline'}
                size="sm"
                className="w-full justify-start"
                onClick={() => handleBrandChange('')}
              >
                All Brands
              </Button>
              {brands.map((brand) => (
                <Button
                  key={brand.id}
                  variant={selectedBrand === brand.slug ? 'default' : 'outline'}
                  size="sm"
                  className="w-full justify-between"
                  onClick={() => handleBrandChange(brand.slug)}
                >
                  <span className="truncate">{brand.name}</span>
                  {brand.productCount !== undefined && (
                    <Badge variant="secondary" className="ml-2">
                      {brand.productCount}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Price Range */}
        <Collapsible open={priceOpen} onOpenChange={setPriceOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0">
              <span className="font-medium">Price Range</span>
              {priceOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 mt-2">
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="minPrice" className="text-xs">
                    Min Price
                  </Label>
                  <Input
                    id="minPrice"
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    onBlur={handlePriceChange}
                    className="text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="maxPrice" className="text-xs">
                    Max Price
                  </Label>
                  <Input
                    id="maxPrice"
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    onBlur={handlePriceChange}
                    className="text-sm"
                  />
                </div>
              </div>
              {priceRange.min > 0 && priceRange.max > 0 && (
                <p className="text-xs text-gray-500">
                  Range: ${priceRange.min} - ${priceRange.max}
                </p>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Stock Filter */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => handleInStockChange(e.target.checked)}
              className="rounded border-gray-300"
            />
            <span className="text-sm">In Stock Only</span>
          </Label>
        </div>

        <Separator />

        {/* Active Filters */}
        {activeFiltersCount > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Active Filters</Label>
            <div className="flex flex-wrap gap-2">
              {currentFilters.search && (
                <Badge variant="secondary" className="text-xs">
                  Search: {currentFilters.search}
                  <button
                    onClick={() => {
                      setSearchQuery('')
                      onSearchChange('')
                    }}
                    className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {currentFilters.category && (
                <Badge variant="secondary" className="text-xs">
                  Category: {categories.find((c) => c.slug === currentFilters.category)?.name}
                  <button
                    onClick={() => handleCategoryChange('')}
                    className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {currentFilters.brand && (
                <Badge variant="secondary" className="text-xs">
                  Brand: {brands.find((b) => b.slug === currentFilters.brand)?.name}
                  <button
                    onClick={() => handleBrandChange('')}
                    className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {(currentFilters.minPrice || currentFilters.maxPrice) && (
                <Badge variant="secondary" className="text-xs">
                  Price: ${currentFilters.minPrice || 0} - ${currentFilters.maxPrice || '∞'}
                  <button
                    onClick={() => {
                      setMinPrice('')
                      setMaxPrice('')
                      const filters = { ...currentFilters }
                      delete filters.minPrice
                      delete filters.maxPrice
                      onFiltersChange(filters)
                    }}
                    className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {currentFilters.inStock && (
                <Badge variant="secondary" className="text-xs">
                  In Stock Only
                  <button
                    onClick={() => handleInStockChange(false)}
                    className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Reset Button */}
        {activeFiltersCount > 0 && (
          <Button variant="outline" size="sm" onClick={handleReset} className="w-full">
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Reset All Filters
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
