import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import type { Cart, CartItem, DraftCheckout, GuestDetails, GuestProfile, LightAccount, BookingRecord, RitualId, ServiceAddress, WaitlistRequest } from '@/lib/booking/types';
import { getService, getJourney, getJourneyTotals } from '@/lib/booking/catalog';
import {
  CART_KEY,
  loadCart,
  saveCart,
  clearCart,
  loadAccount,
  saveAccount,
  clearAccount,
  loadBookings,
  addBooking,
  cartWasExpired,
  loadGuests,
  saveGuests,
  clearGuests,
  loadWaitlist,
  saveWaitlist,
  clearWaitlist,
} from '@/lib/booking/storage';
import { toDateKey } from '@/lib/booking/availability';
import { getOffer, isOfferActive, calculateDiscount, type Offer } from '@/lib/offers';

const SELF_GUEST_ID = 'self';

type Surface =
  | 'none'
  | 'cart'
  | 'profile'
  | 'audience-picker'
  | 'service-detail'
  | 'login'
  | 'explore-picker'
  | 'wellness-hub';

export type CheckoutStep = 'none' | 'phone-login' | 'otp-verify' | 'address' | 'date-time';

export type DrawerView =
  | { name: 'basket' }
  | { name: 'ritual-index' }
  | { name: 'ritual-services'; ritualId: RitualId }
  | { name: 'journey-index' }
  | { name: 'journey-detail'; journeyId: string };

export interface ServiceDetailContext {
  serviceId: string;
  ritualId: RitualId;
}

interface CartContextValue {
  cart: Cart;
  account: LightAccount | null;
  bookings: BookingRecord[];
  surface: Surface;
  serviceDetail: ServiceDetailContext | null;

  // checkout overlay state
  checkoutStep: CheckoutStep;
  setCheckoutStep: (step: CheckoutStep) => void;
  bookingResult: BookingRecord | null;
  resetCheckout: () => void;

  // payment
  paymentMethod: 'card' | 'apple-pay';
  setPaymentMethod: (m: 'card' | 'apple-pay') => void;

  // layered modals (don't disturb the underlying surface)
  isContactEditOpen: boolean;
  openContactEdit: () => void;
  closeContactEdit: () => void;
  isPaymentMethodOpen: boolean;
  closePaymentMethod: () => void;

  drawerStack: DrawerView[];
  currentDrawerView: DrawerView;

  // surface control
  openCart: (initialView?: DrawerView) => void;
  closeCart: () => void;
  openCheckout: () => void;
  openLogin: () => void;
  openProfile: () => void;
  openAudiencePicker: (destination?: string) => void;
  audiencePickerDestination: string;
  openExplorePicker: () => void;
  openPaymentMethod: () => void;
  openWellnessHub: () => void;
  openServiceDetail: (serviceId: string, ritualId: RitualId) => void;
  closeServiceDetail: () => void;
  closeAll: () => void;
  pushDrawerView: (view: DrawerView) => void;
  popDrawerView: () => void;

  // cart actions
  addToCart: (serviceId: string, therapistPref?: string | 'any', variantId?: string) => boolean;
  addJourneyToCart: (journeyId: string) => boolean;
  removeItem: (itemId: string) => void;
  updateTherapistPref: (itemId: string, therapistPref: string | 'any') => void;
  clearAll: () => void;

  // offers
  appliedOffer: Offer | undefined;
  setPendingOffer: (offerId: string) => void;
  clearPendingOffer: () => void;
  // Ephemeral timestamp set when an offer is freshly applied while the cart
  // already has items. Drives the in-cart celebration animation. Not
  // persisted — won't fire on reload.
  celebrationTriggerAt: number | null;

  // guest profiles — saved name/phone records for booking on behalf of others.
  // The "self" profile is auto-derived from the LightAccount and pinned.
  guestProfiles: GuestProfile[];
  addGuestProfile: (input: { name: string; phone?: string; relation?: string; notes?: string }) => string;
  updateGuestProfile: (id: string, patch: Partial<Omit<GuestProfile, 'id' | 'isSelf'>>) => void;
  removeGuestProfile: (id: string) => void;
  setItemGuest: (itemId: string, guestId: string) => void;
  getGuestForItem: (item: CartItem) => GuestProfile | undefined;

  // waitlist — persisted requests to be notified if a slot opens up on a
  // specific date (with optional therapist preference).
  waitlistRequests: WaitlistRequest[];
  addWaitlistRequest: (input: Omit<WaitlistRequest, 'id' | 'createdAt'>) => WaitlistRequest;
  removeWaitlistRequest: (id: string) => void;
  hasWaitlistFor: (dateKey: string, therapistId?: string) => boolean;

  // checkout state
  updateDraftCheckout: (draft: Partial<DraftCheckout>) => void;
  confirmBooking: () => BookingRecord;
  getSelectedAddress: () => ServiceAddress | null;

  // account
  saveLightAccount: (account: LightAccount) => void;
  signOut: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const emptyCart: Cart = { items: [], updatedAt: Date.now() };
const BASKET_VIEW: DrawerView = { name: 'basket' };
const RITUAL_INDEX_VIEW: DrawerView = { name: 'ritual-index' };

function makeRef(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return `RA-${out}`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart>(emptyCart);
  const [account, setAccount] = useState<LightAccount | null>(null);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [surface, setSurface] = useState<Surface>('none');
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>('none');
  const [bookingResult, setBookingResult] = useState<BookingRecord | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple-pay'>('card');
  const [isContactEditOpen, setIsContactEditOpen] = useState(false);
  const [isPaymentMethodOpen, setIsPaymentMethodOpen] = useState(false);
  const [drawerStack, setDrawerStack] = useState<DrawerView[]>([]);
  const [serviceDetail, setServiceDetail] = useState<ServiceDetailContext | null>(null);
  const [audiencePickerDestination, setAudiencePickerDestination] = useState<string>('/explore');
  const [celebrationTriggerAt, setCelebrationTriggerAt] = useState<number | null>(null);
  const [guestProfiles, setGuestProfiles] = useState<GuestProfile[]>([]);
  const [waitlistRequests, setWaitlistRequests] = useState<WaitlistRequest[]>([]);
  const hydratedRef = useRef(false);
  const guestsHydratedRef = useRef(false);
  const waitlistHydratedRef = useRef(false);
  const cartItemCountRef = useRef(0);

  cartItemCountRef.current = cart.items.length;

  // Hydrate from localStorage on mount
  useEffect(() => {
    const expired = cartWasExpired();
    const loaded = loadCart();
    if (loaded) {
      setCart(loaded);
    } else if (expired) {
      toast.info('Your cart was cleared — older than 24h.');
    }
    setAccount(loadAccount());
    setBookings(loadBookings());
    setGuestProfiles(loadGuests());
    // Drop waitlist entries whose preferred date has already passed so the
    // list stays meaningful on return visits.
    const todayKey = toDateKey(new Date());
    const loadedWaitlist = loadWaitlist().filter(
      (r) => r.preferredDate >= todayKey
    );
    setWaitlistRequests(loadedWaitlist);
    hydratedRef.current = true;
    guestsHydratedRef.current = true;
    waitlistHydratedRef.current = true;
  }, []);

  // Persist cart whenever it changes (but not on the initial hydration pass)
  useEffect(() => {
    if (!hydratedRef.current) return;
    if (cart.items.length === 0 && !cart.draftCheckout) {
      clearCart();
    } else {
      saveCart(cart);
    }
  }, [cart]);

  // Cross-tab sync
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== CART_KEY) return;
      const next = loadCart();
      if (next) setCart(next);
      else setCart(emptyCart);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Body scroll lock when any surface is open
  useEffect(() => {
    if (surface === 'none') {
      document.body.style.overflow = '';
    } else {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [surface]);

  const addToCart = useCallback<CartContextValue['addToCart']>(
    (serviceId, therapistPref = 'any', variantId) => {
      const service = getService(serviceId);
      if (!service) {
        toast.error('Service not found');
        return false;
      }

      // Resolve variant (if any) — variantId > default first variant > flat service values
      const variants = service.variants ?? [];
      const selectedVariant =
        variants.find((v) => v.id === variantId) ?? variants[0] ?? null;
      const effectiveDuration = selectedVariant?.durationMin ?? service.durationMin;
      const effectivePrice = selectedVariant?.price ?? service.price;
      const effectiveVariantId = selectedVariant?.id;
      const effectiveVariantLabel = selectedVariant?.label;

      let added = false;
      setCart((prev) => {
        if (prev.items.length >= 10) {
          toast.warning("That's a lot \u2014 please check out before adding more");
          return prev;
        }
        const item: CartItem = {
          id: crypto.randomUUID(),
          serviceId: service.id,
          ritualId: service.ritualId,
          name: service.name,
          durationMin: effectiveDuration,
          price: effectivePrice,
          image: service.image,
          therapistPref,
          variantId: effectiveVariantId,
          variantLabel: effectiveVariantLabel,
          addedAt: Date.now(),
        };
        added = true;
        toast.success(
          effectiveVariantLabel
            ? `Added · ${service.name} · ${effectiveVariantLabel}`
            : `Added · ${service.name}`
        );
        return { ...prev, items: [...prev.items, item], updatedAt: Date.now() };
      });
      return added;
    },
    []
  );

  const addJourneyToCart = useCallback<CartContextValue['addJourneyToCart']>(
    (journeyId) => {
      const journey = getJourney(journeyId);
      if (!journey) {
        toast.error('Journey not found');
        return false;
      }
      const resolved = journey.serviceIds.map(getService).filter(Boolean);
      if (resolved.length === 0) {
        toast.error('Journey has no services');
        return false;
      }
      const totals = getJourneyTotals(journey);
      const firstService = resolved[0]!;
      const bundleServiceId = `journey:${journey.id}`;

      let added = false;
      setCart((prev) => {
        const existing = prev.items.find((i) => i.serviceId === bundleServiceId);
        if (existing) {
          toast.info(`${journey.name} is already in your cart`);
          return prev;
        }
        if (prev.items.length >= 10) {
          toast.warning("That's a lot \u2014 please check out before adding more");
          return prev;
        }
        const item: CartItem = {
          id: crypto.randomUUID(),
          serviceId: bundleServiceId,
          ritualId: firstService.ritualId,
          name: journey.name,
          durationMin: totals.totalDuration,
          price: totals.totalPriceDiscounted,
          image: journey.image,
          therapistPref: 'any',
          journeyId: journey.id,
          journeyServiceIds: journey.serviceIds,
          addedAt: Date.now(),
        };
        added = true;
        toast.success(`Added · ${journey.name}`);
        return { ...prev, items: [...prev.items, item], updatedAt: Date.now() };
      });
      return added;
    },
    []
  );

  const removeItem = useCallback((itemId: string) => {
    setCart((prev) => ({
      ...prev,
      items: prev.items.filter((i) => i.id !== itemId),
      updatedAt: Date.now(),
    }));
  }, []);

  const updateTherapistPref = useCallback((itemId: string, therapistPref: string | 'any') => {
    setCart((prev) => ({
      ...prev,
      items: prev.items.map((i) => (i.id === itemId ? { ...i, therapistPref } : i)),
      updatedAt: Date.now(),
    }));
  }, []);

  const clearAll = useCallback(() => {
    setCart({ items: [], updatedAt: Date.now() });
  }, []);

  const setPendingOffer = useCallback((offerId: string) => {
    setCart((prev) => {
      // Celebrate only on a *new* application against a cart that already
      // has items. Same-offer reselection and empty-cart "Avail now" stay
      // silent. Defer the trigger to a microtask so we don't call setState
      // from within another setState.
      if (prev.pendingOfferId !== offerId && prev.items.length > 0) {
        queueMicrotask(() => setCelebrationTriggerAt(Date.now()));
      }
      return {
        ...prev,
        pendingOfferId: offerId,
        updatedAt: Date.now(),
      };
    });
  }, []);

  const clearPendingOffer = useCallback(() => {
    setCart((prev) => {
      if (!prev.pendingOfferId) return prev;
      const { pendingOfferId: _omit, ...rest } = prev;
      void _omit;
      return { ...rest, updatedAt: Date.now() };
    });
  }, []);

  // Auto-clear an expired offer the moment it lapses (e.g. user lingered on
  // the cart past validUntil). Re-evaluated whenever the cart updates.
  const appliedOffer = useMemo(() => {
    const offer = getOffer(cart.pendingOfferId);
    if (!offer) return undefined;
    if (!isOfferActive(offer)) return undefined;
    return offer;
  }, [cart.pendingOfferId]);

  useEffect(() => {
    if (!cart.pendingOfferId) return;
    const offer = getOffer(cart.pendingOfferId);
    if (offer && !isOfferActive(offer)) {
      toast.info(`Sorry, "${offer.name}" just expired.`);
      clearPendingOffer();
    }
  }, [cart.pendingOfferId, clearPendingOffer]);

  // Persist guest profiles after hydration.
  useEffect(() => {
    if (!guestsHydratedRef.current) return;
    if (guestProfiles.length === 0) {
      clearGuests();
    } else {
      saveGuests(guestProfiles);
    }
  }, [guestProfiles]);

  // Mirror the account holder into a pinned "self" guest profile. Created
  // on first login and kept in sync if the user edits their name/phone.
  useEffect(() => {
    if (!account) return;
    setGuestProfiles((prev) => {
      const idx = prev.findIndex((g) => g.isSelf);
      const selfDraft: GuestProfile = {
        id: SELF_GUEST_ID,
        name: account.name?.trim() || 'You',
        phone: account.phone,
        isSelf: true,
      };
      if (idx === -1) return [selfDraft, ...prev];
      const existing = prev[idx];
      if (existing.name === selfDraft.name && existing.phone === selfDraft.phone) {
        return prev;
      }
      return prev.map((g, i) => (i === idx ? { ...g, ...selfDraft } : g));
    });
  }, [account]);

  const addGuestProfile = useCallback<CartContextValue['addGuestProfile']>(
    ({ name, phone, relation, notes }) => {
      const id = crypto.randomUUID();
      setGuestProfiles((prev) => [
        ...prev,
        { id, name: name.trim(), phone: phone?.trim(), relation, notes },
      ]);
      return id;
    },
    []
  );

  const updateGuestProfile = useCallback<CartContextValue['updateGuestProfile']>(
    (id, patch) => {
      setGuestProfiles((prev) =>
        prev.map((g) => (g.id === id ? { ...g, ...patch } : g))
      );
    },
    []
  );

  const removeGuestProfile = useCallback((id: string) => {
    if (id === SELF_GUEST_ID) return; // self profile is not removable
    setGuestProfiles((prev) => prev.filter((g) => g.id !== id));
    // Clear forGuestId on any cart items pointing at this guest — they
    // fall back to the self default.
    setCart((prev) => ({
      ...prev,
      items: prev.items.map((i) =>
        i.forGuestId === id ? { ...i, forGuestId: undefined } : i
      ),
      updatedAt: Date.now(),
    }));
  }, []);

  const setItemGuest = useCallback((itemId: string, guestId: string) => {
    setCart((prev) => ({
      ...prev,
      items: prev.items.map((i) =>
        i.id === itemId ? { ...i, forGuestId: guestId } : i
      ),
      updatedAt: Date.now(),
    }));
  }, []);

  const getGuestForItem = useCallback(
    (item: CartItem): GuestProfile | undefined => {
      const targetId = item.forGuestId ?? SELF_GUEST_ID;
      return guestProfiles.find((g) => g.id === targetId);
    },
    [guestProfiles]
  );

  // Persist waitlist after hydration. Cleared key (not empty array) when the
  // list is empty so the localStorage stays tidy.
  useEffect(() => {
    if (!waitlistHydratedRef.current) return;
    if (waitlistRequests.length === 0) {
      clearWaitlist();
    } else {
      saveWaitlist(waitlistRequests);
    }
  }, [waitlistRequests]);

  const addWaitlistRequest = useCallback<CartContextValue['addWaitlistRequest']>(
    (input) => {
      const entry: WaitlistRequest = {
        ...input,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
      };
      setWaitlistRequests((prev) => [entry, ...prev]);
      return entry;
    },
    []
  );

  const removeWaitlistRequest = useCallback((id: string) => {
    setWaitlistRequests((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const hasWaitlistFor = useCallback(
    (dateKey: string, therapistId?: string): boolean => {
      return waitlistRequests.some((r) => {
        if (r.preferredDate !== dateKey) return false;
        if (therapistId) {
          return r.preferredTherapistId === therapistId;
        }
        // date-only query: match the date-full source (no therapist scope).
        return !r.preferredTherapistId;
      });
    },
    [waitlistRequests]
  );

  const updateDraftCheckout = useCallback((draft: Partial<DraftCheckout>) => {
    setCart((prev) => ({
      ...prev,
      draftCheckout: { ...(prev.draftCheckout ?? {}), ...draft },
      updatedAt: Date.now(),
    }));
  }, []);

  const getSelectedAddress = useCallback((): ServiceAddress | null => {
    const addressId = cart.draftCheckout?.addressId;
    if (!addressId || !account) return null;
    return account.addresses.find((a) => a.id === addressId) ?? null;
  }, [cart, account]);

  const confirmBooking = useCallback((): BookingRecord => {
    const items = cart.items;
    if (items.length === 0) {
      throw new Error('Cannot confirm — cart is empty');
    }
    const draft = cart.draftCheckout;
    const date = draft?.date;
    const time = draft?.time;
    if (!date || !time) {
      throw new Error('Cannot confirm — date/time not selected');
    }
    if (!account) {
      throw new Error('Cannot confirm — no account');
    }

    const address = getSelectedAddress();

    const guest: GuestDetails = {
      name: account.name,
      phone: account.phone,
      address: address ?? undefined,
    };

    const subtotal = items.reduce((s, i) => s + i.price, 0);
    const offerSnapshot = appliedOffer
      ? {
          id: appliedOffer.id,
          name: appliedOffer.name,
          discountPercent: appliedOffer.discountPercent,
          discountAmount: calculateDiscount(subtotal, appliedOffer),
        }
      : undefined;

    // Snapshot the set of guest profiles actually referenced by items in
    // this booking — keeps the confirmation/profile view correct even if
    // the user later renames or removes a guest.
    const referencedGuestIds = new Set(
      items.map((i) => i.forGuestId ?? SELF_GUEST_ID)
    );
    const guestSnapshot = guestProfiles.filter((g) =>
      referencedGuestIds.has(g.id)
    );

    const booking: BookingRecord = {
      reference: makeRef(),
      items,
      date,
      time,
      totalDuration: items.reduce((s, i) => s + i.durationMin, 0),
      totalPrice: subtotal - (offerSnapshot?.discountAmount ?? 0),
      guest,
      createdAt: Date.now(),
      status: 'confirmed',
      serviceLocation: 'at-home',
      paymentMethod,
      offer: offerSnapshot,
      guests: guestSnapshot.length > 0 ? guestSnapshot : undefined,
    };
    addBooking(booking);
    setBookings(loadBookings());
    setCart({ items: [], updatedAt: Date.now() });
    setBookingResult(booking);
    return booking;
  }, [cart, account, paymentMethod, getSelectedAddress, appliedOffer, guestProfiles]);

  const saveLightAccount = useCallback((next: LightAccount) => {
    saveAccount(next);
    setAccount(next);
  }, []);

  const signOut = useCallback(() => {
    clearAccount();
    setAccount(null);
    setGuestProfiles([]);
    clearGuests();
    setWaitlistRequests([]);
    clearWaitlist();
  }, []);

  // openCart picks a sensible default based on cart state, and when opening
  // directly into a ritual-services view it prepends ritual-index so the back
  // button has a natural destination.
  const openCart = useCallback((initialView?: DrawerView) => {
    const view =
      initialView ??
      (cartItemCountRef.current === 0 ? RITUAL_INDEX_VIEW : BASKET_VIEW);

    const stack: DrawerView[] =
      view.name === 'ritual-services' ? [RITUAL_INDEX_VIEW, view] : [view];

    setDrawerStack(stack);
    setSurface('cart');
  }, []);

  const closeCart = useCallback(() => {
    setSurface('none');
    setDrawerStack([]);
    setCheckoutStep('none');
    setBookingResult(null);
  }, []);

  const openCheckout = useCallback(() => {
    if (!account) {
      setCheckoutStep('phone-login');
    } else if (account.addresses.length > 0) {
      // Auto-select first saved address and skip to date-time
      const firstAddr = account.addresses[0];
      setCart((prev) => ({
        ...prev,
        draftCheckout: { ...(prev.draftCheckout ?? {}), addressId: firstAddr.id },
        updatedAt: Date.now(),
      }));
      setCheckoutStep('date-time');
    } else {
      setCheckoutStep('address');
    }
  }, [account]);

  const resetCheckout = useCallback(() => {
    setCheckoutStep('none');
    setBookingResult(null);
    setPaymentMethod('card');
  }, []);
  const openLogin = useCallback(() => {
    setSurface('login');
    setCheckoutStep('phone-login');
  }, []);
  const openProfile = useCallback(() => setSurface('profile'), []);
  const openAudiencePicker = useCallback((destination = '/explore') => {
    setAudiencePickerDestination(destination);
    setSurface('audience-picker');
  }, []);
  const openExplorePicker = useCallback(() => setSurface('explore-picker'), []);
  const openPaymentMethod = useCallback(() => setIsPaymentMethodOpen(true), []);
  const closePaymentMethod = useCallback(() => setIsPaymentMethodOpen(false), []);
  const openContactEdit = useCallback(() => setIsContactEditOpen(true), []);
  const closeContactEdit = useCallback(() => setIsContactEditOpen(false), []);
  const openWellnessHub = useCallback(() => setSurface('wellness-hub'), []);
  const openServiceDetail = useCallback<CartContextValue['openServiceDetail']>(
    (serviceId, ritualId) => {
      setServiceDetail({ serviceId, ritualId });
      setSurface('service-detail');
    },
    []
  );
  const closeServiceDetail = useCallback(() => {
    setSurface('none');
    setServiceDetail(null);
  }, []);
  const closeAll = useCallback(() => {
    setSurface('none');
    setDrawerStack([]);
    setServiceDetail(null);
    setCheckoutStep('none');
    setBookingResult(null);
    setPaymentMethod('card');
    setIsContactEditOpen(false);
    setIsPaymentMethodOpen(false);
  }, []);

  const pushDrawerView = useCallback((view: DrawerView) => {
    setDrawerStack((prev) => [...prev, view]);
  }, []);

  const popDrawerView = useCallback(() => {
    setDrawerStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  }, []);

  const currentDrawerView = useMemo<DrawerView>(
    () => drawerStack[drawerStack.length - 1] ?? BASKET_VIEW,
    [drawerStack]
  );

  const value: CartContextValue = {
    cart,
    account,
    bookings,
    surface,
    serviceDetail,
    checkoutStep,
    setCheckoutStep,
    bookingResult,
    resetCheckout,
    paymentMethod,
    setPaymentMethod,
    isContactEditOpen,
    openContactEdit,
    closeContactEdit,
    isPaymentMethodOpen,
    closePaymentMethod,
    drawerStack,
    currentDrawerView,
    openCart,
    closeCart,
    openCheckout,
    openLogin,
    openProfile,
    openAudiencePicker,
    audiencePickerDestination,
    openExplorePicker,
    openPaymentMethod,
    openWellnessHub,
    openServiceDetail,
    closeServiceDetail,
    closeAll,
    pushDrawerView,
    popDrawerView,
    addToCart,
    addJourneyToCart,
    removeItem,
    updateTherapistPref,
    clearAll,
    appliedOffer,
    setPendingOffer,
    clearPendingOffer,
    celebrationTriggerAt,
    guestProfiles,
    addGuestProfile,
    updateGuestProfile,
    removeGuestProfile,
    setItemGuest,
    getGuestForItem,
    waitlistRequests,
    addWaitlistRequest,
    removeWaitlistRequest,
    hasWaitlistFor,
    updateDraftCheckout,
    confirmBooking,
    getSelectedAddress,
    saveLightAccount,
    signOut,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}

export function useCartTotals() {
  const { cart, appliedOffer } = useCart();
  return useMemo(() => {
    const totalPrice = cart.items.reduce((s, i) => s + i.price, 0);
    const totalDuration = cart.items.reduce((s, i) => s + i.durationMin, 0);
    const discount = calculateDiscount(totalPrice, appliedOffer);
    return {
      totalPrice,
      totalDuration,
      count: cart.items.length,
      discount,
      subtotalAfterDiscount: totalPrice - discount,
    };
  }, [cart, appliedOffer]);
}

export function formatAed(value: number): string {
  return `AED ${value.toLocaleString('en-AE')}`;
}

export function formatDuration(min: number): string {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}
