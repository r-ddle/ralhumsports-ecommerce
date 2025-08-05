'use client'

import { v4 as uuidv4 } from 'uuid'

export const CUSTOMER_STORAGE_KEY = 'ralhum-customer-id'
export const CUSTOMER_ORDERS_STORAGE_KEY = 'ralhum-customer-orders'

export interface CustomerInfo {
  customerId: string
  email?: string
  phone?: string
  fullName?: string
  createdAt: string
  lastOrderAt?: string
}

/**
 * Generate a unique customer ID
 */
export function generateCustomerId(): string {
  return `cust_${uuidv4().replace(/-/g, '').substring(0, 16)}`
}

/**
 * Get or create customer ID from localStorage
 */
export function getOrCreateCustomerId(): string {
  if (typeof window === 'undefined') {
    return generateCustomerId()
  }

  try {
    const stored = localStorage.getItem(CUSTOMER_STORAGE_KEY)
    if (stored) {
      const customerInfo: CustomerInfo = JSON.parse(stored)
      return customerInfo.customerId
    }
  } catch (error) {
    console.warn('Failed to retrieve customer ID from localStorage:', error)
  }

  // Generate new customer ID
  const customerId = generateCustomerId()
  const customerInfo: CustomerInfo = {
    customerId,
    createdAt: new Date().toISOString(),
  }

  try {
    localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(customerInfo))
  } catch (error) {
    console.warn('Failed to save customer ID to localStorage:', error)
  }

  return customerId
}

/**
 * Update customer information
 */
export function updateCustomerInfo(
  updates: Partial<Omit<CustomerInfo, 'customerId' | 'createdAt'>>,
): void {
  if (typeof window === 'undefined') return

  try {
    const stored = localStorage.getItem(CUSTOMER_STORAGE_KEY)
    let customerInfo: CustomerInfo

    if (stored) {
      customerInfo = JSON.parse(stored)
    } else {
      customerInfo = {
        customerId: generateCustomerId(),
        createdAt: new Date().toISOString(),
      }
    }

    // Update customer info
    const updatedInfo: CustomerInfo = {
      ...customerInfo,
      ...updates,
    }

    localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(updatedInfo))
  } catch (error) {
    console.warn('Failed to update customer info:', error)
  }
}

/**
 * Get customer information
 */
export function getCustomerInfo(): CustomerInfo | null {
  if (typeof window === 'undefined') return null

  try {
    const stored = localStorage.getItem(CUSTOMER_STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.warn('Failed to retrieve customer info:', error)
  }

  return null
}

/**
 * Clear customer information (for testing or privacy)
 */
export function clearCustomerInfo(): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.removeItem(CUSTOMER_STORAGE_KEY)
    localStorage.removeItem(CUSTOMER_ORDERS_STORAGE_KEY)
  } catch (error) {
    console.warn('Failed to clear customer info:', error)
  }
}

/**
 * Get customer ID for API calls
 */
export function getCustomerIdForAPI(): string {
  const customerInfo = getCustomerInfo()
  return customerInfo?.customerId || getOrCreateCustomerId()
}

/**
 * Find orders by email (fallback method)
 */
export function findOrdersByEmail(email: string): any[] {
  if (typeof window === 'undefined') return []

  try {
    const orders = JSON.parse(localStorage.getItem('ralhum-orders') || '[]')
    return orders.filter((order: any) => order.customerEmail?.toLowerCase() === email.toLowerCase())
  } catch (error) {
    console.warn('Failed to retrieve orders by email:', error)
    return []
  }
}

/**
 * Store order with customer ID association
 */
export function storeOrderWithCustomerId(order: any): void {
  if (typeof window === 'undefined') return

  const customerId = getOrCreateCustomerId()

  try {
    // Update customer's last order time
    updateCustomerInfo({
      lastOrderAt: new Date().toISOString(),
      email: order.customerEmail,
      phone: order.customerPhone,
      fullName: order.customer?.fullName,
    })

    // Store order with customer ID
    const orderWithCustomerId = {
      ...order,
      customerId,
    }

    // Update existing orders storage
    const existingOrders = JSON.parse(localStorage.getItem('ralhum-orders') || '[]')
    existingOrders.push(orderWithCustomerId)
    localStorage.setItem('ralhum-orders', JSON.stringify(existingOrders))

    // Also store in customer-specific orders
    const customerOrders = JSON.parse(localStorage.getItem(CUSTOMER_ORDERS_STORAGE_KEY) || '[]')
    customerOrders.push(orderWithCustomerId)
    localStorage.setItem(CUSTOMER_ORDERS_STORAGE_KEY, JSON.stringify(customerOrders))
  } catch (error) {
    console.warn('Failed to store order with customer ID:', error)
  }
}

/**
 * Get orders for current customer
 */
export function getCustomerOrders(): any[] {
  if (typeof window === 'undefined') return []

  const customerId = getCustomerIdForAPI()

  try {
    // Try customer-specific storage first
    const customerOrders = JSON.parse(localStorage.getItem(CUSTOMER_ORDERS_STORAGE_KEY) || '[]')
    if (customerOrders.length > 0) {
      return customerOrders.filter((order: any) => order.customerId === customerId)
    }

    // Fallback to general orders storage
    const allOrders = JSON.parse(localStorage.getItem('ralhum-orders') || '[]')
    return allOrders.filter((order: any) => order.customerId === customerId)
  } catch (error) {
    console.warn('Failed to retrieve customer orders:', error)
    return []
  }
}

/**
 * Get order count for current customer
 */
export function getCustomerOrderCount(): number {
  return getCustomerOrders().length
}

/**
 * Check if there's a pending order for the current cart + customer combination
 * Returns the order number if found, null otherwise
 */
export function findPendingOrderForCart(cartItems: any[]): string | null {
  if (typeof window === 'undefined' || cartItems.length === 0) return null

  const customerInfo = getCustomerInfo()
  if (!customerInfo) return null

  const customerOrders = getCustomerOrders()

  // Look for pending orders (exclude cancelled orders)
  const pendingOrders = customerOrders.filter(
    (order: any) =>
      (order.status === 'pending' ||
        order.orderStatus === 'pending' ||
        order.paymentStatus === 'pending') &&
      order.status !== 'cancelled' &&
      order.orderStatus !== 'cancelled',
  )

  if (pendingOrders.length === 0) return null

  // Check if any pending order matches current cart
  for (const order of pendingOrders) {
    if (isCartMatchingOrder(cartItems, order)) {
      return order.orderId || order.orderNumber
    }
  }

  return null
}

/**
 * Check if current cart items match an existing order
 */
function isCartMatchingOrder(cartItems: any[], order: any): boolean {
  const orderItems = order.items || order.orderItems || []

  if (cartItems.length !== orderItems.length) return false

  // Create simplified comparison arrays
  const cartSignature = cartItems
    .map((item) => ({
      productId: item.product?.id || item.productId,
      variantId: item.variant?.id || item.variantId,
      quantity: item.quantity,
    }))
    .sort((a: any, b: any) =>
      `${a.productId}-${a.variantId}`.localeCompare(`${b.productId}-${b.variantId}`),
    )

  const orderSignature = orderItems
    .map((item: any) => ({
      productId: item.product?.id || item.productId,
      variantId: item.variant?.id || item.variantId || item.selectedVariant,
      quantity: item.quantity,
    }))
    .sort((a: any, b: any) =>
      `${a.productId}-${a.variantId}`.localeCompare(`${b.productId}-${b.variantId}`),
    )

  // Compare signatures
  return cartSignature.every((cartItem, index) => {
    const orderItem = orderSignature[index]
    return (
      cartItem.productId === orderItem.productId &&
      cartItem.variantId === orderItem.variantId &&
      cartItem.quantity === orderItem.quantity
    )
  })
}

/**
 * Clear pending orders for current customer (use when payment completed or cart cleared)
 */
export function clearPendingOrders(): void {
  if (typeof window === 'undefined') return

  const customerId = getCustomerIdForAPI()

  try {
    // Remove pending orders from customer-specific storage
    const customerOrders = JSON.parse(localStorage.getItem(CUSTOMER_ORDERS_STORAGE_KEY) || '[]')
    const nonPendingOrders = customerOrders.filter(
      (order: any) =>
        order.customerId !== customerId ||
        (order.status !== 'pending' &&
          order.orderStatus !== 'pending' &&
          order.paymentStatus !== 'pending'),
    )
    localStorage.setItem(CUSTOMER_ORDERS_STORAGE_KEY, JSON.stringify(nonPendingOrders))

    // Remove pending orders from general storage
    const allOrders = JSON.parse(localStorage.getItem('ralhum-orders') || '[]')
    const nonPendingAllOrders = allOrders.filter(
      (order: any) =>
        order.customerId !== customerId ||
        (order.status !== 'pending' &&
          order.orderStatus !== 'pending' &&
          order.paymentStatus !== 'pending'),
    )
    localStorage.setItem('ralhum-orders', JSON.stringify(nonPendingAllOrders))
  } catch (error) {
    console.warn('Failed to clear pending orders:', error)
  }
}
