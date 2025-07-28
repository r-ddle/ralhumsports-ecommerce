export interface PayHereConfig {
  sandbox: boolean
  merchant_id: string
  return_url: string
  cancel_url: string
  notify_url: string
}

export interface PayHerePayment {
  merchant_id: string
  return_url: string
  cancel_url: string
  notify_url: string
  order_id: string
  items: string
  amount: string
  currency: string
  hash: string
  first_name: string
  last_name: string
  email: string
  phone: string
  address: string
  city: string
  country: string
  delivery_address: string
  delivery_city: string
  delivery_country: string
  custom_1?: string
  custom_2?: string
}

export interface PayHereResponse {
  payment_id: string
  payhere_amount: string
  payhere_currency: string
  status_code: string
  md5sig: string
  custom_1?: string
  custom_2?: string
  method: string
  status_message: string
  card_holder_name?: string
  card_no?: string
}

export interface PaymentInitiationRequest {
  orderId: string
  customerInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    city: string
    country: string
  }
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  amount: number
  currency: string
  returnUrl?: string
  cancelUrl?: string
}

export interface PaymentInitiationResponse {
  success: boolean
  paymentData?: PayHerePayment
  error?: string
}

export interface WebhookPayload extends PayHereResponse {
  order_id: string
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}
