'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import {
  Search,
  Package,
  Truck,
  Check,
  Clock,
  X,
  Phone,
  Mail,
  Calendar,
  ShoppingBag,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Sparkles,
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import type { Order } from '@/types/api'
import { motion, AnimatePresence } from 'framer-motion'
import { SITE_CONFIG } from '@/config/site-config'

const ORDER_STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: Clock,
    description: 'Your order has been received and is being processed.',
  },
  confirmed: {
    label: 'Confirmed',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: Check,
    description: 'Your order has been confirmed and is being prepared.',
  },
  processing: {
    label: 'Processing',
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    icon: Package,
    description: 'Your order is being packed and prepared for shipment.',
  },
  'sent for delivery': {
    label: 'Sent for Delivery',
    color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    icon: Truck,
    description: 'Your order has been sent for delivery and will reach you soon.',
  },
  delivered: {
    label: 'Delivered',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircle,
    description: 'Your order has been successfully delivered.',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: X,
    description: 'Your order has been cancelled.',
  },
  refunded: {
    label: 'Refunded',
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: RefreshCw,
    description: 'Your order has been refunded.',
  },
}

const PAYMENT_STATUS_CONFIG = {
  pending: {
    label: 'Pending Payment',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  },
  'partially-paid': {
    label: 'Partially Paid',
    color: 'bg-orange-100 text-orange-800 border-orange-200',
  },
  paid: {
    label: 'Paid',
    color: 'bg-green-100 text-green-800 border-green-200',
  },
  refunded: {
    label: 'Refunded',
    color: 'bg-gray-100 text-gray-800 border-gray-200',
  },
  failed: {
    label: 'Payment Failed',
    color: 'bg-red-100 text-red-800 border-red-200',
  },
}

export default function OrderTrackingPage() {
  const [orderId, setOrderId] = useState('')
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const searchParams =
    typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null

  // Performance optimization: Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    if (searchParams) {
      const queryOrderId =
        searchParams.get('orderId') || searchParams.get('orderNumber') || searchParams.get('code')
      if (queryOrderId) {
        setOrderId(queryOrderId)
        setTimeout(() => {
          const form = document.querySelector('form')
          if (form) {
            form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
          }
        }, 200)
      }
    }
  }, [])

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!orderId.trim()) {
      toast.error('Please enter an order ID')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `/api/public/orders/track?orderNumber=${encodeURIComponent(orderId.trim())}`,
      )
      const data = await response.json()

      let orderData = null
      if (data.success && data.data) {
        if (typeof data.data.found !== 'undefined' && data.data.order) {
          if (data.data.found && data.data.order) {
            orderData = data.data.order
          }
        } else if (data.data.id && data.data.orderNumber) {
          orderData = data.data
        }
      }

      if (orderData) {
        const convertedOrder: Order = {
          id: orderData.id,
          orderNumber: orderData.orderNumber,
          customerName: orderData.customerName,
          customerEmail: '',
          customerPhone: '',
          deliveryAddress: '',
          orderItems: (orderData.orderItems || []).map((item: any) => ({
            productId: item.productId || '',
            productName: item.productName,
            productSku: item.productSku || '',
            unitPrice: item.unitPrice,
            quantity: item.quantity,
            selectedSize: item.selectedSize,
            selectedColor: item.selectedColor,
            subtotal: item.subtotal,
          })),
          orderSubtotal: orderData.orderTotal,
          shippingCost: 0,
          discount: 0,
          orderTotal: orderData.orderTotal,
          orderStatus: orderData.orderStatus as Order['orderStatus'],
          paymentStatus: orderData.paymentStatus as Order['paymentStatus'],
          paymentMethod: undefined,
          specialInstructions: '',
          createdAt: orderData.createdAt,
          updatedAt: orderData.updatedAt,
        }
        setOrder(convertedOrder)
        setError(null)
        toast.success('Order found!')
      } else {
        const backendMessage = data.data?.message || data.error || 'Order not found'
        setError(backendMessage)
        setOrder(null)
        toast.error(backendMessage)
      }
    } catch (error) {
      console.error('Order tracking error:', error)
      setError('Failed to fetch order details. Please try again.')
      setOrder(null)
      toast.error('Failed to track order')
    } finally {
      setLoading(false)
    }
  }

  const getOrderSteps = (currentStatus: string) => {
    const steps = [
      { status: 'pending', label: 'Order Placed', icon: Clock },
      { status: 'confirmed', label: 'Confirmed', icon: Check },
      { status: 'processing', label: 'Processing', icon: Package },
      { status: 'sent for delivery', label: 'Out for Delivery', icon: Truck },
      { status: 'delivered', label: 'Delivered', icon: CheckCircle },
    ]

    const currentIndex = steps.findIndex((step) => step.status === currentStatus)

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      current: index === currentIndex,
    }))
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
      {/* Enhanced Hero Section */}
      <section className="relative py-16 sm:py-20 overflow-hidden">
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
              ORDER TRACKING
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 leading-tight"
            >
              <span className="text-text-primary">TRACK YOUR</span>
              <span className="block bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">
                ORDER
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed"
            >
              Enter your order ID to check the status and track your shipment in real-time
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Enhanced Order Search Form */}
            <motion.div variants={itemVariants}>
              <Card className="bg-brand-surface border-brand-border shadow-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl font-bold text-text-primary">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-brand-secondary to-secondary-600 text-white">
                      <Search className="w-5 h-5" />
                    </div>
                    Track Your Order
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleTrackOrder} className="space-y-6">
                    <div>
                      <Label
                        htmlFor="orderId"
                        className="text-base font-semibold text-text-primary"
                      >
                        Order ID
                      </Label>
                      <div className="flex gap-3 mt-3">
                        <Input
                          id="orderId"
                          type="text"
                          value={orderId}
                          onChange={(e) => setOrderId(e.target.value)}
                          placeholder="Enter your order ID (e.g., RS-20240101-ABCDE)"
                          className="flex-1 h-12 text-base border-2 border-brand-border focus:border-brand-secondary rounded-xl bg-brand-background"
                          disabled={loading}
                        />
                        <Button
                          type="submit"
                          disabled={loading}
                          className="h-12 px-6 bg-gradient-to-r from-brand-secondary to-secondary-600 hover:from-secondary-600 hover:to-brand-secondary text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          {loading ? (
                            <motion.div
                              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: 'linear',
                              }}
                            />
                          ) : (
                            <Search className="w-5 h-5" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                      <p className="text-sm font-semibold text-blue-900 mb-2">
                        💡 Where to find your Order ID:
                      </p>
                      <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
                        <li>Check your WhatsApp confirmation message</li>
                        <li>Look for emails from Ralhum Sports</li>
                        <li>Check your order confirmation page</li>
                      </ul>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Enhanced Error Display */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert className="border-red-200 bg-red-50 border">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Enhanced Order Details */}
            <AnimatePresence>
              {order && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-8"
                >
                  {/* Order Status Overview */}
                  <Card className="bg-brand-surface border-brand-border shadow-2xl overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-brand-secondary/5 to-brand-primary/5">
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        <CardTitle className="text-2xl font-black text-text-primary">
                          Order {order.orderNumber}
                        </CardTitle>
                        <Badge
                          className={`${ORDER_STATUS_CONFIG[order.orderStatus]?.color || 'bg-gray-100 text-gray-800'} px-4 py-2 text-sm font-bold border`}
                        >
                          {ORDER_STATUS_CONFIG[order.orderStatus]?.label || order.orderStatus}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-8 p-6">
                      {/* Status Description */}
                      <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-200">
                        {React.createElement(
                          ORDER_STATUS_CONFIG[order.orderStatus]?.icon || Clock,
                          {
                            className: 'w-6 h-6 text-blue-600 mt-1 flex-shrink-0',
                          },
                        )}
                        <div>
                          <p className="font-bold text-blue-900 text-lg">
                            {ORDER_STATUS_CONFIG[order.orderStatus]?.label || order.orderStatus}
                          </p>
                          <p className="text-blue-700 mt-1">
                            {ORDER_STATUS_CONFIG[order.orderStatus]?.description ||
                              'Order status updated.'}
                          </p>
                        </div>
                      </div>

                      {/* Enhanced Progress Steps */}
                      <div className="space-y-6">
                        <h3 className="text-xl font-bold text-text-primary">Order Progress</h3>
                        <div className="space-y-4">
                          {getOrderSteps(order.orderStatus).map((step, index) => (
                            <motion.div
                              key={step.status}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1, duration: 0.5 }}
                              className="flex items-center gap-6 p-4 rounded-xl bg-brand-background"
                            >
                              <div
                                className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
                                  step.completed
                                    ? 'bg-gradient-to-br from-brand-secondary to-secondary-600 text-white'
                                    : step.current
                                      ? 'bg-gradient-to-br from-brand-primary to-primary-600 text-white'
                                      : 'bg-gray-200 text-gray-400'
                                }`}
                              >
                                {React.createElement(step.icon, { className: 'w-6 h-6' })}
                              </div>
                              <div className="flex-1">
                                <p
                                  className={`font-bold text-lg ${
                                    step.completed || step.current
                                      ? 'text-text-primary'
                                      : 'text-gray-400'
                                  }`}
                                >
                                  {step.label}
                                </p>
                              </div>
                              {step.completed && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                                >
                                  <CheckCircle className="w-6 h-6 text-green-600" />
                                </motion.div>
                              )}
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Order Dates */}
                      <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-brand-border">
                        <div className="flex items-center gap-3 p-4 bg-brand-background rounded-xl">
                          <Calendar className="w-5 h-5 text-brand-secondary" />
                          <div>
                            <p className="font-semibold text-text-primary">Ordered</p>
                            <p className="text-text-secondary">
                              {new Date(order.createdAt).toLocaleDateString('en-GB')}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Enhanced Order Items */}
                  <Card className="bg-brand-surface border-brand-border shadow-2xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-xl font-bold text-text-primary">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-brand-primary to-primary-600 text-white">
                          <ShoppingBag className="w-5 h-5" />
                        </div>
                        Order Items
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {order.orderItems.map((item, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center gap-6 p-6 bg-brand-background rounded-xl border border-brand-border"
                          >
                            <div className="flex-1">
                              <h4 className="font-bold text-lg text-text-primary">
                                {item.productName}
                              </h4>
                              {item.productSku && (
                                <p className="text-sm text-text-secondary mt-1">
                                  SKU: {item.productSku}
                                </p>
                              )}
                              <div className="flex gap-4 mt-2 text-sm">
                                {item.selectedSize && (
                                  <Badge variant="outline" className="bg-brand-surface">
                                    Size: {item.selectedSize}
                                  </Badge>
                                )}
                                {item.selectedColor && (
                                  <Badge variant="outline" className="bg-brand-surface">
                                    Color: {item.selectedColor}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-lg text-text-primary">
                                Qty: {item.quantity}
                              </p>
                              <p className="text-sm text-text-secondary">
                                {item.unitPrice} LKR each
                              </p>
                              <p className="font-bold text-xl text-brand-secondary">
                                {item.subtotal} LKR
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      <Separator className="my-6" />

                      <div className="space-y-4">
                        <div className="flex justify-between items-center text-2xl font-black">
                          <span className="text-text-primary">Total:</span>
                          <span className="bg-gradient-to-r from-brand-secondary to-secondary-600 bg-clip-text text-transparent">
                            {order.orderTotal} LKR
                          </span>
                        </div>
                      </div>

                      <div className="mt-6 pt-6 border-t border-brand-border">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                            <span className="font-semibold text-blue-900">Payment Status:</span>
                            <Badge
                              className={
                                PAYMENT_STATUS_CONFIG[order.paymentStatus]?.color ||
                                'bg-gray-100 text-gray-800'
                              }
                            >
                              {PAYMENT_STATUS_CONFIG[order.paymentStatus]?.label ||
                                order.paymentStatus}
                            </Badge>
                          </div>
                          {order.paymentMethod && (
                            <div className="flex items-center justify-between p-3 bg-brand-background rounded-lg border border-brand-border">
                              <span className="font-semibold text-text-primary">
                                Payment Method:
                              </span>
                              <span className="text-sm font-bold capitalize text-text-secondary">
                                {order.paymentMethod.replace('-', ' ')}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Enhanced Contact Support */}
                  <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 shadow-2xl">
                    <CardContent className="p-8">
                      <div className="text-center">
                        <h3 className="text-2xl font-black text-blue-900 mb-3">Need Help?</h3>
                        <p className="text-blue-700 mb-6 text-lg">
                          Have questions about your order? Our team is here to help.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                          <Button
                            size="lg"
                            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                            onClick={() => {
                              const message = `Hello! I need help with my order #${order.orderNumber}. Can you please assist me?`
                              const whatsappUrl = `https://wa.me/${SITE_CONFIG.whatsapp.number}?text=${encodeURIComponent(message)}`
                              window.open(whatsappUrl, '_blank')
                            }}
                          >
                            <Phone className="w-5 h-5 mr-2" />
                            WhatsApp Support
                          </Button>
                          <Button
                            variant="outline"
                            size="lg"
                            className="border-2 border-blue-300 text-blue-700 hover:bg-blue-100 font-bold px-8 py-4 rounded-xl bg-transparent"
                            asChild
                          >
                            <Link href="/contact">
                              <Mail className="w-5 h-5 mr-2" />
                              Contact Us
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Enhanced Help Section */}
            {!order && !loading && (
              <motion.div variants={itemVariants}>
                <Card className="bg-brand-surface border-brand-border shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-text-primary">
                      Can&apos;t Find Your Order?
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                      <p className="font-semibold text-yellow-900 mb-3">
                        Double-check your Order ID:
                      </p>
                      <ul className="list-disc list-inside text-yellow-800 space-y-2">
                        <li>
                          Order IDs start with &quot;RS-&quot; followed by numbers and letters
                        </li>
                        <li>Make sure there are no extra spaces</li>
                        <li>Check your WhatsApp messages or email confirmations</li>
                      </ul>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button
                        variant="outline"
                        size="lg"
                        className="flex-1 border-2 border-green-300 text-green-700 hover:bg-green-50 font-bold py-4 rounded-xl bg-transparent"
                        onClick={() => {
                          const message =
                            "Hello! I can't find my order ID. Can you help me track my order?"
                          const whatsappUrl = `https://wa.me/${SITE_CONFIG.whatsapp.number}?text=${encodeURIComponent(message)}`
                          window.open(whatsappUrl, '_blank')
                        }}
                      >
                        <Phone className="w-5 h-5 mr-2" />
                        Get Help via WhatsApp
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        className="flex-1 border-2 border-blue-300 text-blue-700 hover:bg-blue-50 font-bold py-4 rounded-xl bg-transparent"
                        asChild
                      >
                        <Link href="/contact">
                          <Mail className="w-5 h-5 mr-2" />
                          Contact Support
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>
    </main>
  )
}
