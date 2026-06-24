/**
 * Bookings API — talks to mastercuts-book-slot.
 *
 *   POST /bookings     (Bearer)
 *     body: { service_ids[], date, slot_time, customer_name?, customer_email?,
 *             customer_gender?, customer_address?, notes? }
 *     → 201 { booking, notify } | 409 slot full | 400 invalid
 *
 *   GET  /bookings/:id (Bearer)
 *     → 200 { booking } | 404 not found | 403 not yours
 *
 * `customer_address` is an opaque string for Phase 1 (the address sheet
 * already renders flat/villa + landmark); we serialize it to a one-line
 * label before sending.
 */
import { apiClient } from './client';

export interface BookingServiceSnapshot {
  id: string;
  name: string;
  department_id?: string;
  duration_min: number;
  price: number;
}

export interface BookingCustomer {
  name?: string;
  mobile?: string;
  gender?: string;
  address?: string;
}

export interface BookingRecord {
  id: string;
  booking_token: string;
  date: string;                     // "YYYY-MM-DD"
  slot_time: string;                // "HH:mm"
  services: BookingServiceSnapshot[];
  total_price: number;
  total_duration_min: number;
  currency: string;
  payment_status: string;           // "pay_at_salon" in Phase 1
  customer: BookingCustomer;
  is_cancelled?: boolean;
}

export interface NotifyResult {
  channel: 'whatsapp' | 'sms' | 'email' | 'none' | 'skipped';
  error?: string;
}

export interface CreateBookingResponse {
  booking: BookingRecord;
  notify: {
    customer: NotifyResult;
    customerEmail?: NotifyResult;
    admin: NotifyResult;
    adminEmail?: NotifyResult;
  };
}

export interface CreateBookingPayload {
  service_ids: string[];
  date: string;
  slot_time: string;
  customer_name?: string;
  customer_email?: string;
  customer_mobile?: string;
  customer_gender?: string;
  customer_address?: string;
  notes?: string;
}

export function createBooking(
  payload: CreateBookingPayload,
  token: string,
  signal?: AbortSignal,
): Promise<CreateBookingResponse> {
  return apiClient.post<CreateBookingResponse>('/bookings', payload, {
    token,
    signal,
  });
}

export interface GetBookingResponse {
  booking: BookingRecord;
}

export function getBooking(
  id: string,
  token: string,
  signal?: AbortSignal,
): Promise<GetBookingResponse> {
  return apiClient.get<GetBookingResponse>(`/bookings/${encodeURIComponent(id)}`, {
    token,
    signal,
  });
}
