import { useMemo, useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { useCart, useCartTotals, formatDuration } from '../CartProvider';
import {
  getSlotsForDate,
  groupSlotsByPeriod,
  toDateKey,
  isDateClosed,
  isDatePast,
} from '@/lib/booking/availability';
import { cn } from '@/lib/utils';

export function DateTimeStep() {
  const { cart, updateDraftCheckout, setCheckoutStep } = useCart();
  const { totalDuration } = useCartTotals();

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

        {date && (
          <div className="px-6 pb-4 pt-2">
            <p className="text-[10px] uppercase tracking-[0.18em] text-text-secondary mb-4">
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
    </div>
  );
}
