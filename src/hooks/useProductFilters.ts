'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export interface ProductFilters {
  search?: string
  // Legacy category filter (for backward compatibility)
  categories?: string[]
  brands?: string[]
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  sort?: string
  order?: 'asc' | 'desc'
  // Hierarchical category filters
  categoryHierarchy?: {
    sportsCategory?: string    // Level 1: Sports Category (e.g., "Team Sports")
    sports?: string           // Level 2: Sports (e.g., "Football") 
    sportsItem?: string       // Level 3: Sports Item (e.g., "Football Boots")
  }
  // Individual fields for URL params and backward compatibility
  sportsCategory?: string
  sport?: string
  sportsItem?: string
}

export function useProductFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [filters, setFilters] = useState<ProductFilters>({})
  const [loading, setLoading] = useState(false)

  // Parse URL parameters into filters
  useEffect(() => {
    const urlFilters: ProductFilters = {}

    const search = searchParams.get('search')
    if (search) urlFilters.search = search

    // Handle preselected parameters from navigation - these don't apply filters yet
    const preselected = searchParams.get('preselected')
    const preselectValue = searchParams.get('preselectValue')
    
    // Only parse filter parameters if no preselected values
    if (!preselected && !preselectValue) {
      // Handle layered categories - can have multiple levels
      const categories = searchParams.get('categories')
      if (categories) urlFilters.categories = categories.split(',')
      
      // Handle individual category levels for hierarchical filtering
      const sportsCategory = searchParams.get('sportsCategory')
      const sport = searchParams.get('sport')
      const sportsItem = searchParams.get('sportsItem')
      
      if (sportsCategory || sport || sportsItem) {
        urlFilters.categoryHierarchy = {}
        if (sportsCategory) {
          urlFilters.sportsCategory = sportsCategory
          urlFilters.categoryHierarchy.sportsCategory = sportsCategory
        }
        if (sport) {
          urlFilters.sport = sport
          urlFilters.categoryHierarchy.sports = sport
        }
        if (sportsItem) {
          urlFilters.sportsItem = sportsItem
          urlFilters.categoryHierarchy.sportsItem = sportsItem
        }
      }

      const brands = searchParams.getAll('brand')
      if (brands.length > 0) urlFilters.brands = brands

      const minPrice = searchParams.get('minPrice')
      if (minPrice) urlFilters.minPrice = Number.parseInt(minPrice)

      const maxPrice = searchParams.get('maxPrice')
      if (maxPrice) urlFilters.maxPrice = Number.parseInt(maxPrice)

      const inStock = searchParams.get('inStock')
      if (inStock === 'true') urlFilters.inStock = true

      const sort = searchParams.get('sort')
      if (sort) urlFilters.sort = sort

      const order = searchParams.get('order')
      if (order === 'asc' || order === 'desc') urlFilters.order = order
    }

    setFilters(urlFilters)
  }, [searchParams])

  // Update URL with current filters
  const updateURL = useCallback(
    (newFilters: ProductFilters) => {
      const params = new URLSearchParams()

      if (newFilters.search) params.set('search', newFilters.search)
      if (newFilters.categories?.length) params.set('categories', newFilters.categories.join(','))
      if (newFilters.brands?.length) {
        newFilters.brands.forEach(brand => params.append('brand', brand))
      }
      if (newFilters.minPrice) params.set('minPrice', newFilters.minPrice.toString())
      if (newFilters.maxPrice) params.set('maxPrice', newFilters.maxPrice.toString())
      if (newFilters.inStock) params.set('inStock', 'true')
      if (newFilters.sort) params.set('sort', newFilters.sort)
      if (newFilters.order) params.set('order', newFilters.order)
      
      // Hierarchical category filters (use individual fields for URL params)
      if (newFilters.sportsCategory) params.set('sportsCategory', newFilters.sportsCategory)
      if (newFilters.sport) params.set('sport', newFilters.sport)
      if (newFilters.sportsItem) params.set('sportsItem', newFilters.sportsItem)

      const url = params.toString() ? `/products?${params.toString()}` : '/products'
      router.push(url, { scroll: false })
    },
    [router],
  )

  // Add a filter
  const addFilter = useCallback(
    (key: keyof ProductFilters, value: any) => {
      setFilters((prev) => {
        const newFilters = { ...prev }

        if (key === 'categories' || key === 'brands') {
          const currentArray = prev[key] || []
          const valueArray = Array.isArray(value) ? value : [value]
          newFilters[key] = [...new Set([...currentArray, ...valueArray])]
        } else {
          newFilters[key] = value
        }

        updateURL(newFilters)
        return newFilters
      })
    },
    [updateURL],
  )

  // Remove a filter
  const removeFilter = useCallback(
    (key: keyof ProductFilters, value?: any) => {
      setFilters((prev) => {
        const newFilters = { ...prev }

        if (key === 'categories' || key === 'brands') {
          if (value) {
            newFilters[key] = prev[key]?.filter((item) => item !== value)
            if (newFilters[key]?.length === 0) delete newFilters[key]
          } else {
            delete newFilters[key]
          }
        } else {
          delete newFilters[key]
        }

        updateURL(newFilters)
        return newFilters
      })
    },
    [updateURL],
  )

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters({})
    router.push('/products', { scroll: false })
  }, [router])

  // Navigate to products page with current filters
  const navigateToProducts = useCallback(() => {
    updateURL(filters)
  }, [filters, updateURL])

  // Set multiple filters at once
  const setMultipleFilters = useCallback(
    (newFilters: ProductFilters) => {
      setFilters(newFilters)
      updateURL(newFilters)
    },
    [updateURL],
  )

  // Get preselected values from navigation
  const getPreselectedValues = useCallback(() => {
    const preselected = searchParams.get('preselected')
    const preselectValue = searchParams.get('preselectValue')
    
    return {
      type: preselected,
      value: preselectValue,
    }
  }, [searchParams])

  // Set hierarchical category filter
  const setCategoryHierarchy = useCallback(
    (level: 'sportsCategory' | 'sports' | 'sportsItem', value: string) => {
      setFilters((prev) => {
        const newFilters = { ...prev }
        
        // Map hierarchy level to actual filter property names
        const fieldMapping = {
          sportsCategory: 'sportsCategory',
          sports: 'sport', // Note: 'sport' in filters, 'sports' in hierarchy
          sportsItem: 'sportsItem'
        } as const
        
        // Update individual field (for URL params)
        const fieldName = fieldMapping[level]
        if (fieldName === 'sportsCategory') {
          newFilters.sportsCategory = value
        } else if (fieldName === 'sport') {
          newFilters.sport = value
        } else if (fieldName === 'sportsItem') {
          newFilters.sportsItem = value
        }
        
        // Initialize categoryHierarchy if it doesn't exist
        if (!newFilters.categoryHierarchy) {
          newFilters.categoryHierarchy = {}
        }
        
        // Update the hierarchy object
        newFilters.categoryHierarchy[level] = value
        
        // When setting a parent level, clear child levels
        if (level === 'sportsCategory') {
          delete newFilters.sport
          delete newFilters.sportsItem
          if (newFilters.categoryHierarchy) {
            delete newFilters.categoryHierarchy.sports
            delete newFilters.categoryHierarchy.sportsItem
          }
        } else if (level === 'sports') {
          delete newFilters.sportsItem
          if (newFilters.categoryHierarchy) {
            delete newFilters.categoryHierarchy.sportsItem
          }
        }

        updateURL(newFilters)
        return newFilters
      })
    },
    [updateURL],
  )

  // Clear hierarchical category filter
  const clearCategoryHierarchy = useCallback(
    (level?: 'sportsCategory' | 'sports' | 'sportsItem') => {
      setFilters((prev) => {
        const newFilters = { ...prev }
        
        if (level) {
          // Map hierarchy level to actual filter property names
          const fieldMapping = {
            sportsCategory: 'sportsCategory',
            sports: 'sport', // Note: 'sport' in filters, 'sports' in hierarchy
            sportsItem: 'sportsItem'
          } as const
          
          // Clear specific level
          const fieldName = fieldMapping[level]
          if (fieldName === 'sportsCategory') {
            delete newFilters.sportsCategory
          } else if (fieldName === 'sport') {
            delete newFilters.sport
          } else if (fieldName === 'sportsItem') {
            delete newFilters.sportsItem
          }
          
          if (newFilters.categoryHierarchy) {
            delete newFilters.categoryHierarchy[level]
          }
          
          // Clear child levels
          if (level === 'sportsCategory') {
            delete newFilters.sport
            delete newFilters.sportsItem
            if (newFilters.categoryHierarchy) {
              delete newFilters.categoryHierarchy.sports
              delete newFilters.categoryHierarchy.sportsItem
            }
          } else if (level === 'sports') {
            delete newFilters.sportsItem
            if (newFilters.categoryHierarchy) {
              delete newFilters.categoryHierarchy.sportsItem
            }
          }
        } else {
          // Clear all hierarchical categories
          delete newFilters.sportsCategory
          delete newFilters.sport
          delete newFilters.sportsItem
          delete newFilters.categoryHierarchy
        }

        updateURL(newFilters)
        return newFilters
      })
    },
    [updateURL],
  )

  // Get current category hierarchy path
  const getCategoryHierarchyPath = useCallback(() => {
    const { sportsCategory, sport, sportsItem } = filters
    return {
      sportsCategory,
      sports: sport,
      sportsItem
    }
  }, [filters])

  return {
    filters,
    loading,
    addFilter,
    removeFilter,
    clearFilters,
    navigateToProducts,
    setMultipleFilters,
    setLoading,
    getPreselectedValues,
    setCategoryHierarchy,
    clearCategoryHierarchy,
    getCategoryHierarchyPath,
  }
}
