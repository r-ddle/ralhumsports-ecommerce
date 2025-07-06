import type { CollectionConfig, CollectionBeforeChangeHook, CollectionAfterChangeHook, FieldHook, Access } from 'payload/types'
import type { User, Brand, Product } from '@/payload-types' // Import specific Payload types
import { isAdmin, isAdminOrProductManager } from './Users' // Ensure these are correctly typed for User
import { APIError } from 'payload/errors'

export const Brands: CollectionConfig = {
  slug: 'brands',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'status', 'website', 'productCount'],
    group: 'Products',
    description: 'Manage brand information for products',
  },
  access: {
    create: isAdminOrProductManager as Access<Brand, User>,
    read: (({ req: { user } }: { req: { user?: User | null } }) => Boolean(user)) as Access<Brand, User>,
    update: isAdminOrProductManager as Access<Brand, User>,
    delete: isAdmin as Access<Brand, User>,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Brand name - must be unique',
        placeholder: 'Enter brand name (e.g., Nike, Adidas, Under Armour)',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly version of the brand name',
        placeholder: 'auto-generated from name',
        readOnly: true,
      },
      hooks: {
        beforeValidate: [
          (({ data, operation }: { data: Partial<Brand>; operation?: 'create' | 'update' }) => {
            if ((operation === 'create' || operation === 'update') && data?.name && typeof data.name === 'string') {
              return data.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with -
                .replace(/(^-|-$)+/g, ''); // Remove leading/trailing hyphens
            }
            return data?.slug; // Return existing slug if no change
          }) as FieldHook<Brand, string | null | undefined, Brand>,
        ],
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Brand description and background information',
        placeholder: 'Tell customers about this brand...',
      },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Brand logo - preferably square format with transparent background',
      },
      filterOptions: {
        category: {
          equals: 'brands',
        },
      },
    },
    {
      name: 'website',
      type: 'text',
      admin: {
        description: 'Official brand website URL',
        placeholder: 'https://www.brandname.com',
      },
    },
    {
      name: 'countryOfOrigin',
      type: 'text',
      admin: {
        description: 'Country where the brand originates',
        placeholder: 'USA, Germany, Japan, etc.',
      },
    },
    {
      name: 'foundedYear',
      type: 'number',
      admin: {
        description: 'Year the brand was founded',
        placeholder: '1972',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        {
          label: 'Active',
          value: 'active',
        },
        {
          label: 'Inactive',
          value: 'inactive',
        },
        {
          label: 'Discontinued',
          value: 'discontinued',
        },
      ],
      admin: {
        description: 'Brand availability status',
      },
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Feature this brand on homepage or in navigation',
      },
    },
    {
      name: 'isPremium',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Mark as premium/luxury brand',
      },
    },

    // Contact and Social Information
    {
      name: 'contact',
      type: 'group',
      label: 'Contact Information',
      fields: [
        {
          name: 'email',
          type: 'email',
          admin: {
            description: 'Brand contact email',
            placeholder: 'contact@brandname.com',
          },
        },
        {
          name: 'phone',
          type: 'text',
          admin: {
            description: 'Brand contact phone number',
            placeholder: '+1 (555) 123-4567',
          },
        },
        {
          name: 'address',
          type: 'textarea',
          admin: {
            description: 'Brand headquarters address',
            placeholder: 'Street, City, Country',
          },
        },
      ],
    },

    // Social Media Links
    {
      name: 'social',
      type: 'group',
      label: 'Social Media',
      fields: [
        {
          name: 'facebook',
          type: 'text',
          admin: {
            description: 'Facebook page URL',
            placeholder: 'https://facebook.com/brandname',
          },
        },
        {
          name: 'instagram',
          type: 'text',
          admin: {
            description: 'Instagram profile URL',
            placeholder: 'https://instagram.com/brandname',
          },
        },
        {
          name: 'twitter',
          type: 'text',
          admin: {
            description: 'Twitter profile URL',
            placeholder: 'https://twitter.com/brandname',
          },
        },
        {
          name: 'youtube',
          type: 'text',
          admin: {
            description: 'YouTube channel URL',
            placeholder: 'https://youtube.com/brandname',
          },
        },
      ],
    },

    // SEO Fields
    {
      name: 'seo',
      type: 'group',
      label: 'SEO Settings',
      fields: [
        {
          name: 'title',
          type: 'text',
          admin: {
            description: 'SEO title for brand page',
            placeholder: 'Brand Name Products - Ralhum Sports',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          admin: {
            description: 'SEO meta description for brand page',
            placeholder: 'Shop brand name products at Ralhum Sports...',
          },
        },
        {
          name: 'keywords',
          type: 'text',
          admin: {
            description: 'SEO keywords separated by commas',
            placeholder: 'brand name, sports, equipment, Sri Lanka',
          },
        },
      ],
    },

    // Brand Specifications
    {
      name: 'specialties',
      type: 'textarea',
      admin: {
        description: 'What the brand specializes in',
        placeholder: 'Running shoes, athletic wear, sports equipment...',
      },
    },
    {
      name: 'priceRange',
      type: 'select',
      options: [
        { label: 'Budget', value: 'budget' },
        { label: 'Mid-Range', value: 'mid-range' },
        { label: 'Premium', value: 'premium' },
        { label: 'Luxury', value: 'luxury' },
      ],
      admin: {
        description: 'General price range for this brand',
      },
    },
    {
      name: 'targetAudience',
      type: 'text',
      admin: {
        description: 'Primary target audience',
        placeholder: 'Professional athletes, fitness enthusiasts, casual users...',
      },
    },

    // Auto-generated fields
    {
      name: 'productCount',
      type: 'number',
      admin: {
        readOnly: true,
        description: 'Number of active products from this brand',
      },
      defaultValue: 0,
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        readOnly: true,
        description: 'User who created this brand',
      },
      hooks: {
        beforeChange: [
          (({ req, operation }: { req: { user?: User | null }; operation?: 'create' | 'update' }) => {
            if (operation === 'create' && req.user) {
              return req.user.id;
            }
            return undefined;
          }) as FieldHook<Brand, User | number | null, User>,
        ],
      },
    },
    {
      name: 'lastModifiedBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        readOnly: true,
        description: 'User who last modified this brand',
      },
      hooks: {
        beforeChange: [
          (({ req, operation }: { req: { user?: User | null }; operation?: 'create' | 'update' }) => {
            if (operation === 'update' && req.user) {
              return req.user.id;
            }
            return undefined;
          }) as FieldHook<Brand, User | number | null, User>,
        ],
      },
    },
  ],
  hooks: {
    beforeChange: [
      (async ({ req, operation, data }) => {
        const brandData = data as Partial<Brand>;
        // const user = req.user as User | undefined | null; // User for createdBy/lastModifiedBy is handled by field hooks

        return brandData;
      }) as CollectionBeforeChangeHook<Brand>,
    ],
    afterChange: [
      (async ({ req, operation, doc, previousDoc }) => {
        const currentBrand = doc as Brand;
        const prevBrand = previousDoc as Brand | undefined;
        const user = req.user as User | undefined | null;
        const payload = req.payload;

        if (operation === 'create') {
          payload.logger.info(`Brand created: ${currentBrand.name} by ${user?.email || 'system'}`);
        } else if (operation === 'update') {
          payload.logger.info(`Brand updated: ${currentBrand.name} by ${user?.email || 'system'}`);
          if (prevBrand && prevBrand.status !== currentBrand.status && currentBrand.status === 'inactive') {
            payload.logger.info(
              `Brand deactivated: ${currentBrand.name}. This may affect product visibility and filtering.`,
            );
          }
          // Note: Product count updates are handled in Products.ts afterChange hook.
        }
      }) as CollectionAfterChangeHook<Brand>,
    ],
    beforeDelete: [
      async ({ req, id }) => {
        const payload = req.payload;
        if (id) {
            const { totalDocs } = await payload.find({
                collection: 'products',
                where: {
                    and: [
                        { brand: { equals: id } },
                        { status: { equals: 'active' } }
                    ]
                },
                limit: 0,
            });

            if (totalDocs > 0) {
                payload.logger.warn(`Attempt to delete brand ID ${id} which has ${totalDocs} active product(s).`);
                throw new APIError(
                    `Cannot delete brand. It is currently assigned to ${totalDocs} active product(s). Please reassign or deactivate these products first.`,
                    400,
                );
            }
        }
      }
    ],
    afterDelete: [
      (async ({ req, doc }) => {
        const deletedBrand = doc as Brand;
        const user = req.user as User | undefined | null;
        req.payload.logger.warn(
          `Brand deleted: ${deletedBrand.name} (ID: ${deletedBrand.id}) by ${user?.email || 'system'}`,
        );
      }) as CollectionAfterChangeHook<Brand>,
    ],
  },
}
