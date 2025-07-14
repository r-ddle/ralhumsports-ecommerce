'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/hooks/use-cart'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { ProductCard } from '@/components/product-card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  ShoppingCart,
  Share2,
  Check,
  Truck,
  Shield,
  RefreshCw,
  Plus,
  Minus,
  Zap,
  Globe,
  AlertCircle,
  Package,
  ArrowLeft,
} from 'lucide-react'
import { toast } from 'sonner'
import { RichTextRenderer } from '@/components/RichTextRenderer'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { ProductListItem } from '@/types/api'
import Image from 'next/image'
import { SITE_CONFIG } from '@/config/site-config'

// Patch ProductListItem to include variants for this page
type ProductVariantBackend = {
  id: string
  name: string
  sku: string
  size?: string
  color?: string
  price: number
  inventory: number
}

interface ProductListItemWithVariants extends ProductListItem {
  variants: ProductVariantBackend[]
}

interface ProductDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

// Product variant interface for frontend
interface ProductVariant {
  id: string
  name: string
  price: number
  size?: string
  color?: string
  inventory: number
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const router = useRouter()
  const [product, setProduct] = useState<ProductListItemWithVariants | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [relatedProducts, setRelatedProducts] = useState<ProductListItem[]>([])
  const [variants, setVariants] = useState<ProductVariant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [resolvedParams, setResolvedParams] = useState<{ slug: string } | null>(null)

  const { addItem } = useCart()

  // Detect reduced motion preference
  const prefersReducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false

  // Resolve params first
  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params
      setResolvedParams(resolved)
    }
    resolveParams()
  }, [params])

  // Fetch product data
  useEffect(() => {
    if (!resolvedParams?.slug) return

    const fetchProduct = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/public/products/${resolvedParams.slug}`)
        const data = await response.json()

        if (data.success && data.data) {
          setProduct(data.data)
        } else {
          setError(data.error || 'Product not found')
        }
      } catch (err) {
        setError('Failed to fetch product')
        console.error('Product fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [resolvedParams?.slug])

  // Use backend variants array for accurate inventory and details
  useEffect(() => {
    if (!product) return

    // If product.variants is a non-empty array, use as is
    if (Array.isArray(product.variants) && product.variants.length > 0) {
      setVariants(product.variants)
      setSelectedVariant(product.variants[0])
    } else {
      // Create a virtual variant from the product itself
      const virtualVariant = {
        id: product.id?.toString() || 'default',
        name: product.name || 'Standard',
        price: product.price,
        inventory: typeof product.stock === 'number' ? product.stock : 0,
        sku: product.sku,
        size: undefined,
        color: undefined,
      }
      setVariants([virtualVariant])
      setSelectedVariant(virtualVariant)
    }
  }, [product])

  // Fetch related products
  useEffect(() => {
    if (!product?.brand || !resolvedParams?.slug) return

    const fetchRelatedProducts = async () => {
      try {
        const response = await fetch(
          `/api/public/products?brand=${product.brand!.slug}&limit=4&status=active`,
        )
        const data = await response.json()

        if (data.success) {
          const filtered = data.data.filter((p: ProductListItem) => p.slug !== resolvedParams.slug)
          setRelatedProducts(filtered)
        }
      } catch (error) {
        console.error('Error fetching related products:', error)
      }
    }

    fetchRelatedProducts()
  }, [product, resolvedParams?.slug])

  if (loading) {
    return <ProductDetailSkeleton />
  }

  if (error) {
    return (
      <main className="min-h-screen pt-16 bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <Alert className="border-red-200 bg-red-50/80 backdrop-blur-sm">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
          <div className="mt-4">
            <Button asChild className="bg-gradient-to-r from-[#003DA5] to-[#0052CC] text-white">
              <Link href="/products">← Back to Products</Link>
            </Button>
          </div>
        </div>
      </main>
    )
  }

  if (!product) {
    return (
      <main className="min-h-screen pt-16 bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <Alert className="border-red-200 bg-red-50/80 backdrop-blur-sm">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">Product not found</AlertDescription>
          </Alert>
          <div className="mt-4">
            <Button asChild className="bg-gradient-to-r from-[#003DA5] to-[#0052CC] text-white">
              <Link href="/products">← Back to Products</Link>
            </Button>
          </div>
        </div>
      </main>
    )
  }

  if (!selectedVariant) {
    return <ProductDetailSkeleton />
  }

  const handleAddToCart = () => {
    if (selectedVariant.inventory < quantity) {
      toast.error(`Only ${selectedVariant.inventory} items available in stock`)
      return
    }

    // Convert ProductListItem to Product for cart
    const brand: import('@/types/product').Brand | undefined = product.brand
      ? {
          id: String(product.brand.id),
          name: product.brand.name,
          slug: product.brand.slug,
          description: product.brand.description ?? '',
          logo: product.brand.logo ?? '',
          website: product.brand.website ?? '',
          featured: false,
          createdAt: '',
          updatedAt: '',
        }
      : undefined

    const cartProduct: import('@/types/product').Product = {
      id: product.id.toString(),
      title: product.name,
      slug: product.slug,
      description: typeof product.description === 'string' ? product.description : '',
      brand: brand!,
      categories: [],
      images: product.images,
      variants: [],
      tags: [],
      featured: false,
      status: 'active',
      createdAt: '',
      updatedAt: '',
      sku: product.sku,
      specifications: product.specifications as Record<string, string> | undefined,
      relatedProducts: [],
      seo: undefined,
      shortDescription: '',
    }

    addItem(cartProduct, selectedVariant as import('@/types/product').ProductVariant, quantity)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text:
            typeof product.description === 'string'
              ? product.description
              : `Check out this ${product.name} from ${product.brand?.name}`,
          url: window.location.href,
        })
      } catch (error) {
        console.warn('Share cancelled', error)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Product link copied to clipboard!')
    }
  }

  const lowStockThreshold = (product as any)?.pricing?.lowStockThreshold ?? 5
  const isOutOfStock = selectedVariant.inventory === 0
  const isLowStock = !isOutOfStock && selectedVariant.inventory <= lowStockThreshold
  const maxQuantity = selectedVariant.inventory

  return (
    <main className="min-h-screen pt-16" style={{ background: 'var(--background)' }}>
      <section className="py-4 sm:py-6 lg:py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Enhanced Back Button */}
          <div className="mb-4 sm:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className={`p-2 bg-white/80 backdrop-blur-sm shadow-lg rounded-xl ${!prefersReducedMotion ? 'hover:scale-105 transition-all duration-300' : ''}`}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
            {/* Enhanced Product Images */}
            <div
              className={`space-y-3 sm:space-y-4 ${!prefersReducedMotion ? 'animate-fade-in-up' : ''}`}
            >
              {/* Main Image with Enhanced Styling */}
              <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden group shadow-2xl">
                <Image
                  width={600}
                  height={400}
                  src={
                    product.images &&
                    product.images.length > 0 &&
                    product.images[selectedImage]?.url
                      ? product.images[selectedImage].url
                      : '/placeholder.svg'
                  }
                  alt={
                    product.images &&
                    product.images.length > 0 &&
                    product.images[selectedImage]?.alt
                      ? product.images[selectedImage].alt
                      : product.name
                  }
                  className={`w-full h-full object-cover ${!prefersReducedMotion ? 'group-hover:scale-105 transition-transform duration-500' : ''}`}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = '/placeholder.svg'
                  }}
                />

                {/* Enhanced Product Badges */}
                <div className="absolute top-3 sm:top-4 left-3 sm:left-4 flex flex-col gap-2">
                  {product.originalPrice && product.originalPrice > product.price && (
                    <Badge className="bg-gradient-to-r from-[#FF3D00] to-[#FF6B47] text-white font-bold text-xs sm:text-sm shadow-lg backdrop-blur-sm">
                      SALE
                    </Badge>
                  )}
                  {isOutOfStock && (
                    <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white font-bold text-xs sm:text-sm shadow-lg backdrop-blur-sm">
                      OUT OF STOCK
                    </Badge>
                  )}
                </div>

                {/* Enhanced Share Button */}
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={handleShare}
                    className={`w-10 h-10 p-0 rounded-full bg-white/90 hover:bg-white shadow-lg backdrop-blur-sm ${!prefersReducedMotion ? 'hover:scale-110 transition-all duration-300' : ''}`}
                  >
                    <Share2 className="w-5 h-5 text-gray-600" />
                  </Button>
                </div>
              </div>

              {/* Enhanced Thumbnail Images */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={image.id || index}
                      onClick={() => setSelectedImage(index)}
                      title={`Select image ${index + 1}`}
                      className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 shadow-lg ${
                        index === selectedImage
                          ? 'border-[#003DA5] ring-2 ring-[#003DA5]/20 scale-105'
                          : 'border-gray-200 hover:border-gray-300 hover:scale-105'
                      }`}
                    >
                      <Image
                        width={100}
                        height={100}
                        src={image.url || '/placeholder.svg'}
                        alt={image.alt || `${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = '/placeholder.svg'
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Enhanced Product Details */}
            <div
              className={`space-y-4 ${!prefersReducedMotion ? 'animate-fade-in-up delay-200' : ''}`}
            >
              {/* Brand */}
              {product.brand && (
                <div className="flex">
                  <Link
                    href={`/products?brand=${product.brand.slug}`}
                    className={`font-bold text-base sm:text-xl hover:underline ${!prefersReducedMotion ? 'hover:scale-105 transition-all duration-300' : ''}`}
                    style={{ color: 'var(--secondary-blue)' }}
                  >
                    {product.brand.name}
                  </Link>
                </div>
              )}

              {/* Title */}
              <h1
                className="text-2xl sm:text-3xl lg:text-4xl font-black leading-tight"
                style={{ color: 'var(--text-primary)' }}
              >
                {product.name}
              </h1>

              {/* Enhanced Price Display */}
              <div className="space-y-4">
                {/* Main Price */}
                <div className="flex items-baseline gap-3">
                  <span
                    className="text-3xl sm:text-4xl font-black"
                    style={{ color: 'var(--primary-orange)' }}
                  >
                    Rs. {selectedVariant.price.toLocaleString()}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-lg text-gray-500 line-through">
                      Rs. {product.originalPrice.toLocaleString()}
                    </span>
                  )}
                  {product.originalPrice && product.originalPrice > product.price && (
                    <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white font-bold text-sm">
                      Save Rs. {(product.originalPrice - product.price).toLocaleString()}
                    </Badge>
                  )}
                </div>

                {/* Price Info */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                  <p className="text-xs sm:text-sm text-blue-800 font-medium">
                    Price includes tax. Free shipping on orders over LKR{' '}
                    <span className="font-bold">{SITE_CONFIG.shipping.freeShippingThreshold}</span>.
                  </p>
                </div>
              </div>

              {/* Enhanced Stock Status */}
              <div className="flex items-center gap-2">
                {isOutOfStock ? (
                  <Badge className="bg-gradient-to-r from-red-100 to-red-200 text-red-800 font-bold px-4 py-2 shadow-lg">
                    Out of Stock
                  </Badge>
                ) : isLowStock ? (
                  <Badge className="bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 font-bold px-4 py-2 shadow-lg">
                    <Zap className="w-3 h-3 mr-1" />
                    Only {selectedVariant.inventory} left!
                  </Badge>
                ) : (
                  <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 font-bold px-4 py-2 shadow-lg">
                    <Check className="w-3 h-3 mr-1" />
                    In Stock
                  </Badge>
                )}
              </div>

              {/* Enhanced Variant Selection */}
              <div className="space-y-4 sm:space-y-6">
                {variants.length > 1 && (
                  <div className="space-y-3">
                    <h3
                      className="font-bold text-sm sm:text-base"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      Select Variant:
                    </h3>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      {variants.map((variant) => {
                        const isSelected = selectedVariant?.id === variant.id
                        const isAvailable = variant.inventory > 0
                        const mainLabel = variant.name || 'Standard'
                        let subLabel = ''
                        if (variant.size && variant.color) {
                          if (variant.name !== variant.size && variant.name !== variant.color) {
                            subLabel = `${variant.size} - ${variant.color}`
                          } else if (
                            variant.name === variant.size &&
                            variant.name !== variant.color
                          ) {
                            subLabel = variant.color
                          } else if (
                            variant.name === variant.color &&
                            variant.name !== variant.size
                          ) {
                            subLabel = variant.size
                          }
                        } else if (variant.size && variant.name !== variant.size) {
                          subLabel = variant.size
                        } else if (variant.color && variant.name !== variant.color) {
                          subLabel = variant.color
                        }
                        return (
                          <button
                            key={variant.id}
                            onClick={() => {
                              setSelectedVariant(variant)
                              setQuantity(1)
                            }}
                            disabled={!isAvailable}
                            className={`min-w-[2.5rem] sm:min-w-[3rem] h-12 sm:h-14 px-3 sm:px-4 rounded-xl border-2 font-medium transition-all duration-300 text-sm sm:text-base flex flex-col items-center justify-center text-center shadow-lg ${
                              isSelected
                                ? 'border-[#003DA5] bg-gradient-to-r from-[#003DA5] to-[#0052CC] text-white shadow-xl scale-105'
                                : isAvailable
                                  ? 'border-gray-300 bg-white text-gray-900 hover:border-[#003DA5] hover:scale-105'
                                  : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed line-through'
                            }`}
                            aria-label={`Select variant ${mainLabel}${subLabel ? ' ' + subLabel : ''}`}
                          >
                            <span className="font-bold">{mainLabel}</span>
                            {subLabel && (
                              <span className="text-xs text-white font-normal">{subLabel}</span>
                            )}
                            {!isAvailable && (
                              <span className="text-xs text-red-500 mt-1">Out of stock</span>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Enhanced Selected Variant Info */}
                {selectedVariant && variants.length > 1 && (
                  <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p
                          className="font-medium text-sm sm:text-base"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          Selected:
                        </p>
                        <p
                          className="text-xs sm:text-sm"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          {selectedVariant.name ||
                            (selectedVariant.size && selectedVariant.color
                              ? `${selectedVariant.size} - ${selectedVariant.color}`
                              : selectedVariant.size || selectedVariant.color || 'Standard')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className="font-bold text-sm sm:text-base"
                          style={{ color: 'var(--secondary-blue)' }}
                        >
                          Rs. {selectedVariant.price.toLocaleString()}
                        </p>
                        {selectedVariant.inventory <= 5 && selectedVariant.inventory > 0 && (
                          <p className="text-xs text-orange-600">
                            Only {selectedVariant.inventory} left
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Enhanced Quantity Selector */}
              <div className="space-y-2">
                <label
                  htmlFor="quantity"
                  className="font-bold text-sm sm:text-base"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Quantity:
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border-2 border-gray-300 rounded-xl bg-white shadow-lg">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className={`h-10 w-10 p-0 rounded-l-xl ${!prefersReducedMotion ? 'hover:scale-110 transition-all duration-300' : ''}`}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-16 text-center font-bold text-base">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                      disabled={quantity >= maxQuantity || isOutOfStock}
                      className={`h-10 w-10 p-0 rounded-r-xl ${!prefersReducedMotion ? 'hover:scale-110 transition-all duration-300' : ''}`}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {isLowStock && (
                    <span className="text-sm text-orange-600 dark:text-orange-400 font-semibold">
                      Only {selectedVariant.inventory} left
                    </span>
                  )}
                </div>
              </div>

              {/* Enhanced Add to Cart Buttons */}
              <div className="space-y-3">
                <Button
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`w-full bg-gradient-to-r from-[#FF3D00] to-[#FF6B47] hover:from-[#FF6B47] hover:to-[#FF3D00] text-white font-bold py-4 text-lg rounded-xl shadow-2xl ${!prefersReducedMotion ? 'hover:scale-[1.02] transition-all duration-300' : ''}`}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className={`w-full font-bold border-2 border-[#003DA5] text-[#003DA5] hover:bg-gradient-to-r hover:from-[#003DA5] hover:to-[#0052CC] hover:text-white py-4 text-lg rounded-xl shadow-lg ${!prefersReducedMotion ? 'hover:scale-[1.02] transition-all duration-300' : ''}`}
                  onClick={() => {
                    handleAddToCart()
                    router.push('/checkout')
                  }}
                  disabled={isOutOfStock}
                >
                  {isOutOfStock ? 'Out of Stock' : 'Buy Now'}
                </Button>
              </div>

              {/* Enhanced Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                {[
                  { icon: Truck, title: 'Free Shipping', desc: 'On orders above 50k' },
                  { icon: Shield, title: 'Secure Payment', desc: 'SSL Protected' },
                  { icon: RefreshCw, title: 'Easy Returns', desc: '30-day policy' },
                ].map((trust, index) => (
                  <div
                    key={trust.title}
                    className={`text-center p-3 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-100 shadow-lg ${!prefersReducedMotion ? 'hover:scale-105 transition-all duration-300' : ''}`}
                  >
                    <trust.icon className="w-6 h-6 mx-auto text-[#003DA5] mb-2" />
                    <div className="text-xs font-bold text-gray-900">{trust.title}</div>
                    <div className="text-xs text-gray-600 hidden sm:block">{trust.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Enhanced Product Details Tabs */}
          <div
            className={`mt-12 sm:mt-16 ${!prefersReducedMotion ? 'animate-fade-in-up delay-400' : ''}`}
          >
            <Tabs defaultValue="description" className="w-full">
              {/* Enhanced Tabs Navigation */}
              <TabsList className="grid w-full grid-cols-3 mb-6 sm:mb-8 h-auto bg-gradient-to-r from-gray-100 to-blue-100 rounded-2xl p-2 shadow-xl">
                {['description', 'specifications', 'shipping'].map((tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className={`font-bold text-xs sm:text-sm py-3 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg transition-all duration-300 ${!prefersReducedMotion ? 'hover:scale-105' : ''}`}
                    style={{ '[data-state=active]': { color: 'var(--secondary-blue)' } }}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Description Tab */}
              <TabsContent value="description" className="space-y-6">
                <Card className="bg-white/80 backdrop-blur-md shadow-2xl border border-white/20">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                      Product Description
                    </h3>
                    <div className="prose max-w-none text-gray-700 dark:text-gray-300">
                      <div className="mb-6">
                        {product.description ? (
                          <div className="leading-relaxed text-base">
                            <RichTextRenderer content={product.description} />
                          </div>
                        ) : (
                          <p className="text-gray-500 italic">No description available</p>
                        )}
                      </div>

                      {/* Enhanced Features Section */}
                      <div className="mb-6">
                        <h4 className="font-bold mb-3 text-gray-900 dark:text-white">
                          Key Features:
                        </h4>
                        {product.features && product.features.length > 0 ? (
                          <ul className="space-y-2">
                            {product.features.map((feature, index) => (
                              <li
                                key={index}
                                className={`flex items-start gap-2 p-2 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 ${!prefersReducedMotion ? 'hover:scale-[1.02] transition-all duration-300' : ''}`}
                              >
                                <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-500 italic">No features listed</p>
                        )}
                      </div>

                      {/* Enhanced Tags Section */}
                      <div>
                        <h4 className="font-bold mb-3 text-gray-900 dark:text-white">Tags:</h4>
                        {product.tags && product.tags.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {product.tags.map((tag) => (
                              <Badge
                                key={tag}
                                className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200 shadow-lg"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 italic">No tags available</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Enhanced Specifications Tab */}
              <TabsContent value="specifications" className="space-y-6">
                <Card className="bg-white/80 backdrop-blur-md shadow-2xl border border-white/20">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
                      Technical Specifications
                    </h3>

                    {product.specifications && Object.keys(product.specifications).length > 0 ? (
                      <div className="space-y-4">
                        {/* Desktop Table */}
                        <div className="hidden sm:block overflow-x-auto">
                          <table className="w-full border-collapse bg-white rounded-xl overflow-hidden shadow-lg">
                            <thead>
                              <tr className="bg-gradient-to-r from-[#003DA5] to-[#0052CC] text-white">
                                <th className="text-left py-4 px-6 font-bold w-1/3">Property</th>
                                <th className="text-left py-4 px-6 font-bold">Value</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {Object.entries(product.specifications).map(([key, value]) => (
                                <tr
                                  key={key}
                                  className={`hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 transition-all duration-300 ${!prefersReducedMotion ? 'hover:scale-[1.01]' : ''}`}
                                >
                                  <td className="py-4 px-6 font-medium text-gray-600 capitalize">
                                    {key
                                      .replace(/([A-Z])/g, ' $1')
                                      .replace(/^./, (str) => str.toUpperCase())
                                      .trim()}
                                  </td>
                                  <td className="py-4 px-6 font-semibold text-gray-900">
                                    {value && value.toString().trim() ? (
                                      <span>{value.toString()}</span>
                                    ) : (
                                      <span className="text-gray-500 italic">N/A</span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Mobile Card Layout */}
                        <div className="sm:hidden space-y-3">
                          {Object.entries(product.specifications).map(([key, value]) => (
                            <div
                              key={key}
                              className={`bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-200 shadow-lg ${!prefersReducedMotion ? 'hover:scale-[1.02] transition-all duration-300' : ''}`}
                            >
                              <div className="font-medium text-gray-600 text-sm mb-1 capitalize">
                                {key
                                  .replace(/([A-Z])/g, ' $1')
                                  .replace(/^./, (str) => str.toUpperCase())
                                  .trim()}
                              </div>
                              <div className="font-semibold text-gray-900">
                                {value && value.toString().trim() ? (
                                  <span>{value.toString()}</span>
                                ) : (
                                  <span className="text-gray-500 italic">N/A</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Package className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 italic text-lg">No specifications available</p>
                        <p className="text-gray-400 text-sm mt-2">
                          Technical specifications will be displayed here when available
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Enhanced Shipping Tab */}
              <TabsContent value="shipping" className="space-y-6">
                <Card className="bg-white/80 backdrop-blur-md shadow-2xl border border-white/20">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
                      Shipping & Returns Information
                    </h3>
                    <div className="space-y-6">
                      {/* Enhanced Shipping Information */}
                      <div>
                        <h4 className="font-bold mb-4 text-gray-900 dark:text-white">
                          Shipping Options
                        </h4>
                        <div className="space-y-4">
                          {[
                            {
                              icon: Truck,
                              title: product.shipping?.freeShipping
                                ? 'Free Shipping'
                                : 'Standard Shipping',
                              desc: product.shipping?.freeShipping
                                ? 'Free shipping on this item. Delivered in 3-5 business days.'
                                : `Free shipping on orders over LKR ${SITE_CONFIG.shipping.freeShippingThreshold}. Standard rate applies for smaller orders.`,
                              gradient: 'from-blue-50 to-indigo-50',
                              border: 'border-blue-200',
                            },
                            ...(product.shipping?.islandWideDelivery
                              ? [
                                  {
                                    icon: Globe,
                                    title: 'Island-wide Delivery',
                                    desc: 'We deliver across all provinces in Sri Lanka with secure packaging.',
                                    gradient: 'from-green-50 to-emerald-50',
                                    border: 'border-green-200',
                                  },
                                ]
                              : []),
                            ...(product.shipping?.shippingWeight
                              ? [
                                  {
                                    icon: Package,
                                    title: 'Package Details',
                                    desc: `Approximate weight: ${product.shipping.shippingWeight}kg`,
                                    gradient: 'from-gray-50 to-slate-50',
                                    border: 'border-gray-200',
                                  },
                                ]
                              : []),
                          ].map((item, index) => (
                            <div
                              key={item.title}
                              className={`flex items-start gap-3 p-4 bg-gradient-to-r ${item.gradient} rounded-xl border ${item.border} shadow-lg ${!prefersReducedMotion ? 'hover:scale-[1.02] transition-all duration-300' : ''}`}
                            >
                              <item.icon className="w-5 h-5 text-[#003DA5] mt-1 flex-shrink-0" />
                              <div>
                                <h5 className="font-semibold">{item.title}</h5>
                                <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
                                <p className="text-xs text-gray-500 mt-2">
                                  Delivery: 3-5 business days
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      {/* Enhanced Returns Information */}
                      <div>
                        <h4 className="font-bold mb-4 text-gray-900 dark:text-white">
                          Returns & Exchanges
                        </h4>
                        <div className="space-y-4">
                          {[
                            {
                              icon: RefreshCw,
                              title: product.shipping?.easyReturn
                                ? '30-Day Easy Returns'
                                : '30-Day Returns',
                              desc: 'Return unused items in original packaging within 30 days for a full refund.',
                              gradient: 'from-green-50 to-emerald-50',
                              border: 'border-green-200',
                            },
                            {
                              icon: Shield,
                              title: 'Quality Guarantee',
                              desc: 'All products come with manufacturer warranty and our quality guarantee.',
                              gradient: 'from-blue-50 to-indigo-50',
                              border: 'border-blue-200',
                            },
                          ].map((item) => (
                            <div
                              key={item.title}
                              className={`flex items-start gap-3 p-4 bg-gradient-to-r ${item.gradient} rounded-xl border ${item.border} shadow-lg ${!prefersReducedMotion ? 'hover:scale-[1.02] transition-all duration-300' : ''}`}
                            >
                              <item.icon className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                              <div>
                                <h5 className="font-semibold">{item.title}</h5>
                                <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
                                {item.title.includes('Returns') && (
                                  <ul className="text-xs text-gray-500 mt-2 space-y-1">
                                    <li>• Items must be in original condition</li>
                                    <li>• Include all original packaging and tags</li>
                                    <li>• Return shipping costs may apply</li>
                                  </ul>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      {/* Enhanced Contact Information */}
                      <div className="bg-gradient-to-r from-[#003DA5]/5 to-[#FF3D00]/5 rounded-xl p-4 border border-[#003DA5]/20 shadow-lg">
                        <h4 className="font-bold mb-2 text-[#003DA5] dark:text-[#4A90E2]">
                          Need Help?
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          Contact our customer service team for shipping and returns assistance.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button
                            size="sm"
                            className={`bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#128C7E] hover:to-[#25D366] text-white shadow-lg ${!prefersReducedMotion ? 'hover:scale-105 transition-all duration-300' : ''}`}
                            onClick={() => {
                              const message = `Hello! I need help with shipping/returns for product: ${product.name} (SKU: ${product.sku})`
                              const whatsappUrl = `https://wa.me/94772350712?text=${encodeURIComponent(message)}`
                              window.open(whatsappUrl, '_blank')
                            }}
                          >
                            WhatsApp Support
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            asChild
                            className={`border-2 border-[#003DA5] text-[#003DA5] hover:bg-[#003DA5] hover:text-white ${!prefersReducedMotion ? 'hover:scale-105 transition-all duration-300' : ''}`}
                          >
                            <Link href="/contact">Contact Us</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Enhanced Related Products */}
          {relatedProducts.length > 0 && (
            <section
              className={`mt-12 sm:mt-16 ${!prefersReducedMotion ? 'animate-fade-in-up delay-600' : ''}`}
            >
              <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mb-4">
                  More from{' '}
                  <span className="bg-gradient-to-r from-[#003DA5] to-[#0052CC] bg-clip-text text-transparent">
                    {product.brand?.name}
                  </span>
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Discover other premium products from this brand
                </p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {relatedProducts.map((relatedProduct, index) => (
                  <div
                    key={relatedProduct.id}
                    className={!prefersReducedMotion ? `animate-fade-in-up` : ''}
                    style={!prefersReducedMotion ? { animationDelay: `${index * 100}ms` } : {}}
                  >
                    <ProductCard
                      product={relatedProduct}
                      showBrand={false}
                      showCategory={true}
                      className="mobile-optimized bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/20"
                    />
                  </div>
                ))}
              </div>

              <div className="text-center mt-6 sm:mt-8">
                <Button
                  variant="outline"
                  size="lg"
                  className={`border-2 border-[#003DA5] text-[#003DA5] hover:bg-gradient-to-r hover:from-[#003DA5] hover:to-[#0052CC] hover:text-white font-bold px-8 py-4 rounded-xl shadow-lg ${!prefersReducedMotion ? 'hover:scale-105 transition-all duration-300' : ''}`}
                  asChild
                >
                  <Link href={`/products?brand=${product.brand?.slug}`}>
                    View All {product.brand?.name} Products
                  </Link>
                </Button>
              </div>
            </section>
          )}
        </div>
      </section>
    </main>
  )
}

function ProductDetailSkeleton() {
  return (
    <main className="min-h-screen pt-16 bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
          <div className="space-y-4">
            <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl animate-pulse shadow-xl" />
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl animate-pulse shadow-lg"
                />
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl animate-pulse w-1/3" />
            <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl animate-pulse w-2/3" />
            <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl animate-pulse w-1/4" />
            <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl animate-pulse w-1/3" />
            <div className="h-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl animate-pulse" />
            <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    </main>
  )
}
