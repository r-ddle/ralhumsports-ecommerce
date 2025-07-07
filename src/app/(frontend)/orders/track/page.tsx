'use client'

import React, { useState } from 'react'
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
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import { Order } from '@/types/api'

const ORDER_STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    color: 'bg-yellow-100 text-yellow-800',
    icon: Clock,
    description: 'Your order has been received and is being processed.',
  },
  confirmed: {
    label: 'Confirmed',
    color: 'bg-blue-100 text-blue-800',
    icon: Check,
    description: 'Your order has been confirmed and is being prepared.',
  },
  processing: {
    label: 'Processing',
    color: 'bg-orange-100 text-orange-800',
    icon: Package,
    description: 'Your order is being packed and prepared for shipment.',
  },
  shipped: {
    label: 'Shipped',
    color: 'bg-purple-100 text-purple-800',
    icon: Truck,
    description: 'Your order has been shipped and is on its way to you.',
  },
  delivered: {
    label: 'Delivered',
    color: 'bg-green-100 text-green-800',
    icon: CheckCircle,
    description: 'Your order has been successfully delivered.',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-red-100 text-red-800',
    icon: X,
    description: 'Your order has been cancelled.',
  },
  refunded: {
    label: 'Refunded',
    color: 'bg-gray-100 text-gray-800',
    icon: RefreshCw,
    description: 'Your order has been refunded.',
  },
}

const PAYMENT_STATUS_CONFIG = {
  pending: { label: 'Pending Payment', color: 'bg-yellow-100 text-yellow-800' },
  'partially-paid': { label: 'Partially Paid', color: 'bg-orange-100 text-orange-800' },
  paid: { label: 'Paid', color: 'bg-green-100 text-green-800' },
  refunded: { label: 'Refunded', color: 'bg-gray-100 text-gray-800' },
  failed: { label: 'Payment Failed', color: 'bg-red-100 text-red-800' },
}

export default function OrderTrackingPage() {
  const [orderId, setOrderId] = useState('')
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!orderId.trim()) {
      toast.error('Please enter an order ID')
      return
    }

    setLoading(true)
    setError(null)

    try {
      console.log('🔍 Tracking order:', orderId.trim())

      // Call the tracking API
      const response = await fetch(
        `/api/public/orders/track?orderNumber=${encodeURIComponent(orderId.trim())}`,
      )
      const data = await response.json()

      console.log('📦 API Response:', data)

      // ✅ Fixed: Check the correct response structure
      if (data.success && data.data && data.data.found && data.data.order) {
        const orderData = data.data.order

        console.log('✅ Order found:', orderData)

        // Convert the PayloadCMS order to match your Order type
        const convertedOrder: Order = {
          id: orderData.id,
          orderNumber: orderData.orderNumber,
          customerName: orderData.customerName,
          customerEmail: '', // Not returned by API for security
          customerPhone: '', // Not returned by API for security
          deliveryAddress: '', // Not returned by API for security
          orderItems: orderData.orderItems.map(
            (item: {
              productId: string
              productName: string
              productSku: string
              unitPrice: number
              quantity: number
              selectedSize?: string
              selectedColor?: string
              subtotal: number
            }) => ({
              productId: item.productId || '',
              productName: item.productName,
              productSku: item.productSku || '',
              unitPrice: item.unitPrice,
              quantity: item.quantity,
              selectedSize: item.selectedSize,
              selectedColor: item.selectedColor,
              subtotal: item.subtotal,
            }),
          ),
          orderSubtotal: orderData.orderTotal, // API doesn't return separate subtotal
          shippingCost: 0, // API doesn't return separate shipping
          discount: 0, // API doesn't return separate discount
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
        // ✅ Fixed: Handle the correct "not found" case
        console.log('❌ Order not found or invalid response structure')
        setError(data.data?.message || data.error || 'Order not found')
        setOrder(null)
        toast.error('Order not found')
      }
    } catch (error) {
      console.error('❌ Order tracking error:', error)
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

  return (
    <main className="min-h-screen pt-16 bg-gray-50">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-[#003DA5] to-[#1A1A1A] text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-[#FFD700] rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-8 h-8 text-[#1A1A1A]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            TRACK YOUR
            <span className="block text-[#FF3D00]">ORDER</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Enter your order ID to check the status and track your shipment
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          {/* Order Search Form */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Track Your Order
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTrackOrder} className="space-y-4">
                <div>
                  <Label htmlFor="orderId">Order ID</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="orderId"
                      type="text"
                      value={orderId}
                      onChange={(e) => setOrderId(e.target.value)}
                      placeholder="Enter your order ID (e.g., RS-20240101-ABCDE)"
                      className="flex-1"
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
                        <Search className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  <p>
                    💡 <strong>Where to find your Order ID:</strong>
                  </p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Check your WhatsApp confirmation message</li>
                    <li>Look for emails from Ralhum Sports</li>
                    <li>Check your order confirmation page</li>
                  </ul>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Error Display */}
          {error && (
            <Alert className="mb-8">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Order Details */}
          {order && (
            <div className="space-y-8">
              {/* Order Status Overview */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Order {order.orderNumber}</CardTitle>
                    <Badge
                      className={
                        ORDER_STATUS_CONFIG[order.orderStatus]?.color || 'bg-gray-100 text-gray-800'
                      }
                    >
                      {ORDER_STATUS_CONFIG[order.orderStatus]?.label || order.orderStatus}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Status Description */}
                  <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                    {React.createElement(ORDER_STATUS_CONFIG[order.orderStatus]?.icon || Clock, {
                      className: 'w-5 h-5 text-[#003DA5] mt-0.5',
                    })}
                    <div>
                      <p className="font-medium text-[#003DA5]">
                        {ORDER_STATUS_CONFIG[order.orderStatus]?.label || order.orderStatus}
                      </p>
                      <p className="text-sm text-gray-600">
                        {ORDER_STATUS_CONFIG[order.orderStatus]?.description ||
                          'Order status updated.'}
                      </p>
                    </div>
                  </div>

                  {/* Progress Steps */}
                  <div className="space-y-4">
                    <h3 className="font-bold">Order Progress</h3>
                    <div className="space-y-4">
                      {getOrderSteps(order.orderStatus).map((step) => (
                        <div key={step.status} className="flex items-center gap-4">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              step.completed
                                ? 'bg-[#003DA5] text-white'
                                : step.current
                                  ? 'bg-[#FF3D00] text-white'
                                  : 'bg-gray-200 text-gray-400'
                            }`}
                          >
                            {React.createElement(step.icon, { className: 'w-5 h-5' })}
                          </div>
                          <div className="flex-1">
                            <p
                              className={`font-medium ${
                                step.completed || step.current ? 'text-gray-900' : 'text-gray-400'
                              }`}
                            >
                              {step.label}
                            </p>
                          </div>
                          {step.completed && <CheckCircle className="w-5 h-5 text-green-600" />}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Dates */}
                  <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-600" />
                      <span className="text-sm">
                        <strong>Ordered:</strong>{' '}
                        {new Date(order.createdAt).toLocaleDateString('en-GB')}
                      </span>
                    </div>
                    {order.shipping?.estimatedDelivery && (
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-gray-600" />
                        <span className="text-sm">
                          <strong>Expected Delivery:</strong>{' '}
                          {new Date(order.shipping.estimatedDelivery).toLocaleDateString('en-GB')}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Information */}
              {order.shipping && (order.shipping.trackingNumber || order.shipping.courier) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="w-5 h-5" />
                      Shipping Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {order.shipping.courier && (
                      <div>
                        <span className="font-medium">Courier:</span> {order.shipping.courier}
                      </div>
                    )}
                    {order.shipping.trackingNumber && (
                      <div>
                        <span className="font-medium">Tracking Number:</span>
                        <code className="ml-2 px-2 py-1 bg-gray-100 rounded text-sm">
                          {order.shipping.trackingNumber}
                        </code>
                      </div>
                    )}
                    {order.shipping.actualDelivery && (
                      <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-green-800">
                          <strong>Delivered:</strong>{' '}
                          {new Date(order.shipping.actualDelivery).toLocaleDateString('en-GB')}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5" />
                    Order Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.orderItems.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium">{item.productName}</h4>
                          {item.productSku && (
                            <p className="text-sm text-gray-600">SKU: {item.productSku}</p>
                          )}
                          {item.selectedSize && (
                            <p className="text-sm text-gray-600">Size: {item.selectedSize}</p>
                          )}
                          {item.selectedColor && (
                            <p className="text-sm text-gray-600">Color: {item.selectedColor}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-medium">Qty: {item.quantity}</p>
                          <p className="text-sm text-gray-600">{item.unitPrice} LKR each</p>
                          <p className="font-bold">{item.subtotal} LKR</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  {/* Order Total */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-[#003DA5]">{order.orderTotal} LKR</span>
                    </div>
                  </div>

                  {/* Payment Status */}
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Payment Status:</span>
                      <Badge
                        className={
                          PAYMENT_STATUS_CONFIG[order.paymentStatus]?.color ||
                          'bg-gray-100 text-gray-800'
                        }
                      >
                        {PAYMENT_STATUS_CONFIG[order.paymentStatus]?.label || order.paymentStatus}
                      </Badge>
                    </div>
                    {order.paymentMethod && (
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-medium">Payment Method:</span>
                        <span className="text-sm capitalize">
                          {order.paymentMethod.replace('-', ' ')}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Contact Support */}
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <h3 className="text-lg font-bold mb-2">Need Help?</h3>
                    <p className="text-gray-600 mb-4">
                      Have questions about your order? Our team is here to help.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button
                        size="sm"
                        className="bg-[#25D366] hover:bg-[#25D366]/90 text-white"
                        onClick={() => {
                          const message = `Hello! I need help with my order #${order.orderNumber}. Can you please assist me?`
                          const whatsappUrl = `https://wa.me/94772350712?text=${encodeURIComponent(message)}`
                          window.open(whatsappUrl, '_blank')
                        }}
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        WhatsApp Support
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href="/contact">
                          <Mail className="w-4 h-4 mr-2" />
                          Contact Us
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Help Section */}
          {!order && !loading && (
            <Card>
              <CardHeader>
                <CardTitle>Can&apos;t Find Your Order?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-gray-600 space-y-2">
                  <p>
                    <strong>Double-check your Order ID:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Order IDs start with &quot;RS-&quot; followed by numbers and letters</li>
                    <li>Make sure there are no extra spaces</li>
                    <li>Check your WhatsApp messages or email confirmations</li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const message =
                        "Hello! I can't find my order ID. Can you help me track my order?"
                      const whatsappUrl = `https://wa.me/94772350712?text=${encodeURIComponent(message)}`
                      window.open(whatsappUrl, '_blank')
                    }}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Get Help via WhatsApp
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/contact">
                      <Mail className="w-4 h-4 mr-2" />
                      Contact Support
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </main>
  )
}
