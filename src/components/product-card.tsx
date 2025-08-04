'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Star, Eye, Package, Zap, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

import type { ProductListItem } from '@/types/api'
import { LazyImage } from '@/components/ui/lazy-image'
import { toast } from 'sonner'
import { RichTextRenderer } from '@/components/RichTextRenderer'

interface ProductCardProps {
  product: ProductListItem
  variant?: 'grid' | 'list'
  showBrand?: boolean
  showCategory?: boolean
  className?: string
}

export function ProductCard({
  product,
  variant = 'grid',
  showBrand = true,
  showCategory = true,
  className = '',
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showQuickView, setShowQuickView] = useState(false)
  const [quickViewProduct, setQuickViewProduct] = useState<ProductListItem | null>(null)

  // Stock calculations
  const lowStockThreshold = 5
  function getAvailableStock(): number {
    if (product.variants && product.variants.length > 0) {
      return product.variants.reduce((total, variant) => total + (variant.inventory || 0), 0)
    }
    return product.stock || 0
  }

  const availableStock = getAvailableStock()
  const isOutOfStock = availableStock === 0
  const isLowStock = !isOutOfStock && availableStock <= lowStockThreshold

  // Price calculations
  const hasDiscount = product.originalPrice && product.originalPrice > product.price
  const discountPercentage = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0

  const priceInLKR = product.price.toLocaleString()
  const originalPriceInLKR = product.originalPrice?.toLocaleString()

  // Check if product is new (within 30 days)
  const isNew = new Date(product.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

  // Performance optimization
  const prefersReducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false

  const handleImageCycle = () => {
    if (product.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length)
    }
  }

  // List view variant (unchanged for desktop compatibility)
  if (variant === 'list') {
    return (
      <motion.div
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
        viewport={{ once: true, margin: '-50px' }}
        className={`group h-full ${className}`}
      >
        <Link href={`/products/${product.slug}`} className="block h-full">
          <Card className="h-full flex flex-col sm:flex-row overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-white/95 backdrop-blur-sm">
            {/* Image Section */}
            <div className="relative w-full sm:w-32 md:w-40 lg:w-48 h-32 sm:h-full overflow-hidden">
              <div onMouseEnter={handleImageCycle}>
                <LazyImage
                  src={product.images[currentImageIndex]?.url || '/placeholder-product.jpg'}
                  alt={product.images[currentImageIndex]?.alt || product.name}
                  width={128}
                  height={128}
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Badges */}
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                {isNew && (
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-2 py-0.5">
                    <Sparkles className="w-3 h-3 mr-1" />
                    New
                  </Badge>
                )}
                {hasDiscount && (
                  <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2 py-0.5">
                    -{discountPercentage}%
                  </Badge>
                )}
                {isLowStock && !isOutOfStock && (
                  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs px-2 py-0.5">
                    <Zap className="w-3 h-3 mr-1" />
                    Low Stock
                  </Badge>
                )}
                {isOutOfStock && (
                  <Badge className="bg-gradient-to-r from-gray-500 to-gray-600 text-white text-xs px-2 py-0.5">
                    <Package className="w-3 h-3 mr-1" />
                    Out of Stock
                  </Badge>
                )}
              </div>
            </div>

            {/* Content Section */}
            <CardContent className="flex-1 p-4 sm:p-6 flex flex-col justify-between">
              <div>
                {/* Brand */}
                {showBrand && product.brand && (
                  <Badge
                    variant="outline"
                    className="text-xs mb-2 w-fit text-brand-secondary border-brand-secondary/30"
                  >
                    {product.brand.name}
                  </Badge>
                )}

                {/* Product Name */}
                <h3 className="text-lg sm:text-xl font-bold text-text-primary mb-2 line-clamp-2 group-hover:text-brand-primary transition-colors">
                  {product.name}
                </h3>

                {/* Category */}
                {showCategory && product.category && (
                  <Badge variant="secondary" className="text-xs mb-3 w-fit">
                    {product.category.name}
                  </Badge>
                )}

                {/* Description */}
                {product.description && (
                  <p className="text-sm text-text-secondary line-clamp-2 mb-3">
                    {typeof product.description === 'string' ? product.description : ''}
                  </p>
                )}

                {/* Features - Only in List View */}
                {product.features && product.features.length > 0 && (
                  <div className="mb-3">
                    <h4 className="text-sm font-semibold text-text-primary mb-2">Key Features:</h4>
                    <ul className="space-y-1">
                      {product.features.slice(0, 3).map((feature, index) => (
                        <li
                          key={index}
                          className="text-sm text-text-secondary flex items-start gap-2"
                        >
                          <span className="text-brand-primary mt-1.5 block w-1 h-1 rounded-full bg-current flex-shrink-0" />
                          <span className="line-clamp-1">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Rating */}
                {product.rating && product.rating > 0 && (
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating!)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-text-secondary">({product.rating})</span>
                  </div>
                )}
              </div>

              {/* Price and Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-brand-primary">Rs. {priceInLKR}</span>
                    {hasDiscount && (
                      <span className="text-sm text-text-secondary line-through">
                        Rs. {originalPriceInLKR}
                      </span>
                    )}
                  </div>
                  {availableStock <= 5 && availableStock > 0 && (
                    <span className="text-xs text-text-secondary">Only {availableStock} left</span>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setQuickViewProduct(product)
                      setShowQuickView(true)
                    }}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Quick View
                  </Button>
                  <Button size="sm" disabled={isOutOfStock} className="px-4">
                    {isOutOfStock ? 'Out of Stock' : 'View Details'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </motion.div>
    )
  }

  // Enhanced Grid view with mobile-first optimization
  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
      viewport={{ once: true, margin: '-50px' }}
      className={`group h-full ${className}`}
    >
      <Link href={`/products/${product.slug}`} className="block h-full">
        <Card className="h-full flex flex-col overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-white/95 backdrop-blur-sm">
          {/* Image Section with Mobile Optimization */}
          <div
            className="relative w-full aspect-square sm:aspect-[4/3] md:aspect-square overflow-hidden"
            onMouseEnter={handleImageCycle}
          >
            <LazyImage
              src={product.images[currentImageIndex]?.url || '/placeholder-product.jpg'}
              alt={product.images[currentImageIndex]?.alt || product.name}
              width={600}
              height={600}
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />

            {/* Mobile-Optimized Badges */}
            <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 flex flex-col gap-0.5 sm:gap-1">
              {isNew && (
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5">
                  <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />
                  New
                </Badge>
              )}
              {hasDiscount && (
                <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5">
                  -{discountPercentage}%
                </Badge>
              )}
              {isLowStock && !isOutOfStock && (
                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5">
                  <Zap className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />
                  Low
                </Badge>
              )}
              {isOutOfStock && (
                <Badge className="bg-gradient-to-r from-gray-500 to-gray-600 text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5">
                  <Package className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />
                  Out
                </Badge>
              )}
            </div>

            {/* Mobile-Optimized Quick View Button */}
            <motion.div
              className="absolute inset-x-2 bottom-2 sm:inset-x-3 sm:bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
              animate={isHovered && !prefersReducedMotion ? { opacity: 1, y: 0 } : { y: 10 }}
            >
              <Button
                variant="secondary"
                size="sm"
                className="w-full bg-white/95 backdrop-blur-sm hover:bg-white text-text-primary text-xs sm:text-sm py-1.5 sm:py-2"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setQuickViewProduct(product)
                  setShowQuickView(true)
                }}
              >
                <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Quick View
              </Button>
            </motion.div>

            {/* Image Indicators */}
            {product.images.length > 1 && (
              <div className="absolute bottom-1.5 sm:bottom-2 left-1/2 transform -translate-x-1/2 flex gap-0.5 sm:gap-1">
                {product.images.slice(0, 3).map((_, index) => (
                  <div
                    key={index}
                    className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full transition-colors ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Mobile-Optimized Content Section */}
          <CardContent className="p-3 sm:p-4 md:p-5 flex-1 flex flex-col">
            {/* Brand */}
            {showBrand && product.brand && (
              <Badge
                variant="outline"
                className="text-[10px] sm:text-xs mb-1.5 sm:mb-2 w-fit text-brand-secondary border-brand-secondary/30"
              >
                {product.brand.name}
              </Badge>
            )}

            {/* Product Name - Mobile Optimized */}
            <h3 className="text-sm sm:text-base md:text-base font-bold text-text-primary mb-1.5 sm:mb-2 line-clamp-2 sm:line-clamp-3 flex-1 group-hover:text-brand-primary transition-colors leading-tight">
              {product.name}
            </h3>

            {/* Category */}
            {showCategory && product.category && (
              <Badge
                variant="secondary"
                className="text-[10px] sm:text-xs mb-2 sm:mb-3 w-fit text-white"
              >
                {product.category.name}
              </Badge>
            )}

            {/* Rating - Mobile Optimized */}
            {product.rating && product.rating > 0 && (
              <div className="flex items-center gap-1 mb-2">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${
                        i < Math.floor(product.rating!)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[9px] sm:text-[10px] text-text-secondary">
                  ({product.rating})
                </span>
              </div>
            )}

            {/* Price - Mobile Optimized */}
            <div className="flex flex-col gap-0.5 sm:gap-1 mb-2 sm:mb-3">
              <div className="flex items-baseline gap-1 sm:gap-2">
                <span className="text-base sm:text-lg md:text-xl font-black text-brand-primary">
                  Rs. {priceInLKR}
                </span>
                {hasDiscount && (
                  <span className="text-[10px] sm:text-xs text-text-secondary line-through">
                    Rs. {originalPriceInLKR}
                  </span>
                )}
              </div>
              {availableStock <= 5 && availableStock > 0 && (
                <span className="text-[9px] sm:text-xs text-text-secondary">
                  Only {availableStock} left
                </span>
              )}
            </div>

            {/* Action Button - Mobile Optimized */}
            <Button
              size="sm"
              disabled={isOutOfStock}
              className="w-full text-xs sm:text-sm py-1.5 sm:py-2 mt-auto text-white"
            >
              {isOutOfStock ? 'Out of Stock' : 'View Details'}
            </Button>
          </CardContent>
        </Card>
      </Link>

      {/* Quick View Dialog */}
      <Dialog open={showQuickView} onOpenChange={setShowQuickView}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle>{quickViewProduct?.name}</DialogTitle>
          </DialogHeader>
          {quickViewProduct && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Quick view content here */}
              <div className="aspect-square relative">
                <LazyImage
                  src={quickViewProduct.images[0]?.url || '/placeholder-product.jpg'}
                  alt={quickViewProduct.images[0]?.alt || quickViewProduct.name}
                  width={600}
                  height={600}
                  className="object-cover rounded-lg"
                />
              </div>
              <div className="space-y-4">
                {quickViewProduct.brand && (
                  <Badge variant="outline">{quickViewProduct.brand.name}</Badge>
                )}
                <h3 className="text-2xl font-bold">{quickViewProduct.name}</h3>
                <div className="text-3xl font-black text-brand-primary">
                  Rs. {quickViewProduct.price.toLocaleString()}
                </div>
                {quickViewProduct.description && (
                  <div className="text-text-secondary">
                    {typeof quickViewProduct.description === 'string' ? (
                      <p>{quickViewProduct.description}</p>
                    ) : (
                      <RichTextRenderer content={quickViewProduct.description} />
                    )}
                  </div>
                )}
                <div className="flex gap-3">
                  <Button asChild className="flex-1">
                    <Link href={`/products/${quickViewProduct.slug}`}>View Full Details</Link>
                  </Button>
                  <Button variant="outline" onClick={() => setShowQuickView(false)}>
                    Close
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
