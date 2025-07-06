import type { CollectionConfig, CollectionBeforeChangeHook, CollectionAfterChangeHook, FieldHook, Access, Condition } from 'payload/types'
import type { User, Media as MediaType } from '@/payload-types' // Renamed Media to MediaType to avoid conflict
import { isAdmin, isSuperAdmin, isAdminOrProductManager, isAdminOrContentEditor } from './Users' // Ensure these are correctly typed

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'filename', // filename is already implicitly indexed by useAsTitle if not explicitly set
    defaultColumns: ['filename', 'alt', 'mimeType', 'filesize', 'category'],
    group: 'Media',
    description: 'Manage all uploaded media files with organized categorization',
  },
  access: {
    create: isAdminOrContentEditor as Access<MediaType, User>,
    read: (({ req: { user } }: { req: { user?: User | null } }) => {
      if (!user) {
        // Public can only read public media
        return { isPublic: { equals: true } };
      }
      // Authenticated users can read all media (further field-level restrictions might apply based on Payload config)
      return true;
    }) as Access<MediaType, User>,
    update: isAdminOrProductManager as Access<MediaType, User>,
    delete: isSuperAdmin as Access<MediaType, User>,
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
      index: true, // Added index
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
      index: true, // Added index
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
        condition: (_, { user }: { user?: User | null }) => { // Typed user
          return Boolean(user && user.role && ['super-admin', 'admin'].includes(user.role));
        },
      },
      access: { // Assuming isAdmin is correctly typed for User
        read: isAdmin as Access<MediaType, User>,
        update: isAdmin as Access<MediaType, User>,
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
          (({ req, operation }: { req: { user?: User | null }; operation?: 'create' | 'update' }) => {
            if (operation === 'create' && req.user) {
              return req.user.id;
            }
            return undefined;
          }) as FieldHook<MediaType, User | number | null, User>,
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
          (({ req, operation }: { req: { user?: User | null }; operation?: 'create' | 'update' }) => {
            if (operation === 'update' && req.user) {
              return req.user.id;
            }
            return undefined;
          }) as FieldHook<MediaType, User | number | null, User>,
        ],
      },
    },
  ],
  hooks: {
    beforeChange: [
      (async ({ req, operation, data }) => {
        const mediaData = data as Partial<MediaType>;
        const user = req.user as User | undefined | null;

        // Auto-generate alt text if empty during creation and filename is available
        if (operation === 'create' && !mediaData.alt && mediaData.filename && typeof mediaData.filename === 'string') {
          const cleanName = mediaData.filename
            .substring(0, mediaData.filename.lastIndexOf('.') || mediaData.filename.length) // Remove file extension more reliably
            .replace(/[-_]/g, ' ') // Replace dashes and underscores with spaces
            .replace(/\b\w/g, (l: string) => l.toUpperCase()); // Capitalize first letter of each word
          mediaData.alt = cleanName;
        }

        // Set uploadedBy/lastModifiedBy (field-level hooks are preferred for this)
        // if (operation === 'create' && user) {
        //   mediaData.uploadedBy = user.id;
        // }
        // if (operation === 'update' && user) {
        //   mediaData.lastModifiedBy = user.id;
        // }

        return mediaData;
      }) as CollectionBeforeChangeHook<MediaType>,
    ],
    afterChange: [
      (async ({ req, operation, doc }) => {
        const currentMedia = doc as MediaType;
        const user = req.user as User | undefined | null;
        const payload = req.payload;

        if (operation === 'create') {
          payload.logger.info(`Media uploaded: ${currentMedia.filename || 'N/A'} by ${user?.email || 'system'}`);
        } else if (operation === 'update') {
          payload.logger.info(`Media updated: ${currentMedia.filename || 'N/A'} by ${user?.email || 'system'}`);
        }
      }) as CollectionAfterChangeHook<MediaType>,
    ],
    afterDelete: [
      (async ({ req, doc }) => {
        const deletedMedia = doc as MediaType;
        const user = req.user as User | undefined | null;
        req.payload.logger.info( // Changed from warn to info for consistency, or could be warn if deletion is sensitive
          `Media deleted: ${deletedMedia.filename || 'N/A'} (ID: ${deletedMedia.id}) by ${user?.email || 'system'}`,
        );
      }) as CollectionAfterChangeHook<MediaType>,
    ],
  },
}
