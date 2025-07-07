import { OrderSummary } from '@/types/checkout'

// Ralhum Sports WhatsApp Business Number
export const WHATSAPP_BUSINESS_NUMBER = '+94772350712'

/**
 * Format WhatsApp message for order confirmation
 */
export function formatWhatsAppMessage(order: OrderSummary): string {
  const { customer, items, pricing, orderId } = order

  // Format product list with LKR pricing
  const productList = items
    .map((item) => {
      const itemTotal = item.variant.price * item.quantity
      return `• ${item.product.title} (${item.variant.name}) x${item.quantity} - LKR ${itemTotal.toFixed(2)}`
    })
    .join('\n')

  // Format address
  const fullAddress = `${customer.address.street}, ${customer.address.city}, ${customer.address.province} ${customer.address.postalCode}`

  // Format special instructions
  const specialInstructions = customer.specialInstructions || 'None'

  // Current date
  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  // Build the message
  const message = `🏏 *RALHUM SPORTS - Order Confirmation*

*Customer Details:*
Name: ${customer.fullName}
Email: ${customer.email}
Phone: ${customer.phone}
Address: ${fullAddress}

*Order Summary:*
${productList}

*Pricing:*
Subtotal: LKR ${pricing.subtotal.toFixed(2)}
Shipping: LKR ${pricing.shipping.toFixed(2)}
Tax (15%): LKR ${pricing.tax.toFixed(2)}
*Total: LKR ${pricing.total.toFixed(2)}*

Order ID: ${orderId || 'Pending'}
Date: ${currentDate}

Special Instructions: ${specialInstructions}

Please confirm this order and provide payment instructions. Thank you for choosing Ralhum Sports! 🏆`

  return message
}

/**
 * Generate WhatsApp URL with pre-filled message
 */
export function generateWhatsAppURL(order: OrderSummary): string {
  const message = formatWhatsAppMessage(order)
  const encodedMessage = encodeURIComponent(message)

  return `https://wa.me/${WHATSAPP_BUSINESS_NUMBER}?text=${encodedMessage}`
}

/**
 * Open WhatsApp with the order message
 */
export function openWhatsAppOrder(order: OrderSummary): void {
  generateWhatsAppURL(order)
}

/**
 * Check if WhatsApp is available on the device
 */
export function isWhatsAppAvailable(): boolean {
  // WhatsApp is available on most devices, but we can enhance this check
  return true
}

/**
 * Get WhatsApp button text based on device
 */
export function getWhatsAppButtonText(): string {
  const userAgent = navigator.userAgent.toLowerCase()
  const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)

  return isMobile ? 'Confirm Order via WhatsApp' : 'Send Order to WhatsApp'
}

// /**
//  * Generate order ID [Deprecated - use orderID from the database]
//  */
// export function generateOrderId(): string {
//   const timestamp = Date.now().toString(36)
//   const random = Math.random().toString(36).substr(2, 5)
//   return `RS${timestamp}${random}`.toUpperCase()
// }

/**
 * Validate phone number for Sri Lankan format
 */
export function validateSriLankanPhone(phone: string): boolean {
  // Sri Lankan phone number patterns
  const patterns = [
    /^(\+94|0094|94)?[0-9]{9}$/, // General format
    /^(\+94|0094|94)?[1-9][0-9]{8}$/, // Landline
    /^(\+94|0094|94)?7[0-9]{8}$/, // Mobile
  ]

  const cleanPhone = phone.replace(/[\s-()]/g, '')
  return patterns.some((pattern) => pattern.test(cleanPhone))
}

/**
 * Format phone number to Sri Lankan standard
 */
export function formatSriLankanPhone(phone: string): string {
  const cleanPhone = phone.replace(/[\s-()]/g, '')

  // Add +94 if not present
  if (cleanPhone.startsWith('0')) {
    return `+94${cleanPhone.substring(1)}`
  } else if (cleanPhone.startsWith('94')) {
    return `+${cleanPhone}`
  } else if (!cleanPhone.startsWith('+94')) {
    return `+94${cleanPhone}`
  }

  return cleanPhone
}
