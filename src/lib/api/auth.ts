/**
 * Auth API — talks to the mastercuts-customer-login Lambda (email-primary).
 *
 * Endpoints (see lambdas/mastercuts-customer-login/index.mjs):
 *   POST /auth/send-otp     { email, mobileNumber?, name? }        → { channel }
 *   POST /auth/resend-otp   { email, mobileNumber?, name? }        → { channel }
 *   POST /auth/verify-otp   { email, otp, mobileNumber?, name? }   → { token, customer }
 *   GET  /auth/me           (Bearer)                               → { claims }
 *
 * Notes:
 *   - `email` is the login identity and the OTP lookup key (normalised
 *     lowercase via lib/email.ts). OTP is delivered email-first; `mobileNumber`,
 *     when supplied, is the SMS-fallback target and the saved contact number.
 *     The contact field stays `mobileNumber` to match the legacy auth contract.
 *   - `name` is optional — collected on a later step; the Lambda accepts empty.
 *   - All functions throw `ApiError` / `NetworkError` on failure.
 */
import { apiClient } from './client';

export type OtpChannel = 'email' | 'sms' | 'whatsapp' | 'none';

export interface SendOtpResponse {
  channel: OtpChannel;
}

export interface VerifyOtpResponse {
  token: string;
  customer: {
    id: string;
    name: string;
    email: string;
    mobile: string | null;
  };
}

export interface AuthClaims {
  customer_id: string;
  email: string;
  mobileNumber: string | null;
  name: string;
  partner_id: string;
  iat?: number;
  exp?: number;
}

export interface MeResponse {
  claims: AuthClaims;
}

interface OtpRequestBody {
  email: string;
  // Contact phone; field name matches the legacy auth contract.
  mobileNumber?: string;
  name?: string;
}

interface VerifyOtpBody extends OtpRequestBody {
  otp: string;
}

export function sendOtp(
  email: string,
  phone = '',
  name = '',
): Promise<SendOtpResponse> {
  const body: OtpRequestBody = { email, mobileNumber: phone, name };
  return apiClient.post<SendOtpResponse>('/auth/send-otp', body);
}

export function resendOtp(
  email: string,
  phone = '',
  name = '',
): Promise<SendOtpResponse> {
  const body: OtpRequestBody = { email, mobileNumber: phone, name };
  return apiClient.post<SendOtpResponse>('/auth/resend-otp', body);
}

export function verifyOtp(
  email: string,
  otp: string,
  phone = '',
  name = '',
): Promise<VerifyOtpResponse> {
  const body: VerifyOtpBody = { email, otp, mobileNumber: phone, name };
  return apiClient.post<VerifyOtpResponse>('/auth/verify-otp', body);
}

export function getMe(token: string): Promise<MeResponse> {
  return apiClient.get<MeResponse>('/auth/me', { token });
}
