import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

// ✅ Add proper type for order update data
type OrderUpdateData = {
  orderStatus?:
    | 'pending'
    | 'confirmed'
    | 'processing'
    | 'shipped'
    | 'delivered'
    | 'cancelled'
    | 'refunded'
  paymentStatus?: 'pending' | 'refunded' | 'paid' | 'partially-paid' | 'failed' | undefined
  paymentMethod?: 'cod' | 'bank-transfer' | 'online-payment' | 'card-payment' | null | undefined
  shippingCost?: number
  discount?: number
  specialInstructions?: string
  shipping?: {
    trackingNumber?: string | null
    courier?: 'local' | 'pronto' | 'kapruka' | 'dhl' | 'fedex' | 'pickup' | null
    estimatedDelivery?: string | null
    actualDelivery?: string | null
  }
  whatsapp?: {
    messageSent?: boolean
    messageTimestamp?: string
    messageTemplate?:
      | 'order-confirmation'
      | 'order-update'
      | 'shipping-notification'
      | 'delivery-confirmation'
      | null
    customerResponse?: string
  }
  internalNotes?: string
  lastModifiedBy?: number
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const payload = await getPayload({ config })

    const order = await payload.findByID({
      collection: 'orders',
      id: parseInt(id),
      depth: 2,
    })

    return NextResponse.json(order)
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json(
      {
        errors: [{ message: 'Failed to fetch order' }],
      },
      { status: 500 },
    )
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const payload = await getPayload({ config })

    // ✅ Fix: Properly type the updateData
    let updateData: OrderUpdateData = {}

    try {
      const contentType = request.headers.get('content-type')

      if (contentType?.includes('multipart/form-data')) {
        const formData = await request.formData()
        const payloadData = formData.get('_payload')

        if (payloadData && typeof payloadData === 'string') {
          updateData = JSON.parse(payloadData) as OrderUpdateData
        } else {
          return NextResponse.json(
            { success: false, error: 'No payload data found' },
            { status: 400 },
          )
        }
      } else {
        const rawBody = await request.text()
        if (rawBody.trim()) {
          updateData = JSON.parse(rawBody) as OrderUpdateData
        }
      }
    } catch (parseError) {
      console.error('Parse error:', parseError)
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request format',
          details: parseError instanceof Error ? parseError.message : String(parseError),
        },
        { status: 400 },
      )
    }

    // Transform paymentStatus to allowed values if present
    const allowedPaymentStatuses = [
      'pending',
      'refunded',
      'paid',
      'partially-paid',
      'failed',
    ] as const
    if (
      typeof updateData.paymentStatus === 'string' &&
      !allowedPaymentStatuses.includes(
        updateData.paymentStatus as (typeof allowedPaymentStatuses)[number],
      )
    ) {
      updateData.paymentStatus = undefined
    }

    // Transform paymentMethod to allowed values if present
    const allowedPaymentMethods = [
      'cod',
      'bank-transfer',
      'online-payment',
      'card-payment',
    ] as const
    if (
      typeof updateData.paymentMethod === 'string' &&
      !allowedPaymentMethods.includes(
        updateData.paymentMethod as (typeof allowedPaymentMethods)[number],
      )
    ) {
      updateData.paymentMethod = undefined
    }

    // Transform shipping.courier if present and not valid
    if (updateData.shipping && updateData.shipping.courier !== undefined) {
      const allowedCouriers = ['local', 'pronto', 'kapruka', 'dhl', 'fedex', 'pickup']
      if (
        updateData.shipping.courier !== null &&
        !allowedCouriers.includes(updateData.shipping.courier)
      ) {
        updateData.shipping.courier = null
      }
    }

    const updatedOrder = await payload.update({
      collection: 'orders',
      id: parseInt(id),
      data: updateData,
    })

    return NextResponse.json(updatedOrder)
  } catch (error) {
    console.error('Order update error:', error)
    return NextResponse.json(
      {
        errors: [{ message: error instanceof Error ? error.message : 'Failed to update order' }],
      },
      { status: 500 },
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const payload = await getPayload({ config })

    await payload.delete({
      collection: 'orders',
      id: parseInt(id),
    })

    return NextResponse.json({
      success: true,
      message: 'Order deleted successfully',
    })
  } catch (error) {
    console.error('Order deletion error:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete order' }, { status: 500 })
  }
}
