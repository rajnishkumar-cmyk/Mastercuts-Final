import { useMemo, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { Calendar } from '@/components/ui/calendar';
import { useCart, useCartTotals, formatDuration } from '@/components/cart/CartProvider';
import {
  getSlotsForDate,
  groupSlotsByPeriod,
  toDateKey,
  isDateClosed,
  isDatePast,
} from '@/lib/booking/availability';
import { cn } from '@/lib/utils';

interface Props {
  onContinue: () => void;
}

export function Step1DateTime({ onContinue }: Props) {
  const { cart, updateDraftCheckout } = useCart();
  const { totalDuration } = useCartTotals();
  const reduce = useReducedMotion();
  const slotsHeadingRef = useRef<HTMLParagraphElement | null>(null);

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

    // After the slot section renders, scroll its heading into view so the
    // user knows the next step lives below the calendar. Skips the scroll
    // if the heading is already fully visible (e.g. on tall viewports).
    // rAF ensures the slots DOM has committed before we measure.
    requestAnimationFrame(() => {
      const el = slotsHeadingRef.current;
      if (!el) return;
      const scroller = el.closest('.overflow-y-auto') as HTMLElement | null;
      if (!scroller) return;
      const elRect = el.getBoundingClientRect();
      const scrRect = scroller.getBoundingClientRect();
      const alreadyVisible =
        elRect.top >= scrRect.top && elRect.bottom <= scrRect.bottom;
      if (alreadyVisible) return;
      el.scrollIntoView({
        behavior: reduce ? 'auto' : 'smooth',
        block: 'start',
      });
    });
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

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-6 pt-6 pb-4">
        <p className="text-[10px] uppercase tracking-[0.2em] text-text-secondary mb-3">
          Step 01 · When
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

      {date && (
        <p className="px-6 mt-1 mb-1 text-[11px] uppercase tracking-[0.18em] text-text-secondary flex items-center gap-1.5">
          <span aria-hidden="true">↓</span>
          Pick your time below
        </p>
      )}

      {date && (
        <div className="px-6 pb-4 pt-2">
          <p
            ref={slotsHeadingRef}
            className="text-[10px] uppercase tracking-[0.18em] text-text-secondary mb-4 scroll-mt-4"
          >
            Available slots
          </p>
          {sections.every(([, items]) => items.length === 0) ? (
            <p className="text-sm text-text-secondary">
              No availability on this date — please try another day.
            </p>
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

      {/* Sticky bottom CTA */}
      <div className="sticky bottom-0 bg-bg-primary border-t border-black/10 px-6 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <button
          type="button"
          disabled={!canContinue}
          onClick={onContinue}
          className={cn(
            'w-full rounded-full py-4 text-sm font-medium transition-colors',
            canContinue
              ? 'bg-bg-dark text-white hover:bg-bg-darker'
              : 'bg-black/10 text-text-muted cursor-not-allowed'
          )}
        >
          Continue to details
        </button>
      </div>
    </div>
  );
}
