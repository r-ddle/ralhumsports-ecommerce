export const SITE_CONFIG = {
  legal: {
    privacyPolicy: {
      lastUpdated: 'January 15, 2025',
      sections: [
        // ...existing sections...
        {
          id: 'rights',
          title: 'Your Privacy Rights',
          description: 'Your rights regarding your personal information',
          rights: [
            {
              heading: 'Right to Access',
              description:
                'Request a copy of all personal data we hold about you, including processing purposes and retention periods.',
            },
            {
              heading: 'Right to Rectification',
              description:
                'Correct any inaccurate or incomplete personal information we have about you.',
            },
            {
              heading: 'Right to Erasure',
              description:
                'Request deletion of your personal data when it’s no longer necessary for the original purpose.',
            },
            {
              heading: 'Right to Data Portability',
              description:
                'Receive your personal data in a structured, machine-readable format for transfer to another service.',
            },
            {
              heading: 'Right to Object',
              description:
                'Object to processing of your personal data for direct marketing or legitimate interests.',
            },
            {
              heading: 'Right to Restrict Processing',
              description:
                'Limit how we use your personal data while we verify its accuracy or address your objections.',
            },
            {
              heading: 'Right to Withdraw Consent',
              description:
                'Withdraw your consent for marketing communications or other consent-based processing at any time.',
            },
            {
              heading: 'Right to Complain',
              description:
                'Lodge a complaint with the Sri Lankan data protection authority if you believe we’ve mishandled your data.',
            },
          ],
          exercise:
            'Contact us at sales@ralhumsports.lk with your request. We will respond within 30 days and may require identity verification for security purposes.',
        },
        {
          id: 'cookies',
          title: 'Cookies and Tracking',
          description: 'How we use cookies and similar technologies',
          cookies: [
            {
              heading: 'Essential Cookies',
              description: 'Always Active - Cannot be Disabled',
              items: [
                'Authentication and session management',
                'Shopping cart functionality and checkout process',
                'Security features and fraud prevention',
                'Website accessibility and user preferences',
                'Load balancing and performance optimization',
              ],
            },
            {
              heading: 'Analytics Cookies',
              description:
                'Help us understand how visitors use our website to improve functionality.',
              items: [
                'Google Analytics (anonymized)',
                'Page performance monitoring',
                'User behavior analysis',
              ],
            },
            {
              heading: 'Marketing and Advertising Cookies',
              description:
                'Used to show relevant advertisements and measure campaign effectiveness.',
              items: [
                'Facebook Pixel',
                'Google Ads conversion tracking',
                'Retargeting and remarketing',
              ],
            },
            {
              heading: 'Personalization Cookies',
              description: 'Remember your preferences and provide personalized experiences.',
              items: [
                'Product recommendations',
                'Recently viewed items',
                'Language and region preferences',
              ],
            },
          ],
          manage:
            'You can manage your cookie preferences through our cookie banner when you first visit our site, or by adjusting your browser settings. Note that disabling certain cookies may affect website functionality.',
        },
        {
          id: 'sharing',
          title: 'Data Sharing and Third Parties',
          description: 'When and how we share your information',
          sharing: [
            {
              heading: 'We DO NOT sell your personal data.',
              description:
                'We never sell, rent, or trade your personal information to third parties for their marketing purposes.',
            },
            {
              heading: 'Service Providers',
              description: 'Trusted partners who help us operate our business',
              items: [
                'Payment processors (secure transaction handling)',
                'Shipping and logistics companies (order delivery)',
                'Email service providers (communications)',
                'Cloud hosting providers (secure data storage)',
                'Analytics providers (website improvement)',
              ],
            },
            {
              heading: 'Legal Requirements',
              description: 'We may share data when legally required',
              items: [
                'Court orders and legal proceedings',
                'Government investigations and regulatory requests',
                'Tax authorities and financial crime prevention',
                'Consumer protection enforcement',
              ],
            },
            {
              heading: 'Business Transfers',
              description:
                'In the event of a merger, acquisition, or sale of assets, your data may be transferred to the new entity under the same privacy protections.',
            },
          ],
          standards: [
            'All third parties must sign data processing agreements',
            'Partners must meet our security and privacy standards',
            'Regular audits of third-party data handling practices',
            'Immediate breach notification requirements',
          ],
        },
        {
          id: 'international',
          title: 'International Data Transfers',
          description: 'How we handle cross-border data transfers',
          safeguards: [
            'Standard contractual clauses approved by data protection authorities',
            'Adequacy decisions for countries with equivalent protection levels',
            'Binding corporate rules for multinational service providers',
            'Regular monitoring of international data protection developments',
          ],
          locations:
            'Sri Lanka (primary), Singapore (backup and analytics), and European Union (some cloud services with adequacy decisions).',
        },
        {
          id: 'contact',
          title: 'Privacy Questions or Concerns?',
          description: 'Contact our Data Protection Officer for privacy matters',
          officer: {
            name: 'Data Protection Officer',
            email: 'sales@ralhumsports.lk',
            phone: '+94114388826/5',
            address: '34A, Shruberry Garden, Colombo 04, Sri Lanka',
            responseTimes: [
              'Privacy rights requests: Within 30 days',
              'General privacy questions: Within 48 hours',
              'Data breach concerns: Within 24 hours',
              'Mon-Sat: 9AM-6PM',
            ],
          },
          note: 'For privacy-related inquiries, please include "Privacy Request" in your email subject line for faster processing. You may also have the right to lodge a complaint with the Sri Lankan data protection authority.',
        },
      ],
    },
    returnPolicy: {
      lastUpdated: 'January 15, 2025',
      sections: [
        // ...existing sections...
        {
          id: 'eligible',
          title: 'Eligible for Return',
          description: 'Products that can be returned or exchanged',
          categories: [
            {
              heading: 'Sports Equipment',
              items: [
                'Unopened and unused bats, rackets, and sticks',
                'Protective gear with original tags',
                'Sports balls in original packaging',
                'Training equipment and accessories',
              ],
            },
            {
              heading: 'Apparel & Footwear',
              items: [
                'Unworn clothing with original tags',
                'Shoes without wear on soles',
                'Accessories and gear bags',
              ],
            },
            {
              heading: 'Special Circumstances',
              items: [
                'Defective Products: Manufacturing defects covered regardless of use',
                'Wrong Item Sent: Returns accepted with no conditions when we send incorrect items',
                'Shipping Damage: Items damaged during transit are fully returnable',
              ],
            },
          ],
        },
        {
          id: 'not-eligible',
          title: 'Not Eligible for Return',
          description: 'Products that cannot be returned for hygiene and safety reasons',
          items: [
            'Hygiene Products: Mouthguards, protective cups, and personal protective equipment that comes into direct contact with the body',
            'Used Equipment: Any sports equipment showing signs of use, wear, or damage',
            'Personalized Items: Custom-embroidered, engraved, or personalized products',
            'Final Sale Items: Products marked as clearance, closeout, or final sale',
            'Incomplete Returns: Items missing components, accessories, or original packaging',
            'Expired Returns: Items returned after the 30-day return window',
          ],
        },
        {
          id: 'process',
          title: 'Return Process',
          description: 'Step-by-step guide to returning your items',
          steps: [
            'Contact Us: Call +94114388826/5 or email sales@ralhumsports.lk within 30 days of delivery',
            'Get Return Authorization: Receive your Return Merchandise Authorization (RMA) number and detailed return instructions',
            'Package & Send: Securely package the item with RMA number and ship to our returns center',
            'Processing & Refund: We inspect the item and process your refund within 5-7 business days',
          ],
          guidelines: [
            'Return Authorization Required: All returns must have an RMA number',
            'Original Packaging: Use original box/packaging when possible',
            'Tracking Recommended: Use a trackable shipping method for your protection',
            'Return Address: Ship only to the address provided with your RMA',
            'Inspection Process: All items are inspected upon receipt',
          ],
        },
        {
          id: 'exchanges',
          title: 'Exchanges',
          description: 'Exchange for different size, color, or model',
          options: [
            'Size Exchanges: Same product in different size (subject to availability)',
            'Color Exchanges: Same product in different color (subject to availability)',
            'Model Exchanges: Different model within same product category',
          ],
          process: [
            'Contact us to discuss exchange options and availability',
            'Reserve your preferred replacement item',
            'Return original item with exchange RMA number',
            'Replacement item ships once we receive and approve original item',
          ],
          fees: [
            'Same Price: No additional charge for equal-value exchanges',
            'Higher Price: Pay difference between original and new item',
            'Lower Price: Receive refund for price difference',
            'Shipping: Customer pays return shipping; we cover shipping for replacement',
          ],
        },
        {
          id: 'refunds',
          title: 'Refunds and Processing',
          description: 'How and when you’ll receive your refund',
          methods: [
            'Original Payment Method: Refunds are processed to the original payment method used for purchase',
            'Bank Transfer: For cash purchases or if original method is unavailable',
            'Store Credit: Optional faster processing as account credit for future purchases',
          ],
          timeframes: [
            'Inspection & Approval: 1-2 business days for initial inspection, 2-3 business days for quality assessment, approval notification same day',
            'Refund Processing: Credit/Debit cards: 3-5 business days, Bank transfers: 5-7 business days, Store credit: Immediate',
          ],
          amounts: [
            'Full Purchase Price: For eligible returns in perfect condition',
            'Original Shipping: Refunded only if return is due to our error',
            'Return Shipping: Customer responsibility (except for our errors)',
            'Taxes: Refunded in accordance with Sri Lankan tax regulations',
          ],
        },
        {
          id: 'shipping',
          title: 'Return Shipping',
          description: 'Shipping costs and responsibilities',
          responsibilities: [
            'Customer Pays Return Shipping: Change of mind returns, Size or color exchanges, Product not suitable for intended use',
            'We Pay Return Shipping: Manufacturing defects, Wrong item sent by us, Items damaged during shipping',
          ],
          address: 'Ralhum Sports Returns Center, 34A, Shruberry Garden, Colombo 04, Sri Lanka',
          recommendations: [
            'Use a trackable shipping method for your protection',
            'Purchase shipping insurance for high-value items',
            'Keep shipping receipts until refund is processed',
            'Package items securely to prevent damage during transit',
            'Include RMA number both inside and outside the package',
          ],
        },
        {
          id: 'warranty',
          title: 'Warranty and Defects',
          description: 'Protection beyond our return policy',
          warranties: [
            'Brand Warranties: All products carry manufacturer warranties as specified by each brand (Gray-Nicolls, Gilbert, Grays, etc.)',
            'Warranty Claims: We facilitate warranty claims with manufacturers on your behalf',
            'Extended Coverage: Warranty periods typically extend beyond our 30-day return window',
          ],
          defectProcess: [
            'Contact us immediately, even if beyond 30-day return window',
            'Provide photos and description of the defect',
            'We’ll determine if it’s covered under warranty or our return policy',
            'Expedited replacement or full refund provided for confirmed defects',
            'All shipping costs covered by us for defective items',
          ],
          guarantee:
            'Beyond manufacturer warranties, we stand behind the quality of every product we sell. If you experience quality issues that aren’t covered by the manufacturer, contact us to discuss resolution options.',
        },
        {
          id: 'contact',
          title: 'Need Help with Returns?',
          description: 'Our customer service team is here to assist you',
          department: {
            name: 'Returns Department',
            phone: '+94114388826/5',
            email: 'sales@ralhumsports.lk',
            supportHours: 'Mon-Sat: 9AM-6PM',
            notes: ['Returns processing: Monday-Friday', 'Average response time: Within 4 hours'],
          },
          note: 'For return inquiries, please include your order number and reason for return. This helps us process your request faster and provide the best possible service.',
        },
      ],
    },
    termsConditions: {
      lastUpdated: 'January 15, 2025',
      sections: [
        // ...existing sections...
        {
          id: 'user-responsibilities',
          title: 'User Responsibilities',
          description: 'Your obligations when using our services',
          account: [
            'Provide accurate, current, and complete information during registration and checkout',
            'Maintain the confidentiality of your account credentials and password',
            'Notify us immediately of any unauthorized access or security breach',
            'You are responsible for all activities that occur under your account',
          ],
          legal: [
            'Use our services only for lawful purposes and in compliance with all applicable laws',
            'Respect intellectual property rights of Ralhum Sports and third parties',
            'Comply with all Sri Lankan laws and regulations',
          ],
          product: [
            'Use products according to manufacturer specifications and safety guidelines',
            'Ensure products are suitable for intended use and user skill level',
          ],
        },
        {
          id: 'prohibited',
          title: 'Prohibited Activities',
          description: 'Activities that are strictly forbidden',
          items: [
            'Unauthorized commercial resale or distribution of our products',
            'Using automated systems, bots, or scrapers to access our website',
            'Attempting to gain unauthorized access to our systems or databases',
            'Posting false, misleading, or defamatory product reviews',
            'Engaging in fraudulent activities or payment disputes without valid reason',
            'Distributing malware, viruses, or any harmful code through our platform',
            'Harassment, abuse, or inappropriate conduct toward our staff or other users',
          ],
          note: 'Violation of these prohibited activities may result in immediate account suspension, order cancellation, and potential legal action.',
        },
        {
          id: 'orders',
          title: 'Orders and Purchase Process',
          description: 'How orders are processed and fulfilled',
          placement: [
            'Orders are considered offers to purchase and are subject to our acceptance',
            'We reserve the right to refuse or cancel any order for any reason',
            'Order confirmation does not guarantee product availability',
            'All orders are subject to verification and fraud prevention checks',
          ],
          product: [
            'We strive to provide accurate product descriptions and images',
            'Colors may vary due to monitor display differences',
            'Product specifications are based on manufacturer information',
            'We are not responsible for manufacturer specification changes',
          ],
        },
        {
          id: 'payment',
          title: 'Payment Terms',
          description: 'Payment methods and processing terms',
          methods: [
            'All prices are displayed in Sri Lankan Rupees (LKR)',
            'We accept cash on delivery, bank transfers, and approved payment cards',
            'Payment is required in full before order processing',
            'All transactions are processed through secure payment gateways',
            'We do not store payment card information on our servers',
          ],
          pricing: [
            'All prices include applicable taxes and duties unless stated otherwise',
            'Prices are subject to change without notice',
            'Promotional prices are valid only for specified periods',
            'Bulk order discounts available for educational institutions and sports clubs',
            'Currency conversion rates for international orders may fluctuate',
          ],
          issues: [
            'Failed payments may result in automatic order cancellation',
            'Payment disputes must be raised within 14 days of transaction',
            'Chargebacks without prior communication may result in account suspension',
            'Fraudulent payment attempts will be reported to authorities',
          ],
        },
        {
          id: 'shipping',
          title: 'Shipping and Delivery',
          description: 'Delivery terms, timeframes, and responsibilities',
          delivery: [
            'Standard delivery within Colombo: 1-2 business days',
            'Island-wide delivery: 3-7 business days depending on location',
            'Free delivery for orders above LKR 50000',
            'Standard shipping fee: LKR 1000',
            'Express delivery options available for additional charges',
          ],
          responsibilities: [
            'Accurate delivery address must be provided by customer',
            'Customer or authorized person must be available to receive delivery',
            'Failed delivery attempts may incur additional charges',
            'Risk of loss passes to customer upon delivery',
            'Delivery delays due to force majeure events are not our responsibility',
          ],
          international: [
            'International shipping available on request',
            'Customer responsible for customs duties and import taxes',
            'International delivery times vary by destination',
            'Some products may be restricted for international shipping',
          ],
        },
        {
          id: 'warranty',
          title: 'Warranty and Liability',
          description: 'Product warranties and limitation of liability',
          warranties: [
            'All products carry manufacturer warranties as specified by each brand',
            'Warranty terms vary by product and manufacturer',
            'We facilitate warranty claims but are not the warranty provider',
            'Warranty coverage excludes normal wear and tear, misuse, or accidents',
            'Original purchase receipt required for all warranty claims',
          ],
          limitation: [
            'Our total liability is limited to the purchase price of the product',
            'We are not liable for indirect, incidental, or consequential damages',
            'We do not assume liability for product fitness for specific purposes',
            'Customer assumes all risk for product selection and use',
            'Sports activities carry inherent risks that we cannot eliminate',
          ],
          service: [
            'Website availability and service uptime not guaranteed',
            'We reserve the right to modify or discontinue services',
            'Technical issues or force majeure events may affect service delivery',
            'Information accuracy on website not guaranteed, subject to verification',
          ],
        },
        {
          id: 'dispute',
          title: 'Dispute Resolution',
          description: 'Process for resolving conflicts and disagreements',
          process: [
            'Direct Communication: Contact our customer service team at sales@ralhumsports.lk or +94114388826/5',
            'Formal Complaint: Submit written complaint with order details and supporting documentation',
            'Mediation: Independent mediation through agreed neutral third party if required',
            'Legal Action: Legal proceedings in Sri Lankan courts as final resort',
          ],
        },
        {
          id: 'law',
          title: 'Governing Law and Jurisdiction',
          description: 'Legal framework and court jurisdiction',
          jurisdiction: [
            'These Terms are governed by the laws of the Democratic Socialist Republic of Sri Lanka',
            'Any legal proceedings shall be subject to the exclusive jurisdiction of Sri Lankan courts',
            'Courts of Colombo shall have primary jurisdiction for all disputes',
            'Sri Lankan Consumer Protection Act and other applicable laws shall apply',
          ],
          enforcement: [
            'If any provision is deemed invalid, the remaining terms remain enforceable',
            'These Terms constitute the entire agreement between parties',
            'Modifications require written agreement from both parties',
            'Waiver of any right does not constitute waiver of future rights',
          ],
        },
        {
          id: 'modifications',
          title: 'Terms Modifications',
          description: 'How we update and modify these terms',
          rights: [
            'We reserve the right to modify these Terms at any time without prior notice',
            'Updates will be posted on this page with a revised "Last Updated" date',
            'Material changes may be communicated via email to registered customers',
            'Continued use of our services constitutes acceptance of modified Terms',
          ],
          responsibility:
            'It is your responsibility to review these Terms periodically. If you do not agree with any modifications, you must immediately discontinue use of our services.',
          effective: [
            'All modifications become effective immediately upon posting',
            'Previous versions of Terms are superseded by current version',
            'Orders placed before modifications are governed by previous Terms',
          ],
        },
        {
          id: 'contact',
          title: 'Questions About These Terms?',
          description: 'Contact us for clarification or legal assistance',
          service: {
            name: 'Customer Service',
            phone: '+94114388826/5',
            email: 'sales@ralhumsports.lk',
            businessHours: 'Mon-Sat: 9AM-6PM',
            notes: ['Response time: Within 24 hours'],
          },
          note: 'For legal matters specifically related to these Terms and Conditions, please email us with "Legal Inquiry" in the subject line for priority handling.',
        },
      ],
    },
  },
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
    email: 'sales@ralhum.com',
    whatsapp: '+94772350712',
    whatsappUrl: 'https://wa.me/94772350712',
    supportHours: 'Mon-Sat: 9AM-6PM',
    address: {
      street: '34A, Shruberry Garden',
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
