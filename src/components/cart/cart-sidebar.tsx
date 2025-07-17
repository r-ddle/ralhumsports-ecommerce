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
      <SheetContent className="w-full sm:max-w-lg p-0 flex flex-col bg-brand-surface border-l border-brand-border">
        <SheetHeader className="p-4 sm:p-6 pb-3 sm:pb-4 bg-gradient-to-r from-blue-50 to-purple-50">
          <SheetTitle className="flex items-center gap-2 text-lg sm:text-xl font-bold text-text-primary">
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
            {/* Cart Items */}
            <ScrollArea className="flex-1 px-4 sm:px-6">
              <div className="space-y-3 sm:space-y-4 py-4">
                {cart.items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            </ScrollArea>

            <div className="border-t border-brand-border p-4 sm:p-6 space-y-4 bg-brand-surface">
              {/* Order Summary */}
              <div className="space-y-3 p-3 sm:p-4 bg-gray-50 rounded-xl sm:rounded-2xl">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Subtotal</span>
                  <span className="font-medium">{formatCurrency(summary.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Tax (15%)</span>
                  <span className="font-medium">{formatCurrency(summary.tax)}</span>
                </div>
                <Separator className="bg-brand-border" />
                <div className="flex justify-between text-base sm:text-lg font-bold">
                  <span>Total</span>
                  <span className="text-brand-secondary">{formatCurrency(summary.total)}</span>
                </div>
              </div>

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-2 text-xs text-text-secondary bg-gray-50 rounded-lg sm:rounded-xl p-3">
                <ShieldCheck className="w-4 h-4 text-green-600" />
                <span>Secure SSL encrypted checkout</span>
                <Lock className="w-3 h-3 text-green-600" />
              </div>

              {/* Checkout Button */}
              <CheckoutButton />

              {/* Continue Shopping */}
              <Button
                variant="outline"
                size="lg"
                className="w-full border-brand-secondary/30 text-brand-secondary hover:bg-brand-secondary/5 hover:border-brand-secondary focus-visible:ring-2 focus-visible:ring-brand-secondary bg-transparent"
                onClick={closeCart}
                asChild
              >
                <Link href="/products">Continue Shopping</Link>
              </Button>

              {/* Payment Methods - Coming Soon */}
              <div className="text-center">
                <p className="text-xs text-text-secondary mb-2">Online payment methods</p>
                <div className="flex justify-center gap-2 opacity-50 pointer-events-none select-none">
                  {['Visa', 'Mastercard', 'PayPal', 'Apple Pay'].map((method) => (
                    <div
                      key={method}
                      className="bg-gray-100 rounded-lg px-2 sm:px-3 py-1 sm:py-2 text-xs font-medium text-gray-400"
                    >
                      {method}
                    </div>
                  ))}
                </div>
                <div className="text-xs text-gray-400 mt-1">Coming soon</div>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
