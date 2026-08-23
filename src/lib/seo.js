/** Central SEO config for Sevadoot — used in metadata, JSON-LD, sitemap, and on-page copy */

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://sevadoot.com';

export const SITE_NAME = 'Sevadoot';
export const SITE_LEGAL_NAME = 'SEVADOOT PREMIUM SERVICES';
export const SITE_TAGLINE = 'Trusted Home Service Marketplace';

export const DEFAULT_OG_IMAGE = '/image/sevadoot.png';

/** Target ranking phrases — also used for branded search sitelinks structure */
export const SEO_KEYWORD_PHRASES = [
  {
    id: 'home-service-booking-app',
    phrase: 'home service booking app',
    title: 'Home Service Booking App',
    shortDescription:
      'Book verified home professionals in seconds with Sevadoot — India’s trusted home service booking app for daily and premium needs.',
    href: '/',
    anchor: 'home-service-booking',
  },
  {
    id: 'mehndi-artist-booking',
    phrase: 'mehndi artist booking',
    title: 'Mehndi Artist Booking',
    shortDescription:
      'Browse bridal, Arabic, and party mehndi designs. Easy mehndi artist booking with transparent pricing and skilled artists at your doorstep.',
    href: '/pages/Mehndi',
    anchor: 'mehndi-artist-booking',
  },
  {
    id: 'elder-care-companion',
    phrase: 'elder care companion service',
    title: 'Elder Care Companion Service',
    shortDescription:
      'Reliable elder care companion service for seniors at home — assistance, companionship, and peace of mind for your family.',
    href: '/pages/Attendant?categoryId=Attendant',
    anchor: 'elder-care-companion',
  },
  {
    id: 'senior-citizen-assistance',
    phrase: 'senior citizen assistance',
    title: 'Senior Citizen Assistance',
    shortDescription:
      'Dedicated senior citizen assistance for mobility, daily routines, and comfort — book trained companions through Sevadoot.',
    href: '/pages/Attendant?categoryId=Attendant',
    anchor: 'senior-citizen-assistance',
  },
  {
    id: 'hospital-visit-helper',
    phrase: 'hospital visit helper',
    title: 'Hospital Visit Helper',
    shortDescription:
      'Need a hospital visit helper? Book nurses and attendants for appointments, recovery support, and patient care at home or clinic.',
    href: '/pages/nurse?categoryId=Nurse',
    anchor: 'hospital-visit-helper',
  },
  {
    id: 'local-service-app',
    phrase: 'local service app',
    title: 'Local Service App',
    shortDescription:
      'Sevadoot is your local service app for Noida & nearby cities — discover, compare, and book trusted providers near you.',
    href: '/pages/SearchScreen',
    anchor: 'local-service-app',
  },
  {
    id: 'home-service-marketplace',
    phrase: 'home service marketplace',
    title: 'Home Service Marketplace',
    shortDescription:
      'One home service marketplace for mehndi, elder care, nursing, salon, groceries, pandit booking, and 15+ categories.',
    href: '/#services',
    anchor: 'home-service-marketplace',
  },
  {
    id: 'trusted-service-provider-app',
    phrase: 'trusted service provider app',
    title: 'Trusted Service Provider App',
    shortDescription:
      'Every booking on our trusted service provider app goes through verified professionals, secure payments, and 24/7 support.',
    href: '/#why-sevadoot',
    anchor: 'trusted-service-provider-app',
  },
];

export const SEO_KEYWORDS = [
  'sevadoot',
  'sevadoot app',
  'sevadoot.com',
  ...SEO_KEYWORD_PHRASES.map((k) => k.phrase),
  'home services India',
  'book attendant online',
  'mehndi artist near me',
  'elder care at home',
  'nurse booking app',
  'Noida home services',
];

export const DEFAULT_DESCRIPTION =
  'Sevadoot is India’s home service booking app and trusted service provider app. Book mehndi artist booking, elder care companion service, senior citizen assistance, hospital visit helper, and more on one local service app and home service marketplace.';

export const DEFAULT_TITLE =
  'Sevadoot | Home Service Booking App – Mehndi, Elder Care & Hospital Helper';

export function absoluteUrl(path = '/') {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${p}`;
}

export function buildWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    alternateName: ['Sevadoot Premium Services', 'sevadoot.com', SITE_LEGAL_NAME],
    description: DEFAULT_DESCRIPTION,
    inLanguage: 'en-IN',
    publisher: { '@id': `${SITE_URL}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/pages/SearchScreen?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_LEGAL_NAME,
    alternateName: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl(DEFAULT_OG_IMAGE),
    description: DEFAULT_DESCRIPTION,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-9879790705',
      contactType: 'customer support',
      areaServed: 'IN',
      availableLanguage: ['English', 'Hindi'],
    },
    sameAs: [
      'https://play.google.com/store/apps/details?id=com.marasappnew&hl=en_IN',
    ],
  };
}

export function buildMobileApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'MobileApplication',
    name: SITE_NAME,
    operatingSystem: 'Android',
    applicationCategory: 'LifestyleApplication',
    description: DEFAULT_DESCRIPTION,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
    url: 'https://play.google.com/store/apps/details?id=com.marasappnew&hl=en_IN',
  };
}

/** Sitelinks-style navigation for branded "sevadoot" searches */
export function buildSiteNavigationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${SITE_NAME} — Popular Services`,
    description:
      'Top services on Sevadoot: home service booking, mehndi artist, elder care, senior assistance, hospital helper, and more.',
    itemListElement: SEO_KEYWORD_PHRASES.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.title,
      description: item.shortDescription,
      url: absoluteUrl(item.href),
    })),
  };
}

export function buildFaqSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: SEO_KEYWORD_PHRASES.map((item) => ({
      '@type': 'Question',
      name: `What is Sevadoot ${item.title}?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.shortDescription,
      },
    })),
  };
}

export function buildServiceGraphSchema() {
  return SEO_KEYWORD_PHRASES.map((item) => ({
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: item.title,
    description: item.shortDescription,
    provider: { '@id': `${SITE_URL}/#organization` },
    areaServed: { '@type': 'Country', name: 'India' },
    url: absoluteUrl(item.href),
    serviceType: item.phrase,
  }));
}

export function getGlobalStructuredDataGraph() {
  return [
    buildWebSiteSchema(),
    buildOrganizationSchema(),
    buildMobileApplicationSchema(),
    buildSiteNavigationSchema(),
    buildFaqSchema(),
    ...buildServiceGraphSchema(),
  ];
}

export const STATIC_SITEMAP_ROUTES = [
  '/',
  '/about',
  '/blog',
  '/contact',
  '/privacy-policy',
  '/terms',
  '/pages/Mehndi',
  '/pages/Attendant',
  '/pages/nurse',
  '/pages/SearchScreen',
  '/pages/Pandit',
  '/pages/petwalker',
  '/pages/GuardianKids',
  '/pages/Salon',
  '/pages/Groceries',
  '/pages/tiffinservice',
  '/pages/physiotherapist',
  '/pages/Gym',
  '/pages/Hotel',
  '/pages/School',
  '/pages/ecommerce',
  '/pages/fashion',
  '/pages/Luxury',
  '/pages/Cosmetic',
  '/pages/ladies',
  '/pages/dealday',
  '/pages/collaboration',
  '/pages/investors',
  '/pages/partner',
  '/pages/career',
];
