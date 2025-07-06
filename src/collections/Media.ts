import type { CollectionConfig } from 'payload'
import { isAdmin, isSuperAdmin, isAdminOrProductManager, isAdminOrContentEditor } from './Users'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'alt', 'mimeType', 'filesize', 'category'],
    group: 'Media',
    description: 'Manage all uploaded media files with organized categorization',
  },
  access: {
    // Content editors and above can upload media
    create: isAdminOrContentEditor,
    // All authenticated users can read media, but limit sensitive fields
    read: ({ req }) => {
      if (!req.user) {
        // Public can only read public media
        return {
          isPublic: {
            equals: true,
          },
        }
      }
      // Authenticated users can read all media
      return true
    },
    // Only admins and product managers can update media metadata
    update: isAdminOrProductManager,
    // Only super admins can delete media (to prevent accidental deletions)
    delete: isSuperAdmin,
  },
  upload: {
    staticDir: 'media',
    mimeTypes: [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/svg+xml',
      'application/pdf',
      'video/mp4',
      'video/webm',
    ],
    adminThumbnail: 'thumbnail',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
        height: 300,
        position: 'centre',
        formatOptions: {
          format: 'webp',
          options: {
            quality: 80,
          },
        },
      },
      {
        name: 'card',
        width: 640,
        height: 480,
        position: 'centre',
        formatOptions: {
          format: 'webp',
          options: {
            quality: 85,
          },
        },
      },
      {
        name: 'tablet',
        width: 1024,
        height: undefined,
        position: 'centre',
        formatOptions: {
          format: 'webp',
          options: {
            quality: 90,
          },
        },
      },
      {
        name: 'desktop',
        width: 1920,
        height: undefined,
        position: 'centre',
        formatOptions: {
          format: 'webp',
          options: {
            quality: 90,
          },
        },
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description: 'Alt text for accessibility - describe what the image shows',
        placeholder: 'Enter descriptive alt text',
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      defaultValue: 'general',
      options: [
        {
          label: 'Products',
          value: 'products',
        },
        {
          label: 'News & Blog',
          value: 'news',
        },
        {
          label: 'Company Info',
          value: 'company',
        },
        {
          label: 'Brands',
          value: 'brands',
        },
        {
          label: 'User Profiles',
          value: 'profiles',
        },
        {
          label: 'General',
          value: 'general',
        },
        {
          label: 'Marketing',
          value: 'marketing',
        },
      ],
      admin: {
        description: 'Categorize media for better organization',
      },
    },
    {
      name: 'caption',
      type: 'textarea',
      admin: {
        description: 'Optional caption for the media',
        placeholder: 'Add a caption for this media file',
      },
    },
    {
      name: 'tags',
      type: 'text',
      admin: {
        description: 'Tags separated by commas for easier searching',
        placeholder: 'sport, equipment, outdoor, etc.',
      },
    },
    {
      name: 'isPublic',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Make this media accessible on the public website',
      },
    },
    {
      name: 'isFeature',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Mark as featured content for homepage/banners',
      },
    },
    // SEO and Meta Information
    {
      name: 'seoTitle',
      type: 'text',
      admin: {
        description: 'SEO title for this media (for images used as page headers)',
        placeholder: 'SEO-friendly title',
      },
    },
    {
      name: 'seoDescription',
      type: 'textarea',
      admin: {
        description: 'SEO description for this media',
        placeholder: 'Brief description for search engines',
      },
    },
    // Usage tracking and metadata
    {
      name: 'usageNotes',
      type: 'textarea',
      admin: {
        description: 'Internal notes about usage rights, source, or restrictions',
        placeholder: 'Notes for team reference',
        condition: (_, { user }) => {
          // Only admins can see usage notes
          return user && ['super-admin', 'admin'].includes(user.role)
        },
      },
      access: {
        read: isAdmin,
        update: isAdmin,
      },
    },
    {
      name: 'source',
      type: 'text',
      admin: {
        description: 'Source of the media (photographer, designer, stock photo, etc.)',
        placeholder: 'Image source or credit',
      },
    },
    {
      name: 'copyright',
      type: 'text',
      admin: {
        description: 'Copyright information',
        placeholder: '© 2025 Ralhum Sports or photographer name',
      },
    },
    // Auto-generated metadata
    {
      name: 'uploadedBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        readOnly: true,
        description: 'User who uploaded this media',
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
        description: 'User who last modified this media',
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
        // Auto-generate alt text if empty (basic implementation)
        if (operation === 'create' && !data.alt && data.filename) {
          // Generate basic alt text from filename
          const cleanName = data.filename
            .replace(/\.[^/.]+$/, '') // Remove file extension
            .replace(/[-_]/g, ' ') // Replace dashes and underscores with spaces
            .replace(/\b\w/g, (l: string) => l.toUpperCase()) // Capitalize first letter of each word

          data.alt = cleanName
        }

        // Set upload metadata
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
        // Log media operations for audit trail
        if (operation === 'create') {
          req.payload.logger.info(`Media uploaded: ${doc.filename} by ${req.user?.email}`)
        } else if (operation === 'update') {
          req.payload.logger.info(`Media updated: ${doc.filename} by ${req.user?.email}`)
        }
      },
    ],
    afterDelete: [
      async ({ req, doc }) => {
        // Log media deletion for audit trail
        req.payload.logger.info(`Media deleted: ${doc.filename} by ${req.user?.email}`)
      },
    ],
  },
}
