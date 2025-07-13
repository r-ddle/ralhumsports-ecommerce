'use client'

import { useCart } from '@/hooks/use-cart'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShoppingBag } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

export function CartButton() {
  const { cart, toggleCart } = useCart()
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)

    const handleChange = () => setReducedMotion(mediaQuery.matches)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleCart}
      className="relative p-2 hover:bg-white/80 backdrop-blur-sm rounded-xl transition-all duration-300 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
      aria-label={`Shopping cart with ${cart.itemCount} items`}
      aria-expanded={cart.isOpen}
    >
      <motion.div
        whileHover={!reducedMotion ? { scale: 1.1 } : {}}
        whileTap={!reducedMotion ? { scale: 0.9 } : {}}
        transition={{ duration: 0.2 }}
      >
        <ShoppingBag className="w-5 h-5" />
      </motion.div>

      <AnimatePresence>
        {cart.itemCount > 0 && (
          <motion.div
            initial={!reducedMotion ? { scale: 0, opacity: 0 } : { opacity: 1 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={!reducedMotion ? { scale: 0, opacity: 0 } : { opacity: 0 }}
            transition={
              reducedMotion ? { duration: 0.1 } : { type: 'spring', stiffness: 500, damping: 30 }
            }
            className="absolute -top-1 -right-1"
          >
            <Badge
              variant="destructive"
              className="h-5 w-5 flex items-center justify-center p-0 text-xs font-bold bg-[#FF3D00] hover:bg-[#FF3D00] rounded-full shadow-lg border-2 border-white"
            >
              {cart.itemCount > 99 ? '99+' : cart.itemCount}
            </Badge>
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  )
}
