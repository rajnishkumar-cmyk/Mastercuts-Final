import { X, LogOut, User as UserIcon, Users } from 'lucide-react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useCart, formatAed, formatDuration } from '@/components/cart/CartProvider';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const { surface, closeAll, account, bookings, openCart, signOut, openLogin, guestProfiles } = useCart();
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
