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

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape' && isOpen) {
      setIsOpen(false)
    }
  }

  return (
    <>
      {/* Main Navigation */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 w-[90%] max-w-[1000px] rounded-3xl mt-3 mx-auto border border-white/20 bg-white/80 backdrop-blur-lg shadow-2xl transition-all duration-300"
        role="navigation"
        aria-label="Main navigation"
        onKeyDown={handleKeyDown}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <motion.div
              className="flex items-center flex-shrink-0"
              whileHover={!reducedMotion ? { scale: 1.05 } : {}}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <Link
                href="/"
                className="text-2xl font-black tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-lg"
                style={{ color: SITE_CONFIG.branding.colors.primary }}
                aria-label="Ralhum Sports - Home"
              >
                <Image
                  width={100}
                  height={100}
                  src={SITE_CONFIG.branding.logoImage || '/placeholder.svg'}
                  alt={SITE_CONFIG.branding.logoText}
                  className="h-24 w-auto"
                  priority
                />
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div
              className="hidden md:flex items-center space-x-1 relative"
              style={{ minHeight: 56 }}
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
                      borderRadius: '1rem',
                      background: '#101014',
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
                    className={`relative px-5 py-2 text-base font-semibold rounded-xl transition-all duration-150 group overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
                      ${hoveredIdx === index ? 'text-white font-bold' : 'text-gray-800'}`}
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
            <div className="hidden md:flex items-center space-x-3">
              <motion.div
                whileHover={!reducedMotion ? { scale: 1.1 } : {}}
                whileTap={!reducedMotion ? { scale: 0.98 } : {}}
              >
                <div style={{ transform: 'scale(1.25)' }}>
                  <CartButton />
                </div>
              </motion.div>
              <motion.div
                whileHover={!reducedMotion ? { scale: 1.05 } : {}}
                whileTap={!reducedMotion ? { scale: 0.95 } : {}}
              >
                <Button
                  size="sm"
                  className="font-bold px-5 py-2 rounded-full transition-all text-white shadow-lg hover:shadow-xl focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2"
                  style={{
                    background: `linear-gradient(135deg, ${SITE_CONFIG.branding.colors.orange}, #ff6b35)`,
                  }}
                  asChild
                >
                  <Link href="/contact">
                    <Phone className="w-4 h-4 mr-2" />
                    {SITE_CONFIG.branding.cta.contact}
                  </Link>
                </Button>
              </motion.div>
            </div>

            {/* Mobile Actions */}
            <div className="md:hidden flex items-center space-x-2">
              <motion.div
                whileHover={!reducedMotion ? { scale: 1.1 } : {}}
                whileTap={!reducedMotion ? { scale: 0.98 } : {}}
              >
                <div style={{ transform: 'scale(1.25)' }}>
                  <CartButton />
                </div>
              </motion.div>
              <motion.button
                whileHover={!reducedMotion ? { scale: 1.05 } : {}}
                whileTap={!reducedMotion ? { scale: 0.95 } : {}}
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-full hover:bg-gray-100/50 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
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
                      <X className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={!reducedMotion ? { rotate: 90, opacity: 0 } : { opacity: 1 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={!reducedMotion ? { rotate: -90, opacity: 0 } : { opacity: 0 }}
                      transition={{ duration: reducedMotion ? 0.1 : 0.2 }}
                    >
                      <Menu className="w-6 h-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
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
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
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
              className="fixed top-20 left-4 right-4 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 z-50 md:hidden overflow-hidden"
              style={{
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)',
              }}
              role="menu"
              aria-label="Mobile navigation menu"
            >
              <div className="p-6">
                <div className="space-y-1">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={!reducedMotion ? { opacity: 0, x: -20 } : { opacity: 1 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: reducedMotion ? 0 : index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="block w-full text-left px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 font-medium rounded-2xl transition-all duration-200 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        role="menuitem"
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  ))}

                  <motion.div
                    initial={!reducedMotion ? { opacity: 0, y: 20 } : { opacity: 1 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: reducedMotion ? 0 : navItems.length * 0.1 }}
                    className="pt-4 border-t border-gray-200 mt-4"
                  >
                    <Button
                      size="lg"
                      className="w-full font-bold py-3 text-base rounded-2xl text-white shadow-lg focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2"
                      style={{
                        background: `linear-gradient(135deg, ${SITE_CONFIG.branding.colors.orange}, #ff6b35)`,
                      }}
                      onClick={() => setIsOpen(false)}
                      asChild
                    >
                      <Link href="/contact">
                        <Phone className="w-5 h-5 mr-2" />
                        {SITE_CONFIG.branding.cta.contact}
                      </Link>
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
