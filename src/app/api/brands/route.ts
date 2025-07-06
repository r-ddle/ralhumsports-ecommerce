import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Brand as BrandPayloadType, Media } from '@/payload-types' // Renamed to avoid conflict
import { getSecurityHeaders } from '@/lib/response-filter'

// Define a specific type for the transformed brand data returned by this API
interface TransformedBrand {
  id: string | number;
  name: string;
  slug: string;
  description?: string | null;
  logo?: {
    url: string;
    alt: string;
  } | null; // Allow null if logo is not present or not populated
  website?: string | null;
  countryOfOrigin?: string | null;
  isFeatured?: boolean | null;
  isPremium?: boolean | null;
  priceRange?: 'budget' | 'mid-range' | 'premium' | 'luxury' | null;
  productCount?: number | null;
}

export async function GET() {
  const payload = await getPayload({ config })
  try {
    const result = await payload.find({
      collection: 'brands',
      where: {
        status: { equals: 'active' },
      },
      sort: 'name',
      limit: 100, // Consider if pagination is needed for >100 active brands
      depth: 1, // Depth 1 should be enough to populate the 'logo' (Media) object
    })

    const transformedBrands: TransformedBrand[] = result.docs.map((doc) => {
      const brand = doc as BrandPayloadType; // Assert type from payload-types
      let logoData: TransformedBrand['logo'] = null;

      if (brand.logo && typeof brand.logo === 'object') {
        const logoMedia = brand.logo as Media; // Assert that populated logo is Media
        if (logoMedia.url) {
          logoData = {
            url: logoMedia.url,
            alt: logoMedia.alt || brand.name, // Fallback alt text
          };
        }
      } else if (brand.logo && (typeof brand.logo === 'string' || typeof brand.logo === 'number')) {
        // Logo is an ID, not populated - this case should ideally not happen with depth:1 if configured correctly
        // but as a fallback, we don't include logo URL.
        // Or, you could make another fetch here, but that's N+1.
        payload.logger.warn(`Brand logo for ${brand.name} (ID: ${brand.id}) is an ID, not populated. Depth might be insufficient or link broken.`);
      }

      return {
        id: brand.id,
        name: brand.name,
        slug: brand.slug,
        description: brand.description,
        logo: logoData,
        website: brand.website,
        countryOfOrigin: brand.countryOfOrigin,
        isFeatured: brand.isFeatured,
        isPremium: brand.isPremium,
        priceRange: brand.priceRange,
        productCount: brand.productCount,
      }
    })

    return NextResponse.json(
      { success: true, data: transformedBrands },
      { headers: getSecurityHeaders() },
    )
  } catch (error) {
    const err = error as Error;
    payload.logger.error({ msg: 'Brands API error', error: err.message, stack: err.stack });
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch brands.',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined,
      },
      { status: 500, headers: getSecurityHeaders() },
    )
  }
}
