import type { Cart, LightAccount, BookingRecord, GuestProfile, WaitlistRequest } from './types';

const CART_KEY = 'ra-cart-v2';
const ACCOUNT_KEY = 'ra-account-v1';
const BOOKINGS_KEY = 'ra-bookings-v1';
const GUESTS_KEY = 'ra-guests-v1';
const WAITLIST_KEY = 'ra-waitlist-v1';

const CART_TTL_MS = 24 * 60 * 60 * 1000; // 24h

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function canUseStorage(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const k = '__ra_probe__';
    window.localStorage.setItem(k, '1');
    window.localStorage.removeItem(k);
    return true;
  } catch {
    return false;
  }
}

const storageAvailable = canUseStorage();

// ---------- CART ----------

export function loadCart(): Cart | null {
  if (!storageAvailable) return null;
  const cart = safeParse<Cart>(window.localStorage.getItem(CART_KEY));
  if (!cart) return null;

  const age = Date.now() - cart.updatedAt;
  if (age > CART_TTL_MS) {
    window.localStorage.removeItem(CART_KEY);
    return null;
  }
  return cart;
}

export function saveCart(cart: Cart): void {
  if (!storageAvailable) return;
  window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function clearCart(): void {
  if (!storageAvailable) return;
  window.localStorage.removeItem(CART_KEY);
}

export function cartWasExpired(): boolean {
  if (!storageAvailable) return false;
  const raw = window.localStorage.getItem(CART_KEY);
  if (!raw) return false;
  const cart = safeParse<Cart>(raw);
  if (!cart) return false;
  return Date.now() - cart.updatedAt > CART_TTL_MS;
}

// ---------- LIGHT ACCOUNT ----------

export function loadAccount(): LightAccount | null {
  if (!storageAvailable) return null;
  const raw = safeParse<LightAccount & { email?: string }>(window.localStorage.getItem(ACCOUNT_KEY));
  if (!raw) return null;
  // Migrate old accounts that had email but no addresses array
  if (!Array.isArray(raw.addresses)) {
    raw.addresses = [];
  }
  delete raw.email;
  return raw;
}

export function saveAccount(account: LightAccount): void {
  if (!storageAvailable) return;
  window.localStorage.setItem(ACCOUNT_KEY, JSON.stringify(account));
}

export function clearAccount(): void {
  if (!storageAvailable) return;
  window.localStorage.removeItem(ACCOUNT_KEY);
}

// ---------- BOOKINGS ----------

export function loadBookings(): BookingRecord[] {
  if (!storageAvailable) return [];
  return safeParse<BookingRecord[]>(window.localStorage.getItem(BOOKINGS_KEY)) ?? [];
}

export function addBooking(booking: BookingRecord): void {
  if (!storageAvailable) return;
  const list = loadBookings();
  list.unshift(booking);
  window.localStorage.setItem(BOOKINGS_KEY, JSON.stringify(list));
}

export function clearBookings(): void {
  if (!storageAvailable) return;
  window.localStorage.removeItem(BOOKINGS_KEY);
}

// ---------- GUEST PROFILES ----------

export function loadGuests(): GuestProfile[] {
  if (!storageAvailable) return [];
  return safeParse<GuestProfile[]>(window.localStorage.getItem(GUESTS_KEY)) ?? [];
}

export function saveGuests(guests: GuestProfile[]): void {
  if (!storageAvailable) return;
  window.localStorage.setItem(GUESTS_KEY, JSON.stringify(guests));
}

export function clearGuests(): void {
  if (!storageAvailable) return;
  window.localStorage.removeItem(GUESTS_KEY);
}

// ---------- WAITLIST ----------

export function loadWaitlist(): WaitlistRequest[] {
  if (!storageAvailable) return [];
  return safeParse<WaitlistRequest[]>(window.localStorage.getItem(WAITLIST_KEY)) ?? [];
}

export function saveWaitlist(list: WaitlistRequest[]): void {
  if (!storageAvailable) return;
  window.localStorage.setItem(WAITLIST_KEY, JSON.stringify(list));
}

export function clearWaitlist(): void {
  if (!storageAvailable) return;
  window.localStorage.removeItem(WAITLIST_KEY);
}

export { CART_KEY, ACCOUNT_KEY, BOOKINGS_KEY, GUESTS_KEY, WAITLIST_KEY, storageAvailable };
