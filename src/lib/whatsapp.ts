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
Tax (${SITE_CONFIG.taxRate * 100}%): LKR ${formatCurrency(pricing.tax)}
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
