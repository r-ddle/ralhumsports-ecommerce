import { NextRequest, NextResponse } from 'next/server'
import payload from 'payload'

// GET /api/products?category=slug&sport=slug&item=slug&brand=slug
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const sport = searchParams.get('sport')
  const item = searchParams.get('item')
  const brand = searchParams.get('brand')

  // Build query for products with hierarchical relationships
  const where: any = {}
  if (category) {
    // Match category by slug or by parentCategory.slug if it's a subcategory
    where['category.slug'] = category
    where['category.type'] = 'category'
  }
  if (sport) {
    where['sport.slug'] = sport
    where['sport.type'] = 'sport'
  }
  if (item) {
    where['item.slug'] = item
    where['item.type'] = 'item'
  }
  if (brand) {
    where['brand.slug'] = brand
  }

  // Fetch products from Payload
  const products = await payload.find({
    collection: 'products',
    where,
    limit: 50,
    sort: '-createdAt',
    depth: 2, // Populate relationships for category, sport, item, brand
  })

  // Optionally, format response to include hierarchy info
  const formatted = products.docs.map((product: any) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    category: product.category?.name || null,
    categorySlug: product.category?.slug || null,
    sport: product.sport?.name || null,
    sportSlug: product.sport?.slug || null,
    item: product.item?.name || null,
    itemSlug: product.item?.slug || null,
    brand: product.brand?.name || null,
    brandSlug: product.brand?.slug || null,
    price: product.price,
    images: product.images,
    status: product.status,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  }))

  return NextResponse.json({
    totalDocs: products.totalDocs,
    limit: products.limit,
    page: products.page,
    totalPages: products.totalPages,
    docs: formatted,
  })
}

// POST, PUT, DELETE can be added as needed for admin/product manager actions
