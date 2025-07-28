import { NextRequest, NextResponse } from 'next/server'
import config from '@payload-config'
import type { PaymentInitiationRequest, PaymentInitiationResponse } from '@/types/payhere'
import { formatPaymentData, PAYHERE_CONFIG } from '@/lib/payhere-config'
import { getPayload } from 'payload'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })

    const body: PaymentInitiationRequest = await request.json()

    // Validate required fields
    if (!body.orderId || !body.customerInfo || !body.items || !body.amount) {
      return NextResponse.json(
        { success: false, error: 'Missing required payment information' },
        { status: 400 },
      )
    }

    // Verify order exists in database
    const order = await payload.findByID({
      collection: 'orders',
      id: body.orderId,
    })

    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 })
    }

    // Check if order is already paid
    if (order.status?.paymentStatus === 'paid') {
      return NextResponse.json({ success: false, error: 'Order is already paid' }, { status: 400 })
    }

    // Format payment data for PayHere
    const paymentData = formatPaymentData(
      body.orderId,
      body.customerInfo,
      body.items,
      body.amount,
      body.currency || 'LKR',
    )

    // Update order with payment initiation
    await payload.update({
      collection: 'orders',
      id: body.orderId,
      data: {
        status: {
          ...(order.status || {}),
          paymentStatus: 'pending',
        },
        paymentGateway: {
          paymentId: `pending_${Date.now()}`,
          statusCode: 'initiated',
          gatewayResponse: {
            initiated_at: new Date().toISOString(),
            payment_method: 'payhere',
            amount: body.amount,
            currency: body.currency || 'LKR',
          },
        },
      },
    })

    // Log payment initiation
    console.log(`Payment initiated for order ${body.orderId}:`, {
      amount: body.amount,
      currency: body.currency || 'LKR',
      customer: body.customerInfo.email,
    })

    const response: PaymentInitiationResponse = {
      success: true,
      paymentData,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Payment initiation error:', error)

    const response: PaymentInitiationResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Payment initiation failed',
    }

    return NextResponse.json(response, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}
