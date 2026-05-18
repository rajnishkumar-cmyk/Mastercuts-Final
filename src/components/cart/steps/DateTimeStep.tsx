import { useMemo, useState } from 'react';
import { Bell, Check } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { useCart, useCartTotals, formatDuration } from '../CartProvider';
import {
  getSlotsForDate,
  groupSlotsByPeriod,
  toDateKey,
  isDateClosed,
  isDatePast,
  isTherapistBusyOnDate,
} from '@/lib/booking/availability';
import { getTherapist } from '@/lib/booking/catalog';
import { WaitlistSheet, type WaitlistContext } from '../WaitlistSheet';
import { cn } from '@/lib/utils';

function formatDateLabel(key: string): string {
  const [Y, M, D] = key.split('-').map(Number);
  const d = new Date(Y, M - 1, D);
  return d.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

export function DateTimeStep() {
  const {
    cart,
    updateDraftCheckout,
    setCheckoutStep,
    hasWaitlistFor,
    waitlistRequests,
    removeWaitlistRequest,
  } = useCart();
  const { totalDuration } = useCartTotals();
  const [waitlistContext, setWaitlistContext] = useState<WaitlistContext | null>(null);

  const initialDate = cart.draftCheckout?.date
    ? new Date(cart.draftCheckout.date)
    : undefined;
  const [date, setDate] = useState<Date | undefined>(initialDate);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(
    cart.draftCheckout?.time
  );

  const dateKey = date ? toDateKey(date) : null;
  const slots = useMemo(
    () => (dateKey ? getSlotsForDate(dateKey, totalDuration) : []),
    [dateKey, totalDuration]
  );
  const grouped = useMemo(() => groupSlotsByPeriod(slots), [slots]);

  const onPickDate = (d: Date | undefined) => {
    if (!d) return;
    setDate(d);
    setSelectedTime(undefined);
    updateDraftCheckout({ date: toDateKey(d), time: undefined });
  };

  const onPickTime = (time: string) => {
    setSelectedTime(time);
    updateDraftCheckout({ time });
  };

  const canContinue = !!(date && selectedTime);

  const sections: [string, typeof grouped.morning][] = [
    ['Morning', grouped.morning],
    ['Afternoon', grouped.afternoon],
    ['Evening', grouped.evening],
  ];

  // True when there are zero *bookable* slots on this date — either the
  // slot array is empty (duration doesn't fit before close) or every slot
  // is marked unavailable. Triggers the date-full waitlist CTA.
  const noSlotsAvailable =
    !!dateKey && (slots.length === 0 || slots.every((s) => !s.available));

  // Unique therapists picked in the cart who happen to be busy on this
  // date — each surfaces its own per-therapist waitlist notice above the
  // slot grid. Non-blocking: slots still render below.
  const conflictingTherapists = useMemo(() => {
    if (!dateKey) return [] as { id: string; name: string }[];
    const seen = new Set<string>();
    const out: { id: string; name: string }[] = [];
    for (const item of cart.items) {
      const pref = item.therapistPref;
      if (!pref || pref === 'any' || seen.has(pref)) continue;
      if (!isTherapistBusyOnDate(pref, dateKey)) continue;
      const t = getTherapist(pref);
      if (!t) continue;
      seen.add(pref);
      out.push({ id: t.id, name: t.name });
    }
    return out;
  }, [cart.items, dateKey]);

  const dateOnlyWaitlistEntry = dateKey
    ? waitlistRequests.find(
        (r) => r.preferredDate === dateKey && !r.preferredTherapistId
      )
    : undefined;

  const openWaitlist = (ctx: WaitlistContext) => setWaitlistContext(ctx);

  const handleContinue = () => {
    if (!canContinue) return;
    // Return to basket — the progressive footer will show address + time rows
    setCheckoutStep('none');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 pt-6 pb-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-text-secondary mb-3">
            Date &amp; time
          </p>
          <h2 className="font-serif text-3xl text-text-primary leading-[1.05] mb-2">
            When should your <span className="italic">therapist arrive?</span>
          </h2>
          <p className="text-sm text-text-secondary">
            Your session will take approx.{' '}
            <span className="text-text-primary">{formatDuration(totalDuration)}</span>{' '}
            · Dubai
          </p>
        </div>

        <div className="px-2 sm:px-6">
          <Calendar
            mode="single"
            selected={date}
            onSelect={onPickDate}
            disabled={(d) => isDatePast(d) || isDateClosed(d)}
            className="w-full bg-transparent"
          />
        </div>

        {date && dateKey && (
          <div className="px-6 pb-4 pt-2">
            <p className="text-[10px] uppercase tracking-[0.18em] text-text-secondary mb-4">
              Available slots
            </p>

            {/* Per-therapist conflict notices — non-blocking. Renders above
                the slot grid; users can still pick "any available" therapist
                or a different date, or join the waitlist for their preferred
                one. */}
            {!noSlotsAvailable && conflictingTherapists.length > 0 && (
              <div className="space-y-2 mb-5" aria-live="polite">
                {conflictingTherapists.map((t) => {
                  const onList = hasWaitlistFor(dateKey, t.id);
                  return (
                    <div
                      key={t.id}
                      className="rounded-xl border border-accent-gold/30 bg-accent-gold/5 px-4 py-3 flex items-center gap-3"
                    >
                      <Bell className="w-4 h-4 text-accent-gold shrink-0" strokeWidth={1.5} />
                      <p className="text-sm text-text-primary flex-1 min-w-0">
                        <span className="font-medium">{t.name}</span> is fully
                        booked on this date.
                      </p>
                      {onList ? (
                        <span className="shrink-0 inline-flex items-center gap-1 text-[11px] uppercase tracking-wider text-accent-gold">
                          <Check className="w-3 h-3" strokeWidth={3} /> Waitlisted
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            openWaitlist({
                              preferredDate: dateKey,
                              preferredTherapistId: t.id,
                              preferredTherapistName: t.name,
                              source: 'therapist-unavailable',
                            })
                          }
                          className="shrink-0 rounded-full border border-bg-dark/20 bg-white px-3 py-1.5 text-[11px] uppercase tracking-wider text-text-primary hover:bg-black/5 transition-colors"
                        >
                          Join waitlist
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {noSlotsAvailable ? (
              dateOnlyWaitlistEntry ? (
                <div
                  className="rounded-2xl border border-accent-gold/30 bg-accent-gold/5 p-5"
                  aria-live="polite"
                >
                  <p className="font-serif text-lg text-text-primary leading-tight mb-2 flex items-center gap-2">
                    <Check className="w-4 h-4 text-accent-gold" strokeWidth={3} />
                    You're on the waitlist
                  </p>
                  <p className="text-sm text-text-secondary mb-4">
                    We'll text you on WhatsApp if a slot opens up on{' '}
                    {formatDateLabel(dateKey)}.
                  </p>
                  <button
                    type="button"
                    onClick={() => removeWaitlistRequest(dateOnlyWaitlistEntry.id)}
                    className="text-[11px] uppercase tracking-wider text-text-secondary underline hover:text-text-primary transition-colors"
                  >
                    Leave waitlist
                  </button>
                </div>
              ) : (
                <div
                  className="rounded-2xl border border-accent-gold/30 bg-accent-gold/5 p-5"
                  aria-live="polite"
                >
                  <p className="font-serif text-lg text-text-primary leading-tight mb-2">
                    No slots on this date.
                  </p>
                  <p className="text-sm text-text-secondary mb-4">
                    Join the waitlist and we'll let you know if a slot opens up.
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      openWaitlist({
                        preferredDate: dateKey,
                        source: 'date-full',
                      })
                    }
                    className="inline-flex items-center gap-2 rounded-full bg-bg-dark text-white px-5 py-3 text-sm font-medium hover:bg-bg-darker transition-colors"
                  >
                    <Bell className="w-4 h-4" strokeWidth={1.5} />
                    Join the waitlist
                  </button>
                </div>
              )
            ) : (
              <div className="space-y-6">
                {sections.map(([label, items]) =>
                  items.length > 0 ? (
                    <div key={label}>
                      <p className="text-xs text-text-secondary mb-3">{label}</p>
                      <div className="flex flex-wrap gap-2">
                        {items.map((s) => {
                          const active = s.time === selectedTime;
                          return (
                            <button
                              key={s.time}
                              type="button"
                              disabled={!s.available}
                              onClick={() => onPickTime(s.time)}
                              className={cn(
                                'px-4 py-2 rounded-full text-xs transition-colors border',
                                !s.available &&
                                  'border-black/5 text-text-muted line-through cursor-not-allowed',
                                s.available &&
                                  !active &&
                                  'border-black/15 text-text-primary hover:bg-black/5',
                                active && 'bg-bg-dark text-white border-bg-dark'
                              )}
                              aria-label={`${s.label}${!s.available ? ' (unavailable)' : ''}`}
                            >
                              {s.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : null
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sticky CTA */}
      <div className="flex-shrink-0 border-t border-black/10 bg-bg-primary px-6 pt-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
        <button
          type="button"
          disabled={!canContinue}
          onClick={handleContinue}
          className={cn(
            'w-full rounded-full py-4 text-sm font-medium transition-colors',
            canContinue
              ? 'bg-bg-dark text-white hover:bg-bg-darker'
              : 'bg-black/10 text-text-muted cursor-not-allowed'
          )}
        >
          Add slot
        </button>
      </div>

      <WaitlistSheet
        open={!!waitlistContext}
        onClose={() => setWaitlistContext(null)}
        context={waitlistContext}
      />
    </div>
  );
}
