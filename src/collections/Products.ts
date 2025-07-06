import type { CollectionConfig, CollectionBeforeChangeHook, CollectionAfterChangeHook, FieldHook, Access, Condition } from 'payload/types'
import type { User, Product, Category, Brand } from '@/payload-types'
import { isAdmin, isAdminOrProductManager } from './Users' // Ensure these are correctly typed for User
import { APIError } from 'payload/errors'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'brand', 'price', 'stock', 'status'],
    group: 'Products',
    description: 'Manage product catalog with comprehensive details',
    listSearchableFields: ['name', 'sku', 'description'],
  },
  access: {
    create: isAdminOrProductManager as Access<Product, User>,
    read: (({ req: { user } }: { req: { user?: User | null } }) => Boolean(user)) as Access<Product, User>,
    update: isAdminOrProductManager as Access<Product, User>,
    delete: isAdmin as Access<Product, User>,
  },
  fields: [
    // Required Core Fields
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Product name as displayed to customers',
        placeholder: 'Enter product name (e.g., Nike Air Max Running Shoes)',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly version of the product name',
        placeholder: 'auto-generated from name',
        readOnly: true,
      },
      hooks: {
        beforeValidate: [
          (({ data, operation }: { data: Partial<Product>; operation?: 'create' | 'update' }) => {
            if ((operation === 'create' || operation === 'update') && data?.name && typeof data.name === 'string') {
              // Generate slug from name
              return data.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with -
                .replace(/(^-|-$)+/g, ''); // Remove leading/trailing hyphens
            }
            return data?.slug; // Return existing slug if no change
          }) as FieldHook<Product, string | null | undefined, Product>,
        ],
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      admin: {
        description: 'Product category for organization',
      },
      filterOptions: {
        status: {
          equals: 'active',
        },
      },
    },
    {
      name: 'brand',
      type: 'relationship',
      relationTo: 'brands',
      required: true,
      admin: {
        description: 'Product brand',
      },
      filterOptions: {
        status: {
          equals: 'active',
        },
      },
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      admin: {
        description: 'Product price in LKR',
        placeholder: '5000.00',
        step: 0.01,
      },
      min: 0,
    },
    {
      name: 'sku',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Stock Keeping Unit - unique product identifier',
        placeholder: 'auto-generated if empty',
      },
      hooks: {
        beforeValidate: [
          (({ data, operation }: { data: Partial<Product>; operation?: 'create' | 'update' }) => {
            if (operation === 'create' && (!data?.sku || data.sku.trim() === '')) {
              // Generate SKU if not provided or is empty
              const timestamp = Date.now().toString().slice(-6);
              const random = Math.random().toString(36).substring(2, 5).toUpperCase();
              return `RS-${timestamp}-${random}`;
            }
            return data?.sku; // Return existing SKU if no change or not creating
          }) as FieldHook<Product, string | null | undefined, Product>,
        ],
      },
    },
    {
      name: 'stock',
      type: 'number',
      required: true,
      defaultValue: 0,
      admin: {
        description: 'Available stock quantity',
        step: 1,
      },
      min: 0,
    },
    {
      name: 'images',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 10,
      admin: {
        description: 'Product images (first image will be the main image)',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          filterOptions: {
            category: {
              equals: 'products',
            },
          },
        },
        {
          name: 'altText',
          type: 'text',
          admin: {
            description: 'Alternative text for this specific image',
            placeholder: 'Describe this product image',
          },
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
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
          label: 'Draft',
          value: 'draft',
        },
        {
          label: 'Out of Stock',
          value: 'out-of-stock',
        },
        {
          label: 'Discontinued',
          value: 'discontinued',
        },
      ],
      admin: {
        description: 'Product availability status',
      },
    },

    // Optional Product Information
    {
      name: 'sizes',
      type: 'text',
      admin: {
        description: 'Available sizes (comma separated)',
        placeholder: 'S, M, L, XL or 40, 41, 42, 43',
      },
    },
    {
      name: 'colors',
      type: 'text',
      admin: {
        description: 'Available colors (comma separated)',
        placeholder: 'Black, White, Red, Blue',
      },
    },
    {
      name: 'description',
      type: 'richText',
      admin: {
        description: 'Detailed product description with rich formatting',
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
            description: 'SEO title for product page',
            placeholder: 'Product Name - Brand | Ralhum Sports',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          admin: {
            description: 'SEO meta description for product page',
            placeholder: 'Shop product name at Ralhum Sports. High-quality sports equipment...',
          },
        },
      ],
    },

    // Product Specifications Group
    {
      name: 'specifications',
      type: 'group',
      label: 'Product Specifications',
      fields: [
        {
          name: 'material',
          type: 'text',
          admin: {
            description: 'Primary material used',
            placeholder: 'Cotton, Polyester, Leather, etc.',
          },
        },
        {
          name: 'weight',
          type: 'text',
          admin: {
            description: 'Product weight',
            placeholder: '250g, 1.2kg, etc.',
          },
        },
        {
          name: 'dimensions',
          type: 'text',
          admin: {
            description: 'Product dimensions',
            placeholder: '30cm x 20cm x 10cm',
          },
        },
        {
          name: 'careInstructions',
          type: 'textarea',
          admin: {
            description: 'Care and maintenance instructions',
            placeholder: 'Machine wash cold, air dry...',
          },
        },
      ],
    },

    // Shipping Configuration
    {
      name: 'shipping',
      type: 'group',
      label: 'Shipping Configuration',
      fields: [
        {
          name: 'freeShipping',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Offer free shipping for this product',
          },
        },
        {
          name: 'islandWideDelivery',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Available for island-wide delivery',
          },
        },
        {
          name: 'easyReturn',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Eligible for easy return policy',
          },
        },
        {
          name: 'shippingWeight',
          type: 'number',
          admin: {
            description: 'Shipping weight in kg',
            placeholder: '0.5',
            step: 0.1,
          },
        },
      ],
    },

    // Pricing and Inventory
    {
      name: 'pricing',
      type: 'group',
      label: 'Pricing & Inventory',
      fields: [
        {
          name: 'originalPrice',
          type: 'number',
          admin: {
            description: 'Original price (for displaying discounts)',
            placeholder: '6000.00',
            step: 0.01,
          },
        },
        {
          name: 'costPrice',
          type: 'number',
          admin: {
            description: 'Cost price for profit calculations (admin only)',
            step: 0.01,
            condition: (_, { user }: { user?: User | null }) => { // Typed the user from siblingData
              return Boolean(user && user.role && ['super-admin', 'admin'].includes(user.role));
            },
          },
          access: { // Assuming isAdmin is correctly typed for User
            read: isAdmin as Access<Product, User>,
            update: isAdmin as Access<Product, User>,
          },
        },
        {
          name: 'lowStockThreshold',
          type: 'number',
          defaultValue: 5,
          admin: {
            description: 'Alert when stock falls below this number',
            step: 1,
          },
        },
        {
          name: 'trackInventory',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Track inventory for this product',
          },
        },
      ],
    },

    // Product Features and Tags
    {
      name: 'features',
      type: 'array',
      admin: {
        description: 'Key product features and selling points',
      },
      fields: [
        {
          name: 'feature',
          type: 'text',
          required: true,
          admin: {
            placeholder: 'e.g., Breathable fabric, Waterproof, Lightweight',
          },
        },
      ],
    },
    {
      name: 'tags',
      type: 'text',
      admin: {
        description: 'Product tags for search and filtering (comma separated)',
        placeholder: 'running, outdoor, breathable, comfortable',
      },
    },

    // Related Products and Variants
    {
      name: 'relatedProducts',
      type: 'text',
      admin: {
        description: 'Related product IDs (comma separated)',
        placeholder: 'Enter related product IDs',
      },
    },

    // Product Analytics and Metrics
    {
      name: 'analytics',
      type: 'group',
      label: 'Analytics & Metrics',
      fields: [
        {
          name: 'viewCount',
          type: 'number',
          defaultValue: 0,
          admin: {
            readOnly: true,
            description: 'Number of product page views',
          },
        },
        {
          name: 'orderCount',
          type: 'number',
          defaultValue: 0,
          admin: {
            readOnly: true,
            description: 'Number of times ordered',
          },
        },
        {
          name: 'rating',
          type: 'number',
          admin: {
            readOnly: true,
            description: 'Average customer rating (1-5)',
            step: 0.1,
          },
          min: 1,
          max: 5,
        },
        {
          name: 'reviewCount',
          type: 'number',
          defaultValue: 0,
          admin: {
            readOnly: true,
            description: 'Number of customer reviews',
          },
        },
      ],
    },

    // Automatic Fields
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        readOnly: true,
        description: 'User who created this product',
      },
      hooks: {
        beforeChange: [
          (({ req, operation }: { req: { user?: User | null }; operation?: 'create' | 'update' }) => {
            if (operation === 'create' && req.user) {
              return req.user.id;
            }
            return undefined; // Ensure a value is always returned or type allows undefined
          }) as FieldHook<Product, User | number | null, User>,
        ],
      },
    },
    {
      name: 'lastModifiedBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        readOnly: true,
        description: 'User who last modified this product',
      },
      hooks: {
        beforeChange: [
          (({ req, operation }: { req: { user?: User | null }; operation?: 'create' | 'update' }) => {
            if (operation === 'update' && req.user) {
              return req.user.id;
            }
            return undefined; // Ensure a value is always returned
          }) as FieldHook<Product, User | number | null, User>,
        ],
      },
    },
  ],
  hooks: {
    beforeChange: [
      (async ({ req, operation, data }) => {
        const productData = data as Partial<Product>;
        // const user = req.user as User | undefined | null; // User for createdBy/lastModifiedBy is handled by field hooks

        // Auto-set out of stock status if stock is 0 and product is active
        if (productData.stock === 0 && productData.status === 'active') {
          productData.status = 'out-of-stock';
        }

        // Validate pricing: originalPrice should not be less than current price
        if (
          productData.pricing?.originalPrice !== undefined &&
          productData.pricing.originalPrice !== null &&
          productData.price !== undefined &&
          productData.price !== null &&
          productData.pricing.originalPrice < productData.price
        ) {
          throw new APIError('Original price cannot be less than the current sale price.', 400);
        }

        return productData;
      }) as CollectionBeforeChangeHook<Product>,
    ],
    afterChange: [
      (async ({ req, operation, doc, previousDoc }) => {
        const currentProduct = doc as Product;
        const previousProduct = previousDoc as Product | undefined;
        const user = req.user as User | undefined | null;
        const payload = req.payload;

        // Log product operations
        if (operation === 'create') {
          payload.logger.info(`Product created: ${currentProduct.name} (SKU: ${currentProduct.sku}) by ${user?.email || 'system'}`);
        } else if (operation === 'update') {
          payload.logger.info(`Product updated: ${currentProduct.name} (SKU: ${currentProduct.sku}) by ${user?.email || 'system'}`);
          if (previousProduct && previousProduct.stock !== currentProduct.stock) {
            payload.logger.info(
              `Stock updated for ${currentProduct.name}: ${previousProduct.stock} → ${currentProduct.stock}`,
            );
          }
          if (currentProduct.stock !== undefined && currentProduct.pricing?.lowStockThreshold !== undefined && currentProduct.stock <= currentProduct.pricing.lowStockThreshold && currentProduct.status === 'active') {
            payload.logger.warn(
              `Low stock alert: ${currentProduct.name} (SKU: ${currentProduct.sku}) - ${currentProduct.stock} remaining`,
            );
          }
        }

        // Helper function to update related collection counts
        const updateRelatedCount = async (
          collectionSlug: 'categories' | 'brands',
          relatedId: string | number | null | undefined,
        ) => {
          if (!relatedId) return;
          try {
            const relatedDocId = typeof relatedId === 'object' ? (relatedId as Category | Brand).id : relatedId;
            if (!relatedDocId) return;

            const { totalDocs } = await payload.find({
              collection: 'products',
              where: {
                and: [
                  { status: { equals: 'active' } },
                  { [collectionSlug === 'categories' ? 'category' : 'brand']: { equals: relatedDocId } },
                ],
              },
              limit: 0, // We only need the count
            });
            await payload.update({
              collection: collectionSlug,
              id: relatedDocId,
              data: { productCount: totalDocs },
            });
            payload.logger.info(`Updated product count for ${collectionSlug} ID ${relatedDocId} to ${totalDocs}.`);
          } catch (error) {
            const err = error as Error;
            payload.logger.error(`Failed to update product count for ${collectionSlug} ID ${relatedId}: ${err.message}`);
          }
        };

        let oldCategoryId: string | number | null = null;
        let oldBrandId: string | number | null = null;

        if(operation === 'update' && previousProduct) {
            const prevCategory = previousProduct.category;
            if (prevCategory) oldCategoryId = typeof prevCategory === 'object' ? (prevCategory as Category).id : prevCategory;

            const prevBrand = previousProduct.brand;
            if (prevBrand) oldBrandId = typeof prevBrand === 'object' ? (prevBrand as Brand).id : prevBrand;
        }

        const newCategoryId = typeof currentProduct.category === 'object' ? (currentProduct.category as Category).id : currentProduct.category;
        const newBrandId = typeof currentProduct.brand === 'object' ? (currentProduct.brand as Brand).id : currentProduct.brand;

        // Update counts if status, category, or brand changed
        if (operation === 'create' && currentProduct.status === 'active') {
          await updateRelatedCount('categories', newCategoryId);
          await updateRelatedCount('brands', newBrandId);
        } else if (operation === 'update') {
          const statusChanged = previousProduct?.status !== currentProduct.status;
          const categoryChanged = String(oldCategoryId) !== String(newCategoryId); // Compare as strings to handle ID vs object
          const brandChanged = String(oldBrandId) !== String(newBrandId);

          if (statusChanged || categoryChanged || brandChanged) {
            // If product became active or category/brand changed while active
            if (currentProduct.status === 'active') {
              if (newCategoryId) await updateRelatedCount('categories', newCategoryId);
              if (newBrandId) await updateRelatedCount('brands', newBrandId);
            }
            // If product became inactive or category/brand changed from an active state
            if (previousProduct?.status === 'active') {
              if (oldCategoryId && (categoryChanged || (statusChanged && currentProduct.status !== 'active'))) {
                await updateRelatedCount('categories', oldCategoryId);
              }
              if (oldBrandId && (brandChanged || (statusChanged && currentProduct.status !== 'active'))) {
                await updateRelatedCount('brands', oldBrandId);
              }
            }
          }
        }
      }) as CollectionAfterChangeHook<Product>,
    ],
    afterDelete: [
      (async ({ req, doc }) => {
        const deletedProduct = doc as Product;
        const user = req.user as User | undefined | null;
        const payload = req.payload;
        payload.logger.warn(`Product deleted: ${deletedProduct.name} (SKU: ${deletedProduct.sku}) by ${user?.email || 'system'}`);

        // Update counts for the category and brand of the deleted product if it was active
        if (deletedProduct.status === 'active') {
            const categoryId = typeof deletedProduct.category === 'object' ? (deletedProduct.category as Category).id : deletedProduct.category;
            const brandId = typeof deletedProduct.brand === 'object' ? (deletedProduct.brand as Brand).id : deletedProduct.brand;

            if (categoryId) {
                 try {
                    const { totalDocs } = await payload.find({
                      collection: 'products',
                      where: { and: [ { status: { equals: 'active' } }, { category: { equals: categoryId } } ] },
                      limit: 0,
                    });
                    await payload.update({ collection: 'categories', id: categoryId, data: { productCount: totalDocs } });
                    payload.logger.info(`Updated product count for category ID ${categoryId} to ${totalDocs} after product deletion.`);
                  } catch (error) {
                    payload.logger.error(`Failed to update category count for ID ${categoryId} after product deletion: ${(error as Error).message}`);
                  }
            }
            if (brandId) {
                try {
                    const { totalDocs } = await payload.find({
                      collection: 'products',
                      where: { and: [ { status: { equals: 'active' } }, { brand: { equals: brandId } } ] },
                      limit: 0,
                    });
                    await payload.update({ collection: 'brands', id: brandId, data: { productCount: totalDocs } });
                    payload.logger.info(`Updated product count for brand ID ${brandId} to ${totalDocs} after product deletion.`);
                  } catch (error) {
                    payload.logger.error(`Failed to update brand count for ID ${brandId} after product deletion: ${(error as Error).message}`);
                  }
            }
        }
      }) as CollectionAfterChangeHook<Product>,
    ],
  },
}
