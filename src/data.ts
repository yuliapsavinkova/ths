import { FaqItem, MonthAvailability, Testimonial, ShowcaseItem } from './types';

export const REVIEWS_LINK = {
  text: 'All TrustedHousesitters Reviews →',
  url: 'https://www.trustedhousesitters.com/house-and-pet-sitters/united-states/california/san-francisco/l/6526245/',
};

export const SPECIALIZED_CARE_OPTIONS = {
  highEnergy: {
    id: 'highEnergy',
    label: 'High-Energy or Reactive Dogs',
    description: 'Separation anxiety care, reactive dog management, & long walks.',
  },
  medications: {
    id: 'medications',
    label: 'Specialized Medical Needs',
    description: 'Complex medication adherence, mobility assistance, vet appointments.',
  },
  garden: {
    id: 'garden',
    label: 'Garden Management Surcharge',
    description: 'Watering routines, sensitive plant care & lawn maintenance.',
  },
} as const;

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    quote:
      "Having someone there full-time was completely different from any sitter we'd had before. She was truly there for our pets. Worth every penny.",
    author: 'James',
    location: 'Carlsbad, CA',
    dates: 'June 2025 (4 Weeks)',
    petNames: 'Max (Golden Retriever)',
    core: true,
    petImages: [
      'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=120&h=120',
    ],
  },
  {
    id: 't2',
    quote:
      'We were nervous about leaving our dogs for three weeks, but everything was perfect. Frequent photos, zero stress. We returned to happy pets and a clean home.',
    author: 'Mia & Tom',
    location: 'San Diego, CA',
    dates: 'September 2025 (3 Weeks)',
    petNames: 'Luna & Rocky (Huskies)',
    core: true,
    petImages: [
      'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=120&h=120',
      'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=120&h=120',
      'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=120&h=120',
    ],
  },
  {
    id: 't3',
    quote:
      "Yulia was a game changer. She managed Barnaby's medication routine perfectly, sent frequent photos, and we returned to a clean house and a relaxed pug.",
    author: 'Elena & David',
    location: 'Santa Monica, CA',
    dates: 'October 2025 (4 Weeks)',
    petNames: 'Barnaby (Pug)',
    petImages: [
      'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=120&h=120',
    ],
  },
  {
    id: 't4',
    quote:
      'Our dog needs medication twice a day and is shy with strangers. Yulia was the best sitter we have ever had.',
    author: 'Sarah',
    location: 'Santa Barbara, CA',
    dates: 'December 2025 (5 Weeks)',
    petNames: 'Jackson (Terrier)',
    petImages: [
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=120&h=120',
    ],
  },
  {
    id: 't5',
    quote:
      'Yulia is a star. She watched our high-energy Border Collie. Her frequent updates and photos gave us complete peace of mind while we were abroad.',
    author: 'Marcus',
    location: 'San Francisco, CA',
    dates: 'February 2026 (5 Weeks)',
    petNames: 'Ziggy (Border Collie)',
    core: true,
    petImages: [
      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=120&h=120',
    ],
  },
  {
    id: 't6',
    quote:
      "We've had several sitters, but Yulia is by far the most professional. She cared for our Siamese cats and left the house in pristine condition.",
    author: 'Catherine',
    location: 'Santa Cruz, CA',
    dates: 'May 2026 (4 Weeks)',
    petNames: 'Silo & Suki (Siamese Cats)',
    petImages: [
      'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&q=80&w=120&h=120',
      'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&q=80&w=120&h=120',
    ],
  },
];

export const FAQS: FaqItem[] = [
  {
    id: 'faq1',
    question: 'Where do you sit?',
    answer:
      'While I am based in California, I am open to sitting anywhere for selected opportunities! For monthly or longer sits, distance is not a barrier.',
  },
  {
    id: 'faq2',
    question: 'Do you sit in any home?',
    answer:
      "Since I stay in your home full-time during your trip, its condition matters — not just for comfort, but for my ability to work remotely. I expect a clean, tidy space, working essentials (reliable Wi-Fi, hot water, and heating/cooling where appropriate), and a home that's in good working order. I treat your home with care and expect the same standard in return.",
  },
  {
    id: 'faq3',
    question: 'Why live in full time instead of drop-in visits?',
    answer:
      "Routine and presence. Staying in the home keeps your pets' schedule consistent and avoids the stress that comes from long gaps alone.",
  },
  {
    id: 'faq4',
    question: 'How do we confirm a booking?',
    answer: 'We schedule a video call, agree on expectations, and confirm with an agreement.',
  },
  {
    id: 'faq5',
    question: 'Do you have references or background checks?',
    answer: 'Yes. References and background verification are available upon request.',
    linkText: 'Or read verified reviews on TrustedHousesitters →',
    linkUrl:
      'https://www.trustedhousesitters.com/house-and-pet-sitters/united-states/california/san-francisco/l/6526245/',
  },
  {
    id: 'faq6',
    question: 'What happens in an emergency?',
    answer:
      'I contact you immediately and follow your provided veterinary or emergency instructions.',
  },
];

export const SCHEDULE: MonthAvailability[] = [
  { id: 'm1', monthName: 'July', year: 2026, status: 'booked', note: 'Coastal San Diego' },
  { id: 'm2', monthName: 'August', year: 2026, status: 'booked', note: 'Santa Barbara Stay' },
  {
    id: 'm3',
    monthName: 'September',
    year: 2026,
    status: 'available',
    note: 'Available for Direct Booking',
  },
  {
    id: 'm4',
    monthName: 'October',
    year: 2026,
    status: 'limited',
    note: 'Partial Booking (NorCal)',
  },
  {
    id: 'm5',
    monthName: 'November',
    year: 2026,
    status: 'available',
    note: 'Available for Direct Booking',
  },
  {
    id: 'm6',
    monthName: 'December',
    year: 2026,
    status: 'available',
    note: 'Holiday Booking Window',
  },
  {
    id: 'm7',
    monthName: 'January',
    year: 2027,
    status: 'available',
    note: 'Available for Direct Booking',
  },
  {
    id: 'm8',
    monthName: 'February',
    year: 2027,
    status: 'available',
    note: 'Available for Winter Stays',
  },
  {
    id: 'm9',
    monthName: 'March',
    year: 2027,
    status: 'available',
    note: 'Available for Spring Bookings',
  },
  {
    id: 'm10',
    monthName: 'April',
    year: 2027,
    status: 'available',
    note: 'Available for Spring Bookings',
  },
  { id: 'm11', monthName: 'May', year: 2027, status: 'booked', note: 'Laguna Beach Booking' },
  {
    id: 'm12',
    monthName: 'June',
    year: 2027,
    status: 'available',
    note: 'Available for Summer Bookings',
  },
];

export const COVERAGE_AREAS = [
  'San Francisco',
  'Bay Area',
  'Los Gatos',
  'San Jose',
  'Saratoga',
  'Santa Barbara',
  'Malibu',
  'Santa Monica',
  'Beverly Hills',
  'Los Angeles',
  'Huntington Beach',
  'Newport Beach',
  'Laguna Beach',
  'Carlsbad',
  'La Jolla',
  'San Diego',
];

export const SITTER_BIO = {
  name: 'Yulia',
  title: 'Live-In House & Pet Sitter',
  tagline: 'Live-in pet and home care.',
  basePrice: 999,
  currency: 'USD',
  profileLink:
    'https://www.trustedhousesitters.com/house-and-pet-sitters/united-states/california/san-francisco/l/6526245/',
  location: 'United States',
  aboutText: `I provide premium live-in house and pet sitting. I work remotely, which ensures continuous companionship for your pets, precise routine execution, and complete household security. From senior pet medication schedules to complex garden watering and property management, I offer a reliable, professional experience centered on mutual commitment.`,
};

export const SITTER_IMAGES = {
  // Hero & Core sections
  hero: '/images/daisy.webp',
  advantageTrip: '/images/felix.webp',
  advantageRemote: '/images/nala.webp',

  // "THE IDEA" Section
  ideaCards: {
    whoIAm: '/images/toast.webp',
    experienceTrust: '/images/squid.webp',
    whatIAsk: '/images/bestier.webp',
  },

  // "WHAT IS INCLUDED" Section
  includedCards: {
    dailyPetCare: '/images/dallas-harper.webp',
    homePropertyCare: '/images/home-property-care.webp',
    specializedCare: '/images/spike.webp',
    noPetsProbs: '/images/plants-sit.webp',
  },
};

export const MONTH_DAYS: { [key: string]: number } = {
  July: 31,
  August: 31,
  September: 30,
  October: 31,
  November: 30,
  December: 31,
  January: 31,
  February: 28,
  March: 31,
  April: 30,
  May: 31,
  June: 30,
};

export interface ChronologicalMonth {
  name: string;
  year: number;
  monthIndex: number;
}

export const CHRONOLOGICAL_MONTHS: ChronologicalMonth[] = [
  { name: 'July', year: 2026, monthIndex: 6 },
  { name: 'August', year: 2026, monthIndex: 7 },
  { name: 'September', year: 2026, monthIndex: 8 },
  { name: 'October', year: 2026, monthIndex: 9 },
  { name: 'November', year: 2026, monthIndex: 10 },
  { name: 'December', year: 2026, monthIndex: 11 },
  { name: 'January', year: 2027, monthIndex: 0 },
  { name: 'February', year: 2027, monthIndex: 1 },
  { name: 'March', year: 2027, monthIndex: 2 },
  { name: 'April', year: 2027, monthIndex: 3 },
  { name: 'May', year: 2027, monthIndex: 4 },
  { name: 'June', year: 2027, monthIndex: 5 },
];

export const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const TODAY_STR = '2026-07-09'; // Current local time is 2026-07-09

export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export interface DateRange {
  start: string; // "YYYY-MM-DD"
  end: string; // "YYYY-MM-DD"
  note: string;
}

export const BOOKED_DATE_RANGES: DateRange[] = [
  { start: '2026-07-01', end: '2026-07-31', note: 'Coastal San Diego' },
  { start: '2026-08-01', end: '2026-08-31', note: 'Santa Barbara Stay' },
  { start: '2026-10-01', end: '2026-10-15', note: 'Partial Booking (NorCal)' },
  { start: '2027-05-01', end: '2027-05-31', note: 'Laguna Beach Booking' },
];

export const LIMITED_DATE_RANGES: DateRange[] = [
  // You can define any partially-booked or high-demand dates here
];

export const SHOWCASE_ITEMS: ShowcaseItem[] = [
  {
    id: 's1',
    imageUrl: '/images/spike.webp',
    title: 'Mighty Spike: Tiny Body, Big Attitude!',
    category: 'dogs',
    description:
      'Don’t let the protective cone fool you—Spike is a 1-year-old teacup Biewer Yorkie with the heart of a lion! Fresh off his neuter surgery, this pocket-sized dynamo didn’t let a satellite dish around his neck slow him down for even a second. Between marathon games of fetch across the loft, endless lap snuggles, and standing tall to courageously bark at dogs ten times his size on our Downtown walks, Spike proved that true bravado comes in tiny, irresistible packages.',
    petName: 'Spike (Teacup Biewer Yorkie)',
    location: 'Downtown Los Angeles, CA',
    year: 2026,
    initialLikes: 42,
  },
  {
    id: 's2',
    imageUrl: '/images/felix.webp',
    title: 'Beach Adventures with Felix',
    category: 'dogs',
    description:
      'Felix is a 6-year-old Golden Retriever who is the sweetest, gentlest giant you could ever meet. He is purely kind-hearted and thrives on early morning and evening beach strolls around Santa Barbara. He absolutely adores swimming and has fantastic off-leash recall—though you do have to keep a watchful eye on him, or he might just slyly steal an unsuspecting picnicker’s lunch!',
    petName: 'Felix (Golden Retriever)',
    location: 'Santa Barbara, CA',
    year: 2026,
    initialLikes: 28,
  },
  {
    id: 's3',
    imageUrl: '/images/nala.webp',
    title: 'Gentle Moments with Nala',
    category: 'dogs',
    description:
      'Nala is a sweet 12-year-old German Shepherd with a heart of gold. Due to her hip problems, she has difficulty going up and down stairs, so we take things nice and steady. She takes her daily medication easily. On walks around Aliso Viejo, she loves soaking up the sunshine—and since she isn’t super friendly to all dogs, we keep a calm, comfortable distance to keep every stroll peaceful.',
    petName: 'Nala (German Shepherd)',
    location: 'Aliso Viejo, CA',
    year: 2026,
    initialLikes: 56,
  },
  {
    id: 's4',
    imageUrl: '/images/toast.webp',
    title: 'Sunny Lounging with Toast',
    category: 'cats',
    description:
      'Toast is a majestic 10-year-old Maine Coon with pure YouTube-star energy! He loves heading outside in the crisp morning air and spending most of his time relaxing in the yard. He loves to lie on his back, and if he really trusts you, he’ll even let you pet his fluffy belly!',
    petName: 'Toast (Maine Coon)',
    location: 'Oakland, CA',
    year: 2026,
    initialLikes: 63,
  },
  {
    id: 's5',
    imageUrl: '/images/squid.webp',
    title: 'Cozy Cuddles with Squid',
    category: 'dogs',
    description:
      'Squid is a lovable 7-year-old Chihuahua who brings so much warmth and fun! At night, she loves curling up right next to your pillow, and during evening TV time, she’s the ultimate cozy cuddle bug. But once she steps outside, her energetic side takes over as she zooms around the backyard chasing her brothers!',
    petName: 'Squid (Chihuahua)',
    location: 'Irving, TX',
    year: 2025,
    initialLikes: 39,
  },
  {
    id: 's7',
    imageUrl: '/images/dallas-harper.webp',
    title: 'Snuggles & Playtime with Dallas & Harper',
    category: 'dogs',
    description:
      'Dallas (9-year-old Chihuahua) and Harper (8-year-old Australian Shepherd) were an absolute joy to care for! Dallas is a total snuggle bug—our blanket cuddles were the highlight of my days! Harper is sweet, playful, and loves being near you, making her company so comforting and fun. Both pups were easy to manage, and with attentive awareness on our walks around other dogs, every day went smoothly.',
    petName: 'Dallas (Chihuahua) & Harper (Australian Shepherd)',
    location: 'Long Beach, CA',
    year: 2025,
    initialLikes: 47,
  },
  {
    id: 's8',
    imageUrl: '/images/rufus.webp',
    title: 'Rufus the Gentle Giant',
    category: 'dogs',
    description:
      'Had an amazing time caring for Rufus in Laguna Beach, with truly stunning views from Top of the World! Every walk was scenic and enjoyable. Rufus will steal your heart—he’s intelligent, goofy, and endlessly entertaining. He follows you everywhere and instantly becomes your best friend, making every day full of laughs and smiles.',
    petName: 'Rufus (Australian Goldendoodle)',
    location: 'Laguna Beach, CA',
    year: 2025,
    initialLikes: 51,
  },
  {
    id: 's9',
    imageUrl: '/images/randal.webp',
    title: 'Heartwarming Days with Randall',
    category: 'dogs',
    description:
      'Randall is truly one of a kind. Calm, very smart, well-mannered, and well-behaved—he never pulls on walks, waits patiently in the mornings, and follows all commands. Beyond his perfect behavior, he’s endlessly sweet, gentle, and affectionate, loving belly rubs and sofa snuggles that melt your heart.',
    petName: 'Randall (Pitbull / Lab Mix)',
    location: 'Culver City, CA',
    year: 2025,
    initialLikes: 35,
  },
  {
    id: 's10',
    imageUrl: '/images/pepper.webp',
    title: 'Pepper’s Outdoor Adventures',
    category: 'cats',
    description:
      'Pepper is an independent, free-spirited cat who loves roaming outdoors in Austin. Confident and adventurous, she fearlessly patrols her neighborhood territory, yet loves nothing more than curling up for cozy cuddles as soon as she comes home.',
    petName: 'Pepper (Domestic Shorthair)',
    location: 'Austin, TX',
    year: 2025,
    initialLikes: 44,
  },
  {
    id: 's11',
    imageUrl: '/images/rufus-video.webp',
    videoUrl: '/videos/rufus-walk.mov',
    videoThumbnailTime: 38.0,
    title: 'Top of the World Walks with Rufus',
    category: 'videos',
    description:
      'Top of the World walks with unbelievable scenery! Rufus, a playful Australian Goldendoodle, loves soaking in the breathtaking views and fresh coastal breezes along every trail.',
    petName: 'Rufus (Australian Goldendoodle)',
    location: 'Laguna Beach, CA',
    year: 2025,
    initialLikes: 74,
  },
];
