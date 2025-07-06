import { OrderSummary } from '@/types/checkout' // This might need to be Order from payload-types for backend

// Ralhum Sports WhatsApp Business Number - Should be an environment variable
export const WHATSAPP_BUSINESS_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_BUSINESS_NUMBER || '+94772350712';
// Added a fallback for local dev if env var is not set, but ensure it's set in Vercel.
// Consider logging a warning if the fallback is used in a non-development environment.

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
  const url = generateWhatsAppURL(order)

  // Open in new window/tab
  window.open(url, '_blank')
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

// --- START: Backend WhatsApp Service (Conceptual Stubs for Phase 4) ---
import { Payload } from 'payload'
import type { Order } from '@/payload-types' // Use the full Order type

/**
 * Simulates enqueuing a WhatsApp message to be sent by a background worker.
 * In a real implementation, this would add a job to a message queue (e.g., BullMQ, RabbitMQ, SQS).
 * The actual sending logic via a WhatsApp Business API provider would be in the worker.
 *
 * @param payload - Payload instance for logging or accessing other utilities.
 * @param order - The full order document.
 * @param messageType - A string identifying the type of message (e.g., 'order-confirmation', 'shipping-notification').
 */
export async function enqueueWhatsAppMessage(
  payload: Payload,
  order: Order,
  messageType: Order['whatsapp']['messageTemplate'] // Use the template type from Order
): Promise<void> {

  // 1. Determine the actual message content based on order and messageType
  let messageBody: string = `Message for order ${order.orderNumber} - Type: ${messageType}. Details to be formatted.`;

  // Example of using a more specific formatter (to be fully developed in Phase 4)
  if (messageType === 'order-confirmation' && order.customerName && order.orderItems && order.orderTotal !== undefined) {
     // Simplified version of formatWhatsAppMessage, adapted for full Order type
     const productList = order.orderItems
      .map(item => `• ${item.productName} x${item.quantity} - LKR ${item.subtotal.toFixed(2)}`)
      .join('\n');

    messageBody =
`🎉 RALHUM SPORTS - Order Confirmed! 🎉

Hi ${order.customerName},

Thank you for your order!
Order ID: ${order.orderNumber}

Items:
${productList}

Total: LKR ${order.orderTotal.toFixed(2)}

We'll notify you once it's shipped.
Track status: [Link to order tracking if available]`; // TODO: Add order tracking link
  } else if (messageType === 'shipping-notification' && order.shipping?.trackingNumber) {
    messageBody =
`🚚 Your Ralhum Sports Order #${order.orderNumber} has shipped! 🚚

Tracking: ${order.shipping.courier || 'Courier'} - ${order.shipping.trackingNumber}
Estimated Delivery: ${order.shipping.estimatedDelivery ? new Date(order.shipping.estimatedDelivery).toLocaleDateString() : 'N/A'}

Thank you!`;
  } else if (messageType === 'delivery-confirmation') {
     messageBody =
`✅ Your Ralhum Sports Order #${order.orderNumber} has been delivered! ✅

We hope you enjoy your items. Thank you for shopping with us!`;
  }
  // Add more templates as needed...

  payload.logger.info({
    msg: '[WhatsApp Stub] Message enqueued (simulated)',
    orderId: order.id,
    customerPhone: order.customerPhone,
    messageType,
    // messageBody, // Optionally log full body in dev, be mindful of PII in prod logs
  });

  // In a real system:
  // 1. Add to a persistent queue:
  //    await messageQueue.add('send-whatsapp', { orderId: order.id, customerPhone: order.customerPhone, messageBody, messageType });
  // 2. A separate worker process would pick this up.
  // 3. The worker would call the actual WhatsApp API (e.g., Meta Cloud API, Twilio).
  // 4. Upon successful sending by the worker, it might update the order's whatsapp.messageSent and whatsapp.messageTimestamp fields.
  //    This update would likely be a direct DB update or a small Payload update operation by the worker.

  // For now, we are just logging. The actual sending and updating messageSent status
  // will be part of the full Phase 4 implementation.
}
// --- END: Backend WhatsApp Service (Conceptual Stubs for Phase 4) ---
