/**
 * Placeholder for the slot grid while `useAvailability` is in flight.
 *
 * Availability is a network call, and on a cold lambda it can take a second
 * or two. Without this the slot section renders from an empty `slots` array,
 * which is indistinguishable from "this date is fully booked" — a slow load
 * read as no availability and pushed people at the waitlist. The skeleton
 * mirrors the real grid (period label + pill rows) so the swap to real slots
 * doesn't shift the layout underneath the user.
 */
import { Loader2 } from 'lucide-react';

// Shapes only — counts are picked to look like a plausible day, not to
// predict what the API will return.
const ROWS: [string, number][] = [
  ['Morning', 5],
  ['Afternoon', 7],
  ['Evening', 4],
];

export function SlotGridSkeleton() {
  return (
    <div aria-live="polite" aria-busy="true">
      <p className="flex items-center gap-2 text-sm text-text-secondary mb-5">
        <Loader2
          className="w-3.5 h-3.5 animate-spin shrink-0"
          strokeWidth={1.5}
          aria-hidden="true"
        />
        Checking availability for this date…
      </p>

      <div className="space-y-6 animate-pulse" aria-hidden="true">
        {ROWS.map(([label, count]) => (
          <div key={label}>
            <div className="h-3 w-20 rounded-full bg-black/10 mb-3" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="h-[34px] w-[4.75rem] rounded-full bg-black/5" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
