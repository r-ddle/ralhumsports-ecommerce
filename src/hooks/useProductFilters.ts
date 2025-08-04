'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export interface ProductFilters {
  search?: string
  categories?: string[]
  brands?: string[]
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  sort?: string
  order?: 'asc' | 'desc'
  // Hierarchical category filters
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
      if (sportsCategory) urlFilters.sportsCategory = sportsCategory
      
      const sport = searchParams.get('sport')
      if (sport) urlFilters.sport = sport
      
      const sportsItem = searchParams.get('sportsItem')
      if (sportsItem) urlFilters.sportsItem = sportsItem

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
      
      // Hierarchical category filters
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
  }
}
