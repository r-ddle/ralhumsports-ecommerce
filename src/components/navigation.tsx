'use client'

import React, { useState, useEffect } from 'react'
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

  // Update squircle position/size on hover
  useEffect(() => {
    if (hoveredIdx !== null && navRefs.current[hoveredIdx]?.current) {
      const rect = navRefs.current[hoveredIdx]!.current!.getBoundingClientRect()
      const parentRect =
        navRefs.current[hoveredIdx]!.current!.parentElement!.parentElement!.getBoundingClientRect()
      setSquircle({
        left: rect.left - parentRect.left,
        top: rect.top - parentRect.top,
        width: rect.width,
        height: rect.height,
        visible: true,
      })
    } else {
      setSquircle((s) => ({ ...s, visible: false }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hoveredIdx])

  return (
    <>
      {/* Main Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 w-[90%] max-w-[1000px] rounded-3xl mt-3 mx-auto border border-white/20 bg-white/80 backdrop-blur-lg shadow-2xl transition-all duration-300`}
      >
        <div className={`mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl`}>
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <motion.div
              className="flex items-center flex-shrink-0"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <Link
                href="/"
                className="text-2xl font-black tracking-tight"
                style={{ color: SITE_CONFIG.branding.colors.primary }}
              >
                <Image
                  width={100}
                  height={100}
                  src={SITE_CONFIG.branding.logoImage}
                  alt={SITE_CONFIG.branding.logoText}
                  className="h-24 w-auto"
                />
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div
              className="hidden md:flex items-center space-x-1 relative"
              style={{ minHeight: 56 }}
            >
              {/* Shared rectangle background */}
              <AnimatePresence>
                {squircle.visible && (
                  <motion.div
                    key="squircle-bg"
                    initial={{ opacity: 0, scale: 0.98 }}
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
                      background: '#18181b', // solid dark
                      pointerEvents: 'none',
                    }}
                  />
                )}
              </AnimatePresence>
              {navItems.map((item, index) => (
                <div key={item.name} className="relative z-10">
                  <Link
                    href={item.href}
                    ref={navRefs.current[index]}
                    className={`relative px-5 py-2 text-base font-semibold rounded-xl transition-all duration-150 group overflow-hidden
                      ${hoveredIdx === index ? 'text-white font-bold' : 'text-gray-800'}`}
                    style={{ zIndex: 2 }}
                    onMouseEnter={() => setHoveredIdx(index)}
                    onMouseLeave={() => setHoveredIdx(null)}
                  >
                    <span className="relative z-10">{item.name}</span>
                  </Link>
                </div>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-3">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <CartButton />
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="sm"
                  className="font-bold px-5 py-2 rounded-full transition-all text-white shadow-lg hover:shadow-xl"
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
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <CartButton />
              </motion.div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-full hover:bg-gray-100/50 transition-all"
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
              >
                <AnimatePresence mode="wait">
                  {isOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
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
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Mobile Menu */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
              }}
              className="fixed top-20 left-4 right-4 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 z-50 md:hidden overflow-hidden"
              style={{
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)',
              }}
            >
              <div className="p-6">
                <div className="space-y-1">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="block w-full text-left px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 font-medium rounded-2xl transition-all duration-200 text-base"
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  ))}

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: navItems.length * 0.1 }}
                    className="pt-4 border-t border-gray-200 mt-4"
                  >
                    <Button
                      size="lg"
                      className="w-full font-bold py-3 text-base rounded-2xl text-white shadow-lg"
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
