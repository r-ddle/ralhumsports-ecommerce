'use client'

import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { useCart } from '@/hooks/use-cart'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export function CheckoutButton() {
  const { cart, closeCart } = useCart()
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)

    const handleChange = () => setReducedMotion(mediaQuery.matches)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  if (cart.items.length === 0) {
    return null
  }

  return (
    <motion.div
      whileHover={!reducedMotion ? { scale: 1.02 } : {}}
      whileTap={!reducedMotion ? { scale: 0.98 } : {}}
      transition={{ duration: 0.2 }}
    >
      <Button
        size="lg"
        className="w-full bg-gradient-to-r from-[#FF3D00] to-[#FF6B47] hover:from-[#FF3D00]/90 hover:to-[#FF6B47]/90 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2"
        asChild
        onClick={closeCart}
      >
        <Link href="/checkout" className="flex items-center justify-center gap-2">
          <ShoppingCart className="w-5 h-5" />
          Proceed to Checkout
        </Link>
      </Button>
    </motion.div>
  )
}
