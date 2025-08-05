'use client'

import { useOrders, useOrdersSummary } from '@/hooks/use-orders'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

export function OrdersButton() {
  const { toggleOrders } = useOrders()
  const { orderCount } = useOrdersSummary()
  const [showPulse, setShowPulse] = useState(false)

  // Start pulse animation when orders are present and stop after 5 seconds
  useEffect(() => {
    if (orderCount > 0) {
      setShowPulse(true)
      const timer = setTimeout(() => {
        setShowPulse(false)
      }, 5000)

      return () => clearTimeout(timer)
    } else {
      setShowPulse(false)
    }
  }, [orderCount])

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleOrders}
      className="relative p-2 h-10 w-10 rounded-full hover:bg-brand-background/50 focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 transition-all duration-200"
      aria-label={`View orders (${orderCount} orders)`}
    >
      <Clock className="w-5 h-5" />

      {/* Order Count Badge */}
      <AnimatePresence>
        {orderCount > 0 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 500,
              damping: 30,
              duration: 0.3,
            }}
            className="absolute -top-1 -right-1"
          >
            <Badge
              variant="destructive"
              className="absolute top-[2.5px] -right-1 h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center p-0 text-xs font-bold bg-brand-secondary hover:bg-brand-secondary rounded-full shadow-lg border-2 border-brand-surface"
            >
              {orderCount > 99 ? '99+' : orderCount}
            </Badge>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pulse Animation for New Orders */}
      {orderCount > 0 && showPulse && (
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-brand-secondary"
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ scale: 1.2, opacity: 0 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      )}
    </Button>
  )
}
