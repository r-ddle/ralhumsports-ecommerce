'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/hooks/use-cart'
import { useOrders } from '@/hooks/use-orders'
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
import { ScrollArea } from '@/components/ui/scroll-area'
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
  Minus,
  Plus,
  Trash2,
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
import { PayHereCheckout } from '@/components/payherecheckout'
import {
  getOrCreateCustomerId,
  updateCustomerInfo,
  storeOrderWithCustomerId,
  findPendingOrderForCart,
  getCustomerInfo,
  clearPendingOrders,
} from '@/lib/customer-id'
import {
  validateCheckoutForm,
  getButtonDisabledReason,
  type ValidationError,
  formatPhoneNumber,
} from '@/lib/form-validation'
import {
  getCitySuggestions,
  getProvinceForCity,
  isValidSriLankanCity,
  getAllProvinces,
} from '@/lib/sri-lanka-locations'

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, clearCart, updateQuantity, removeItem, addItem } = useCart()
  const { refreshOrders } = useOrders()
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  const [checkoutState, setCheckoutState] = useState<CheckoutState>({
    step: 'review',
    customerInfo: {},
    pricing: {
      subtotal: 0,
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
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false)
  const [orderCreationInProgress, setOrderCreationInProgress] = useState(false)

  // Enhanced form validation state
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])
  const [citySuggestions, setCitySuggestions] = useState<string[]>([])
  const [isFormValid, setIsFormValid] = useState(false)

  // Enhanced form validation
  const validateForm = () => {
    const validation = validateCheckoutForm({
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
    })

    setFormErrors(validation.fieldErrors)
    setValidationErrors(validation.errors)
    setIsFormValid(validation.isValid)

    // Auto-update province if city is valid and province is wrong
    if (
      validation.suggestedProvince &&
      validation.suggestedProvince !== checkoutState.customerInfo.address?.province
    ) {
      setCheckoutState((prev) => ({
        ...prev,
        customerInfo: {
          ...prev.customerInfo,
          address: {
            ...prev.customerInfo.address,
            province: validation.suggestedProvince!,
          },
        },
      }))
    }

    return validation.isValid
  }

  // Validate on form changes
  useEffect(() => {
    validateForm()
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
    const total = subtotal

    setCheckoutState((prev) => ({
      ...prev,
      pricing: {
        subtotal,
        total,
        currency: 'LKR',
      },
    }))
  }, [cart.items])

  // Redirect if cart is empty (but not during payment processing)
  useEffect(() => {
    if (cart.items.length === 0 && !showConfirmation && !isPaymentProcessing) {
      router.push('/products')
    }
  }, [cart.items.length, showConfirmation, isPaymentProcessing, router])

  // Check for existing pending orders on mount and when cart changes
  useEffect(() => {
    if (cart.items.length === 0) return

    const pendingOrderId = findPendingOrderForCart(cart.items)

    if (pendingOrderId) {
      console.log('[Checkout] Found existing pending order:', pendingOrderId)

      // Get customer info from localStorage to pre-fill form
      const customerInfo = getCustomerInfo()

      if (customerInfo) {
        // Pre-populate form with existing customer info
        setCheckoutState((prev) => ({
          ...prev,
          orderId: pendingOrderId,
          customerInfo: {
            fullName: customerInfo.fullName || '',
            email: customerInfo.email || '',
            phone: customerInfo.phone || '',
            // Try to get address from stored customer info
            address: {
              street: '', // Will need to be filled if not stored
              city: '',
              postalCode: '',
              province: '',
            },
            specialInstructions: '',
          },
        }))

        // Show success message to user
        toast.success('Resuming your previous order', {
          description: `Order ${pendingOrderId} is ready for payment`,
          duration: 4000,
        })
      }
    }
  }, [cart.items])

  const validateFormLegacy = (): boolean => {
    // This function is kept for compatibility but will use the new validation
    return validateForm()
  }

  const handleWhatsAppOrder = async () => {
    if (isProcessing || orderCreationInProgress) return

    setIsProcessing(true)

    try {
      const result = await createOrder()

      if (!result.success) {
        setApiError(result.error || 'Failed to create order')
        return
      }

      // Refresh orders in sidebar to show the new order
      try {
        await refreshOrders(true) // Silent refresh - no toast
        console.log('[Checkout] Orders refreshed after successful order creation')
      } catch (refreshError) {
        console.warn('[Checkout] Failed to refresh orders:', refreshError)
        // Don't fail the entire flow if refresh fails
      }

      // Build order summary for WhatsApp
      const orderSummary: OrderSummary = {
        orderId: result.orderNumber!,
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

      // Clear cart and pending orders, then redirect
      clearPendingOrders() // Clear pending orders on successful WhatsApp order
      clearCart()
      // Refresh orders to update the count
      refreshOrders()
      router.push(`/checkout/success?orderId=${result.orderNumber}`)
    } catch (error) {
      console.error('WhatsApp order error:', error)
      setApiError(error instanceof Error ? error.message : 'Failed to create order')
    } finally {
      setIsProcessing(false)
    }
  }

  // Shared order creation function to prevent duplicates
  const createOrder = async (): Promise<{
    success: boolean
    orderNumber?: string
    error?: string
  }> => {
    if (orderCreationInProgress) {
      console.log('Order creation already in progress, skipping...')
      return { success: false, error: 'Order creation already in progress' }
    }

    if (!validateFormLegacy()) {
      return { success: false, error: 'Please fill in all required fields correctly' }
    }

    setOrderCreationInProgress(true)
    setApiError(null)

    try {
      // Get or create customer ID
      const customerId = getOrCreateCustomerId()

      // Update customer info in localStorage
      updateCustomerInfo({
        email: checkoutState.customerInfo.email,
        phone: checkoutState.customerInfo.phone,
        fullName: checkoutState.customerInfo.fullName,
        lastOrderAt: new Date().toISOString(),
      })

      const orderResponse = await api.createOrder({
        customerId, // Add customer ID to order
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

      // Store the PayloadCMS customer ID returned from the API
      if (orderResponse.data.customerId) {
        // Store PayloadCMS customer ID for future order operations
        localStorage.setItem('ralhum-payload-customer-id', orderResponse.data.customerId.toString())
        console.log('[Checkout] Stored PayloadCMS customer ID:', orderResponse.data.customerId)
      }

      // Build order summary from API response
      const orderSummary = {
        orderId: orderResponse.data.orderNumber,
        customerId,
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

      // Store order with customer ID using the new system
      storeOrderWithCustomerId({
        ...orderSummary,
        customerEmail: checkoutState.customerInfo.email,
        customerPhone: checkoutState.customerInfo.phone,
      })

      // Update checkout state with order ID
      setCheckoutState((prev) => ({
        ...prev,
        orderId: orderResponse.data?.orderNumber ?? '',
      }))

      return { success: true, orderNumber: orderResponse.data.orderNumber }
    } catch (error) {
      console.error('Order creation error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to create order'
      setApiError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setOrderCreationInProgress(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setApiError(null)

    // Handle city input with suggestions and province auto-update
    if (field === 'address.city') {
      // Generate city suggestions
      const suggestions = getCitySuggestions(value, 5)
      setCitySuggestions(suggestions)

      // Auto-update province if valid city is entered
      if (value.trim() && isValidSriLankanCity(value)) {
        const suggestedProvince = getProvinceForCity(value)
        if (suggestedProvince) {
          setCheckoutState((prev) => ({
            ...prev,
            customerInfo: {
              ...prev.customerInfo,
              address: {
                ...prev.customerInfo.address,
                city: value,
                province: suggestedProvince,
              },
            },
          }))

          // Clear any province error
          if (formErrors.province) {
            setFormErrors((prev) => {
              const newErrors = { ...prev }
              delete newErrors.province
              return newErrors
            })
          }

          return
        }
      }
    }

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
    }))

    // Clear error for this field when user starts typing
    const fieldName = field.includes('.') ? field.split('.')[1] : field
    if (formErrors[fieldName]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[fieldName]
        return newErrors
      })
    }

    // Re-validate form after a short delay
    setTimeout(() => validateForm(), 200)
  }

  // Enhanced cart management handlers for checkout
  const handleQuantityUpdate = (itemId: string, newQuantity: number) => {
    updateQuantity(itemId, newQuantity)
  }

  const handleRemoveItem = (itemId: string) => {
    removeItem(itemId)
    // Show success message
    toast.success('Item removed from cart')
  }

  const handleVariantChange = (itemId: string, newVariantId: string) => {
    const item = cart.items.find((i) => i.id === itemId)
    if (!item) return

    const newVariant = item.product.variants.find((v) => v.id === newVariantId)
    if (!newVariant) return

    // Remove old item and add new one with same quantity
    removeItem(itemId)

    // Add the new variant
    addItem(item.product, newVariant, item.quantity)
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
    <main className="min-h-screen pt-16 bg-brand-background">
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
                          formErrors.fullName
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-brand-border focus:border-brand-secondary'
                        }`}
                        placeholder="Enter your full name"
                      />
                      {formErrors.fullName && (
                        <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {formErrors.fullName}
                        </p>
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
                            formErrors.email
                              ? 'border-red-500 focus:border-red-500'
                              : 'border-brand-border focus:border-brand-secondary'
                          }`}
                          placeholder="your@email.com"
                        />
                        {formErrors.email && (
                          <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {formErrors.email}
                          </p>
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
                            formErrors.phone
                              ? 'border-red-500 focus:border-red-500'
                              : 'border-brand-border focus:border-brand-secondary'
                          }`}
                          placeholder="+94 77 123 4567"
                        />
                        {formErrors.phone && (
                          <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {formErrors.phone}
                          </p>
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
                        className={`mt-2 h-12 border-2 rounded-xl bg-brand-background ${
                          formErrors.secondaryPhone
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-brand-border focus:border-brand-secondary'
                        }`}
                        placeholder="+94 71 123 4567"
                      />
                      {formErrors.secondaryPhone && (
                        <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {formErrors.secondaryPhone}
                        </p>
                      )}
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
                        formErrors.street
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-brand-border focus:border-brand-secondary'
                      }`}
                      placeholder="Enter your street address"
                    />
                    {formErrors.street && (
                      <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {formErrors.street}
                      </p>
                    )}
                  </div>

                  {/* City, Postal Code, Province - Simple Inputs */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="city" className="text-base font-semibold text-text-primary">
                        City *
                      </Label>
                      <div className="relative">
                        <Input
                          id="city"
                          value={checkoutState.customerInfo.address?.city || ''}
                          onChange={(e) => handleInputChange('address.city', e.target.value)}
                          required
                          className={`mt-2 h-12 border-2 rounded-xl bg-brand-background ${
                            formErrors.city
                              ? 'border-red-500 focus:border-red-500'
                              : 'border-brand-border focus:border-brand-secondary'
                          }`}
                          placeholder="Enter your city (e.g., Colombo, Kandy)"
                          autoComplete="address-level2"
                        />

                        {/* City Suggestions Dropdown */}
                        {citySuggestions.length > 0 && checkoutState.customerInfo.address?.city && (
                          <div className="absolute top-full left-0 right-0 z-20 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto">
                            {citySuggestions.map((suggestion, index) => (
                              <button
                                key={index}
                                type="button"
                                className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none text-sm"
                                onClick={() => {
                                  handleInputChange('address.city', suggestion)
                                  setCitySuggestions([])
                                }}
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {formErrors.city && (
                        <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {formErrors.city}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label
                        htmlFor="postalCode"
                        className="text-base font-semibold text-text-primary"
                      >
                        Postal Code *
                      </Label>
                      <Input
                        id="postalCode"
                        value={checkoutState.customerInfo.address?.postalCode || ''}
                        onChange={(e) => handleInputChange('address.postalCode', e.target.value)}
                        required
                        className={`mt-2 h-12 border-2 rounded-xl bg-brand-background ${
                          formErrors.postalCode
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-brand-border focus:border-brand-secondary'
                        }`}
                        placeholder="10400"
                        maxLength={5}
                        pattern="[0-9]{5}"
                        autoComplete="postal-code"
                      />
                      {formErrors.postalCode && (
                        <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {formErrors.postalCode}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="province" className="text-base font-semibold text-text-primary">
                      Province *
                    </Label>
                    <Select
                      value={checkoutState.customerInfo.address?.province || ''}
                      onValueChange={(value) => handleInputChange('address.province', value)}
                    >
                      <SelectTrigger
                        className={`mt-2 h-12 border-2 rounded-xl bg-brand-background ${
                          formErrors.province
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-brand-border focus:border-brand-secondary'
                        }`}
                      >
                        <SelectValue placeholder="Select your province (will auto-update from city)" />
                      </SelectTrigger>
                      <SelectContent>
                        {getAllProvinces().map((province) => (
                          <SelectItem key={province.id} value={province.name}>
                            {province.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formErrors.province && (
                      <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {formErrors.province}
                      </p>
                    )}
                  </div>

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
                    Order Summary ({cart.items.length} item{cart.items.length !== 1 ? 's' : ''})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Scrollable container for more than 3 items */}
                  <div
                    className={cart.items.length > 3 ? 'max-h-[400px] overflow-y-auto pr-2' : ''}
                  >
                    <div className="space-y-4">
                      {cart.items.map((item, index) => {
                        const itemTotal = item.variant.price * item.quantity
                        const isLowStock = (item.variant.inventory || 0) <= 5
                        const isOutOfStock = (item.variant.inventory || 0) === 0
                        const maxQuantity = Math.min(10, item.variant.inventory || 0)
                        const hasMultipleVariants = item.product.variants.length > 1

                        return (
                          <div
                            key={item.id}
                            className={`p-4 bg-brand-background rounded-xl border border-brand-border hover:shadow-sm transition-all duration-200 ${
                              isOutOfStock ? 'opacity-60' : ''
                            }`}
                          >
                            {/* Product Header */}
                            <div className="flex items-start gap-4 mb-3">
                              <div className="relative flex-shrink-0">
                                <Image
                                  width={80}
                                  height={80}
                                  src={
                                    item.product.images[0]?.url || 'https://placehold.co/600x400'
                                  }
                                  alt={item.product.title}
                                  className="w-20 h-20 object-cover rounded-lg shadow-sm"
                                />
                                {isOutOfStock && (
                                  <div className="absolute inset-0 bg-gray-900/60 rounded-lg flex items-center justify-center backdrop-blur-sm">
                                    <span className="text-white text-xs font-bold">
                                      OUT OF STOCK
                                    </span>
                                  </div>
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-text-primary line-clamp-2 mb-1">
                                  {item.product.title}
                                </h4>
                                <div className="flex items-center gap-2 flex-wrap mb-2">
                                  <p className="text-xs text-brand-secondary font-medium">
                                    {item.product.brand?.name}
                                  </p>
                                  <Badge
                                    variant="secondary"
                                    className="text-xs px-2 py-0.5 bg-gray-100 text-text-secondary"
                                  >
                                    {item.variant.name}
                                  </Badge>
                                </div>

                                {/* Variant Options Display */}
                                {item.variant.options &&
                                  Object.keys(item.variant.options).length > 0 && (
                                    <div className="flex flex-wrap gap-1 mb-2">
                                      {Object.entries(item.variant.options).map(([key, value]) => (
                                        <Badge
                                          key={key}
                                          variant="outline"
                                          className="text-xs px-2 py-0.5 border-brand-border"
                                        >
                                          {key}: {value}
                                        </Badge>
                                      ))}
                                    </div>
                                  )}

                                {/* Stock Warning */}
                                {isLowStock && !isOutOfStock && (
                                  <div className="flex items-center gap-1 mb-2 p-2 bg-orange-50 rounded-lg border border-orange-200">
                                    <AlertCircle className="w-3 h-3 text-orange-500 flex-shrink-0" />
                                    <span className="text-xs text-orange-600 font-medium">
                                      Only {item.variant.inventory || 0} left in stock
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Remove Button */}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg flex-shrink-0"
                                onClick={() => handleRemoveItem(item.id)}
                                aria-label="Remove item from cart"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>

                            {/* Variant Selection (if multiple variants available) */}
                            {hasMultipleVariants && (
                              <div className="mb-3">
                                <Label className="text-sm font-medium text-text-primary mb-2 block">
                                  Select Variant:
                                </Label>
                                <Select
                                  value={item.variant.id}
                                  onValueChange={(newVariantId) =>
                                    handleVariantChange(item.id, newVariantId)
                                  }
                                >
                                  <SelectTrigger className="h-9 border-brand-border bg-brand-surface">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {item.product.variants.map((variant) => (
                                      <SelectItem
                                        key={variant.id}
                                        value={variant.id}
                                        disabled={variant.inventory === 0}
                                      >
                                        <div className="flex items-center justify-between w-full">
                                          <span>{variant.name}</span>
                                          <div className="flex items-center gap-2 ml-2">
                                            <span className="text-sm font-medium">
                                              {formatCurrency(variant.price)}
                                            </span>
                                            {variant.inventory === 0 ? (
                                              <Badge variant="destructive" className="text-xs">
                                                Out of Stock
                                              </Badge>
                                            ) : variant.inventory <= 5 ? (
                                              <Badge
                                                variant="secondary"
                                                className="text-xs bg-orange-100 text-orange-700"
                                              >
                                                {variant.inventory} left
                                              </Badge>
                                            ) : null}
                                          </div>
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            )}

                            {/* Quantity Controls and Price */}
                            <div className="flex items-center justify-between">
                              <div className="flex flex-col">
                                <span className="font-bold text-text-primary">
                                  {formatCurrency(itemTotal)}
                                </span>
                                {item.quantity > 1 && (
                                  <span className="text-xs text-text-secondary">
                                    {formatCurrency(item.variant.price)} each
                                  </span>
                                )}
                              </div>

                              {/* Quantity Controls */}
                              <div className="flex items-center border border-brand-border rounded-lg bg-brand-surface">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 hover:bg-gray-100 rounded-l-lg"
                                  onClick={() => handleQuantityUpdate(item.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                  aria-label="Decrease quantity"
                                >
                                  <Minus className="w-3 h-3" />
                                </Button>

                                <span className="w-8 text-center text-sm font-medium">
                                  {item.quantity}
                                </span>

                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 hover:bg-gray-100 rounded-r-lg"
                                  onClick={() => handleQuantityUpdate(item.id, item.quantity + 1)}
                                  disabled={item.quantity >= maxQuantity || isOutOfStock}
                                  aria-label="Increase quantity"
                                >
                                  <Plus className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>

                            {/* Compare at Price */}
                            {item.variant.compareAtPrice &&
                              item.variant.compareAtPrice > (item.variant.price || 0) && (
                                <div className="mt-2 flex items-center gap-2 flex-wrap">
                                  <span className="text-xs text-text-secondary line-through">
                                    Was{' '}
                                    {formatCurrency(
                                      (item.variant.compareAtPrice || 0) * item.quantity,
                                    )}
                                  </span>
                                  <Badge
                                    variant="secondary"
                                    className="bg-brand-primary text-white text-xs"
                                  >
                                    SAVE{' '}
                                    {formatCurrency(
                                      ((item.variant.compareAtPrice || 0) -
                                        (item.variant.price || 0)) *
                                        item.quantity,
                                    )}
                                  </Badge>
                                </div>
                              )}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Continue Shopping Link - show when items exist */}
                  {cart.items.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-brand-border">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-brand-secondary hover:bg-brand-secondary/5"
                        asChild
                      >
                        <Link href="/products">
                          <Package className="w-4 h-4 mr-2" />
                          Continue Shopping
                        </Link>
                      </Button>
                    </div>
                  )}
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
                        <div>
                          <Button
                            variant="default"
                            size="lg"
                            disabled={isProcessing || !isFormValid}
                            className={`w-full font-bold py-4 text-lg rounded-xl flex items-center justify-center ${
                              !isFormValid
                                ? 'bg-gray-400 cursor-not-allowed opacity-60 text-white'
                                : 'border-2 border-white text-white hover:bg-brand-secondary/10'
                            }`}
                            onClick={async () => {
                              if (isProcessing || !isFormValid || orderCreationInProgress) return
                              setIsProcessing(true)

                              try {
                                const result = await createOrder()
                                if (!result.success) {
                                  setApiError(result.error || 'Failed to create order')
                                } else {
                                  // Refresh orders in sidebar to show the new order
                                  try {
                                    await refreshOrders(true) // Silent refresh - no toast
                                    console.log(
                                      '[Checkout] Orders refreshed after successful order creation',
                                    )
                                  } catch (refreshError) {
                                    console.warn(
                                      '[Checkout] Failed to refresh orders:',
                                      refreshError,
                                    )
                                    // Don't fail the entire flow if refresh fails
                                  }
                                }
                                // Order ID will be set by createOrder function
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
                          {!isFormValid && (
                            <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" />
                              {getButtonDisabledReason(validationErrors) ||
                                'Please fill all required fields correctly'}
                            </p>
                          )}
                        </div>
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
                          onPaymentStart={() => {
                            setIsPaymentProcessing(true)
                          }}
                          onSuccess={(orderId) => {
                            setIsPaymentProcessing(false)
                            clearPendingOrders() // Clear pending orders on successful payment
                            clearCart()
                            // Refresh orders to update the count
                            refreshOrders()
                            router.push(`/checkout/success?orderId=${orderId}`)
                          }}
                          onError={(error) => {
                            setIsPaymentProcessing(false)
                            setApiError(error)
                          }}
                          onDismiss={() => {
                            setIsPaymentProcessing(false)
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
                      <div>
                        <Button
                          variant="outline"
                          size="lg"
                          onClick={handleWhatsAppOrder}
                          disabled={isProcessing || !isFormValid}
                          className={`w-full font-bold py-4 text-lg rounded-xl ${
                            !isFormValid
                              ? 'bg-gray-100 border-2 border-gray-300 text-gray-400 cursor-not-allowed opacity-60'
                              : 'border-2 border-green-600 text-green-600 hover:bg-green-50'
                          }`}
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
                        {!isFormValid && (
                          <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {getButtonDisabledReason(validationErrors) ||
                              'Please fill all required fields correctly'}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
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

