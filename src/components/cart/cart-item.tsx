'use client'

import type { CartItem as ICartItem } from '@/types/cart'
import { useCart } from '@/hooks/use-cart'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Minus, Plus, Trash2, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import Image from 'next/image'

interface CartItemProps {
  item: ICartItem
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart()
  const [isUpdating, setIsUpdating] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)

  // Safety checks
  if (!item || !item.product || !item.variant) {
    console.error('Invalid cart item:', item)
    return null
  }

  const handleQuantityChange = async (newQuantity: number) => {
    setIsUpdating(true)
    setTimeout(() => {
      updateQuantity(item.id, newQuantity)
      setIsUpdating(false)
    }, 150)
  }

  const handleRemove = () => {
    setIsRemoving(true)
    setTimeout(() => {
      removeItem(item.id)
    }, 200)
  }

  const isLowStock = (item.variant.inventory || 0) <= 5
  const isOutOfStock = (item.variant.inventory || 0) === 0
  const maxQuantity = Math.min(10, item.variant.inventory || 0)

  return (
    <div
      className={`flex gap-3 sm:gap-4 p-3 sm:p-4 bg-brand-surface rounded-xl sm:rounded-2xl border border-brand-border hover:shadow-sm transition-all duration-200 ${
        isRemoving ? 'opacity-50 pointer-events-none' : ''
      }`}
    >
      {/* Product Image */}
      <div className="relative flex-shrink-0">
        <div className="relative">
          <Image
            height={80}
            width={80}
            src={item.product.images?.[0]?.url || '/placeholder.svg?height=80&width=80'}
            alt={item.product.images?.[0]?.alt || item.product.title}
            className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg sm:rounded-xl shadow-sm"
          />
          {isOutOfStock && (
            <div className="absolute inset-0 bg-gray-900/60 rounded-lg sm:rounded-xl flex items-center justify-center backdrop-blur-sm">
              <span className="text-white text-xs font-bold">OUT OF STOCK</span>
            </div>
          )}
        </div>
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        {/* Product Title, Brand & Variant Badge */}
        <div className="mb-2 flex flex-col gap-1">
          <Link
            href={`/products/${item.product.slug}`}
            className="font-semibold text-text-primary hover:text-brand-primary transition-colors line-clamp-2 text-sm sm:text-base leading-snug focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-1 rounded"
          >
            {item.product.title}
          </Link>
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-xs text-brand-secondary font-medium">{item.product.brand?.name}</p>
            <Badge
              variant="secondary"
              className="text-xs px-2 py-0.5 bg-gray-100 text-text-secondary"
            >
              {item.product.variants ? item.variant.name : 'Standard'}
            </Badge>
          </div>
        </div>

        {/* Variant Info */}
        {item.variant.options && (
          <div className="flex flex-wrap gap-1 mb-2">
            {Object.entries(item.variant.options).map(([key, value]) => (
              <Badge
                key={key}
                variant="outline"
                className="text-xs px-2 py-0.5 border-brand-border"
              >
                {key}: {value}
              </Badge>
            ))}
          </div>
        )}

        {/* Stock Warning */}
        {isLowStock && !isOutOfStock && (
          <div className="flex items-center gap-1 mb-2 p-2 bg-orange-50 rounded-lg border border-orange-200">
            <AlertCircle className="w-3 h-3 text-orange-500 flex-shrink-0" />
            <span className="text-xs text-orange-600 font-medium">
              Only {item.variant.inventory || 0} left in stock
            </span>
          </div>
        )}

        {/* Price & Quantity Controls */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="font-bold text-text-primary text-sm sm:text-base">
              LKR {((item.variant.price || 0) * item.quantity).toLocaleString()}
            </span>
            {item.quantity > 1 && (
              <span className="text-xs text-text-secondary">
                LKR {(item.variant.price || 0).toLocaleString()} each
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Quantity Controls */}
            <div className="flex items-center border border-brand-border rounded-lg bg-brand-surface">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-gray-100 rounded-l-lg focus-visible:ring-2 focus-visible:ring-brand-primary"
                onClick={() => handleQuantityChange(item.quantity - 1)}
                disabled={isUpdating || item.quantity <= 1}
                aria-label="Decrease quantity"
              >
                <Minus className="w-3 h-3" />
              </Button>

              <span className="w-6 sm:w-8 text-center text-xs sm:text-sm font-medium">
                {isUpdating ? '...' : item.quantity}
              </span>

              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-gray-100 rounded-r-lg focus-visible:ring-2 focus-visible:ring-brand-primary"
                onClick={() => handleQuantityChange(item.quantity + 1)}
                disabled={isUpdating || item.quantity >= maxQuantity || isOutOfStock}
                aria-label="Increase quantity"
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>

            {/* Remove Button */}
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg focus-visible:ring-2 focus-visible:ring-red-500"
              onClick={handleRemove}
              aria-label="Remove item from cart"
            >
              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
          </div>
        </div>

        {/* Compare at Price */}
        {item.variant.compareAtPrice && item.variant.compareAtPrice > (item.variant.price || 0) && (
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <span className="text-xs text-text-secondary line-through">
              Was LKR {((item.variant.compareAtPrice || 0) * item.quantity).toLocaleString()}
            </span>
            <Badge variant="secondary" className="bg-brand-primary text-white text-xs">
              SAVE LKR{' '}
              {(
                ((item.variant.compareAtPrice || 0) - (item.variant.price || 0)) *
                item.quantity
              ).toLocaleString()}
            </Badge>
          </div>
        )}
      </div>
    </div>
  )
}
