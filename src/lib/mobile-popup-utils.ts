// Mobile popup management utilities
// Provides consistent mobile popup handling across the application

export interface MobilePopupManager {
  openPopup: () => void
  closePopup: () => void
  isPopupOpen: boolean
}

export class MobilePopupHelper {
  private static originalScrollY = 0
  private static popupCount = 0

  /**
   * Prepares the mobile viewport for a popup/modal
   * Call this before opening any popup on mobile devices
   */
  static openMobilePopup(): void {
    // Store current scroll position
    this.originalScrollY = window.scrollY
    this.popupCount++

    // Only apply changes on first popup
    if (this.popupCount === 1) {
      // Scroll to top smoothly
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      })

      // Add body class to prevent scrolling
      document.body.classList.add('popup-open')
      document.body.style.top = `-${this.originalScrollY}px`

      // Add viewport meta tag optimization for mobile popups
      this.optimizeViewportForPopup()
    }
  }

  /**
   * Restores the mobile viewport after popup closes
   * Call this after closing any popup on mobile devices
   */
  static closeMobilePopup(): void {
    this.popupCount = Math.max(0, this.popupCount - 1)

    // Only restore when all popups are closed
    if (this.popupCount === 0) {
      // Remove body scroll lock
      document.body.classList.remove('popup-open')
      document.body.style.top = ''

      // Restore scroll position
      window.scrollTo({
        top: this.originalScrollY,
        left: 0,
        behavior: 'instant',
      })

      // Restore original viewport settings
      this.restoreViewport()
    }
  }

  /**
   * Optimizes viewport settings for mobile popups
   */
  private static optimizeViewportForPopup(): void {
    // Find existing viewport meta tag
    let viewport = document.querySelector('meta[name="viewport"]') as HTMLMetaElement

    if (!viewport) {
      // Create viewport meta tag if it doesn't exist
      viewport = document.createElement('meta')
      viewport.name = 'viewport'
      document.head.appendChild(viewport)
    }

    // Store original viewport content
    viewport.setAttribute('data-original-content', viewport.content || '')

    // Set optimized viewport for popups
    viewport.content =
      'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover'
  }

  /**
   * Restores original viewport settings
   */
  private static restoreViewport(): void {
    const viewport = document.querySelector('meta[name="viewport"]') as HTMLMetaElement

    if (viewport) {
      const originalContent = viewport.getAttribute('data-original-content')
      if (originalContent) {
        viewport.content = originalContent
        viewport.removeAttribute('data-original-content')
      }
    }
  }

  /**
   * Checks if device is likely mobile based on various factors
   */
  static isMobileDevice(): boolean {
    // Check user agent for mobile patterns
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
    const isMobileUA = mobileRegex.test(navigator.userAgent)

    // Check screen size
    const isMobileScreen = window.innerWidth <= 768

    // Check touch capability
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0

    return isMobileUA || (isMobileScreen && isTouchDevice)
  }

  /**
   * Injects mobile-specific CSS for better popup positioning
   */
  static injectMobilePopupCSS(popupSelector: string = '.popup'): void {
    const styleId = `mobile-popup-fix-${popupSelector.replace(/[^a-zA-Z0-9]/g, '')}`

    // Remove existing style if present
    const existingStyle = document.getElementById(styleId)
    if (existingStyle) {
      existingStyle.remove()
    }

    const css = `
      <style id="${styleId}">
        @media (max-width: 768px) {
          ${popupSelector},
          ${popupSelector} iframe,
          ${popupSelector} .modal,
          ${popupSelector} .popup-content {
            position: fixed !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            width: 95vw !important;
            height: 90vh !important;
            max-width: 400px !important;
            max-height: 600px !important;
            z-index: 99999 !important;
            margin: 0 !important;
            padding: 0 !important;
            border-radius: 12px !important;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3) !important;
            overflow: hidden !important;
          }

          ${popupSelector}-overlay,
          ${popupSelector} + .overlay {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            background: rgba(0, 0, 0, 0.7) !important;
            z-index: 99998 !important;
          }
        }
      </style>
    `

    document.head.insertAdjacentHTML('beforeend', css)
  }

  /**
   * Creates a React hook for mobile popup management
   */
  static createMobilePopupHook() {
    return function useMobilePopup() {
      const [isPopupOpen, setIsPopupOpen] = React.useState(false)

      const openPopup = React.useCallback(() => {
        if (MobilePopupHelper.isMobileDevice()) {
          MobilePopupHelper.openMobilePopup()
        }
        setIsPopupOpen(true)
      }, [])

      const closePopup = React.useCallback(() => {
        if (MobilePopupHelper.isMobileDevice()) {
          MobilePopupHelper.closeMobilePopup()
        }
        setIsPopupOpen(false)
      }, [])

      // Cleanup on unmount
      React.useEffect(() => {
        return () => {
          if (isPopupOpen && MobilePopupHelper.isMobileDevice()) {
            MobilePopupHelper.closeMobilePopup()
          }
        }
      }, [isPopupOpen])

      return { openPopup, closePopup, isPopupOpen }
    }
  }
}

// Export individual functions for convenience
export const { openMobilePopup, closeMobilePopup, isMobileDevice, injectMobilePopupCSS } =
  MobilePopupHelper

// React import for the hook creator
import * as React from 'react'
