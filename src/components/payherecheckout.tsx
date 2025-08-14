'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { CreditCard, Loader2, AlertCircle, Smartphone } from 'lucide-react'
import { usePayHere } from '@/hooks/use-payhere'
import { useIsMobile } from '@/hooks/use-mobile'
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
  onPaymentStart?: () => void
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
  onPaymentStart,
}: PayHereCheckoutProps) {
  const { isLoaded, isLoading, error: scriptError, startPayment } = usePayHere()
  const isMobile = useIsMobile()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showMobileInstructions, setShowMobileInstructions] = useState(false)

  // Minimal mobile-specific CSS fixes - only for popup visibility
  useEffect(() => {
    if (!isMobile) return

    // Only ensure PayHere popup is visible - NO scroll locking
    const mobilePayHereCSS = `
      <style id="payhere-mobile-fix">
        /* Ensure PayHere popup is always visible and clickable */
        .payhere-popup,
        .payhere-modal {
          z-index: 99999 !important;
        }

        /* Allow normal body scrolling - no restrictions */
        body {
          overflow: auto !important;
          position: static !important;
        }
      </style>
    `

    // Remove existing mobile fix if present
    const existingStyle = document.getElementById('payhere-mobile-fix')
    if (existingStyle) {
      existingStyle.remove()
    }

    // Add minimal mobile CSS fixes
    document.head.insertAdjacentHTML('beforeend', mobilePayHereCSS)

    // Cleanup function
    return () => {
      const style = document.getElementById('payhere-mobile-fix')
      if (style) {
        style.remove()
      }
    }
  }, [isMobile])

  // Simplified mobile payment start - no scroll restrictions
  const handleMobilePaymentStart = () => {
    if (!isMobile) return

    // Show brief loading state only - no scroll locking
    setShowMobileInstructions(true)

    // Hide loading state after reasonable time
    setTimeout(() => {
      setShowMobileInstructions(false)
    }, 2000)
  }

  const handleMobilePaymentEnd = () => {
    if (!isMobile) return

    // Hide any loading states - no scroll manipulation
    setShowMobileInstructions(false)
  }

  useEffect(() => {
    if (!isLoaded) return

    // Set up PayHere callbacks with mobile enhancements
    window.payhere.onCompleted = (orderId: string) => {
      paymentLogger.success(orderId)
      setIsProcessing(false)
      handleMobilePaymentEnd()

      // Immediately redirect - don't delay
      onSuccess?.(orderId)

      // Show success message with mobile-specific styling
      toast.success('Payment completed successfully!', {
        duration: 2000,
        position: isMobile ? 'top-center' : 'bottom-right',
      })
    }

    window.payhere.onDismissed = () => {
      paymentLogger.error(orderId, 'Payment dismissed by user')
      setIsProcessing(false)
      handleMobilePaymentEnd()

      toast.info(
        isMobile
          ? 'Payment cancelled. Tap "Pay with Card" to try again.'
          : 'Payment was cancelled. You can try again when ready.',
        {
          duration: 4000,
          position: isMobile ? 'top-center' : 'bottom-right',
        },
      )
      onDismiss?.()
    }

    window.payhere.onError = (error: string) => {
      paymentLogger.error(orderId, error)
      setIsProcessing(false)
      setError(error)
      handleMobilePaymentEnd()

      // Enhanced mobile-specific error messages
      let userMessage = 'Payment failed. Please try again.'
      if (isMobile) {
        if (error.toLowerCase().includes('popup') || error.toLowerCase().includes('blocked')) {
          userMessage = 'Payment popup was blocked. Please enable popups and try again.'
        } else if (
          error.toLowerCase().includes('network') ||
          error.toLowerCase().includes('connection')
        ) {
          userMessage = 'Network error. Please check your connection and try again.'
        } else if (error.toLowerCase().includes('timeout')) {
          userMessage = 'Payment timed out. Please try again with a stable connection.'
        }
      } else {
        // Desktop error messages (existing logic)
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
      }

      toast.error(userMessage, {
        duration: 6000,
        position: isMobile ? 'top-center' : 'bottom-right',
      })
      onError?.(error)
    }
  }, [isLoaded, onSuccess, onError, onDismiss, orderId, isMobile])

  const handlePayment = async () => {
    setIsProcessing(true)
    setError(null)

    // Notify parent that payment is starting
    onPaymentStart?.()

    // Mobile-specific preparation - minimal approach
    if (isMobile) {
      handleMobilePaymentStart()
    }

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

      // Start payment - no delays, let PayHere handle timing
      console.log('[PayHere Checkout] Starting payment...')

      startPayment(payment)

      // Clear any existing toasts and show processing message
      toast.dismiss()
      const loadingMessage = isMobile
        ? 'Opening secure payment window...'
        : 'Opening payment gateway...'

      const loadingToast = toast.loading(loadingMessage, {
        duration: 3000,
        position: isMobile ? 'top-center' : 'bottom-right',
      })

      // Clear loading toast after payment popup opens
      setTimeout(() => {
        toast.dismiss(loadingToast)
      }, 2500)
    } catch (err) {
      console.error('[PayHere Checkout] Payment initiation error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to initiate payment'
      setError(errorMessage)
      setIsProcessing(false)

      // Reset mobile state on error
      if (isMobile) {
        handleMobilePaymentEnd()
      }

      // Clear any existing toasts first
      toast.dismiss()

      // Enhanced mobile-specific error messages
      let userMessage = errorMessage
      if (isMobile) {
        if (errorMessage.includes('hash')) {
          userMessage = 'Payment security check failed. Please try again.'
        } else if (errorMessage.includes('credentials') || errorMessage.includes('merchant')) {
          userMessage = 'Payment service error. Please contact support.'
        } else if (errorMessage.includes('Network')) {
          userMessage = 'Connection failed. Please check your internet and try again.'
        }
      } else {
        // Desktop error messages (existing logic)
        if (errorMessage.includes('hash')) {
          userMessage = 'Payment security verification failed. Please try again or contact support.'
        } else if (errorMessage.includes('credentials') || errorMessage.includes('merchant')) {
          userMessage = 'Payment system configuration error. Please contact support.'
        } else if (errorMessage.includes('Network')) {
          userMessage =
            'Network connection failed. Please check your internet connection and try again.'
        }
      }

      toast.error(`Payment Error: ${userMessage}`, {
        duration: 8000,
        position: isMobile ? 'top-center' : 'bottom-right',
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
      {/* Simplified mobile loading state */}
      {isMobile && showMobileInstructions && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm mx-auto text-center shadow-2xl">
            <div className="flex justify-center mb-4">
              <LoadingSpinner size="lg" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Opening Payment Window</h3>
            <p className="text-gray-600 mb-4">
              Please wait while we open the secure payment window.
            </p>
          </div>
        </div>
      )}

      <Button
        size="lg"
        onClick={handlePayment}
        disabled={!isLoaded || isProcessing}
        className="w-full font-bold border-2 border-white text-white hover:bg-brand-secondary/10 py-4 text-lg rounded-xl flex items-center justify-center"
      >
        {isLoading || isProcessing ? (
          <>
            <LoadingSpinner size="sm" className="mr-2" />
            {isLoading
              ? 'Loading Payment Gateway...'
              : isMobile
                ? 'Opening Payment Window...'
                : 'Processing Payment...'}
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5 mr-2" />
            {isMobile ? 'Pay Securely' : 'Pay with Card'}
          </>
        )}
      </Button>

      {/* Enhanced payment instructions with mobile-specific guidance */}
      <div className="text-center text-sm text-gray-600 space-y-2">
        <p>✓ Secure payment powered by PayHere</p>
        <p>✓ Accepts Visa, Mastercard, and mobile banking</p>
        {isMobile && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
            <div className="flex items-center justify-center mb-2">
              <Smartphone className="w-4 h-4 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-blue-900">Mobile Payment</span>
            </div>
            <ul className="text-xs text-blue-800 space-y-1 text-left">
              <li>• Payment window opens in center of screen</li>
              <li>• Complete payment without leaving this page</li>
              <li>• Return here automatically after payment</li>
            </ul>
          </div>
        )}
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
          <p>Is Mobile: {isMobile ? 'Yes' : 'No'}</p>
          <p>Sandbox Mode: {(process.env.NODE_ENV as string) !== 'production' ? 'Yes' : 'No'}</p>
        </div>
      )}
    </div>
  )
}
