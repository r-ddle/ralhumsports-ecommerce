'use client'

import type React from 'react'
import { createContext, useContext, useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface NavigationContextType {
  hoveredCategory: string | null
  hoveredSport: string | null
  hoveredItem: string | null
  setHoveredCategory: (category: string | null) => void
  setHoveredSport: (sport: string | null) => void
  setHoveredItem: (item: string | null) => void
  getCurrentShopLink: () => string
  getFilteredLink: (filters: Record<string, string>) => string
  addCategoryFilter: (categorySlug: string) => void
  addSportFilter: (sportSlug: string) => void
  addItemFilter: (itemSlug: string) => void
  addBrandFilter: (brandSlug: string) => void
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined)

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
  const [hoveredSport, setHoveredSport] = useState<string | null>(null)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  const getCurrentShopLink = useCallback(() => {
    const params = new URLSearchParams()

    if (hoveredCategory) params.set('category', hoveredCategory)
    if (hoveredSport) params.set('sport', hoveredSport)
    if (hoveredItem) params.set('item', hoveredItem)

    const queryString = params.toString()
    return queryString ? `/products?${queryString}` : '/products'
  }, [hoveredCategory, hoveredSport, hoveredItem])

  const getFilteredLink = useCallback((filters: Record<string, string>) => {
    const params = new URLSearchParams()

    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value)
    })

    const queryString = params.toString()
    return queryString ? `/products?${queryString}` : '/products'
  }, [])

  const addCategoryFilter = useCallback(
    (categorySlug: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set('categories', categorySlug)
      router.push(`/products?${params.toString()}`)
    },
    [router, searchParams],
  )

  const addSportFilter = useCallback(
    (sportSlug: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set('sport', sportSlug)
      router.push(`/products?${params.toString()}`)
    },
    [router, searchParams],
  )

  const addItemFilter = useCallback(
    (itemSlug: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set('item', itemSlug)
      router.push(`/products?${params.toString()}`)
    },
    [router, searchParams],
  )

  const addBrandFilter = useCallback(
    (brandSlug: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set('brands', brandSlug)
      router.push(`/products?${params.toString()}`)
    },
    [router, searchParams],
  )

  const value: NavigationContextType = {
    hoveredCategory,
    hoveredSport,
    hoveredItem,
    setHoveredCategory,
    setHoveredSport,
    setHoveredItem,
    getCurrentShopLink,
    getFilteredLink,
    addCategoryFilter,
    addSportFilter,
    addItemFilter,
    addBrandFilter,
  }

  return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>
}

export function useNavigation() {
  const context = useContext(NavigationContext)
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider')
  }
  return context
}
