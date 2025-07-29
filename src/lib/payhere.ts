import crypto from 'crypto'
import { PayHerePayment, PayHereNotification, PayHereStatusCode } from '@/types/payhere'

// PayHere configuration
export const PAYHERE_CONFIG = {
  merchantId: process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID!,
  merchantSecret: process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_SECRET!,
  sandbox: process.env.NODE_ENV !== 'production',
  scriptUrl: 'https://www.payhere.lk/lib/payhere.js',
  notifyUrl: process.env.NEXT_PUBLIC_SERVER_URL
    ? `${process.env.NEXT_PUBLIC_SERVER_URL}/api/payhere/notify`
    : 'https://ralhumsports.lk/api/payhere/notify',
}

// FIXED: Generate hash for payment - Updated to match PayHere documentation exactly
export function generatePaymentHash(
  orderId: string,
  amount: number,
  currency: 'LKR' | 'USD' = 'LKR',
): string {
  const merchantId = PAYHERE_CONFIG.merchantId
  const merchantSecret = PAYHERE_CONFIG.merchantSecret

  // CRITICAL FIX: Format amount exactly as PayHere documentation specifies
  // OLD: const formattedAmount = amount.toFixed(2)
  // NEW: Use PayHere's exact formatting
  const formattedAmount = parseFloat(amount.toString())
    .toLocaleString('en-us', { minimumFractionDigits: 2 })
    .replace(/,/g, '')

  console.log(
    `[PayHere Hash] Generating hash for: ${merchantId} + ${orderId} + ${formattedAmount} + ${currency}`,
  )

  // Generate merchant secret hash (uppercase MD5)
  const hashedSecret = crypto.createHash('md5').update(merchantSecret).digest('hex').toUpperCase()

  // Generate payment hash (uppercase MD5)
  const hashString = merchantId + orderId + formattedAmount + currency + hashedSecret
  const hash = crypto.createHash('md5').update(hashString).digest('hex').toUpperCase()

  console.log(`[PayHere Hash] Generated hash: ${hash}`)

  return hash
}

// Verify payment notification
export function verifyPaymentNotification(notification: PayHereNotification): boolean {
  const { merchant_id, order_id, payhere_amount, payhere_currency, status_code, md5sig } =
    notification

  const merchantSecret = PAYHERE_CONFIG.merchantSecret

  // Generate local hash for verification (uppercase MD5)
  const hashedSecret = crypto.createHash('md5').update(merchantSecret).digest('hex').toUpperCase()

  const localHash = crypto
    .createHash('md5')
    .update(merchant_id + order_id + payhere_amount + payhere_currency + status_code + hashedSecret)
    .digest('hex')
    .toUpperCase()

  console.log(`[PayHere Verify] Local hash: ${localHash}, PayHere hash: ${md5sig}`)

  return localHash === md5sig
}

// FIXED: Format amount for PayHere
export function formatAmount(amount: number): string {
  return parseFloat(amount.toString())
    .toLocaleString('en-us', { minimumFractionDigits: 2 })
    .replace(/,/g, '')
}

// Parse customer name
export function parseCustomerName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(' ')
  const firstName = parts[0] || ''
  const lastName = parts.slice(1).join(' ') || firstName

  return { firstName, lastName }
}

// Build payment object
export function buildPaymentObject(
  orderId: string,
  amount: number,
  customerInfo: {
    fullName: string
    email: string
    phone: string
    address: string
    city: string
    postalCode: string
    province: string
  },
  items: string,
  hash: string,
  returnUrl: string,
  cancelUrl: string,
  deliveryAddress?: {
    address: string
    city: string
    postalCode: string
    province: string
  },
): PayHerePayment {
  const { firstName, lastName } = parseCustomerName(customerInfo.fullName)

  const payment: PayHerePayment = {
    sandbox: PAYHERE_CONFIG.sandbox,
    merchant_id: PAYHERE_CONFIG.merchantId,
    return_url: returnUrl,
    cancel_url: cancelUrl,
    notify_url: PAYHERE_CONFIG.notifyUrl,
    order_id: orderId,
    items,
    amount: formatAmount(amount), // Use the fixed formatAmount function
    currency: 'LKR',
    hash,
    first_name: firstName,
    last_name: lastName,
    email: customerInfo.email,
    phone: customerInfo.phone,
    address: `${customerInfo.address}, ${customerInfo.postalCode}`,
    city: customerInfo.city,
    country: 'Sri Lanka',
    platform: 'ralhum-sports',
    custom_1: customerInfo.province,
  }

  // Add delivery address if different
  if (deliveryAddress) {
    payment.delivery_address = `${deliveryAddress.address}, ${deliveryAddress.postalCode}`
    payment.delivery_city = deliveryAddress.city
    payment.delivery_country = 'Sri Lanka'
    payment.custom_2 = deliveryAddress.province
  }

  return payment
}

// Check if payment is successful
export function isPaymentSuccessful(statusCode: string): boolean {
  return statusCode === PayHereStatusCode.SUCCESS
}
