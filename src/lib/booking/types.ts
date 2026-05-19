export type RitualId =
  | 'atelier'
  | 'solar-vitality'
  | 'somatic-recovery'
  | 'alchemic-aesthetics'
  | 'longevity-lab'
  | 'velvet-smooth'
  | 'body-renewal'
  | 'signature-rituals';

export type ServiceAudience = 'gentlemen' | 'ladies' | 'unisex';

export type ServiceLocation = 'salon' | 'home' | 'both';

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
  location?: ServiceLocation;
  requiresConsultation?: boolean;
  variants?: ServiceVariant[];
}

export interface Therapist {
  id: string;
  name: string;
  title: string;
  ritualIds: RitualId[];
  languages: string[];
  image?: string;
  bio?: string;
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
  therapistPref: string | 'any';
  addedAt: number;
  variantId?: string;
  variantLabel?: string;
  unavailable?: boolean;
  // Journey bundle — present when this line item represents a curated journey
  journeyId?: string;
  journeyServiceIds?: string[];
  // Which saved guest this service is for. Defaults to the self profile
  // when omitted (e.g. items added pre-login).
  forGuestId?: string;
}

export interface GuestProfile {
  id: string;
  name: string;
  phone?: string;
  relation?: string;
  notes?: string;
  // True for the auto-created profile derived from the account holder.
  // Always pinned to the top of the picker list.
  isSelf?: boolean;
}

export type WaitlistSource = 'date-full' | 'therapist-unavailable';
export type WaitlistTimeOfDay = 'morning' | 'afternoon' | 'evening' | 'any';

export interface WaitlistRequest {
  id: string;
  createdAt: number;
  guestName: string;
  guestPhone: string;
  preferredDate: string; // YYYY-MM-DD
  preferredTimeOfDay?: WaitlistTimeOfDay;
  preferredTherapistId?: string;
  // Snapshot in case the therapist is renamed later.
  preferredTherapistName?: string;
  notes?: string;
  source: WaitlistSource;
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
  // Set when the chosen address is outside Imperial Avenue Residences.
  // Surfaces the concierge tooltip in the cart and flags the booking
  // record as requiresConfirmation at submit time.
  outsideImperialAvenue?: boolean;
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
  paymentMethod: 'card' | 'apple-pay';
  // True when the booking address is outside Imperial Avenue Residences
  // during the transition period. These bookings receive a personal
  // confirmation call from the concierge before being scheduled.
  requiresConfirmation?: boolean;
  // Snapshot of every guest profile referenced by items at booking time.
  // Preserved here so the confirmation/profile view renders correct names
  // even if a guest is later renamed or removed.
  guests?: GuestProfile[];
}
