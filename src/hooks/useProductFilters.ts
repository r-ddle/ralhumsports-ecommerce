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
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
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

    const categories = searchParams.get('categories')
    if (categories) urlFilters.categories = categories.split(',')

    const brands = searchParams.get('brands')
    if (brands) urlFilters.brands = brands.split(',')

    const minPrice = searchParams.get('minPrice')
    if (minPrice) urlFilters.minPrice = Number.parseInt(minPrice)

    const maxPrice = searchParams.get('maxPrice')
    if (maxPrice) urlFilters.maxPrice = Number.parseInt(maxPrice)

    const inStock = searchParams.get('inStock')
    if (inStock === 'true') urlFilters.inStock = true

    const sortBy = searchParams.get('sortBy')
    if (sortBy) urlFilters.sortBy = sortBy

    const sortOrder = searchParams.get('sortOrder')
    if (sortOrder === 'asc' || sortOrder === 'desc') urlFilters.sortOrder = sortOrder

    setFilters(urlFilters)
  }, [searchParams])

  // Update URL with current filters
  const updateURL = useCallback(
    (newFilters: ProductFilters) => {
      const params = new URLSearchParams()

      if (newFilters.search) params.set('search', newFilters.search)
      if (newFilters.categories?.length) params.set('categories', newFilters.categories.join(','))
      if (newFilters.brands?.length) params.set('brands', newFilters.brands.join(','))
      if (newFilters.minPrice) params.set('minPrice', newFilters.minPrice.toString())
      if (newFilters.maxPrice) params.set('maxPrice', newFilters.maxPrice.toString())
      if (newFilters.inStock) params.set('inStock', 'true')
      if (newFilters.sortBy) params.set('sortBy', newFilters.sortBy)
      if (newFilters.sortOrder) params.set('sortOrder', newFilters.sortOrder)

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

  return {
    filters,
    loading,
    addFilter,
    removeFilter,
    clearFilters,
    navigateToProducts,
    setMultipleFilters,
    setLoading,
  }
}
