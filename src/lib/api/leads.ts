/**
 * Leads API — fire-and-forget customer-lead capture to waitzeros-leads-dev.
 *
 *   POST /leads/capture   (public, no auth)
 *     body: { source, name?, email?, phone?, interest?, brand_key?, lead_source? }
 *     → 201 { id, message } | 400 validation
 *
 * These calls are best-effort: the forms already persist to localStorage and
 * (for the Wellness Hub) open WhatsApp, so lead capture must NEVER block or
 * break the user flow. Callers invoke via `void submitLead(...).catch(() => {})`.
 *
 * partner_id is resolved SERVER-SIDE from `brand_key` (or the lambda's default
 * partner) — the client never sends a partner_id.
 */
import { apiClient } from './client';

export type LeadSource = 'WELLNESS_HUB' | 'NEWSLETTER';
export type LeadInterest =
  | 'HAIR_SKIN'
  | 'WELLNESS_RECOVERY'
  | 'BRIDAL_SPECIAL'
  | 'ALL';

export interface LeadCapturePayload {
  source: LeadSource;
  name?: string;
  email?: string;
  phone?: string;
  interest?: LeadInterest;
  /** Opaque per-brand key mapped to a partner_id server-side. Optional. */
  brand_key?: string;
  lead_source?: string;
}

/** Best-effort capture. Resolves on 2xx; rejects on error (callers swallow). */
export function submitLead(payload: LeadCapturePayload): Promise<void> {
  return apiClient.post<void>('/leads/capture', payload);
}
