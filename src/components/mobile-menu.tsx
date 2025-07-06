'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X, Phone, Mail, MapPin, MessageCircle } from 'lucide-react'

interface MobileMenuProps {
  isOpen: boolean
  onToggle: () => void
}

export default function MobileMenu({ isOpen, onToggle }: MobileMenuProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const navItems = [
    { name: 'Home', href: '/', description: 'Welcome to Ralhum Sports' },
    { name: 'Brands', href: '/brands', description: 'Our exclusive partnerships' },
    { name: 'Sports', href: '/sports', description: 'Equipment for every sport' },
    { name: 'Products', href: '/products', description: 'Complete product range' },
    { name: 'About', href: '/about', description: 'Our 25+ year heritage' },
    { name: 'News', href: '/news', description: 'Latest updates & announcements' },
    { name: 'Contact', href: '/contact', description: 'Get in touch with us' },
  ]

  const handleWhatsApp = () => {
    const message =
      "Hello Ralhum Sports! I'm interested in your sports equipment. Please contact me."
    const whatsappUrl = `https://wa.me/94772350712?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
    onToggle()
  }

  if (!mounted) return null

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[90vw] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 md:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="text-xl font-black text-[#003DA5]">
            RALHUM<span className="text-[#FF3D00]">SPORTS</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            aria-label="Close menu"
            className="p-2"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-2 px-4">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={onToggle}
                className="block p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 group"
              >
                <div className="font-bold text-gray-900 group-hover:text-[#003DA5] transition-colors">
                  {item.name}
                </div>
                <div className="text-sm text-gray-500 mt-1">{item.description}</div>
              </a>
            ))}
          </nav>

          {/* Contact Section */}
          <div className="mt-8 px-4">
            <div className="bg-gradient-to-r from-[#003DA5] to-[#FF3D00] rounded-lg p-4 text-white">
              <h3 className="font-bold mb-3">Quick Contact</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4" />
                  <span>+94 11 250 8082</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4" />
                  <span>info@ralhumsports.lk</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>27, Hildon Place, Colombo 04</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 px-4 space-y-3">
            <Button
              onClick={handleWhatsApp}
              className="w-full bg-[#25D366] hover:bg-[#25D366]/90 text-white font-bold py-3"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              WhatsApp Us
            </Button>
            <a href="/contact" onClick={onToggle} className="block">
              <Button
                variant="outline"
                className="w-full border-2 border-[#FF3D00] text-[#FF3D00] hover:bg-[#FF3D00] hover:text-white font-bold py-3"
              >
                <Phone className="w-5 h-5 mr-2" />
                Get Quote
              </Button>
            </a>
          </div>

          {/* Footer */}
          <div className="mt-8 px-4 py-4 border-t border-gray-200">
            <Badge className="bg-[#FFD700] text-[#1A1A1A] font-bold">
              Sri Lanka&apos;s #1 Sports Distributor
            </Badge>
            <p className="text-xs text-gray-500 mt-2">
              25+ Years of Excellence • Exclusive Brand Partnerships
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
