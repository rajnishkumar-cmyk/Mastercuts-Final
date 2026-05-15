export type OfferEligibility = 'first-visit' | 'all';

export interface Offer {
  id: string;
  name: string;
  discountPercent: number;
  validUntil: string;
  limitedNote?: string;
  eligibility?: OfferEligibility;
}

export const offers: Offer[] = [
  {
    id: 'first-visit-2026',
    name: 'First Visit',
    discountPercent: 20,
    validUntil: '2026-06-30T23:59:59+04:00',
    limitedNote: 'Only 3 discounted spots left this week',
    eligibility: 'first-visit',
  },
  {
    id: 'seasonal-2026',
    name: 'Seasonal Promotion',
    discountPercent: 30,
    validUntil: '2026-07-15T23:59:59+04:00',
    limitedNote: 'Limited to the first 25 bookings',
    eligibility: 'all',
  },
];

export function getOffer(id: string | undefined | null): Offer | undefined {
  if (!id) return undefined;
  return offers.find((o) => o.id === id);
}

export function isOfferActive(offer: Offer, now: number = Date.now()): boolean {
  return new Date(offer.validUntil).getTime() > now;
}

export function getActiveOffers(now: number = Date.now()): Offer[] {
  return offers.filter((o) => isOfferActive(o, now));
}

export function calculateDiscount(subtotal: number, offer: Offer | undefined): number {
  if (!offer) return 0;
  return Math.round(subtotal * (offer.discountPercent / 100));
}
