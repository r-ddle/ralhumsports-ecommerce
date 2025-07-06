import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrProductManager } from './Users'

export const Brands: CollectionConfig = {
  slug: 'brands',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'status', 'website', 'productCount'],
    group: 'Products',
    description: 'Manage brand information for products',
  },
  access: {
    // Product managers and above can create brands
    create: isAdminOrProductManager,
    // All authenticated users can read brands
    read: ({ req }) => Boolean(req.user),
    // Product managers and above can update brands
    update: isAdminOrProductManager,
    // Only admins can delete brands
    delete: isAdmin,
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
          ({ data, operation }) => {
            if (operation === 'create' || operation === 'update') {
              if (data?.name) {
                // Generate slug from name
                return data.name
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, '-')
                  .replace(/(^-|-$)/g, '')
              }
            }
          },
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
          ({ req, operation }) => {
            if (operation === 'create' && req.user) {
              return req.user.id
            }
          },
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
          ({ req, operation }) => {
            if (operation === 'update' && req.user) {
              return req.user.id
            }
          },
        ],
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ req, operation, data }) => {
        // Set created/modified by
        if (operation === 'create') {
          data.createdBy = req.user?.id
        }
        if (operation === 'update') {
          data.lastModifiedBy = req.user?.id
        }

        return data
      },
    ],
    afterChange: [
      async ({ req, operation, doc }) => {
        // Log brand operations
        if (operation === 'create') {
          req.payload.logger.info(`Brand created: ${doc.name} by ${req.user?.email}`)
        } else if (operation === 'update') {
          req.payload.logger.info(`Brand updated: ${doc.name} by ${req.user?.email}`)
        }

        // Update product count if status changes
        if (operation === 'update' && doc.status === 'inactive') {
          req.payload.logger.info(
            `Brand deactivated: ${doc.name} - this may affect product visibility`,
          )
        }
      },
    ],
    afterDelete: [
      async ({ req, doc }) => {
        // Log brand deletion
        req.payload.logger.warn(`Brand deleted: ${doc.name} by ${req.user?.email}`)

        // Note: In production, you'd want to handle reassigning products
        // from deleted brands or prevent deletion of brands with products
      },
    ],
  },
}
