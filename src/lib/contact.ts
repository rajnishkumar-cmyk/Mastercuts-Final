/**
 * Studio contact details resolved from env.
 *
 * The Mastercuts phone number lives in ONE place — `VITE_STUDIO_PHONE`
 * (E.164, e.g. "+971564667165"). Everything else derives the format it
 * needs from here so the number is never hardcoded across the UI:
 *   - `STUDIO_PHONE_E164`   — raw E.164, used for `tel:` links.
 *   - `STUDIO_PHONE_DISPLAY`— human-friendly, used in visible copy.
 *   - `STUDIO_WHATSAPP`     — digits only (no "+"), for wa.me / WhatsApp.
 */
import { formatPhoneForDisplay } from './phone';

function readStudioPhone(): string {
  const raw = import.meta.env.VITE_STUDIO_PHONE;
  if (!raw || typeof raw !== 'string' || raw.trim() === '') {
    throw new Error(
      '[contact] VITE_STUDIO_PHONE is not set. Add it to your .env.local ' +
        '(see .env.example) and restart the dev server.',
    );
  }
  return raw.trim();
}

/** Raw E.164 number (e.g. "+971564667165") — for `tel:` hrefs. */
export const STUDIO_PHONE_E164 = readStudioPhone();

/** Human-friendly form (e.g. "+971 56 466 7165") — for visible copy. */
export const STUDIO_PHONE_DISPLAY = formatPhoneForDisplay(STUDIO_PHONE_E164);

/** Digits only, no leading "+" (e.g. "971564667165") — for WhatsApp. */
export const STUDIO_WHATSAPP = STUDIO_PHONE_E164.replace(/[^\d]/g, '');

function readStudioEmail(): string {
  const raw = import.meta.env.VITE_STUDIO_EMAIL;
  if (!raw || typeof raw !== 'string' || raw.trim() === '') {
    throw new Error(
      '[contact] VITE_STUDIO_EMAIL is not set. Add it to your .env.local ' +
        '(see .env.example) and restart the dev server.',
    );
  }
  return raw.trim();
}

/** Contact email (e.g. "ask@mastercuts.ae") — for `mailto:` and display. */
export const STUDIO_EMAIL = readStudioEmail();
