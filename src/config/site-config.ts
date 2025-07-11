export const SITE_CONFIG = {
  taxRate: 0.15, // 15% tax
  currency: 'LKR',
  about: {
    companyName: 'Ralhum Sports',
    tagline: "Sri Lanka's #1 Sports Equipment Distributor & Online Store",
    description:
      "Sri Lanka's #1 sports equipment distributor for 25+ years. Exclusive distributor of world-renowned sports brands.",
    address: '34A, Shruberry Garden, Colombo 04',
    legacy: {
      parentCompany: 'S.M.M.Muhlar & Co',
      parentCompanyYears: '75+',
      legacyText:
        'Our parent company, S.M.M.Muhlar & Co, has been a trusted name in Sri Lankan business for over 75 years. This heritage of excellence and integrity forms the foundation of everything we do at Ralhum Sports.',
    },
    timeline: [
      {
        year: '1921',
        title: 'S.M.M.Muhlar & Co Founded',
        description:
          'Parent company established by S.M.M.Muhlar, pioneering garment accessories and consumer products',
        icon: 'Calendar',
        color: 'from-[#003DA5] to-[#0052CC]',
      },
      {
        year: '1996',
        title: 'Ralhum Sports Established',
        description: 'Founded primarily to serve the cricket industry in Sri Lanka',
        icon: 'Trophy',
        color: 'from-[#FF3D00] to-[#FF6B47]',
      },
      {
        year: '2000s',
        title: 'Portfolio Expansion',
        description:
          'Gradually expanded to include global brands across multiple sports categories',
        icon: 'TrendingUp',
        color: 'from-[#AEEA00] to-[#7CB342]',
      },
      {
        year: 'Present',
        title: 'Market Leadership',
        description: 'Leading sports distributing company in Sri Lanka for over 25 years',
        icon: 'Award',
        color: 'from-[#FFD700] to-[#FFA500]',
      },
    ],
    established: 1996,
    yearsOfExcellence: '30',
  },
  contact: {
    phone: '+94114388826/5',
    email: 'sales@ralhumsports.lk',
    whatsapp: '+94772350712',
    whatsappUrl: 'https://wa.me/94772350712',
    supportHours: 'Mon-Sat: 9AM-6PM; Sunday: Closed',
    address: '4A, Shruberry Garden, Colombo 04',
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
      category: 'Cricket',
      heritage: 'Since 1855',
      tagline: "The World's Finest Cricket Equipment",
      description:
        "Gray‑Nicolls has been crafting the world's finest cricket equipment for over 165 years. Our factory in Robertsbridge merges traditional craftsmanship with modern innovation, producing bats used by legends from W.G. Grace to Harry Brook and Kane Williamson.",
      color: 'from-[#003DA5] via-[#0052CC] to-[#1A1A1A]',
      achievements: [
        'Official England Cricket Supplier',
        'Used in Cricket World Cups & Ashes series',
        'Trusted by legends and current internationals',
        '150+ years of elite manufacturing in Robertsbridge',
      ],
      products: [
        {
          name: 'Cricket Bats',
          description: 'NEOCORE, Ventus, Stratos, GEM & classic family bats',
        },
        { name: 'Protective Gear', description: 'Helmets, pads, gloves & clads built for safety' },
        {
          name: 'Cricket Balls',
          description: 'Match and practice balls meeting international standards',
        },
        {
          name: 'Accessories',
          description: 'Kit bags, stumps, training equipment & bat care tools',
        },
      ],
      image: '/gray-nicolls.jpeg',
      slug: 'gray-nicolls',
      icon: 'Trophy',
      featured: true,
    },
    {
      name: 'Gilbert',
      category: 'Rugby',
      heritage: 'Since 1823',
      tagline: "The World's #1 Rugby Brand",
      description:
        'Gilbert has led rugby ball innovation for 200 years. Official ball supplier for Rugby World Cups since 1995. Now supplying URC, Women’s Rugby & PWR, with its new iNNOVO dual‑valve technology powering elite play.',
      color: 'from-[#FF3D00] via-[#FF6B47] to-[#1A1A1A]',
      achievements: [
        'Official Rugby World Cup Ball since 1995',
        'Official ball for Women’s Rugby World Cup 2025',
        'Renewed partnership with United Rugby Championship (2025)',
        'Official Prem Women’s Rugby & Rugby Canada supplier',
        'Pioneers of dual‑valve iNNOVO tech',
      ],
      products: [
        { name: 'Rugby Balls', description: 'Match balls (iNNOVO), training & replica balls' },
        {
          name: 'Training Equipment',
          description: 'Cones, tackle bags, headguards & coaching aids',
        },
        { name: 'Protective Gear', description: 'Headguards, shoulder pads & body protection' },
        { name: 'Team Accessories', description: 'Boot bags, ball pumps, teamwear & accessories' },
      ],
      image: '/gilbert.svg',
      slug: 'gilbert',
      icon: 'Award',
      featured: true,
    },
    {
      name: 'Grays',
      category: 'Hockey',
      heritage: 'Field Sports Excellence',
      tagline: 'Trusted by Olympic Athletes',
      description:
        'Grays continues delivering Olympic‑level hockey innovation. Their composite sticks and protective line remain top picks among international hockey athletes.',
      color: 'from-[#AEEA00] via-[#7CB342] to-[#1A1A1A]',
      achievements: [
        'Olympic Standard Equipment',
        'Used by professional & national hockey teams',
        'Field Sports innovation leader',
        'Trusted by international athletes',
      ],
      products: [
        { name: 'Hockey Sticks', description: 'Composite & wooden sticks for all positions' },
        { name: 'Protective Equipment', description: 'Shin guards, gloves & goalkeeping gear' },
        { name: 'Hockey Balls', description: 'Match and training balls for all surfaces' },
        { name: 'Training Gear', description: 'Cones, goals & skill‑development equipment' },
      ],
      image: '/grays.png',
      slug: 'grays',
      icon: 'Star',
      featured: true,
    },
    {
      name: 'Babolat',
      category: 'Tennis & Badminton',
      heritage: 'Innovation Leader',
      tagline: 'Pure Racquet Sport',
      description:
        'French brand pioneering Aero racquets & smart racquet tech. Official partner of Roland‑Garros.',
      color: 'from-[#FF3D00] via-[#FF6B47] to-[#AEEA00]',
      achievements: ['Roland‑Garros Official', 'Creator of Aero series', 'Smart racquet pioneer'],
      products: [
        { name: 'Tennis Rackets', description: 'Professional tournament rackets' },
        { name: 'Badminton Rackets', description: 'Precision‑engineered rackets' },
      ],
      image: '/babolat.svg',
      slug: 'babolat',
      icon: 'Target',
    },
    {
      name: 'Molten',
      category: 'Basketball & Volleyball',
      heritage: 'Innovation Leader',
      tagline: 'Official Tournament Supplier Worldwide',
      description:
        'Leader in ball tech for basketball & volleyball. Official supplier to FIBA, Olympic Games & world championships.',
      color: 'from-[#FFD700] via-[#FFA500] to-[#1A1A1A]',
      achievements: [
        'Official Olympic Games Supplier',
        'FIBA World Championship ball',
        'Used in pro leagues globally',
        'Innovation in ball manufacturing',
      ],
      products: [
        { name: 'Basketballs', description: 'Indoor/outdoor balls for all levels' },
        { name: 'Volleyballs', description: 'Competition & recreational volleyballs' },
        { name: 'Training Equipment', description: 'Ball carts, pumps & training aids' },
        { name: 'Court Accessories', description: 'Scoreboards, nets & court gear' },
      ],
      image: '/molten.png',
      slug: 'molten',
      icon: 'Target',
      featured: true,
    },
    {
      name: 'Pugg',
      heritage: 'Patented in 1994, USA',
      specialty: 'Pop‑Up Goals',
      description:
        'The original 1994 steel‑wire pop‑up goal, favoured by pro coaches worldwide for training drills and portability.',
      color: 'from-[#F9D923] via-[#D4B72D] to-[#1A1A1A]',
      achievements: ['Training Essential', 'Portable Design', 'Coach Favorite'],
      image: '/pugg.png',
    },
    {
      name: 'Aero',
      heritage: 'Late 1990s, New Zealand',
      specialty: 'Protective Gear',
      description:
        'Innovative cricket safety tech since the ’90s—100 mph impact‑tested pads trusted by professionals.',
      color: 'from-[#00C853] to-[#1A1A1A]',
      achievements: ['100 mph Impact Tested', 'Player Safety', 'Trusted by Pros'],
    },
    {
      name: 'Leverage',
      heritage: 'Cricket Tech Pioneer',
      specialty: 'Bowling Machines',
      description:
        'Advanced & affordable bowling machines (up to 160 km/h) delivering swing, spin & pace for coaches and players.',
      color: 'from-[#FF6F00] to-[#1A1A1A]',
      achievements: ['Training Revolution', '160 km/h Capability', 'Coach Favorite'],
      image: '/leverage.png',
    },
    {
      name: 'Ashaway',
      heritage: 'Founded 1824, USA',
      specialty: 'Badminton & Squash',
      description:
        'Performance strings since 1824, crafted in the USA for badminton, squash & tennis.',
      color: 'from-[#C62828] to-[#1A1A1A]',
      achievements: ['String Innovation', 'Global Reach', 'Player Choice'],
      image: '/ashaway.jpeg',
    },
    {
      name: 'Fusion',
      heritage: 'Multi‑Sport Focus',
      specialty: 'Training Equipment',
      description: 'Durable, coach‑approved gear for multi‑sport training.',
      color: 'from-[#7B1FA2] to-[#1A1A1A]',
      achievements: ['Multi‑Sport Use', 'Durable Build', 'Coach Approved'],
      image: '/fusion.jpg',
    },
  ],
  stats: [
    { number: '30', label: 'Years of Excellence', color: '#003DA5' },
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
