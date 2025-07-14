'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star, Eye, Zap, Package, Check, X, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useCart } from '@/hooks/use-cart'
import type { ProductListItem } from '@/types/api'
import { LazyImage } from '@/components/ui/lazy-image'

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
  const { addItem } = useCart()

  const createDefaultVariant = (): import('@/types/product').ProductVariant => ({
    id: `${product.id}-default`,
    name: product.name,
    price: product.price,
    sku: product.sku,
    inventory: product.stock,
    size: product.sizes.length > 0 ? product.sizes[0] : undefined,
    color: product.colors.length > 0 ? product.colors[0] : undefined,
    options: {
      ...(product.sizes.length > 0 && { size: product.sizes[0] }),
      ...(product.colors.length > 0 && { color: product.colors[0] }),
    },
  })

  const lowStockThreshold = (product as any)?.pricing?.lowStockThreshold ?? 5

  const getAvailableStock = () => {
    if (Array.isArray(product.variants) && product.variants.length > 0) {
      return product.variants.reduce((total, variant) => total + (variant.inventory || 0), 0)
    }
    return product.stock || 0
  }

  const availableStock = getAvailableStock()
  const isOutOfStock = availableStock === 0
  const isLowStock = !isOutOfStock && availableStock <= lowStockThreshold

  const hasDiscount = product.originalPrice && product.originalPrice > product.price
  const discountPercentage = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0

  const priceInLKR = product.price.toLocaleString()

  // Detect reduced motion preference
  const prefersReducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false

  const isMobileOptimized = typeof window !== 'undefined' && window.innerWidth < 768

  if (variant === 'list') {
    return (
      <motion.div
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        whileHover={prefersReducedMotion ? {} : { scale: 1.01 }}
      >
        <Card
          className={`overflow-hidden border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}
          style={{ backgroundColor: 'var(--surface)' }}
        >
          <Link href={`/products/${product.slug}`}>
            <CardContent className="p-0">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4">
                {/* Enhanced Image Section */}
                <div
                  className="relative aspect-square sm:aspect-auto sm:h-32 md:h-40 rounded-xl overflow-hidden group"
                  style={{ background: 'linear-gradient(135deg, #F3F4F6, #E5E7EB)' }}
                >
                  <LazyImage
                    width={600}
                    height={400}
                    src={product.images[0]?.url || '/placeholder.svg'}
                    alt={product.images[0]?.alt || product.name}
                    className={`w-full h-full object-cover ${!prefersReducedMotion ? 'group-hover:scale-110 transition-transform duration-500' : ''}`}
                    containerClassName="w-full h-full"
                  />

                  {/* Enhanced Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {hasDiscount && (
                      <Badge
                        className="text-white text-xs font-bold shadow-lg"
                        style={{
                          background: 'linear-gradient(135deg, var(--accent-amber), #FBBF24)',
                        }}
                      >
                        <Sparkles className="w-3 h-3 mr-1" />-{discountPercentage}%
                      </Badge>
                    )}
                    {isOutOfStock && (
                      <Badge
                        className="text-white text-xs font-bold shadow-lg"
                        style={{ background: 'var(--error)' }}
                      >
                        <X className="w-3 h-3 mr-1" />
                        Out of Stock
                      </Badge>
                    )}
                    {isLowStock && (
                      <Badge
                        className="text-white text-xs font-bold shadow-lg"
                        style={{ background: 'var(--warning)' }}
                      >
                        <Zap className="w-3 h-3 mr-1" />
                        Low Stock
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Content Section */}
                <div className="sm:col-span-2 flex flex-col gap-2">
                  {showBrand && product.brand && (
                    <Badge
                      variant="outline"
                      className="text-xs border-blue-500 bg-blue-50 w-fit"
                      style={{
                        color: 'var(--secondary-blue)',
                        borderColor: 'var(--secondary-blue)',
                      }}
                    >
                      {product.brand.name}
                    </Badge>
                  )}
                  <h3
                    className="text-sm sm:text-base md:text-lg font-bold line-clamp-2 transition-colors flex-1"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {product.name}
                  </h3>

                  {showCategory && product.category && (
                    <Badge
                      variant="secondary"
                      className="text-xs w-fit"
                      style={{ backgroundColor: '#F3F4F6', color: 'var(--text-secondary)' }}
                    >
                      {product.category.name}
                    </Badge>
                  )}

                  {/* Enhanced Rating */}
                  {product.rating && product.rating > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < Math.floor(product.rating!)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                          ({product.rating})
                        </span>
                      </div>
                      <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        {product.reviewCount} reviews
                      </span>
                    </div>
                  )}

                  {/* Enhanced Features Preview */}
                  {product.features && product.features.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {product.features.slice(0, 2).map((feature, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs border-gray-200"
                          style={{ backgroundColor: 'var(--surface)' }}
                        >
                          <Check className="w-3 h-3 mr-1" />
                          {feature}
                        </Badge>
                      ))}
                      {product.features.length > 2 && (
                        <Badge
                          variant="outline"
                          className="text-xs"
                          style={{ backgroundColor: 'var(--surface)' }}
                        >
                          +{product.features.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Enhanced Price */}
                  <div className="flex items-center gap-2 mt-auto">
                    <span
                      className="text-lg sm:text-xl font-bold"
                      style={{ color: 'var(--primary-orange)' }}
                    >
                      Rs. {priceInLKR}
                    </span>
                    {hasDiscount && (
                      <span
                        className="text-sm line-through"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        Rs. {product.originalPrice!.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Link>
        </Card>
      </motion.div>
    )
  }

  // Grid variant (default)
  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
    >
      <Card
        className={`overflow-hidden border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 ${className}`}
        style={{ backgroundColor: 'var(--surface)' }}
      >
        <Link href={`/products/${product.slug}`}>
          <CardContent className="p-0">
            {/* Enhanced Image */}
            <div
              className={`relative overflow-hidden group/image ${
                isMobileOptimized ? 'aspect-[4/3] sm:aspect-square' : 'aspect-square'
              }`}
              style={{ background: 'linear-gradient(135deg, #F3F4F6, #E5E7EB)' }}
            >
              <LazyImage
                width={400}
                height={400}
                src={product.images?.[currentImageIndex]?.url || '/placeholder.svg'}
                alt={product.images?.[currentImageIndex]?.alt || product.name}
                className={`w-full h-full object-cover ${!prefersReducedMotion ? 'group-hover/image:scale-110 transition-transform duration-700' : ''}`}
                containerClassName="w-full h-full"
              />

              {/* Enhanced Badges */}
              <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-col gap-1 sm:gap-2">
                {hasDiscount && (
                  <Badge
                    className="text-white text-xs font-bold shadow-lg px-2 py-1"
                    style={{ background: 'linear-gradient(135deg, var(--accent-amber), #FBBF24)' }}
                  >
                    <Sparkles className="w-3 h-3 mr-1" />
                    SALE
                  </Badge>
                )}
                {isOutOfStock && (
                  <Badge
                    className="text-white text-xs font-bold shadow-lg px-2 py-1"
                    style={{ background: 'var(--error)' }}
                  >
                    <X className="w-3 h-3 mr-1" />
                    SOLD OUT
                  </Badge>
                )}
                {isLowStock && !hasDiscount && (
                  <Badge
                    className="text-white text-xs font-bold shadow-lg px-2 py-1"
                    style={{ background: 'var(--warning)' }}
                  >
                    <Zap className="w-3 h-3 mr-1" />
                    LOW STOCK
                  </Badge>
                )}
              </div>

              {/* Quick View Button */}
              <div
                className={`absolute top-2 sm:top-3 right-2 sm:right-3 ${!prefersReducedMotion ? 'transform transition-all duration-300' : ''} ${isHovered ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
              >
                <Button
                  size="sm"
                  variant="secondary"
                  className="w-8 h-8 p-0 rounded-full bg-white/90 shadow-lg backdrop-blur-sm"
                  style={{ borderColor: 'var(--border-gray)' }}
                >
                  <Eye className="w-4 h-4" style={{ color: 'var(--text-primary)' }} />
                </Button>
              </div>

              {/* Image Navigation */}
              {product.images && product.images.length > 1 && (
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                  {product.images.slice(0, 3).map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.preventDefault()
                        setCurrentImageIndex(index)
                      }}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentImageIndex
                          ? 'bg-white scale-125'
                          : 'bg-white/50 hover:bg-white/75'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Enhanced Content */}
            <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
              {/* Brand and Category */}
              <div className="flex items-center justify-between gap-2">
                {showBrand && product.brand && (
                  <Badge
                    variant="outline"
                    className="text-xs bg-blue-50"
                    style={{ color: 'var(--secondary-blue)', borderColor: 'var(--secondary-blue)' }}
                  >
                    {product.brand.name}
                  </Badge>
                )}
                {showCategory && product.category && (
                  <Badge
                    variant="secondary"
                    className="text-xs"
                    style={{ backgroundColor: '#F3F4F6', color: 'var(--text-secondary)' }}
                  >
                    {product.category.name}
                  </Badge>
                )}
              </div>

              {/* Product Name */}
              <h3
                className={`font-bold line-clamp-2 transition-colors ${
                  isMobileOptimized ? 'text-sm sm:text-base' : 'text-lg'
                }`}
                style={{ color: 'var(--text-primary)' }}
              >
                {product.name}
              </h3>

              {/* Enhanced Rating */}
              {product.rating && product.rating > 0 && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < Math.floor(product.rating!)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      ({product.rating})
                    </span>
                  </div>
                  {!isMobileOptimized && (
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {product.reviewCount} reviews
                    </span>
                  )}
                </div>
              )}

              {/* Enhanced Features Preview */}
              {product.features && product.features.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {product.features.slice(0, 2).map((feature, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="text-xs border-gray-200"
                      style={{ backgroundColor: 'var(--surface)' }}
                    >
                      <Check className="w-3 h-3 mr-1" />
                      {feature}
                    </Badge>
                  ))}
                  {product.features.length > 2 && (
                    <Badge
                      variant="outline"
                      className="text-xs"
                      style={{ backgroundColor: 'var(--surface)' }}
                    >
                      +{product.features.length - 2}
                    </Badge>
                  )}
                </div>
              )}

              {/* Enhanced Product Info */}
              {!isMobileOptimized &&
                (() => {
                  // Compute unique sizes/colors from variants
                  let sizes: string[] = []
                  let colors: string[] = []
                  if (Array.isArray(product.variants) && product.variants.length > 0) {
                    sizes = Array.from(
                      new Set(
                        product.variants
                          .map((v) => v.size)
                          .filter((s): s is string => typeof s === 'string'),
                      ),
                    )
                    colors = Array.from(
                      new Set(
                        product.variants
                          .map((v) => v.color)
                          .filter((c): c is string => typeof c === 'string'),
                      ),
                    )
                  }
                  return (
                    <div
                      className="flex items-center gap-4 text-xs"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {sizes.length > 0 && (
                        <div className="flex items-center gap-1">
                          <Package className="w-3 h-3" />
                          <span>{sizes.length} sizes</span>
                        </div>
                      )}
                      {colors.length > 0 && (
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-red-500 via-blue-500 to-green-500"></div>
                          <span>{colors.length} colors</span>
                        </div>
                      )}
                    </div>
                  )
                })()}

              {/* Enhanced Price and Actions */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex flex-col gap-1">
                  <span
                    className={`font-bold ${
                      isMobileOptimized ? 'text-base sm:text-lg' : 'text-xl'
                    }`}
                    style={{ color: 'var(--primary-orange)' }}
                  >
                    Rs. {priceInLKR}
                  </span>
                  {hasDiscount && (
                    <span
                      className="text-xs line-through"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      Rs. {product.originalPrice!.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Stock Status */}
                <div className="text-right">
                  {isOutOfStock ? (
                    <Badge
                      className="text-xs font-bold"
                      style={{ backgroundColor: 'var(--error)', color: 'white' }}
                    >
                      Sold Out
                    </Badge>
                  ) : isLowStock ? (
                    <Badge
                      className="text-xs font-bold"
                      style={{ backgroundColor: 'var(--warning)', color: 'white' }}
                    >
                      {availableStock} left
                    </Badge>
                  ) : (
                    <Badge
                      className="text-xs font-bold"
                      style={{ backgroundColor: 'var(--success)', color: 'white' }}
                    >
                      In Stock
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Link>
      </Card>
    </motion.div>
  )
}
