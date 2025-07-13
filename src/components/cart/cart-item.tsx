'use client'

import type { CartItem as ICartItem } from '@/types/cart'
import { useCart } from '@/hooks/use-cart'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Minus, Plus, Trash2, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

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
    <AnimatePresence>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -100, scale: 0.8 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`flex gap-4 p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 hover:shadow-lg hover:bg-white/90 transition-all duration-300 ${
          isRemoving ? 'opacity-50 pointer-events-none' : ''
        }`}
      >
        {/* Product Image */}
        <div className="relative flex-shrink-0">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
            className="relative"
          >
            <Image
              height={80}
              width={80}
              src={item.product.images?.[0]?.url || '/placeholder.svg?height=80&width=80'}
              alt={item.product.images?.[0]?.alt || item.product.title}
              className="w-20 h-20 object-cover rounded-xl shadow-sm"
            />
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <span className="text-white text-xs font-bold">OUT OF STOCK</span>
              </div>
            )}
          </motion.div>
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          {/* Product Title, Brand & Variant Badge */}
          <div className="mb-2 flex flex-col gap-1">
            <Link
              href={`/products/${item.product.slug}`}
              className="font-semibold text-gray-900 hover:text-[#003DA5] transition-colors line-clamp-2 text-sm leading-snug focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 rounded"
            >
              {item.product.title}
            </Link>
            <div className="flex items-center gap-2">
              <p className="text-xs text-[#003DA5] font-medium">{item.product.brand?.name}</p>
              <Badge variant="secondary" className="text-xs px-2 py-0.5">
                {item.product.variants ? item.variant.name : 'No Variant'}
              </Badge>
            </div>
          </div>

          {/* Variant Info */}
          {item.variant.options && (
            <div className="flex flex-wrap gap-1 mb-2">
              {Object.entries(item.variant.options).map(([key, value]) => (
                <Badge key={key} variant="outline" className="text-xs px-2 py-0.5">
                  {key}: {value}
                </Badge>
              ))}
            </div>
          )}

          {/* Stock Warning */}
          <AnimatePresence>
            {isLowStock && !isOutOfStock && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-1 mb-2 p-2 bg-orange-50 rounded-lg border border-orange-200"
              >
                <AlertCircle className="w-3 h-3 text-orange-500 flex-shrink-0" />
                <span className="text-xs text-orange-600 font-medium">
                  Only {item.variant.inventory || 0} left in stock
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Price & Quantity Controls */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <motion.span
                key={item.quantity}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                className="font-bold text-gray-900"
              >
                LKR {((item.variant.price || 0) * item.quantity).toLocaleString()}
              </motion.span>
              {item.quantity > 1 && (
                <span className="text-xs text-gray-600">
                  LKR {(item.variant.price || 0).toLocaleString()} each
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Quantity Controls */}
              <div className="flex items-center border border-gray-300 rounded-xl bg-white/50 backdrop-blur-sm">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-gray-100 rounded-l-xl focus-visible:ring-2 focus-visible:ring-blue-500"
                  onClick={() => handleQuantityChange(item.quantity - 1)}
                  disabled={isUpdating || item.quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3 h-3" />
                </Button>

                <motion.span
                  key={item.quantity}
                  initial={{ scale: 1.2, opacity: 0.5 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-8 text-center text-sm font-medium"
                >
                  {isUpdating ? '...' : item.quantity}
                </motion.span>

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-gray-100 rounded-r-xl focus-visible:ring-2 focus-visible:ring-blue-500"
                  onClick={() => handleQuantityChange(item.quantity + 1)}
                  disabled={isUpdating || item.quantity >= maxQuantity || isOutOfStock}
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>

              {/* Remove Button */}
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl focus-visible:ring-2 focus-visible:ring-red-500"
                  onClick={handleRemove}
                  aria-label="Remove item from cart"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Compare at Price */}
          {item.variant.compareAtPrice &&
            item.variant.compareAtPrice > (item.variant.price || 0) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-2 flex items-center gap-2"
              >
                <span className="text-xs text-gray-500 line-through">
                  Was LKR {((item.variant.compareAtPrice || 0) * item.quantity).toLocaleString()}
                </span>
                <Badge variant="secondary" className="bg-[#FF3D00] text-white text-xs">
                  SAVE LKR{' '}
                  {(
                    ((item.variant.compareAtPrice || 0) - (item.variant.price || 0)) *
                    item.quantity
                  ).toLocaleString()}
                </Badge>
              </motion.div>
            )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
