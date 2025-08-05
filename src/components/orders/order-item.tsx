'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  ExternalLink,
  Package,
  Clock,
  CheckCircle,
  Truck,
  AlertCircle,
  XCircle,
  X,
  Loader2,
} from 'lucide-react'
import Link from 'next/link'
import { type Order } from '@/hooks/use-orders'
import { useCart } from '@/hooks/use-cart'
import { clearPendingOrders } from '@/lib/customer-id'
import { toast } from 'sonner'

interface OrderItemProps {
  order: Order
}

// Helper function to format currency
function formatCurrency(amount: number): string {
  return `LKR ${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

// Helper function to format date
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// Helper function to get status styling
function getStatusStyling(status: string) {
  switch (status) {
    case 'pending':
      return {
        icon: Clock,
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        iconColor: 'text-yellow-600',
      }
    case 'confirmed':
      return {
        icon: CheckCircle,
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        iconColor: 'text-blue-600',
      }
    case 'processing':
      return {
        icon: Package,
        color: 'bg-purple-100 text-purple-800 border-purple-200',
        iconColor: 'text-purple-600',
      }
    case 'shipped':
      return {
        icon: Truck,
        color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
        iconColor: 'text-indigo-600',
      }
    case 'delivered':
      return {
        icon: CheckCircle,
        color: 'bg-green-100 text-green-800 border-green-200',
        iconColor: 'text-green-600',
      }
    case 'cancelled':
      return {
        icon: XCircle,
        color: 'bg-red-100 text-red-800 border-red-200',
        iconColor: 'text-red-600',
      }
    default:
      return {
        icon: AlertCircle,
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        iconColor: 'text-gray-600',
      }
  }
}

export function OrderItem({ order }: OrderItemProps) {
  const [isLocalCancelling, setIsLocalCancelling] = useState(false)
  const [localOrderStatus, setLocalOrderStatus] = useState(order.orderStatus)
  const { clearCart } = useCart()

  const statusStyle = getStatusStyling(localOrderStatus)
  const StatusIcon = statusStyle.icon

  // Check if order can be cancelled (payment is pending and order is not already cancelled)
  const canCancelOrder = order.paymentStatus === 'pending' && localOrderStatus !== 'cancelled'

  const handleCancelOrder = async () => {
    setIsLocalCancelling(true)

    try {
      // First try to get PayloadCMS customer ID from localStorage
      let customerId = localStorage.getItem('ralhum-payload-customer-id')

      // If not found, fall back to customer email from the order
      if (!customerId) {
        customerId = order.customerEmail
        console.log('[Order Cancellation] Using email as customer ID (fallback):', customerId)
      } else {
        console.log('[Order Cancellation] Using PayloadCMS customer ID:', customerId)
      }

      if (!customerId) {
        toast.error('Customer ID not found. Cannot cancel order.')
        return
      }

      console.log(
        `[Order Cancellation] Attempting to cancel order ${order.orderNumber} for customer ${customerId}`,
      )

      const response = await fetch(`/api/public/orders/cancel/${order.orderNumber}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'cancel',
          customerId: customerId,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setLocalOrderStatus('cancelled')

        // Show appropriate message based on whether it was already cancelled
        if (result.data?.alreadyCancelled) {
          toast.info('Order was already cancelled')
        } else {
          toast.success('Order cancelled successfully')
        }

        // Clear cart and pending orders if the API indicates we should
        if (result.data?.clearCart) {
          clearCart()
          console.log('[Order Cancellation] Cart cleared after successful cancellation')
        }

        if (result.data?.clearPendingOrders) {
          clearPendingOrders()
          console.log('[Order Cancellation] Pending orders cleared after successful cancellation')
        }
      } else {
        toast.error(result.error || 'Failed to cancel order')
      }
    } catch (error) {
      console.error('Error cancelling order:', error)
      toast.error('Failed to cancel order. Please try again.')
    } finally {
      setIsLocalCancelling(false)
    }
  }

  return (
    <div className="p-4 border-2 border-brand-border rounded-xl bg-brand-background hover:bg-white transition-all duration-200 hover:shadow-md">
      {/* Order Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-text-primary text-lg truncate">{order.orderNumber}</h3>
          <p className="text-sm text-text-secondary">{formatDate(order.createdAt)}</p>
        </div>
        <Badge className={`${statusStyle.color} font-semibold px-3 py-1 flex items-center gap-1`}>
          <StatusIcon className={`w-3 h-3 ${statusStyle.iconColor}`} />
          {localOrderStatus.charAt(0).toUpperCase() + localOrderStatus.slice(1)}
        </Badge>
      </div>

      {/* Order Items Summary */}
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-2">
          <Package className="w-4 h-4 text-text-secondary" />
          <span className="text-sm font-medium text-text-secondary">
            {order.orderItems.length} item{order.orderItems.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Show first 2 items */}
        <div className="space-y-1">
          {order.orderItems.slice(0, 2).map((item, index) => (
            <div key={index} className="flex justify-between items-center text-sm">
              <div className="flex-1 min-w-0">
                <span className="text-text-primary font-medium truncate block">
                  {item.productName}
                </span>
                <div className="flex items-center gap-2 text-text-secondary text-xs">
                  <span>Qty: {item.quantity}</span>
                  {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                  {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                </div>
              </div>
              <span className="text-text-primary font-medium ml-2">
                {formatCurrency(item.subtotal)}
              </span>
            </div>
          ))}

          {/* Show "and X more" if there are more items */}
          {order.orderItems.length > 2 && (
            <div className="text-xs text-text-secondary italic">
              and {order.orderItems.length - 2} more item
              {order.orderItems.length - 2 !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>

      {/* Order Total */}
      <div className="flex justify-between items-center mb-4 pt-3 border-t border-brand-border">
        <span className="font-semibold text-text-primary">Total</span>
        <span className="font-bold text-lg text-brand-secondary">
          {formatCurrency(order.orderTotal)}
        </span>
      </div>

      {/* Payment Status */}
      {order.paymentStatus && order.paymentStatus !== 'paid' && (
        <div className="mb-3">
          <Badge
            variant="outline"
            className={`text-xs ${
              order.paymentStatus === 'pending'
                ? 'border-yellow-300 text-yellow-700 bg-yellow-50'
                : order.paymentStatus === 'failed'
                  ? 'border-red-300 text-red-700 bg-red-50'
                  : 'border-gray-300 text-gray-700 bg-gray-50'
            }`}
          >
            Payment: {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
          </Badge>
        </div>
      )}

      {/* Action Buttons */}
      <div className={`${canCancelOrder ? 'space-y-2' : ''}`}>
        {/* Track Order Button */}
        <Button
          asChild
          className="w-full bg-brand-secondary hover:bg-secondary-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
          size="sm"
        >
          <Link target="_blank" href={`/orders/track?id=${order.orderNumber}`}>
            <ExternalLink className="w-4 h-4 mr-2" />
            Track Order
          </Link>
        </Button>

        {/* Cancel Order Button - Only show if payment is pending */}
        {canCancelOrder && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 font-semibold rounded-lg transition-all duration-200"
                disabled={isLocalCancelling}
              >
                {isLocalCancelling ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  <>
                    <X className="w-4 h-4 mr-2" />
                    Cancel Order
                  </>
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white">
              <AlertDialogHeader>
                <AlertDialogTitle>Cancel Order #{order.orderNumber}?</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to cancel this order? This action cannot be undone.
                  <br />
                  <br />
                  <strong>Order Total:</strong> {formatCurrency(order.orderTotal)}
                  <br />
                  <strong>Items:</strong> {order.orderItems.length} item
                  {order.orderItems.length !== 1 ? 's' : ''}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep Order</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleCancelOrder}
                  className="bg-red-500 hover:bg-red-700 text-white hover:border-red-700 font-semibold rounded-lg transition-all duration-200"
                >
                  Yes, Cancel Order
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  )
}
