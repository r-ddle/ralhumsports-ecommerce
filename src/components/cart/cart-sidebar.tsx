'use client'

import { useCart, useCartSummary } from '@/hooks/use-cart'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { CartItem } from './cart-item'
import { CheckoutButton } from './checkout-button'
import { ShoppingBag, Truck, ArrowRight, Gift, Lock, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

// Helper function to format currency
function formatCurrency(amount: number): string {
  return `LKR ${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

export function CartSidebar() {
  const { cart, isOpen, closeCart } = useCart()
  const summary = useCartSummary()
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)

    const handleChange = () => setReducedMotion(mediaQuery.matches)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return (
    <Sheet open={isOpen} onOpenChange={closeCart}>
      <SheetContent className="w-full sm:max-w-lg p-0 flex flex-col bg-white/95 backdrop-blur-xl border-l border-gray-200/50">
        <SheetHeader className="p-6 pb-4 bg-gradient-to-r from-blue-50/50 to-purple-50/50 backdrop-blur-sm">
          <SheetTitle className="flex items-center gap-2 text-xl font-bold text-gray-900">
            <motion.div
              initial={!reducedMotion ? { rotate: -10 } : {}}
              animate={{ rotate: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ShoppingBag className="w-5 h-5 text-[#003DA5]" />
            </motion.div>
            Shopping Cart ({summary.itemCount})
          </SheetTitle>
        </SheetHeader>

        {cart.items.length === 0 ? (
          <motion.div
            initial={!reducedMotion ? { opacity: 0, y: 20 } : { opacity: 1 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex-1 flex flex-col items-center justify-center p-6 text-center"
          >
            <motion.div
              initial={!reducedMotion ? { scale: 0.8, opacity: 0 } : { opacity: 1 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4"
            >
              <ShoppingBag className="w-10 h-10 text-gray-400" />
            </motion.div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-600 mb-6 max-w-sm">
              Discover our amazing sports equipment and start shopping!
            </p>
            <Button
              asChild
              onClick={closeCart}
              className="bg-[#003DA5] hover:bg-[#003DA5]/90 focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <Link href="/products">
                Browse Products
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </motion.div>
        ) : (
          <>
            {/* Free Shipping Progress */}
            <AnimatePresence>
              {!summary.freeShippingEligible ? (
                <motion.div
                  initial={!reducedMotion ? { opacity: 0, height: 0 } : { opacity: 1 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={!reducedMotion ? { opacity: 0, height: 0 } : { opacity: 0 }}
                  className="px-6 py-3 bg-gradient-to-r from-[#AEEA00]/10 to-[#FFD700]/10 border-l-4 border-[#AEEA00] backdrop-blur-sm"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Truck className="w-4 h-4 text-[#003DA5]" />
                    <span className="text-sm font-medium text-gray-900">
                      Add {formatCurrency(summary.freeShippingRemaining)} for FREE shipping!
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${Math.min(100, (summary.subtotal / summary.freeShippingThreshold) * 100)}%`,
                      }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="bg-gradient-to-r from-[#AEEA00] to-[#FFD700] h-2 rounded-full"
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={!reducedMotion ? { opacity: 0, scale: 0.95 } : { opacity: 1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="px-6 py-3 bg-gradient-to-r from-[#AEEA00]/20 to-[#FFD700]/20 border-l-4 border-[#AEEA00] backdrop-blur-sm"
                >
                  <div className="flex items-center gap-2">
                    <Gift className="w-4 h-4 text-[#003DA5]" />
                    <span className="text-sm font-medium text-gray-900">
                      🎉 You qualify for FREE shipping!
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Cart Items */}
            <ScrollArea className="flex-1 px-6">
              <motion.div
                initial={!reducedMotion ? { opacity: 0 } : { opacity: 1 }}
                animate={{ opacity: 1 }}
                className="space-y-4 py-4"
              >
                <AnimatePresence>
                  {cart.items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={!reducedMotion ? { opacity: 0, y: 20 } : { opacity: 1 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <CartItem item={item} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </ScrollArea>

            <div className="border-t border-gray-200/50 p-6 space-y-4 bg-white/80 backdrop-blur-sm">
              {/* Order Summary */}
              <motion.div
                initial={!reducedMotion ? { opacity: 0, y: 10 } : { opacity: 1 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3 p-4 bg-gray-50/50 rounded-2xl backdrop-blur-sm"
              >
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatCurrency(summary.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {summary.shipping === 0 ? (
                      <Badge variant="secondary" className="bg-[#AEEA00] text-[#1A1A1A] text-xs">
                        FREE
                      </Badge>
                    ) : (
                      formatCurrency(summary.shipping)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (15%)</span>
                  <span className="font-medium">{formatCurrency(summary.tax)}</span>
                </div>
                <Separator className="bg-gray-300" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <motion.span
                    key={summary.total}
                    initial={!reducedMotion ? { scale: 1.1 } : {}}
                    animate={{ scale: 1 }}
                    className="text-[#003DA5]"
                  >
                    {formatCurrency(summary.total)}
                  </motion.span>
                </div>
              </motion.div>

              {/* Security Badge */}
              <motion.div
                initial={!reducedMotion ? { opacity: 0 } : { opacity: 1 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center justify-center gap-2 text-xs text-gray-600 bg-gray-50/80 rounded-xl p-3 backdrop-blur-sm"
              >
                <ShieldCheck className="w-4 h-4 text-green-600" />
                <span>Secure SSL encrypted checkout</span>
                <Lock className="w-3 h-3 text-green-600" />
              </motion.div>

              {/* Checkout Button */}
              <motion.div
                initial={!reducedMotion ? { opacity: 0, y: 10 } : { opacity: 1 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <CheckoutButton />
              </motion.div>

              {/* Continue Shopping */}
              <Button
                variant="outline"
                size="lg"
                className="w-full border-[#003DA5]/30 text-[#003DA5] hover:bg-[#003DA5]/5 hover:border-[#003DA5] backdrop-blur-sm focus-visible:ring-2 focus-visible:ring-blue-500 bg-transparent"
                onClick={closeCart}
                asChild
              >
                <Link href="/products">Continue Shopping</Link>
              </Button>

              {/* Payment Methods - Coming Soon */}
              <motion.div
                initial={!reducedMotion ? { opacity: 0 } : { opacity: 1 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center"
              >
                <p className="text-xs text-gray-600 mb-2">Online payment methods</p>
                <div className="flex justify-center gap-2 opacity-50 pointer-events-none select-none">
                  {['Visa', 'Mastercard', 'PayPal', 'Apple Pay'].map((method) => (
                    <div
                      key={method}
                      className="bg-gray-100 rounded-lg px-3 py-2 text-xs font-medium text-gray-400 backdrop-blur-sm"
                    >
                      {method}
                    </div>
                  ))}
                </div>
                <div className="text-xs text-gray-400 mt-1">Coming soon</div>
              </motion.div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
