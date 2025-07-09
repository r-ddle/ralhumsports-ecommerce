'use client'

import { CartItem as ICartItem } from '@/types/cart'
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

  // Safety checks
  if (!item || !item.product || !item.variant) {
    console.error('Invalid cart item:', item)
    return null
  }

  const handleQuantityChange = async (newQuantity: number) => {
    setIsUpdating(true)
    // Add a small delay for better UX
    setTimeout(() => {
      updateQuantity(item.id, newQuantity)
      setIsUpdating(false)
    }, 150)
  }

  const handleRemove = () => {
    removeItem(item.id)
  }

  const isLowStock = (item.variant.inventory || 0) <= 5
  const isOutOfStock = (item.variant.inventory || 0) === 0
  const maxQuantity = Math.min(10, item.variant.inventory || 0) // Limit to 10 or available inventory

  return (
    <div className="flex gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
      {/* Product Image */}
      <div className="relative flex-shrink-0">
        <Image
          height={80}
          width={80}
          src={item.product.images?.[0]?.url || 'https://placehold.co/600x400'}
          alt={item.product.images?.[0]?.alt || item.product.title}
          className="w-20 h-20 object-cover rounded-lg"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">OUT OF STOCK</span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        {/* Product Title, Brand & Variant Badge (ultra-tight spacing) */}
        <div className="mb-0 flex flex-col gap-0">
          <Link
            href={`/products/${item.product.slug}`}
            className="font-semibold text-gray-900 hover:text-[#003DA5] transition-colors line-clamp-2 text-sm mb-0 pb-0 leading-snug"
            style={{ marginBottom: 0, paddingBottom: 0, lineHeight: '1.1' }}
          >
            {item.product.title}
          </Link>
          <div
            className="flex items-center gap-1 mt-0 pt-0"
            style={{ marginTop: 0, paddingTop: 0 }}
          >
            <p
              className="text-xs text-[#003DA5] font-medium m-0 p-0 leading-tight"
              style={{ margin: 0, padding: 0, lineHeight: '1.1' }}
            >
              {item.product.brand?.name}
            </p>
            <Badge
              variant="secondary"
              className="text-xs m-0 p-0 leading-tight"
              style={{ margin: 0, padding: 0, lineHeight: '1.1' }}
            >
              {item.product.variants ? item.variant.name : 'No Variant'}
            </Badge>
          </div>
        </div>

        {/* Variant Info */}
        <div className="flex flex-wrap gap-1 mb-2">
          {item.variant.options &&
            Object.entries(item.variant.options).map(([key, value]) => (
              <Badge key={key} variant="outline" className="text-xs px-2 py-0.5">
                {key}: {value}
              </Badge>
            ))}
        </div>

        {/* Stock Warning */}
        {isLowStock && !isOutOfStock && (
          <div className="flex items-center gap-1 mb-2">
            <AlertCircle className="w-3 h-3 text-orange-500" />
            <span className="text-xs text-orange-600 font-medium">
              Only {item.variant.inventory || 0} left in stock
            </span>
          </div>
        )}

        {/* Price & Quantity Controls */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-bold text-gray-900">
              {(item.variant.price || 0) * item.quantity}
            </span>
            {item.quantity > 1 && (
              <span className="text-xs text-gray-600">Rs. {item.variant.price} each</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Quantity Controls */}
            <div className="flex items-center border border-gray-300 rounded-md">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-gray-100"
                onClick={() => handleQuantityChange(item.quantity - 1)}
                disabled={isUpdating || item.quantity <= 1}
              >
                <Minus className="w-3 h-3" />
              </Button>

              <span className="w-8 text-center text-sm font-medium">
                {isUpdating ? '...' : item.quantity}
              </span>

              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-gray-100"
                onClick={() => handleQuantityChange(item.quantity + 1)}
                disabled={isUpdating || item.quantity >= maxQuantity || isOutOfStock}
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>

            {/* Remove Button */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={handleRemove}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Compare at Price */}
        {item.variant.compareAtPrice && item.variant.compareAtPrice > (item.variant.price || 0) && (
          <div className="mt-1">
            <span className="text-xs text-gray-500 line-through">
              Was {(item.variant.compareAtPrice || 0) * item.quantity}
            </span>
            <Badge variant="secondary" className="ml-2 bg-[#FF3D00] text-white text-xs">
              SAVE{' '}
              {((item.variant.compareAtPrice || 0) - (item.variant.price || 0)) * item.quantity}
            </Badge>
          </div>
        )}
      </div>
    </div>
  )
}
