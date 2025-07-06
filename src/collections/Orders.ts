import type { CollectionConfig, CollectionBeforeChangeHook, CollectionAfterChangeHook, FieldHook, Access } from 'payload/types'
import type { User, Order, Customer, Product } from '@/payload-types'; // Import specific Payload types
import { isAdmin } from './Users' // Assuming isAdmin correctly infers User type or is updated
import { APIError } from 'payload/errors';


// The local OrderItemData and OrderData interfaces are no longer needed
// as we will use types from payload-types.ts (Order and its nested OrderItem)

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'orderNumber',
    defaultColumns: [
      'orderNumber',
      'customerName',
      'customerPhone',
      'orderTotal',
      'orderStatus',
      'createdAt',
    ],
    group: 'Business',
    description: 'Manage customer orders and WhatsApp integration tracking',
    listSearchableFields: ['orderNumber', 'customerName', 'customerEmail', 'customerPhone'],
  },
  access: {
    // Admins and above can create orders (for manual order entry)
    create: isAdmin, // Assuming isAdmin is (({ req: { user } }: { req: { user: User } }) => boolean)
    // Admins and product managers can read orders, plus customers can read their own
    read: ({ req }: { req: { user?: User | null } }) => { // Explicitly type req.user
      const user = req.user;

      if (!user) {
        return false; // No public access to orders list
      }

      // Admins and managers can read all orders
      // Ensure user.role matches the possible roles defined in your Users collection
      if (user.role && ['super-admin', 'admin', 'product-manager'].includes(user.role)) {
        return true;
      }

      // Other authenticated users (e.g., 'content-editor', or regular customers if they could log in)
      // cannot read all orders through this default collection endpoint.
      // Customer-specific order access should be handled via a custom endpoint that verifies ownership.
      return false;
    },
    // Admins and above can update orders
    update: isAdmin, // Assuming isAdmin is correctly typed for User
    // Only admins can delete orders
    delete: isAdmin,
  },
  fields: [
    {
      name: 'orderNumber',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Unique order identifier',
        placeholder: 'auto-generated if empty',
        readOnly: true,
      },
      hooks: {
        beforeValidate: [
          (({ data, operation }: { data: Partial<Order>; operation: 'create' | 'update' }) => {
            if (operation === 'create' && !data?.orderNumber) {
              // Generate order number: RS-YYYYMMDD-XXXXX
              const date = new Date();
              const dateStr =
                date.getFullYear().toString() +
                (date.getMonth() + 1).toString().padStart(2, '0') +
                date.getDate().toString().padStart(2, '0')
              const random = Math.random().toString(36).substring(2, 7).toUpperCase()
              return `RS-${dateStr}-${random}`
            }
          },
        ],
      },
    },

    // Customer Information
    {
      name: 'customerName',
      type: 'text',
      required: true,
      admin: {
        description: 'Customer full name',
        placeholder: 'Enter customer name',
      },
    },
    {
      name: 'customerEmail',
      type: 'email',
      required: true,
      admin: {
        description: 'Customer email address',
        placeholder: 'customer@example.com',
      },
    },
    {
      name: 'customerPhone',
      type: 'text',
      required: true,
      admin: {
        description: 'Customer primary phone number for WhatsApp communication',
        placeholder: '+94 XX XXX XXXX',
      },
    },
    {
      name: 'customerSecondaryPhone',
      type: 'text',
      admin: {
        description: 'Customer secondary phone number (optional)',
        placeholder: '+94 XX XXX XXXX',
      },
    },
    {
      name: 'deliveryAddress',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Complete delivery address',
        placeholder: 'Street address, City, Postal Code',
      },
    },
    {
      name: 'specialInstructions',
      type: 'textarea',
      admin: {
        description: 'Special delivery instructions or customer notes',
        placeholder: 'Any special requirements or notes',
      },
    },

    // Order Items
    {
      name: 'orderItems',
      type: 'array',
      required: true,
      minRows: 1,
      admin: {
        description: 'Products in this order',
      },
      fields: [
        {
          name: 'productId',
          type: 'text',
          required: true,
          admin: {
            description: 'Product ID reference',
            placeholder: 'Enter product ID',
          },
        },
        {
          name: 'productName',
          type: 'text',
          required: true,
          admin: {
            description: 'Product name (for record keeping)',
            placeholder: 'Product name at time of order',
          },
        },
        {
          name: 'productSku',
          type: 'text',
          required: true,
          admin: {
            description: 'Product SKU (for record keeping)',
            placeholder: 'Product SKU at time of order',
          },
        },
        {
          name: 'unitPrice',
          type: 'number',
          required: true,
          admin: {
            description: 'Price per unit in LKR',
            step: 0.01,
          },
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          defaultValue: 1,
          admin: {
            description: 'Quantity ordered',
            step: 1,
          },
          min: 1,
        },
        {
          name: 'selectedSize',
          type: 'text',
          admin: {
            description: 'Selected size (if applicable)',
            placeholder: 'M, L, 42, etc.',
          },
        },
        {
          name: 'selectedColor',
          type: 'text',
          admin: {
            description: 'Selected color (if applicable)',
            placeholder: 'Black, Red, etc.',
          },
        },
        {
          name: 'subtotal',
          type: 'number',
          required: true,
          admin: {
            description: 'Subtotal for this item (unit price × quantity)',
            step: 0.01,
            readOnly: true,
          },
        },
      ],
    },

    // Order Totals
    {
      name: 'orderSubtotal',
      type: 'number',
      required: true,
      admin: {
        description: 'Order subtotal (before shipping and taxes)',
        step: 0.01,
        readOnly: true,
      },
    },
    {
      name: 'shippingCost',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Shipping cost in LKR',
        step: 0.01,
      },
    },
    {
      name: 'discount',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Discount amount in LKR',
        step: 0.01,
      },
    },
    {
      name: 'orderTotal',
      type: 'number',
      required: true,
      admin: {
        description: 'Final order total',
        step: 0.01,
        readOnly: true,
      },
    },

    // Order Status and Tracking
    {
      name: 'orderStatus',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        {
          label: 'Pending',
          value: 'pending',
        },
        {
          label: 'Confirmed',
          value: 'confirmed',
        },
        {
          label: 'Processing',
          value: 'processing',
        },
        {
          label: 'Shipped',
          value: 'shipped',
        },
        {
          label: 'Delivered',
          value: 'delivered',
        },
        {
          label: 'Cancelled',
          value: 'cancelled',
        },
        {
          label: 'Refunded',
          value: 'refunded',
        },
      ],
      admin: {
        description: 'Current order status',
      },
    },
    {
      name: 'paymentStatus',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        {
          label: 'Pending',
          value: 'pending',
        },
        {
          label: 'Paid',
          value: 'paid',
        },
        {
          label: 'Partially Paid',
          value: 'partially-paid',
        },
        {
          label: 'Refunded',
          value: 'refunded',
        },
        {
          label: 'Failed',
          value: 'failed',
        },
      ],
      admin: {
        description: 'Payment status',
      },
    },
    {
      name: 'paymentMethod',
      type: 'select',
      options: [
        {
          label: 'Cash on Delivery',
          value: 'cod',
        },
        {
          label: 'Bank Transfer',
          value: 'bank-transfer',
        },
        {
          label: 'Online Payment',
          value: 'online-payment',
        },
        {
          label: 'Card Payment',
          value: 'card-payment',
        },
      ],
      admin: {
        description: 'Payment method chosen by customer',
      },
    },

    // WhatsApp Integration
    {
      name: 'whatsapp',
      type: 'group',
      label: 'WhatsApp Integration',
      fields: [
        {
          name: 'messageSent',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'WhatsApp confirmation message sent to customer',
          },
        },
        {
          name: 'messageTimestamp',
          type: 'date',
          admin: {
            description: 'When the WhatsApp message was sent',
            readOnly: true,
            date: {
              displayFormat: 'dd/MM/yyyy HH:mm',
            },
          },
        },
        {
          name: 'messageTemplate',
          type: 'select',
          options: [
            {
              label: 'Order Confirmation',
              value: 'order-confirmation',
            },
            {
              label: 'Order Update',
              value: 'order-update',
            },
            {
              label: 'Shipping Notification',
              value: 'shipping-notification',
            },
            {
              label: 'Delivery Confirmation',
              value: 'delivery-confirmation',
            },
          ],
          admin: {
            description: 'WhatsApp message template used',
          },
        },
        {
          name: 'customerResponse',
          type: 'textarea',
          admin: {
            description: 'Customer response or feedback via WhatsApp',
            placeholder: 'Record any customer responses or feedback',
          },
        },
      ],
    },

    // Shipping Information
    {
      name: 'shipping',
      type: 'group',
      label: 'Shipping Information',
      fields: [
        {
          name: 'trackingNumber',
          type: 'text',
          admin: {
            description: 'Shipping tracking number',
            placeholder: 'Enter tracking number when shipped',
          },
        },
        {
          name: 'courier',
          type: 'select',
          options: [
            {
              label: 'Pronto Express',
              value: 'pronto',
            },
            {
              label: 'Kapruka',
              value: 'kapruka',
            },
            {
              label: 'DHL',
              value: 'dhl',
            },
            {
              label: 'FedEx',
              value: 'fedex',
            },
            {
              label: 'Local Delivery',
              value: 'local',
            },
            {
              label: 'Customer Pickup',
              value: 'pickup',
            },
          ],
          admin: {
            description: 'Courier service used for delivery',
          },
        },
        {
          name: 'estimatedDelivery',
          type: 'date',
          admin: {
            description: 'Estimated delivery date',
            date: {
              displayFormat: 'dd/MM/yyyy',
            },
          },
        },
        {
          name: 'actualDelivery',
          type: 'date',
          admin: {
            description: 'Actual delivery date',
            date: {
              displayFormat: 'dd/MM/yyyy HH:mm',
            },
          },
        },
      ],
    },

    // Internal Notes
    {
      name: 'internalNotes',
      type: 'textarea',
      admin: {
        description: 'Internal notes for team reference (not visible to customer)',
        placeholder: 'Add any internal notes or comments',
      },
      access: {
        read: isAdmin,
        update: isAdmin,
      },
    },

    // Source Information
    {
      name: 'orderSource',
      type: 'select',
      defaultValue: 'website',
      options: [
        {
          label: 'Website',
          value: 'website',
        },
        {
          label: 'WhatsApp',
          value: 'whatsapp',
        },
        {
          label: 'Phone Call',
          value: 'phone',
        },
        {
          label: 'In Store',
          value: 'store',
        },
        {
          label: 'Social Media',
          value: 'social',
        },
      ],
      admin: {
        description: 'How the customer placed this order',
      },
    },

    // Auto-generated fields
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        readOnly: true,
        description: 'User who created this order',
      },
      hooks: {
        beforeChange: [
          (({ req, operation }: { req: { user?: User | null }, operation: 'create' | 'update' }) => {
            if (operation === 'create' && req.user) {
              return req.user.id;
            }
            // No return needed if condition is not met, or return undefined explicitly
            return undefined;
          }) as FieldHook<Order, User | number | null, User>, // Added explicit FieldHook type
        ],
      },
    },
    {
      name: 'lastModifiedBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        readOnly: true,
        description: 'User who last modified this order',
      },
      hooks: {
        beforeChange: [
          (({ req, operation }: { req: { user?: User | null }, operation: 'create' | 'update' }) => {
            if (operation === 'update' && req.user) {
              return req.user.id;
            }
            return undefined;
          }) as FieldHook<Order, User | number | null, User>, // Added explicit FieldHook type
        ],
      },
    },
  ],
  hooks: {
    beforeChange: [
      (async ({ req, operation, data }) => {
        // Assert specific types for data and req.user
        const orderData = data as Partial<Order>;
        // const user = req.user as User | undefined | null; // User for createdBy/lastModifiedBy is handled by field hooks

        // Calculate order totals
        if (orderData.orderItems && Array.isArray(orderData.orderItems)) {
          let subtotal = 0;
          orderData.orderItems.forEach(item => {
            const unitPrice = item.unitPrice ?? 0;
            const quantity = item.quantity ?? 0;
            if (unitPrice >= 0 && quantity > 0) {
              item.subtotal = unitPrice * quantity;
              subtotal += item.subtotal;
            } else {
              item.subtotal = 0;
            }
          });
          orderData.orderSubtotal = subtotal;

          const shipping = orderData.shippingCost ?? 0;
          const discount = orderData.discount ?? 0;
          orderData.orderTotal = Math.max(0, subtotal + shipping - discount);
        } else if (operation === 'create') {
            // Ensure totals are initialized if orderItems might be empty initially (though field is required)
            orderData.orderSubtotal = 0;
            orderData.orderTotal = (orderData.shippingCost ?? 0) - (orderData.discount ?? 0);
        }


        // Set WhatsApp message timestamp
        if (orderData.whatsapp?.messageSent && !orderData.whatsapp?.messageTimestamp) {
          orderData.whatsapp.messageTimestamp = new Date().toISOString();
        }

        return orderData;
      }) as CollectionBeforeChangeHook<Order>, // Explicitly type the hook
    ],
    afterChange: [
      (async ({ req, operation, doc, previousDoc }) => {
        // Assert specific types
        const currentDoc = doc as Order;
        const prevDoc = previousDoc as Order | undefined;
        const user = req.user as User | undefined | null;
        const payload = req.payload;

        if (operation === 'create') {
          payload.logger.info(
            `Order created: ${currentDoc.orderNumber} for ${currentDoc.customerName} (${currentDoc.customerPhone}) by ${user?.email || 'system'}`,
          );

          try {
            // Update Customer Statistics
            if (currentDoc.customerEmail) {
              const customersResult = await payload.find({
                collection: 'customers',
                where: { email: { equals: currentDoc.customerEmail } },
                limit: 1,
              });

              if (customersResult.docs.length > 0) {
                const customer = customersResult.docs[0] as Customer; // Assert type
                const currentTotalOrders = customer.orderStats?.totalOrders || 0;
                const currentTotalSpent = customer.orderStats?.totalSpent || 0;

                const customerUpdateData: Partial<Customer['orderStats']> = {
                  totalOrders: currentTotalOrders + 1,
                  totalSpent: currentTotalSpent + (currentDoc.orderTotal || 0),
                  lastOrderDate: currentDoc.createdAt || new Date().toISOString(),
                };
                if (!customer.orderStats?.firstOrderDate) {
                  customerUpdateData.firstOrderDate = currentDoc.createdAt || new Date().toISOString();
                }
                const updatedOrderStats = { ...customer.orderStats, ...customerUpdateData };

                await payload.update({
                  collection: 'customers',
                  id: customer.id,
                  data: { orderStats: updatedOrderStats },
                });
                payload.logger.info(
                  `Updated order stats for customer ${customer.email} (Order: ${currentDoc.orderNumber})`,
                );
              } else {
                payload.logger.warn(
                  `Customer with email ${currentDoc.customerEmail} not found for order ${currentDoc.orderNumber}. Cannot update stats.`,
                );
              }
            } else {
              payload.logger.warn(
                `Order ${currentDoc.orderNumber} does not have a customer email. Cannot update customer stats.`,
              );
            }

            // Update Product Stock and Order Count
            if (currentDoc.orderItems && Array.isArray(currentDoc.orderItems)) {
              for (const item of currentDoc.orderItems) {
                if (item.productId && typeof item.productId === 'string') { // Product ID is string in OrderItem
                  try {
                    // Ensure productID is treated as string, as it comes from an array field, not relationTo
                    const productResult = await payload.findByID({
                      collection: 'products',
                      id: item.productId, // Assuming product ID in orderItem is the actual product ID
                    }) as Product | null;

                    if (productResult) {
                      const currentStock = productResult.stock ?? 0;
                      const currentOrderCount = productResult.analytics?.orderCount ?? 0;

                      const updatedAnalytics = {
                        ...(productResult.analytics || {}), // Ensure analytics object exists
                        orderCount: currentOrderCount + 1,
                      };

                      await payload.update({
                        collection: 'products',
                        id: productResult.id, // Use ID from fetched product
                        data: {
                          stock: currentStock - (item.quantity || 0),
                          analytics: updatedAnalytics,
                        },
                      });
                      payload.logger.info(
                        `Updated stock and order count for product ${productResult.name} (ID: ${item.productId}, Order: ${currentDoc.orderNumber})`,
                      );
                    } else {
                      payload.logger.warn(
                        `Product with ID ${item.productId} not found for order ${currentDoc.orderNumber}. Cannot update stock.`,
                      );
                    }
                  } catch (productError) {
                    const pErr = productError as Error;
                    payload.logger.error(
                      `Error updating product ${item.productId} for order ${currentDoc.orderNumber}: ${pErr.message}`,
                    );
                  }
                } else {
                  payload.logger.warn(
                    `OrderItem in order ${currentDoc.orderNumber} has invalid or missing productId. Skipping stock update.`,
                  );
                }
              }
            }
          } catch (error) {
            const err = error as Error;
            payload.logger.error(
              `Error updating customer/product stats for order ${currentDoc.orderNumber}: ${err.message}`,
            );
          }
        } else if (operation === 'update') {
          payload.logger.info(`Order updated: ${currentDoc.orderNumber} by ${user?.email || 'system'}`);

          if (prevDoc && prevDoc.orderStatus !== currentDoc.orderStatus) {
            payload.logger.info(
              `Order status changed: ${currentDoc.orderNumber} from ${prevDoc.orderStatus} → ${currentDoc.orderStatus}`,
            );
            // TODO: Add logic for stock reversal if order is 'cancelled' or 'refunded'
          }
          if (prevDoc && prevDoc.paymentStatus !== currentDoc.paymentStatus) {
            payload.logger.info(
              `Payment status changed: ${currentDoc.orderNumber} from ${prevDoc.paymentStatus} → ${currentDoc.paymentStatus}`,
            );
          }
        }

        if (currentDoc.orderTotal > 50000) { // High-value order alert
          payload.logger.info(
            `High-value order alert: ${currentDoc.orderNumber} - LKR ${currentDoc.orderTotal}`,
          );
        }
      }) as CollectionAfterChangeHook<Order>, // Explicitly type the hook
    ],
    afterDelete: [
      (async ({ req, doc }) => { // doc is the deleted document
        const deletedDoc = doc as Order;
        const user = req.user as User | undefined | null;
        req.payload.logger.warn(
          `Order deleted: ${deletedDoc.orderNumber} by ${user?.email || 'system'}`,
        );
        // TODO: Consider if stock should be reverted or other cleanup is needed on order deletion.
      }) as CollectionAfterChangeHook<Order>,
    ],
  },
}
