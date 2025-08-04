'use client'

import { useEffect } from 'react'
import { onCLS, onFCP, onLCP, onTTFB } from 'web-vitals'

interface WebVitalsMetric {
  name: string
  value: number
  id: string
  delta: number
}

export function WebVitals() {
  useEffect(() => {
    // Track Core Web Vitals with updated web-vitals v5 API
    onCLS((metric: WebVitalsMetric) => {
      // Send to analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'web_vitals', {
          event_category: 'Performance',
          event_label: metric.name,
          value: Math.round(metric.value * 1000),
          non_interaction: true,
        })
      }
      console.log('CLS:', metric.value)
    })

    onFCP((metric: WebVitalsMetric) => {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'web_vitals', {
          event_category: 'Performance',
          event_label: metric.name,
          value: Math.round(metric.value),
          non_interaction: true,
        })
      }
      console.log('FCP:', metric.value)
    })

    onLCP((metric: WebVitalsMetric) => {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'web_vitals', {
          event_category: 'Performance',
          event_label: metric.name,
          value: Math.round(metric.value),
          non_interaction: true,
        })
      }
      console.log('LCP:', metric.value)
    })

    onTTFB((metric: WebVitalsMetric) => {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'web_vitals', {
          event_category: 'Performance',
          event_label: metric.name,
          value: Math.round(metric.value),
          non_interaction: true,
        })
      }
      console.log('TTFB:', metric.value)
    })
  }, [])

  return null // This component doesn't render anything
}

// Add gtag types
declare global {
  interface Window {
    gtag?: (command: string, targetId: string | Date, config?: Record<string, any>) => void
  }
}
