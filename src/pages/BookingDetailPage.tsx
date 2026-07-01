import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, CreditCard, User } from 'lucide-react';
import {
  useCart,
  formatAed,
  formatAedPrecise,
  formatDuration,
} from '@/components/cart/CartProvider';
import type { CartItem } from '@/lib/booking/types';
import { computeVatBreakdown, serviceVat } from '@/lib/booking/pricing';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

// Free cancellation window — matches the policy shown on the service detail
// sheet ("Free cancellation up to 4 hours before").
const CANCEL_WINDOW_MS = 4 * 60 * 60 * 1000;

function formatFullDate(key: string): string {
  const [Y, M, D] = key.split('-').map(Number);
  const d = new Date(Y, M - 1, D);
  return d.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function BookingDetailPage() {
  const { reference } = useParams();
  const navigate = useNavigate();
  const { bookings, cancelBooking } = useCart();

  const booking = useMemo(
    () => bookings.find((b) => b.reference === reference),
    [bookings, reference]
  );

  const BackButton = (
    <button
      type="button"
      onClick={() => navigate(-1)}
      aria-label="Back"
      className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-text-primary hover:bg-black/10 transition-colors shrink-0"
    >
      <ArrowLeft className="w-4 h-4" />
    </button>
  );

  if (!booking) {
    return (
      <main
        className="min-h-screen bg-bg-primary"
        style={{ paddingTop: 'var(--nav-offset, 64px)' }}
      >
        <div className="max-w-2xl mx-auto px-5 py-10">
          {BackButton}
          <p className="mt-8 text-text-secondary">
            We couldn&apos;t find that booking. It may have been cleared from this
            device.
          </p>
        </div>
      </main>
    );
  }

  const start = new Date(`${booking.date}T${booking.time}`).getTime();
  const now = Date.now();
  const isCancelled = booking.status === 'cancelled';
  const isUpcoming = booking.status === 'confirmed' && start >= now;
  const canCancel = booking.status === 'confirmed' && start - now >= CANCEL_WINDOW_MS;
  const statusLabel = isCancelled ? 'Cancelled' : isUpcoming ? 'Upcoming' : 'Completed';

  // Prices are VAT-inclusive; VAT is shown per service line, net subtotal is the sum.
  const { subtotal } = computeVatBreakdown(booking.items.map((i) => i.price));

  const address = booking.guest.address;
  const paymentLabel = booking.paymentMethod === 'apple-pay' ? 'Apple Pay' : 'Card';

  const parents = booking.items.filter((i) => !i.parentItemId);
  const addOnsFor = (parentId: string): CartItem[] =>
    booking.items.filter((i) => i.parentItemId === parentId);
  const guestName = (id?: string) =>
    id ? booking.guests?.find((g) => g.id === id)?.name : undefined;

  return (
    <main
      className="min-h-screen bg-bg-primary"
      style={{ paddingTop: 'var(--nav-offset, 64px)' }}
    >
      {/* Page header with back button */}
      <header className="border-b border-black/10">
        <div className="max-w-2xl mx-auto px-5 h-16 flex items-center gap-3">
          {BackButton}
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.2em] text-text-secondary">
              Booking
            </p>
            <h1 className="font-serif text-xl text-text-primary leading-none truncate">
              {booking.reference}
            </h1>
          </div>
          <span
            className={cn(
              'ml-auto shrink-0 text-[10px] uppercase tracking-[0.16em] px-3 py-1.5 rounded-full',
              isCancelled
                ? 'bg-red-500/10 text-red-600'
                : isUpcoming
                  ? 'bg-accent-gold/15 text-accent-burnt'
                  : 'bg-black/5 text-text-secondary'
            )}
          >
            {statusLabel}
          </span>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-5 py-8 space-y-8">
        {/* When */}
        <section>
          <p className="text-[10px] uppercase tracking-[0.2em] text-text-secondary mb-2">
            When
          </p>
          <p className="font-serif text-2xl text-text-primary leading-tight">
            {formatFullDate(booking.date)}
          </p>
          <p className="text-text-secondary mt-1">
            {booking.time} · {formatDuration(booking.totalDuration)}
          </p>
        </section>

        {/* Where */}
        <section className="border-t border-black/10 pt-6">
          <p className="text-[10px] uppercase tracking-[0.2em] text-text-secondary mb-3">
            Where
          </p>
          <div className="flex gap-3">
            <MapPin className="w-4 h-4 text-accent-gold mt-1 shrink-0" strokeWidth={1.5} />
            <div className="text-sm text-text-primary leading-relaxed">
              <p className="font-medium">At-home service</p>
              {address ? (
                <>
                  <p className="text-text-secondary">{address.flatVilla}</p>
                  <p className="text-text-secondary">{address.displayAddress}</p>
                  {address.landmark && (
                    <p className="text-text-secondary">{address.landmark}</p>
                  )}
                </>
              ) : (
                <p className="text-text-secondary">Address on file</p>
              )}
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="border-t border-black/10 pt-6">
          <p className="text-[10px] uppercase tracking-[0.2em] text-text-secondary mb-4">
            {parents.length} {parents.length === 1 ? 'service' : 'services'}
          </p>
          <ul className="space-y-5">
            {parents.map((item) => {
              const addOns = addOnsFor(item.id);
              const forGuest = guestName(item.forGuestId);
              return (
                <li key={item.id} className="flex gap-4">
                  <div className="w-16 h-20 shrink-0 overflow-hidden rounded-lg bg-circle-light">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="font-serif text-lg text-text-primary leading-tight">
                        {item.name}
                      </h3>
                      <span className="text-sm text-text-secondary shrink-0">
                        {formatAed(item.price)}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary mt-0.5">
                      {item.variantLabel ? `${item.variantLabel} · ` : ''}
                      {formatDuration(item.durationMin)}
                    </p>
                    <p className="text-[11px] text-text-secondary/80 mt-0.5">
                      incl. 5% VAT · {formatAedPrecise(serviceVat(item.price))}
                    </p>
                    {forGuest && (
                      <p className="text-xs text-text-secondary mt-0.5">
                        For {forGuest}
                      </p>
                    )}
                    {addOns.length > 0 && (
                      <ul className="mt-2 space-y-1">
                        {addOns.map((a) => (
                          <li key={a.id} className="text-xs text-text-secondary">
                            <div className="flex items-center justify-between gap-2">
                              <span className="truncate">+ {a.name}</span>
                              <span className="shrink-0">{formatAed(a.price)}</span>
                            </div>
                            <p className="text-[11px] text-text-secondary/70">
                              incl. 5% VAT · {formatAedPrecise(serviceVat(a.price))}
                            </p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Contact + payment */}
        <section className="border-t border-black/10 pt-6 grid grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-text-secondary mb-2 flex items-center gap-1.5">
              <User className="w-3 h-3" strokeWidth={1.5} /> Booked by
            </p>
            <p className="text-sm text-text-primary">{booking.guest.name}</p>
            <p className="text-xs text-text-secondary">{booking.guest.phone}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-text-secondary mb-2 flex items-center gap-1.5">
              <CreditCard className="w-3 h-3" strokeWidth={1.5} /> Payment
            </p>
            <p className="text-sm text-text-primary">{paymentLabel}</p>
            <p className="text-xs text-text-secondary">
              Settle when your therapist arrives
            </p>
          </div>
        </section>

        {/* Totals — catalog prices are VAT-inclusive (UAE 5%); VAT is itemised
            per service above. */}
        <section className="border-t border-black/10 pt-6 space-y-2">
          <div className="flex justify-between text-sm text-text-secondary pb-2 border-b border-black/10">
            <span>Subtotal (net)</span>
            <span>{formatAedPrecise(subtotal)}</span>
          </div>
          <div className="flex justify-between font-serif text-xl text-text-primary pt-1">
            <span>Total (incl. VAT)</span>
            <span>{formatAed(booking.totalPrice)}</span>
          </div>
        </section>

        {booking.requiresConfirmation && (
          <div className="border border-black/10 rounded-2xl p-5">
            <p className="text-[10px] uppercase tracking-[0.2em] text-text-secondary mb-2">
              Confirmation call
            </p>
            <p className="text-sm text-text-primary/70 leading-relaxed">
              Your address is outside Imperial Avenue Residences. Our concierge
              will call to personally confirm and schedule this booking.
            </p>
          </div>
        )}

        {/* Cancel action */}
        {isCancelled ? (
          <p className="text-sm text-text-secondary">
            This booking was cancelled.
          </p>
        ) : isUpcoming ? (
          <div className="border-t border-black/10 pt-6">
            {canCancel ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    type="button"
                    className="w-full rounded-full border border-red-500/40 text-red-600 py-4 text-sm font-medium hover:bg-red-500/5 transition-colors"
                  >
                    Cancel booking
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will cancel your {formatFullDate(booking.date)} visit
                      ({booking.reference}). This can&apos;t be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Keep booking</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => cancelBooking(booking.reference)}
                      className="bg-red-600 hover:bg-red-600/90"
                    >
                      Cancel booking
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <>
                <button
                  type="button"
                  disabled
                  className="w-full rounded-full border border-black/15 text-text-muted py-4 text-sm font-medium cursor-not-allowed"
                >
                  Cancel booking
                </button>
                <p className="mt-2 text-[11px] text-text-muted text-center leading-relaxed">
                  Cancellations must be made at least 4 hours before your visit.
                  Please call the studio for last-minute changes.
                </p>
              </>
            )}
          </div>
        ) : null}
      </div>
    </main>
  );
}
