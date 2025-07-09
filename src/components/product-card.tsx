'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Star, Eye, Zap, Package, Check, X } from 'lucide-react'
import Link from 'next/link'
import { useCart } from '@/hooks/use-cart'
import { toast } from 'sonner'
import { ProductListItem } from '@/types/api'
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

  // Create a simple variant for cart
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

  // Removed handleAddToCart for product list page (no cart button)

  // Helper: get low stock threshold (from product.pricing or default 5)
  const lowStockThreshold = (product as any)?.pricing?.lowStockThreshold ?? 5

  // Helper: get available stock (base or sum of variants)
  const getAvailableStock = () => {
    // If product has variants, sum their inventory
    if (Array.isArray(product.variants) && product.variants.length > 0) {
      return product.variants.reduce((sum: number, v: any) => sum + (v.inventory || 0), 0)
    }
    // Otherwise, use base stock
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
      <Card
        className={`overflow-hidden hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-700 ${className}`}
      >
        <Link href={`/products/${product.slug}`}>
          <CardContent className="p-0">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-3 sm:p-4">
              {/* Image Section */}
              <div className="relative aspect-square sm:aspect-auto sm:h-32 md:h-40 bg-gray-100 dark:bg-gray-600 rounded-lg overflow-hidden group">
                <Image
                  width={600}
                  height={400}
                  src={product.images[0]?.url || 'https://placehold.co/600x400'}
                  alt={product.images[0]?.alt || product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {hasDiscount && (
                    <Badge className="bg-[#FF3D00] text-white text-xs font-bold">
                      -{discountPercentage}%
                    </Badge>
                  )}
                  {isOutOfStock && (
                    <Badge variant="destructive" className="text-xs font-bold">
                      OUT OF STOCK
                    </Badge>
                  )}
                  {isLowStock && !isOutOfStock && (
                    <Badge className="bg-orange-500 text-white text-xs font-bold">
                      <Zap className="w-3 h-3 mr-1" />
                      LOW STOCK
                    </Badge>
                  )}
                </div>
              </div>

              {/* Content Section */}
              <div className="sm:col-span-2 space-y-2 sm:space-y-3">
                {/* Brand & Product Name - Inline Layout */}
                <div className="flex flex-wrap items-center gap-2">
                  {showBrand && product.brand && (
                    <Badge
                      variant="outline"
                      className="text-xs border-[#003DA5] dark:border-[#4A90E2] text-[#003DA5] dark:text-[#4A90E2]"
                    >
                      {product.brand.name}
                    </Badge>
                  )}
                  <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 dark:text-white line-clamp-2 hover:text-[#003DA5] dark:hover:text-[#4A90E2] transition-colors flex-1">
                    {product.name}
                  </h3>
                </div>

                {/* Category */}
                {showCategory && product.category && (
                  <Badge
                    variant="secondary"
                    className="text-xs bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
                  >
                    {product.category.name}
                  </Badge>
                )}

                {/* Rating */}
                {product.rating && product.reviewCount && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < Math.floor(product.rating!)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        ({product.rating})
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {product.reviewCount} reviews
                    </span>
                  </div>
                )}

                {/* Features */}
                {product.features && product.features.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {product.features.slice(0, 2).map((feature, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-xs bg-white dark:bg-gray-800"
                      >
                        {feature}
                      </Badge>
                    ))}
                    {product.features.length > 2 && (
                      <Badge variant="outline" className="text-xs bg-white dark:bg-gray-800">
                        +{product.features.length - 2}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Price & Actions */}
                <div className="flex items-center justify-between pt-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                        {priceInLKR}
                      </span>
                      {originalPriceInLKR && (
                        <span className="text-sm text-gray-500 line-through">
                          {originalPriceInLKR}
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
                      className="bg-[#003DA5] hover:bg-[#003DA5]/90 text-white px-3 py-2 text-xs sm:text-sm min-w-[80px]"
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
    )
  }

  return (
    <Card
      className={`overflow-hidden hover:shadow-xl transition-all duration-300 card-hover bg-white dark:bg-gray-700 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${product.slug}`}>
        <CardContent className="p-0">
          {/* Image Section - Full Width */}
          <div
            className={`relative bg-gray-100 dark:bg-gray-600 overflow-hidden group ${
              isMobileOptimized ? 'aspect-[4/3] sm:aspect-square' : 'aspect-square'
            }`}
          >
            <Image
              width={600}
              height={400}
              src={product.images[currentImageIndex]?.url || 'https://placehold.co/600x400'}
              alt={product.images[currentImageIndex]?.alt || product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />

            {/* Image Navigation - Only on desktop hover */}
            {product.images.length > 1 && isHovered && !isMobileOptimized && (
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                {product.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setCurrentImageIndex(index)
                    }}
                    title={`Select image ${index + 1}`}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/75'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {hasDiscount && (
                <Badge className="bg-[#FF3D00] text-white text-xs font-bold">
                  -{discountPercentage}%
                </Badge>
              )}
              {isOutOfStock && (
                <Badge variant="destructive" className="text-xs font-bold">
                  OUT OF STOCK
                </Badge>
              )}
              {isLowStock && !isOutOfStock && (
                <Badge className="bg-orange-500 text-white text-xs font-bold">
                  <Zap className="w-3 h-3 mr-1" />
                  LOW STOCK
                </Badge>
              )}
            </div>

            {/* Quick View - Only on desktop hover */}
            {!isMobileOptimized && (
              <div
                className={`absolute top-2 right-2 transition-all duration-300 ${
                  isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
                }`}
              >
                <Button
                  size="sm"
                  variant="secondary"
                  className="w-8 h-8 p-0 rounded-full bg-white/90 hover:bg-white"
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className={`space-y-2 sm:space-y-3 ${isMobileOptimized ? 'p-2 sm:p-3' : 'p-4'}`}>
            {/* Brand & Product Name */}
            <div className="space-y-1">
              {showBrand && product.brand && (
                <Badge
                  variant="outline"
                  className="text-xs border-[#003DA5] dark:border-[#4A90E2] text-[#003DA5] dark:text-[#4A90E2]"
                >
                  {product.brand.name}
                </Badge>
              )}
              <h3
                className={`font-bold text-gray-900 dark:text-white line-clamp-2 hover:text-[#003DA5] dark:hover:text-[#4A90E2] transition-colors ${
                  isMobileOptimized ? 'text-sm sm:text-base' : 'text-lg'
                }`}
              >
                {product.name}
              </h3>
            </div>

            {/* Category */}
            {showCategory && product.category && (
              <Badge
                variant="secondary"
                className="text-xs bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
              >
                {product.category.name}
              </Badge>
            )}

            {/* Rating */}
            {product.rating && product.reviewCount && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`${isMobileOptimized ? 'w-3 h-3' : 'w-4 h-4'} ${
                        i < Math.floor(product.rating!)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    ({product.rating})
                  </span>
                </div>
                {!isMobileOptimized && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {product.reviewCount} reviews
                  </span>
                )}
              </div>
            )}

            {/* Features - Only show on desktop */}
            {product.features && product.features.length > 0 && !isMobileOptimized && (
              <div className="space-y-1">
                <div className="flex flex-wrap gap-1">
                  {product.features.slice(0, 2).map((feature, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="text-xs bg-white dark:bg-gray-800"
                    >
                      {feature}
                    </Badge>
                  ))}
                  {product.features.length > 2 && (
                    <Badge variant="outline" className="text-xs bg-white dark:bg-gray-800">
                      +{product.features.length - 2}
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Sizes & Colors - Only show on desktop */}
            {!isMobileOptimized && (
              <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                {product.sizes.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Package className="w-3 h-3" />
                    <span>Sizes: {product.sizes.slice(0, 3).join(', ')}</span>
                    {product.sizes.length > 3 && <span>+{product.sizes.length - 3}</span>}
                  </div>
                )}
                {product.colors.length > 0 && (
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                    <span>
                      {product.colors.length} color{product.colors.length > 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Price - Removed SKU */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span
                  className={`font-bold text-gray-900 dark:text-white ${
                    isMobileOptimized ? 'text-base sm:text-lg' : 'text-xl'
                  }`}
                >
                  Rs.{priceInLKR}
                </span>
                {originalPriceInLKR && (
                  <span className="text-sm text-gray-500 line-through">{originalPriceInLKR}</span>
                )}
              </div>
            </div>

            {/* Stock Status */}
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

            {/* Action Buttons - Fixed Mobile Layout */}
            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                className={`flex-1 bg-[#003DA5] hover:bg-[#003DA5]/90 text-white font-bold transition-all btn-scale ${
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
  )
}
