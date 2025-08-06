'use client'

import { useState, useRef, useCallback } from 'react'
import { ProductCard } from '@/components/product-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, ChevronRight, Package, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { CategoryGroup } from '@/types/api'
import { cn } from '@/lib/utils'

interface CategorySectionProps {
  categoryGroup: CategoryGroup
  showViewAll?: boolean
  className?: string
}

export function CategorySection({ 
  categoryGroup, 
  showViewAll = true, 
  className 
}: CategorySectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScrollButtons = useCallback(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const { scrollLeft, scrollWidth, clientWidth } = container
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
  }, [])

  const scroll = useCallback((direction: 'left' | 'right') => {
    const container = scrollContainerRef.current
    if (!container) return

    const cardWidth = 280 // Approximate card width including gap
    const scrollAmount = cardWidth * 2 // Scroll 2 cards at a time
    
    const newScrollLeft = direction === 'left' 
      ? container.scrollLeft - scrollAmount
      : container.scrollLeft + scrollAmount

    container.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    })

    // Check scroll buttons after animation
    setTimeout(checkScrollButtons, 300)
  }, [checkScrollButtons])

  const { category, products, productCount, hasMore } = categoryGroup

  if (products.length === 0) {
    return null
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-xl font-bold text-text-primary">
              {category.name}
            </CardTitle>
            <Badge variant="secondary" className="text-xs">
              {productCount} products
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Navigation Arrows */}
            <div className="hidden sm:flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* View All Link */}
            {showViewAll && (
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-brand-secondary hover:text-brand-secondary/80"
              >
                <Link 
                  href={`/products?sportsItem=${category.slug}`}
                  className="flex items-center gap-1"
                >
                  <span className="hidden sm:inline">View All</span>
                  <span className="sm:hidden">All</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </Button>
            )}
          </div>
        </div>

        {category.description && (
          <p className="text-sm text-text-secondary mt-2">
            {category.description}
          </p>
        )}
      </CardHeader>

      <CardContent className="p-0">
        {/* Horizontal Scrolling Container */}
        <div 
          ref={scrollContainerRef}
          onScroll={checkScrollButtons}
          className="flex gap-4 overflow-x-auto scrollbar-hide px-6 pb-6 snap-x snap-mandatory"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {products.map((product, index) => (
            <div 
              key={product.id} 
              className="flex-none w-64 sm:w-72 snap-start"
            >
              <ProductCard
                product={product}
                variant="grid"
                showBrand={true}
                showCategory={false} // Don't show category since it's in the section title
                className="h-full"
              />
            </div>
          ))}

          {/* Show More Card if there are more products */}
          {hasMore && (
            <div className="flex-none w-64 sm:w-72 snap-start">
              <Card className="h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 border-dashed border-2 border-gray-300 hover:border-brand-secondary transition-colors group">
                <CardContent className="text-center p-6">
                  <Package className="w-12 h-12 text-gray-400 group-hover:text-brand-secondary transition-colors mx-auto mb-4" />
                  <h3 className="font-semibold text-text-primary mb-2">
                    {productCount - products.length}+ More
                  </h3>
                  <p className="text-sm text-text-secondary mb-4">
                    Discover more {category.name.toLowerCase()} products
                  </p>
                  <Button 
                    asChild 
                    variant="outline" 
                    size="sm"
                    className="border-brand-secondary text-brand-secondary hover:bg-brand-secondary hover:text-white"
                  >
                    <Link href={`/products?sportsItem=${category.slug}`}>
                      View All
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Mobile: Show scroll indicators */}
        <div className="sm:hidden flex justify-center gap-2 px-6 pb-4">
          <div className={cn(
            "h-1 rounded-full transition-colors",
            canScrollLeft ? "bg-brand-secondary w-6" : "bg-gray-300 w-2"
          )} />
          <div className={cn(
            "h-1 rounded-full transition-colors",
            canScrollRight ? "bg-brand-secondary w-6" : "bg-gray-300 w-2"
          )} />
        </div>
      </CardContent>
    </Card>
  )
}

// Custom scrollbar hiding styles
const scrollbarHideStyles = `
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
`

// Inject styles if needed
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style')
  styleElement.textContent = scrollbarHideStyles
  document.head.appendChild(styleElement)
}