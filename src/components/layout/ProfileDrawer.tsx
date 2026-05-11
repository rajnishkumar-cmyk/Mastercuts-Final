import { X, LogOut, User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useCart, formatAed, formatDuration } from '@/components/cart/CartProvider';
import { useIsMobile } from '@/hooks/use-mobile';
import { rituals } from '@/lib/booking/catalog';

function formatDateLabel(key: string): string {
  const [Y, M, D] = key.split('-').map(Number);
  const d = new Date(Y, M - 1, D);
  return d.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

export function ProfileDrawer() {
  const { surface, closeAll, account, bookings, openCart, signOut, openLogin } = useCart();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const open = surface === 'profile';
  const side = isMobile ? 'bottom' : 'right';

  const handleSignIn = () => {
    closeAll();
    setTimeout(openLogin, 220);
  };

  const now = Date.now();
  const upcoming = bookings.filter((b) => {
    const ts = new Date(`${b.date}T${b.time}`).getTime();
    return b.status === 'confirmed' && ts >= now;
  });
  const past = bookings.filter((b) => {
    const ts = new Date(`${b.date}T${b.time}`).getTime();
    return ts < now || b.status !== 'confirmed';
  });

  const goToRitual = (ritualId: string) => {
    closeAll();
    setTimeout(() => navigate(`/rituals/${ritualId}`), 220);
  };

  return (
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
            /* Unauthenticated state */
            <div className="px-6 pt-10 pb-8">
              <div className="w-14 h-14 rounded-full bg-black/5 flex items-center justify-center mb-6">
                <UserIcon className="w-5 h-5 text-text-primary" />
              </div>
              <h3 className="font-serif text-3xl text-text-primary leading-[1.05] mb-3">
                Save your <span className="italic">visits</span>
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed mb-6">
                Sign in with your phone to save your details, view bookings, and
                pick up where you left off on your next visit.
              </p>

              <button
                type="button"
                onClick={handleSignIn}
                className="w-full rounded-full bg-bg-dark text-white py-4 text-sm font-medium hover:bg-bg-darker transition-colors mb-8"
              >
                Sign in with phone
              </button>

              <p className="text-[10px] uppercase tracking-[0.18em] text-text-secondary mb-3">
                Or start browsing
              </p>
              <div className="space-y-2">
                {rituals.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => goToRitual(r.id)}
                    className="w-full flex items-baseline justify-between border-b border-black/10 py-3 text-left"
                  >
                    <span className="font-serif text-lg text-text-primary">
                      {r.title} <span className="italic">{r.titleItalic}</span>
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-text-secondary">
                      {r.tagline}
                    </span>
                  </button>
                ))}
              </div>
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

              {/* Upcoming */}
              <section>
                <p className="text-[10px] uppercase tracking-[0.18em] text-text-secondary mb-3">
                  Upcoming visits
                </p>
                {upcoming.length === 0 ? (
                  <p className="text-sm text-text-secondary">
                    No upcoming visits.{' '}
                    <button
                      type="button"
                      onClick={() => {
                        closeAll();
                        setTimeout(openCart, 200);
                      }}
                      className="underline hover:no-underline"
                    >
                      Book one now
                    </button>
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {upcoming.map((b) => (
                      <li key={b.reference} className="border border-black/10 rounded-xl p-4">
                        <div className="flex items-baseline justify-between mb-2">
                          <span className="font-serif text-lg text-text-primary">
                            {formatDateLabel(b.date)}
                          </span>
                          <span className="text-xs text-text-secondary">{b.time}</span>
                        </div>
                        <p className="text-xs text-text-secondary mb-1">
                          {b.items.length} {b.items.length === 1 ? 'service' : 'services'} ·{' '}
                          {formatDuration(b.totalDuration)}
                        </p>
                        <p className="text-xs text-text-secondary">
                          Ref · <span className="text-text-primary">{b.reference}</span>
                        </p>
                      </li>
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
                  <ul className="space-y-2">
                    {past.slice(0, 5).map((b) => (
                      <li
                        key={b.reference}
                        className="flex items-baseline justify-between text-sm py-2 border-b border-black/10"
                      >
                        <span className="text-text-primary">{formatDateLabel(b.date)}</span>
                        <span className="text-xs text-text-secondary">
                          {formatAed(b.totalPrice)}
                        </span>
                      </li>
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
  );
}
