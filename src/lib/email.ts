/**
 * Email helpers for the auth flow. Email is the login identity, so we keep
 * normalisation deterministic (trim + lowercase) and validation permissive
 * but sane — the backend re-validates via OTP delivery anyway.
 */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmail(raw: string): string {
  return String(raw ?? '').trim().toLowerCase();
}

export function isValidEmail(raw: string): boolean {
  return EMAIL_RE.test(normalizeEmail(raw));
}
