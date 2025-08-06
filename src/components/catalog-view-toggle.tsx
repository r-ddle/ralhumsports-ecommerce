'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LayoutGrid, Grid3X3, Filter } from 'lucide-react'
import { CatalogViewMode } from '@/hooks/use-catalog-view'
import { cn } from '@/lib/utils'

interface CatalogViewToggleProps {
  viewMode: CatalogViewMode
  hasActiveFilters: boolean
  activeFiltersCount: number
  onViewModeChange: (mode: CatalogViewMode) => void
  className?: string
}

export function CatalogViewToggle({
  viewMode,
  hasActiveFilters,
  activeFiltersCount,
  onViewModeChange,
  className,
}: CatalogViewToggleProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="flex items-center border rounded-lg p-1 bg-gray-50">
        <Button
          variant={viewMode === 'sectioned' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onViewModeChange('sectioned')}
          disabled={hasActiveFilters}
          className={cn(
            'h-8 px-3 text-xs font-medium transition-all',
            viewMode === 'sectioned' ? 'bg-white shadow-sm' : 'hover:bg-white/50',
            hasActiveFilters && 'opacity-50 cursor-not-allowed',
          )}
        >
          <LayoutGrid className="w-3 h-3 mr-1.5" />
          Categories
        </Button>

        <Button
          variant={viewMode === 'filtered' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onViewModeChange('filtered')}
          className={cn(
            'h-8 px-3 text-xs font-medium transition-all',
            viewMode === 'filtered' ? 'bg-white shadow-sm' : 'hover:bg-white/50',
          )}
        >
          <Grid3X3 className="w-3 h-3 mr-1.5" />
          All Products
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1.5 h-4 px-1.5 text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </div>

      {hasActiveFilters && viewMode === 'sectioned' && (
        <div className="flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-md border border-amber-200">
          <Filter className="w-3 h-3" />
          <span>Filters active - switch to &quot;All Products&quot; to see filtered results</span>
        </div>
      )}
    </div>
  )
}
