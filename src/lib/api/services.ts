/**
 * Services API — talks to mastercuts-availability `/services`.
 *
 * Response shape (see lambdas/mastercuts-availability listServices):
 *   {
 *     currency: "AED",
 *     channels: [{
 *       id, name, short_name, sort_order,
 *       meta_information: { eyebrow?, status?, access_note?, slug? },
 *       sub_categories: [{
 *         id, name, short_name, sort_order,
 *         meta_information: { tagline?, status?, slug? },
 *         services: [{ id, name, department_id, description, duration_min,
 *                      price, currency, sort_order }]
 *       }]
 *     }]
 *   }
 *
 * `status` on channels / sub-categories takes values:
 *   "active" | "coming-soon" | "not-launched" | "invite-only"
 */
import { apiClient } from './client';

export type ChannelStatus =
  | 'active'
  | 'coming-soon'
  | 'not-launched'
  | 'invite-only';

export interface ApiServiceMeta {
  slug?: string;
  tagline?: string;
  eyebrow?: string;
  status?: ChannelStatus;
  access_note?: string;
  audience?: string;
  audience_filter?: string;
}

export interface ApiService {
  id: string;
  name: string;
  department_id: string;
  description: string;
  duration_min: number;
  price: number;
  currency: string;
  sort_order: number;
  // Duration-variant grouping (backend `serializeService`). Rows sharing a
  // `variant_group` are durations of the same logical service and collapse into
  // one card; each keeps its own `id`/`price` so the booking payload is
  // unchanged (the chosen variant's real id is what gets booked).
  variant_group?: string;
  variant_label?: string;
  variant_sort?: number;
}

export interface ApiSubCategory {
  id: string;
  name: string;
  short_name?: string;
  sort_order: number;
  meta_information: ApiServiceMeta;
  services: ApiService[];
}

export interface ApiChannel {
  id: string;
  name: string;
  short_name?: string;
  sort_order: number;
  meta_information: ApiServiceMeta;
  sub_categories: ApiSubCategory[];
}

export interface ServicesResponse {
  currency: string;
  channels: ApiChannel[];
}

export function fetchServices(signal?: AbortSignal): Promise<ServicesResponse> {
  return apiClient.get<ServicesResponse>('/services', { signal });
}
