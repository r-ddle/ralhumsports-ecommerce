export const SITE_CONFIG = {
  taxRate: 0.15, // 15% tax
  currency: 'LKR',
  about: {
    companyName: 'Ralhum Sports',
    tagline: "Sri Lanka's #1 Sports Equipment Distributor & Online Store",
    description:
      "Sri Lanka's #1 sports equipment distributor for 25+ years. Exclusive distributor of world-renowned sports brands.",
    address: '27, Hildon Place, Colombo 04, Sri Lanka',
    legacy: {
      parentCompany: 'S.M.M.Muhlar & Co',
      parentCompanyYears: '75+',
      legacyText:
        'Our parent company, S.M.M.Muhlar & Co, has been a trusted name in Sri Lankan business for over 75 years. This heritage of excellence and integrity forms the foundation of everything we do at Ralhum Sports.',
    },
    established: 1996,
    yearsOfExcellence: '30',
  },
  contact: {
    phone: '+94112508082',
    email: 'info@ralhumsports.lk',
    whatsapp: '+94772350712',
    whatsappUrl: 'https://wa.me/94772350712',
    supportHours: 'Mon-Sat: 9AM-6PM; Sunday: Closed',
    address: '27, Hildon Place, Colombo 04, Sri Lanka',
  },
  social: {
    facebook: 'https://facebook.com/ralhumsports',
    instagram: 'https://instagram.com/ralhumsports',
  },
  branding: {
    logoText: 'RALHUM SPORTS',
    logoImage: '/logo.svg', // update if you have a logo image
    colors: {
      primary: '#003DA5',
      gold: '#FFD700',
      orange: '#FF3D00',
      lime: '#AEEA00',
      dark: '#1A1A1A',
    },
    cta: {
      shop: 'START SHOPPING',
      contact: 'CONTACT US',
      whatsapp: 'WHATSAPP US',
      getQuote: 'GET QUOTE NOW',
    },
  },
  shipping: {
    freeShippingThreshold: 50000, // number, not string
    standardShipping: 1000, // number, not string
  },
  brands: [
    {
      name: 'Gray-Nicolls',
      heritage: 'Since 1855',
      specialty: 'Cricket Excellence',
      description: 'Premium cricket bats & equipment trusted by professionals worldwide',
      color: 'from-[#003DA5] to-[#1A1A1A]',
      achievements: ['Official England Cricket', 'World Cup Heritage', 'Professional Choice'],
      // icon: Trophy, // import icon in component
    },
    {
      name: 'Gilbert',
      heritage: 'Since 1823',
      specialty: 'Rugby World Leader',
      description: "World's #1 rugby brand, official Rugby World Cup ball supplier",
      color: 'from-[#FF3D00] to-[#1A1A1A]',
      achievements: ['Rugby World Cup Official', 'Professional Rugby', 'Global Standard'],
    },
    {
      name: 'Grays',
      heritage: 'Field Sports',
      specialty: 'Hockey Excellence',
      description: 'Hockey & field sports innovation trusted by Olympic athletes',
      color: 'from-[#AEEA00] to-[#1A1A1A]',
      achievements: ['Olympic Standard', 'Professional Hockey', 'Field Sports Leader'],
    },
    {
      name: 'Molten',
      heritage: 'Innovation',
      specialty: 'Basketball & Volleyball',
      description: 'Official tournament supplier for basketball & volleyball worldwide',
      color: 'from-[#FFD700] to-[#1A1A1A]',
      achievements: ['Olympic Official', 'Tournament Standard', 'Professional Choice'],
    },
  ],
  stats: [
    { number: '25+', label: 'Years of Excellence', color: '#003DA5' },
    { number: '75+', label: 'Years Parent Company Heritage', color: '#FF3D00' },
    { number: '1000+', label: 'Schools & Clubs Served', color: '#FFD700' },
    { number: '#1', label: 'Sports Distributor in Sri Lanka', color: '#AEEA00' },
  ],
  whatsapp: {
    number: '94772350712',
    message: "Hello Ralhum Sports! I'm interested in your sports equipment. Please contact me.",
    reportMessage: 'Hello! I need to report a product verification issue. SKU: ',
  },
}

export type SiteConfig = typeof SITE_CONFIG
