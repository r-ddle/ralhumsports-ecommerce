import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Category as CategoryPayloadType, Media } from '@/payload-types' // Renamed to avoid conflict
import { getSecurityHeaders } from '@/lib/response-filter'

// Define a specific type for the transformed category data returned by this API
interface TransformedCategory {
  id: string | number;
  name: string;
  slug: string;
  description?: string | null;
  image?: {
    url: string;
    alt: string;
  } | null; // Allow null if image is not present or not populated
  icon?: string | null;
  displayOrder: number; // Assuming displayOrder is always present
  productCount?: number | null;
  isFeature?: boolean | null;
  showInNavigation?: boolean | null;
}

export async function GET() {
  const payload = await getPayload({ config })
  try {
    const result = await payload.find({
      collection: 'categories',
      where: {
        status: { equals: 'active' }, // Only fetch active categories
      },
      sort: 'displayOrder', // Sort by displayOrder
      limit: 100, // Consider pagination if there can be many categories
      depth: 1, // Depth 1 should populate the 'image' (Media) object
    })

    const transformedCategories: TransformedCategory[] = result.docs.map((doc) => {
      const category = doc as CategoryPayloadType; // Assert type
      let imageData: TransformedCategory['image'] = null;

      if (category.image && typeof category.image === 'object') {
        const imageMedia = category.image as Media; // Assert populated image is Media
        if (imageMedia.url) {
          imageData = {
            url: imageMedia.url,
            alt: imageMedia.alt || category.name, // Fallback alt text
          };
        }
      } else if (category.image && (typeof category.image === 'string' || typeof category.image === 'number')) {
        payload.logger.warn(`Category image for ${category.name} (ID: ${category.id}) is an ID, not populated. Depth might be insufficient or link broken.`);
      }

      return {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        image: imageData,
        icon: category.icon,
        displayOrder: category.displayOrder, // displayOrder is required in collection, so should exist
        productCount: category.productCount,
        isFeature: category.isFeature,
        showInNavigation: category.showInNavigation,
      }
    })

    return NextResponse.json(
      { success: true, data: transformedCategories },
      { headers: getSecurityHeaders() },
    )
  } catch (error) {
    const err = error as Error;
    payload.logger.error({ msg: 'Categories API error', error: err.message, stack: err.stack });
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch categories.',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined,
      },
      { status: 500, headers: getSecurityHeaders() },
    )
  }
}
