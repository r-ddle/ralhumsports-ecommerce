'use client'

import type React from 'react'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X, Phone, Mail, MapPin, MessageCircle, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { SITE_CONFIG } from '@/config/site-config'

interface MobileMenuProps {
  isOpen: boolean
  onToggle: () => void
}

export default function MobileMenu({ isOpen, onToggle }: MobileMenuProps) {
  const [mounted, setMounted] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    setMounted(true)

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const navItems = [
    { name: 'Home', href: '/', description: 'Welcome to Ralhum Sports', icon: '🏠' },
    { name: 'Brands', href: '/brands', description: 'Our exclusive partnerships', icon: '🏆' },
    { name: 'Sports', href: '/sports', description: 'Equipment for every sport', icon: '⚽' },
    { name: 'Products', href: '/products', description: 'Complete product range', icon: '🛍️' },
    { name: 'About', href: '/about', description: 'Our 25+ year heritage', icon: '📖' },
    { name: 'News', href: '/news', description: 'Latest updates & announcements', icon: '📰' },
    { name: 'Contact', href: '/contact', description: 'Get in touch with us', icon: '📞' },
  ]

  const handleWhatsApp = () => {
    const message = SITE_CONFIG.whatsapp.message
    const whatsappUrl = `https://wa.me/${SITE_CONFIG.contact.whatsapp.replace('+', '')}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
    onToggle()
  }

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      onToggle()
    }
  }

  if (!mounted) return null

  const menuVariants = {
    closed: {
      opacity: 0,
      x: '100%',
      transition: {
        duration: reducedMotion ? 0 : 0.3,
        ease: 'easeInOut',
      },
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: reducedMotion ? 0 : 0.3,
        ease: 'easeOut',
        staggerChildren: reducedMotion ? 0 : 0.05,
        delayChildren: reducedMotion ? 0 : 0.1,
      },
    },
  }

  const itemVariants = {
    closed: { opacity: 0, x: 20 },
    open: {
      opacity: 1,
      x: 0,
      transition: { duration: reducedMotion ? 0 : 0.3 },
    },
  }

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            onClick={onToggle}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed top-0 right-0 h-full w-80 max-w-[90vw] bg-white/95 backdrop-blur-xl shadow-2xl z-50 md:hidden overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
            onKeyDown={handleKeyDown}
            style={{
              background:
                'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
              backdropFilter: 'blur(20px)',
              borderLeft: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            {/* Header */}
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-between p-4 border-b border-gray-200/50 bg-gradient-to-r from-[#003DA5]/5 to-[#FF3D00]/5"
            >
              <div className="text-xl font-black">
                <span className="text-[#003DA5]">RALHUM</span>
                <span className="text-[#FF3D00]">SPORTS</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                aria-label="Close menu"
                className="p-2 hover:bg-gray-100/50 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-[#003DA5] focus-visible:ring-offset-2"
              >
                <X className="w-6 h-6" />
              </Button>
            </motion.div>

            {/* Navigation Items */}
            <div className="flex-1 overflow-y-auto py-4">
              <nav className="space-y-2 px-4">
                {navItems.map((item, index) => (
                  <motion.div key={item.name} variants={itemVariants}>
                    <Link
                      href={item.href}
                      onClick={onToggle}
                      className="block p-4 rounded-xl hover:bg-gradient-to-r hover:from-[#003DA5]/5 hover:to-[#FF3D00]/5 transition-all duration-200 group border border-transparent hover:border-gray-200/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#003DA5] focus-visible:ring-offset-2"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl" role="img" aria-hidden="true">
                          {item.icon}
                        </span>
                        <div className="flex-1">
                          <div className="font-bold text-gray-900 group-hover:text-[#003DA5] transition-colors flex items-center justify-between">
                            {item.name}
                            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-200" />
                          </div>
                          <div className="text-sm text-gray-500 mt-1 group-hover:text-gray-600 transition-colors">
                            {item.description}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Contact Section */}
              <motion.div variants={itemVariants} className="mt-8 px-4">
                <div className="bg-gradient-to-r from-[#003DA5] to-[#FF3D00] rounded-xl p-4 text-white shadow-lg">
                  <h3 className="font-bold mb-3 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Quick Contact
                  </h3>
                  <div className="space-y-3">
                    <a
                      href={`tel:${SITE_CONFIG.contact.phone}`}
                      className="flex items-center gap-3 text-sm hover:text-yellow-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#003DA5] rounded"
                    >
                      <Phone className="w-4 h-4" />
                      <span>{SITE_CONFIG.contact.phone}</span>
                    </a>
                    <a
                      href={`mailto:${SITE_CONFIG.contact.email}`}
                      className="flex items-center gap-3 text-sm hover:text-yellow-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#003DA5] rounded"
                    >
                      <Mail className="w-4 h-4" />
                      <span>{SITE_CONFIG.contact.email}</span>
                    </a>
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span>{SITE_CONFIG.contact.address}</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div variants={itemVariants} className="mt-6 px-4 space-y-3">
                <Button
                  onClick={handleWhatsApp}
                  className="w-full bg-[#25D366] hover:bg-[#25D366]/90 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  WhatsApp Us
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-2 border-[#FF3D00] text-[#FF3D00] hover:bg-[#FF3D00] hover:text-white font-bold py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-[#FF3D00] focus-visible:ring-offset-2 bg-transparent"
                  onClick={onToggle}
                  asChild
                >
                  <Link href="/contact">
                    <Phone className="w-5 h-5 mr-2" />
                    Get Quote
                  </Link>
                </Button>
              </motion.div>

              {/* Footer */}
              <motion.div
                variants={itemVariants}
                className="mt-8 px-4 py-4 border-t border-gray-200/50"
              >
                <Badge className="bg-[#FFD700] text-[#1A1A1A] font-bold mb-2 shadow-sm">
                  Sri Lanka&apos;s #1 Sports Distributor
                </Badge>
                <p className="text-xs text-gray-500 leading-relaxed">
                  25+ Years of Excellence • Exclusive Brand Partnerships • Trusted by Athletes
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
