export const SITE_CONFIG = {
  taxRate: 0.15, // 15% tax
  currency: 'LKR',
  about: {
    companyName: 'Ralhum Sports',
    description:
      'Ralhum Sports is Sri Lanka’s leading premium sports equipment retailer, offering authentic products from top global brands.',
    address: '123 Main Street, Colombo, Sri Lanka',
  },
  contact: {
    phone: '+94 77 123 4567',
    email: 'info@ralhumsports.com',
    whatsapp: '+94 77 235 0712',
    whatsappUrl: 'https://wa.me/94772350712',
    supportHours: 'Mon-Fri 9am-6pm',
    whatsapp_contact_number: '+94772350712',
  },
  shipping: {
    freeShippingThreshold: 50000, // number, not string
    standardShipping: 1000, // number, not string
  },
  social: {
    facebook: 'https://facebook.com/ralhumsports',
    instagram: 'https://instagram.com/ralhumsports',
  },
}

export type SiteConfig = typeof SITE_CONFIG
