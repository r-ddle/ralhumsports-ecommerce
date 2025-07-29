'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { CreditCard, Loader2, AlertCircle } from 'lucide-react'
import { usePayHere } from '@/hooks/use-payhere'
import { buildPaymentObject } from '@/lib/payhere'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { toast } from 'sonner'
import type { OrderInput } from '@/types/api'
import { paymentLogger } from '@/lib/logger'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

interface PayHereCheckoutProps {
  orderData: OrderInput
  orderId: string
  totalAmount: number
  returnUrl?: string
  cancelUrl?: string
  onSuccess?: (orderId: string) => void
  onError?: (error: string) => void
  onDismiss?: () => void
}

// FIXED: Use same origin to avoid cross-domain issues
const getApiBaseUrl = (): string => {
  // Always prefer same-origin requests in browser
  if (typeof window !== 'undefined') {
    return window.location.origin
  }

  // Server-side fallback
  if (process.env.NODE_ENV === 'production') {
    return process.env.NEXT_PUBLIC_SERVER_URL || 'https://ralhumsports.lk'
  }

  return 'http://localhost:3000'
}

export function PayHereCheckout({
  orderData,
  orderId,
  totalAmount,
  returnUrl,
  cancelUrl,
  onSuccess,
  onError,
  onDismiss,
}: PayHereCheckoutProps) {
  const { isLoaded, isLoading, error: scriptError, startPayment } = usePayHere()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoaded) return

    // Set up PayHere callbacks
    window.payhere.onCompleted = (orderId: string) => {
      paymentLogger.success(orderId)
      setIsProcessing(false)

      // Show success toast with shorter duration
      const successToast = toast.success('Payment completed successfully!', {
        duration: 2000,
      })

      // Clear the toast and redirect after a short delay
      setTimeout(() => {
        toast.dismiss(successToast)
        onSuccess?.(orderId)
      }, 1500)
    }

    window.payhere.onDismissed = () => {
      paymentLogger.error(orderId, 'Payment dismissed by user')
      setIsProcessing(false)
      toast.info('Payment was cancelled. You can try again when ready.', {
        duration: 4000,
      })
      onDismiss?.()
    }

    window.payhere.onError = (error: string) => {
      paymentLogger.error(orderId, error)
      setIsProcessing(false)
      setError(error)

      // Provide user-friendly error messages
      let userMessage = 'Payment failed. Please try again.'
      if (
        error.toLowerCase().includes('unauthorized') ||
        error.toLowerCase().includes('merchant')
      ) {
        userMessage = 'Payment system configuration error. Please contact support.'
      } else if (error.toLowerCase().includes('network')) {
        userMessage = 'Network error. Please check your connection and try again.'
      } else if (error.toLowerCase().includes('timeout')) {
        userMessage = 'Payment timed out. Please try again.'
      } else if (error.toLowerCase().includes('card')) {
        userMessage = 'Card error. Please check your card details and try again.'
      }

      toast.error(userMessage, { duration: 6000 })
      onError?.(error)
    }
  }, [isLoaded, onSuccess, onError, onDismiss])

  const handlePayment = async () => {
    setIsProcessing(true)
    setError(null)

    try {
      console.log('[PayHere Checkout] Generating hash for order:', orderId, 'amount:', totalAmount)

      // FIXED: Use absolute HTTPS URL in production
      const baseUrl = getApiBaseUrl()
      const hashUrl = `${baseUrl}/api/payhere/generate-hash`

      console.log('[PayHere Checkout] API Base URL:', baseUrl)
      console.log('[PayHere Checkout] Hash URL:', hashUrl)
      console.log('[PayHere Checkout] Environment:', process.env.NODE_ENV)

      // Generate hash from server with proper headers
      const hashResponse = await fetch(hashUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Ensure Referer header is present for PayHere domain validation
          Referer: typeof window !== 'undefined' ? window.location.origin : baseUrl,
        },
        body: JSON.stringify({
          orderId,
          amount: totalAmount,
          currency: 'LKR',
        }),
      })

      console.log('[PayHere Checkout] Hash response status:', hashResponse.status)

      if (!hashResponse.ok) {
        const errorData = await hashResponse.json().catch(() => ({
          error: `Network error: ${hashResponse.status}`,
        }))
        console.error('[PayHere Checkout] Hash generation failed:', errorData)
        throw new Error(errorData.error || 'Failed to generate payment hash')
      }

      const { data } = await hashResponse.json()
      console.log('[PayHere Checkout] Hash generated successfully')

      // Use provided URLs or create sensible defaults
      const currentDomain = typeof window !== 'undefined' ? window.location.origin : baseUrl
      const _returnUrl = returnUrl || `${currentDomain}/checkout/success?orderId=${orderId}`
      const _cancelUrl = cancelUrl || `${currentDomain}/checkout/cancel?orderId=${orderId}`

      console.log('[PayHere Checkout] Payment URLs:', { return: _returnUrl, cancel: _cancelUrl })

      // Build payment object
      const payment = buildPaymentObject(
        orderId,
        totalAmount,
        {
          fullName: orderData.customer.fullName,
          email: orderData.customer.email,
          phone: orderData.customer.phone,
          address: orderData.customer.address?.street || '',
          city: orderData.customer.address?.city || '',
          postalCode: orderData.customer.address?.postalCode || '',
          province: orderData.customer.address?.province || '',
        },
        orderData.items.map((item) => item.productName).join(', '),
        data.hash,
        _returnUrl,
        _cancelUrl,
        orderData.customer.address
          ? {
              address: orderData.customer.address?.street || '',
              city: orderData.customer.address?.city || '',
              postalCode: orderData.customer.address?.postalCode || '',
              province: orderData.customer.address?.province || '',
            }
          : undefined,
      )

      // Debug: log payment object (but hide sensitive data in production)
      if (process.env.NODE_ENV === 'development') {
        console.log('[PayHere Checkout] Payment object:', {
          ...payment,
          hash: payment.hash.substring(0, 8) + '...',
          merchant_id: payment.merchant_id?.substring(0, 4) + '...',
        })
      }

      // Validate required fields before starting payment
      if (!payment.merchant_id || !payment.hash || !payment.order_id || !payment.amount) {
        throw new Error('Missing required payment parameters')
      }

      // Start payment
      console.log('[PayHere Checkout] Starting payment...')
      startPayment(payment)

      // Clear any existing toasts and show processing message
      toast.dismiss()
      const loadingToast = toast.loading('Opening payment gateway...', { duration: 3000 })

      // Clear loading toast after payment popup opens
      setTimeout(() => {
        toast.dismiss(loadingToast)
      }, 2500)
    } catch (err) {
      console.error('[PayHere Checkout] Payment initiation error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to initiate payment'
      setError(errorMessage)
      setIsProcessing(false)

      // Clear any existing toasts first
      toast.dismiss()

      // Provide helpful error messages
      let userMessage = errorMessage
      if (errorMessage.includes('hash')) {
        userMessage = 'Payment security verification failed. Please try again or contact support.'
      } else if (errorMessage.includes('credentials') || errorMessage.includes('merchant')) {
        userMessage = 'Payment system configuration error. Please contact support.'
      } else if (errorMessage.includes('Network')) {
        userMessage =
          'Network connection failed. Please check your internet connection and try again.'
      }

      toast.error(`Payment Error: ${userMessage}`, {
        duration: 8000,
        action: {
          label: 'Retry',
          onClick: () => {
            setError(null)
            handlePayment()
          },
        },
      })
    }
  }

  if (scriptError || error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {scriptError || error}
          {(scriptError || error)?.includes('credentials') && (
            <div className="mt-2 text-sm">Please contact support if this problem persists.</div>
          )}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-4">
      <Button
        size="lg"
        onClick={handlePayment}
        disabled={!isLoaded || isProcessing}
        className="w-full bg-gradient-to-r from-[#FF6B00] to-[#FF8533] hover:from-[#FF8533] hover:to-[#FF6B00] text-white font-bold py-4 text-lg rounded-xl shadow-2xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isLoading || isProcessing ? (
          <>
            <LoadingSpinner size="sm" className="mr-2" />
            {isLoading ? 'Loading Payment Gateway...' : 'Processing Payment...'}
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5 mr-2" />
            Pay with Card/Mobile Banking
          </>
        )}
      </Button>

      {/* Payment instructions */}
      <div className="text-center text-sm text-gray-600 space-y-2">
        <p>✓ Secure payment powered by PayHere</p>
        <p>✓ Accepts Visa, Mastercard, and mobile banking</p>
        <p className="text-xs">
          Order ID: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{orderId}</span>
        </p>
      </div>

      {/* Debug info in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-gray-500 mt-4 p-3 bg-gray-50 rounded">
          <p>
            <strong>Debug Info:</strong>
          </p>
          <p>Merchant ID: {process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID}</p>
          <p>Order ID: {orderId}</p>
          <p>Amount: LKR {totalAmount.toFixed(2)}</p>
          <p>Environment: {process.env.NODE_ENV}</p>
          <p>API Base URL: {getApiBaseUrl()}</p>
          <p>Sandbox Mode: {(process.env.NODE_ENV as string) !== 'production' ? 'Yes' : 'No'}</p>
        </div>
      )}
    </div>
  )
}
