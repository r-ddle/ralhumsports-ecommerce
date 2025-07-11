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

const ORDER_STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    icon: Clock,
    description: 'Your order has been received and is being processed.',
  },
  confirmed: {
    label: 'Confirmed',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    icon: Check,
    description: 'Your order has been confirmed and is being prepared.',
  },
  processing: {
    label: 'Processing',
    color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
    icon: Package,
    description: 'Your order is being packed and prepared for shipment.',
  },
  shipped: {
    label: 'Shipped',
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
    icon: Truck,
    description: 'Your order has been shipped and is on its way to you.',
  },
  delivered: {
    label: 'Delivered',
    color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    icon: CheckCircle,
    description: 'Your order has been successfully delivered.',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    icon: X,
    description: 'Your order has been cancelled.',
  },
  refunded: {
    label: 'Refunded',
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
    icon: RefreshCw,
    description: 'Your order has been refunded.',
  },
}

const PAYMENT_STATUS_CONFIG = {
  pending: {
    label: 'Pending Payment',
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
  },
  'partially-paid': {
    label: 'Partially Paid',
    color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
  },
  paid: {
    label: 'Paid',
    color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  },
  refunded: {
    label: 'Refunded',
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
  },
  failed: {
    label: 'Payment Failed',
    color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
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
          shipping: {
            trackingNumber: orderData.shipping?.trackingNumber || undefined,
            courier: orderData.shipping?.courier || undefined,
            estimatedDelivery: orderData.shipping?.estimatedDelivery || undefined,
            actualDelivery: orderData.shipping?.actualDelivery || undefined,
          },
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
      { status: 'shipped', label: 'Shipped', icon: Truck },
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
    <main className="min-h-screen pt-16 bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Enhanced Hero Section with Glassmorphism */}
      <section className="relative py-16 sm:py-20 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-1/4 left-1/6 w-72 h-72 bg-gradient-to-br from-blue-500/20 to-cyan-400/20 rounded-full blur-3xl"
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
            className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-br from-emerald-500/15 to-teal-400/15 rounded-full blur-3xl"
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
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm mb-6 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 shadow-lg backdrop-blur-sm border border-yellow-300/30"
            >
              <Sparkles className="w-4 h-4" />
              ORDER TRACKING
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 leading-tight"
            >
              <span className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 dark:from-white dark:via-blue-200 dark:to-white bg-clip-text text-transparent">
                TRACK YOUR
              </span>
              <span className="block bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                ORDER
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed"
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
              <Card className="backdrop-blur-lg bg-white/80 dark:bg-gray-800/80 border border-white/20 shadow-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl font-bold">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                      <Search className="w-5 h-5" />
                    </div>
                    Track Your Order
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleTrackOrder} className="space-y-6">
                    <div>
                      <Label htmlFor="orderId" className="text-base font-semibold">
                        Order ID
                      </Label>
                      <div className="flex gap-3 mt-3">
                        <Input
                          id="orderId"
                          type="text"
                          value={orderId}
                          onChange={(e) => setOrderId(e.target.value)}
                          placeholder="Enter your order ID (e.g., RS-20240101-ABCDE)"
                          className="flex-1 h-12 text-base border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm"
                          disabled={loading}
                        />
                        <Button
                          type="submit"
                          disabled={loading}
                          className="h-12 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
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

                    <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200/50 dark:border-blue-700/50">
                      <p className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">
                        💡 Where to find your Order ID:
                      </p>
                      <ul className="list-disc list-inside text-sm text-blue-800 dark:text-blue-300 space-y-1">
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
                  <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800 dark:text-red-200">
                      {error}
                    </AlertDescription>
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
                  <Card className="backdrop-blur-lg bg-white/80 dark:bg-gray-800/80 border border-white/20 shadow-2xl overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 dark:from-blue-400/10 dark:to-purple-400/10">
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        <CardTitle className="text-2xl font-black">
                          Order {order.orderNumber}
                        </CardTitle>
                        <Badge
                          className={`${ORDER_STATUS_CONFIG[order.orderStatus]?.color || 'bg-gray-100 text-gray-800'} px-4 py-2 text-sm font-bold`}
                        >
                          {ORDER_STATUS_CONFIG[order.orderStatus]?.label || order.orderStatus}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-8 p-6">
                      {/* Status Description */}
                      <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl border border-blue-200/50 dark:border-blue-700/50">
                        {React.createElement(
                          ORDER_STATUS_CONFIG[order.orderStatus]?.icon || Clock,
                          {
                            className:
                              'w-6 h-6 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0',
                          },
                        )}
                        <div>
                          <p className="font-bold text-blue-900 dark:text-blue-200 text-lg">
                            {ORDER_STATUS_CONFIG[order.orderStatus]?.label || order.orderStatus}
                          </p>
                          <p className="text-blue-700 dark:text-blue-300 mt-1">
                            {ORDER_STATUS_CONFIG[order.orderStatus]?.description ||
                              'Order status updated.'}
                          </p>
                        </div>
                      </div>

                      {/* Enhanced Progress Steps */}
                      <div className="space-y-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          Order Progress
                        </h3>
                        <div className="space-y-4">
                          {getOrderSteps(order.orderStatus).map((step, index) => (
                            <motion.div
                              key={step.status}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1, duration: 0.5 }}
                              className="flex items-center gap-6 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700"
                            >
                              <div
                                className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
                                  step.completed
                                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                                    : step.current
                                      ? 'bg-gradient-to-br from-orange-500 to-red-500 text-white'
                                      : 'bg-gray-200 dark:bg-gray-600 text-gray-400'
                                }`}
                              >
                                {React.createElement(step.icon, { className: 'w-6 h-6' })}
                              </div>
                              <div className="flex-1">
                                <p
                                  className={`font-bold text-lg ${
                                    step.completed || step.current
                                      ? 'text-gray-900 dark:text-white'
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
                      <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl">
                          <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">Ordered</p>
                            <p className="text-gray-600 dark:text-gray-300">
                              {new Date(order.createdAt).toLocaleDateString('en-GB')}
                            </p>
                          </div>
                        </div>
                        {order.shipping?.estimatedDelivery && (
                          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl">
                            <Truck className="w-5 h-5 text-green-600 dark:text-green-400" />
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">
                                Expected Delivery
                              </p>
                              <p className="text-gray-600 dark:text-gray-300">
                                {new Date(order.shipping.estimatedDelivery).toLocaleDateString(
                                  'en-GB',
                                )}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Enhanced Shipping Information */}
                  {order.shipping && (order.shipping.trackingNumber || order.shipping.courier) && (
                    <Card className="backdrop-blur-lg bg-white/80 dark:bg-gray-800/80 border border-white/20 shadow-2xl">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-xl font-bold">
                          <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 text-white">
                            <Truck className="w-5 h-5" />
                          </div>
                          Shipping Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {order.shipping.courier && (
                          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl">
                            <span className="font-semibold text-green-900 dark:text-green-200">
                              Courier:
                            </span>
                            <span className="font-bold text-green-800 dark:text-green-300">
                              {order.shipping.courier}
                            </span>
                          </div>
                        )}
                        {order.shipping.trackingNumber && (
                          <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-semibold text-blue-900 dark:text-blue-200">
                                Tracking Number:
                              </span>
                            </div>
                            <code className="block w-full p-3 bg-white dark:bg-gray-800 rounded-lg text-center font-mono text-lg font-bold border-2 border-dashed border-blue-300 dark:border-blue-600">
                              {order.shipping.trackingNumber}
                            </code>
                          </div>
                        )}
                        {order.shipping.actualDelivery && (
                          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl border border-green-300 dark:border-green-700">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                            <div>
                              <p className="font-bold text-green-800 dark:text-green-200">
                                Delivered!
                              </p>
                              <p className="text-green-700 dark:text-green-300">
                                {new Date(order.shipping.actualDelivery).toLocaleDateString(
                                  'en-GB',
                                )}
                              </p>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Enhanced Order Items */}
                  <Card className="backdrop-blur-lg bg-white/80 dark:bg-gray-800/80 border border-white/20 shadow-2xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-xl font-bold">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white">
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
                            className="flex items-center gap-6 p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl border border-gray-200 dark:border-gray-600"
                          >
                            <div className="flex-1">
                              <h4 className="font-bold text-lg text-gray-900 dark:text-white">
                                {item.productName}
                              </h4>
                              {item.productSku && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                  SKU: {item.productSku}
                                </p>
                              )}
                              <div className="flex gap-4 mt-2 text-sm">
                                {item.selectedSize && (
                                  <Badge variant="outline" className="bg-white dark:bg-gray-700">
                                    Size: {item.selectedSize}
                                  </Badge>
                                )}
                                {item.selectedColor && (
                                  <Badge variant="outline" className="bg-white dark:bg-gray-700">
                                    Color: {item.selectedColor}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-lg text-gray-900 dark:text-white">
                                Qty: {item.quantity}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {item.unitPrice} LKR each
                              </p>
                              <p className="font-bold text-xl text-blue-600 dark:text-blue-400">
                                {item.subtotal} LKR
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      <Separator className="my-6" />

                      <div className="space-y-4">
                        <div className="flex justify-between items-center text-2xl font-black">
                          <span className="text-gray-900 dark:text-white">Total:</span>
                          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            {order.orderTotal} LKR
                          </span>
                        </div>
                      </div>

                      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg">
                            <span className="font-semibold text-blue-900 dark:text-blue-200">
                              Payment Status:
                            </span>
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
                            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg">
                              <span className="font-semibold text-gray-900 dark:text-white">
                                Payment Method:
                              </span>
                              <span className="text-sm font-bold capitalize text-gray-700 dark:text-gray-300">
                                {order.paymentMethod.replace('-', ' ')}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Enhanced Contact Support */}
                  <Card className="backdrop-blur-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200/50 dark:border-blue-700/50 shadow-2xl">
                    <CardContent className="p-8">
                      <div className="text-center">
                        <h3 className="text-2xl font-black text-blue-900 dark:text-blue-200 mb-3">
                          Need Help?
                        </h3>
                        <p className="text-blue-700 dark:text-blue-300 mb-6 text-lg">
                          Have questions about your order? Our team is here to help.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                          <Button
                            size="lg"
                            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                            onClick={() => {
                              const message = `Hello! I need help with my order #${order.orderNumber}. Can you please assist me?`
                              const whatsappUrl = `https://wa.me/94772350712?text=${encodeURIComponent(message)}`
                              window.open(whatsappUrl, '_blank')
                            }}
                          >
                            <Phone className="w-5 h-5 mr-2" />
                            WhatsApp Support
                          </Button>
                          <Button
                            variant="outline"
                            size="lg"
                            className="border-2 border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 font-bold px-8 py-4 rounded-xl bg-transparent"
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
                <Card className="backdrop-blur-lg bg-white/80 dark:bg-gray-800/80 border border-white/20 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold">Can&apos;t Find Your Order?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl border border-yellow-200/50 dark:border-yellow-700/50">
                      <p className="font-semibold text-yellow-900 dark:text-yellow-200 mb-3">
                        Double-check your Order ID:
                      </p>
                      <ul className="list-disc list-inside text-yellow-800 dark:text-yellow-300 space-y-2">
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
                        className="flex-1 border-2 border-green-300 dark:border-green-600 text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 font-bold py-4 rounded-xl bg-transparent"
                        onClick={() => {
                          const message =
                            "Hello! I can't find my order ID. Can you help me track my order?"
                          const whatsappUrl = `https://wa.me/94772350712?text=${encodeURIComponent(message)}`
                          window.open(whatsappUrl, '_blank')
                        }}
                      >
                        <Phone className="w-5 h-5 mr-2" />
                        Get Help via WhatsApp
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        className="flex-1 border-2 border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-bold py-4 rounded-xl bg-transparent"
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
