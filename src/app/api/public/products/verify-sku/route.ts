import { NextRequest, NextResponse } from 'next/server'
import payload from 'payload'

// POST or GET: /api/public/products/verify-sku?sku=SKU123
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const sku = searchParams.get('sku')
  if (!sku) {
    return NextResponse.json({ error: 'SKU is required' }, { status: 400 })
  }

  // Check products for matching SKU
  const product = await payload.find({
    collection: 'products',
    where: { sku: { equals: sku } },
    limit: 1,
  })
  if (product.docs.length > 0) {
    return NextResponse.json({ exists: true, type: 'product' })
  }

  // Check variants for matching SKU
  const variant = await payload.find({
    collection: 'products',
    where: { 'variants.sku': { equals: sku } },
    limit: 1,
  })
  if (variant.docs.length > 0) {
    return NextResponse.json({ exists: true, type: 'variant' })
  }

  return NextResponse.json({ exists: false })
}

export async function POST(req: NextRequest) {
  const { sku } = await req.json()
  if (!sku) {
    return NextResponse.json({ error: 'SKU is required' }, { status: 400 })
  }

  // Check products for matching SKU
  const product = await payload.find({
    collection: 'products',
    where: { sku: { equals: sku } },
    limit: 1,
  })
  if (product.docs.length > 0) {
    return NextResponse.json({ exists: true, type: 'product' })
  }

  // Check variants for matching SKU
  const variant = await payload.find({
    collection: 'products',
    where: { 'variants.sku': { equals: sku } },
    limit: 1,
  })
  if (variant.docs.length > 0) {
    return NextResponse.json({ exists: true, type: 'variant' })
  }

  return NextResponse.json({ exists: false })
}
