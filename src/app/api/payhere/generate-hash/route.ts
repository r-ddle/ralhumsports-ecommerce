import { NextRequest, NextResponse } from 'next/server'
import { generatePaymentHash } from '@/lib/payhere'
import { getSecurityHeaders } from '@/lib/response-filter'

interface HashGenerationRequest {
  orderId: string
  amount: number
  currency?: 'LKR' | 'USD'
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin')
  try {
    const body: HashGenerationRequest = await request.json()

    // Validate required fields
    if (
      typeof body.orderId !== 'string' ||
      body.orderId.trim() === '' ||
      typeof body.amount !== 'number' ||
      isNaN(body.amount)
    ) {
      return NextResponse.json(
        { success: false, error: 'Order ID and amount are required' },
        { status: 400, headers: getSecurityHeaders(origin || undefined) },
      )
    }

    // Generate hash
    const hash = generatePaymentHash(body.orderId, body.amount, body.currency || 'LKR')

    return NextResponse.json(
      {
        success: true,
        data: {
          hash,
          orderId: body.orderId,
          amount: body.amount,
        },
      },
      { headers: getSecurityHeaders(origin || undefined) },
    )
  } catch (error) {
    console.error('[PayHere Hash Generation] Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate hash' },
      { status: 500, headers: getSecurityHeaders(origin || undefined) },
    )
  }
}

// OPTIONS /api/payhere/generate-hash - Handle CORS preflight
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin')
  return new NextResponse(null, {
    status: 200,
    headers: getSecurityHeaders(origin || undefined),
  })
}
