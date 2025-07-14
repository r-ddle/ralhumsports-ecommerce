'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Menu, X, Phone } from 'lucide-react'
import { CartButton } from '@/components/cart/cart-button'
import Link from 'next/link'
import { SITE_CONFIG } from '@/config/site-config'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const [squircle, setSquircle] = useState({ left: 0, top: 0, width: 0, height: 0, visible: false })
  const [isMobile, setIsMobile] = useState(false)
  const [squircleAnimated, setSquircleAnimated] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const lastSquircle = useRef({ left: 0, top: 0, width: 0, height: 0 })

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Brands', href: '/brands' },
    { name: 'Store', href: '/products' },
    { name: 'About', href: '/about' },
    { name: 'Track', href: '/orders/track' },
    { name: 'Verify', href: '/products/verify' },
  ]

  const navRefs = React.useRef<React.RefObject<HTMLAnchorElement>[]>([])
  if (navRefs.current.length !== navItems.length) {
    navRefs.current = Array.from({ length: navItems.length }, () =>
      React.createRef<HTMLAnchorElement>(),
    ) as React.RefObject<HTMLAnchorElement>[]
  }

  // Detect mobile and reduced motion
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    setReducedMotion(mediaQuery.matches)
    checkMobile()

    const handleMotionChange = () => setReducedMotion(mediaQuery.matches)

    window.addEventListener('resize', checkMobile)
    mediaQuery.addEventListener('change', handleMotionChange)

    return () => {
      window.removeEventListener('resize', checkMobile)
      mediaQuery.removeEventListener('change', handleMotionChange)
    }
  }, [])

  // Update squircle position/size on hover (desktop only)
  useEffect(() => {
    if (isMobile || reducedMotion) {
      setSquircle((s) => ({ ...s, visible: false }))
      return
    }
    if (hoveredIdx !== null && navRefs.current[hoveredIdx]?.current) {
      const rect = navRefs.current[hoveredIdx]!.current!.getBoundingClientRect()
      const parentRect =
        navRefs.current[hoveredIdx]!.current!.parentElement!.parentElement!.getBoundingClientRect()
      const newSquircle = {
        left: rect.left - parentRect.left,
        top: rect.top - parentRect.top,
        width: rect.width,
        height: rect.height,
        visible: true,
      }
      setSquircle((prev) => {
        if (!prev.visible) {
          lastSquircle.current = newSquircle
          if (!squircleAnimated) setSquircleAnimated(true)
          return newSquircle
        }
        lastSquircle.current = newSquircle
        return newSquircle
      })
    } else {
      setSquircle((s) => ({ ...s, visible: false }))
    }
  }, [hoveredIdx, isMobile, reducedMotion])

  return (
    <>
      {/* Main Navigation */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 w-[95%] sm:w-[90%] max-w-[1000px] rounded-2xl sm:rounded-3xl mt-2 sm:mt-3 mx-auto border border-brand-border bg-brand-surface/90 backdrop-blur-lg shadow-xl transition-all duration-300"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="mx-auto px-3 sm:px-4 lg:px-8 max-w-7xl">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0">
              <Link
                href="/"
                className="text-xl sm:text-2xl font-black tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 rounded-lg"
                style={{ color: SITE_CONFIG.branding.colors.primary }}
                aria-label="Ralhum Sports - Home"
              >
                <Image
                  width={80}
                  height={80}
                  src={SITE_CONFIG.branding.logoImage || '/placeholder.svg'}
                  alt={SITE_CONFIG.branding.logoText}
                  className="h-16 sm:h-20 lg:h-24 w-auto"
                  priority
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div
              className="hidden md:flex items-center space-x-1 relative"
              style={{ minHeight: 48 }}
              role="menubar"
            >
              {/* Shared rectangle background */}
              <AnimatePresence>
                {!isMobile && !reducedMotion && squircle.visible && (
                  <motion.div
                    key="squircle-bg"
                    initial={
                      squircleAnimated
                        ? {
                            opacity: 1,
                            scale: 1,
                            left: squircle.left,
                            top: squircle.top,
                            width: squircle.width,
                            height: squircle.height,
                          }
                        : {
                            opacity: 0,
                            scale: 0.98,
                            left: lastSquircle.current.left,
                            top: lastSquircle.current.top,
                            width: lastSquircle.current.width,
                            height: lastSquircle.current.height,
                          }
                    }
                    animate={{
                      opacity: 1,
                      scale: 1,
                      left: squircle.left,
                      top: squircle.top,
                      width: squircle.width,
                      height: squircle.height,
                    }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 600, damping: 30, mass: 0.7 }}
                    style={{
                      position: 'absolute',
                      zIndex: 1,
                      borderRadius: '0.75rem',
                      background: '#2D3436',
                      pointerEvents: 'none',
                    }}
                  />
                )}
              </AnimatePresence>
              {navItems.map((item, index) => (
                <div key={item.name} className="relative z-10" role="none">
                  <Link
                    href={item.href}
                    ref={navRefs.current[index]}
                    className={`relative px-3 lg:px-4 py-2 text-sm lg:text-base font-semibold rounded-xl transition-all duration-150 group overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2
                      ${hoveredIdx === index ? 'text-white font-bold' : 'text-text-primary'}`}
                    style={{ zIndex: 2 }}
                    onMouseEnter={() => setHoveredIdx(index)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    role="menuitem"
                    aria-label={`Navigate to ${item.name}`}
                  >
                    <span className="relative z-10">{item.name}</span>
                  </Link>
                </div>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-2 lg:space-x-3">
              <div style={{ transform: 'scale(1.1)' }}>
                <CartButton />
              </div>
              <Button
                size="sm"
                className="font-bold px-3 lg:px-5 py-2 text-sm lg:text-base rounded-full transition-all text-white shadow-lg hover:shadow-xl focus-visible:ring-2 focus-visible:ring-offset-2"
                style={{ background: 'linear-gradient(135deg, var(--primary-orange), #FF8B35)' }}
                asChild
              >
                <Link href="/contact">
                  <Phone className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                  <span className="hidden lg:inline">{SITE_CONFIG.branding.cta.contact}</span>
                  <span className="lg:hidden">Contact</span>
                </Link>
              </Button>
            </div>

            {/* Mobile Actions */}
            <div className="md:hidden flex items-center space-x-2">
              <div style={{ transform: 'scale(1.1)' }}>
                <CartButton />
              </div>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                style={{ backgroundColor: 'transparent' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--surface-hover)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isOpen}
                aria-controls="mobile-menu"
              >
                <AnimatePresence mode="wait">
                  {isOpen ? (
                    <motion.div
                      key="close"
                      initial={!reducedMotion ? { rotate: -90, opacity: 0 } : { opacity: 1 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={!reducedMotion ? { rotate: 90, opacity: 0 } : { opacity: 0 }}
                      transition={{ duration: reducedMotion ? 0.1 : 0.2 }}
                    >
                      <X className="w-5 h-5 sm:w-6 sm:h-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={!reducedMotion ? { rotate: 90, opacity: 0 } : { opacity: 1 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={!reducedMotion ? { rotate: -90, opacity: 0 } : { opacity: 0 }}
                      transition={{ duration: reducedMotion ? 0.1 : 0.2 }}
                    >
                      <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reducedMotion ? 0.1 : 0.2 }}
              className="fixed inset-0 backdrop-blur-sm z-40 md:hidden"
              style={{ backgroundColor: 'rgba(45, 52, 54, 0.2)' }}
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />

            {/* Mobile Menu */}
            <motion.div
              id="mobile-menu"
              initial={!reducedMotion ? { opacity: 0, y: -20, scale: 0.95 } : { opacity: 0 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={!reducedMotion ? { opacity: 0, y: -20, scale: 0.95 } : { opacity: 0 }}
              transition={
                reducedMotion
                  ? { duration: 0.1 }
                  : {
                      type: 'spring',
                      stiffness: 300,
                      damping: 30,
                    }
              }
              className="fixed top-16 sm:top-20 left-3 right-3 sm:left-4 sm:right-4 bg-brand-surface/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-brand-border z-50 md:hidden overflow-hidden"
              role="menu"
              aria-label="Mobile navigation menu"
            >
              <div className="p-4 sm:p-6">
                <div className="space-y-1">
                  {navItems.map((item, index) => (
                    <div key={item.name}>
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="block w-full text-left px-3 sm:px-4 py-2 sm:py-3 text-text-primary hover:text-brand-primary hover:bg-gray-50 font-medium rounded-xl sm:rounded-2xl transition-all duration-200 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
                        role="menuitem"
                      >
                        {item.name}
                      </Link>
                    </div>
                  ))}

                  <div className="pt-3 sm:pt-4 border-t border-brand-border mt-3 sm:mt-4">
                    <Button
                      size="lg"
                      className="w-full font-bold py-3 text-base rounded-xl sm:rounded-2xl text-white shadow-lg focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 bg-brand-primary hover:bg-primary-600"
                      onClick={() => setIsOpen(false)}
                      asChild
                    >
                      <Link href="/contact">
                        <Phone className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        {SITE_CONFIG.branding.cta.contact}
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
