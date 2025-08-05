'use client'

import { useState, useCallback, useEffect } from 'react'
import { CategoryGroupsResponse, CategoryGroup } from '@/types/api'

export type CatalogViewMode = 'sectioned' | 'filtered'

interface CatalogViewState {
  viewMode: CatalogViewMode
  categoryGroups: CategoryGroup[]
  loading: boolean
  error: string | null
  hasActiveFilters: boolean
}

interface UseCatalogViewReturn extends CatalogViewState {
  switchToSectioned: () => void
  switchToFiltered: () => void
  setHasActiveFilters: (hasFilters: boolean) => void
  refreshCategoryGroups: () => Promise<void>
}

export function useCatalogView(): UseCatalogViewReturn {
  const [state, setState] = useState<CatalogViewState>({
    viewMode: 'sectioned',
    categoryGroups: [],
    loading: false,
    error: null,
    hasActiveFilters: false,
  })

  // Fetch category groups for sectioned view
  const fetchCategoryGroups = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const response = await fetch('/api/public/products/category-groups?limit=8&includeEmpty=false')
      
      if (!response.ok) {
        throw new Error('Failed to fetch category groups')
      }
      
      const data: CategoryGroupsResponse = await response.json()
      
      if (data.success) {
        setState(prev => ({
          ...prev,
          categoryGroups: data.data.categoryGroups,
          loading: false,
          error: null,
        }))
      } else {
        throw new Error('API returned success: false')
      }
    } catch (error) {
      console.error('Error fetching category groups:', error)
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'An error occurred',
      }))
    }
  }, [])

  // Switch to sectioned view (category carousels)  
  const switchToSectioned = useCallback(() => {
    setState(prev => ({ ...prev, viewMode: 'sectioned' }))
    
    // Only fetch if we don't have data or if we're not currently loading
    if (state.categoryGroups.length === 0 && !state.loading) {
      fetchCategoryGroups()
    }
  }, [state.categoryGroups.length, state.loading, fetchCategoryGroups])

  // Switch to filtered view (unified grid)
  const switchToFiltered = useCallback(() => {
    setState(prev => ({ ...prev, viewMode: 'filtered' }))
  }, [])

  // Set active filters status
  const setHasActiveFilters = useCallback((hasFilters: boolean) => {
    setState(prev => {
      // Auto-switch to filtered view when filters are applied
      const newViewMode = hasFilters ? 'filtered' : prev.viewMode
      
      return {
        ...prev,
        hasActiveFilters: hasFilters,
        viewMode: newViewMode,
      }
    })
  }, [])

  // Refresh category groups data
  const refreshCategoryGroups = useCallback(async () => {
    await fetchCategoryGroups()
  }, [fetchCategoryGroups])

  // Initial load of category groups
  useEffect(() => {
    if (state.viewMode === 'sectioned' && state.categoryGroups.length === 0 && !state.loading) {
      fetchCategoryGroups()
    }
  }, [state.viewMode, state.categoryGroups.length, state.loading, fetchCategoryGroups])

  return {
    ...state,
    switchToSectioned,
    switchToFiltered,
    setHasActiveFilters,
    refreshCategoryGroups,
  }
}