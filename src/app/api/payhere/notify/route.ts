import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { PayHereNotification, PayHereStatusCode } from '@/types/payhere'
import { verifyPaymentNotification, isPaymentSuccessful } from '@/lib/payhere'
import { getSecurityHeaders } from '@/lib/response-filter'

export async function POST(request: NextRequest) {
  console.log('[PayHere Notify] Processing payment notification')
  console.log('[PayHere Notify] Request headers:', Object.fromEntries(request.headers.entries()))

  try {
    // Parse form data (PayHere sends application/x-www-form-urlencoded)
    const formData = await request.formData()
    const notification: PayHereNotification = {
      merchant_id: formData.get('merchant_id') as string,
      order_id: formData.get('order_id') as string,
      payment_id: formData.get('payment_id') as string,
      payhere_amount: formData.get('payhere_amount') as string,
      payhere_currency: formData.get('payhere_currency') as string,
      status_code: formData.get('status_code') as string,
      md5sig: formData.get('md5sig') as string,
      custom_1: formData.get('custom_1') as string | undefined,
      custom_2: formData.get('custom_2') as string | undefined,
      method: formData.get('method') as string | undefined,
      status_message: formData.get('status_message') as string | undefined,
      card_holder_name: formData.get('card_holder_name') as string | undefined,
      card_no: formData.get('card_no') as string | undefined,
      card_expiry: formData.get('card_expiry') as string | undefined,
    }

    console.log('[PayHere Notify] Notification data:', {
      ...notification,
      md5sig: notification.md5sig?.substring(0, 8) + '...',
    })

    // Verify payment notification
    if (!verifyPaymentNotification(notification)) {
      console.error('[PayHere Notify] Invalid payment signature')
      return NextResponse.json(
        { success: false, error: 'Invalid signature' },
        { status: 400, headers: getSecurityHeaders() },
      )
    }

    const payload = await getPayload({ config })

    // Find order
    const orders = await payload.find({
      collection: 'orders',
      where: {
        orderNumber: { equals: notification.order_id },
      },
      limit: 1,
    })

    if (orders.docs.length === 0) {
      console.error('[PayHere Notify] Order not found:', notification.order_id)
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404, headers: getSecurityHeaders() },
      )
    }

    const order = orders.docs[0]

    // Update order based on payment status
    const paymentStatus = isPaymentSuccessful(notification.status_code)
      ? 'paid'
      : notification.status_code === PayHereStatusCode.PENDING
        ? 'pending'
        : 'failed'

    const orderStatus = isPaymentSuccessful(notification.status_code)
      ? 'confirmed'
      : order.status.orderStatus

    console.log('[PayHere Notify] Updating order status:', {
      orderId: order.id,
      orderNumber: notification.order_id,
      paymentStatus,
      orderStatus,
      statusCode: notification.status_code,
    })

    await payload.update({
      collection: 'orders',
      id: order.id,
      data: {
        status: {
          ...order.status,
          paymentStatus,
          orderStatus,
        },
        paymentInfo: {
          paymentMethod: notification.method || 'online-payment',
          paymentId: notification.payment_id,
          paymentStatus: notification.status_message,
          paymentDate: new Date().toISOString(),
          cardInfo: notification.card_no
            ? {
                maskedNumber: notification.card_no,
                cardHolderName: notification.card_holder_name,
                expiryDate: notification.card_expiry,
              }
            : undefined,
        },
      },
    })

    console.log(
      '[PayHere Notify] Order updated successfully - ID:',
      order.id,
      'Payment Status:',
      paymentStatus,
    )

    // PayHere expects a plain text response
    return new Response('OK', {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        ...getSecurityHeaders(request.headers.get('origin') || undefined),
      },
    })
  } catch (error) {
    console.error('[PayHere Notify] Error:', error)
    return new Response('ERROR', {
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
        ...getSecurityHeaders(request.headers.get('origin') || undefined),
      },
    })
  }
}

// OPTIONS /api/payhere/notify - Handle CORS preflight
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin')
  return new Response(null, {
    status: 200,
    headers: getSecurityHeaders(origin || undefined),
  })
}
