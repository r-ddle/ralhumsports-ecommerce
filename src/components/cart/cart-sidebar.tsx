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
  console.log('formatCurrency called with:', { amount, type: typeof amount })
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
      <SheetContent className="w-full sm:max-w-lg p-0 flex flex-col">
        <SheetHeader className="p-6 pb-4">
          <SheetTitle className="flex items-center gap-2 text-xl font-bold">
            <ShoppingBag className="w-5 h-5" />
            Shopping Cart ({summary.itemCount})
          </SheetTitle>
        </SheetHeader>

        {cart.items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <ShoppingBag className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-600 mb-6">
              Discover our amazing sports equipment and start shopping!
            </p>
            <Button asChild onClick={closeCart} className="bg-[#003DA5] hover:bg-[#003DA5]/90">
              <Link href="/products">
                Browse Products
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Free Shipping Progress */}
            {!summary.freeShippingEligible && (
              <div className="px-6 py-3 bg-gradient-to-r from-[#AEEA00]/10 to-[#FFD700]/10 border-l-4 border-[#AEEA00]">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="w-4 h-4 text-[#003DA5]" />
                  <span className="text-sm font-medium text-gray-900">
                    Add {formatCurrency(summary.freeShippingRemaining)} for FREE shipping!
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-[#AEEA00] to-[#FFD700] h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(100, (summary.subtotal / summary.freeShippingThreshold) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {summary.freeShippingEligible && (
              <div className="px-6 py-3 bg-gradient-to-r from-[#AEEA00]/20 to-[#FFD700]/20 border-l-4 border-[#AEEA00]">
                <div className="flex items-center gap-2">
                  <Gift className="w-4 h-4 text-[#003DA5]" />
                  <span className="text-sm font-medium text-gray-900">
                    🎉 You qualify for FREE shipping!
                  </span>
                </div>
              </div>
            )}

            {/* Cart Items */}
            <ScrollArea className="flex-1 px-6">
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            </ScrollArea>

            <div className="border-t p-6 space-y-4">
              {/* Order Summary */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatCurrency(summary.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {summary.shipping === 0 ? (
                      <Badge variant="secondary" className="bg-[#AEEA00] text-[#1A1A1A]">
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
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{formatCurrency(summary.total)}</span>
                </div>
              </div>

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-2 text-xs text-gray-600 bg-gray-50 rounded-lg p-3">
                <ShieldCheck className="w-4 h-4" />
                <span>Secure SSL encrypted checkout</span>
                <Lock className="w-3 h-3" />
              </div>

              {/* Checkout Button */}
              <CheckoutButton />

              {/* Continue Shopping */}
              <Button
                variant="outline"
                size="lg"
                className="w-full border-[#003DA5] text-[#003DA5] hover:bg-[#003DA5] hover:text-white"
                onClick={closeCart}
                asChild
              >
                <Link href="/products">Continue Shopping</Link>
              </Button>

              {/* Payment Methods - Coming Soon */}
              <div className="text-center">
                <p className="text-xs text-gray-600 mb-2">Online payment methods</p>
                <div className="flex justify-center gap-2 opacity-50 pointer-events-none select-none">
                  {['Visa', 'Mastercard', 'PayPal', 'Apple Pay'].map((method) => (
                    <div
                      key={method}
                      className="bg-gray-100 rounded px-2 py-1 text-xs font-medium text-gray-400"
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
