export interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface PricingBreakdown {
  baseRate: number;
  petSurcharge: number;
  petSurchargePerNight: number;
  seniorSurcharge: number;
  medsSurcharge: number;
  gardenSurcharge: number;
  durationDiscount: number;
  total: number;
  perDay: number;
}

export interface BookingRequest {
  name: string;
  email: string;
  phone?: string;
  location: string;
  referredBy?: string;
  startDate?: string;
  endDate?: string;
  duration?: number;
  petCount: number;
  petType: 'dog' | 'cat' | 'mixed' | 'other' | 'none' | string;
  dogCount?: number;
  catCount?: number;
  otherCount?: number;
  hasMedications?: boolean;
  hasSeniorPets?: boolean;
  largeGarden?: boolean;
  notes?: string;
  pricing?: Partial<PricingBreakdown>;
}

export interface FeedbackPayload {
  message: string;
  category?: string;
  name?: string;
  email?: string;
  rating?: string;
}

export interface MonthAvailability {
  id: string;
  monthName: string;
  year: number;
  status: 'available' | 'booked' | 'limited';
  note?: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  location: string;
  dates: string;
  petNames: string;
  core?: boolean;
  petImages?: string[];
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  linkText?: string;
  linkUrl?: string;
}

export interface ShowcaseItem {
  id: string;
  imageUrl: string;
  videoUrl?: string;
  videoThumbnailTime?: number;
  title: string;
  category: 'dogs' | 'cats' | 'videos';
  description: string;
  petName: string;
  location: string;
  year: number;
  initialLikes: number;
}

