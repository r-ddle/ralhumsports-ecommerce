'use client'

import { useEffect, useState, useCallback } from 'react'
import { PayHerePayment } from '@/types/payhere'
import { PAYHERE_CONFIG } from '@/lib/payhere'

interface UsePayHereReturn {
  isLoaded: boolean
  isLoading: boolean
  error: string | null
  startPayment: (payment: PayHerePayment) => void
}

export function usePayHere(): UsePayHereReturn {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if already loaded
    if (window.payhere) {
      setIsLoaded(true)
      return
    }

    setIsLoading(true)

    // Create script element
    const script = document.createElement('script')
    script.src = PAYHERE_CONFIG.scriptUrl
    script.async = true

    script.onload = () => {
      setIsLoaded(true)
      setIsLoading(false)
    }

    script.onerror = () => {
      setError('Failed to load PayHere script')
      setIsLoading(false)
    }

    // Append to document
    document.body.appendChild(script)

    // Cleanup
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [])

  const startPayment = useCallback((payment: PayHerePayment) => {
    if (!window.payhere) {
      setError('PayHere is not loaded')
      return
    }

    try {
      window.payhere.startPayment(payment)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start payment')
    }
  }, [])

  return {
    isLoaded,
    isLoading,
    error,
    startPayment,
  }
}
