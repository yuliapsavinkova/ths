export interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface BookingRequest {
  name: string;
  email: string;
  phone: string;
  location: string;
  referredBy?: string;
  startDate: string;
  endDate: string;
  petCount: number;
  petType: 'dog' | 'cat' | 'mixed' | 'other' | 'none';
  hasMedications: boolean;
  hasSeniorPets: boolean;
  largeGarden?: boolean;
  notes: string;
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

