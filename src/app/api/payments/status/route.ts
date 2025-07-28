// app/api/payments/status/route.ts
import { NextRequest, NextResponse } from 'next/server'
import config from '@payload-config'
import { getPayload } from 'payload'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('orderId')

    if (!orderId) {
      return NextResponse.json({ success: false, error: 'Order ID is required' }, { status: 400 })
    }

    // Find the order by order number
    const order = await payload.find({
      collection: 'orders',
      where: {
        orderNumber: {
          equals: orderId,
        },
      },
      limit: 1,
    })

    if (!order.docs || order.docs.length === 0) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 })
    }

    const orderDoc = order.docs[0]

    return NextResponse.json({
      success: true,
      data: {
        orderId: orderDoc.orderNumber,
        orderStatus: orderDoc.status?.orderStatus,
        paymentStatus: orderDoc.status?.paymentStatus,
        paymentId: orderDoc.paymentGateway?.paymentId,
        amount: orderDoc.orderSummary.orderTotal,
        currency: 'LKR',
        lastUpdated: orderDoc.updatedAt,
        paymentMethod:
          typeof orderDoc.paymentGateway?.gatewayResponse === 'object' &&
          orderDoc.paymentGateway?.gatewayResponse !== null &&
          'payment_method' in orderDoc.paymentGateway.gatewayResponse
            ? (orderDoc.paymentGateway.gatewayResponse as { payment_method?: string })
                .payment_method
            : 'unknown',
      },
    })
  } catch (error) {
    console.error('Payment status check error:', error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to check payment status',
      },
      { status: 500 },
    )
  }
}

export async function POST() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}
