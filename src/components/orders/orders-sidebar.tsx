'use client'

import { useOrders, useOrdersSummary } from '@/hooks/use-orders'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { OrderItem } from './order-item'
import {
  Clock,
  ArrowRight,
  RefreshCw,
  Package,
  AlertCircle,
  ExternalLink,
  ShoppingBag,
  CheckCircle,
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export function OrdersSidebar() {
  const { isOpen, closeOrders, refreshOrders, isLoading, error } = useOrders()
  const { orders, orderCount, hasOrders, recentOrders } = useOrdersSummary()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await refreshOrders()
    } finally {
      setIsRefreshing(false)
    }
  }

  // Calculate order status summary
  const statusSummary = orders.reduce(
    (acc, order) => {
      acc[order.orderStatus] = (acc[order.orderStatus] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <Sheet open={isOpen} onOpenChange={closeOrders}>
      <SheetContent className="w-full sm:max-w-lg p-0 flex flex-col bg-brand-surface border-l border-brand-border h-full max-h-[100vh] overflow-hidden">
        <SheetHeader className="flex-shrink-0 p-4 sm:p-6 pb-3 sm:pb-4 bg-gradient-to-r from-purple-50 to-blue-50">
          <SheetTitle className="flex items-center gap-2 text-lg sm:text-xl font-bold text-text-primary">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-brand-secondary" />
            Your Orders ({orderCount})
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing || isLoading}
              className="ml-60 p-2 h-8 w-8 hover:bg-white/50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </SheetTitle>
        </SheetHeader>

        {/* Error Display */}
        {error && (
          <div className="mx-4 sm:mx-6 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Error loading orders</span>
            </div>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && orders.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6">
            <div className="w-8 h-8 border-2 border-brand-secondary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-text-secondary">Loading your orders...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !hasOrders && !error && (
          <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Package className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">No orders yet</h3>
            <p className="text-text-secondary mb-6 max-w-sm text-sm sm:text-base">
              You haven&apos;t placed any orders yet. Start shopping to see your orders here!
            </p>
            <Button
              asChild
              onClick={closeOrders}
              className="bg-brand-secondary hover:bg-secondary-600 focus-visible:ring-2 focus-visible:ring-brand-secondary text-white"
            >
              <Link href="/products">
                Browse Products
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        )}

        {/* Orders List */}
        {hasOrders && (
          <>
            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-hidden min-h-0">
              <ScrollArea className="h-full px-4 sm:px-6">
                {/* Order Status Summary */}
                <div className="pb-4 pt-4">
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(statusSummary).map(([status, count]) => {
                      const statusColors =
                        {
                          pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
                          confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
                          processing: 'bg-purple-100 text-purple-800 border-purple-200',
                          shipped: 'bg-indigo-100 text-indigo-800 border-indigo-200',
                          delivered: 'bg-green-100 text-green-800 border-green-200',
                          cancelled: 'bg-red-100 text-red-800 border-red-200',
                        }[status] || 'bg-gray-100 text-gray-800 border-gray-200'

                      return (
                        <Badge key={status} className={`${statusColors} text-xs px-2 py-1`}>
                          {status}: {count}
                        </Badge>
                      )
                    })}
                  </div>
                </div>

                {/* Orders List */}
                <div className="space-y-3 sm:space-y-4 pb-4">
                  {orders.map((order) => (
                    <OrderItem key={order.id} order={order} />
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Fixed Footer Actions */}
            <div className="flex-shrink-0 border-t border-brand-border p-4 sm:p-6 space-y-3 bg-brand-surface max-h-[50vh] overflow-y-auto">
              {/* Order Statistics */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">Total Orders</span>
                <span className="font-semibold text-text-primary">{orderCount}</span>
              </div>

              {/* Recent Activity */}
              {recentOrders.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>
                    Last order: {new Date(recentOrders[0].createdAt).toLocaleDateString()}
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2">
                <Button
                  asChild
                  className="w-full bg-brand-secondary hover:bg-secondary-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Link href="/orders/track">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Track Any Order
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="w-full border-brand-secondary/30 text-brand-secondary hover:bg-brand-secondary/5 hover:border-brand-secondary focus-visible:ring-2 focus-visible:ring-brand-secondary bg-transparent"
                  onClick={closeOrders}
                  asChild
                >
                  <Link href="/products">
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Continue Shopping
                  </Link>
                </Button>
              </div>

              {/* Help Text */}
              <div className="text-center pt-4 border-t border-brand-border">
                <p className="text-xs text-text-secondary">
                  Questions about your orders?{' '}
                  <Link
                    href="/contact"
                    className="text-brand-secondary hover:underline font-medium"
                    onClick={closeOrders}
                  >
                    Contact us
                  </Link>
                </p>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
