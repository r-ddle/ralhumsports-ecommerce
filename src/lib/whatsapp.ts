import { SITE_CONFIG } from '@/config/site-config'
import { OrderSummary } from '@/types/checkout'

/**
 * Format currency with comma separators
 */
function formatCurrency(amount: number): string {
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

/**
 * Format WhatsApp message for order confirmation
 */
export function formatWhatsAppMessage(order: OrderSummary): string {
  const { customer, items, pricing, orderId } = order

  // Format product list with LKR pricing and better formatting
  const productList = items
    .map((item) => {
      return `• ${item.product.title} (${item.variant.name}) x${item.quantity} - LKR ${formatCurrency(item.variant.price)}`
    })
    .join('\n')

  // Format address
  const fullAddress = `${customer.address.street}, ${customer.address.city}, ${customer.address.province} ${customer.address.postalCode}`

  // Format special instructions
  const specialInstructions = customer.specialInstructions || 'None'

  // Current date with Sri Lankan timezone
  const currentDate = new Date().toLocaleString('en-GB', {
    timeZone: 'Asia/Colombo',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })

  // Minimal WhatsApp order confirmation message
  const trackingUrl = `${SITE_CONFIG.siteUrl}/orders/track?orderId=${encodeURIComponent(orderId || '')}`
  const minimalProductList = items
    .map(
      (item) => `• ${item.product.title} (${formatCurrency(item.variant.price)}) x${item.quantity}`,
    )
    .join('\n')

  const message = `*RALHUM SPORTS - Order Confirmation*

*Order Details*
Order ID: ${orderId || 'Pending'}
Order Tracking URL: ${trackingUrl}
Date: ${currentDate}

*Customer*
Full Name: ${customer.fullName}
Email: ${customer.email}
Phone: ${customer.phone}
Address: ${fullAddress}

*Order Summary*
${minimalProductList}

*Payment Details*
Subtotal: LKR ${formatCurrency(pricing.subtotal)}
*Total*: LKR ${formatCurrency(pricing.total)}

Please confirm this order and provide payment instructions.

_For assistance, call: ${SITE_CONFIG.contact.phone}_`

  return message
}

/**
 * Generate WhatsApp message templates for admin use
 */
export function generateAdminMessageTemplate(
  type: 'order-update' | 'shipping' | 'payment-reminder' | 'delivery',
  data: {
    customerName: string
    orderNumber: string
    orderTotal?: number
    trackingNumber?: string
    paymentMethod?: string
    deliveryDate?: string
  },
): string {
  const templates = {
    'order-update': `🏏 *RALHUM SPORTS - Order Update*

Dear ${data.customerName},

Your order *#${data.orderNumber}* has been confirmed and is being processed.

Order Total: *LKR ${data.orderTotal ? formatCurrency(data.orderTotal) : 'N/A'}*

We'll notify you once your order is shipped.

Thank you! 🏆`,

    shipping: `🏏 *RALHUM SPORTS - Shipping Update*

Dear ${data.customerName},

Great news! Your order *#${data.orderNumber}* has been shipped! 📦

Tracking Number: *${data.trackingNumber || 'N/A'}*

You can track your package or contact us for updates.

Thank you! 🏆`,

    'payment-reminder': `🏏 *RALHUM SPORTS - Payment Reminder*

Dear ${data.customerName},

This is a friendly reminder about your order *#${data.orderNumber}*.

Order Total: *LKR ${data.orderTotal ? formatCurrency(data.orderTotal) : 'N/A'}*
Payment Method: ${data.paymentMethod || 'To be confirmed'}

Please complete your payment to process your order.

Thank you! 🏆`,

    delivery: `🏏 *RALHUM SPORTS - Delivery Confirmation*

Dear ${data.customerName},

Your order *#${data.orderNumber}* has been delivered! ✅

Delivery Date: ${data.deliveryDate || new Date().toLocaleDateString('en-GB')}

We hope you enjoy your sports equipment!

Thank you for choosing Ralhum Sports! 🏆`,
  }

  return templates[type]
}

/**
 * Generate WhatsApp URL with pre-filled message
 */
export function generateWhatsAppURL(order: OrderSummary | string, customMessage?: string): string {
  const message =
    customMessage || (typeof order === 'string' ? order : formatWhatsAppMessage(order))
  const encodedMessage = encodeURIComponent(message)

  return `https://wa.me/${SITE_CONFIG.contact.whatsapp}?text=${encodedMessage}`
}

/**
 * Generate unique WhatsApp link for a specific customer
 */
export function generateCustomerWhatsAppLink(customerPhone: string, message: string): string {
  // Format customer phone number
  const formattedPhone = formatSriLankanPhone(customerPhone)
  const encodedMessage = encodeURIComponent(message)

  return `https://wa.me/${formattedPhone.replace('+', '')}?text=${encodedMessage}`
}

/**
 * Open WhatsApp with the order message
 */
export function openWhatsAppOrder(order: OrderSummary): void {
  const url = generateWhatsAppURL(order)
  window.open(url, '_blank', 'noopener,noreferrer')
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

/**
 * Validate phone number for Sri Lankan format
 * Handles all common input formats:
 * - Local: 0772350712, 0112345678
 * - International: +94772350712, +94112345678
 * - Without country code: 772350712, 112345678
 * - With country code but no +: 94772350712, 94112345678
 */
export function validateSriLankanPhone(phone: string): boolean {
  if (!phone) return false

  const cleanPhone = phone.replace(/[\s\-().]/g, '')

  // Sri Lankan mobile prefixes (after removing leading 0): 70, 71, 72, 74, 75, 76, 77, 78
  const mobilePrefix = /^(70|71|72|74|75|76|77|78)/

  // Sri Lankan landline area codes (after removing leading 0)
  const landlinePrefix =
    /^(11|21|25|26|27|31|32|33|34|35|36|37|38|41|45|47|51|52|54|55|57|63|65|66|67|81|91)/

  // Pattern 1: Local format with leading 0 (10 digits total)
  // Mobile: 0772350712, Landline: 0112345678
  if (/^0\d{9}$/.test(cleanPhone)) {
    const withoutZero = cleanPhone.substring(1)
    return mobilePrefix.test(withoutZero) || landlinePrefix.test(withoutZero)
  }

  // Pattern 2: International format with +94 (12 characters total)
  // Mobile: +94772350712, Landline: +94112345678
  if (/^\+94\d{9}$/.test(cleanPhone)) {
    const withoutCountryCode = cleanPhone.substring(3)
    return mobilePrefix.test(withoutCountryCode) || landlinePrefix.test(withoutCountryCode)
  }

  // Pattern 3: Country code without + (11 digits total)
  // Mobile: 94772350712, Landline: 94112345678
  if (/^94\d{9}$/.test(cleanPhone)) {
    const withoutCountryCode = cleanPhone.substring(2)
    return mobilePrefix.test(withoutCountryCode) || landlinePrefix.test(withoutCountryCode)
  }

  // Pattern 4: Without country code or leading 0 (9 digits total)
  // Mobile: 772350712, Landline: 112345678
  if (/^\d{9}$/.test(cleanPhone)) {
    return mobilePrefix.test(cleanPhone) || landlinePrefix.test(cleanPhone)
  }

  // Pattern 5: Alternative international formats
  if (/^0094\d{9}$/.test(cleanPhone)) {
    const withoutCountryCode = cleanPhone.substring(4)
    return mobilePrefix.test(withoutCountryCode) || landlinePrefix.test(withoutCountryCode)
  }

  return false
}

/**
 * Format phone number to Sri Lankan international standard (+94xxxxxxxxx)
 * Handles all input formats and converts to consistent international format
 */
export function formatSriLankanPhone(phone: string): string {
  if (!phone) return phone

  const cleanPhone = phone.replace(/[\s\-().]/g, '')

  // Already in correct international format
  if (/^\+94\d{9}$/.test(cleanPhone)) {
    return cleanPhone
  }

  // Local format with leading 0 (remove 0, add +94)
  if (/^0\d{9}$/.test(cleanPhone)) {
    return `+94${cleanPhone.substring(1)}`
  }

  // Country code without + (add +)
  if (/^94\d{9}$/.test(cleanPhone)) {
    return `+${cleanPhone}`
  }

  // Alternative international format 0094 (replace with +94)
  if (/^0094\d{9}$/.test(cleanPhone)) {
    return `+94${cleanPhone.substring(4)}`
  }

  // Without country code or leading 0 - assume user forgot leading parts
  if (/^\d{9}$/.test(cleanPhone)) {
    // Check if it looks like a valid Sri Lankan number
    const mobilePrefix = /^(70|71|72|74|75|76|77|78)/
    const landlinePrefix =
      /^(11|21|25|26|27|31|32|33|34|35|36|37|38|41|45|47|51|52|54|55|57|63|65|66|67|81|91)/

    if (mobilePrefix.test(cleanPhone) || landlinePrefix.test(cleanPhone)) {
      return `+94${cleanPhone}`
    }
  }

  // If all else fails, return as-is (validation will catch invalid numbers)
  return cleanPhone
}
