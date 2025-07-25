/* tslint:disable */
/* eslint-disable */
/**
 * This file was automatically generated by Payload.
 * DO NOT MODIFY IT BY HAND. Instead, modify your source Payload config,
 * and re-run `payload generate:types` to regenerate this file.
 */

/**
 * Supported timezones in IANA format.
 *
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "supportedTimezones".
 */
export type SupportedTimezones =
  | 'Pacific/Midway'
  | 'Pacific/Niue'
  | 'Pacific/Honolulu'
  | 'Pacific/Rarotonga'
  | 'America/Anchorage'
  | 'Pacific/Gambier'
  | 'America/Los_Angeles'
  | 'America/Tijuana'
  | 'America/Denver'
  | 'America/Phoenix'
  | 'America/Chicago'
  | 'America/Guatemala'
  | 'America/New_York'
  | 'America/Bogota'
  | 'America/Caracas'
  | 'America/Santiago'
  | 'America/Buenos_Aires'
  | 'America/Sao_Paulo'
  | 'Atlantic/South_Georgia'
  | 'Atlantic/Azores'
  | 'Atlantic/Cape_Verde'
  | 'Europe/London'
  | 'Europe/Berlin'
  | 'Africa/Lagos'
  | 'Europe/Athens'
  | 'Africa/Cairo'
  | 'Europe/Moscow'
  | 'Asia/Riyadh'
  | 'Asia/Dubai'
  | 'Asia/Baku'
  | 'Asia/Karachi'
  | 'Asia/Tashkent'
  | 'Asia/Calcutta'
  | 'Asia/Dhaka'
  | 'Asia/Almaty'
  | 'Asia/Jakarta'
  | 'Asia/Bangkok'
  | 'Asia/Shanghai'
  | 'Asia/Singapore'
  | 'Asia/Tokyo'
  | 'Asia/Seoul'
  | 'Australia/Brisbane'
  | 'Australia/Sydney'
  | 'Pacific/Guam'
  | 'Pacific/Noumea'
  | 'Pacific/Auckland'
  | 'Pacific/Fiji';

export interface Config {
  auth: {
    users: UserAuthOperations;
  };
  blocks: {};
  collections: {
    users: User;
    media: Media;
    categories: Category;
    brands: Brand;
    products: Product;
    orders: Order;
    customers: Customer;
    inventory: Inventory;
    'payload-locked-documents': PayloadLockedDocument;
    'payload-preferences': PayloadPreference;
    'payload-migrations': PayloadMigration;
  };
  collectionsJoins: {};
  collectionsSelect: {
    users: UsersSelect<false> | UsersSelect<true>;
    media: MediaSelect<false> | MediaSelect<true>;
    categories: CategoriesSelect<false> | CategoriesSelect<true>;
    brands: BrandsSelect<false> | BrandsSelect<true>;
    products: ProductsSelect<false> | ProductsSelect<true>;
    orders: OrdersSelect<false> | OrdersSelect<true>;
    customers: CustomersSelect<false> | CustomersSelect<true>;
    inventory: InventorySelect<false> | InventorySelect<true>;
    'payload-locked-documents': PayloadLockedDocumentsSelect<false> | PayloadLockedDocumentsSelect<true>;
    'payload-preferences': PayloadPreferencesSelect<false> | PayloadPreferencesSelect<true>;
    'payload-migrations': PayloadMigrationsSelect<false> | PayloadMigrationsSelect<true>;
  };
  db: {
    defaultIDType: number;
  };
  globals: {};
  globalsSelect: {};
  locale: 'en';
  user: User & {
    collection: 'users';
  };
  jobs: {
    tasks: unknown;
    workflows: unknown;
  };
}
export interface UserAuthOperations {
  forgotPassword: {
    email: string;
    password: string;
  };
  login: {
    email: string;
    password: string;
  };
  registerFirstUser: {
    email: string;
    password: string;
  };
  unlock: {
    email: string;
    password: string;
  };
}
/**
 * Manage user accounts and permissions
 *
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "users".
 */
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  phone?: string | null;
  /**
   * Upload a profile picture
   */
  profileImage?: (number | null) | Media;
  /**
   * User role determines access permissions
   */
  role?: ('super-admin' | 'admin' | 'product-manager' | 'content-editor') | null;
  /**
   * Deactivate user to prevent login without deleting account
   */
  isActive?: boolean | null;
  /**
   * Last successful login timestamp
   */
  lastLogin?: string | null;
  /**
   * User department for organizational purposes
   */
  department?: ('management' | 'products' | 'content' | 'customer-service' | 'marketing') | null;
  /**
   * Internal notes about this user (only visible to super admins)
   */
  notes?: string | null;
  updatedAt: string;
  createdAt: string;
  email: string;
  resetPasswordToken?: string | null;
  resetPasswordExpiration?: string | null;
  salt?: string | null;
  hash?: string | null;
  /**
   * Number of failed login attempts
   */
  loginAttempts?: number | null;
  lockUntil?: string | null;
  sessions?:
    | {
        id: string;
        createdAt?: string | null;
        expiresAt: string;
      }[]
    | null;
  password?: string | null;
}
/**
 * Manage images and media files
 *
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "media".
 */
export interface Media {
  id: number;
  /**
   * Media category for organization
   */
  category: 'products' | 'brands' | 'news' | 'company' | 'profiles' | 'marketing' | 'general';
  /**
   * 🌐 Public access
   */
  isPublic?: boolean | null;
  /**
   * ⭐ Featured media
   */
  isFeature?: boolean | null;
  /**
   * 🔧 Show advanced settings
   */
  showAdvanced?: boolean | null;
  details?: {
    /**
     * Alternative text for accessibility
     */
    alt?: string | null;
    /**
     * Media caption
     */
    caption?: string | null;
    /**
     * Tags for searching (comma separated)
     */
    tags?: string | null;
  };
  attribution?: {
    /**
     * Media source or photographer
     */
    source?: string | null;
    /**
     * Copyright information
     */
    copyright?: string | null;
    /**
     * Usage license
     */
    license?: ('all-rights-reserved' | 'creative-commons' | 'public-domain' | 'commercial-license') | null;
  };
  seo?: {
    /**
     * SEO title for this media
     */
    seoTitle?: string | null;
    /**
     * SEO description for this media
     */
    seoDescription?: string | null;
  };
  /**
   * Internal usage notes (admin only)
   */
  usageNotes?: string | null;
  uploadedBy?: (number | null) | User;
  lastModifiedBy?: (number | null) | User;
  updatedAt: string;
  createdAt: string;
  url?: string | null;
  thumbnailURL?: string | null;
  filename?: string | null;
  mimeType?: string | null;
  filesize?: number | null;
  width?: number | null;
  height?: number | null;
  focalX?: number | null;
  focalY?: number | null;
  sizes?: {
    thumbnail?: {
      url?: string | null;
      width?: number | null;
      height?: number | null;
      mimeType?: string | null;
      filesize?: number | null;
      filename?: string | null;
    };
    card?: {
      url?: string | null;
      width?: number | null;
      height?: number | null;
      mimeType?: string | null;
      filesize?: number | null;
      filename?: string | null;
    };
    hero?: {
      url?: string | null;
      width?: number | null;
      height?: number | null;
      mimeType?: string | null;
      filesize?: number | null;
      filename?: string | null;
    };
    tablet?: {
      url?: string | null;
      width?: number | null;
      height?: number | null;
      mimeType?: string | null;
      filesize?: number | null;
      filename?: string | null;
    };
  };
}
/**
 * Manage hierarchical categories: Sports Category → Sports → Sports Item
 *
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "categories".
 */
export interface Category {
  id: number;
  /**
   * Category name
   */
  name: string;
  /**
   * Auto-generated URL slug
   */
  slug: string;
  /**
   * Select brands related to this category (for navigation and filtering)
   */
  relatedBrands?: (number | Brand)[] | null;
  /**
   * Select the hierarchy level for this category
   */
  type: 'sports-category' | 'sports' | 'sports-item';
  /**
   * Select parent category
   */
  parentCategory?: (number | null) | Category;
  /**
   * Category status
   */
  status: 'active' | 'inactive' | 'draft';
  /**
   * Display order (lower numbers appear first)
   */
  displayOrder: number;
  /**
   * ⭐ Feature this category
   */
  isFeature?: boolean | null;
  /**
   * 🧭 Show in navigation
   */
  showInNavigation?: boolean | null;
  /**
   * Category description for customers
   */
  description?: string | null;
  /**
   * 🔧 Show advanced settings
   */
  showAdvanced?: boolean | null;
  visual?: {
    /**
     * Icon class or emoji
     */
    icon?: string | null;
    /**
     * Category banner image
     */
    image?: (number | null) | Media;
    /**
     * Brand color (hex code)
     */
    color?: string | null;
  };
  config?: {
    /**
     * Allow products in this category
     */
    allowProducts?: boolean | null;
    /**
     * 📏 Requires size
     */
    requiresSize?: boolean | null;
    /**
     * 🎨 Requires color
     */
    requiresColor?: boolean | null;
    /**
     * 👤 Requires gender
     */
    requiresGender?: boolean | null;
    /**
     * Common sizes (comma separated)
     */
    commonSizes?: string | null;
    /**
     * Common colors (comma separated)
     */
    commonColors?: string | null;
  };
  seo?: {
    /**
     * SEO title (auto-generated if empty)
     */
    title?: string | null;
    /**
     * SEO meta description
     */
    description?: string | null;
    /**
     * SEO keywords (comma separated)
     */
    keywords?: string | null;
  };
  /**
   * Full category path
   */
  fullPath?: string | null;
  /**
   * Hierarchy level
   */
  level?: number | null;
  /**
   * Active products count
   */
  productCount?: number | null;
  createdBy?: (number | null) | User;
  lastModifiedBy?: (number | null) | User;
  updatedAt: string;
  createdAt: string;
}
/**
 * Manage product brands and manufacturers
 *
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "brands".
 */
export interface Brand {
  id: number;
  /**
   * Brand name
   */
  name: string;
  /**
   * Auto-generated URL slug
   */
  slug: string;
  branding: {
    /**
     * Brand logo image
     */
    logo: number | Media;
    /**
     * Brand description for customers
     */
    description?: string | null;
  };
  /**
   * Brand status
   */
  status: 'active' | 'inactive' | 'discontinued';
  /**
   * ⭐ Feature on homepage
   */
  isFeatured?: boolean | null;
  /**
   * 💎 Premium brand
   */
  isPremium?: boolean | null;
  /**
   * 🔧 Show advanced settings
   */
  showAdvanced?: boolean | null;
  details?: {
    /**
     * Brand website URL
     */
    website?: string | null;
    /**
     * Country of origin
     */
    countryOfOrigin?: string | null;
    /**
     * Founded year
     */
    foundedYear?: number | null;
    /**
     * Brand specialties and focus areas
     */
    specialties?: string | null;
    /**
     * Typical price range
     */
    priceRange?: ('budget' | 'mid-range' | 'premium' | 'luxury') | null;
    /**
     * Primary target audience
     */
    targetAudience?: string | null;
  };
  contact?: {
    /**
     * Brand contact email
     */
    email?: string | null;
    /**
     * Brand contact phone
     */
    phone?: string | null;
    /**
     * Brand address
     */
    address?: string | null;
  };
  social?: {
    /**
     * Facebook page URL
     */
    facebook?: string | null;
    /**
     * Instagram profile URL
     */
    instagram?: string | null;
    /**
     * Twitter profile URL
     */
    twitter?: string | null;
    /**
     * YouTube channel URL
     */
    youtube?: string | null;
  };
  seo?: {
    /**
     * SEO title (auto-generated if empty)
     */
    title?: string | null;
    /**
     * SEO meta description
     */
    description?: string | null;
    /**
     * SEO keywords (comma separated)
     */
    keywords?: string | null;
  };
  /**
   * Number of active products
   */
  productCount?: number | null;
  createdBy?: (number | null) | User;
  lastModifiedBy?: (number | null) | User;
  updatedAt: string;
  createdAt: string;
}
/**
 * Manage your product catalog with three-tier categorization
 *
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "products".
 */
export interface Product {
  id: number;
  /**
   * Product name as shown to customers
   */
  name: string;
  slug?: string | null;
  categorySelection: {
    /**
     * 🏆 Select Sports Category (Level 1)
     */
    sportsCategory: number | Category;
    /**
     * ⚽ Select Sports (Level 2)
     */
    sports?: (number | null) | Category;
    /**
     * 👕 Select Sports Item (Level 3)
     */
    sportsItem?: (number | null) | Category;
  };
  essentials: {
    /**
     * Product brand
     */
    brand: number | Brand;
    /**
     * Product price (LKR)
     */
    price: number;
  };
  /**
   * 📸 Product images (first image is the main image)
   */
  images: {
    image: number | Media;
    /**
     * Image description (auto-generated if empty)
     */
    altText?: string | null;
    id?: string | null;
  }[];
  /**
   * Product availability status
   */
  status: 'active' | 'draft' | 'inactive' | 'out-of-stock';
  /**
   * Detailed product description
   */
  description?: {
    root: {
      type: string;
      children: {
        type: string;
        version: number;
        [k: string]: unknown;
      }[];
      direction: ('ltr' | 'rtl') | null;
      format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
      indent: number;
      version: number;
    };
    [k: string]: unknown;
  } | null;
  /**
   * 🔧 Show advanced settings
   */
  showAdvanced?: boolean | null;
  /**
   * Full category path
   */
  categoryPath?: string | null;
  productDetails?: {
    /**
     * Product SKU (auto-generated if empty)
     */
    sku?: string | null;
    /**
     * Original price (for showing discounts)
     */
    originalPrice?: number | null;
    /**
     * Product tags (comma separated)
     */
    tags?: string | null;
  };
  inventory?: {
    /**
     * Enable inventory tracking
     */
    trackInventory?: boolean | null;
    /**
     * Stock quantity (when not using variants)
     */
    stock?: number | null;
    /**
     * Alert when stock falls below this number
     */
    lowStockThreshold?: number | null;
  };
  /**
   * This product has variants (sizes, colors, etc.)
   */
  hasVariants?: boolean | null;
  /**
   * Product variants with individual pricing and inventory
   */
  variants?:
    | {
        name: string;
        size?: string | null;
        color?: string | null;
        material?: string | null;
        price: number;
        /**
         * Stock for this variant
         */
        stock: number;
        /**
         * Variant SKU (auto-generated if empty)
         */
        sku?: string | null;
        id?: string | null;
      }[]
    | null;
  /**
   * Key product features and benefits
   */
  features?:
    | {
        feature: string;
        /**
         * Feature description (optional)
         */
        description?: string | null;
        id?: string | null;
      }[]
    | null;
  specifications?: {
    weight?: string | null;
    dimensions?: string | null;
    material?: string | null;
    /**
     * Target gender
     */
    gender?: ('unisex' | 'men' | 'women' | 'kids') | null;
    /**
     * Care and maintenance instructions
     */
    careInstructions?: string | null;
  };
  seo?: {
    /**
     * SEO title (auto-generated if empty)
     */
    title?: string | null;
    /**
     * SEO meta description
     */
    description?: string | null;
  };
  /**
   * Related products for cross-selling
   */
  relatedProducts?: (number | Product)[] | null;
  createdBy?: (number | null) | User;
  lastModifiedBy?: (number | null) | User;
  updatedAt: string;
  createdAt: string;
}
/**
 * Manage customer orders and fulfillment
 *
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "orders".
 */
export interface Order {
  id: number;
  /**
   * Auto-generated order identifier
   */
  orderNumber: string;
  customer: {
    /**
     * Customer full name
     */
    customerName: string;
    /**
     * Primary phone number
     */
    customerPhone: string;
    /**
     * Email address (optional)
     */
    customerEmail?: string | null;
    /**
     * Complete delivery address
     */
    deliveryAddress: string;
  };
  /**
   * 📦 Order Items
   */
  orderItems: {
    /**
     * Product name
     */
    productName: string;
    /**
     * Qty
     */
    quantity: number;
    /**
     * Unit price
     */
    unitPrice: number;
    /**
     * Item subtotal (auto-calculated)
     */
    subtotal: number;
    /**
     * Select product variant (if applicable)
     */
    selectedVariant?: (number | null) | Product;
    /**
     * SKU
     */
    productSku?: string | null;
    /**
     * Variant details copied from selected variant
     */
    variantDetails?: {
      size?: string | null;
      color?: string | null;
      material?: string | null;
      price?: number | null;
      sku?: string | null;
    };
    id?: string | null;
  }[];
  orderSummary: {
    /**
     * Total order amount (LKR)
     */
    orderTotal: number;
  };
  status: {
    /**
     * Current order status
     */
    orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    /**
     * Payment status
     */
    paymentStatus: 'pending' | 'paid' | 'partially-paid' | 'failed' | 'refunded';
  };
  /**
   * 🔧 Show advanced settings
   */
  showAdvanced?: boolean | null;
  orderDetails?: {
    /**
     * Special delivery instructions
     */
    specialInstructions?: string | null;
    /**
     * Payment method
     */
    paymentMethod?: ('cod' | 'bank-transfer' | 'online-payment' | 'card-payment') | null;
    /**
     * Order source
     */
    orderSource?: ('website' | 'whatsapp' | 'phone' | 'store' | 'social') | null;
  };
  pricing?: {
    /**
     * Subtotal
     */
    orderSubtotal?: number | null;
    /**
     * Tax
     */
    tax?: number | null;
    /**
     * Shipping
     */
    shippingCost?: number | null;
    /**
     * Discount
     */
    discount?: number | null;
  };
  paymentGateway?: {
    paymentId?: string | null;
    statusCode?: string | null;
    /**
     * The full JSON response from the payment gateway for debugging.
     */
    gatewayResponse?:
      | {
          [k: string]: unknown;
        }
      | unknown[]
      | string
      | number
      | boolean
      | null;
  };
  whatsapp?: {
    /**
     * Confirmation message sent
     */
    messageSent?: boolean | null;
    /**
     * Message sent at
     */
    messageTimestamp?: string | null;
    /**
     * Message template used
     */
    messageTemplate?:
      | ('order-confirmation' | 'order-update' | 'shipping-notification' | 'delivery-confirmation')
      | null;
    /**
     * Customer response via WhatsApp
     */
    customerResponse?: string | null;
  };
  updatedAt: string;
  createdAt: string;
}
/**
 * Manage customer information and relationships
 *
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "customers".
 */
export interface Customer {
  id: number;
  /**
   * Customer full name
   */
  name: string;
  /**
   * Customer email
   */
  email: string;
  /**
   * Primary phone number
   */
  primaryPhone: string;
  /**
   * Customer account status
   */
  status: 'active' | 'inactive' | 'vip' | 'blocked';
  /**
   * Default delivery address
   */
  defaultAddress?: string | null;
  /**
   * 🔧 Show advanced settings
   */
  showAdvanced?: boolean | null;
  /**
   * Secondary phone number
   */
  secondaryPhone?: string | null;
  /**
   * Additional delivery addresses
   */
  addresses?:
    | {
        type: 'home' | 'office' | 'other';
        /**
         * Address label
         */
        label?: string | null;
        address: string;
        /**
         * Set as default address
         */
        isDefault?: boolean | null;
        id?: string | null;
      }[]
    | null;
  /**
   * Preferred communication method
   */
  communicationMethod?: ('whatsapp' | 'email' | 'phone') | null;
  /**
   * 📢 Receive marketing communications
   */
  marketingOptIn?: boolean | null;
  /**
   * Total orders placed
   */
  totalOrders?: number | null;
  /**
   * Total amount spent (LKR)
   */
  totalSpent?: number | null;
  /**
   * Last order date
   */
  lastOrderDate?: string | null;
  /**
   * Internal customer notes
   */
  notes?: string | null;
  createdBy?: (number | null) | User;
  lastModifiedBy?: (number | null) | User;
  updatedAt: string;
  createdAt: string;
}
/**
 * Track inventory levels and stock movements
 *
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "inventory".
 */
export interface Inventory {
  id: number;
  /**
   * Select the product
   */
  product: number | Product;
  /**
   * Product name (auto-filled)
   */
  productName: string;
  /**
   * Product SKU (auto-filled)
   */
  sku: string;
  productInfo?: {
    /**
     * Variant ID if tracking variant inventory
     */
    variantId?: string | null;
  };
  stockInfo: {
    /**
     * Current stock level
     */
    currentStock: number;
    /**
     * Reserved stock
     */
    reservedStock?: number | null;
    /**
     * Available stock
     */
    availableStock?: number | null;
    /**
     * Low stock alert threshold
     */
    lowStockThreshold?: number | null;
    /**
     * 🚨 Low stock alert active
     */
    lowStockAlert?: boolean | null;
  };
  storage?: {
    /**
     * Storage location
     */
    location?: ('main-warehouse' | 'store-front' | 'secondary-storage' | 'supplier' | 'in-transit') | null;
    /**
     * Specific bin or shelf location
     */
    binLocation?: string | null;
  };
  /**
   * 🔧 Show advanced settings
   */
  showAdvanced?: boolean | null;
  costInfo?: {
    /**
     * Cost price per unit
     */
    costPrice?: number | null;
    /**
     * Total inventory value (cost × quantity)
     */
    totalValue?: number | null;
  };
  movements?: {
    /**
     * Last stock received
     */
    lastStockIn?: string | null;
    /**
     * Last stock sold/removed
     */
    lastStockOut?: string | null;
    /**
     * Last inventory update
     */
    lastUpdated?: string | null;
  };
  supplierInfo?: {
    /**
     * Primary supplier name
     */
    supplier?: string | null;
    /**
     * Supplier SKU/part number
     */
    supplierSku?: string | null;
    /**
     * Lead time (days)
     */
    leadTime?: number | null;
    /**
     * Reorder point
     */
    reorderPoint?: number | null;
    /**
     * Reorder quantity
     */
    reorderQuantity?: number | null;
  };
  /**
   * Inventory status
   */
  status: 'active' | 'inactive' | 'discontinued' | 'on-hold';
  /**
   * Internal inventory notes
   */
  notes?: string | null;
  createdBy?: (number | null) | User;
  lastModifiedBy?: (number | null) | User;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-locked-documents".
 */
export interface PayloadLockedDocument {
  id: number;
  document?:
    | ({
        relationTo: 'users';
        value: number | User;
      } | null)
    | ({
        relationTo: 'media';
        value: number | Media;
      } | null)
    | ({
        relationTo: 'categories';
        value: number | Category;
      } | null)
    | ({
        relationTo: 'brands';
        value: number | Brand;
      } | null)
    | ({
        relationTo: 'products';
        value: number | Product;
      } | null)
    | ({
        relationTo: 'orders';
        value: number | Order;
      } | null)
    | ({
        relationTo: 'customers';
        value: number | Customer;
      } | null)
    | ({
        relationTo: 'inventory';
        value: number | Inventory;
      } | null);
  globalSlug?: string | null;
  user: {
    relationTo: 'users';
    value: number | User;
  };
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-preferences".
 */
export interface PayloadPreference {
  id: number;
  user: {
    relationTo: 'users';
    value: number | User;
  };
  key?: string | null;
  value?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-migrations".
 */
export interface PayloadMigration {
  id: number;
  name?: string | null;
  batch?: number | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "users_select".
 */
export interface UsersSelect<T extends boolean = true> {
  firstName?: T;
  lastName?: T;
  phone?: T;
  profileImage?: T;
  role?: T;
  isActive?: T;
  lastLogin?: T;
  department?: T;
  notes?: T;
  updatedAt?: T;
  createdAt?: T;
  email?: T;
  resetPasswordToken?: T;
  resetPasswordExpiration?: T;
  salt?: T;
  hash?: T;
  loginAttempts?: T;
  lockUntil?: T;
  sessions?:
    | T
    | {
        id?: T;
        createdAt?: T;
        expiresAt?: T;
      };
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "media_select".
 */
export interface MediaSelect<T extends boolean = true> {
  category?: T;
  isPublic?: T;
  isFeature?: T;
  showAdvanced?: T;
  details?:
    | T
    | {
        alt?: T;
        caption?: T;
        tags?: T;
      };
  attribution?:
    | T
    | {
        source?: T;
        copyright?: T;
        license?: T;
      };
  seo?:
    | T
    | {
        seoTitle?: T;
        seoDescription?: T;
      };
  usageNotes?: T;
  uploadedBy?: T;
  lastModifiedBy?: T;
  updatedAt?: T;
  createdAt?: T;
  url?: T;
  thumbnailURL?: T;
  filename?: T;
  mimeType?: T;
  filesize?: T;
  width?: T;
  height?: T;
  focalX?: T;
  focalY?: T;
  sizes?:
    | T
    | {
        thumbnail?:
          | T
          | {
              url?: T;
              width?: T;
              height?: T;
              mimeType?: T;
              filesize?: T;
              filename?: T;
            };
        card?:
          | T
          | {
              url?: T;
              width?: T;
              height?: T;
              mimeType?: T;
              filesize?: T;
              filename?: T;
            };
        hero?:
          | T
          | {
              url?: T;
              width?: T;
              height?: T;
              mimeType?: T;
              filesize?: T;
              filename?: T;
            };
        tablet?:
          | T
          | {
              url?: T;
              width?: T;
              height?: T;
              mimeType?: T;
              filesize?: T;
              filename?: T;
            };
      };
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "categories_select".
 */
export interface CategoriesSelect<T extends boolean = true> {
  name?: T;
  slug?: T;
  relatedBrands?: T;
  type?: T;
  parentCategory?: T;
  status?: T;
  displayOrder?: T;
  isFeature?: T;
  showInNavigation?: T;
  description?: T;
  showAdvanced?: T;
  visual?:
    | T
    | {
        icon?: T;
        image?: T;
        color?: T;
      };
  config?:
    | T
    | {
        allowProducts?: T;
        requiresSize?: T;
        requiresColor?: T;
        requiresGender?: T;
        commonSizes?: T;
        commonColors?: T;
      };
  seo?:
    | T
    | {
        title?: T;
        description?: T;
        keywords?: T;
      };
  fullPath?: T;
  level?: T;
  productCount?: T;
  createdBy?: T;
  lastModifiedBy?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "brands_select".
 */
export interface BrandsSelect<T extends boolean = true> {
  name?: T;
  slug?: T;
  branding?:
    | T
    | {
        logo?: T;
        description?: T;
      };
  status?: T;
  isFeatured?: T;
  isPremium?: T;
  showAdvanced?: T;
  details?:
    | T
    | {
        website?: T;
        countryOfOrigin?: T;
        foundedYear?: T;
        specialties?: T;
        priceRange?: T;
        targetAudience?: T;
      };
  contact?:
    | T
    | {
        email?: T;
        phone?: T;
        address?: T;
      };
  social?:
    | T
    | {
        facebook?: T;
        instagram?: T;
        twitter?: T;
        youtube?: T;
      };
  seo?:
    | T
    | {
        title?: T;
        description?: T;
        keywords?: T;
      };
  productCount?: T;
  createdBy?: T;
  lastModifiedBy?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "products_select".
 */
export interface ProductsSelect<T extends boolean = true> {
  name?: T;
  slug?: T;
  categorySelection?:
    | T
    | {
        sportsCategory?: T;
        sports?: T;
        sportsItem?: T;
      };
  essentials?:
    | T
    | {
        brand?: T;
        price?: T;
      };
  images?:
    | T
    | {
        image?: T;
        altText?: T;
        id?: T;
      };
  status?: T;
  description?: T;
  showAdvanced?: T;
  categoryPath?: T;
  productDetails?:
    | T
    | {
        sku?: T;
        originalPrice?: T;
        tags?: T;
      };
  inventory?:
    | T
    | {
        trackInventory?: T;
        stock?: T;
        lowStockThreshold?: T;
      };
  hasVariants?: T;
  variants?:
    | T
    | {
        name?: T;
        size?: T;
        color?: T;
        material?: T;
        price?: T;
        stock?: T;
        sku?: T;
        id?: T;
      };
  features?:
    | T
    | {
        feature?: T;
        description?: T;
        id?: T;
      };
  specifications?:
    | T
    | {
        weight?: T;
        dimensions?: T;
        material?: T;
        gender?: T;
        careInstructions?: T;
      };
  seo?:
    | T
    | {
        title?: T;
        description?: T;
      };
  relatedProducts?: T;
  createdBy?: T;
  lastModifiedBy?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "orders_select".
 */
export interface OrdersSelect<T extends boolean = true> {
  orderNumber?: T;
  customer?:
    | T
    | {
        customerName?: T;
        customerPhone?: T;
        customerEmail?: T;
        deliveryAddress?: T;
      };
  orderItems?:
    | T
    | {
        productName?: T;
        quantity?: T;
        unitPrice?: T;
        subtotal?: T;
        selectedVariant?: T;
        productSku?: T;
        variantDetails?:
          | T
          | {
              size?: T;
              color?: T;
              material?: T;
              price?: T;
              sku?: T;
            };
        id?: T;
      };
  orderSummary?:
    | T
    | {
        orderTotal?: T;
      };
  status?:
    | T
    | {
        orderStatus?: T;
        paymentStatus?: T;
      };
  showAdvanced?: T;
  orderDetails?:
    | T
    | {
        specialInstructions?: T;
        paymentMethod?: T;
        orderSource?: T;
      };
  pricing?:
    | T
    | {
        orderSubtotal?: T;
        tax?: T;
        shippingCost?: T;
        discount?: T;
      };
  paymentGateway?:
    | T
    | {
        paymentId?: T;
        statusCode?: T;
        gatewayResponse?: T;
      };
  whatsapp?:
    | T
    | {
        messageSent?: T;
        messageTimestamp?: T;
        messageTemplate?: T;
        customerResponse?: T;
      };
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "customers_select".
 */
export interface CustomersSelect<T extends boolean = true> {
  name?: T;
  email?: T;
  primaryPhone?: T;
  status?: T;
  defaultAddress?: T;
  showAdvanced?: T;
  secondaryPhone?: T;
  addresses?:
    | T
    | {
        type?: T;
        label?: T;
        address?: T;
        isDefault?: T;
        id?: T;
      };
  communicationMethod?: T;
  marketingOptIn?: T;
  totalOrders?: T;
  totalSpent?: T;
  lastOrderDate?: T;
  notes?: T;
  createdBy?: T;
  lastModifiedBy?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "inventory_select".
 */
export interface InventorySelect<T extends boolean = true> {
  product?: T;
  productName?: T;
  sku?: T;
  productInfo?:
    | T
    | {
        variantId?: T;
      };
  stockInfo?:
    | T
    | {
        currentStock?: T;
        reservedStock?: T;
        availableStock?: T;
        lowStockThreshold?: T;
        lowStockAlert?: T;
      };
  storage?:
    | T
    | {
        location?: T;
        binLocation?: T;
      };
  showAdvanced?: T;
  costInfo?:
    | T
    | {
        costPrice?: T;
        totalValue?: T;
      };
  movements?:
    | T
    | {
        lastStockIn?: T;
        lastStockOut?: T;
        lastUpdated?: T;
      };
  supplierInfo?:
    | T
    | {
        supplier?: T;
        supplierSku?: T;
        leadTime?: T;
        reorderPoint?: T;
        reorderQuantity?: T;
      };
  status?: T;
  notes?: T;
  createdBy?: T;
  lastModifiedBy?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-locked-documents_select".
 */
export interface PayloadLockedDocumentsSelect<T extends boolean = true> {
  document?: T;
  globalSlug?: T;
  user?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-preferences_select".
 */
export interface PayloadPreferencesSelect<T extends boolean = true> {
  user?: T;
  key?: T;
  value?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-migrations_select".
 */
export interface PayloadMigrationsSelect<T extends boolean = true> {
  name?: T;
  batch?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "auth".
 */
export interface Auth {
  [k: string]: unknown;
}


declare module 'payload' {
  export interface GeneratedTypes extends Config {}
}