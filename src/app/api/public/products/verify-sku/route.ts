import payloadConfig from '@/payload.config'
import { NextRequest, NextResponse } from 'next/server'
import payload from 'payload'

async function ensurePayloadInitialized() {
  try {
    await payload.init({
      config: payloadConfig,
    })
  } catch (e: any) {
    // Ignore error if already initialized
    if (!e.message?.includes('Payload is already initialized')) {
      throw e
    }
  }
}

// POST or GET: /api/public/products/verify-sku?sku=SKU123
export async function GET(req: NextRequest) {
  await ensurePayloadInitialized()
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
    return NextResponse.json({ exists: true, type: 'product', product: product.docs[0] })
  }

  // Check variants for matching SKU
  const variantProduct = await payload.find({
    collection: 'products',
    where: { 'variants.sku': { equals: sku } },
    limit: 1,
  })
  if (variantProduct.docs.length > 0) {
    const foundProduct = variantProduct.docs[0]
    const foundVariant = foundProduct.variants?.find((v: any) => v.sku === sku)
    return NextResponse.json({
      exists: true,
      type: 'variant',
      product: foundProduct,
      variant: foundVariant,
    })
  }

  return NextResponse.json({ exists: false })
}

export async function POST(req: NextRequest) {
  await ensurePayloadInitialized()
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
    return NextResponse.json({ exists: true, type: 'product', product: product.docs[0] })
  }

  // Check variants for matching SKU
  const variantProduct = await payload.find({
    collection: 'products',
    where: { 'variants.sku': { equals: sku } },
    limit: 1,
  })
  if (variantProduct.docs.length > 0) {
    const foundProduct = variantProduct.docs[0]
    const foundVariant = foundProduct.variants?.find((v: any) => v.sku === sku)
    return NextResponse.json({
      exists: true,
      type: 'variant',
      product: foundProduct,
      variant: foundVariant,
    })
  }

  return NextResponse.json({ exists: false })
}
