'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Search,
  Shield,
  CheckCircle,
  AlertTriangle,
  X,
  Package,
  Eye,
  Award,
  Zap,
  AlertCircle,
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import { ProductListItem } from '@/types/api'
import Image from 'next/image'

export default function ProductVerificationPage() {
  const [sku, setSku] = useState('')
  const [product, setProduct] = useState<ProductListItem | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searched, setSearched] = useState(false)

  // Detect reduced motion preference
  const prefersReducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false

  const handleVerifyProduct = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!sku.trim()) {
      toast.error('Please enter a SKU code')
      return
    }

    setLoading(true)
    setError(null)
    setSearched(true)

    try {
      const response = await fetch('/api/public/products/verify-sku', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sku: sku.trim() }),
      })

      const data = await response.json()

      if (data.exists && data.product) {
        const convertedProduct: ProductListItem = {
          id: data.product.id,
          name: data.product.name,
          slug: data.product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          price: data.product.price,
          sku: data.product.sku,
          stock: data.product.stock,
          status: 'active',
          sizes: [],
          colors: [],
          images: data.product.images || [],
          category:
            data.product.category && typeof data.product.category === 'object'
              ? {
                  id: data.product.category.id || 0,
                  name: data.product.category.name || '',
                  slug: (data.product.category.name || '')
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-'),
                }
              : null,
          brand:
            data.product.brand && typeof data.product.brand === 'object'
              ? {
                  id: data.product.brand.id || 0,
                  name: data.product.brand.name || '',
                  slug: (data.product.brand.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                }
              : null,
          features: [],
          tags: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          variants: Array.isArray(data.product.variants) ? data.product.variants : [],
        }
        setProduct(convertedProduct)
        setError(null)
        toast.success('Product verified successfully!')
      } else {
        setProduct(null)
        setError(data.message || 'Product with this SKU not found in our authentic inventory.')
        toast.error('Product not verified')
      }
    } catch (error) {
      console.error('SKU verification error:', error)
      setError('Failed to verify product. Please try again.')
      setProduct(null)
      toast.error('Verification failed')
    } finally {
      setLoading(false)
    }
  }

  const getVerificationStatus = () => {
    if (!searched || loading) return null

    if (product && !error) {
      return {
        type: 'authentic',
        icon: CheckCircle,
        title: 'AUTHENTIC PRODUCT',
        description: 'This product is verified as authentic and available in our inventory.',
        color: 'text-green-600',
        bgColor: 'bg-gradient-to-br from-green-50 to-emerald-50',
        borderColor: 'border-green-200',
        glowColor: 'shadow-green-200/50',
      }
    } else if (product && error) {
      return {
        type: 'warning',
        icon: AlertTriangle,
        title: 'VERIFICATION WARNING',
        description: error,
        color: 'text-orange-600',
        bgColor: 'bg-gradient-to-br from-orange-50 to-amber-50',
        borderColor: 'border-orange-200',
        glowColor: 'shadow-orange-200/50',
      }
    } else if (!product && error) {
      return {
        type: 'not-found',
        icon: X,
        title: 'NOT VERIFIED',
        description:
          'This SKU was not found in our authentic product inventory. This may be a counterfeit product.',
        color: 'text-red-600',
        bgColor: 'bg-gradient-to-br from-red-50 to-rose-50',
        borderColor: 'border-red-200',
        glowColor: 'shadow-red-200/50',
      }
    }

    return null
  }

  const verificationStatus = getVerificationStatus()

  return (
    <main className="min-h-screen pt-16 bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Enhanced Hero Section */}
      <section className="py-16 lg:py-20 bg-gradient-to-br from-[#003DA5] via-[#0052CC] to-[#1A1A1A] text-white relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div
            className={`absolute top-20 left-20 w-32 h-32 bg-[#FFD700] rounded-full blur-3xl ${!prefersReducedMotion ? 'animate-pulse' : ''}`}
          ></div>
          <div
            className={`absolute bottom-20 right-20 w-40 h-40 bg-[#AEEA00] rounded-full blur-3xl ${!prefersReducedMotion ? 'animate-pulse delay-1000' : ''}`}
          ></div>
          <div
            className={`absolute top-1/2 left-1/3 w-24 h-24 bg-[#FF3D00] rounded-full blur-2xl ${!prefersReducedMotion ? 'animate-bounce' : ''}`}
          ></div>
        </div>

        {/* Glassmorphism Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20 backdrop-blur-sm"></div>

        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <div
            className={`w-20 h-20 bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl ${!prefersReducedMotion ? 'animate-bounce' : ''}`}
          >
            <Shield className="w-10 h-10 text-[#1A1A1A]" />
          </div>
          <h1
            className={`text-4xl md:text-5xl lg:text-6xl font-black mb-4 bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent ${!prefersReducedMotion ? 'animate-fade-in-up' : ''}`}
          >
            PRODUCT
            <span className="block bg-gradient-to-r from-[#FF3D00] to-[#FF6B47] bg-clip-text text-transparent">
              VERIFICATION
            </span>
          </h1>
          <p
            className={`text-xl text-gray-200 max-w-3xl mx-auto mb-8 leading-relaxed ${!prefersReducedMotion ? 'animate-fade-in-up delay-200' : ''}`}
          >
            Verify the authenticity of your sports equipment using our secure verification system.
            Protect yourself from counterfeit products.
          </p>

          {/* Enhanced Trust Indicators */}
          <div
            className={`grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto ${!prefersReducedMotion ? 'animate-fade-in-up delay-400' : ''}`}
          >
            {[
              {
                icon: Shield,
                label: 'Authentic Products',
                desc: '100% Genuine',
                gradient: 'from-[#FFD700] to-[#FFA500]',
              },
              {
                icon: Award,
                label: 'Official Distributor',
                desc: 'Authorized Seller',
                gradient: 'from-[#AEEA00] to-[#7CB342]',
              },
              {
                icon: CheckCircle,
                label: 'Instant Verification',
                desc: 'Real-time Check',
                gradient: 'from-[#FF3D00] to-[#E53935]',
              },
            ].map((item, index) => (
              <div
                key={item.label}
                className={`text-center p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl ${index === 2 ? 'md:block hidden' : ''} ${!prefersReducedMotion ? 'hover:scale-105 transition-all duration-300' : ''}`}
              >
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${item.gradient} rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg`}
                >
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-sm font-bold text-white">{item.label}</div>
                <div className="text-xs text-gray-300">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4">
          {/* Enhanced Verification Form */}
          <Card
            className={`mb-8 bg-white/80 backdrop-blur-md shadow-2xl border border-white/20 ${!prefersReducedMotion ? 'animate-fade-in-up hover:shadow-3xl transition-all duration-300' : ''}`}
          >
            <CardHeader className="bg-gradient-to-r from-[#003DA5]/5 to-[#FF3D00]/5">
              <CardTitle className="flex items-center gap-2 text-xl">
                <div className="w-8 h-8 bg-gradient-to-br from-[#003DA5] to-[#0052CC] rounded-lg flex items-center justify-center">
                  <Search className="w-4 h-4 text-white" />
                </div>
                Verify Product Authenticity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleVerifyProduct} className="space-y-6">
                <div>
                  <Label htmlFor="sku" className="text-base font-semibold text-gray-700">
                    Product SKU Code
                  </Label>
                  <div className="flex gap-3 mt-3">
                    <Input
                      id="sku"
                      type="text"
                      value={sku}
                      onChange={(e) => setSku(e.target.value.toUpperCase())}
                      placeholder="Enter SKU code (e.g., RS-123456-ABC)"
                      className="flex-1 font-mono text-lg p-4 border-2 border-gray-200 focus:border-[#003DA5] rounded-xl bg-white/80 backdrop-blur-sm"
                      disabled={loading}
                    />
                    <Button
                      type="submit"
                      disabled={loading}
                      className={`bg-gradient-to-r from-[#003DA5] to-[#0052CC] hover:from-[#0052CC] hover:to-[#003DA5] text-white px-8 py-4 text-lg font-bold rounded-xl shadow-lg ${!prefersReducedMotion ? 'hover:scale-105 transition-all duration-300' : ''}`}
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Shield className="w-5 h-5 mr-2" />
                          Verify
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                  <p className="text-sm font-semibold text-blue-800 mb-2">
                    💡 <strong>Where to find your SKU code:</strong>
                  </p>
                  <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                    <li>Check the product packaging or labels</li>
                    <li>Look on the product receipt or invoice</li>
                    <li>Find it on the product itself (often printed or engraved)</li>
                    <li>Check your order confirmation from Ralhum Sports</li>
                  </ul>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Enhanced Verification Result */}
          {verificationStatus && (
            <Card
              className={`mb-8 ${verificationStatus.borderColor} border-2 ${verificationStatus.bgColor} backdrop-blur-md shadow-2xl ${verificationStatus.glowColor} ${!prefersReducedMotion ? 'animate-fade-in-up' : ''}`}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-full ${verificationStatus.bgColor} shadow-lg`}>
                    {React.createElement(verificationStatus.icon, {
                      className: `w-8 h-8 ${verificationStatus.color}`,
                    })}
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-2xl font-black mb-3 ${verificationStatus.color}`}>
                      {verificationStatus.title}
                    </h3>
                    <p className="text-gray-700 mb-4 text-lg leading-relaxed">
                      {verificationStatus.description}
                    </p>

                    {verificationStatus.type === 'not-found' && (
                      <Alert
                        className={`bg-white/80 border-red-200 backdrop-blur-sm ${!prefersReducedMotion ? 'animate-shake' : ''}`}
                      >
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-800">
                          <strong>Important:</strong> If you purchased this product from Ralhum
                          Sports and it&apos;s not showing as verified, please contact our support
                          team immediately as this may indicate a quality control issue.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Enhanced Product Details */}
          {product && (
            <Card
              className={`mb-8 bg-white/80 backdrop-blur-md shadow-2xl border border-white/20 ${!prefersReducedMotion ? 'animate-fade-in-up' : ''}`}
            >
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                    <Package className="w-4 h-4 text-white" />
                  </div>
                  Verified Product Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Enhanced Product Image */}
                  <div className="space-y-4">
                    <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden shadow-xl">
                      <Image
                        width={600}
                        height={400}
                        src={
                          product.images[0]?.image?.url ||
                          product.images[0]?.url ||
                          'https://placehold.co/600x400' ||
                          '/placeholder.svg'
                        }
                        alt={
                          product.images[0]?.image?.alt || product.images[0]?.alt || product.name
                        }
                        className={`w-full h-full object-cover ${!prefersReducedMotion ? 'hover:scale-105 transition-transform duration-500' : ''}`}
                      />
                    </div>
                    {product.images.length > 1 && (
                      <div className="flex gap-2 overflow-x-auto">
                        {product.images.slice(1, 4).map((image, index) => (
                          <div key={image.id} className="flex-shrink-0">
                            <Image
                              width={100}
                              height={100}
                              src={image.image?.url || image.url || 'https://placehold.co/100x100'}
                              alt={image.image?.alt || image.alt || product.name}
                              className={`w-20 h-20 object-cover rounded-lg shadow-md ${!prefersReducedMotion ? 'hover:scale-110 transition-transform duration-300' : ''}`}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Enhanced Product Info */}
                  <div className="space-y-6">
                    {product.brand && (
                      <div>
                        <Badge className="bg-gradient-to-r from-[#003DA5] to-[#0052CC] text-white px-4 py-2 text-sm font-bold shadow-lg">
                          {product.brand.name}
                        </Badge>
                      </div>
                    )}

                    <h2 className="text-3xl font-black text-gray-900 leading-tight">
                      {product.name}
                    </h2>

                    <div className="space-y-3">
                      <div className="flex items-baseline gap-3">
                        <span className="text-3xl font-black bg-gradient-to-r from-[#003DA5] to-[#0052CC] bg-clip-text text-transparent">
                          Rs. {product.price.toLocaleString('en-LK')}
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-xl text-gray-500 line-through">
                            Rs. {product.originalPrice.toLocaleString('en-LK')}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4">
                      {[
                        { label: 'SKU', value: product.sku, mono: true },
                        { label: 'Status', value: product.status, badge: true },
                        { label: 'Category', value: product.category?.name },
                      ].map((item) => (
                        <div key={item.label} className="flex justify-between items-center">
                          <span className="font-semibold text-gray-700">{item.label}:</span>
                          {item.badge ? (
                            <Badge
                              className={
                                product.status === 'active'
                                  ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200'
                                  : product.status === 'out-of-stock'
                                    ? 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border border-red-200'
                                    : 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border border-gray-200'
                              }
                            >
                              {product.status === 'active'
                                ? 'Available'
                                : product.status === 'out-of-stock'
                                  ? 'Out of Stock'
                                  : product.status.charAt(0).toUpperCase() +
                                    product.status.slice(1)}
                            </Badge>
                          ) : (
                            <span
                              className={`${item.mono ? 'font-mono bg-gray-100 px-2 py-1 rounded text-sm' : 'font-medium'} text-gray-900`}
                            >
                              {item.value}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Enhanced Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                      <Button
                        size="lg"
                        className={`bg-gradient-to-r from-[#003DA5] to-[#0052CC] hover:from-[#0052CC] hover:to-[#003DA5] text-white flex-1 py-4 text-lg font-bold rounded-xl shadow-lg ${!prefersReducedMotion ? 'hover:scale-105 transition-all duration-300' : ''}`}
                        asChild
                      >
                        <Link href={`/products/${product.slug}`}>
                          <Eye className="w-5 h-5 mr-2" />
                          View Product
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Enhanced Information Cards */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Why Verify Card */}
            <Card
              className={`bg-white/80 backdrop-blur-md shadow-2xl border border-white/20 ${!prefersReducedMotion ? 'hover:shadow-3xl transition-all duration-300' : ''}`}
            >
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#003DA5] to-[#0052CC] rounded-lg flex items-center justify-center">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  Why Verify Products?
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {[
                  {
                    title: 'Authenticity Guarantee',
                    desc: "Ensure you're buying genuine products from authorized distributors",
                  },
                  {
                    title: 'Quality Assurance',
                    desc: 'Verified products meet manufacturer quality standards',
                  },
                  {
                    title: 'Warranty Protection',
                    desc: 'Authentic products come with valid manufacturer warranties',
                  },
                  {
                    title: 'Counterfeit Protection',
                    desc: 'Avoid fake products that may be unsafe or poor quality',
                  },
                ].map((item, index) => (
                  <div
                    key={item.title}
                    className={`flex items-start gap-3 p-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 ${!prefersReducedMotion ? 'hover:scale-[1.02] transition-all duration-300' : ''}`}
                  >
                    <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-green-800">{item.title}</p>
                      <p className="text-sm text-green-700 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Contact Support Card */}
            <Card
              className={`bg-white/80 backdrop-blur-md shadow-2xl border border-white/20 ${!prefersReducedMotion ? 'hover:shadow-3xl transition-all duration-300' : ''}`}
            >
              <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#FF3D00] to-[#E53935] rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-white" />
                  </div>
                  Found a Problem?
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <p className="text-gray-700 leading-relaxed">
                  If you believe you have a counterfeit product or if verification failed for a
                  genuine Ralhum Sports product, please contact us immediately.
                </p>

                <div className="space-y-4">
                  <Button
                    size="lg"
                    className={`w-full bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#128C7E] hover:to-[#25D366] text-white py-4 text-lg font-bold rounded-xl shadow-lg ${!prefersReducedMotion ? 'hover:scale-105 transition-all duration-300' : ''}`}
                    onClick={() => {
                      const message = `Hello! I need to report a product verification issue. SKU: ${sku}`
                      const whatsappUrl = `https://wa.me/94772350712?text=${encodeURIComponent(message)}`
                      window.open(whatsappUrl, '_blank')
                    }}
                  >
                    Report via WhatsApp
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    className={`w-full border-2 border-[#003DA5] text-[#003DA5] hover:bg-[#003DA5] hover:text-white py-4 text-lg font-bold rounded-xl ${!prefersReducedMotion ? 'hover:scale-105 transition-all duration-300' : ''}`}
                    asChild
                  >
                    <Link href="/contact">Contact Support</Link>
                  </Button>
                </div>

                <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    <strong>What to include in your report:</strong>
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    <li>Product SKU code</li>
                    <li>Where you purchased the product</li>
                    <li>Photos of the product and packaging</li>
                    <li>Purchase receipt or proof</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Additional Information */}
          <Card
            className={`mt-8 bg-gradient-to-br from-white/90 to-blue-50/90 backdrop-blur-md shadow-2xl border border-white/20 ${!prefersReducedMotion ? 'animate-fade-in-up' : ''}`}
          >
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#003DA5] to-[#0052CC] rounded-full flex items-center justify-center mx-auto shadow-xl">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-black text-gray-900">
                  🛡️ Your Safety is Our Priority
                </h3>
                <p className="text-gray-700 max-w-2xl mx-auto text-lg leading-relaxed">
                  As Sri Lanka&apos;s #1 sports equipment distributor, we&apos;re committed to
                  ensuring every customer receives authentic, high-quality products. Our
                  verification system helps protect you from counterfeit sports equipment that may
                  be unsafe or perform poorly.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Button
                    variant="outline"
                    size="lg"
                    className={`border-2 border-[#003DA5] text-[#003DA5] hover:bg-[#003DA5] hover:text-white px-8 py-4 text-lg font-bold rounded-xl ${!prefersReducedMotion ? 'hover:scale-105 transition-all duration-300' : ''}`}
                    asChild
                  >
                    <Link href="/products">Browse Authentic Products</Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className={`border-2 border-[#FF3D00] text-[#FF3D00] hover:bg-[#FF3D00] hover:text-white px-8 py-4 text-lg font-bold rounded-xl ${!prefersReducedMotion ? 'hover:scale-105 transition-all duration-300' : ''}`}
                    asChild
                  >
                    <Link href="/orders/track">Track Your Order</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
