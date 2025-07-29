// PayHere Payment Interface
export interface PayHerePayment {
  sandbox: boolean
  merchant_id: string
  return_url: string
  cancel_url: string
  notify_url: string
  order_id: string
  items: string
  amount: string
  currency: 'LKR' | 'USD'
  hash: string
  first_name: string
  last_name: string
  email: string
  phone: string
  address: string
  city: string
  country: string
  delivery_address?: string
  delivery_city?: string
  delivery_country?: string
  platform?: string
  custom_1?: string
  custom_2?: string
  item_name_1?: string
  item_number_1?: string
  amount_1?: string
  quantity_1?: string
  // Additional items can be added as needed
}

// PayHere Notification Interface
export interface PayHereNotification {
  merchant_id: string
  order_id: string
  payment_id: string
  payhere_amount: string
  payhere_currency: string
  status_code: string
  md5sig: string
  custom_1?: string
  custom_2?: string
  method?: string
  status_message?: string
  card_holder_name?: string
  card_no?: string
  card_expiry?: string
}

// PayHere Status Codes
export enum PayHereStatusCode {
  SUCCESS = '2',
  PENDING = '0',
  CANCELLED = '-1',
  FAILED = '-2',
  CHARGEDBACK = '-3',
}

// PayHere Config Interface
export interface PayHereConfig {
  merchantId: string
  merchantSecret: string
  sandbox: boolean
  notifyUrl: string
}

// Hash Generation Response
export interface HashGenerationResponse {
  hash: string
  orderId: string
}

// Window type declaration for PayHere
declare global {
  interface Window {
    payhere: {
      startPayment: (payment: PayHerePayment) => void
      onCompleted: (orderId: string) => void
      onDismissed: () => void
      onError: (error: string) => void
    }
  }
}
