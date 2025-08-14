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
  Sparkles,
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import { ProductListItem } from '@/types/api'
import Image from 'next/image'
import { motion } from 'framer-motion'

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.1,
        duration: prefersReducedMotion ? 0 : 0.6,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: prefersReducedMotion ? 0 : 0.5 },
    },
  }

  return (
    <main className="min-h-screen pt-8 bg-brand-background">
      {/* Clean Hero Section - Like tracking page */}
      <section className="relative py-16 sm:py-20 overflow-hidden bg-brand-background">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-1/4 left-1/6 w-72 h-72 bg-gradient-to-br from-brand-secondary/10 to-brand-primary/10 rounded-full blur-3xl"
            animate={
              prefersReducedMotion
                ? {}
                : {
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3],
                    x: [0, 30, 0],
                    y: [0, -20, 0],
                  }
            }
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-br from-brand-accent/10 to-brand-primary/10 rounded-full blur-3xl"
            animate={
              prefersReducedMotion
                ? {}
                : {
                    scale: [1, 0.8, 1],
                    opacity: [0.4, 0.7, 0.4],
                    x: [0, -40, 0],
                    y: [0, 30, 0],
                  }
            }
            transition={{
              duration: 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
              delay: 2,
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div
            className="text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm mb-6 bg-brand-accent text-white shadow-lg"
            >
              <Sparkles className="w-4 h-4" />
              PRODUCT VERIFICATION
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 leading-tight"
            >
              <span className="text-text-primary">PRODUCT</span>
              <span className="block bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">
                VERIFICATION
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed mb-8"
            >
              Verify the authenticity of your sports equipment using our secure verification system.
              Protect yourself from counterfeit products.
            </motion.p>

            {/* Enhanced Trust Indicators */}
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
            >
              {[
                {
                  icon: Shield,
                  label: 'Authentic Products',
                  desc: '100% Genuine',
                  color: 'text-brand-accent',
                },
                {
                  icon: Award,
                  label: 'Official Distributor',
                  desc: 'Authorized Seller',
                  color: 'text-brand-primary',
                },
                {
                  icon: CheckCircle,
                  label: 'Instant Verification',
                  desc: 'Real-time Check',
                  color: 'text-brand-secondary',
                },
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  variants={itemVariants}
                  className="text-center p-4 rounded-2xl bg-brand-surface border border-brand-border shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div
                    className={`w-12 h-12 ${item.color} bg-brand-background rounded-full flex items-center justify-center mx-auto mb-3 shadow border-2 border-current`}
                  >
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div className="text-sm font-bold text-text-primary">{item.label}</div>
                  <div className="text-xs text-text-secondary">{item.desc}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4">
          {/* Enhanced Verification Form */}
          <Card className="mb-8 bg-brand-surface shadow-2xl border border-brand-border">
            <CardHeader className="bg-brand-background">
              <CardTitle className="flex items-center gap-2 text-xl">
                <div className="w-8 h-8 bg-brand-secondary rounded-lg flex items-center justify-center">
                  <Search className="w-4 h-4 text-white" />
                </div>
                Verify Product Authenticity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleVerifyProduct} className="space-y-6">
                <div>
                  <Label htmlFor="sku" className="text-base font-semibold text-text-primary">
                    Product SKU Code
                  </Label>
                  <div className="flex gap-3 mt-3">
                    <Input
                      id="sku"
                      type="text"
                      value={sku}
                      onChange={(e) => setSku(e.target.value.toUpperCase())}
                      placeholder="Enter SKU code (e.g., RS-123456-ABC)"
                      className="flex-1 font-mono text-lg p-4 border-2 border-brand-border focus:border-brand-secondary rounded-xl bg-brand-background"
                      disabled={loading}
                    />
                    <Button
                      type="submit"
                      disabled={loading}
                      className="bg-gradient-to-r from-brand-secondary to-secondary-600 hover:from-secondary-600 hover:to-brand-secondary text-white px-8 py-4 text-lg font-bold rounded-xl shadow-lg hover:scale-105 transition-all duration-300"
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
              className={`mb-8 ${verificationStatus.borderColor} border-2 ${verificationStatus.bgColor} shadow-2xl ${verificationStatus.glowColor}`}
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
                      <Alert className="bg-white/80 border-red-200">
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
            <Card className="mb-8 bg-brand-surface shadow-2xl border border-brand-border">
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
                    <div className="aspect-square bg-brand-background rounded-2xl overflow-hidden shadow-xl border border-brand-border">
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
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
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
                              className="w-20 h-20 object-cover rounded-lg shadow-md hover:scale-110 transition-transform duration-300"
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
                        <Badge className="bg-brand-secondary text-white px-4 py-2 text-sm font-bold shadow-lg">
                          {product.brand.name}
                        </Badge>
                      </div>
                    )}

                    <h2 className="text-3xl font-black text-text-primary leading-tight">
                      {product.name}
                    </h2>

                    <div className="space-y-3">
                      <div className="flex items-baseline gap-3">
                        <span className="text-3xl font-black bg-gradient-to-r from-brand-secondary to-secondary-600 bg-clip-text text-transparent">
                          Rs. {product.price.toLocaleString('en-LK')}
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-xl text-text-secondary line-through">
                            Rs. {product.originalPrice.toLocaleString('en-LK')}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4 bg-brand-background rounded-xl p-4 border border-brand-border">
                      {[
                        { label: 'SKU', value: product.sku, mono: true },
                        { label: 'Status', value: product.status, badge: true },
                        { label: 'Category', value: product.category?.name },
                      ].map((item) => (
                        <div key={item.label} className="flex justify-between items-center">
                          <span className="font-semibold text-text-primary">{item.label}:</span>
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
                              className={`${item.mono ? 'font-mono bg-brand-background px-2 py-1 rounded text-sm border' : 'font-medium'} text-text-primary`}
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
                        className="bg-gradient-to-r from-brand-secondary to-secondary-600 hover:from-secondary-600 hover:to-brand-secondary text-white flex-1 py-4 text-lg font-bold rounded-xl shadow-lg hover:scale-105 transition-all duration-300"
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
            <Card className="bg-brand-surface shadow-2xl border border-brand-border hover:shadow-3xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <div className="w-8 h-8 bg-brand-secondary rounded-lg flex items-center justify-center">
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
                    className="flex items-start gap-3 p-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 hover:scale-[1.02] transition-all duration-300"
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
            <Card className="bg-brand-surface shadow-2xl border border-brand-border hover:shadow-3xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <div className="w-8 h-8 bg-gradient-to-br from-brand-primary to-primary-600 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-white" />
                  </div>
                  Found a Problem?
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <p className="text-text-secondary leading-relaxed">
                  If you believe you have a counterfeit product or if verification failed for a
                  genuine Ralhum Sports product, please contact us immediately.
                </p>

                <div className="space-y-4">
                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-emerald-600 hover:to-green-600 text-white py-4 text-lg font-bold rounded-xl shadow-lg hover:scale-105 transition-all duration-300"
                    onClick={() => {
                      const message = `Hello! I need to report a product verification issue. SKU: ${sku}`
                      const whatsappUrl = `https://wa.me/94774477633?text=${encodeURIComponent(message)}`
                      window.open(whatsappUrl, '_blank')
                    }}
                  >
                    Report via WhatsApp
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full border-2 border-brand-secondary text-brand-secondary hover:bg-brand-secondary hover:text-white py-4 text-lg font-bold rounded-xl hover:scale-105 transition-all duration-300"
                    asChild
                  >
                    <Link href="/contact">Contact Support</Link>
                  </Button>
                </div>

                <div className="bg-brand-background rounded-xl p-4 border border-brand-border">
                  <p className="text-sm font-semibold text-text-primary mb-2">
                    <strong>What to include in your report:</strong>
                  </p>
                  <ul className="list-disc list-inside text-sm text-text-secondary space-y-1">
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
          <Card className="mt-8 bg-brand-surface shadow-2xl border border-brand-border">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-brand-secondary rounded-full flex items-center justify-center mx-auto shadow-xl">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-black text-text-primary">
                  🛡️ Your Safety is Our Priority
                </h3>
                <p className="text-text-secondary max-w-2xl mx-auto text-lg leading-relaxed">
                  As Sri Lanka&apos;s #1 sports equipment distributor, we&apos;re committed to
                  ensuring every customer receives authentic, high-quality products. Our
                  verification system helps protect you from counterfeit sports equipment that may
                  be unsafe or perform poorly.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-2 border-brand-secondary text-brand-secondary hover:bg-brand-secondary hover:text-white px-8 py-4 text-lg font-bold rounded-xl hover:scale-105 transition-all duration-300"
                    asChild
                  >
                    <Link href="/products">Browse Authentic Products</Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white px-8 py-4 text-lg font-bold rounded-xl hover:scale-105 transition-all duration-300"
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
