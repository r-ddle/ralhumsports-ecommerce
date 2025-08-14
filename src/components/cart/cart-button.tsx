'use client'

import { useCart } from '@/hooks/use-cart'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ShoppingBag } from 'lucide-react'

export function CartButton() {
  const { cart, toggleCart } = useCart()

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleCart}
            className="relative flex flex-col items-center gap-1 p-2 hover:bg-gray-100 rounded-lg sm:rounded-xl transition-all duration-200 focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 h-auto"
            aria-label={`Shopping cart with ${cart.itemCount} items`}
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-text-primary" />

              {cart.itemCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center p-0 text-xs font-bold bg-brand-primary hover:bg-brand-primary rounded-full shadow-lg border-2 border-brand-surface"
                >
                  {cart.itemCount > 99 ? '99+' : cart.itemCount}
                </Badge>
              )}
            </div>
            
            <span className="text-xs text-text-primary font-medium">Cart</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="hidden sm:block">
          <p>View shopping cart ({cart.itemCount} {cart.itemCount === 1 ? 'item' : 'items'})</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
