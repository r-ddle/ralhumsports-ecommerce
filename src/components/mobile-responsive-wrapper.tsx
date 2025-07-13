'use client'

import type React from 'react'
import { useEffect, useState, useCallback } from 'react'

interface MobileResponsiveWrapperProps {
  children: React.ReactNode
  className?: string
  enableGestures?: boolean
  optimizeTouch?: boolean
}

export default function MobileResponsiveWrapper({
  children,
  className = '',
  enableGestures = true,
  optimizeTouch = true,
}: MobileResponsiveWrapperProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait')
  const [touchDevice, setTouchDevice] = useState(false)

  const checkDevice = useCallback(() => {
    const width = window.innerWidth
    const height = window.innerHeight

    setIsMobile(width < 768)
    setIsTablet(width >= 768 && width < 1024)
    setOrientation(height > width ? 'portrait' : 'landscape')
    setTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])

  useEffect(() => {
    checkDevice()

    const handleResize = () => {
      checkDevice()
    }

    const handleOrientationChange = () => {
      // Delay to ensure dimensions are updated
      setTimeout(checkDevice, 100)
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleOrientationChange)

    // Modern browsers
    if (screen.orientation) {
      screen.orientation.addEventListener('change', handleOrientationChange)
    }

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleOrientationChange)

      if (screen.orientation) {
        screen.orientation.removeEventListener('change', handleOrientationChange)
      }
    }
  }, [checkDevice])

  // Gesture handling for mobile devices
  useEffect(() => {
    if (!enableGestures || !touchDevice) return

    let startY = 0
    let startX = 0

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY
      startX = e.touches[0].clientX
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!startY || !startX) return

      const currentY = e.touches[0].clientY
      const currentX = e.touches[0].clientX
      const diffY = startY - currentY
      const diffX = startX - currentX

      // Prevent rubber band scrolling on iOS
      if (Math.abs(diffY) > Math.abs(diffX)) {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop

        if (
          (diffY > 0 && scrollTop === 0) ||
          (diffY < 0 && scrollTop >= document.documentElement.scrollHeight - window.innerHeight)
        ) {
          e.preventDefault()
        }
      }
    }

    if (isMobile) {
      document.addEventListener('touchstart', handleTouchStart, { passive: true })
      document.addEventListener('touchmove', handleTouchMove, { passive: false })
    }

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', handleTouchMove)
    }
  }, [enableGestures, touchDevice, isMobile])

  // Optimize touch interactions
  useEffect(() => {
    if (!optimizeTouch || !touchDevice) return

    // Disable 300ms tap delay on mobile
    const style = document.createElement('style')
    style.textContent = `
      * {
        touch-action: manipulation;
      }

      button, a, [role="button"] {
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0.1);
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        user-select: none;
      }

      input, textarea, select {
        -webkit-user-select: text;
        user-select: text;
      }
    `

    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [optimizeTouch, touchDevice])

  const wrapperClasses = [
    className,
    isMobile && 'mobile-optimized',
    isTablet && 'tablet-optimized',
    touchDevice && 'touch-device',
    `orientation-${orientation}`,
    enableGestures && touchDevice && 'gesture-enabled',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={wrapperClasses}
      data-mobile={isMobile}
      data-tablet={isTablet}
      data-touch={touchDevice}
      data-orientation={orientation}
      style={{
        // Ensure proper viewport handling on mobile
        ...(isMobile && {
          minHeight: '100dvh', // Dynamic viewport height for modern browsers
        }),
      }}
    >
      {children}
    </div>
  )
}
