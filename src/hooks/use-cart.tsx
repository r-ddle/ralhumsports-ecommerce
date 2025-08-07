'use client'

import { createContext, useContext, useEffect, useReducer, ReactNode } from 'react'
import { Cart, CartItem, CartState, CartActions } from '@/types/cart'
import { Product, ProductVariant } from '@/types/product'
import { toast } from 'sonner'
import { SITE_CONFIG } from '@/config/site-config'
import { cartLogger } from '@/lib/logger'

type CartAction =
  | {
      type: 'ADD_ITEM'
      payload: { product: Product; variant: ProductVariant; quantity: number }
    }
  | { type: 'REMOVE_ITEM'; payload: { itemId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { itemId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'LOAD_CART'; payload: Cart }
  | { type: 'SET_LOADING'; payload: boolean }

// Memoized calculation to avoid unnecessary re-computations
const calculateCartTotals = (() => {
  let lastItems = ''
  let lastResult: {
    subtotal: number
    total: number
    itemCount: number
  } | null = null

  return (items: CartItem[]) => {
    // Create a simple hash of items for comparison
    const itemsHash = items
      .map((item) => `${item.product.id}-${item.variant.id}-${item.quantity}`)
      .join('|')

    // Return cached result if items haven't changed
    if (itemsHash === lastItems && lastResult) {
      return lastResult
    }

    const subtotalLKR = items.reduce((sum, item) => sum + item.variant.price * item.quantity, 0)
    const total = subtotalLKR
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

    // Log cart totals for debugging
    cartLogger.totals({
      subtotal: subtotalLKR,
      total,
      itemCount,
    })

    lastItems = itemsHash
    lastResult = {
      subtotal: subtotalLKR,
      total,
      itemCount,
    }

    return lastResult
  }
})()

function createEmptyCart(): Cart {
  return {
    items: [],
    subtotal: 0,
    total: 0,
    itemCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, variant, quantity } = action.payload
      const existingItemIndex = state.cart.items.findIndex(
        (item) => item.product.id === product.id && item.variant.id === variant.id,
      )

      let newItems: CartItem[]

      if (existingItemIndex > -1) {
        newItems = state.cart.items.map((item, index) =>
          index === existingItemIndex ? { ...item, quantity: item.quantity + quantity } : item,
        )
      } else {
        const newItem: CartItem = {
          id: `${product.id}-${variant.id}-${Date.now()}`,
          product,
          variant,
          quantity,
          addedAt: new Date().toISOString(),
        }
        newItems = [...state.cart.items, newItem]
      }

      const totals = calculateCartTotals(newItems)
      const updatedCart: Cart = {
        ...state.cart,
        items: newItems,
        ...totals,
        updatedAt: new Date().toISOString(),
      }

      return {
        ...state,
        cart: updatedCart,
      }
    }

    case 'REMOVE_ITEM': {
      const newItems = state.cart.items.filter((item) => item.id !== action.payload.itemId)
      const totals = calculateCartTotals(newItems)
      const updatedCart: Cart = {
        ...state.cart,
        items: newItems,
        ...totals,
        updatedAt: new Date().toISOString(),
      }

      return {
        ...state,
        cart: updatedCart,
      }
    }

    case 'UPDATE_QUANTITY': {
      const { itemId, quantity } = action.payload
      if (quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: { itemId } })
      }

      const newItems = state.cart.items.map((item) =>
        item.id === itemId ? { ...item, quantity } : item,
      )
      const totals = calculateCartTotals(newItems)
      const updatedCart: Cart = {
        ...state.cart,
        items: newItems,
        ...totals,
        updatedAt: new Date().toISOString(),
      }

      return {
        ...state,
        cart: updatedCart,
      }
    }

    case 'CLEAR_CART': {
      return {
        ...state,
        cart: createEmptyCart(),
      }
    }

    case 'TOGGLE_CART': {
      return {
        ...state,
        isOpen: !state.isOpen,
      }
    }

    case 'CLOSE_CART': {
      return {
        ...state,
        isOpen: false,
      }
    }

    case 'OPEN_CART': {
      return {
        ...state,
        isOpen: true,
      }
    }

    case 'LOAD_CART': {
      return {
        ...state,
        cart: action.payload,
      }
    }

    case 'SET_LOADING': {
      return {
        ...state,
        isLoading: action.payload,
      }
    }

    default:
      return state
  }
}

const CartContext = createContext<(CartState & CartActions) | null>(null)

const CART_STORAGE_KEY = 'ralhum-sports-cart'

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    cart: createEmptyCart(),
    isOpen: false,
    isLoading: false,
  })

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY)
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart)
        dispatch({ type: 'LOAD_CART', payload: parsedCart })
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error)
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.cart))
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error)
    }
  }, [state.cart])

  const addItem = (product: Product, variant: ProductVariant, quantity: number = 1) => {
    if (variant.inventory < quantity) {
      toast.error(`Only ${variant.inventory} items available in stock`)
      return
    }

    dispatch({ type: 'ADD_ITEM', payload: { product, variant, quantity } })
    toast.success(`${product.title} added to cart`)
  }

  const removeItem = (itemId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { itemId } })
    toast.success('Item removed from cart')
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    const item = state.cart.items.find((item) => item.id === itemId)
    if (item && item.variant.inventory < quantity) {
      toast.error(`Only ${item.variant.inventory} items available in stock`)
      return
    }

    dispatch({ type: 'UPDATE_QUANTITY', payload: { itemId, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
    toast.success('Cart cleared')
  }

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' })
  }

  const closeCart = () => {
    dispatch({ type: 'CLOSE_CART' })
  }

  const openCart = () => {
    dispatch({ type: 'OPEN_CART' })
  }

  const contextValue = {
    ...state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    closeCart,
    openCart,
  }

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export function useCartItem(productId: string, variantId: string) {
  const { cart } = useCart()
  return cart.items.find((item) => item.product.id === productId && item.variant.id === variantId)
}

export function useCartSummary() {
  const { cart } = useCart()
  return {
    subtotal: cart.subtotal,
    total: cart.total,
    itemCount: cart.itemCount,
  }
}
