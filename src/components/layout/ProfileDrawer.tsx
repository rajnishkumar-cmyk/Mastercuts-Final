import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, X, LogOut, User as UserIcon, Users, ChevronRight } from 'lucide-react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useCart, formatAed, formatDuration } from '@/components/cart/CartProvider';
import { useIsMobile } from '@/hooks/use-mobile';
import type { BookingRecord } from '@/lib/booking/types';
import type { BookingRecord as ApiBooking } from '@/lib/api/bookings';

function formatDateLabel(key: string): string {
  const [Y, M, D] = key.split('-').map(Number);
  const d = new Date(Y, M - 1, D);
  return d.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

interface CardService {
  name: string;
  durationMin?: number;
  price?: number;
}

/** Shape both the server and local records normalise into for cards. */
interface CardBooking {
  reference: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  price: number;
  totalDuration?: number;
  cancelled: boolean;
  services: CardService[];
}

const fromRemote = (b: ApiBooking): CardBooking => ({
  reference: b.booking_token,
  date: b.date,
  time: b.slot_time,
  price: b.total_price,
  totalDuration: b.total_duration_min,
  cancelled: !!b.is_cancelled,
  services: (b.services ?? []).map((s) => ({
    name: s.name,
    durationMin: s.duration_min,
    price: s.price,
  })),
});

const fromLocal = (b: BookingRecord): CardBooking => ({
  reference: b.reference,
  date: b.date,
  time: b.time,
  price: b.totalPrice,
  totalDuration: b.totalDuration,
  cancelled: b.status !== 'confirmed',
  services: (b.items ?? []).map((i) => ({
    name: i.name,
    durationMin: i.durationMin,
    price: i.price,
  })),
});

function statusLabel(b: CardBooking): string {
  if (b.cancelled) return 'Cancelled';
  return new Date(`${b.date}T${b.time}`).getTime() >= Date.now()
    ? 'Upcoming'
    : 'Completed';
}

function BookingCard({
  b,
  onSelect,
}: {
  b: CardBooking;
  onSelect: (b: CardBooking) => void;
}) {
  const count = b.services.length;
  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(b)}
        className="w-full text-left border border-black/10 rounded-xl p-4 hover:bg-black/[0.02] transition-colors"
      >
        <div className="flex items-baseline justify-between mb-2">
          <span className="font-serif text-lg text-text-primary">
            {formatDateLabel(b.date)}
          </span>
          <span className="text-xs text-text-secondary">{b.time}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-secondary">
            {count} {count === 1 ? 'service' : 'services'}
            {b.totalDuration ? ` · ${formatDuration(b.totalDuration)}` : ''}
          </span>
          <span className="text-sm text-text-primary flex items-center gap-1.5">
            {formatAed(b.price)}
            <ChevronRight className="w-3.5 h-3.5 text-text-secondary" />
          </span>
        </div>
      </button>
    </li>
  );
}

/** Shared inner content for the detail popup (used in both Sheet + Dialog). */
function BookingDetailBody({ b, onClose }: { b: CardBooking; onClose: () => void }) {
  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/5 flex items-center justify-center text-text-primary hover:bg-black/10 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
      <div className="px-6 pt-7 pb-7">
        <p className="text-[10px] uppercase tracking-[0.22em] text-text-secondary mb-2">
          Booking · {statusLabel(b)}
        </p>
        <DialogTitle asChild>
          <h2 className="font-serif text-3xl text-text-primary leading-[1.05] mb-1">
            {formatDateLabel(b.date)}
          </h2>
        </DialogTitle>
        <p className="text-sm text-text-secondary mb-6">{b.time}</p>

        <div className="space-y-2.5 mb-5">
          {b.services.length === 0 ? (
            <p className="text-sm text-text-secondary">
              No service details available.
            </p>
          ) : (
            b.services.map((s, i) => (
              <div
                key={i}
                className="flex items-baseline justify-between gap-3 text-sm"
              >
                <span className="text-text-primary">{s.name}</span>
                <span className="text-xs text-text-secondary whitespace-nowrap">
                  {s.durationMin ? `${s.durationMin} min` : ''}
                  {s.price != null
                    ? `${s.durationMin ? ' · ' : ''}${formatAed(s.price)}`
                    : ''}
                </span>
              </div>
            ))
          )}
        </div>

        <div className="flex items-baseline justify-between border-t border-black/10 pt-3 mb-4">
          <span className="text-sm text-text-primary">
            Total{b.totalDuration ? ` · ${formatDuration(b.totalDuration)}` : ''}
          </span>
          <span className="text-sm font-medium text-text-primary">
            {formatAed(b.price)}
          </span>
        </div>

        <p className="text-xs text-text-secondary">
          Ref · <span className="text-text-primary">{b.reference}</span>
        </p>
      </div>
    </div>
  );
}

function BookingDetailDialog({
  booking,
  onClose,
}: {
  booking: CardBooking | null;
  onClose: () => void;
}) {
  const isMobile = useIsMobile();
  const open = !!booking;

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={(v) => (v ? null : onClose())}>
        <SheetContent
          side="bottom"
          hideDefaultClose
          className="bg-bg-primary border-none p-0 w-full max-w-full rounded-t-3xl h-auto max-h-[88vh] z-[90]"
        >
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-black/20" />
          {booking && <BookingDetailBody b={booking} onClose={onClose} />}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? null : onClose())}>
      <DialogContent
        showCloseButton={false}
        className="bg-bg-primary border-none p-0 sm:max-w-md w-[calc(100%-2rem)] overflow-hidden rounded-2xl shadow-2xl z-[90]"
      >
        {booking && <BookingDetailBody b={booking} onClose={onClose} />}
      </DialogContent>
    </Dialog>
  );
}

export function ProfileDrawer() {
  const {
    surface,
    closeAll,
    account,
    bookings,
    remoteBookings,
    bookingsLoading,
    bookingsError,
    refreshBookings,
    signOut,
    openLogin,
    guestProfiles,
    waitlistRequests,
    removeWaitlistRequest,
  } = useCart();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const open = surface === 'profile';
  const side = isMobile ? 'bottom' : 'right';
  const [selected, setSelected] = useState<CardBooking | null>(null);

  const handleSignIn = () => {
    closeAll();
    setTimeout(openLogin, 220);
  };

  const handleBookNow = () => {
    closeAll();
    navigate('/at-home');
  };

  // Pull fresh server bookings whenever the profile opens.
  useEffect(() => {
    if (open && account) void refreshBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Server is the source of truth when signed in; fall back to the local
  // (optimistic / offline) records while loading or if the fetch failed.
  const source: CardBooking[] = remoteBookings
    ? remoteBookings.map(fromRemote)
    : bookings.map(fromLocal);

  const now = Date.now();
  const tsOf = (b: CardBooking) => new Date(`${b.date}T${b.time}`).getTime();
  const upcoming = source
    .filter((b) => !b.cancelled && tsOf(b) >= now)
    .sort((a, b) => tsOf(a) - tsOf(b));
  const past = source
    .filter((b) => b.cancelled || tsOf(b) < now)
    .sort((a, b) => tsOf(b) - tsOf(a));
  const firstLoad = bookingsLoading && !remoteBookings;

  return (
    <>
    <Sheet open={open} onOpenChange={(v) => (v ? null : closeAll())}>
      <SheetContent
        side={side}
        hideDefaultClose
        className="bg-bg-primary border-none p-0 flex flex-col w-full sm:max-w-md h-full max-h-screen"
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-5 border-b border-black/10 flex-shrink-0">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-text-secondary mb-1">
              Account
            </p>
            <h2 className="font-serif text-2xl text-text-primary leading-none">
              {account ? (
                <>Hello, <span className="italic">{account.name.split(' ')[0]}</span></>
              ) : (
                <>Your <span className="italic">profile</span></>
              )}
            </h2>
          </div>
          <button
            type="button"
            onClick={closeAll}
            aria-label="Close"
            className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-text-primary hover:bg-black/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {!account ? (
            /* Defensive fallback — primary entry now routes straight to the phone login sheet. */
            <div className="px-6 pt-10 pb-8">
              <div className="w-14 h-14 rounded-full bg-black/5 flex items-center justify-center mb-6">
                <UserIcon className="w-5 h-5 text-text-primary" />
              </div>
              <h3 className="font-serif text-3xl text-text-primary leading-[1.05] mb-3">
                Save your <span className="italic">visits</span>
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed mb-6">
                Sign in with your phone to save your details and view bookings.
              </p>
              <button
                type="button"
                onClick={handleSignIn}
                className="w-full rounded-full bg-bg-dark text-white py-4 text-sm font-medium hover:bg-bg-darker transition-colors"
              >
                Sign in with phone
              </button>
            </div>
          ) : (
            <div className="px-6 py-6 space-y-8">
              {/* Details */}
              <section>
                <p className="text-[10px] uppercase tracking-[0.18em] text-text-secondary mb-3">
                  Your details
                </p>
                <div className="space-y-1 text-sm text-text-primary">
                  <p>{account.name || 'Guest'}</p>
                  <p className="text-text-secondary">{account.phone}</p>
                </div>
              </section>

              {/* My Guests — read-only list. Add/edit happens in the cart's
                  per-item guest picker, which is contextual to the booking. */}
              {guestProfiles.filter((g) => !g.isSelf).length > 0 && (
                <section>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-text-secondary mb-3 flex items-center gap-2">
                    <Users className="w-3 h-3" strokeWidth={1.5} />
                    My guests
                  </p>
                  <ul className="space-y-2">
                    {guestProfiles
                      .filter((g) => !g.isSelf)
                      .map((g) => (
                        <li
                          key={g.id}
                          className="flex items-center justify-between gap-3 py-2 border-b border-black/5"
                        >
                          <div className="min-w-0">
                            <p className="text-sm text-text-primary truncate">
                              {g.name}
                            </p>
                            {g.phone && (
                              <p className="text-xs text-text-secondary truncate">
                                {g.phone}
                              </p>
                            )}
                          </div>
                        </li>
                      ))}
                  </ul>
                  <p className="mt-3 text-[11px] text-text-secondary">
                    Add or pick a guest from any cart item.
                  </p>
                </section>
              )}

              {/* On the waitlist — pending notify-me requests */}
              {waitlistRequests.length > 0 && (
                <section>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-text-secondary mb-3 flex items-center gap-2">
                    <Bell className="w-3 h-3" strokeWidth={1.5} />
                    On the waitlist
                  </p>
                  <ul className="space-y-2">
                    {waitlistRequests.map((r) => (
                      <li
                        key={r.id}
                        className="flex items-center gap-3 py-2 border-b border-black/5"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-text-primary truncate">
                            {formatDateLabel(r.preferredDate)}
                          </p>
                          <p className="text-xs text-text-secondary truncate">
                            {r.preferredTherapistName ?? 'Any therapist'}
                            {r.preferredTimeOfDay && r.preferredTimeOfDay !== 'any'
                              ? ` · ${r.preferredTimeOfDay}`
                              : ''}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeWaitlistRequest(r.id)}
                          aria-label="Remove waitlist entry"
                          className="shrink-0 w-7 h-7 rounded-full bg-black/5 flex items-center justify-center text-text-secondary hover:bg-black/10 hover:text-text-primary transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Upcoming / active */}
              <section>
                <p className="text-[10px] uppercase tracking-[0.18em] text-text-secondary mb-3">
                  Upcoming visits
                </p>
                {firstLoad ? (
                  <p className="text-sm text-text-secondary">Loading your visits…</p>
                ) : bookingsError && !remoteBookings ? (
                  <p className="text-sm text-text-secondary">
                    {bookingsError}{' '}
                    <button
                      type="button"
                      onClick={() => void refreshBookings()}
                      className="underline hover:no-underline"
                    >
                      Retry
                    </button>
                  </p>
                ) : upcoming.length === 0 ? (
                  <p className="text-sm text-text-secondary">
                    No upcoming visits.{' '}
                    <button
                      type="button"
                      onClick={handleBookNow}
                      className="underline hover:no-underline"
                    >
                      Book one now
                    </button>
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {upcoming.map((b) => (
                      <BookingCard key={b.reference} b={b} onSelect={setSelected} />
                    ))}
                  </ul>
                )}
              </section>

              {/* Past */}
              {past.length > 0 && (
                <section>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-text-secondary mb-3">
                    Past visits
                  </p>
                  <ul className="space-y-3">
                    {past.map((b) => (
                      <BookingCard key={b.reference} b={b} onSelect={setSelected} />
                    ))}
                  </ul>
                </section>
              )}

              <button
                type="button"
                onClick={signOut}
                className="flex items-center gap-2 text-xs uppercase tracking-wider text-text-secondary hover:text-text-primary transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Forget me on this device
              </button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>

    <BookingDetailDialog booking={selected} onClose={() => setSelected(null)} />
    </>
  );
}
