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
import Image from 'next/image'

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
      return product.variants.reduce((sum: number, v: any) => sum + (v.inventory || 0), 0)
    }
    return typeof product.stock === 'number' ? product.stock : 0
  }

  const availableStock = getAvailableStock()
  const isOutOfStock = availableStock <= 0 || product.status === 'out-of-stock'
  const isLowStock = !isOutOfStock && availableStock > 0 && availableStock <= lowStockThreshold
  const hasDiscount = product.originalPrice && product.originalPrice > product.price
  const discountPercentage = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0

  const priceInLKR = product.price
  const originalPriceInLKR = product.originalPrice ? product.originalPrice : null
  const isMobileOptimized = className.includes('mobile-optimized')

  if (variant === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        whileHover={{ scale: 1.01 }}
      >
        <Card
          className={`overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}
        >
          <Link href={`/products/${product.slug}`}>
            <CardContent className="p-0">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4">
                {/* Enhanced Image Section */}
                <div className="relative aspect-square sm:aspect-auto sm:h-32 md:h-40 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-xl overflow-hidden group">
                  <Image
                    width={600}
                    height={400}
                    src={product.images[0]?.url || 'https://placehold.co/600x400'}
                    alt={product.images[0]?.alt || product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />

                  {/* Enhanced Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {hasDiscount && (
                      <Badge className="bg-gradient-to-r from-red-500 to-orange-400 text-white text-xs font-bold shadow-lg">
                        <Sparkles className="w-3 h-3 mr-1" />-{discountPercentage}%
                      </Badge>
                    )}
                    {isOutOfStock && (
                      <Badge variant="destructive" className="text-xs font-bold shadow-lg">
                        OUT OF STOCK
                      </Badge>
                    )}
                    {isLowStock && !isOutOfStock && (
                      <Badge className="bg-gradient-to-r from-orange-500 to-yellow-400 text-white text-xs font-bold shadow-lg">
                        <Zap className="w-3 h-3 mr-1" />
                        LOW STOCK
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Enhanced Content Section */}
                <div className="sm:col-span-2 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {showBrand && product.brand && (
                      <Badge
                        variant="outline"
                        className="text-xs border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50"
                      >
                        {product.brand.name}
                      </Badge>
                    )}
                    <h3 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 dark:text-white line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex-1">
                      {product.name}
                    </h3>
                  </div>

                  {showCategory && product.category && (
                    <Badge
                      variant="secondary"
                      className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                    >
                      {product.category.name}
                    </Badge>
                  )}

                  {/* Enhanced Rating */}
                  {product.rating && product.reviewCount && (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < Math.floor(product.rating!)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-slate-300'
                            }`}
                          />
                        ))}
                        <span className="text-xs text-slate-600 dark:text-slate-400">
                          ({product.rating})
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {product.reviewCount} reviews
                      </span>
                    </div>
                  )}

                  {/* Enhanced Features */}
                  {product.features && product.features.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {product.features.slice(0, 2).map((feature, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600"
                        >
                          {feature}
                        </Badge>
                      ))}
                      {product.features.length > 2 && (
                        <Badge variant="outline" className="text-xs bg-white dark:bg-slate-800">
                          +{product.features.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Enhanced Price & Actions */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                          Rs.{priceInLKR}
                        </span>
                        {originalPriceInLKR && (
                          <span className="text-sm text-slate-500 line-through">
                            Rs.{originalPriceInLKR}
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        {isOutOfStock ? (
                          <div className="flex items-center gap-1 text-red-600">
                            <X className="w-3 h-3" />
                            <span className="text-xs font-medium">Out of Stock</span>
                          </div>
                        ) : isLowStock ? (
                          <div className="flex items-center gap-1 text-orange-600">
                            <Zap className="w-3 h-3" />
                            <span className="text-xs font-medium">Only {availableStock} left</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-green-600">
                            <Check className="w-3 h-3" />
                            <span className="text-xs font-medium">Available</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-4 py-2 text-xs sm:text-sm min-w-[80px] shadow-lg hover:shadow-xl transition-all duration-300"
                        asChild
                      >
                        <Link href={`/products/${product.slug}`}>
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Link>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ y: -8, scale: 1.02 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group"
    >
      <Card
        className={`overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-500 ${className}`}
      >
        <Link href={`/products/${product.slug}`}>
          <CardContent className="p-0">
            {/* Enhanced Image Section */}
            <div
              className={`relative bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 overflow-hidden group/image ${
                isMobileOptimized ? 'aspect-[4/3] sm:aspect-square' : 'aspect-square'
              }`}
            >
              <Image
                width={600}
                height={400}
                src={product.images[currentImageIndex]?.url || 'https://placehold.co/600x400'}
                alt={product.images[currentImageIndex]?.alt || product.name}
                className="w-full h-full object-cover group-hover/image:scale-110 transition-transform duration-700"
              />

              {/* Enhanced Image Navigation */}
              {product.images.length > 1 && isHovered && !isMobileOptimized && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1"
                >
                  {product.images.map((_, index) => (
                    <button
                      key={index}
                      title={`Show image ${index + 1}`}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setCurrentImageIndex(index)
                      }}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentImageIndex
                          ? 'bg-white shadow-lg scale-125'
                          : 'bg-white/50 hover:bg-white/75'
                      }`}
                    />
                  ))}
                </motion.div>
              )}

              {/* Enhanced Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                {hasDiscount && (
                  <Badge className="bg-gradient-to-r from-red-500 to-orange-400 text-white text-xs font-bold shadow-lg">
                    <Sparkles className="w-3 h-3 mr-1" />-{discountPercentage}%
                  </Badge>
                )}
                {isOutOfStock && (
                  <Badge variant="destructive" className="text-xs font-bold shadow-lg">
                    OUT OF STOCK
                  </Badge>
                )}
                {isLowStock && !isOutOfStock && (
                  <Badge className="bg-gradient-to-r from-orange-500 to-yellow-400 text-white text-xs font-bold shadow-lg">
                    <Zap className="w-3 h-3 mr-1" />
                    LOW STOCK
                  </Badge>
                )}
              </div>

              {/* Enhanced Quick View */}
              {!isMobileOptimized && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: isHovered ? 1 : 0,
                    scale: isHovered ? 1 : 0.8,
                    y: isHovered ? 0 : 10,
                  }}
                  transition={{ duration: 0.3 }}
                  className="absolute top-3 right-3"
                >
                  <Button
                    size="sm"
                    className="w-10 h-10 p-0 rounded-full bg-white/90 hover:bg-white text-slate-900 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </motion.div>
              )}
            </div>

            {/* Enhanced Content Section */}
            <div className={`space-y-3 ${isMobileOptimized ? 'p-3' : 'p-4'}`}>
              <div className="space-y-2">
                {showBrand && product.brand && (
                  <Badge
                    variant="outline"
                    className="text-xs border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50"
                  >
                    {product.brand.name}
                  </Badge>
                )}
                <h3
                  className={`font-bold text-slate-900 dark:text-white line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${
                    isMobileOptimized ? 'text-sm sm:text-base' : 'text-lg'
                  }`}
                >
                  {product.name}
                </h3>
              </div>

              {showCategory && product.category && (
                <Badge
                  variant="secondary"
                  className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                >
                  {product.category.name}
                </Badge>
              )}

              {/* Enhanced Rating */}
              {product.rating && product.reviewCount && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`${isMobileOptimized ? 'w-3 h-3' : 'w-4 h-4'} ${
                          i < Math.floor(product.rating!)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-slate-300'
                        }`}
                      />
                    ))}
                    <span className="text-xs text-slate-600 dark:text-slate-400">
                      ({product.rating})
                    </span>
                  </div>
                  {!isMobileOptimized && (
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {product.reviewCount} reviews
                    </span>
                  )}
                </div>
              )}

              {/* Enhanced Features */}
              {product.features && product.features.length > 0 && !isMobileOptimized && (
                <div className="flex flex-wrap gap-1">
                  {product.features.slice(0, 2).map((feature, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="text-xs bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600"
                    >
                      {feature}
                    </Badge>
                  ))}
                  {product.features.length > 2 && (
                    <Badge variant="outline" className="text-xs bg-white dark:bg-slate-800">
                      +{product.features.length - 2}
                    </Badge>
                  )}
                </div>
              )}

              {/* Enhanced Sizes & Colors */}
              {!isMobileOptimized && (
                <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
                  {product.sizes.length > 0 && (
                    <div className="flex items-center gap-1">
                      <Package className="w-3 h-3" />
                      <span>Sizes: {product.sizes.slice(0, 3).join(', ')}</span>
                      {product.sizes.length > 3 && <span>+{product.sizes.length - 3}</span>}
                    </div>
                  )}
                  {product.colors.length > 0 && (
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-slate-400 to-slate-600"></div>
                      <span>
                        {product.colors.length} color{product.colors.length > 1 ? 's' : ''}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Enhanced Price */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent ${
                      isMobileOptimized ? 'text-base sm:text-lg' : 'text-xl'
                    }`}
                  >
                    Rs.{priceInLKR}
                  </span>
                  {originalPriceInLKR && (
                    <span className="text-sm text-slate-500 line-through">
                      Rs.{originalPriceInLKR}
                    </span>
                  )}
                </div>
              </div>

              {/* Enhanced Stock Status */}
              <div className="flex items-center justify-between">
                <div>
                  {isOutOfStock ? (
                    <div className="flex items-center gap-1 text-red-600">
                      <X className="w-3 h-3" />
                      <span className="text-xs font-medium">Out of Stock</span>
                    </div>
                  ) : isLowStock ? (
                    <div className="flex items-center gap-1 text-orange-600">
                      <Zap className="w-3 h-3" />
                      <span className="text-xs font-medium">Only {availableStock} left</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-green-600">
                      <Check className="w-3 h-3" />
                      <span className="text-xs font-medium">Available</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Enhanced Action Button */}
              <div className="pt-2">
                <Button
                  size="sm"
                  className={`w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold transition-all duration-300 shadow-lg hover:shadow-xl group/btn ${
                    isMobileOptimized ? 'text-xs px-2 py-2 min-h-[32px]' : 'text-sm'
                  }`}
                  asChild
                >
                  <Link href={`/products/${product.slug}`}>
                    <Eye className={`${isMobileOptimized ? 'w-3 h-3 mr-1' : 'w-4 h-4 mr-2'}`} />
                    {isMobileOptimized ? 'View' : 'View Item'}
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Link>
      </Card>
    </motion.div>
  )
}
