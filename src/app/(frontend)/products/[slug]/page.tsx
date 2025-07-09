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
import { ProductListItem } from '@/types/api'

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
import Image from 'next/image'

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
  // const [exchangeRate, setExchangeRate] = useState(315) // Removed unused state
  const [variants, setVariants] = useState<ProductVariant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [resolvedParams, setResolvedParams] = useState<{ slug: string } | null>(null)

  const { addItem } = useCart()

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

        const response = await fetch(`/api/products/${resolvedParams.slug}`)
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
    if (!product || !Array.isArray(product.variants)) return

    setVariants(product.variants)
    setSelectedVariant(product.variants[0] || null)
  }, [product])

  // Fetch related products
  useEffect(() => {
    if (!product?.brand || !resolvedParams?.slug) return

    const fetchRelatedProducts = async () => {
      try {
        const response = await fetch(
          `/api/products?brand=${product.brand!.slug}&limit=4&status=active`,
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
      <main className="min-h-screen pt-16">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="mt-4">
            <Button asChild>
              <Link href="/products">← Back to Products</Link>
            </Button>
          </div>
        </div>
      </main>
    )
  }

  if (!product) {
    return (
      <main className="min-h-screen pt-16">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Product not found</AlertDescription>
          </Alert>
          <div className="mt-4">
            <Button asChild>
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
    // Map product.brand (ProductBrand | null) to Brand type
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
      variants: [], // Not used in cart
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
        // User cancelled sharing
        console.warn('Share cancelled', error)
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href)
      toast.success('Product link copied to clipboard!')
    }
  }

  const isOutOfStock = selectedVariant.inventory === 0
  const maxQuantity = Math.min(10, selectedVariant.inventory)

  return (
    <main className="min-h-screen pt-16 bg-white dark:bg-gray-900">
      <section className="py-4 sm:py-6 lg:py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Back Button - Mobile */}
          <div className="mb-4 sm:hidden">
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="p-2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
            {/* Product Images - Mobile Optimized */}
            <div className="space-y-3 sm:space-y-4">
              {/* Main Image - Smaller on Mobile */}
              <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg sm:rounded-xl overflow-hidden group">
                <Image
                  width={600}
                  height={400}
                  src={
                    product.images &&
                    product.images.length > 0 &&
                    product.images[selectedImage]?.url
                      ? product.images[selectedImage].url
                      : 'https://placehold.co/600x400'
                  }
                  alt={
                    product.images &&
                    product.images.length > 0 &&
                    product.images[selectedImage]?.alt
                      ? product.images[selectedImage].alt
                      : product.name
                  }
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = 'https://placehold.co/600x400'
                  }}
                />

                {/* Product Badges */}
                <div className="absolute top-3 sm:top-4 left-3 sm:left-4 flex flex-col gap-2">
                  {product.originalPrice && product.originalPrice > product.price && (
                    <Badge className="bg-[#FF3D00] text-white font-bold text-xs sm:text-sm">
                      SALE
                    </Badge>
                  )}
                  {isOutOfStock && (
                    <Badge variant="destructive" className="font-bold text-xs sm:text-sm">
                      OUT OF STOCK
                    </Badge>
                  )}
                </div>

                {/* Share Button */}
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={handleShare}
                    className="w-8 h-8 sm:w-10 sm:h-10 p-0 rounded-full bg-white/90 hover:bg-white"
                  >
                    <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                  </Button>
                </div>
              </div>

              {/* Thumbnail Images - Mobile Optimized */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={image.id || index}
                      onClick={() => setSelectedImage(index)}
                      title={`Select image ${index + 1}`}
                      className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-md sm:rounded-lg overflow-hidden border-2 transition-all ${
                        index === selectedImage
                          ? 'border-[#003DA5] ring-2 ring-[#003DA5]/20'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Image
                        width={100}
                        height={100}
                        src={image.url || 'https://placehold.co/600x400'}
                        alt={image.alt || `${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = 'https://placehold.co/600x400'
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details - Mobile Optimized */}
            <div className="space-y-4">
              {/* Brand */}
              {product.brand && (
                <div className="flex">
                  <Link
                    href={`/products?brand=${product.brand.slug}`}
                    className="text-[#003DA5] dark:text-[#4A90E2] font-bold text-base sm:text-xl hover:underline"
                  >
                    {product.brand.name}
                  </Link>
                </div>
              )}

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 dark:text-white leading-tight">
                {product.name}
              </h1>

              {/* Price - Mobile Optimized */}
              <div className="">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Price includes tax. Free shipping on orders over LKR 23,625.
                </p>
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2">
                {selectedVariant.inventory === 0 ? (
                  <Badge variant="destructive" className="font-bold">
                    Out of Stock
                  </Badge>
                ) : selectedVariant.inventory <= 5 ? (
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800 font-bold">
                    <Zap className="w-3 h-3 mr-1" />
                    Only {selectedVariant.inventory} left!
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-green-100 text-green-800 font-bold">
                    <Check className="w-3 h-3 mr-1" />
                    In Stock ({selectedVariant.inventory} available)
                  </Badge>
                )}
              </div>

              {/* Variant Selection - Design Consistent */}
              <div className="space-y-4 sm:space-y-6">
                {variants.length > 1 && (
                  <div className="space-y-3">
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">
                      Select Variant:
                    </h3>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      {variants.map((variant) => {
                        const isSelected = selectedVariant?.id === variant.id
                        const isAvailable = variant.inventory > 0
                        // Avoid duplicate info: if name === color or name === size, only show once
                        const mainLabel = variant.name || 'Standard'
                        let subLabel = ''
                        if (variant.size && variant.color) {
                          // If name is not size or color, show both
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
                          } // else, both same as name, show nothing
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
                            className={`min-w-[2.5rem] sm:min-w-[3rem] h-10 sm:h-12 px-3 sm:px-4 rounded-lg border-2 font-medium transition-all text-sm sm:text-base flex flex-col items-center justify-center text-center ${
                              isSelected
                                ? 'border-[#003DA5] bg-[#003DA5] text-white shadow-md'
                                : isAvailable
                                  ? 'border-gray-300 bg-white text-gray-900 hover:border-[#003DA5]'
                                  : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed line-through'
                            }`}
                            aria-label={`Select variant ${mainLabel}${subLabel ? ' ' + subLabel : ''}`}
                          >
                            <span className="font-bold">{mainLabel}</span>
                            {subLabel && (
                              <span className="text-xs text-white dark:text-gray-300 font-normal">
                                {subLabel}
                              </span>
                            )}
                            {/* No price info here */}
                            {!isAvailable && (
                              <span className="text-xs text-red-500 mt-1">Out of stock</span>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
                {/* Selected Variant Info */}
                {selectedVariant && variants.length > 1 && (
                  <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                          Selected:
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                          {selectedVariant.name ||
                            (selectedVariant.size && selectedVariant.color
                              ? `${selectedVariant.size} - ${selectedVariant.color}`
                              : selectedVariant.size || selectedVariant.color || 'Standard')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-[#003DA5] dark:text-[#4A90E2] text-sm sm:text-base">
                          Rs. {selectedVariant.price}
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

              {/* Quantity Selector - Mobile Optimized */}
              <div className="space-y-2">
                <label
                  htmlFor="quantity"
                  className="font-bold text-gray-900 dark:text-white text-sm sm:text-base"
                >
                  Quantity:
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="h-8 sm:h-10 w-8 sm:w-10 p-0"
                    >
                      <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                    <span className="w-12 sm:w-16 text-center font-medium text-sm sm:text-base">
                      {quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                      disabled={quantity >= maxQuantity || isOutOfStock}
                      className="h-8 sm:h-10 w-8 sm:w-10 p-0"
                    >
                      <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                  </div>
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    {selectedVariant?.inventory} available
                  </span>
                </div>
              </div>

              {/* Add to Cart - Mobile Optimized */}
              <div className="space-y-3">
                <Button
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="w-full bg-[#FF3D00] hover:bg-[#FF3D00]/90 text-white font-bold py-3 sm:py-4 text-base sm:text-lg rounded-xl transition-all hover:scale-[1.02]"
                >
                  <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="w-full font-bold border-2 border-[#003DA5] text-[#003DA5] hover:bg-[#003DA5] hover:text-white py-3 sm:py-4 text-base sm:text-lg"
                  onClick={() => {
                    handleAddToCart()
                    router.push('/checkout')
                  }}
                  disabled={isOutOfStock}
                >
                  {isOutOfStock ? 'Out of Stock' : 'Buy Now'}
                </Button>
              </div>

              {/* Trust Badges - Mobile Optimized */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 border-t">
                <div className="text-center">
                  <Truck className="w-4 h-4 sm:w-6 sm:h-6 mx-auto text-[#003DA5] mb-1 sm:mb-2" />
                  <div className="text-xs font-medium">Free Shipping</div>
                  <div className="text-xs text-gray-600 hidden sm:block">On orders above 50k</div>
                </div>
                <div className="text-center">
                  <Shield className="w-4 h-4 sm:w-6 sm:h-6 mx-auto text-[#003DA5] mb-1 sm:mb-2" />
                  <div className="text-xs font-medium">Secure Payment</div>
                  <div className="text-xs text-gray-600 hidden sm:block">SSL Protected</div>
                </div>
                <div className="text-center">
                  <RefreshCw className="w-4 h-4 sm:w-6 sm:h-6 mx-auto text-[#003DA5] mb-1 sm:mb-2" />
                  <div className="text-xs font-medium">Easy Returns</div>
                  <div className="text-xs text-gray-600 hidden sm:block">30-day policy</div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs - FIXED MOBILE TABLES */}
          <div className="mt-12 sm:mt-16">
            <Tabs defaultValue="description" className="w-full">
              {/* Improved Tabs Navigation */}
              <TabsList className="grid w-full grid-cols-3 mb-6 sm:mb-8 h-auto bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                <TabsTrigger
                  value="description"
                  className="font-bold text-xs sm:text-sm py-2 sm:py-3 rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-[#003DA5] dark:data-[state=active]:text-[#4A90E2] data-[state=active]:shadow-sm transition-all"
                >
                  Description
                </TabsTrigger>
                <TabsTrigger
                  value="specifications"
                  className="font-bold text-xs sm:text-sm py-2 sm:py-3 rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-[#003DA5] dark:data-[state=active]:text-[#4A90E2] data-[state=active]:shadow-sm transition-all"
                >
                  Specifications
                </TabsTrigger>
                <TabsTrigger
                  value="shipping"
                  className="font-bold text-xs sm:text-sm py-2 sm:py-3 rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-[#003DA5] dark:data-[state=active]:text-[#4A90E2] data-[state=active]:shadow-sm transition-all"
                >
                  Shipping
                </TabsTrigger>
              </TabsList>

              {/* Description Tab */}
              <TabsContent value="description" className="space-y-6">
                <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <CardContent className="p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold mb-4 text-gray-900 dark:text-white">
                      Product Description
                    </h3>
                    <div className="prose max-w-none text-gray-700 dark:text-gray-300">
                      {/* Description Section - Using RichTextRenderer */}
                      <div className="mb-6">
                        {product.description ? (
                          <div className="leading-relaxed text-sm sm:text-base">
                            <RichTextRenderer content={product.description} />
                          </div>
                        ) : (
                          <p className="text-gray-500 italic text-sm sm:text-base">
                            No description available
                          </p>
                        )}
                      </div>

                      {/* Features Section */}
                      <div className="mb-6">
                        <h4 className="font-bold mb-3 text-gray-900 dark:text-white text-sm sm:text-base">
                          Key Features:
                        </h4>
                        {product.features && product.features.length > 0 ? (
                          <ul className="space-y-2">
                            {product.features.map((feature, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span className="text-sm sm:text-base">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-500 italic text-sm sm:text-base">
                            No features listed
                          </p>
                        )}
                      </div>

                      {/* Tags Section */}
                      <div>
                        <h4 className="font-bold mb-3 text-gray-900 dark:text-white text-sm sm:text-base">
                          Tags:
                        </h4>
                        {product.tags && product.tags.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {product.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 italic text-sm sm:text-base">
                            No tags available
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Specifications Tab - FIXED MOBILE TABLE */}
              <TabsContent value="specifications" className="space-y-6">
                <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <CardContent className="p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold mb-6 text-gray-900 dark:text-white">
                      Technical Specifications
                    </h3>

                    {product.specifications && Object.keys(product.specifications).length > 0 ? (
                      <div className="space-y-4">
                        {/* Mobile-First Responsive Table */}
                        <div className="hidden sm:block overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="border-b-2 border-gray-200 dark:border-gray-600">
                                <th className="text-left py-3 pr-6 font-bold text-gray-900 dark:text-white w-1/3">
                                  Property
                                </th>
                                <th className="text-left py-3 font-bold text-gray-900 dark:text-white">
                                  Value
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                              {Object.entries(product.specifications).map(([key, value]) => (
                                <tr
                                  key={key}
                                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                  <td className="py-4 pr-6 font-medium text-gray-600 dark:text-gray-400 capitalize align-top">
                                    {key
                                      .replace(/([A-Z])/g, ' $1')
                                      .replace(/^./, (str) => str.toUpperCase())
                                      .trim()}
                                  </td>
                                  <td className="py-4 font-semibold text-gray-900 dark:text-white align-top">
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
                              className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600"
                            >
                              <div className="font-medium text-gray-600 dark:text-gray-400 text-sm mb-1 capitalize">
                                {key
                                  .replace(/([A-Z])/g, ' $1')
                                  .replace(/^./, (str) => str.toUpperCase())
                                  .trim()}
                              </div>
                              <div className="font-semibold text-gray-900 dark:text-white text-sm">
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
                      <div className="text-center py-8 sm:py-12">
                        <Package className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 italic text-base sm:text-lg">
                          No specifications available
                        </p>
                        <p className="text-gray-400 text-xs sm:text-sm mt-2">
                          Technical specifications will be displayed here when available
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Shipping Tab */}
              <TabsContent value="shipping" className="space-y-6">
                <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <CardContent className="p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold mb-6 text-gray-900 dark:text-white">
                      Shipping & Returns Information
                    </h3>
                    <div className="space-y-6">
                      {/* Shipping Information */}
                      <div>
                        <h4 className="font-bold mb-4 text-gray-900 dark:text-white text-sm sm:text-base">
                          Shipping Options
                        </h4>
                        <div className="space-y-4">
                          <div className="flex items-start gap-3 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-[#003DA5] dark:text-[#4A90E2] mt-1 flex-shrink-0" />
                            <div>
                              <h5 className="font-semibold text-sm sm:text-base">
                                {product.shipping?.freeShipping
                                  ? 'Free Shipping'
                                  : 'Standard Shipping'}
                              </h5>
                              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {product.shipping?.freeShipping
                                  ? 'Free shipping on this item. Delivered in 3-5 business days.'
                                  : 'Free shipping on orders over LKR 23,625. Standard rate applies for smaller orders.'}
                              </p>
                              <p className="text-xs text-gray-500 mt-2">
                                Delivery: 3-5 business days
                              </p>
                            </div>
                          </div>

                          {product.shipping?.islandWideDelivery && (
                            <div className="flex items-start gap-3 p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                              <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-[#003DA5] dark:text-[#4A90E2] mt-1 flex-shrink-0" />
                              <div>
                                <h5 className="font-semibold text-sm sm:text-base">
                                  Island-wide Delivery
                                </h5>
                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                                  We deliver across all provinces in Sri Lanka with secure
                                  packaging.
                                </p>
                              </div>
                            </div>
                          )}

                          {product.shipping?.shippingWeight && (
                            <div className="flex items-start gap-3 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                              <Package className="w-4 h-4 sm:w-5 sm:h-5 text-[#003DA5] dark:text-[#4A90E2] mt-1 flex-shrink-0" />
                              <div>
                                <h5 className="font-semibold text-sm sm:text-base">
                                  Package Details
                                </h5>
                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                                  Approximate weight: {product.shipping.shippingWeight}kg
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <Separator />

                      {/* Returns Information */}
                      <div>
                        <h4 className="font-bold mb-4 text-gray-900 dark:text-white text-sm sm:text-base">
                          Returns & Exchanges
                        </h4>
                        <div className="space-y-4">
                          <div className="flex items-start gap-3 p-3 sm:p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mt-1 flex-shrink-0" />
                            <div>
                              <h5 className="font-semibold text-sm sm:text-base">
                                {product.shipping?.easyReturn
                                  ? '30-Day Easy Returns'
                                  : '30-Day Returns'}
                              </h5>
                              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                                Return unused items in original packaging within 30 days for a full
                                refund.
                              </p>
                              <ul className="text-xs text-gray-500 mt-2 space-y-1">
                                <li>• Items must be in original condition</li>
                                <li>• Include all original packaging and tags</li>
                                <li>• Return shipping costs may apply</li>
                              </ul>
                            </div>
                          </div>

                          <div className="flex items-start gap-3 p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mt-1 flex-shrink-0" />
                            <div>
                              <h5 className="font-semibold text-sm sm:text-base">
                                Quality Guarantee
                              </h5>
                              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                                All products come with manufacturer warranty and our quality
                                guarantee.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Contact Information */}
                      <div className="bg-[#003DA5]/5 dark:bg-[#003DA5]/10 rounded-lg p-3 sm:p-4">
                        <h4 className="font-bold mb-2 text-[#003DA5] dark:text-[#4A90E2] text-sm sm:text-base">
                          Need Help?
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3">
                          Contact our customer service team for shipping and returns assistance.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button
                            size="sm"
                            className="bg-[#25D366] hover:bg-[#25D366]/90 text-white text-xs sm:text-sm"
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
                            className="text-xs sm:text-sm"
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

          {/* Related Products - Mobile Optimized */}
          {relatedProducts.length > 0 && (
            <section className="mt-12 sm:mt-16">
              <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mb-4">
                  More from {product.brand?.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                  Discover other premium products from this brand
                </p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard
                    key={relatedProduct.id}
                    product={relatedProduct}
                    showBrand={false}
                    showCategory={true}
                    className="mobile-optimized"
                  />
                ))}
              </div>

              <div className="text-center mt-6 sm:mt-8">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-[#003DA5] text-[#003DA5] hover:bg-[#003DA5] hover:text-white font-bold text-sm sm:text-base"
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
    <main className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
          <div className="space-y-4">
            <div className="aspect-square bg-gray-200 rounded-xl animate-pulse" />
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-lg animate-pulse"
                />
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="h-6 sm:h-8 bg-gray-200 rounded animate-pulse w-1/3" />
            <div className="h-8 sm:h-12 bg-gray-200 rounded animate-pulse w-2/3" />
            <div className="h-4 sm:h-6 bg-gray-200 rounded animate-pulse w-1/4" />
            <div className="h-6 sm:h-8 bg-gray-200 rounded animate-pulse w-1/3" />
            <div className="h-12 sm:h-16 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 sm:h-12 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </main>
  )
}
