'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Menu, X, Phone } from 'lucide-react'
import { CartButton } from '@/components/cart/cart-button'
import Link from 'next/link'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Brands', href: '/brands' },
    { name: 'Store', href: '/products' },
    { name: 'About', href: '/about' },
    { name: 'Track', href: '/orders/track' },
    { name: 'Verify', href: '/products/verify' },
  ]

  return (
    <nav className="fixed top-0 w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Fixed alignment */}
          <div className="flex items-center flex-shrink-0 h-16">
            <Link
              href="/"
              className="text-2xl sm:text-2xl font-black text-[#003DA5] dark:text-[#4A90E2] hover:opacity-80 transition-opacity flex items-center h-full"
            >
              RALHUM
              <span className="text-[#FF3D00] dark:text-[#FF6B47]">SPORTS</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 mt-5">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 dark:text-gray-300 hover:text-[#003DA5] dark:hover:text-[#4A90E2] font-medium transition-colors duration-200 relative group"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#003DA5] dark:bg-[#4A90E2] group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </div>

          {/* Desktop Actions - Fixed alignment */}
          <div className="hidden md:flex items-center space-x-3">
            <CartButton />
            <Button
              size="sm"
              className="bg-[#FF3D00] hover:bg-[#FF3D00]/90 text-white font-bold px-4 py-2 rounded-full transition-all hover:scale-105"
              asChild
            >
              <Link href="/contact">
                <Phone className="w-4 h-4 mr-2" />
                CONTACT
              </Link>
            </Button>
          </div>

          {/* Mobile Actions - Fixed alignment and spacing */}
          <div className="md:hidden flex items-center space-x-2">
            <CartButton />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              className="dark:text-gray-300 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation - Improved layout */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-gray-900 shadow-lg">
              <div role="menu" id="mobile-menu">
                <div role="none">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="block w-full text-left px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-[#003DA5] dark:hover:text-[#4A90E2] hover:bg-gray-50 dark:hover:bg-gray-800 font-medium rounded-lg transition-colors duration-200 text-base"
                      role="menuitem"
                      tabIndex={0}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <div className="px-4 py-3" role="none">
                    <Button
                      size="lg"
                      className="w-full bg-[#FF3D00] hover:bg-[#FF3D00]/90 text-white font-bold py-3 text-base rounded-full"
                      onClick={() => setIsOpen(false)}
                      asChild
                    >
                      <Link href="/contact" role="menuitem" tabIndex={0}>
                        <Phone className="w-5 h-5 mr-2" />
                        CONTACT
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
