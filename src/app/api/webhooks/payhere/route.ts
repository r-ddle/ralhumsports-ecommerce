import { NextRequest, NextResponse } from 'next/server'
import config from '@payload-config'
import type { WebhookPayload } from '@/types/payhere'
import { PaymentStatus, OrderStatus } from '@/types/payhere'
import { verifyWebhookSignature, PAYHERE_CONFIG } from '@/lib/payhere-config'
import { getPayload } from 'payload'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })

    // Parse webhook data
    const webhookData = await request.formData()
    const data: WebhookPayload = {
      payment_id: webhookData.get('payment_id') as string,
      payhere_amount: webhookData.get('payhere_amount') as string,
      payhere_currency: webhookData.get('payhere_currency') as string,
      status_code: webhookData.get('status_code') as string,
      md5sig: webhookData.get('md5sig') as string,
      custom_1: webhookData.get('custom_1') as string,
      custom_2: webhookData.get('custom_2') as string,
      method: webhookData.get('method') as string,
      status_message: webhookData.get('status_message') as string,
      card_holder_name: webhookData.get('card_holder_name') as string,
      card_no: webhookData.get('card_no') as string,
      order_id: webhookData.get('order_id') as string,
    }

    console.log('PayHere webhook received:', data)

    // Verify webhook signature
    const isValidSignature = verifyWebhookSignature(
      PAYHERE_CONFIG.merchant_id,
      data.order_id,
      data.payhere_amount,
      data.payhere_currency,
      data.status_code,
      data.md5sig,
    )

    if (!isValidSignature) {
      console.error('Invalid webhook signature for order:', data.order_id)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // Find the order
    const order = await payload.find({
      collection: 'orders',
      where: {
        orderNumber: {
          equals: data.order_id,
        },
      },
      limit: 1,
    })

    if (!order.docs || order.docs.length === 0) {
      console.error('Order not found for payment:', data.order_id)
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const orderDoc = order.docs[0]

    // Determine payment and order status based on PayHere status code
    let paymentStatus: PaymentStatus
    let orderStatus: OrderStatus =
      OrderStatus[orderDoc.status?.orderStatus?.toUpperCase() as keyof typeof OrderStatus] ||
      OrderStatus.PENDING

    switch (data.status_code) {
      case '2': // Success
        paymentStatus = PaymentStatus.COMPLETED
        orderStatus = OrderStatus.CONFIRMED
        break
      case '0': // Pending
        paymentStatus = PaymentStatus.PENDING
        break
      case '-1': // Canceled
        paymentStatus = PaymentStatus.CANCELLED
        orderStatus = OrderStatus.CANCELLED
        break
      case '-2': // Failed
        paymentStatus = PaymentStatus.FAILED
        break
      case '-3': // Chargedback
        paymentStatus = PaymentStatus.REFUNDED
        break
      default:
        paymentStatus = PaymentStatus.FAILED
    }

    // Map PaymentStatus enum to string literal type expected by orders collection
    function mapPaymentStatus(
      status: PaymentStatus,
    ): 'pending' | 'paid' | 'partially-paid' | 'failed' | 'refunded' | undefined {
      switch (status) {
        case PaymentStatus.PENDING:
          return 'pending'
        case PaymentStatus.COMPLETED:
          return 'paid'
        case PaymentStatus.CANCELLED:
          return 'failed'
        case PaymentStatus.FAILED:
          return 'failed'
        case PaymentStatus.REFUNDED:
          return 'refunded'
        default:
          return undefined
      }
    }

    // Update order with payment information
    const updatedOrder = await payload.update({
      collection: 'orders',
      id: orderDoc.id,
      data: {
        status: {
          paymentStatus: mapPaymentStatus(paymentStatus),
          orderStatus,
        },
        paymentGateway: {
          paymentId: data.payment_id,
          statusCode: data.status_code,
          gatewayResponse: {
            ...data,
            processed_at: new Date().toISOString(),
            payment_method: data.method,
            card_holder_name: data.card_holder_name,
            card_no: data.card_no ? `****${data.card_no.slice(-4)}` : undefined,
          },
        },
      },
    })

    // Update customer statistics if payment successful
    if (paymentStatus === PaymentStatus.COMPLETED) {
      try {
        // Find or create customer record
        const customerResult = await payload.find({
          collection: 'customers',
          where: {
            email: {
              equals: orderDoc.customer?.customerEmail,
            },
          },
          limit: 1,
        })

        if (customerResult.docs && customerResult.docs.length > 0) {
          const customer = customerResult.docs[0]

          await payload.update({
            collection: 'customers',
            id: customer.id,
            data: {
              totalOrders: (customer.totalOrders || 0) + 1,
              totalSpent: (customer.totalSpent || 0) + parseFloat(data.payhere_amount),
              lastOrderDate: new Date().toISOString(),
            },
          })
        }
      } catch (customerError) {
        console.error('Error updating customer statistics:', customerError)
        // Don't fail the webhook for customer update errors
      }
    }

    // Log the payment update
    console.log(`Payment ${paymentStatus} for order ${data.order_id}:`, {
      paymentId: data.payment_id,
      amount: data.payhere_amount,
      currency: data.payhere_currency,
      method: data.method,
    })

    // Send success response to PayHere
    return NextResponse.json({ status: 'success' })
  } catch (error) {
    console.error('Webhook processing error:', error)

    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}
