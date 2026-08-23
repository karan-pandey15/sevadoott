export const HOSPITALITY_IMAGE = '/image/categoryimg/hospitality-hotel.png';
export const AVIATION_IMAGE = '/image/categoryimg/aviation-travel.png';

export const HOSPITALITY_CATEGORY = {
  id: 'hospitality',
  name: 'Hospitality',
  heading: 'Hotel Human Resources',
  description:
    'Hire verified hotel staff for service, food & beverages, housekeeping, and front desk.',
  image: HOSPITALITY_IMAGE,
  screen: '/pages/HospitalityAviation',
  params: { categoryId: 'hospitality' },
};

export const AVIATION_CATEGORY = {
  id: 'aviation',
  name: 'Aviation Services',
  heading: 'Airport & Travel Human Resources',
  description:
    'Book aviation staff, ground crew, flight attendants, and travel professionals.',
  image: AVIATION_IMAGE,
  screen: '/pages/HospitalityAviation',
  params: { categoryId: 'aviation' },
};

export const HOSPITALITY_ROLES = [
  {
    id: 'hotel-staff',
    name: 'Hotel Staff',
    detail: 'Service · Food & Beverages · Housekeeping · Front desk',
    image: HOSPITALITY_IMAGE,
    group: 'hospitality',
  },
  {
    id: 'hotel-service',
    name: 'Hotel Service Staff',
    detail: 'Guest service and floor support',
    image: HOSPITALITY_IMAGE,
    group: 'hospitality',
  },
  {
    id: 'hotel-fnb',
    name: 'Food & Beverages Staff',
    detail: 'Restaurant, banquet, and room service',
    image: HOSPITALITY_IMAGE,
    group: 'hospitality',
  },
  {
    id: 'hotel-housekeeping',
    name: 'Housekeeping Staff',
    detail: 'Room cleaning and laundry support',
    image: HOSPITALITY_IMAGE,
    group: 'hospitality',
  },
  {
    id: 'hotel-frontdesk',
    name: 'Front Desk Staff',
    detail: 'Check-in, guest handling, and reception',
    image: HOSPITALITY_IMAGE,
    group: 'hospitality',
  },
];

export const AVIATION_ROLES = [
  {
    id: 'aviation-staff',
    name: 'Aviation Staff',
    detail: 'Airport and airline operations support',
    image: AVIATION_IMAGE,
    group: 'aviation',
  },
  {
    id: 'airport-ground',
    name: 'Airport Ground Staff',
    detail: 'Check-in, baggage, and ramp coordination',
    image: AVIATION_IMAGE,
    group: 'aviation',
  },
  {
    id: 'flight-attendant',
    name: 'Flight Attendant',
    detail: 'Cabin crew for domestic and international flights',
    image: AVIATION_IMAGE,
    group: 'aviation',
  },
  {
    id: 'tour-operator',
    name: 'Tour Operator',
    detail: 'Plan and run complete tour packages',
    image: AVIATION_IMAGE,
    group: 'aviation',
  },
  {
    id: 'tour-manager',
    name: 'Tour Manager',
    detail: 'On-trip coordination for groups and guests',
    image: AVIATION_IMAGE,
    group: 'aviation',
  },
  {
    id: 'travel-agent',
    name: 'Travel Agent',
    detail: 'Tickets, hotels, and itinerary booking',
    image: AVIATION_IMAGE,
    group: 'aviation',
  },
];
