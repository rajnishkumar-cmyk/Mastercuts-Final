/**
 * useAvailability — React hook around the `/availability` API.
 *
 * Returns slots in the same shape consumers used from the old deterministic
 * mock (`TimeSlot`), so swapping the call site doesn't ripple into render
 * logic. The hook:
 *
 *   1. Fetches the API on every dateKey / cart-services change (cancels
 *      in-flight on swap).
 *   2. Gates each slot purely on the server's `available` flag.
 *
 * Why no client-side duration filtering any more: the lambda is asked about
 * the cart's actual `service_ids`, so its `available` already accounts for
 * the FULL span a booking occupies — service time plus therapist turnaround
 * — across every grid cell, not just the starting one, as well as the
 * closing-time and minimum-lead rules.
 *
 * The old local `fitsBeforeClose` check only compared the start time against
 * closing. It could not see a booking sitting in the middle of the span, so
 * a 2h cart was offered 2:45 PM while 4:00 PM was already reserved, and the
 * booking then failed with a 409 at `reserveSpan`. Re-deriving any of this
 * on the client is what let the two sides drift; don't reintroduce it.
 *
 * The hook does NOT replace the `?qa=full` test override — that lived in
 * the old mock for waitlist demos. If you need to force-empty an API run,
 * pick a date that's actually full (capacity exhausted).
 */
import { useEffect, useRef, useState } from 'react';

import { fetchAvailability, type ApiSlot } from '../api/availability';
import { ApiError, NetworkError } from '../api/errors';
import type { TimeSlot } from './availability';

export interface AvailabilityState {
  status: 'idle' | 'loading' | 'ready' | 'error';
  slots: TimeSlot[];
  capacity: number;
  openingHours: { start: string; end: string } | null;
  error: string | null;
}

const INITIAL: AvailabilityState = {
  status: 'idle',
  slots: [],
  capacity: 0,
  openingHours: null,
  error: null,
};

function formatTimeLabel(hhmm: string): string {
  const [hStr, mStr] = hhmm.split(':');
  const hour = Number(hStr);
  const min = Number(mStr);
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:${String(min).padStart(2, '0')} ${period}`;
}

function minutesFromOpen(slotTime: string, openStart: string): number {
  const [sh, sm] = slotTime.split(':').map(Number);
  const [oh, om] = openStart.split(':').map(Number);
  return (sh - oh) * 60 + (sm - om);
}

function toTimeSlots(
  apiSlots: ApiSlot[],
  openingHours: { start: string; end: string },
): TimeSlot[] {
  return apiSlots.map((s) => ({
    time: s.slot_time,
    label: formatTimeLabel(s.slot_time),
    minutesFromOpen: minutesFromOpen(s.slot_time, openingHours.start),
    // `is_past` is re-checked because the grid can stay open across the
    // boundary that makes a slot stale; everything else is the server's call.
    available: s.available && !s.is_past,
  }));
}

/**
 * @param dateKey     "YYYY-MM-DD", or null while no date is chosen.
 * @param serviceIds  The cart's booked service ids — see
 *                    `useCartServiceIds`. Must be the SAME list the booking
 *                    will post, or the grid offers slots that 409.
 */
export function useAvailability(
  dateKey: string | null,
  serviceIds: string[],
): AvailabilityState {
  const [state, setState] = useState<AvailabilityState>(INITIAL);
  const abortRef = useRef<AbortController | null>(null);

  // Compared by value: a caller passing an inline array must not refetch on
  // every render, and changing the cart contents must refetch.
  const serviceKey = serviceIds.join(',');

  useEffect(() => {
    if (!dateKey) {
      abortRef.current?.abort();
      setState(INITIAL);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setState((prev) => ({ ...prev, status: 'loading', error: null }));

    const ids = serviceKey ? serviceKey.split(',') : [];
    fetchAvailability(dateKey, ids, controller.signal)
      .then((res) => {
        if (controller.signal.aborted) return;
        setState({
          status: 'ready',
          slots: toTimeSlots(res.slots, res.opening_hours),
          capacity: res.capacity,
          openingHours: res.opening_hours,
          error: null,
        });
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        const message =
          err instanceof ApiError
            ? `Availability API ${err.statusCode}: ${err.message}`
            : err instanceof NetworkError
              ? err.message
              : 'Failed to load availability';
        setState({
          status: 'error',
          slots: [],
          capacity: 0,
          openingHours: null,
          error: message,
        });
      });

    return () => {
      controller.abort();
    };
  }, [dateKey, serviceKey]);

  return state;
}
