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
  Loader2,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { type OrderSummary, type CheckoutState, type FormErrors } from '@/types/checkout'
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
import { useRef } from 'react'
import { PayHereCheckout } from '@/components/payherecheckout'
// CitySearchComponent for city, postal code, and province selection
function CitySearchComponent({
  value,
  onChange,
  errors,
}: {
  value: { city: string; postalCode: string; province: string }
  onChange: (v: { city: string; postalCode: string; province: string }) => void
  errors: { city?: string; postalCode?: string; province?: string }
}) {
  const [searchTerm, setSearchTerm] = useState(value.city || '')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [filteredCities, setFilteredCities] = useState<any[]>([])
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setSearchTerm(value.city || '')
  }, [value.city])

  // Filter cities based on search term
  useEffect(() => {
    if (searchTerm.length > 0) {
      const filtered = SITE_CONFIG.SRI_LANKAN_CITIES.filter(
        (city: any) =>
          city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          city.province.toLowerCase().includes(searchTerm.toLowerCase()),
      ).slice(0, 10)
      setFilteredCities(filtered)
      setIsDropdownOpen(true)
    } else {
      setFilteredCities([])
      setIsDropdownOpen(false)
    }
  }, [searchTerm])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleCitySelect = (city: any) => {
    onChange({ city: city.name, postalCode: city.postalCode, province: city.province })
    setSearchTerm(city.name)
    setIsDropdownOpen(false)
  }

  const handleInputChange = (value: string) => {
    setSearchTerm(value)
    if (value === '') {
      onChange({ city: '', postalCode: '', province: '' })
    } else {
      onChange({ city: value, postalCode: '', province: '' })
    }
  }

  const handleProvinceChange = (province: string) => {
    onChange({ ...value, province })
  }

  return (
    <>
      <div className="grid md:grid-cols-2 gap-6">
        {/* City Search Input */}
        <div className="relative" ref={dropdownRef}>
          <Label htmlFor="city" className="block text-base font-semibold text-text-primary mb-2">
            City *
          </Label>
          <div className="relative">
            <Input
              ref={inputRef}
              id="city"
              type="text"
              value={searchTerm}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="Search for your city..."
              className={`w-full h-12 px-4 pr-10 border-2 rounded-xl bg-brand-background focus:outline-none focus:ring-2 focus:ring-brand-secondary transition-all ${
                errors.city
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-brand-border focus:border-brand-secondary'
              }`}
            />
            <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-brand-secondary w-5 h-5" />
          </div>
          {/* Dropdown */}
          {isDropdownOpen && filteredCities.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-brand-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {filteredCities.map((city, index) => (
                <div
                  key={index}
                  onClick={() => handleCitySelect(city)}
                  className="px-4 py-3 cursor-pointer hover:bg-brand-background border-b border-brand-border last:border-b-0 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-brand-secondary" />
                    <div>
                      <div className="font-medium text-text-primary">{city.name}</div>
                      <div className="text-sm text-text-secondary">
                        {city.province} • {city.postalCode}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {searchTerm && filteredCities.length === 0 && isDropdownOpen && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-brand-border rounded-lg shadow-lg p-4 text-center text-text-secondary">
              No cities found matching &quot;{searchTerm}&quot;
            </div>
          )}
          {errors.city && <p className="text-sm text-red-600 mt-2">{errors.city}</p>}
        </div>
        {/* Auto-filled Postal Code */}
        <div>
          <Label
            htmlFor="postalCode"
            className="block text-base font-semibold text-text-primary mb-2"
          >
            Postal Code *
          </Label>
          <Input
            id="postalCode"
            type="text"
            value={value.postalCode}
            readOnly
            className={`w-full h-12 px-4 border-2 rounded-xl bg-brand-background text-text-primary cursor-not-allowed ${
              errors.postalCode ? 'border-red-500' : 'border-brand-border'
            }`}
            placeholder="Will be auto-filled when you select a city"
          />
          {errors.postalCode && <p className="text-sm text-red-600 mt-2">{errors.postalCode}</p>}
        </div>
      </div>
      {/* Province Selection */}
      <div className="mt-6">
        <Label htmlFor="province" className="block text-base font-semibold text-text-primary mb-2">
          Province *
        </Label>
        <div className="relative">
          <select
            id="province"
            value={value.province}
            onChange={(e) => handleProvinceChange(e.target.value)}
            className={`w-full h-12 px-4 pr-10 border-2 rounded-xl bg-brand-background focus:outline-none focus:ring-2 focus:ring-brand-secondary transition-all appearance-none ${
              errors.province
                ? 'border-red-500 focus:border-red-500'
                : 'border-brand-border focus:border-brand-secondary'
            }`}
          >
            <option value="">Select your province</option>
            {SITE_CONFIG.SRI_LANKAN_PROVINCES.map((province: string) => (
              <option key={province} value={province}>
                {province}
              </option>
            ))}
          </select>
        </div>
        {errors.province && <p className="text-sm text-red-600 mt-2">{errors.province}</p>}
      </div>
    </>
  )
}

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, clearCart } = useCart()
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  const [checkoutState, setCheckoutState] = useState<CheckoutState>({
    step: 'review',
    customerInfo: {},
    pricing: {
      subtotal: 0,
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
  const [isProcessing, setIsProcessing] = useState(false)

  // Memoized form validation state
  const [isFormValid, setIsFormValid] = useState(false)

  // Check form validity on state changes
  useEffect(() => {
    const { customerInfo } = checkoutState

    const isValid = !!(
      customerInfo.fullName?.trim() &&
      customerInfo.email?.trim() &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email || '') &&
      customerInfo.phone?.trim() &&
      validateSriLankanPhone(customerInfo.phone || '') &&
      customerInfo.address?.street?.trim() &&
      customerInfo.address?.city?.trim() &&
      customerInfo.address?.postalCode?.trim() &&
      customerInfo.address?.province?.trim()
    )

    setIsFormValid(isValid)
  }, [checkoutState.customerInfo])

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
    const tax = calculateTax(subtotal)
    const total = subtotal + tax

    setCheckoutState((prev) => ({
      ...prev,
      pricing: {
        subtotal,
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

  const handleWhatsAppOrder = async () => {
    if (!validateForm()) return

    setIsProcessing(true)
    setApiError(null)

    try {
      // Create order first
      const orderResponse = await api.createOrder({
        customer: {
          fullName: checkoutState.customerInfo.fullName!,
          email: checkoutState.customerInfo.email!,
          phone: checkoutState.customerInfo.phone!,
          secondaryPhone: checkoutState.customerInfo.secondaryPhone,
          address: {
            street: checkoutState.customerInfo.address?.street ?? '',
            city: checkoutState.customerInfo.address?.city ?? '',
            postalCode: checkoutState.customerInfo.address?.postalCode ?? '',
            province: checkoutState.customerInfo.address?.province ?? '',
          },
        },
        items: cart.items.map((item) => ({
          id: item.id,
          productId: item.product.id.toString(),
          productName: item.product.title,
          productSku: item.variant?.sku || item.product.sku,
          variantId: item.variant?.id,
          unitPrice: item.variant?.price,
          quantity: item.quantity,
          selectedSize: item.variant?.size,
          selectedColor: item.variant?.color,
          subtotal: item.variant?.price * item.quantity,
        })),
        pricing: checkoutState.pricing,
      })

      if (!orderResponse.success || !orderResponse.data) {
        throw new Error(orderResponse.error || 'Failed to create order')
      }

      // Build order summary from API response only
      const orderSummary: OrderSummary = {
        orderId: orderResponse.data.orderNumber,
        items: cart.items,
        customer: {
          fullName: checkoutState.customerInfo.fullName!,
          email: checkoutState.customerInfo.email!,
          phone: checkoutState.customerInfo.phone!,
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

      // Only call openWhatsAppOrder after order is created and orderId is present
      openWhatsAppOrder(orderSummary)

      // Clear cart and redirect
      clearCart()
      router.push(`/checkout/success?orderId=${orderResponse.data.orderNumber}`)
    } catch (error) {
      console.error('Order creation error:', error)
      setApiError(error instanceof Error ? error.message : 'Failed to create order')
    } finally {
      setIsProcessing(false)
    }
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
    <main className="min-h-screen pt-8 bg-brand-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          {/* Enhanced Header */}
          <motion.div variants={itemVariants} className="mb-8">
            <Link href="/products">
              <Button variant="ghost" size="sm" className="mb-4 hover:bg-white/50 backdrop-blur-sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-gradient-to-br from-brand-secondary to-secondary-600 text-white">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-text-primary">Checkout</h1>
                <p className="text-text-secondary">Review your order and complete your purchase</p>
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
                <Alert className="border-red-200 bg-red-50 backdrop-blur-sm">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">{apiError}</AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Enhanced Left Column - Customer Information */}
            <motion.div variants={itemVariants} className="space-y-6">
              <Card className="bg-brand-surface border-brand-border shadow-2xl">
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
                      <Label
                        htmlFor="fullName"
                        className="text-base font-semibold text-text-primary"
                      >
                        Full Name *
                      </Label>
                      <Input
                        id="fullName"
                        value={checkoutState.customerInfo.fullName || ''}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        required
                        className={`mt-2 h-12 border-2 rounded-xl bg-brand-background text-base ${
                          checkoutState.errors.fullName
                            ? 'border-red-500'
                            : 'border-brand-border focus:border-brand-secondary'
                        }`}
                        placeholder="Enter your full name"
                      />
                      {checkoutState.errors.fullName && (
                        <p className="text-sm text-red-600 mt-2">{checkoutState.errors.fullName}</p>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label
                          htmlFor="email"
                          className="text-base font-semibold text-text-primary"
                        >
                          Email Address *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={checkoutState.customerInfo.email || ''}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          required
                          className={`mt-2 h-12 border-2 rounded-xl bg-brand-background ${
                            checkoutState.errors.email
                              ? 'border-red-500'
                              : 'border-brand-border focus:border-brand-secondary'
                          }`}
                          placeholder="your@email.com"
                        />
                        {checkoutState.errors.email && (
                          <p className="text-sm text-red-600 mt-2">{checkoutState.errors.email}</p>
                        )}
                      </div>

                      <div>
                        <Label
                          htmlFor="phone"
                          className="text-base font-semibold text-text-primary"
                        >
                          Phone Number *
                        </Label>
                        <Input
                          id="phone"
                          value={checkoutState.customerInfo.phone || ''}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          required
                          className={`mt-2 h-12 border-2 rounded-xl bg-brand-background ${
                            checkoutState.errors.phone
                              ? 'border-red-500'
                              : 'border-brand-border focus:border-brand-secondary'
                          }`}
                          placeholder="+94 77 123 4567"
                        />
                        {checkoutState.errors.phone && (
                          <p className="text-sm text-red-600 mt-2">{checkoutState.errors.phone}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label
                        htmlFor="secondaryPhone"
                        className="text-base font-semibold text-text-primary"
                      >
                        Secondary Phone (Optional)
                      </Label>
                      <Input
                        id="secondaryPhone"
                        value={checkoutState.customerInfo.secondaryPhone || ''}
                        onChange={(e) => handleInputChange('secondaryPhone', e.target.value)}
                        className="mt-2 h-12 border-2 border-brand-border focus:border-brand-secondary rounded-xl bg-brand-background"
                        placeholder="+94 71 123 4567"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-brand-surface border-brand-border shadow-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-brand-primary to-primary-600 text-white">
                      <MapPin className="w-5 h-5" />
                    </div>
                    Delivery Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="street" className="text-base font-semibold text-text-primary">
                      Street Address *
                    </Label>
                    <Input
                      id="street"
                      value={checkoutState.customerInfo.address?.street || ''}
                      onChange={(e) => handleInputChange('address.street', e.target.value)}
                      required
                      className={`mt-2 h-12 border-2 rounded-xl bg-brand-background ${
                        checkoutState.errors.street
                          ? 'border-red-500'
                          : 'border-brand-border focus:border-brand-secondary'
                      }`}
                      placeholder="Enter your street address"
                    />
                    {checkoutState.errors.street && (
                      <p className="text-sm text-red-600 mt-2">{checkoutState.errors.street}</p>
                    )}
                  </div>

                  {/* City, Postal Code, Province - Enhanced Search */}
                  <CitySearchComponent
                    value={{
                      city: checkoutState.customerInfo.address?.city || '',
                      postalCode: checkoutState.customerInfo.address?.postalCode || '',
                      province: checkoutState.customerInfo.address?.province || '',
                    }}
                    onChange={({ city, postalCode, province }) => {
                      setCheckoutState((prev) => ({
                        ...prev,
                        customerInfo: {
                          ...prev.customerInfo,
                          address: {
                            ...prev.customerInfo.address,
                            city,
                            postalCode,
                            province,
                          },
                        },
                        errors: {
                          ...prev.errors,
                          city: undefined,
                          postalCode: undefined,
                          province: undefined,
                        },
                      }))
                    }}
                    errors={checkoutState.errors}
                  />

                  <div>
                    <Label
                      htmlFor="specialInstructions"
                      className="text-base font-semibold text-text-primary"
                    >
                      Special Instructions (Optional)
                    </Label>
                    <Textarea
                      id="specialInstructions"
                      value={checkoutState.customerInfo.specialInstructions || ''}
                      onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
                      placeholder="Any special delivery instructions..."
                      rows={3}
                      className="mt-2 border-2 border-brand-border focus:border-brand-secondary rounded-xl bg-brand-background resize-none"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Enhanced Right Column - Order Summary */}
            <motion.div variants={itemVariants} className="space-y-6">
              <Card className="bg-brand-surface border-brand-border shadow-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-brand-accent to-warning text-white">
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
                          className="flex items-center gap-4 pb-4 border-b last:border-b-0 border-brand-border"
                        >
                          <Image
                            width={64}
                            height={64}
                            src={item.product.images[0]?.url || 'https://placehold.co/600x400'}
                            alt={item.product.title}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-text-primary">
                              {item.product.title}
                            </h4>
                            <p className="text-sm text-text-secondary">{item.variant.name}</p>
                            <p className="text-sm text-text-secondary">Qty: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-text-primary">
                              {formatCurrency(itemTotal)}
                            </p>
                            <p className="text-xs text-text-secondary">
                              {formatCurrency(item.variant.price)} each
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-brand-surface border-brand-border shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-text-primary">Pricing Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Subtotal</span>
                      <span className="font-semibold text-text-primary">
                        {formatCurrency(checkoutState.pricing.subtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Tax (15%)</span>
                      <span className="font-semibold text-text-primary">
                        {formatCurrency(checkoutState.pricing.tax)}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-xl font-black">
                      <span className="text-text-primary">Total</span>
                      <span className="text-brand-secondary">
                        {formatCurrency(checkoutState.pricing.total)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-brand-surface border-brand-border shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-text-primary">Payment Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Enhanced Payment Options */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-bold text-text-primary">Payment Options</h3>
                    </div>

                    {/* Payment UX: Only show 'Create Order' button, then show PayHereCheckout after order is created */}
                    <div className="space-y-3">
                      {!checkoutState.orderId ? (
                        <Button
                          variant="default"
                          size="lg"
                          disabled={isProcessing || !isFormValid}
                          className="w-full font-bold border-2 border-white text-white hover:bg-brand-secondary/10 py-4 text-lg rounded-xl flex items-center justify-center"
                          onClick={async () => {
                            if (isProcessing || !isFormValid) return
                            setIsProcessing(true)
                            setApiError(null)
                            try {
                              const orderResponse = await api.createOrder({
                                customer: {
                                  fullName: checkoutState.customerInfo.fullName!,
                                  email: checkoutState.customerInfo.email!,
                                  phone: checkoutState.customerInfo.phone!,
                                  secondaryPhone: checkoutState.customerInfo.secondaryPhone,
                                  address: {
                                    street: checkoutState.customerInfo.address?.street ?? '',
                                    city: checkoutState.customerInfo.address?.city ?? '',
                                    postalCode:
                                      checkoutState.customerInfo.address?.postalCode ?? '',
                                    province: checkoutState.customerInfo.address?.province ?? '',
                                  },
                                },
                                items: cart.items.map((item) => ({
                                  id: item.id,
                                  productId: item.product.id.toString(),
                                  productName: item.product.title,
                                  productSku: item.variant?.sku || item.product.sku,
                                  variantId: item.variant?.id,
                                  unitPrice: item.variant?.price,
                                  quantity: item.quantity,
                                  selectedSize: item.variant?.size,
                                  selectedColor: item.variant?.color,
                                  subtotal: item.variant?.price * item.quantity,
                                })),
                                pricing: checkoutState.pricing,
                              })
                              if (!orderResponse.success || !orderResponse.data) {
                                throw new Error(orderResponse.error || 'Failed to create order')
                              }
                              setCheckoutState((prev) => ({
                                ...prev,
                                orderId: orderResponse.data?.orderNumber ?? '',
                              }))
                            } catch (error) {
                              setApiError(
                                error instanceof Error ? error.message : 'Failed to create order',
                              )
                            } finally {
                              setIsProcessing(false)
                            }
                          }}
                        >
                          {isProcessing ? (
                            <>
                              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                              Creating Order...
                            </>
                          ) : (
                            <>
                              <CreditCard className="w-5 h-5 mr-2" />
                              Create Order
                            </>
                          )}
                        </Button>
                      ) : (
                        <PayHereCheckout
                          orderData={{
                            customer: {
                              fullName: checkoutState.customerInfo.fullName || '',
                              email: checkoutState.customerInfo.email || '',
                              phone: checkoutState.customerInfo.phone || '',
                              secondaryPhone: checkoutState.customerInfo.secondaryPhone,
                              address: {
                                street: checkoutState.customerInfo.address?.street || '',
                                city: checkoutState.customerInfo.address?.city || '',
                                postalCode: checkoutState.customerInfo.address?.postalCode || '',
                                province: checkoutState.customerInfo.address?.province || '',
                              },
                            },
                            items: cart.items.map((item) => ({
                              id: item.id,
                              productId: item.product.id.toString(),
                              productName: item.product.title,
                              productSku: item.variant?.sku || item.product.sku,
                              variantId: item.variant?.id,
                              unitPrice: item.variant?.price,
                              quantity: item.quantity,
                              selectedSize: item.variant?.size,
                              selectedColor: item.variant?.color,
                              subtotal: item.variant?.price * item.quantity,
                            })),
                            pricing: checkoutState.pricing,
                          }}
                          orderId={checkoutState.orderId}
                          totalAmount={checkoutState.pricing.total}
                          onSuccess={(orderId) => {
                            clearCart()
                            router.push(`/checkout/success?orderId=${orderId}`)
                          }}
                          onError={(error) => {
                            setApiError(error)
                          }}
                        />
                      )}

                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t border-brand-border" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-brand-surface px-2 text-text-secondary">Or</span>
                        </div>
                      </div>

                      {/* WhatsApp Order Option */}
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={handleWhatsAppOrder}
                        disabled={isProcessing || !isFormValid}
                        className="w-full font-bold border-2 border-green-600 text-green-600 hover:bg-green-50 py-4 text-lg rounded-xl"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <MessageCircle className="w-5 h-5 mr-2" />
                            Order via WhatsApp
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Security Badge */}
                    <div className="flex items-center justify-center gap-2 text-sm text-text-secondary">
                      <Shield className="w-4 h-4 text-green-600" />
                      <span>Secure payment powered by PayHere</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Trust Badges */}
              <div className="grid grid-cols-1 text-center text-sm">
                {[
                  {
                    icon: Shield,
                    title: 'Secure Process',
                    subtitle: 'Safe & encrypted',
                    color: 'from-green-500 to-emerald-500',
                  },
                ].map((badge) => (
                  <div
                    key={badge.title}
                    className="flex flex-col items-center gap-3 p-6 bg-brand-surface rounded-xl border border-brand-border w-full"
                  >
                    <div className={`p-4 rounded-lg bg-gradient-to-br ${badge.color} text-white`}>
                      <badge.icon className="w-8 h-8" />
                    </div>
                    <div>
                      <div className="font-bold text-text-primary text-lg">{badge.title}</div>
                      <div className="text-text-secondary text-sm">{badge.subtitle}</div>
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
    <main className="min-h-screen pt-8 bg-brand-background">
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <motion.div
          className="bg-brand-surface border-brand-border rounded-2xl p-8 shadow-2xl"
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

          <h1 className="text-3xl font-black mb-4 text-green-600">Order Sent Successfully!</h1>
          <p className="text-text-secondary mb-6 leading-relaxed">
            Your order has been redirected to WhatsApp. We&apos;ll contact you shortly to confirm
            your order and provide payment instructions.
          </p>

          <Alert className="mb-6 bg-blue-50 border-blue-200">
            <AlertCircle className="h-5 w-5 text-blue-600" />
            <AlertDescription className="text-blue-800 text-left">
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

          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 mb-6 border border-blue-200">
            <p className="text-sm font-semibold text-blue-900 mb-2">Order ID</p>
            <p className="text-2xl font-black text-brand-secondary">{orderId || 'Processing...'}</p>
          </div>

          <div className="space-y-4">
            <Button
              asChild
              className="w-full bg-gradient-to-r from-brand-secondary to-secondary-600 hover:from-secondary-600 hover:to-brand-secondary text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Link href="/products">Continue Shopping</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full border-2 border-brand-border text-brand-secondary hover:bg-brand-background font-bold py-4 rounded-xl bg-transparent"
            >
              <Link href={`/orders/track?orderId=${orderId}`}>Track Your Order</Link>
            </Button>
          </div>

          <div className="mt-8 pt-6 border-t border-brand-border text-sm text-text-secondary">
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

function calculateTax(amount: number) {
  return Math.round(amount * SITE_CONFIG.taxRate)
}
