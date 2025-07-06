import type { CollectionConfig, CollectionBeforeChangeHook, CollectionAfterChangeHook, FieldHook, Access } from 'payload/types'
import type { User, Category, Product } from '@/payload-types' // Import specific Payload types
import { isAdmin, isAdminOrProductManager } from './Users' // Ensure these are correctly typed for User
import { APIError } from 'payload/errors'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'status', 'displayOrder', 'productCount'],
    group: 'Products',
    description: 'Manage product categories for organization and navigation',
  },
  access: {
    create: isAdminOrProductManager as Access<Category, User>,
    read: (({ req: { user } }: { req: { user?: User | null } }) => Boolean(user)) as Access<Category, User>,
    update: isAdminOrProductManager as Access<Category, User>,
    delete: isAdmin as Access<Category, User>,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Category name - must be unique',
        placeholder: 'Enter category name (e.g., Running Shoes, Cricket Equipment)',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly version of the category name',
        placeholder: 'auto-generated from name',
        readOnly: true,
      },
      hooks: {
        beforeValidate: [
          (({ data, operation }: { data: Partial<Category>; operation?: 'create' | 'update' }) => {
            if ((operation === 'create' || operation === 'update') && data?.name && typeof data.name === 'string') {
              return data.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '');
            }
            return data?.slug; // Return existing if no change
          }) as FieldHook<Category, string | null | undefined, Category>,
        ],
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Brief description of the category',
        placeholder: 'Describe what products belong in this category',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Category banner or representative image',
      },
      filterOptions: { // Ensure this filter is valid for the 'media' collection
        category: { // This 'category' is a field within the 'media' collection
          equals: 'categories', // Should likely be 'categories' if media is categorized for categories
        },
      },
    },
    {
      name: 'icon',
      type: 'text',
      admin: {
        description: 'Icon class or Unicode for category display (optional)',
        placeholder: 'fa-running, 🏃, etc.',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
        { label: 'Draft', value: 'draft' },
      ],
      admin: {
        description: 'Category visibility status',
      },
      index: true, // Added index
    },
    {
      name: 'displayOrder',
      type: 'number',
      required: true,
      defaultValue: 0,
      admin: {
        description: 'Order for displaying categories (lower numbers appear first)',
        step: 1,
      },
    },
    {
      name: 'parentCategory',
      type: 'relationship', // Changed from 'text' to 'relationship'
      relationTo: 'categories', // Self-referencing relationship
      admin: {
        description: 'Parent category for hierarchical organization (optional)',
      },
      filterOptions: ({ id }) => { // Prevent selecting self as parent
        if (id) {
          return {
            id: { not_equals: id },
          };
        }
        return {};
      },
      index: true, // Added index
    },
    {
      name: 'isFeature',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Feature this category on homepage or in navigation',
      },
    },
    {
      name: 'showInNavigation',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Display this category in main navigation menu',
      },
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
            description: 'SEO title for category page',
            placeholder: 'Category Name - Ralhum Sports',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          admin: {
            description: 'SEO meta description for category page',
            placeholder: 'Browse our selection of category products at Ralhum Sports...',
          },
        },
        {
          name: 'keywords',
          type: 'text',
          admin: {
            description: 'SEO keywords separated by commas',
            placeholder: 'sports, equipment, category name, Sri Lanka',
          },
        },
      ],
    },

    // Category Configuration
    {
      name: 'config',
      type: 'group',
      label: 'Category Configuration',
      fields: [
        {
          name: 'allowProducts',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Allow products to be assigned to this category',
          },
        },
        {
          name: 'requiresSize',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Products in this category require size selection',
          },
        },
        {
          name: 'requiresColor',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Products in this category require color selection',
          },
        },
        {
          name: 'customFields',
          type: 'textarea',
          admin: {
            description: 'JSON configuration for category-specific product fields',
            placeholder: '{"material": "required", "warranty": "optional"}',
          },
        },
      ],
    },

    // Auto-generated fields
    {
      name: 'productCount',
      type: 'number',
      admin: {
        readOnly: true,
        description: 'Number of active products in this category',
      },
      defaultValue: 0,
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        readOnly: true,
        description: 'User who created this category',
      },
      hooks: {
        beforeChange: [
          (({ req, operation }: { req: { user?: User | null }; operation?: 'create' | 'update' }) => {
            if (operation === 'create' && req.user) {
              return req.user.id;
            }
            return undefined;
          }) as FieldHook<Category, User | number | null, User>,
        ],
      },
    },
    {
      name: 'lastModifiedBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        readOnly: true,
        description: 'User who last modified this category',
      },
      hooks: {
        beforeChange: [
          (({ req, operation }: { req: { user?: User | null }; operation?: 'create' | 'update' }) => {
            if (operation === 'update' && req.user) {
              return req.user.id;
            }
            return undefined;
          }) as FieldHook<Category, User | number | null, User>,
        ],
      },
    },
  ],
  hooks: {
    beforeChange: [
      (async ({ req, operation, data, originalDoc }) => {
        const categoryData = data as Partial<Category>;
        // const user = req.user as User | undefined | null; // User for createdBy/lastModifiedBy is handled by field hooks

        // Validate parentCategory: prevent setting itself as parent
        if (operation === 'update' && categoryData.parentCategory) {
          const parentId = typeof categoryData.parentCategory === 'object'
            ? (categoryData.parentCategory as Category).id
            : categoryData.parentCategory;
          if (originalDoc && originalDoc.id === parentId) {
            throw new APIError('A category cannot be its own parent.', 400);
          }
          // Deeper circular dependency checks would require traversing up the tree,
          // which can be complex and resource-intensive in a hook.
          // The filterOption on the field helps prevent this in the UI.
        }

        // If name is changed, regenerate slug (field hook for slug handles this, but good to be aware)
        // The field-level hook for 'slug' should already handle regeneration if 'name' changes.

        return categoryData;
      }) as CollectionBeforeChangeHook<Category>,
    ],
    afterChange: [
      (async ({ req, operation, doc, previousDoc }) => {
        const currentCategory = doc as Category;
        const prevCategory = previousDoc as Category | undefined;
        const user = req.user as User | undefined | null;
        const payload = req.payload;

        if (operation === 'create') {
          payload.logger.info(`Category created: ${currentCategory.name} by ${user?.email || 'system'}`);
        } else if (operation === 'update') {
          payload.logger.info(`Category updated: ${currentCategory.name} by ${user?.email || 'system'}`);
          if (prevCategory && prevCategory.status !== currentCategory.status && currentCategory.status === 'inactive') {
            payload.logger.info(
              `Category deactivated: ${currentCategory.name}. This may affect product visibility and filtering.`,
            );
          }
          // Note: Product count updates are handled in Products.ts afterChange hook when a product's category changes or status becomes active/inactive.
        }
      }) as CollectionAfterChangeHook<Category>,
    ],
    beforeDelete: [
      async ({ req, id }) => {
        const payload = req.payload;
        // Prevent deletion if category has active products assigned
        if (id) {
            const { totalDocs } = await payload.find({
                collection: 'products',
                where: {
                    and: [
                        { category: { equals: id } },
                        { status: { equals: 'active' } } // Only consider active products
                    ]
                },
                limit: 0, // Only need the count
            });

            if (totalDocs > 0) {
                payload.logger.warn(`Attempt to delete category ID ${id} which has ${totalDocs} active product(s).`);
                throw new APIError(
                    `Cannot delete category. It is currently assigned to ${totalDocs} active product(s). Please reassign or deactivate these products first.`,
                    400,
                );
            }
        }
      }
      // No explicit return needed, if it doesn't throw, it proceeds.
    ],
    afterDelete: [
      (async ({ req, doc, id }) => { // id is also available here
        const deletedCategory = doc as Category; // doc is the full deleted document
        const user = req.user as User | undefined | null;
        const payload = req.payload;

        payload.logger.warn(
          `Category deleted: ${deletedCategory.name} (ID: ${id}) by ${user?.email || 'system'}`,
        );

        // Nullify parentCategory field in child categories
        try {
          const children = await payload.find({
            collection: 'categories',
            where: {
              parentCategory: { equals: id },
            },
            depth: 0, // Don't need to populate deeply
            limit: 0, // Default limit might be small, set to a large number or paginate if necessary
            pagination: false, // Get all matching children
          });

          if (children.docs.length > 0) {
            for (const child of children.docs) {
              await payload.update({
                collection: 'categories',
                id: child.id,
                data: {
                  parentCategory: null, // Set to null
                },
              });
              payload.logger.info(`Removed parentCategory link from child category ${child.id} after parent ${id} was deleted.`);
            }
          }
        } catch (error) {
            payload.logger.error(`Error nullifying parentCategory for children of deleted category ${id}: ${(error as Error).message}`);
        }
      }) as CollectionAfterChangeHook<Category>,
    ],
  },
}
