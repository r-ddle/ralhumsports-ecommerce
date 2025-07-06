import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { withRateLimit, rateLimitConfigs } from '@/lib/rate-limit'
import { getSecurityHeaders } from '@/lib/response-filter'
import type { Product, Category, Brand, Media } from '@/payload-types' // Import Payload types
import type { Where } from 'payload/types'


// Define specific result types for clarity and strong typing in response
interface TransformedProductImage {
  id: string | number;
  url: string;
  alt: string;
  filename?: string;
}
interface TransformedProductCategory {
  id: string | number;
  name: string;
  slug: string;
}
interface TransformedProductBrand {
  id: string | number;
  name: string;
  slug: string;
}
interface ProductSearchResult {
  id: string | number;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number | null;
  sku: string;
  stockStatus: 'In Stock' | 'Out of Stock'; // Simplified stock status
  // status: Product['status']; // Full status if needed by frontend
  images: TransformedProductImage[];
  category: TransformedProductCategory | null;
  brand: TransformedProductBrand | null;
  // features: string[]; // Decided to keep features concise or remove if not essential for search snippet
  // tags: string[];
}

interface CategorySearchResult {
  id: string | number;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  productCount?: number | null;
}

interface BrandSearchResult {
  id: string | number;
  name: string;
  slug: string;
  description?: string | null;
  logoUrl?: string | null;
  productCount?: number | null;
  // isFeatured: boolean; // If needed
}

interface SearchResults {
  products: ProductSearchResult[];
  categories: CategorySearchResult[];
  brands: BrandSearchResult[];
  totalResults: number;
}


export const GET = withRateLimit(
  rateLimitConfigs.search,
  async (request: NextRequest) => {
    const payload = await getPayload({ config })
    try {
      const { searchParams } = new URL(request.url)

      const query = searchParams.get('query') || ''
      const type = searchParams.get('type') || 'all' // 'all', 'products', 'categories', 'brands'
      const limitParam = searchParams.get('limit')

      const limit = limitParam ? Math.min(parseInt(limitParam, 10), 50) : 10; // Default 10, max 50

      if (isNaN(limit) || limit < 1) {
        return NextResponse.json(
          { success: false, error: 'Invalid limit parameter.' },
          { status: 400, headers: getSecurityHeaders() },
        )
      }
      if (!query.trim()) {
        return NextResponse.json(
          { success: false, error: 'Search query is required.' },
          { status: 400, headers: getSecurityHeaders() },
        )
      }
      if (query.trim().length < 2) {
        return NextResponse.json(
          { success: false, error: 'Search query must be at least 2 characters long.' },
          { status: 400, headers: getSecurityHeaders() },
        )
      }

      // Basic sanitization - consider more robust library if complex inputs are expected
      const sanitizedQuery = query.trim().replace(/[<>\"'`]/g, '');


      const results: SearchResults = {
        products: [],
        categories: [],
        brands: [],
        totalResults: 0,
      }

      const productSearchLimit = type === 'products' ? limit : Math.min(limit, 20);
      const categorySearchLimit = type === 'categories' ? limit : Math.min(limit, 10);
      const brandSearchLimit = type === 'brands' ? limit : Math.min(limit, 10);

      if (type === 'all' || type === 'products') {
        const productWhere: Where = {
          and: [
            { status: { equals: 'active' } },
            {
              or: [
                { name: { contains: sanitizedQuery } },
                { tags: { contains: sanitizedQuery } },
                { sku: { contains: sanitizedQuery } },
                // Consider searching in description if performance allows and it's relevant
                // { 'description.root.children.children.text': { contains: sanitizedQuery } } // Example for Lexical
              ],
            },
          ],
        };

        const productsResponse = await payload.find({
          collection: 'products',
          where: productWhere,
          limit: productSearchLimit,
          depth: 1, // Depth 1 to get category/brand IDs and basic image info
        })

        results.products = productsResponse.docs.map((doc) => {
          const product = doc as Product; // Assert type
          const firstImage = product.images?.[0]?.image as Media | undefined;
          const category = product.category as Category | undefined;
          const brand = product.brand as BrandType | undefined;

          return {
            id: product.id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            originalPrice: product.pricing?.originalPrice,
            sku: product.sku,
            stockStatus: (product.stock ?? 0) > 0 ? 'In Stock' : 'Out of Stock',
            images: firstImage ? [{ id: firstImage.id, url: firstImage.url || '', alt: firstImage.alt || product.name, filename: firstImage.filename || '' }] : [],
            category: category ? { id: category.id, name: category.name, slug: category.slug } : null,
            brand: brand ? { id: brand.id, name: brand.name, slug: brand.slug } : null,
          };
        });
        results.totalResults += productsResponse.totalDocs;
      }

      if (type === 'all' || type === 'categories') {
         const categoryWhere: Where = {
            and: [
                { status: { equals: 'active' } },
                { showInNavigation: { equals: true } },
                {
                  or: [
                    { name: { contains: sanitizedQuery } },
                    { description: { contains: sanitizedQuery } }, // Ensure description is plain text or handle rich text search carefully
                  ],
                },
            ],
        };
        const categoriesResponse = await payload.find({
          collection: 'categories',
          where: categoryWhere,
          limit: categorySearchLimit,
          depth: 1, // For category image
        })

        results.categories = categoriesResponse.docs.map((doc) => {
          const category = doc as Category;
          const image = category.image as Media | undefined;
          return {
            id: category.id,
            name: category.name,
            slug: category.slug,
            description: category.description,
            imageUrl: image?.url || null,
            productCount: category.productCount,
          };
        });
        results.totalResults += categoriesResponse.totalDocs;
      }

      if (type === 'all' || type === 'brands') {
        const brandWhere: Where = {
            and: [
                { status: { equals: 'active' } },
                 {
                  or: [
                    { name: { contains: sanitizedQuery } },
                    { description: { contains: sanitizedQuery } },
                  ],
                },
            ]
        };
        const brandsResponse = await payload.find({
          collection: 'brands',
          where: brandWhere,
          limit: brandSearchLimit,
          depth: 1, // For brand logo
        })
        results.brands = brandsResponse.docs.map((doc) => {
          const brand = doc as BrandType;
          const logo = brand.logo as Media | undefined;
          return {
            id: brand.id,
            name: brand.name,
            slug: brand.slug,
            description: brand.description,
            logoUrl: logo?.url || null,
            productCount: brand.productCount,
          }
        });
        results.totalResults += brandsResponse.totalDocs;
      }

      return NextResponse.json({ success: true, data: results }, { headers: getSecurityHeaders() })
    } catch (error) {
      const err = error as Error;
      payload.logger.error({ msg: 'Search API error', query, type, error: err.message, stack: err.stack });
      return NextResponse.json(
        {
          success: false,
          error: 'An error occurred during the search operation.',
          details: process.env.NODE_ENV === 'development' ? err.message : undefined,
        },
        { status: 500, headers: getSecurityHeaders() },
      )
    }
  },
)
