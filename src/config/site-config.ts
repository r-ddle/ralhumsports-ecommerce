export const SITE_CONFIG = {
  siteUrl: 'http://localhost:3000', // Change this to your production domain after deployment
  taxRate: 0.15, // 15% tax
  currency: 'LKR',
  about: {
    companyName: 'Ralhum Sports',
    tagline: "Sri Lanka's #1 Sports Equipment Distributor & Online Store",
    description:
      "Sri Lanka's #1 sports equipment distributor for 25+ years. Exclusive distributor of world-renowned sports brands.",
    address: {
      street: '34A, Shruberry Garden',
      city: 'Colombo 04',
      country: 'Sri Lanka',
    },
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
        color: 'from-brand-secondary to-secondary-600',
      },
      {
        year: '1996',
        title: 'Ralhum Sports Established',
        description: 'Founded primarily to serve the cricket industry in Sri Lanka',
        icon: 'Trophy',
        color: 'from-brand-primary to-primary-600',
      },
      {
        year: '2000s',
        title: 'Portfolio Expansion',
        description:
          'Gradually expanded to include global brands across multiple sports categories',
        icon: 'TrendingUp',
        color: 'from-brand-accent to-warning',
      },
      {
        year: 'Present',
        title: 'Market Leadership',
        description: 'Leading sports distributing company in Sri Lanka for over 25 years',
        icon: 'Award',
        color: 'from-brand-accent to-brand-primary',
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
    supportHours: 'Mon-Sat: 9AM-6PM',
    address: {
      street: '4A, Shruberry Garden',
      city: 'Colombo 04',
      country: 'Sri Lanka',
    },
    hours: {
      monday: '9AM-6PM',
      tuesday: '9AM-6PM',
      wednesday: '9AM-6PM',
      thursday: '9AM-6PM',
      friday: '9AM-6PM',
      saturday: '9AM-6PM',
      sunday: 'Closed',
    },
  },
  social: {
    facebook: 'https://facebook.com/ralhumsports',
    instagram: 'https://instagram.com/ralhumsports',
  },
  branding: {
    logoText: 'RALHUM SPORTS',
    logoImage: '/logo.svg',
    companyName: 'Ralhum Sports Pvt Ltd',
    colors: {
      primary: '#FF6B35', // Orange - buttons, CTAs, links, active states
      secondary: '#3B82F6', // Dark blue-gray - headers, important text
      accent: '#F39C12', // Warm amber - highlights, badges, sale indicators
      background: '#FAFAFA', // Soft off-white - main background
      surface: '#FFFFFF', // Pure white for cards
      textPrimary: '#2D3436', // Dark charcoal - main text
      textSecondary: '#636E72', // Medium gray - secondary text
      border: '#DDD', // Light gray - borders, cards, dividers
    },
    cta: {
      shop: 'START SHOPPING',
      contact: 'CONTACT US',
      whatsapp: 'WHATSAPP US',
      getQuote: 'GET QUOTE NOW',
    },
  },
  shipping: {
    freeShippingThreshold: 50000,
    standardShipping: 1000,
  },
  brands: [
    {
      name: 'Gray-Nicolls',
      category: 'Cricket',
      heritage: 'Since 1855',
      tagline: "Cricket's Finest Since 1855",
      description:
        "Gray-Nicolls continues to craft the world's finest cricket equipment with over 170 years of heritage. From their Robertsbridge factory, they merge traditional craftsmanship with cutting-edge innovation, producing the 2025 Ventus and Stratos ranges alongside the legendary Classic Collection used by elite players worldwide.",
      color: 'from-[#003DA5] via-[#0052CC] to-[#1A1A1A]',
      achievements: [
        'Official England Cricket Team Supplier',
        'Trusted by legends from W.G. Grace to modern stars',
        'World-class manufacturing in Robertsbridge since 1855',
        'Pioneers of the 2025 Ventus and Stratos bat technology',
        'Grade Four English Willow specialist craftsmanship',
      ],
      products: [
        {
          name: 'Cricket Bats',
          description: 'Ventus, Stratos, GEM 2.0, Classic Collection & Ultimate series bats',
        },
        {
          name: 'Protective Gear',
          description: 'Advanced helmets, pads, gloves & protective clads',
        },
        {
          name: 'Cricket Balls',
          description: 'Match and practice balls meeting international standards',
        },
        {
          name: 'Accessories',
          description: 'Premium kit bags, stumps, training equipment & bat care essentials',
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
      tagline: "Rugby's Global Standard",
      description:
        'Gilbert leads rugby innovation with 200+ years of excellence. Official Rugby World Cup ball supplier since 1995, now powering RWC 2025 and extending their URC partnership beyond 10 years. The revolutionary iNNOVO dual-valve technology sets the gold standard for international rugby.',
      color: 'from-[#FF3D00] via-[#FF6B47] to-[#1A1A1A]',
      achievements: [
        'Official Rugby World Cup Ball since 1995',
        'Official ball supplier for Rugby World Cup 2025',
        'URC partnership renewed until 2035+',
        'Revolutionary iNNOVO dual-valve technology pioneer',
        'Official ball for international rugby competitions globally',
      ],
      products: [
        { name: 'Rugby Balls', description: 'iNNOVO match balls, training & replica collections' },
        {
          name: 'Training Equipment',
          description: 'Professional cones, tackle bags, headguards & coaching aids',
        },
        {
          name: 'Protective Gear',
          description: 'Advanced headguards, shoulder pads & body protection',
        },
        {
          name: 'Team Accessories',
          description: 'Equipment bags, ball pumps, teamwear & training accessories',
        },
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
      tagline: 'Elite Hockey Performance',
      description:
        'Grays delivers Olympic-caliber hockey innovation with cutting-edge composite stick technology and comprehensive protective equipment. Their advanced engineering and performance-driven designs make them the preferred choice for international hockey athletes and national teams worldwide.',
      color: 'from-[#AEEA00] via-[#7CB342] to-[#1A1A1A]',
      achievements: [
        'Olympic standard equipment supplier',
        'Trusted by international and national hockey teams',
        'Advanced composite stick technology leader',
        'Performance-driven protective gear innovation',
        'Global field hockey equipment specialist',
      ],
      products: [
        {
          name: 'Hockey Sticks',
          description: 'Advanced composite & wooden sticks for all playing positions',
        },
        {
          name: 'Protective Equipment',
          description: 'Professional shin guards, gloves & goalkeeping gear',
        },
        {
          name: 'Hockey Balls',
          description: 'Competition and training balls for all surface types',
        },
        {
          name: 'Training Gear',
          description: 'Skill cones, portable goals & development equipment',
        },
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
      tagline: 'Pure Performance',
      description:
        'French racquet sport innovator pioneering Aero technology and smart racquet systems. As the official partner of Roland-Garros, Babolat continues pushing boundaries with connected racquet technology and precision-engineered equipment for professional and amateur players.',
      color: 'from-[#FF3D00] via-[#FF6B47] to-[#AEEA00]',
      achievements: [
        'Official Roland-Garros partner',
        'Creator of revolutionary Aero racquet series',
        'Smart racquet technology pioneer',
        'Professional tournament equipment supplier',
        'French heritage in racquet sports innovation',
      ],
      products: [
        {
          name: 'Tennis Rackets',
          description: 'Professional tournament rackets with Aero technology',
        },
        { name: 'Badminton Rackets', description: 'Precision-engineered competitive rackets' },
        {
          name: 'Strings & Accessories',
          description: 'Performance strings, grips & maintenance tools',
        },
        {
          name: 'Court Equipment',
          description: 'Training aids, ball machines & court accessories',
        },
      ],
      image: '/babolat.svg',
      slug: 'babolat',
      icon: 'Target',
    },
    {
      name: 'Molten',
      category: 'Basketball & Volleyball',
      heritage: 'Innovation Leader',
      tagline: 'Official Game Standard',
      description:
        'Molten leads basketball and volleyball innovation as the official supplier to FIBA, Olympic Games, and world championships. Their cutting-edge ball technology powered Paris 2024 Olympics and continues setting the standard for professional leagues globally.',
      color: 'from-[#FFD700] via-[#FFA500] to-[#1A1A1A]',
      achievements: [
        'Official Paris 2024 Olympics supplier',
        'FIBA World Championship official ball',
        "NCAA men's and women's championships supplier",
        'USA Volleyball official ball provider',
        'Global professional league standard',
      ],
      products: [
        {
          name: 'Basketballs',
          description: 'Olympic-grade indoor/outdoor balls for all competition levels',
        },
        { name: 'Volleyballs', description: 'Championship and recreational volleyballs' },
        {
          name: 'Training Equipment',
          description: 'Professional ball carts, pumps & training accessories',
        },
        {
          name: 'Court Accessories',
          description: 'Electronic scoreboards, nets & court equipment',
        },
      ],
      image: '/molten.png',
      slug: 'molten',
      icon: 'Target',
      featured: true,
    },
    {
      name: 'Pugg',
      category: 'Football & Training',
      heritage: 'Patented in 1994, USA',
      tagline: 'The Original Pop-Up',
      specialty: 'Pop-Up Goals',
      description:
        'The original 1994 patented steel-wire pop-up goal system, revolutionizing portable training equipment. Pugg goals remain the gold standard for professional coaches worldwide, offering unmatched portability and durability for training sessions and skill development.',
      color: 'from-[#F9D923] to-[#1A1A1A]',
      achievements: [
        'Original 1994 pop-up goal patent holder',
        'Professional coaching essential worldwide',
        'Portable training revolution pioneer',
        'Steel-wire construction durability leader',
        'Quick-setup training solution standard',
      ],
      image: '/pugg.png',
      slug: 'pugg',
      icon: 'Package',
      products: [
        {
          name: 'Pop-Up Goals',
          description: 'Original portable training goals for football and futsal',
        },
        { name: 'Training Sets', description: 'Complete goal systems with carry bags' },
        { name: 'Replacement Parts', description: 'Spare nets, pegs & maintenance components' },
      ],
    },
    {
      name: 'Aero',
      category: 'Cricket',
      heritage: 'Late 1990s, New Zealand',
      specialty: 'Protective Gear',
      tagline: 'Safety First',
      description:
        "New Zealand cricket safety specialists delivering cutting-edge protective technology since the late 1990s. Aero's impact-tested pads withstand 100+ mph deliveries, providing uncompromising protection trusted by professional cricketers worldwide.",
      color: 'from-[#00C853] to-[#1A1A1A]',
      achievements: [
        '100+ mph impact certification',
        'Professional player safety standard',
        'New Zealand engineering excellence',
        'Cricket protection innovation leader',
        'Trusted by international cricketers',
      ],
      image: '/placeholder.svg',
      slug: 'aero',
      icon: 'Award',
      products: [
        {
          name: 'Protective Pads',
          description: 'High-impact cricket batting and wicket-keeping pads',
        },
        { name: 'Thigh Guards', description: 'Lightweight impact-resistant thigh protection' },
        { name: 'Arm Guards', description: 'Flexible forearm and elbow protection systems' },
      ],
    },
    {
      name: 'Leverage',
      category: 'Cricket',
      heritage: 'Cricket Tech Pioneer',
      specialty: 'Bowling Machines',
      tagline: 'Practice Perfection',
      description:
        'Revolutionary bowling machine technology delivering swing, spin, and pace up to 160 km/h. Leverage transforms cricket training with affordable, advanced machines that provide consistent delivery for players and coaches seeking performance excellence.',
      color: 'from-[#FF6F00] to-[#1A1A1A]',
      achievements: [
        'Training technology revolution',
        '160 km/h delivery capability',
        'Swing, spin, and pace mastery',
        'Affordable advanced cricket training',
        'Professional coach preferred choice',
      ],
      image: '/leverage.png',
      slug: 'leverage',
      icon: 'TrendingUp',
      products: [
        {
          name: 'Bowling Machines',
          description: 'Advanced swing, spin, and pace delivery systems',
        },
        {
          name: 'Machine Accessories',
          description: 'Ball feeders, remote controls & maintenance kits',
        },
        { name: 'Training Balls', description: 'Specialized machine-compatible practice balls' },
      ],
    },
    {
      name: 'Ashaway',
      category: 'Badminton & Squash',
      heritage: 'Founded 1824, USA',
      specialty: 'Badminton & Squash',
      tagline: 'String Excellence',
      description:
        "American string craftsmanship since 1824, delivering performance strings for badminton, squash, and tennis. Ashaway's precision-engineered strings provide the perfect balance of power, control, and durability for competitive players worldwide.",
      color: 'from-[#C62828] to-[#1A1A1A]',
      achievements: [
        'String innovation since 1824',
        'Made in USA quality craftsmanship',
        'Global competitive player choice',
        'Precision-engineered performance strings',
        'Multi-sport string expertise',
      ],
      image: '/ashaway.jpeg',
      slug: 'ashaway',
      icon: 'Star',
      products: [
        {
          name: 'Badminton Strings',
          description: 'High-performance competitive badminton strings',
        },
        { name: 'Squash Strings', description: 'Precision squash strings for power and control' },
        {
          name: 'Tennis Strings',
          description: 'Professional tennis strings for all playing styles',
        },
        {
          name: 'String Accessories',
          description: 'Stringing tools, grips & maintenance equipment',
        },
      ],
    },
    {
      name: 'Fusion',
      category: 'Multi-Sport Training',
      heritage: 'Multi-Sport Focus',
      specialty: 'Training Equipment',
      tagline: 'Train Like a Pro',
      description:
        'Comprehensive multi-sport training solutions built for durability and performance. Fusion delivers coach-approved equipment across multiple disciplines, providing athletes with versatile training tools that enhance skills and maximize potential.',
      color: 'from-[#7B1FA2] to-[#1A1A1A]',
      achievements: [
        'Multi-sport training expertise',
        'Coach-approved equipment standards',
        'Durable performance construction',
        'Versatile training solutions',
        'Athlete development focused',
      ],
      image: '/fusion.jpg',
      slug: 'fusion',
      icon: 'Globe',
      products: [
        { name: 'Training Equipment', description: 'Multi-sport training gear and accessories' },
        {
          name: 'Agility Tools',
          description: 'Cones, ladders, hurdles & speed training equipment',
        },
        {
          name: 'Strength Training',
          description: 'Resistance bands, weights & functional training tools',
        },
        { name: 'Team Accessories', description: 'Equipment bags, storage solutions & team gear' },
      ],
    },
  ],
  stats: [
    { number: '30', label: 'Years of Excellence', color: '#3B82F6' },
    { number: '75+', label: 'Years Parent Company Heritage', color: '#FF6B35' },
    { number: '1000+', label: 'Schools & Clubs Served', color: '#F39C12' },
    { number: '#1', label: 'Sports Distributor in Sri Lanka', color: '#00B894' },
  ],
  whatsapp: {
    number: '94772350712',
    message: "Hello Ralhum Sports! I'm interested in your sports equipment. Please contact me.",
    reportMessage: 'Hello! I need to report a product verification issue. SKU: ',
  },
}

export type SiteConfig = typeof SITE_CONFIG
