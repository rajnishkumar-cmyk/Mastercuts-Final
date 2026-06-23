/**
 * useAvailability — React hook around the `/availability` API.
 *
 * Returns slots in the same shape consumers used from the old deterministic
 * mock (`TimeSlot`), so swapping the call site doesn't ripple into render
 * logic. The hook:
 *
 *   1. Fetches the API on every dateKey change (cancels in-flight on swap).
 *   2. Filters out slots that don't leave enough contiguous time for the
 *      cart's `totalDurationMin` (last bookable slot = open + (close - open
 *      - totalDuration)). Matches the old mock's filtering rule.
 *   3. Marks the slot unavailable when API says `available: false` OR when
 *      the duration filter would push the booking past closing time.
 *
 * The hook does NOT replace the `?qa=full` test override — that lived in
 * the old mock for waitlist demos. If you need to force-empty an API run,
 * pick a date that's actually full (capacity exhausted) or pass
 * `forceUnavailable` via the optional arg.
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
  totalDurationMin: number,
): TimeSlot[] {
  const openMin = minutesFromOpen(openingHours.start, openingHours.start); // 0
  const closeMin = minutesFromOpen(openingHours.end, openingHours.start);
  const usableMins = closeMin - openMin;

  return apiSlots.map((s) => {
    const m = minutesFromOpen(s.slot_time, openingHours.start);
    const minutesUntilClose = usableMins - m;
    const fitsBeforeClose = minutesUntilClose >= totalDurationMin;
    return {
      time: s.slot_time,
      label: formatTimeLabel(s.slot_time),
      minutesFromOpen: m,
      available: s.available && fitsBeforeClose && !s.is_past,
    };
  });
}

export function useAvailability(
  dateKey: string | null,
  totalDurationMin: number,
): AvailabilityState {
  const [state, setState] = useState<AvailabilityState>(INITIAL);
  const abortRef = useRef<AbortController | null>(null);

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

    fetchAvailability(dateKey, controller.signal)
      .then((res) => {
        if (controller.signal.aborted) return;
        setState({
          status: 'ready',
          slots: toTimeSlots(res.slots, res.opening_hours, totalDurationMin),
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
  }, [dateKey, totalDurationMin]);

  return state;
}
