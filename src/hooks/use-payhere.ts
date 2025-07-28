// hooks/use-payhere.ts
'use client'

import { useState, useEffect, useCallback } from 'react'
import type { PayHerePayment, PaymentInitiationRequest } from '@/types/payhere'

declare global {
  interface Window {
    payhere: {
      startPayment: (payment: PayHerePayment) => void
      onCompleted: (orderId: string) => void
      onDismissed: () => void
      onError: (error: string) => void
    }
  }
}

interface UsePayHereReturn {
  isLoading: boolean
  isScriptLoaded: boolean
  error: string | null
  initiatePayment: (request: PaymentInitiationRequest) => Promise<void>
  checkPaymentStatus: (orderId: string) => Promise<any>
}

export function usePayHere(): UsePayHereReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load PayHere script
  useEffect(() => {
    const loadPayHereScript = () => {
      // Check if script is already loaded
      if (window.payhere || document.querySelector('script[src*="payhere"]')) {
        setIsScriptLoaded(true)
        return
      }

      const script = document.createElement('script')
      script.src = 'https://www.payhere.lk/lib/payhere.js'
      script.async = true
      script.onload = () => {
        setIsScriptLoaded(true)
        console.log('PayHere script loaded successfully')
      }
      script.onerror = () => {
        setError('Failed to load PayHere script')
        console.error('Failed to load PayHere script')
      }

      document.head.appendChild(script)
    }

    loadPayHereScript()
  }, [])

  const initiatePayment = useCallback(
    async (request: PaymentInitiationRequest) => {
      if (!isScriptLoaded) {
        throw new Error('PayHere script not loaded')
      }

      setIsLoading(true)
      setError(null)

      try {
        // Call backend to prepare payment
        const response = await fetch('/api/payments/initiate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(request),
        })

        const result = await response.json()

        if (!result.success) {
          throw new Error(result.error || 'Payment initiation failed')
        }

        const paymentData = result.paymentData

        // Setup PayHere callbacks
        window.payhere.onCompleted = function (orderId: string) {
          console.log('Payment completed:', orderId)
          // The webhook will handle order updates
          // Optionally redirect or show success message
          window.location.href = `/checkout/success?orderId=${orderId}`
        }

        window.payhere.onDismissed = function () {
          console.log('Payment dismissed')
          setIsLoading(false)
          // Optionally show message or redirect
        }

        window.payhere.onError = function (error: string) {
          console.error('Payment error:', error)
          setError(error)
          setIsLoading(false)
        }

        // Start the payment
        window.payhere.startPayment(paymentData)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Payment failed'
        setError(errorMessage)
        console.error('Payment initiation error:', err)
      } finally {
        setIsLoading(false)
      }
    },
    [isScriptLoaded],
  )

  const checkPaymentStatus = useCallback(async (orderId: string) => {
    try {
      const response = await fetch(`/api/payments/status?orderId=${orderId}`)
      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to check payment status')
      }

      return result.data
    } catch (err) {
      console.error('Payment status check error:', err)
      throw err
    }
  }, [])

  return {
    isLoading,
    isScriptLoaded,
    error,
    initiatePayment,
    checkPaymentStatus,
  }
}
