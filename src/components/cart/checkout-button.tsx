'use client'

import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { useCart } from '@/hooks/use-cart'

export function CheckoutButton() {
  const { cart, closeCart } = useCart()

  if (cart.items.length === 0) {
    return null
  }

  return (
    <Button
      size="lg"
      className="w-full bg-brand-primary hover:bg-primary-600 text-white font-bold py-3 sm:py-4 rounded-xl transition-all duration-200 focus-visible:ring-2 focus-visible:ring-brand-primary"
      asChild
      onClick={closeCart}
    >
      <Link href="/checkout">
        <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
        Proceed to Checkout
      </Link>
    </Button>
  )
}
