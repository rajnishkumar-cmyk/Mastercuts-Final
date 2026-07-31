/**
 * Availability API — talks to mastercuts-availability `/availability`.
 *
 * Response shape (see lambdas/mastercuts-availability listAvailability):
 *   {
 *     date: "YYYY-MM-DD",
 *     slot_size_min: number,
 *     capacity: number,
 *     opening_hours: { start: "HH:mm", end: "HH:mm" },
 *     requested: { duration_min, buffer_min, occupancy_min, resolved_from },
 *     slots: [{ slot_time, available, remaining, span_remaining, … }]
 *   }
 *
 * Slot semantics:
 *   - `available` = the slot is a valid START: it meets the lead time, the
 *     services fit before closing, AND every grid cell the booking would
 *     occupy (service time + therapist turnaround) still has capacity.
 *     This is the ONLY field the UI should gate on.
 *   - `remaining` = capacity at the START cell alone. Legacy field, kept for
 *     the pre-span contract. Reading it as "bookable" is what caused
 *     2:45 PM to be offered for a 2h cart while 4:00 PM was already booked.
 *   - `is_past` = slot_time is earlier than current wall-clock in salon tz
 *   - past slots are still returned so the UI can render them disabled
 *
 * `service_ids` is REQUIRED for a meaningful grid. Without it the lambda
 * falls back to a single-cell, zero-buffer span — i.e. it answers "is this
 * one 15-minute cell free?", not "can my booking start here?". Passing the
 * ids (rather than a raw duration) also lets the lambda apply the
 * per-service turnaround overrides that book-slot uses, so the availability
 * grid and `reserveSpan` compute an identical occupancy.
 */
import { apiClient } from './client';

export interface ApiSlot {
  slot_time: string;       // "HH:mm"
  available: boolean;
  remaining: number;       // start cell only — do not gate on this
  span_remaining: number;  // worst capacity across the whole occupied span
  capacity: number;
  is_past: boolean;
  within_lead_time?: boolean;
  fits_before_close?: boolean;
  span_end?: string | null;
}

export interface AvailabilityRequested {
  duration_min: number;
  buffer_min: number;
  occupancy_min: number;
  span_cells: number;
  resolved_from: 'default' | 'duration_min' | 'service_ids';
}

export interface AvailabilityResponse {
  date: string;            // "YYYY-MM-DD"
  slot_size_min: number;
  capacity: number;
  opening_hours: { start: string; end: string };
  requested?: AvailabilityRequested;
  slots: ApiSlot[];
}

export function fetchAvailability(
  date: string,
  serviceIds: string[],
  signal?: AbortSignal,
): Promise<AvailabilityResponse> {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return Promise.reject(
      new Error(`fetchAvailability: invalid date "${date}", expected YYYY-MM-DD`),
    );
  }

  const params = new URLSearchParams({ date });
  // Duplicates are meaningful — the same add-on booked twice costs its time
  // twice — so the list is sent verbatim, matching the booking payload.
  if (serviceIds.length > 0) {
    params.set('service_ids', serviceIds.join(','));
  }

  return apiClient.get<AvailabilityResponse>(`/availability?${params}`, {
    signal,
  });
}
