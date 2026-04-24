export type RitualId =
  | 'atelier'
  | 'solar-vitality'
  | 'somatic-recovery'
  | 'alchemic-aesthetics'
  | 'longevity-lab'
  | 'velvet-smooth'
  | 'body-renewal';

export type ServiceAudience = 'gentlemen' | 'ladies' | 'unisex';

export interface RitualFaq {
  q: string;
  a: string;
}

export interface Ritual {
  id: RitualId;
  title: string;
  titleItalic: string;
  tagline: string;
  description: string;
  longDescription: string;
  philosophy: string;
  faqs: RitualFaq[];
  image: string;
}

export interface ServiceVariant {
  id: string;
  label: string;
  durationMin: number;
  price: number;
}

export interface Service {
  id: string;
  ritualId: RitualId;
  name: string;
  description: string;
  detail?: string;
  highlights?: string[];
  durationMin: number;
  price: number;
  image: string;
  audience: ServiceAudience;
  requiresConsultation?: boolean;
  variants?: ServiceVariant[];
}

export interface Stylist {
  id: string;
  name: string;
  title: string;
  ritualIds: RitualId[];
  languages: string[];
  image: string;
  bio: string;
}

export interface Package {
  id: string;
  name: string;
  tagline: string;
  category: string;
  description: string;
  longDescription: string;
  philosophy: string;
  image: string;
  serviceIds: string[];
  savings: number;
}

export interface CartItem {
  id: string;
  serviceId: string;
  ritualId: RitualId;
  name: string;
  durationMin: number;
  price: number;
  image: string;
  stylistPref: string | 'any';
  addedAt: number;
  variantId?: string;
  variantLabel?: string;
  unavailable?: boolean;
  // Journey bundle — present when this line item represents a curated journey
  journeyId?: string;
  journeyServiceIds?: string[];
}

export interface ServiceAddress {
  id: string;
  flatVilla: string;
  landmark?: string;
  label: 'home' | 'other';
  displayAddress: string;
}

export interface GuestDetails {
  name: string;
  phone: string;
  notes?: string;
  address?: ServiceAddress;
}

export interface DraftCheckout {
  date?: string;
  time?: string;
  addressId?: string;
}

export interface Cart {
  items: CartItem[];
  updatedAt: number;
  draftCheckout?: DraftCheckout;
}

export interface LightAccount {
  name: string;
  phone: string;
  addresses: ServiceAddress[];
  createdAt: number;
}

export interface BookingRecord {
  reference: string;
  items: CartItem[];
  date: string;
  time: string;
  totalDuration: number;
  totalPrice: number;
  guest: GuestDetails;
  createdAt: number;
  status: 'confirmed' | 'cancelled';
  serviceLocation: 'at-home';
  paymentMethod: 'cash' | 'card';
}
