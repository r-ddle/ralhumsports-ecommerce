import crypto from 'crypto'
import type { PayHereConfig, PayHerePayment } from '@/types/payhere'

export const PAYHERE_CONFIG: PayHereConfig = {
  sandbox: process.env.NODE_ENV !== 'production',
  merchant_id: process.env.PAYHERE_MERCHANT_ID || '',
  return_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
  cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`,
  notify_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/payhere`,
}

export const PAYHERE_ENDPOINTS = {
  sandbox: 'https://sandbox.payhere.lk/pay/checkout',
  production: 'https://www.payhere.lk/pay/checkout',
}

// Generate MD5 hash for PayHere payment verification
export function generatePayHereHash(payment: PayHerePayment): string {
  const merchant_secret = process.env.PAYHERE_MERCHANT_SECRET || ''
  const merchant_id = PAYHERE_CONFIG.merchant_id
  // Format amount as 2 decimals, no commas
  const amountFormatted = parseFloat(payment.amount)
    .toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    .replace(/,/g, '')
  // Hash the merchant secret as per docs
  const hashedSecret = crypto.createHash('md5').update(merchant_secret).digest('hex').toUpperCase()
  const hashString = [
    merchant_id,
    payment.order_id,
    amountFormatted,
    payment.currency,
    hashedSecret,
  ].join('')
  return crypto.createHash('md5').update(hashString).digest('hex').toUpperCase()
}

// Verify webhook signature
export function verifyWebhookSignature(
  merchant_id: string,
  order_id: string,
  payhere_amount: string,
  payhere_currency: string,
  status_code: string,
  md5sig: string,
): boolean {
  const merchant_secret = process.env.PAYHERE_MERCHANT_SECRET || '1231118'

  const hashString = [
    merchant_id,
    order_id,
    payhere_amount,
    payhere_currency,
    status_code,
    merchant_secret,
  ].join('')

  const localHash = crypto.createHash('md5').update(hashString).digest('hex').toUpperCase()

  return localHash === md5sig
}

// Format payment data for PayHere
export function formatPaymentData(
  orderId: string,
  customerInfo: any,
  items: any[],
  amount: number,
  currency: string = 'LKR',
): PayHerePayment {
  const itemsString = items.map((item) => `${item.name} (${item.quantity})`).join(', ')

  const paymentData: any = {
    merchant_id: PAYHERE_CONFIG.merchant_id,
    return_url: PAYHERE_CONFIG.return_url,
    cancel_url: PAYHERE_CONFIG.cancel_url,
    notify_url: PAYHERE_CONFIG.notify_url,
    order_id: orderId,
    items: itemsString,
    amount: amount.toFixed(2),
    currency,
    first_name: customerInfo.firstName || customerInfo.fullName?.split(' ')[0] || '',
    last_name: customerInfo.lastName || customerInfo.fullName?.split(' ').slice(1).join(' ') || '',
    email: customerInfo.email,
    phone: customerInfo.phone,
    address: customerInfo.address?.street || customerInfo.address || '',
    city: customerInfo.address?.city || customerInfo.city || '',
    country: 'Sri Lanka',
    delivery_address: customerInfo.address?.street || customerInfo.address || '',
    delivery_city: customerInfo.address?.city || customerInfo.city || '',
    delivery_country: 'Sri Lanka',
    custom_1: orderId, // Store order ID for reference
    custom_2: 'website', // Order source
  }

  // Generate hash
  paymentData.hash = generatePayHereHash(paymentData)

  return paymentData
}
