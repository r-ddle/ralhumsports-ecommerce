import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrProductManager } from './Users'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'category', 'isPublic', 'uploadedBy', 'updatedAt'],
    group: 'Content',
    description: 'Manage images and media files',
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
  upload: {
    staticDir: 'media',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 1024,
        position: 'centre',
      },
      {
        name: 'hero',
        width: 1920,
        height: 1080,
        position: 'centre',
      },
      {
        name: 'tablet',
        width: 1024,
        height: undefined,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'],
  },
  fields: [
    // Essential Media Information
    {
      name: 'category',
      type: 'select',
      required: true,
      defaultValue: 'general',
      options: [
        { label: '📦 Products', value: 'products' },
        { label: '🏷️ Brands', value: 'brands' },
        { label: '📰 News', value: 'news' },
        { label: '🏢 Company', value: 'company' },
        { label: '👤 Profiles', value: 'profiles' },
        { label: '📢 Marketing', value: 'marketing' },
        { label: '📁 General', value: 'general' },
      ],
      admin: {
        description: 'Media category for organization',
      },
    },

    // Quick Settings
    {
      type: 'row',
      fields: [
        {
          name: 'isPublic',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: '🌐 Public access',
            width: '50%',
          },
        },
        {
          name: 'isFeature',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: '⭐ Featured media',
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

    // Advanced Media Details
    {
      name: 'details',
      type: 'group',
      label: '📋 Media Details',
      admin: {
        condition: (_, siblingData) => Boolean(siblingData?.showAdvanced),
      },
      fields: [
        {
          name: 'alt',
          type: 'text',
          admin: {
            description: 'Alternative text for accessibility',
          },
          hooks: {
            beforeValidate: [
              ({ data, operation, originalDoc }) => {
                if (!data && operation === 'create' && originalDoc?.filename) {
                  return originalDoc.filename.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
                }
              },
            ],
          },
        },
        {
          name: 'caption',
          type: 'textarea',
          admin: {
            description: 'Media caption',
            rows: 2,
          },
        },
        {
          name: 'tags',
          type: 'text',
          admin: {
            description: 'Tags for searching (comma separated)',
            placeholder: 'product, lifestyle, action, outdoor',
          },
        },
      ],
    },

    // Attribution (Advanced)
    {
      name: 'attribution',
      type: 'group',
      label: '📝 Attribution',
      admin: {
        condition: (_, siblingData) => siblingData?.showAdvanced,
      },
      fields: [
        {
          name: 'source',
          type: 'text',
          admin: {
            description: 'Media source or photographer',
          },
        },
        {
          name: 'copyright',
          type: 'text',
          admin: {
            description: 'Copyright information',
          },
        },
        {
          name: 'license',
          type: 'select',
          options: [
            { label: 'All Rights Reserved', value: 'all-rights-reserved' },
            { label: 'Creative Commons', value: 'creative-commons' },
            { label: 'Public Domain', value: 'public-domain' },
            { label: 'Commercial License', value: 'commercial-license' },
          ],
          admin: {
            description: 'Usage license',
          },
        },
      ],
    },

    // SEO Fields (Advanced)
    {
      name: 'seo',
      type: 'group',
      label: '🔍 SEO Settings',
      admin: {
        condition: (_, siblingData) => siblingData?.showAdvanced,
      },
      fields: [
        {
          name: 'seoTitle',
          type: 'text',
          admin: {
            description: 'SEO title for this media',
          },
        },
        {
          name: 'seoDescription',
          type: 'textarea',
          admin: {
            description: 'SEO description for this media',
            rows: 2,
          },
        },
      ],
    },

    // Admin-only fields
    {
      name: 'usageNotes',
      type: 'textarea',
      admin: {
        description: 'Internal usage notes (admin only)',
        condition: (_, siblingData) => siblingData?.showAdvanced,
        rows: 2,
      },
      access: {
        read: isAdmin,
        update: isAdmin,
      },
    },

    // Auto-generated fields
    {
      name: 'uploadedBy',
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
          data.uploadedBy = req.user?.id
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
          req.payload.logger.info(`Media uploaded: ${doc.filename} by ${req.user?.email}`)
        }
      },
    ],
  },
}
