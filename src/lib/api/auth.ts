/**
 * Auth API — talks to the mastercuts-customer-login Lambda.
 *
 * Endpoints (see lambdas/mastercuts-customer-login/index.mjs):
 *   POST /auth/send-otp     { name, mobileNumber }                       → { channel }
 *   POST /auth/resend-otp   { name, mobileNumber }                       → { channel }
 *   POST /auth/verify-otp   { name, mobileNumber, otp }                  → { token, customer }
 *   GET  /auth/me           (Bearer)                                     → { claims }
 *
 * Notes:
 *   - `name` is sent as an empty string on Phase 1 — the UI collects it on
 *     a later step (post-OTP profile). The Lambda accepts empty names.
 *   - `mobileNumber` is the normalized E.164-ish string from
 *     `lib/phone.ts` — never the raw input. That keeps OTP lookups
 *     deterministic across "+91 98xxx" / "+919xxxx" formatting variations.
 *   - All four functions throw `ApiError` / `NetworkError` on failure; the
 *     caller renders the message inline.
 */
import { apiClient } from './client';

export type OtpChannel = 'whatsapp' | 'sms' | 'none';

export interface SendOtpResponse {
  channel: OtpChannel;
}

export interface VerifyOtpResponse {
  token: string;
  customer: {
    id: string;
    name: string;
    mobile: string;
  };
}

export interface AuthClaims {
  customer_id: string;
  mobileNumber: string;
  name: string;
  partner_id: string;
  iat?: number;
  exp?: number;
}

export interface MeResponse {
  claims: AuthClaims;
}

interface OtpRequestBody {
  name: string;
  mobileNumber: string;
}

interface VerifyOtpBody extends OtpRequestBody {
  otp: string;
}

export function sendOtp(
  mobileNumber: string,
  name = '',
): Promise<SendOtpResponse> {
  const body: OtpRequestBody = { name, mobileNumber };
  return apiClient.post<SendOtpResponse>('/auth/send-otp', body);
}

export function resendOtp(
  mobileNumber: string,
  name = '',
): Promise<SendOtpResponse> {
  const body: OtpRequestBody = { name, mobileNumber };
  return apiClient.post<SendOtpResponse>('/auth/resend-otp', body);
}

export function verifyOtp(
  mobileNumber: string,
  otp: string,
  name = '',
): Promise<VerifyOtpResponse> {
  const body: VerifyOtpBody = { name, mobileNumber, otp };
  return apiClient.post<VerifyOtpResponse>('/auth/verify-otp', body);
}

export function getMe(token: string): Promise<MeResponse> {
  return apiClient.get<MeResponse>('/auth/me', { token });
}
