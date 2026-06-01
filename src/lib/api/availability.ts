/**
 * Availability API — talks to mastercuts-availability `/availability`.
 *
 * Response shape (see lambdas/mastercuts-availability listAvailability):
 *   {
 *     date: "YYYY-MM-DD",
 *     slot_size_min: number,
 *     capacity: number,
 *     opening_hours: { start: "HH:mm", end: "HH:mm" },
 *     slots: [{ slot_time, available, remaining, capacity, is_past }]
 *   }
 *
 * Slot semantics:
 *   - `available` = future AND remaining > 0
 *   - `is_past`   = slot_time is earlier than current wall-clock in salon tz
 *   - past slots are still returned so the UI can render them disabled
 */
import { apiClient } from './client';

export interface ApiSlot {
  slot_time: string;       // "HH:mm"
  available: boolean;
  remaining: number;
  capacity: number;
  is_past: boolean;
}

export interface AvailabilityResponse {
  date: string;            // "YYYY-MM-DD"
  slot_size_min: number;
  capacity: number;
  opening_hours: { start: string; end: string };
  slots: ApiSlot[];
}

export function fetchAvailability(
  date: string,
  signal?: AbortSignal,
): Promise<AvailabilityResponse> {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return Promise.reject(
      new Error(`fetchAvailability: invalid date "${date}", expected YYYY-MM-DD`),
    );
  }
  return apiClient.get<AvailabilityResponse>(`/availability?date=${date}`, {
    signal,
  });
}
