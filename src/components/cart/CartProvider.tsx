import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import type { Cart, CartItem, DraftCheckout, GuestDetails, LightAccount, BookingRecord, RitualId, ServiceAddress } from '@/lib/booking/types';
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
} from '@/lib/booking/storage';

type Surface =
  | 'none'
  | 'cart'
  | 'profile'
  | 'audience-picker'
  | 'service-detail';

export type CheckoutStep = 'none' | 'phone-login' | 'otp-verify' | 'address' | 'edit-contact' | 'date-time';

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
  paymentMethod: 'cash' | 'card';
  setPaymentMethod: (m: 'cash' | 'card') => void;

  drawerStack: DrawerView[];
  currentDrawerView: DrawerView;

  // surface control
  openCart: (initialView?: DrawerView) => void;
  closeCart: () => void;
  openCheckout: () => void;
  openProfile: () => void;
  openAudiencePicker: () => void;
  openServiceDetail: (serviceId: string, ritualId: RitualId) => void;
  closeServiceDetail: () => void;
  closeAll: () => void;
  pushDrawerView: (view: DrawerView) => void;
  popDrawerView: () => void;

  // cart actions
  addToCart: (serviceId: string, stylistPref?: string | 'any', variantId?: string) => boolean;
  addJourneyToCart: (journeyId: string) => boolean;
  removeItem: (itemId: string) => void;
  updateStylistPref: (itemId: string, stylistPref: string | 'any') => void;
  clearAll: () => void;

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
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [drawerStack, setDrawerStack] = useState<DrawerView[]>([]);
  const [serviceDetail, setServiceDetail] = useState<ServiceDetailContext | null>(null);
  const hydratedRef = useRef(false);
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
    hydratedRef.current = true;
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
    (serviceId, stylistPref = 'any', variantId) => {
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
        const existing = prev.items.find((i) => i.serviceId === serviceId);

        // Already in cart — update variant in-place if it differs
        if (existing) {
          if (existing.variantId === effectiveVariantId) {
            toast.info(`${service.name} is already in your cart`);
            return prev;
          }
          added = true;
          toast.success(`${service.name} · updated to ${effectiveVariantLabel}`);
          return {
            ...prev,
            items: prev.items.map((i) =>
              i.id === existing.id
                ? {
                    ...i,
                    variantId: effectiveVariantId,
                    variantLabel: effectiveVariantLabel,
                    durationMin: effectiveDuration,
                    price: effectivePrice,
                  }
                : i
            ),
            updatedAt: Date.now(),
          };
        }

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
          stylistPref,
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
          stylistPref: 'any',
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

  const updateStylistPref = useCallback((itemId: string, stylistPref: string | 'any') => {
    setCart((prev) => ({
      ...prev,
      items: prev.items.map((i) => (i.id === itemId ? { ...i, stylistPref } : i)),
      updatedAt: Date.now(),
    }));
  }, []);

  const clearAll = useCallback(() => {
    setCart({ items: [], updatedAt: Date.now() });
  }, []);

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

    const booking: BookingRecord = {
      reference: makeRef(),
      items,
      date,
      time,
      totalDuration: items.reduce((s, i) => s + i.durationMin, 0),
      totalPrice: items.reduce((s, i) => s + i.price, 0),
      guest,
      createdAt: Date.now(),
      status: 'confirmed',
      serviceLocation: 'at-home',
      paymentMethod,
    };
    addBooking(booking);
    setBookings(loadBookings());
    setCart({ items: [], updatedAt: Date.now() });
    setBookingResult(booking);
    return booking;
  }, [cart, account, paymentMethod, getSelectedAddress]);

  const saveLightAccount = useCallback((next: LightAccount) => {
    saveAccount(next);
    setAccount(next);
  }, []);

  const signOut = useCallback(() => {
    clearAccount();
    setAccount(null);
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
    setPaymentMethod('cash');
  }, []);
  const openProfile = useCallback(() => setSurface('profile'), []);
  const openAudiencePicker = useCallback(() => setSurface('audience-picker'), []);
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
    setPaymentMethod('cash');
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
    drawerStack,
    currentDrawerView,
    openCart,
    closeCart,
    openCheckout,
    openProfile,
    openAudiencePicker,
    openServiceDetail,
    closeServiceDetail,
    closeAll,
    pushDrawerView,
    popDrawerView,
    addToCart,
    addJourneyToCart,
    removeItem,
    updateStylistPref,
    clearAll,
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
  const { cart } = useCart();
  return useMemo(() => {
    const totalPrice = cart.items.reduce((s, i) => s + i.price, 0);
    const totalDuration = cart.items.reduce((s, i) => s + i.durationMin, 0);
    return { totalPrice, totalDuration, count: cart.items.length };
  }, [cart]);
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
