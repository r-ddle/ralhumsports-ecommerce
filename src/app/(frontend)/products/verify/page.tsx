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
  ShoppingCart,
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
      // Use robust API endpoint for Payload initialization and variant support
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
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
      }
    } else if (product && error) {
      return {
        type: 'warning',
        icon: AlertTriangle,
        title: 'VERIFICATION WARNING',
        description: error,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
      }
    } else if (!product && error) {
      return {
        type: 'not-found',
        icon: X,
        title: 'NOT VERIFIED',
        description:
          'This SKU was not found in our authentic product inventory. This may be a counterfeit product.',
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
      }
    }

    return null
  }

  const verificationStatus = getVerificationStatus()

  return (
    <main className="min-h-screen pt-16 bg-gray-50">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-[#003DA5] to-[#1A1A1A] text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-[#FFD700] rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-[#1A1A1A]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            PRODUCT
            <span className="block text-[#FF3D00]">VERIFICATION</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Verify the authenticity of your sports equipment using our secure verification system.
            Protect yourself from counterfeit products.
          </p>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <Shield className="w-8 h-8 mx-auto mb-2 text-[#FFD700]" />
              <div className="text-sm font-bold">Authentic Products</div>
              <div className="text-xs text-gray-300">100% Genuine</div>
            </div>
            <div className="text-center">
              <Award className="w-8 h-8 mx-auto mb-2 text-[#AEEA00]" />
              <div className="text-sm font-bold">Official Distributor</div>
              <div className="text-xs text-gray-300">Authorized Seller</div>
            </div>
            <div className="text-center md:block hidden">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-[#FF3D00]" />
              <div className="text-sm font-bold">Instant Verification</div>
              <div className="text-xs text-gray-300">Real-time Check</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          {/* Verification Form */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Verify Product Authenticity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleVerifyProduct} className="space-y-4">
                <div>
                  <Label htmlFor="sku">Product SKU Code</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="sku"
                      type="text"
                      value={sku}
                      onChange={(e) => setSku(e.target.value.toUpperCase())}
                      placeholder="Enter SKU code (e.g., RS-123456-ABC)"
                      className="flex-1 font-mono"
                      disabled={loading}
                    />
                    <Button
                      type="submit"
                      disabled={loading}
                      className="bg-[#003DA5] hover:bg-[#003DA5]/90"
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Shield className="w-4 h-4 mr-2" />
                          Verify
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  <p>
                    💡 <strong>Where to find your SKU code:</strong>
                  </p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Check the product packaging or labels</li>
                    <li>Look on the product receipt or invoice</li>
                    <li>Find it on the product itself (often printed or engraved)</li>
                    <li>Check your order confirmation from Ralhum Sports</li>
                  </ul>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Verification Result */}
          {verificationStatus && (
            <Card className={`mb-8 ${verificationStatus.borderColor} border-2`}>
              <CardContent className={`p-6 ${verificationStatus.bgColor}`}>
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-full ${verificationStatus.bgColor}`}>
                    {React.createElement(verificationStatus.icon, {
                      className: `w-8 h-8 ${verificationStatus.color}`,
                    })}
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-xl font-bold mb-2 ${verificationStatus.color}`}>
                      {verificationStatus.title}
                    </h3>
                    <p className="text-gray-700 mb-4">{verificationStatus.description}</p>

                    {verificationStatus.type === 'not-found' && (
                      <Alert className="bg-white border-red-200">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
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

          {/* Product Details */}
          {product && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Verified Product Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Product Image */}
                  <div className="space-y-4">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        width={600}
                        height={400}
                        src={
                          product.images[0]?.image?.url ||
                          product.images[0]?.url ||
                          'https://placehold.co/600x400'
                        }
                        alt={
                          product.images[0]?.image?.alt || product.images[0]?.alt || product.name
                        }
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {product.images.length > 1 && (
                      <div className="flex gap-2 overflow-x-auto">
                        {product.images.slice(1, 4).map((image) => (
                          <Image
                            width={100}
                            height={100}
                            key={image.id}
                            src={image.image?.url || image.url || 'https://placehold.co/100x100'}
                            alt={image.image?.alt || image.alt || product.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="space-y-4">
                    {product.brand && (
                      <div>
                        <Badge variant="outline" className="text-[#003DA5] border-[#003DA5]">
                          {product.brand.name}
                        </Badge>
                      </div>
                    )}

                    <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>

                    <div className="space-y-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-[#003DA5]">Rs. {product.price.toLocaleString('en-LK')}</span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-lg text-gray-500 line-through">
                            Rs. {product.originalPrice.toLocaleString('en-LK')}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium">SKU:</span>
                        <code className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">
                          {product.sku}
                        </code>
                      </div>

                      <div className="flex justify-between">
                        <span className="font-medium">Status:</span>
                        <Badge
                          className={
                            product.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : product.status === 'out-of-stock'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                          }
                        >
                          {product.status === 'active'
                            ? 'Available'
                            : product.status === 'out-of-stock'
                              ? 'Out of Stock'
                              : product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                        </Badge>
                      </div>

                      {/* Variant Table */}
                      {Array.isArray(product.variants) && product.variants.length > 0 && (
                        <div className="mt-4">
                          <h4 className="font-medium mb-2">Variants:</h4>
                          <div className="overflow-x-auto">
                            <table className="min-w-full text-sm border">
                              <thead>
                                <tr className="bg-gray-100">
                                  <th className="px-2 py-1 border">Name</th>
                                  <th className="px-2 py-1 border">Price</th>
                                  <th className="px-2 py-1 border">Inventory</th>
                                </tr>
                              </thead>
                              <tbody>
                                {product.variants.map((variant: any) => (
                                  <tr key={variant.id || variant.sku || variant.name}>
                                    <td className="px-2 py-1 border">{variant.name}</td>
                                    <td className="px-2 py-1 border">{`LKR ${variant.price?.toLocaleString('en-LK')}`}</td>
                                    <td className="px-2 py-1 border">
                                      {variant.inventory > 0 ? (
                                        <span className="text-green-600 font-semibold">
                                          {variant.inventory} in stock
                                        </span>
                                      ) : (
                                        <span className="text-red-600">Out of stock</span>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {/* Hide base stock if variants do not exist */}
                      {(!Array.isArray(product.variants) || product.variants.length === 0) && (
                        <div className="flex justify-between">
                          <span className="font-medium">Stock:</span>
                          <span className="flex items-center gap-1">
                            {typeof product.stock === 'number' && product.stock > 0 ? (
                              <>
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span className="text-green-600">{product.stock} available</span>
                              </>
                            ) : (
                              <>
                                <X className="w-4 h-4 text-red-600" />
                                <span className="text-red-600">Out of stock</span>
                              </>
                            )}
                          </span>
                        </div>
                      )}

                      {product.category && (
                        <div className="flex justify-between">
                          <span className="font-medium">Category:</span>
                          <span>{product.category.name}</span>
                        </div>
                      )}
                    </div>

                    {/* Product Features */}
                    {(Array.isArray(product.features) ? product.features : []).length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Key Features:</h4>
                        <ul className="text-sm space-y-1">
                          {(Array.isArray(product.features) ? product.features : [])
                            .slice(0, 3)
                            .map((feature, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <Zap className="w-3 h-3 text-[#FF3D00] mt-0.5 flex-shrink-0" />
                                <span>{feature}</span>
                              </li>
                            ))}
                        </ul>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <Button
                        size="sm"
                        className="bg-[#003DA5] hover:bg-[#003DA5]/90 text-white flex-1"
                        asChild
                      >
                        <Link href={`/products/${product.slug}`}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Product
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Information Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Why Verify */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#003DA5]" />
                  Why Verify Products?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Authenticity Guarantee</p>
                    <p className="text-gray-600">
                      Ensure you&apos;re buying genuine products from authorized distributors
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Quality Assurance</p>
                    <p className="text-gray-600">
                      Verified products meet manufacturer quality standards
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Warranty Protection</p>
                    <p className="text-gray-600">
                      Authentic products come with valid manufacturer warranties
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Counterfeit Protection</p>
                    <p className="text-gray-600">
                      Avoid fake products that may be unsafe or poor quality
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Support */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-[#FF3D00]" />
                  Found a Problem?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  If you believe you have a counterfeit product or if verification failed for a
                  genuine Ralhum Sports product, please contact us immediately.
                </p>

                <div className="space-y-3">
                  <Button
                    size="sm"
                    className="w-full bg-[#25D366] hover:bg-[#25D366]/90 text-white"
                    onClick={() => {
                      const message = `Hello! I need to report a product verification issue. SKU: ${sku}`
                      const whatsappUrl = `https://wa.me/94772350712?text=${encodeURIComponent(message)}`
                      window.open(whatsappUrl, '_blank')
                    }}
                  >
                    Report via WhatsApp
                  </Button>

                  <Button size="sm" variant="outline" className="w-full" asChild>
                    <Link href="/contact">Contact Support</Link>
                  </Button>
                </div>

                <div className="text-xs text-gray-500 space-y-1">
                  <p>
                    <strong>What to include in your report:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Product SKU code</li>
                    <li>Where you purchased the product</li>
                    <li>Photos of the product and packaging</li>
                    <li>Purchase receipt or proof</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Information */}
          <Card className="mt-6">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <h3 className="text-lg font-bold">🛡️ Your Safety is Our Priority</h3>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  As Sri Lanka&apos;s #1 sports equipment distributor, we&apos;re committed to
                  ensuring every customer receives authentic, high-quality products. Our
                  verification system helps protect you from counterfeit sports equipment that may
                  be unsafe or perform poorly.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/products">Browse Authentic Products</Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
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
