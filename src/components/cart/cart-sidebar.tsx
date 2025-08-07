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

  return (
    <Sheet open={isOpen} onOpenChange={closeCart}>
      <SheetContent className="w-full sm:max-w-lg p-0 flex flex-col bg-brand-surface border-l border-brand-border h-full max-h-[100vh] overflow-hidden">
        <SheetHeader className="flex-shrink-0 p-3 sm:p-6 pb-2 sm:pb-4 bg-gradient-to-r from-blue-50 to-purple-50">
          <SheetTitle className="flex items-center gap-2 text-base sm:text-xl font-bold text-text-primary">
            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-brand-secondary" />
            Shopping Cart ({summary.itemCount})
          </SheetTitle>
        </SheetHeader>

        {cart.items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">Your cart is empty</h3>
            <p className="text-text-secondary mb-6 max-w-sm text-sm sm:text-base">
              Discover our amazing sports equipment and start shopping!
            </p>
            <Button
              asChild
              onClick={closeCart}
              className="bg-brand-secondary hover:bg-secondary-600 focus-visible:ring-2 focus-visible:ring-brand-secondary text-white"
            >
              <Link href="/products">
                Browse Products
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Cart Items - Scrollable with constrained height */}
            <div className="flex-1 overflow-hidden min-h-0">
              <ScrollArea className="h-full px-3 sm:px-6">
                <div className="space-y-2 sm:space-y-4 py-3 sm:py-4">
                  {cart.items.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Fixed Bottom Section - Always visible */}
            <div className="flex-shrink-0 border-t border-brand-border p-3 sm:p-6 space-y-3 sm:space-y-4 bg-brand-surface max-h-[50vh] overflow-y-auto">
              {/* Order Summary */}
              <div className="space-y-2 sm:space-y-3 p-2 sm:p-4 bg-gray-50 rounded-lg sm:rounded-2xl">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-text-secondary">Subtotal</span>
                  <span className="font-medium">{formatCurrency(summary.subtotal)}</span>
                </div>
                <Separator className="bg-brand-border" />
                <div className="flex justify-between text-sm sm:text-lg font-bold">
                  <span>Total</span>
                  <span className="text-brand-secondary">{formatCurrency(summary.total)}</span>
                </div>
              </div>

              {/* Security Badge - Compact on mobile */}
              <div className="flex items-center justify-center gap-1 sm:gap-2 text-xs text-text-secondary bg-gray-50 rounded-lg p-2 sm:p-3">
                <ShieldCheck className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                <span className="text-xs sm:text-sm">Secure SSL encrypted checkout</span>
                <Lock className="w-3 h-3 text-green-600" />
              </div>

              {/* Checkout Button */}
              <CheckoutButton />

              {/* Continue Shopping */}
              <Button
                variant="outline"
                size="lg"
                className="w-full border-brand-secondary/30 text-brand-secondary hover:bg-brand-secondary/5 hover:border-brand-secondary focus-visible:ring-2 focus-visible:ring-brand-secondary bg-transparent text-sm sm:text-base py-2 sm:py-3"
                onClick={closeCart}
                asChild
              >
                <Link href="/products">Continue Shopping</Link>
              </Button>

              {/* Available Payment Methods - Compact on mobile */}
              <div className="text-center">
                <p className="text-xs text-text-secondary mb-1 sm:mb-2">Secure payment options</p>
                <div className="flex justify-center gap-1 sm:gap-2">
                  <div className="bg-gradient-to-r from-blue-100 to-blue-200 rounded px-2 py-1 text-xs font-medium text-blue-700 border border-blue-300">
                    PayHere
                  </div>
                  <div className="bg-gradient-to-r from-green-100 to-green-200 rounded px-2 py-1 text-xs font-medium text-green-700 border border-green-300">
                    Visa
                  </div>
                  <div className="bg-gradient-to-r from-orange-100 to-orange-200 rounded px-2 py-1 text-xs font-medium text-orange-700 border border-orange-300">
                    Mastercard
                  </div>
                </div>
                <div className="text-xs text-green-600 mt-1 font-medium">✓ Available now</div>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
