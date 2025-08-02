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

  // List view variant
  if (variant === 'list') {
    return (
      <motion.div
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
        viewport={{ once: true }}
        className={className}
      >
        <Card className="overflow-hidden bg-brand-surface border-brand-border hover:shadow-xl transition-all duration-300 group">
          <Link href={`/products/${product.slug}`}>
            <CardContent className="p-0">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-6">
                {/* Image Section */}
                <div className="relative aspect-square sm:aspect-auto sm:h-32 rounded-xl overflow-hidden">
                  <LazyImage
                    width={400}
                    height={400}
                    src={
                      product.images[currentImageIndex]?.url ||
                      product.images[0]?.url ||
                      '/placeholder.svg'
                    }
                    alt={
                      product.images[currentImageIndex]?.alt ||
                      product.images[0]?.alt ||
                      product.name
                    }
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    containerClassName="w-full h-full"
                    onClick={product.images.length > 1 ? handleImageCycle : undefined}
                  />

                  {/* Compact Badges */}
                  <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                    {hasDiscount && (
                      <Badge className="text-[10px] px-2 py-0.5 bg-red-500 text-white font-bold">
                        -{discountPercentage}%
                      </Badge>
                    )}
                    {isNew && (
                      <Badge className="text-[10px] px-2 py-0.5 bg-green-500 text-white font-bold">
                        NEW
                      </Badge>
                    )}
                  </div>

                  {/* Stock Badge */}
                  <div className="absolute bottom-2 right-2">
                    {isOutOfStock ? (
                      <Badge className="text-[10px] px-2 py-0.5 bg-gray-500 text-white">
                        Out of Stock
                      </Badge>
                    ) : isLowStock ? (
                      <Badge className="text-[10px] px-2 py-0.5 bg-orange-500 text-white">
                        Low Stock
                      </Badge>
                    ) : null}
                  </div>
                </div>

                {/* Content Section */}
                <div className="sm:col-span-3 flex flex-col justify-between">
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
                    <h3 className="text-lg font-bold text-text-primary mb-2 line-clamp-2 group-hover:text-brand-primary transition-colors">
                      {product.name}
                    </h3>

                    {/* Category */}
                    {showCategory && product.category && (
                      <Badge variant="secondary" className="text-xs mb-3 w-fit">
                        {product.category.name}
                      </Badge>
                    )}

                    {/* Rating */}
                    {product.rating && product.rating > 0 && (
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-1">
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
                        <span className="text-sm text-text-secondary">
                          ({product.rating}) • {product.reviewCount} reviews
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Price and Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-brand-primary">
                        Rs. {priceInLKR}
                      </span>
                      {hasDiscount && (
                        <span className="text-lg text-text-secondary line-through">
                          Rs. {originalPriceInLKR}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Link>
        </Card>
      </motion.div>
    )
  }

  // Grid view variant (default)
  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
      viewport={{ once: true }}
      whileHover={prefersReducedMotion ? {} : { y: -4 }}
      className={className}
    >
      <Card className="overflow-hidden bg-brand-surface border-brand-border hover:shadow-xl transition-all duration-300 group h-full flex flex-col">
        <Link href={`/products/${product.slug}`} className="flex-1 flex flex-col">
          {/* Image Section */}
          <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
            <LazyImage
              width={400}
              height={400}
              src={
                product.images[currentImageIndex]?.url ||
                product.images[0]?.url ||
                '/placeholder.svg'
              }
              alt={product.images[currentImageIndex]?.alt || product.images[0]?.alt || product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              containerClassName="w-full h-full"
              onClick={product.images.length > 1 ? handleImageCycle : undefined}
            />

            {/* Professional Corner Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {hasDiscount && (
                <Badge className="text-[10px] px-2 py-0.5 bg-red-500 text-white font-bold shadow-sm">
                  -{discountPercentage}%
                </Badge>
              )}
              {isNew && (
                <Badge className="text-[10px] px-2 py-0.5 bg-green-500 text-white font-bold shadow-sm">
                  NEW
                </Badge>
              )}
            </div>

            {/* Quick View Button */}
            <motion.div
              className="absolute inset-x-2 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity"
              initial={false}
              animate={isHovered ? { y: 0 } : { y: 10 }}
            >
              <Button
                variant="secondary"
                size="sm"
                className="w-full bg-white/95 backdrop-blur-sm hover:bg-white text-text-primary"
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
            </motion.div>

            {/* Image Indicators */}
            {product.images.length > 1 && (
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                {product.images.slice(0, 3).map((_, index) => (
                  <div
                    key={index}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Content Section - Optimized for compactness */}
          <CardContent className="p-3 sm:p-4 lg:p-5 flex-1 flex flex-col">
            {/* Brand - Compact display */}
            {showBrand && product.brand && (
              <Badge
                variant="outline"
                className="text-[10px] sm:text-xs mb-1.5 sm:mb-2 w-fit text-brand-secondary border-brand-secondary/30 px-1.5 py-0.5"
              >
                {product.brand.name}
              </Badge>
            )}

            {/* Product Name - Compact with better line height */}
            <h3 className="text-sm sm:text-base font-bold text-text-primary mb-1.5 sm:mb-2 line-clamp-2 sm:line-clamp-3 flex-1 group-hover:text-brand-primary transition-colors leading-snug">
              {product.name}
            </h3>

            {/* Category - Compact */}
            {showCategory && product.category && (
              <Badge variant="secondary" className="text-[10px] sm:text-xs mb-2 sm:mb-3 w-fit px-1.5 py-0.5">
                {product.category.name}
              </Badge>
            )}

            {/* Rating */}
            {product.rating && product.rating > 0 && (
              <div className="flex items-center gap-1 mb-2">
                <div className="flex items-center gap-0.5">
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
                </div>
                <span className="text-[10px] text-text-secondary">({product.rating})</span>
              </div>
            )}

            {/* Price */}
            <div className="flex flex-col gap-1 mb-3">
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black text-brand-primary">Rs. {priceInLKR}</span>
                {hasDiscount && (
                  <span className="text-sm text-text-secondary line-through">
                    Rs. {originalPriceInLKR}
                  </span>
                )}
              </div>
            </div>

            {/* Stock Status */}
            <div className="mb-3">
              {isOutOfStock ? (
                <Badge className="text-xs px-2 py-1 bg-gray-500 text-white w-fit">
                  Out of Stock
                </Badge>
              ) : isLowStock ? (
                <Badge className="text-xs px-2 py-1 bg-orange-500 text-white w-fit">
                  <Zap className="w-3 h-3 mr-1" />
                  Only {availableStock} left
                </Badge>
              ) : (
                <Badge className="text-xs px-2 py-1 bg-green-500 text-white w-fit">
                  <Package className="w-3 h-3 mr-1" />
                  Available
                </Badge>
              )}
            </div>
          </CardContent>
        </Link>
      </Card>

      {/* Quick View Dialog */}
      <Dialog open={showQuickView} onOpenChange={setShowQuickView}>
        <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-white border shadow-2xl">
          {quickViewProduct && <QuickViewContent product={quickViewProduct} />}
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}

// Quick View Component
interface QuickViewContentProps {
  product: ProductListItem
}

function QuickViewContent({ product }: QuickViewContentProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Image Section */}
      <div className="space-y-3">
        {/* Main Image */}
        <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden">
          <LazyImage
            width={400}
            height={400}
            src={
              product.images[selectedImageIndex]?.url ||
              product.images[0]?.url ||
              '/placeholder.svg'
            }
            alt={product.images[selectedImageIndex]?.alt || product.images[0]?.alt || product.name}
            className="w-full h-full object-cover"
            containerClassName="w-full h-full"
          />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {hasDiscount && (
              <Badge className="text-xs px-2 py-1 bg-red-500 text-white font-bold">
                -{discountPercentage}%
              </Badge>
            )}
          </div>
        </div>

        {/* Thumbnail Images */}
        {product.images && product.images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto">
            {product.images.map((image, index) => (
              <button
                key={image.id || index}
                onClick={() => setSelectedImageIndex(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  index === selectedImageIndex
                    ? 'border-brand-primary'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <LazyImage
                  width={64}
                  height={64}
                  src={image.url || '/placeholder.svg'}
                  alt={image.alt || `${product.name} ${index + 1}`}
                  className="w-full h-full object-cover"
                  containerClassName="w-full h-full"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="space-y-4">
        <DialogHeader>
          <DialogTitle className="text-left">
            {/* Brand */}
            {product.brand && (
              <Badge
                variant="outline"
                className="text-sm mb-2 w-fit text-brand-secondary border-brand-secondary/30"
              >
                {product.brand.name}
              </Badge>
            )}
            <h2 className="text-2xl font-bold text-text-primary mb-2">{product.name}</h2>
          </DialogTitle>
        </DialogHeader>

        {/* Category */}
        {product.category && (
          <Badge variant="secondary" className="text-sm w-fit">
            {product.category.name}
          </Badge>
        )}

        {/* Price */}
        <div className="space-y-2">
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-black text-brand-primary">Rs. {priceInLKR}</span>
            {hasDiscount && (
              <span className="text-lg text-text-secondary line-through">
                Rs. {originalPriceInLKR}
              </span>
            )}
          </div>
          {hasDiscount && (
            <Badge className="bg-red-500 text-white font-bold">
              Save Rs. {(product.originalPrice! - product.price).toLocaleString()}
            </Badge>
          )}
        </div>

        {/* Stock Status */}
        <div>
          {isOutOfStock ? (
            <Badge className="bg-gray-500 text-white px-3 py-1">Out of Stock</Badge>
          ) : isLowStock ? (
            <Badge className="bg-orange-500 text-white px-3 py-1">
              <Zap className="w-3 h-3 mr-1" />
              Only {availableStock} left!
            </Badge>
          ) : (
            <Badge className="bg-green-500 text-white px-3 py-1">
              <Package className="w-3 h-3 mr-1" />
              Available
            </Badge>
          )}
        </div>

        {/* Description */}
        <div>
          <h4 className="font-semibold mb-2 text-gray-900">Description:</h4>
          <div className="text-sm text-gray-700 leading-relaxed">
            {product.description && typeof product.description === 'object' ? (
              <RichTextRenderer content={product.description} />
            ) : product.description &&
              typeof product.description === 'string' &&
              product.description.trim() !== '' ? (
              <p>{product.description}</p>
            ) : (
              <p>No description available.</p>
            )}
          </div>
        </div>

        {/* Features */}
        {product.features && product.features.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2">Key Features:</h4>
            <ul className="space-y-1 text-sm">
              {product.features.slice(0, 5).map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-brand-primary rounded-full mt-2 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2">Tags:</h4>
            <div className="flex flex-wrap gap-2">
              {product.tags.slice(0, 6).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* View Full Details Button */}
        <div className="pt-4 border-t">
          <Button asChild className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white">
            <Link href={`/products/${product.slug}`}>View Full Details</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
