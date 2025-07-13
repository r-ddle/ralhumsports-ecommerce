'use client'

import type React from 'react'

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
import {
  Filter,
  Search,
  X,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Category, Brand, ProductQueryParams } from '@/types/api'
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
      filters.minPrice = Number.parseFloat(minPrice)
    } else {
      delete filters.minPrice
    }

    if (maxPrice) {
      filters.maxPrice = Number.parseFloat(maxPrice)
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
      <Card className="w-full bg-white/80 backdrop-blur-xl border border-white/20 shadow-lg">
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
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full bg-white/80 backdrop-blur-xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400">
                <Filter className="w-4 h-4 text-white" />
              </div>
              <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent font-bold">
                Filters
              </span>
              {activeFiltersCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Badge className="bg-gradient-to-r from-orange-500 to-red-400 text-white">
                    {activeFiltersCount}
                  </Badge>
                </motion.div>
              )}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onToggle} className="lg:hidden">
              {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>
        </CardHeader>

        <AnimatePresence>
          {(isOpen || window.innerWidth >= 1024) && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:block"
            >
              <CardContent className="space-y-6">
                {/* Enhanced Search */}
                <div className="space-y-2">
                  <Label htmlFor="search" className="text-sm font-semibold text-slate-700">
                    Search Products
                  </Label>
                  <form onSubmit={handleSearchSubmit} className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        id="search"
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-white/50 backdrop-blur-sm border-gray-300 focus:border-blue-400 transition-colors"
                      />
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    </div>
                    <Button
                      type="submit"
                      size="sm"
                      className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Search className="w-4 h-4" />
                    </Button>
                  </form>
                </div>

                {/* Enhanced Sort */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Sort By</Label>
                  <Select
                    value={`${currentFilters.sort}-${currentFilters.order}`}
                    onValueChange={handleSortChange}
                  >
                    <SelectTrigger className="bg-white/50 backdrop-blur-sm border-gray-300 focus:border-blue-400">
                      <SelectValue placeholder="Sort by..." />
                    </SelectTrigger>
                    <SelectContent className="bg-white/95 backdrop-blur-xl border border-white/20">
                      {PRODUCT_SORT_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator className="bg-gradient-to-r from-transparent via-slate-300 to-transparent" />

                {/* Enhanced Categories */}
                <Collapsible open={categoryOpen} onOpenChange={setCategoryOpen}>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-between p-0 hover:bg-transparent"
                    >
                      <span className="font-semibold text-slate-700">Categories</span>
                      <motion.div
                        animate={{ rotate: categoryOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </motion.div>
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-2 mt-3">
                    <div className="space-y-2">
                      <Button
                        variant={selectedCategory === '' ? 'default' : 'outline'}
                        size="sm"
                        className={`w-full justify-start transition-all duration-300 ${
                          selectedCategory === ''
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg'
                            : 'bg-white/50 backdrop-blur-sm border-white/20 hover:bg-blue-50'
                        }`}
                        onClick={() => handleCategoryChange('')}
                      >
                        All Categories
                      </Button>
                      {categories.map((category) => (
                        <motion.div
                          key={category.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            variant={selectedCategory === category.slug ? 'default' : 'outline'}
                            size="sm"
                            className={`w-full justify-between transition-all duration-300 ${
                              selectedCategory === category.slug
                                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg'
                                : 'bg-white/50 backdrop-blur-sm border-white/20 hover:bg-blue-50'
                            }`}
                            onClick={() => handleCategoryChange(category.slug)}
                          >
                            <span className="truncate">{category.name}</span>
                            {category.productCount !== undefined && (
                              <Badge variant="secondary" className="ml-2 bg-slate-100">
                                {category.productCount}
                              </Badge>
                            )}
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                <Separator className="bg-gradient-to-r from-transparent via-slate-300 to-transparent" />

                {/* Enhanced Brands */}
                <Collapsible open={brandOpen} onOpenChange={setBrandOpen}>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-between p-0 hover:bg-transparent"
                    >
                      <span className="font-semibold text-slate-700">Brands</span>
                      <motion.div
                        animate={{ rotate: brandOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </motion.div>
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-2 mt-3">
                    <div className="space-y-2">
                      <Button
                        variant={selectedBrand === '' ? 'default' : 'outline'}
                        size="sm"
                        className={`w-full justify-start transition-all duration-300 ${
                          selectedBrand === ''
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg'
                            : 'bg-white/50 backdrop-blur-sm border-white/20 hover:bg-blue-50'
                        }`}
                        onClick={() => handleBrandChange('')}
                      >
                        All Brands
                      </Button>
                      {brands.map((brand) => (
                        <motion.div
                          key={brand.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            variant={selectedBrand === brand.slug ? 'default' : 'outline'}
                            size="sm"
                            className={`w-full justify-between transition-all duration-300 ${
                              selectedBrand === brand.slug
                                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg'
                                : 'bg-white/50 backdrop-blur-sm border-white/20 hover:bg-blue-50'
                            }`}
                            onClick={() => handleBrandChange(brand.slug)}
                          >
                            <span className="truncate">{brand.name}</span>
                            {brand.productCount !== undefined && (
                              <Badge variant="secondary" className="ml-2 bg-slate-100">
                                {brand.productCount}
                              </Badge>
                            )}
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                <Separator className="bg-gradient-to-r from-transparent via-slate-300 to-transparent" />

                {/* Enhanced Price Range */}
                <Collapsible open={priceOpen} onOpenChange={setPriceOpen}>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-between p-0 hover:bg-transparent"
                    >
                      <span className="font-semibold text-slate-700">Price Range</span>
                      <motion.div
                        animate={{ rotate: priceOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </motion.div>
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-3 mt-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label
                          htmlFor="minPrice"
                          className="text-xs font-medium text-slate-600 dark:text-slate-400"
                        >
                          Min Price
                        </Label>
                        <Input
                          id="minPrice"
                          type="number"
                          placeholder="Min"
                          value={minPrice}
                          onChange={(e) => setMinPrice(e.target.value)}
                          onBlur={handlePriceChange}
                          className="text-sm bg-white/50 backdrop-blur-sm border-gray-300 focus:border-blue-400"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="maxPrice"
                          className="text-xs font-medium text-slate-600 dark:text-slate-400"
                        >
                          Max Price
                        </Label>
                        <Input
                          id="maxPrice"
                          type="number"
                          placeholder="Max"
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(e.target.value)}
                          onBlur={handlePriceChange}
                          className="text-sm bg-white/50 backdrop-blur-sm border-gray-300 focus:border-blue-400"
                        />
                      </div>
                    </div>
                    {priceRange.min > 0 && priceRange.max > 0 && (
                      <p className="text-xs text-slate-500">
                        Range: Rs.{priceRange.min} - Rs.{priceRange.max}
                      </p>
                    )}
                  </CollapsibleContent>
                </Collapsible>

                <Separator className="bg-gradient-to-r from-transparent via-slate-300 to-transparent" />

                {/* Enhanced Stock Filter */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={inStockOnly}
                        onChange={(e) => handleInStockChange(e.target.checked)}
                        className="sr-only"
                      />
                      <div
                        className={`w-5 h-5 rounded border-2 transition-all duration-300 ${
                          inStockOnly
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-500 border-blue-600'
                            : 'border-slate-300 bg-white/50'
                        }`}
                      >
                        {inStockOnly && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center justify-center h-full"
                          >
                            <svg
                              className="w-3 h-3 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </motion.div>
                        )}
                      </div>
                    </div>
                    <span className="text-sm font-medium text-slate-700 group-hover:text-blue-600 transition-colors">
                      In Stock Only
                    </span>
                  </Label>
                </div>

                <Separator className="bg-gradient-to-r from-transparent via-slate-300 to-transparent" />

                {/* Enhanced Active Filters */}
                {activeFiltersCount > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-3"
                  >
                    <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Active Filters
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {currentFilters.search && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Badge className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-xs">
                            Search: {currentFilters.search}
                            <button
                              onClick={() => {
                                setSearchQuery('')
                                onSearchChange('')
                              }}
                              className="ml-2 hover:bg-white/20 rounded-full p-0.5 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        </motion.div>
                      )}
                      {currentFilters.category && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.2, delay: 0.1 }}
                        >
                          <Badge className="bg-gradient-to-r from-orange-500 to-red-400 text-white text-xs">
                            Category:{' '}
                            {categories.find((c) => c.slug === currentFilters.category)?.name}
                            <button
                              onClick={() => handleCategoryChange('')}
                              className="ml-2 hover:bg-white/20 rounded-full p-0.5 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        </motion.div>
                      )}
                      {currentFilters.brand && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.2, delay: 0.2 }}
                        >
                          <Badge className="bg-gradient-to-r from-purple-500 to-pink-400 text-white text-xs">
                            Brand: {brands.find((b) => b.slug === currentFilters.brand)?.name}
                            <button
                              onClick={() => handleBrandChange('')}
                              className="ml-2 hover:bg-white/20 rounded-full p-0.5 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        </motion.div>
                      )}
                      {(currentFilters.minPrice || currentFilters.maxPrice) && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.2, delay: 0.3 }}
                        >
                          <Badge className="bg-gradient-to-r from-green-500 to-emerald-400 text-white text-xs">
                            Price: Rs.{currentFilters.minPrice || 0} - Rs.
                            {currentFilters.maxPrice || '∞'}
                            <button
                              onClick={() => {
                                setMinPrice('')
                                setMaxPrice('')
                                const filters = { ...currentFilters }
                                delete filters.minPrice
                                delete filters.maxPrice
                                onFiltersChange(filters)
                              }}
                              className="ml-2 hover:bg-white/20 rounded-full p-0.5 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        </motion.div>
                      )}
                      {currentFilters.inStock && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.2, delay: 0.4 }}
                        >
                          <Badge className="bg-gradient-to-r from-yellow-500 to-orange-400 text-white text-xs">
                            In Stock Only
                            <button
                              onClick={() => handleInStockChange(false)}
                              className="ml-2 hover:bg-white/20 rounded-full p-0.5 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Enhanced Reset Button */}
                {activeFiltersCount > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleReset}
                      className="w-full bg-white/50 backdrop-blur-sm border-white/20 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all duration-300"
                    >
                      <SlidersHorizontal className="w-4 h-4 mr-2" />
                      Reset All Filters
                    </Button>
                  </motion.div>
                )}
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  )
}
