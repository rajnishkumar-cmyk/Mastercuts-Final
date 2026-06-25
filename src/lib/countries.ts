/**
 * Supported phone countries for the contact/login inputs.
 *
 * Single source of truth — the PhoneNumberInput and any validation read from
 * here, so adding a country is a one-line change (no code edits elsewhere).
 * Phase 1 supports UAE (default) and India only.
 */
export interface Country {
  /** ISO 3166-1 alpha-2 code, used as the stable select key. */
  iso2: string;
  /** Display name. */
  name: string;
  /** E.164 dial code, including the leading '+'. */
  dialCode: string;
  /** Emoji flag for the dropdown. */
  flag: string;
  /** Example national number, shown as the input placeholder. */
  placeholder: string;
}

export const SUPPORTED_COUNTRIES: Country[] = [
  {
    iso2: 'AE',
    name: 'United Arab Emirates',
    dialCode: '+971',
    flag: '🇦🇪',
    placeholder: '50 123 4567',
  },
  {
    iso2: 'IN',
    name: 'India',
    dialCode: '+91',
    flag: '🇮🇳',
    placeholder: '98765 43210',
  },
];

/** Default selection — UAE (+971). */
export const DEFAULT_COUNTRY: Country = SUPPORTED_COUNTRIES[0];

export function findCountryByIso2(iso2: string): Country | undefined {
  return SUPPORTED_COUNTRIES.find((c) => c.iso2 === iso2);
}

/**
 * Match an E.164 number to its country by dial-code prefix. Longest dial code
 * wins so e.g. "+971…" matches AE and not a shorter overlapping code.
 */
export function findCountryByNumber(e164: string): Country | undefined {
  const v = (e164 || '').trim();
  return [...SUPPORTED_COUNTRIES]
    .sort((a, b) => b.dialCode.length - a.dialCode.length)
    .find((c) => v.startsWith(c.dialCode));
}
