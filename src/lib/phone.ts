/**
 * Phone number helpers — permissive validation, deterministic normalization.
 *
 * Why "accept both UAE and India":
 *   The salon's copy still references Dubai, but the backend is being
 *   deployed to ap-south-1 (Mumbai) for shared infra with WaitZeros.
 *   Until the regional copy pass lands, we let users enter either
 *   format and normalize to the same E.164-ish string the backend keys
 *   OTP records by.
 *
 * Accepted input shapes (whitespace, dashes and parentheses are stripped
 * before testing):
 *   +971 50 123 4567       UAE international
 *   050 123 4567           UAE local      → +971…
 *   +91 98765 43210        India international
 *   9876543210             India local    → +91…
 *   +<cc>XXXXXXXXX         Any 8–15 digit international number
 *
 * Anything else is rejected. We deliberately don't pull in libphonenumber
 * here — the matrix above covers Phase 1 and the bundle savings are real
 * (libphonenumber-js is ~140 KB minified).
 */

/** Strip everything that isn't a digit or a leading +. */
function stripFormatting(raw: string): string {
  return raw.replace(/[\s\-()]/g, '');
}

/** Pure check — does this look like something we'd accept? */
export function isValidPhone(raw: string): boolean {
  return normalizePhone(raw) !== null;
}

/**
 * Normalize an input string to E.164-ish (`+<cc><number>`) or return
 * `null` if it doesn't match an accepted shape.
 *
 * The output is what we send to the backend as `mobileNumber`. Keeping
 * normalization deterministic means OtpCheck lookups by phone always hit
 * the same row regardless of how the user typed it.
 */
export function normalizePhone(raw: string): string | null {
  if (typeof raw !== 'string') return null;
  const trimmed = stripFormatting(raw.trim());
  if (trimmed.length === 0) return null;

  // India local: 10 digits starting with 6/7/8/9 → +91...
  if (/^[6-9]\d{9}$/.test(trimmed)) {
    return `+91${trimmed}`;
  }

  // UAE local: "05" + 8 digits → drop leading 0, prefix +971.
  if (/^05\d{8}$/.test(trimmed)) {
    return `+971${trimmed.slice(1)}`;
  }

  // Already international-looking: "+" + 8–15 digits.
  if (/^\+[1-9]\d{7,14}$/.test(trimmed)) {
    return trimmed;
  }

  // Bare international without "+" but with country code (e.g. "9198..."
  // or "97150..."): accept 10–15 digits and re-add the plus.
  if (/^[1-9]\d{9,14}$/.test(trimmed)) {
    return `+${trimmed}`;
  }

  return null;
}

/**
 * Human-friendly format for display (e.g. on the OTP screen). Falls back
 * to the raw input if the normalized number doesn't match a known shape.
 */
export function formatPhoneForDisplay(normalized: string): string {
  if (normalized.startsWith('+91') && normalized.length === 13) {
    // +91 98765 43210
    return `+91 ${normalized.slice(3, 8)} ${normalized.slice(8)}`;
  }
  if (normalized.startsWith('+971') && normalized.length === 13) {
    // +971 50 123 4567
    return `+971 ${normalized.slice(4, 6)} ${normalized.slice(6, 9)} ${normalized.slice(9)}`;
  }
  return normalized;
}
