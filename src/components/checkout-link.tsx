'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { useCart } from '@/hooks/use-cart'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export function CheckoutLink() {
  const { cart } = useCart()
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  if (cart.items.length === 0) {
    return null
  }

  return (
    <motion.div
      initial={!reducedMotion ? { opacity: 0, scale: 0.9 } : { opacity: 1 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={!reducedMotion ? { opacity: 0, scale: 0.9 } : { opacity: 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.2 }}
      whileHover={!reducedMotion ? { scale: 1.05 } : {}}
      whileTap={!reducedMotion ? { scale: 0.95 } : {}}
    >
      <Button
        variant="outline"
        size="sm"
        className="relative border-[#003DA5] text-[#003DA5] hover:bg-[#003DA5] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md backdrop-blur-sm bg-white/90 focus-visible:ring-2 focus-visible:ring-[#003DA5] focus-visible:ring-offset-2"
        asChild
      >
        <Link href="/checkout" aria-label={`Checkout with ${cart.itemCount} items`}>
          <ShoppingCart className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Checkout</span>
          <span className="sm:hidden">Cart</span>
          {cart.itemCount > 0 && (
            <motion.div
              initial={!reducedMotion ? { scale: 0 } : { scale: 1 }}
              animate={{ scale: 1 }}
              transition={{
                type: 'spring',
                stiffness: 500,
                damping: 30,
                duration: reducedMotion ? 0 : undefined,
              }}
            >
              <Badge
                variant="destructive"
                className="ml-2 bg-[#FF3D00] text-white hover:bg-[#FF3D00]/90 transition-colors min-w-[1.25rem] h-5 flex items-center justify-center text-xs font-bold"
                aria-label={`${cart.itemCount} items in cart`}
              >
                {cart.itemCount > 99 ? '99+' : cart.itemCount}
              </Badge>
            </motion.div>
          )}
        </Link>
      </Button>
    </motion.div>
  )
}
