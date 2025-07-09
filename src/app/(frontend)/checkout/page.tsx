'use client'

import React, { useState } from 'react'
import { useCart } from '@/hooks/use-cart'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  CreditCard,
  MessageCircle,
  Truck,
  Shield,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  Package,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { OrderSummary, CheckoutState, FormErrors, SRI_LANKAN_PROVINCES } from '@/types/checkout'
import {
  generateWhatsAppURL,
  validateSriLankanPhone,
  formatSriLankanPhone,
  getWhatsAppButtonText,
  openWhatsAppOrder,
} from '@/lib/whatsapp'
import { api } from '@/lib/api'
import { OrderInput } from '@/types/api'
import { toast } from 'sonner'
import Image from 'next/image'

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, clearCart } = useCart()

  const [checkoutState, setCheckoutState] = useState<CheckoutState>({
    step: 'review',
    customerInfo: {},
    pricing: {
      subtotal: 0,
      shipping: 0,
      tax: 0,
      total: 0,
      currency: 'LKR',
    },
    isSubmitting: false,
    errors: {},
  })

  // ✅ Separate state for confirmation to ensure proper rendering
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [confirmationOrderId, setConfirmationOrderId] = useState('')
  const [apiError, setApiError] = useState<string | null>(null)

  // Calculate pricing whenever cart changes
  React.useEffect(() => {
    if (cart.items.length === 0) return

    const subtotal = cart.items.reduce((sum, item) => sum + item.variant.price * item.quantity, 0)

    const shipping = calculateShipping(subtotal)
    const tax = calculateTax(subtotal) // Tax only on subtotal, not shipping
    const total = subtotal + shipping + tax

    setCheckoutState((prev) => ({
      ...prev,
      pricing: {
        subtotal,
        shipping,
        tax,
        total,
        currency: 'LKR',
      },
    }))
  }, [cart.items])

  // Redirect if cart is empty
  React.useEffect(() => {
    if (cart.items.length === 0 && !showConfirmation) {
      router.push('/products')
    }
  }, [cart.items.length, showConfirmation, router])

  // ✅ Debug logging for state changes
  React.useEffect(() => {
    console.log('🔍 State updated:', {
      step: checkoutState.step,
      showConfirmation,
      confirmationOrderId,
      isSubmitting: checkoutState.isSubmitting,
    })
  }, [checkoutState, showConfirmation, confirmationOrderId])

  const validateForm = (): boolean => {
    const errors: FormErrors = {}
    const { customerInfo } = checkoutState

    if (!customerInfo.fullName?.trim()) {
      errors.fullName = 'Full name is required'
    }

    if (!customerInfo.email?.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)) {
      errors.email = 'Please enter a valid email address'
    }

    if (!customerInfo.phone?.trim()) {
      errors.phone = 'Phone number is required'
    } else if (!validateSriLankanPhone(customerInfo.phone)) {
      errors.phone = 'Please enter a valid Sri Lankan phone number'
    }

    if (!customerInfo.address?.street?.trim()) {
      errors.street = 'Street address is required'
    }

    if (!customerInfo.address?.city?.trim()) {
      errors.city = 'City is required'
    }

    if (!customerInfo.address?.postalCode?.trim()) {
      errors.postalCode = 'Postal code is required'
    }

    if (!customerInfo.address?.province?.trim()) {
      errors.province = 'Province is required'
    }

    setCheckoutState((prev) => ({ ...prev, errors }))
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (field: string, value: string) => {
    setApiError(null) // Clear API error when user makes changes
    setCheckoutState((prev) => ({
      ...prev,
      customerInfo: {
        ...prev.customerInfo,
        ...(field.includes('.')
          ? {
              address: {
                ...prev.customerInfo.address,
                [field.split('.')[1]]: value,
              },
            }
          : { [field]: value }),
      },
      errors: {
        ...prev.errors,
        [field.includes('.') ? field.split('.')[1] : field]: undefined,
      },
    }))
  }

  const handleSubmitOrder = async () => {
    console.log('🚀 Starting order submission')

    // ✅ Prevent multiple submissions
    if (checkoutState.isSubmitting) {
      console.log('⚠️ Already submitting, returning')
      return
    }

    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly')
      return
    }

    // ✅ Set submitting state FIRST
    setCheckoutState((prev) => ({
      ...prev,
      isSubmitting: true,
      errors: {}, // Clear any previous errors
    }))

    try {
      // Prepare order data for API
      const orderData: OrderInput = {
        customer: {
          fullName: checkoutState.customerInfo.fullName!,
          email: checkoutState.customerInfo.email!,
          phone: formatSriLankanPhone(checkoutState.customerInfo.phone!),
          secondaryPhone: checkoutState.customerInfo.secondaryPhone,
          address: {
            street: checkoutState.customerInfo.address?.street ?? '',
            city: checkoutState.customerInfo.address?.city ?? '',
            postalCode: checkoutState.customerInfo.address?.postalCode ?? '',
            province: checkoutState.customerInfo.address?.province ?? '',
          },
          specialInstructions: checkoutState.customerInfo.specialInstructions,
          preferredLanguage: 'english',
          marketingOptIn: true,
        },
        items: cart.items.map((item) => ({
          id: item.id,
          productId: item.product.id,
          productName: item.product.title,
          productSku: item.product.sku,
          variantId: item.variant.id,
          unitPrice: item.variant.price,
          quantity: item.quantity,
          selectedSize: item.variant.size,
          selectedColor: item.variant.color,
          subtotal: item.variant.price * item.quantity,
        })),
        pricing: checkoutState.pricing,
        specialInstructions: checkoutState.customerInfo.specialInstructions,
        orderSource: 'website',
      }

      console.log('📦 Creating order via API...')

      // Save order to database via API
      const apiResponse = await api.createOrder(orderData)

      if (!apiResponse.success) {
        throw new Error(apiResponse.error || 'Failed to create order')
      }

      console.log('✅ Order created successfully:', apiResponse.data)

      const orderNumber = apiResponse.data?.orderNumber

      if (!orderNumber) {
        throw new Error('Order number not received from API')
      }

      console.log('🎯 Setting confirmation state with orderId:', orderNumber)

      // Create order summary for WhatsApp
      const order: OrderSummary = {
        orderId: orderNumber,
        items: cart.items,
        customer: {
          fullName: checkoutState.customerInfo.fullName!,
          email: checkoutState.customerInfo.email!,
          phone: formatSriLankanPhone(checkoutState.customerInfo.phone!),
          address: {
            street: checkoutState.customerInfo.address?.street ?? '',
            city: checkoutState.customerInfo.address?.city ?? '',
            postalCode: checkoutState.customerInfo.address?.postalCode ?? '',
            province: checkoutState.customerInfo.address?.province ?? '',
          },
          specialInstructions: checkoutState.customerInfo.specialInstructions,
        },
        pricing: checkoutState.pricing,
        createdAt: new Date().toISOString(),
        status: 'pending',
      }

      // Store order in localStorage for tracking
      const existingOrders = JSON.parse(localStorage.getItem('ralhum-orders') || '[]')
      existingOrders.push({
        ...order,
        customerEmail: checkoutState.customerInfo.email,
        customerPhone: checkoutState.customerInfo.phone,
      })
      localStorage.setItem('ralhum-orders', JSON.stringify(existingOrders))

      // Open WhatsApp
      openWhatsAppOrder(order)

      // Clear cart
      clearCart()

      // ✅ Set confirmation state using separate state variables
      console.log('🎯 Setting confirmation screen with orderId:', orderNumber)
      setConfirmationOrderId(orderNumber)
      setShowConfirmation(true)

      // ✅ Also update checkout state for consistency
      setCheckoutState((prev) => ({
        ...prev,
        step: 'confirmation',
        orderId: orderNumber,
        isSubmitting: false,
      }))

      toast.success('Order created successfully and sent to WhatsApp!')
    } catch (error) {
      console.error('❌ Error submitting order:', error)
      setApiError(error instanceof Error ? error.message : 'Failed to create order')
      toast.error('Failed to create order. Please try again.')

      // ✅ Reset submitting state on error
      setCheckoutState((prev) => ({ ...prev, isSubmitting: false }))
    }
  }

  if (cart.items.length === 0 && !showConfirmation) {
    return null // Will redirect
  }

  // ✅ Primary check for confirmation screen

  if (showConfirmation && confirmationOrderId) {
    console.log('✅ Rendering confirmation screen with orderId:', confirmationOrderId)
    return <CheckoutConfirmation orderId={confirmationOrderId} />
  }

  // ✅ Fallback check using checkout state
  if (checkoutState.step === 'confirmation' && checkoutState.orderId) {
    console.log('✅ Fallback: Rendering confirmation screen from checkoutState')
    return <CheckoutConfirmation orderId={checkoutState.orderId} />
  }

  console.log('🎯 Rendering checkout form')

  return (
    <main className="min-h-screen pt-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/products">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
          <h1 className="text-3xl font-black text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Review your order and complete your purchase</p>
        </div>

        {/* API Error Display */}
        {apiError && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{apiError}</AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Customer Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={checkoutState.customerInfo.fullName || ''}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className={checkoutState.errors.fullName ? 'border-red-500' : ''}
                      placeholder="Enter your full name"
                    />
                    {checkoutState.errors.fullName && (
                      <p className="text-sm text-red-600 mt-1">{checkoutState.errors.fullName}</p>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={checkoutState.customerInfo.email || ''}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={checkoutState.errors.email ? 'border-red-500' : ''}
                        placeholder="your@email.com"
                      />
                      {checkoutState.errors.email && (
                        <p className="text-sm text-red-600 mt-1">{checkoutState.errors.email}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={checkoutState.customerInfo.phone || ''}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className={checkoutState.errors.phone ? 'border-red-500' : ''}
                        placeholder="+94 77 123 4567"
                      />
                      {checkoutState.errors.phone && (
                        <p className="text-sm text-red-600 mt-1">{checkoutState.errors.phone}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="secondaryPhone">Secondary Phone (Optional)</Label>
                    <Input
                      id="secondaryPhone"
                      value={checkoutState.customerInfo.secondaryPhone || ''}
                      onChange={(e) => handleInputChange('secondaryPhone', e.target.value)}
                      placeholder="+94 71 123 4567"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="street">Street Address *</Label>
                  <Input
                    id="street"
                    value={checkoutState.customerInfo.address?.street || ''}
                    onChange={(e) => handleInputChange('address.street', e.target.value)}
                    className={checkoutState.errors.street ? 'border-red-500' : ''}
                    placeholder="Enter your street address"
                  />
                  {checkoutState.errors.street && (
                    <p className="text-sm text-red-600 mt-1">{checkoutState.errors.street}</p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={checkoutState.customerInfo.address?.city || ''}
                      onChange={(e) => handleInputChange('address.city', e.target.value)}
                      className={checkoutState.errors.city ? 'border-red-500' : ''}
                      placeholder="City"
                    />
                    {checkoutState.errors.city && (
                      <p className="text-sm text-red-600 mt-1">{checkoutState.errors.city}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="postalCode">Postal Code *</Label>
                    <Input
                      id="postalCode"
                      value={checkoutState.customerInfo.address?.postalCode || ''}
                      onChange={(e) => handleInputChange('address.postalCode', e.target.value)}
                      className={checkoutState.errors.postalCode ? 'border-red-500' : ''}
                      placeholder="10100"
                    />
                    {checkoutState.errors.postalCode && (
                      <p className="text-sm text-red-600 mt-1">{checkoutState.errors.postalCode}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="province">Province *</Label>
                  <Select
                    value={checkoutState.customerInfo.address?.province || ''}
                    onValueChange={(value) => handleInputChange('address.province', value)}
                  >
                    <SelectTrigger
                      className={checkoutState.errors.province ? 'border-red-500' : ''}
                    >
                      <SelectValue placeholder="Select your province" />
                    </SelectTrigger>
                    <SelectContent>
                      {SRI_LANKAN_PROVINCES.map((province) => (
                        <SelectItem key={province} value={province}>
                          {province}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {checkoutState.errors.province && (
                    <p className="text-sm text-red-600 mt-1">{checkoutState.errors.province}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="specialInstructions">Special Instructions (Optional)</Label>
                  <Textarea
                    id="specialInstructions"
                    value={checkoutState.customerInfo.specialInstructions || ''}
                    onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
                    placeholder="Any special delivery instructions..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cart.items.map((item) => {
                    const itemTotal = item.variant.price * item.quantity

                    return (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 pb-4 border-b last:border-b-0"
                      >
                        <Image
                          width={64}
                          height={64}
                          src={item.product.images[0]?.url || 'https://placehold.co/600x400'}
                          alt={item.product.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{item.product.title}</h4>
                          <p className="text-sm text-gray-600">{item.variant.name}</p>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(itemTotal)}</p>
                          <p className="text-xs text-gray-500">
                            {formatCurrency(item.variant.price)} each
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pricing Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>{formatCurrency(checkoutState.pricing.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>
                      {checkoutState.pricing.shipping === 0 ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          FREE
                        </Badge>
                      ) : (
                        formatCurrency(checkoutState.pricing.shipping)
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (15%)</span>
                    <span>{formatCurrency(checkoutState.pricing.tax)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-[#003DA5]">
                      {formatCurrency(checkoutState.pricing.total)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Disabled Online Payment */}
                <div className="relative">
                  <Button
                    disabled
                    className="w-full h-14 bg-gray-100 text-gray-400 cursor-not-allowed"
                    variant="outline"
                  >
                    <CreditCard className="w-5 h-5 mr-3" />
                    Pay Online
                    <Badge className="ml-auto bg-orange-100 text-orange-800">Coming Soon</Badge>
                  </Button>
                </div>

                <div className="text-center text-sm text-gray-500">OR</div>

                {/* WhatsApp Payment */}
                <Button
                  onClick={handleSubmitOrder}
                  disabled={checkoutState.isSubmitting}
                  className="w-full h-14 bg-green-600 hover:bg-green-700 text-white font-bold text-lg"
                >
                  {checkoutState.isSubmitting ? (
                    <>
                      <div className="w-5 h-5 mr-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <MessageCircle className="w-5 h-5 mr-3" />
                      {getWhatsAppButtonText()}
                    </>
                  )}
                </Button>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    Your order will be sent to WhatsApp for confirmation. Our team will provide
                    payment instructions and process your order.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 text-center text-sm">
              <div className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg">
                <Truck className="w-6 h-6 text-[#003DA5]" />
                <span className="font-medium">Free Shipping</span>
                <span className="text-gray-600">
                  On orders over LKR {SITE_CONFIG.shipping.freeShippingThreshold}
                </span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg">
                <Shield className="w-6 h-6 text-[#003DA5]" />
                <span className="font-medium">Secure Process</span>
                <span className="text-gray-600">Safe & encrypted</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

function CheckoutConfirmation({ orderId }: { orderId: string }) {
  console.log('🎉 CheckoutConfirmation rendered with orderId:', orderId)

  // Retrieve the order from localStorage
  let order = null
  if (typeof window !== 'undefined') {
    const orders = JSON.parse(localStorage.getItem('ralhum-orders') || '[]')
    order = orders.find((o: { orderId: string }) => o.orderId === orderId)
  }

  return (
    <main className="min-h-screen pt-16 bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-xl p-8 shadow-lg">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>

          <h1 className="text-3xl font-black text-gray-900 mb-4">Order Sent Successfully!</h1>
          <p className="text-gray-600 mb-6">
            Your order has been redirected to whatsapp. We&apos;ll contact you shortly to confirm
            your order and provide payment instructions.
          </p>
          <Alert className="mb-3 flex flex-col items-center text-center">
            <AlertCircle className="h-5 w-5 mb-4 text-[#003DA5]" />
            <AlertDescription className="text-sm text-gray-700 text-left">
              <span>
                If you were not redirected to WhatsApp, you can manually open WhatsApp and confirm
                your order using the button below.
              </span>
            </AlertDescription>
          </Alert>
          {order && (
            <a
              href={generateWhatsAppURL(order)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-[#25D366] hover:bg-[#25D366]/90 text-white font-semibold px-6 py-2 rounded-lg shadow mb-4 no-underline"
              // Removed inline style; use 'no-underline' Tailwind class instead
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Send Message
            </a>
          )}

          <div className="bg-gray-50 rounded-lg p-4 mb-6 mt-6">
            <p className="text-sm text-gray-600">Order ID</p>
            <p className="text-lg font-bold text-[#003DA5]">{orderId || 'Processing...'}</p>
          </div>

          <div className="space-y-3">
            <Button asChild className="w-full bg-[#003DA5] hover:bg-[#003DA5]/90">
              <Link href="/products">Continue Shopping</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href={`/orders/track?orderId=${orderId}`}>Track Your Order</Link>
            </Button>
          </div>

          <div className="mt-8 pt-6 border-t text-sm text-gray-600">
            <p className="flex items-center justify-center gap-2">
              <Phone className="w-4 h-4" />
              Questions? Call us at {SITE_CONFIG.contact.phone}
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

// Helper functions for shipping/tax (use global config)
import { SITE_CONFIG } from '@/config/site-config'

// Helper function to format currency
function formatCurrency(amount: number): string {
  return `${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} LKR`
}

function calculateShipping(subtotal: number) {
  return subtotal >= SITE_CONFIG.shipping.freeShippingThreshold
    ? 0
    : SITE_CONFIG.shipping.standardShipping
}
function calculateTax(amount: number) {
  return Math.round(amount * SITE_CONFIG.taxRate)
}
