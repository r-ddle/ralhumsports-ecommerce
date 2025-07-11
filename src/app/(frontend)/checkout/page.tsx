'use client'

import { useState, useEffect } from 'react'
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
import {
  type OrderSummary,
  type CheckoutState,
  type FormErrors,
  SRI_LANKAN_PROVINCES,
} from '@/types/checkout'
import {
  generateWhatsAppURL,
  validateSriLankanPhone,
  formatSriLankanPhone,
  getWhatsAppButtonText,
  openWhatsAppOrder,
} from '@/lib/whatsapp'
import { api } from '@/lib/api'
import type { OrderInput } from '@/types/api'
import { toast } from 'sonner'
import Image from 'next/image'
import { motion, AnimatePresence, easeOut } from 'framer-motion'
import { SITE_CONFIG } from '@/config/site-config'

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, clearCart } = useCart()
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

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

  const [showConfirmation, setShowConfirmation] = useState(false)
  const [confirmationOrderId, setConfirmationOrderId] = useState('')
  const [apiError, setApiError] = useState<string | null>(null)

  // Performance optimization: Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Calculate pricing whenever cart changes
  useEffect(() => {
    if (cart.items.length === 0) return

    const subtotal = cart.items.reduce((sum, item) => sum + item.variant.price * item.quantity, 0)
    const shipping = calculateShipping(subtotal)
    const tax = calculateTax(subtotal)
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
  useEffect(() => {
    if (cart.items.length === 0 && !showConfirmation) {
      router.push('/products')
    }
  }, [cart.items.length, showConfirmation, router])

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
    setApiError(null)
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
    if (checkoutState.isSubmitting) {
      return
    }

    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly')
      return
    }

    setCheckoutState((prev) => ({
      ...prev,
      isSubmitting: true,
      errors: {},
    }))

    try {
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

      const apiResponse = await api.createOrder(orderData)

      if (!apiResponse.success) {
        throw new Error(apiResponse.error || 'Failed to create order')
      }

      const orderNumber = apiResponse.data?.orderNumber

      if (!orderNumber) {
        throw new Error('Order number not received from API')
      }

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

      const existingOrders = JSON.parse(localStorage.getItem('ralhum-orders') || '[]')
      existingOrders.push({
        ...order,
        customerEmail: checkoutState.customerInfo.email,
        customerPhone: checkoutState.customerInfo.phone,
      })
      localStorage.setItem('ralhum-orders', JSON.stringify(existingOrders))

      openWhatsAppOrder(order)
      clearCart()

      setConfirmationOrderId(orderNumber)
      setShowConfirmation(true)

      setCheckoutState((prev) => ({
        ...prev,
        step: 'confirmation',
        orderId: orderNumber,
        isSubmitting: false,
      }))

      toast.success('Order created successfully and sent to WhatsApp!')
    } catch (error) {
      console.error('Error submitting order:', error)
      setApiError(error instanceof Error ? error.message : 'Failed to create order')
      toast.error('Failed to create order. Please try again.')

      setCheckoutState((prev) => ({ ...prev, isSubmitting: false }))
    }
  }

  if (cart.items.length === 0 && !showConfirmation) {
    return null
  }

  if (showConfirmation && confirmationOrderId) {
    return <CheckoutConfirmation orderId={confirmationOrderId} />
  }

  if (checkoutState.step === 'confirmation' && checkoutState.orderId) {
    return <CheckoutConfirmation orderId={checkoutState.orderId} />
  }

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
    <main className="min-h-screen pt-16 bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          {/* Enhanced Header */}
          <motion.div variants={itemVariants} className="mb-8">
            <Link href="/products">
              <Button
                variant="ghost"
                size="sm"
                className="mb-4 hover:bg-white/50 dark:hover:bg-gray-800/50 backdrop-blur-sm"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-black bg-gradient-to-r from-slate-900 to-blue-900 dark:from-white dark:to-blue-200 bg-clip-text text-transparent">
                  Checkout
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Review your order and complete your purchase
                </p>
              </div>
            </div>
          </motion.div>

          {/* Enhanced API Error Display */}
          <AnimatePresence>
            {apiError && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="mb-6"
              >
                <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 backdrop-blur-sm">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800 dark:text-red-200">
                    {apiError}
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Enhanced Left Column - Customer Information */}
            <motion.div variants={itemVariants} className="space-y-6">
              <Card className="backdrop-blur-lg bg-white/80 dark:bg-gray-800/80 border border-white/20 shadow-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 text-white">
                      <Mail className="w-5 h-5" />
                    </div>
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <Label htmlFor="fullName" className="text-base font-semibold">
                        Full Name *
                      </Label>
                      <Input
                        id="fullName"
                        value={checkoutState.customerInfo.fullName || ''}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        className={`mt-2 h-12 border-2 rounded-xl bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm ${
                          checkoutState.errors.fullName
                            ? 'border-red-500'
                            : 'border-gray-200 dark:border-gray-600 focus:border-blue-500'
                        }`}
                        placeholder="Enter your full name"
                      />
                      {checkoutState.errors.fullName && (
                        <p className="text-sm text-red-600 mt-2">{checkoutState.errors.fullName}</p>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="email" className="text-base font-semibold">
                          Email Address *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={checkoutState.customerInfo.email || ''}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className={`mt-2 h-12 border-2 rounded-xl bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm ${
                            checkoutState.errors.email
                              ? 'border-red-500'
                              : 'border-gray-200 dark:border-gray-600 focus:border-blue-500'
                          }`}
                          placeholder="your@email.com"
                        />
                        {checkoutState.errors.email && (
                          <p className="text-sm text-red-600 mt-2">{checkoutState.errors.email}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="phone" className="text-base font-semibold">
                          Phone Number *
                        </Label>
                        <Input
                          id="phone"
                          value={checkoutState.customerInfo.phone || ''}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className={`mt-2 h-12 border-2 rounded-xl bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm ${
                            checkoutState.errors.phone
                              ? 'border-red-500'
                              : 'border-gray-200 dark:border-gray-600 focus:border-blue-500'
                          }`}
                          placeholder="+94 77 123 4567"
                        />
                        {checkoutState.errors.phone && (
                          <p className="text-sm text-red-600 mt-2">{checkoutState.errors.phone}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="secondaryPhone" className="text-base font-semibold">
                        Secondary Phone (Optional)
                      </Label>
                      <Input
                        id="secondaryPhone"
                        value={checkoutState.customerInfo.secondaryPhone || ''}
                        onChange={(e) => handleInputChange('secondaryPhone', e.target.value)}
                        className="mt-2 h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 rounded-xl bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm"
                        placeholder="+94 71 123 4567"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-lg bg-white/80 dark:bg-gray-800/80 border border-white/20 shadow-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 text-white">
                      <MapPin className="w-5 h-5" />
                    </div>
                    Delivery Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="street" className="text-base font-semibold">
                      Street Address *
                    </Label>
                    <Input
                      id="street"
                      value={checkoutState.customerInfo.address?.street || ''}
                      onChange={(e) => handleInputChange('address.street', e.target.value)}
                      className={`mt-2 h-12 border-2 rounded-xl bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm ${
                        checkoutState.errors.street
                          ? 'border-red-500'
                          : 'border-gray-200 dark:border-gray-600 focus:border-blue-500'
                      }`}
                      placeholder="Enter your street address"
                    />
                    {checkoutState.errors.street && (
                      <p className="text-sm text-red-600 mt-2">{checkoutState.errors.street}</p>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="city" className="text-base font-semibold">
                        City *
                      </Label>
                      <Input
                        id="city"
                        value={checkoutState.customerInfo.address?.city || ''}
                        onChange={(e) => handleInputChange('address.city', e.target.value)}
                        className={`mt-2 h-12 border-2 rounded-xl bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm ${
                          checkoutState.errors.city
                            ? 'border-red-500'
                            : 'border-gray-200 dark:border-gray-600 focus:border-blue-500'
                        }`}
                        placeholder="City"
                      />
                      {checkoutState.errors.city && (
                        <p className="text-sm text-red-600 mt-2">{checkoutState.errors.city}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="postalCode" className="text-base font-semibold">
                        Postal Code *
                      </Label>
                      <Input
                        id="postalCode"
                        value={checkoutState.customerInfo.address?.postalCode || ''}
                        onChange={(e) => handleInputChange('address.postalCode', e.target.value)}
                        className={`mt-2 h-12 border-2 rounded-xl bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm ${
                          checkoutState.errors.postalCode
                            ? 'border-red-500'
                            : 'border-gray-200 dark:border-gray-600 focus:border-blue-500'
                        }`}
                        placeholder="10100"
                      />
                      {checkoutState.errors.postalCode && (
                        <p className="text-sm text-red-600 mt-2">
                          {checkoutState.errors.postalCode}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="province" className="text-base font-semibold">
                      Province *
                    </Label>
                    <Select
                      value={checkoutState.customerInfo.address?.province || ''}
                      onValueChange={(value) => handleInputChange('address.province', value)}
                    >
                      <SelectTrigger
                        className={`mt-2 h-12 border-2 rounded-xl bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm ${
                          checkoutState.errors.province
                            ? 'border-red-500'
                            : 'border-gray-200 dark:border-gray-600 focus:border-blue-500'
                        }`}
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
                      <p className="text-sm text-red-600 mt-2">{checkoutState.errors.province}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="specialInstructions" className="text-base font-semibold">
                      Special Instructions (Optional)
                    </Label>
                    <Textarea
                      id="specialInstructions"
                      value={checkoutState.customerInfo.specialInstructions || ''}
                      onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
                      placeholder="Any special delivery instructions..."
                      rows={3}
                      className="mt-2 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 rounded-xl bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm resize-none"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Enhanced Right Column - Order Summary */}
            <motion.div variants={itemVariants} className="space-y-6">
              <Card className="backdrop-blur-lg bg-white/80 dark:bg-gray-800/80 border border-white/20 shadow-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                      <Package className="w-5 h-5" />
                    </div>
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
                          className="flex items-center gap-4 pb-4 border-b last:border-b-0 border-gray-200 dark:border-gray-700"
                        >
                          <Image
                            width={64}
                            height={64}
                            src={item.product.images[0]?.url || 'https://placehold.co/600x400'}
                            alt={item.product.title}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {item.product.title}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {item.variant.name}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Qty: {item.quantity}
                            </p>
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

              <Card className="backdrop-blur-lg bg-white/80 dark:bg-gray-800/80 border border-white/20 shadow-2xl">
                <CardHeader>
                  <CardTitle>Pricing Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                      <span className="font-semibold">
                        {formatCurrency(checkoutState.pricing.subtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                      <span>
                        {checkoutState.pricing.shipping === 0 ? (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 font-bold">
                            FREE
                          </Badge>
                        ) : (
                          formatCurrency(checkoutState.pricing.shipping)
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Tax (15%)</span>
                      <span className="font-semibold">
                        {formatCurrency(checkoutState.pricing.tax)}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-xl font-black">
                      <span>Total</span>
                      <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {formatCurrency(checkoutState.pricing.total)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-lg bg-white/80 dark:bg-gray-800/80 border border-white/20 shadow-2xl">
                <CardHeader>
                  <CardTitle>Payment Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Disabled Online Payment */}
                  <div className="relative">
                    <Button
                      disabled
                      className="w-full h-16 bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed rounded-xl"
                      variant="outline"
                    >
                      <CreditCard className="w-6 h-6 mr-3" />
                      Pay Online
                      <Badge className="ml-auto bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400">
                        Coming Soon
                      </Badge>
                    </Button>
                  </div>

                  <div className="text-center text-sm text-gray-500">OR</div>

                  {/* Enhanced WhatsApp Payment */}
                  <Button
                    onClick={handleSubmitOrder}
                    disabled={checkoutState.isSubmitting}
                    className="w-full h-16 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                  >
                    {checkoutState.isSubmitting ? (
                      <>
                        <motion.div
                          className="w-6 h-6 mr-3 border-2 border-white border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: 'linear',
                          }}
                        />
                        Processing...
                      </>
                    ) : (
                      <>
                        <MessageCircle className="w-6 h-6 mr-3" />
                        {getWhatsAppButtonText()}
                      </>
                    )}
                  </Button>

                  <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800 dark:text-blue-200 text-sm">
                      Your order will be sent to WhatsApp for confirmation. Our team will provide
                      payment instructions and process your order.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              {/* Enhanced Trust Badges */}
              <div className="grid grid-cols-2 gap-4 text-center text-sm">
                {[
                  {
                    icon: Truck,
                    title: 'Free Shipping',
                    subtitle: `On orders over LKR ${SITE_CONFIG.shipping.freeShippingThreshold}`,
                    color: 'from-blue-500 to-cyan-500',
                  },
                  {
                    icon: Shield,
                    title: 'Secure Process',
                    subtitle: 'Safe & encrypted',
                    color: 'from-green-500 to-emerald-500',
                  },
                ].map((badge) => (
                  <div
                    key={badge.title}
                    className="flex flex-col items-center gap-3 p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-white/20"
                  >
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${badge.color} text-white`}>
                      <badge.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white">{badge.title}</div>
                      <div className="text-gray-600 dark:text-gray-400 text-xs">
                        {badge.subtitle}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </main>
  )
}

function CheckoutConfirmation({ orderId }: { orderId: string }) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  let order = null
  if (typeof window !== 'undefined') {
    const orders = JSON.parse(localStorage.getItem('ralhum-orders') || '[]')
    order = orders.find((o: { orderId: string }) => o.orderId === orderId)
  }

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.6,
        ease: easeOut,
      },
    },
  }

  return (
    <main className="min-h-screen pt-16 bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <motion.div
          className="backdrop-blur-lg bg-white/80 dark:bg-gray-800/80 border border-white/20 rounded-2xl p-8 shadow-2xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
            animate={
              prefersReducedMotion
                ? {}
                : {
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  }
            }
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
            }}
          >
            <CheckCircle className="w-10 h-10 text-white" />
          </motion.div>

          <h1 className="text-3xl font-black mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Order Sent Successfully!
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
            Your order has been redirected to WhatsApp. We&apos;ll contact you shortly to confirm
            your order and provide payment instructions.
          </p>

          <Alert className="mb-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <AlertCircle className="h-5 w-5 text-blue-600" />
            <AlertDescription className="text-blue-800 dark:text-blue-200 text-left">
              If you were not redirected to WhatsApp, you can manually open WhatsApp and confirm
              your order using the button below.
            </AlertDescription>
          </Alert>

          {order && (
            <motion.a
              href={generateWhatsAppURL(order)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 mb-6 no-underline"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Send Message
            </motion.a>
          )}

          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6 mb-6 border border-blue-200/50 dark:border-blue-700/50">
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">Order ID</p>
            <p className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {orderId || 'Processing...'}
            </p>
          </div>

          <div className="space-y-4">
            <Button
              asChild
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Link href="/products">Continue Shopping</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full border-2 border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-bold py-4 rounded-xl bg-transparent"
            >
              <Link href={`/orders/track?orderId=${orderId}`}>Track Your Order</Link>
            </Button>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400">
            <p className="flex items-center justify-center gap-2">
              <Phone className="w-4 h-4" />
              Questions? Call us at {SITE_CONFIG.contact.phone}
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  )
}

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
