import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrProductManager } from './Users'

export const Brands: CollectionConfig = {
  slug: 'brands',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'status', 'productCount', 'isFeatured', 'isPremium'],
    group: 'Catalog',
    description: 'Manage product brands and manufacturers',
    listSearchableFields: ['name', 'description'],
    pagination: {
      defaultLimit: 50,
    },
  },
  access: {
    create: isAdminOrProductManager,
    read: () => true,
    update: isAdminOrProductManager,
    delete: isAdmin,
  },
  fields: [
    // Essential Brand Information
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Brand name',
        placeholder: 'Enter brand name (e.g., Nike, Adidas)',
      },
      validate: (value: string | null | undefined) => {
        if (!value || value.length < 2) {
          return 'Brand name must be at least 2 characters long'
        }
        return true
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        readOnly: true,
        description: 'Auto-generated URL slug',
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          ({ data, operation }) => {
            if ((operation === 'create' || operation === 'update') && data?.name) {
              return data.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')
            }
          },
        ],
      },
    },

    // Brand Visual Identity
    {
      name: 'branding',
      type: 'group',
      label: '🎨 Brand Identity',
      fields: [
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: {
            description: 'Brand logo image',
          },
          filterOptions: {
            category: { equals: 'brands' },
          },
        },
        {
          name: 'description',
          type: 'textarea',
          admin: {
            description: 'Brand description for customers',
            rows: 3,
          },
        },
      ],
    },

    // Status and Quick Settings
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        { label: '✅ Active', value: 'active' },
        { label: '⏸️ Inactive', value: 'inactive' },
        { label: '🚫 Discontinued', value: 'discontinued' },
      ],
      admin: {
        description: 'Brand status',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'isFeatured',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: '⭐ Feature on homepage',
            width: '50%',
          },
        },
        {
          name: 'isPremium',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: '💎 Premium brand',
            width: '50%',
          },
        },
      ],
    },

    // Advanced Settings Toggle
    {
      name: 'showAdvanced',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: '🔧 Show advanced settings',
        position: 'sidebar',
      },
    },

    // Brand Details (Advanced)
    {
      name: 'details',
      type: 'group',
      label: '📋 Brand Details',
      admin: {
        condition: (_, siblingData) => Boolean(siblingData?.showAdvanced),
      },
      fields: [
        {
          name: 'website',
          type: 'text',
          admin: {
            description: 'Brand website URL',
            placeholder: 'https://brand-website.com',
          },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'countryOfOrigin',
              type: 'text',
              admin: {
                description: 'Country of origin',
                placeholder: 'USA, Germany, Japan',
                width: '50%',
              },
            },
            {
              name: 'foundedYear',
              type: 'number',
              admin: {
                description: 'Founded year',
                placeholder: '1971',
                width: '50%',
              },
            },
          ],
        },
        {
          name: 'specialties',
          type: 'textarea',
          admin: {
            description: 'Brand specialties and focus areas',
            rows: 2,
          },
        },
        {
          name: 'priceRange',
          type: 'select',
          options: [
            { label: '💰 Budget', value: 'budget' },
            { label: '💰💰 Mid-range', value: 'mid-range' },
            { label: '💰💰💰 Premium', value: 'premium' },
            { label: '💰💰💰💰 Luxury', value: 'luxury' },
          ],
          admin: {
            description: 'Typical price range',
          },
        },
        {
          name: 'targetAudience',
          type: 'text',
          admin: {
            description: 'Primary target audience',
            placeholder: 'Athletes, Casual users, Professionals',
          },
        },
      ],
    },

    // Contact Information (Advanced)
    {
      name: 'contact',
      type: 'group',
      label: '📞 Contact Information',
      admin: {
        condition: (_, siblingData) => siblingData?.showAdvanced,
      },
      fields: [
        {
          name: 'email',
          type: 'email',
          admin: {
            description: 'Brand contact email',
          },
        },
        {
          name: 'phone',
          type: 'text',
          admin: {
            description: 'Brand contact phone',
          },
        },
        {
          name: 'address',
          type: 'textarea',
          admin: {
            description: 'Brand address',
            rows: 2,
          },
        },
      ],
    },

    // Social Media (Advanced)
    {
      name: 'social',
      type: 'group',
      label: '📱 Social Media',
      admin: {
        condition: (_, siblingData) => siblingData?.showAdvanced,
      },
      fields: [
        {
          name: 'facebook',
          type: 'text',
          admin: {
            description: 'Facebook page URL',
          },
        },
        {
          name: 'instagram',
          type: 'text',
          admin: {
            description: 'Instagram profile URL',
          },
        },
        {
          name: 'twitter',
          type: 'text',
          admin: {
            description: 'Twitter profile URL',
          },
        },
        {
          name: 'youtube',
          type: 'text',
          admin: {
            description: 'YouTube channel URL',
          },
        },
      ],
    },

    // SEO (Advanced)
    {
      name: 'seo',
      type: 'group',
      label: '🔍 SEO Settings',
      admin: {
        condition: (_, siblingData) => siblingData?.showAdvanced,
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          admin: {
            description: 'SEO title (auto-generated if empty)',
          },
          hooks: {
            beforeValidate: [
              ({ data, siblingData }) => {
                if (!data && siblingData?.name) {
                  return `${siblingData.name} Sports Equipment | Ralhum Sports`
                }
              },
            ],
          },
        },
        {
          name: 'description',
          type: 'textarea',
          admin: {
            description: 'SEO meta description',
            rows: 2,
          },
        },
        {
          name: 'keywords',
          type: 'text',
          admin: {
            description: 'SEO keywords (comma separated)',
          },
        },
      ],
    },

    // Auto-calculated fields
    {
      name: 'productCount',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
        description: 'Number of active products',
        position: 'sidebar',
      },
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        readOnly: true,
        position: 'sidebar',
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
        position: 'sidebar',
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
        if (operation === 'create') {
          req.payload.logger.info(`Brand created: ${doc.name} by ${req.user?.email}`)
        } else if (operation === 'update') {
          req.payload.logger.info(`Brand updated: ${doc.name} by ${req.user?.email}`)
        }
      },
    ],
  },
}
