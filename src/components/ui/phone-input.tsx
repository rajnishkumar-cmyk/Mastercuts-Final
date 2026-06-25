import { useEffect, useMemo, useState } from 'react';
import {
  SUPPORTED_COUNTRIES,
  DEFAULT_COUNTRY,
  findCountryByIso2,
  findCountryByNumber,
  type Country,
} from '@/lib/countries';
import { cn } from '@/lib/utils';

interface PhoneNumberInputProps {
  /** E.164 value (e.g. "+971501234567") or '' when empty. */
  value: string;
  /** Called with the combined E.164 string ('' when no national digits). */
  onChange: (e164: string) => void;
  id?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  invalid?: boolean;
  describedById?: string;
}

/** Extract the national digits from an E.164 value, regardless of country. */
function nationalDigits(value: string): string {
  const c = findCountryByNumber(value);
  const rest = c ? value.slice(c.dialCode.length) : (value || '').replace(/^\+/, '');
  return rest.replace(/\D/g, '');
}

/** Combine a country + national digits into an E.164 string ('' when empty). */
function combine(country: Country, national: string): string {
  const digits = national.replace(/\D/g, '').replace(/^0+/, '');
  return digits ? `${country.dialCode}${digits}` : '';
}

/**
 * Country selector + national number, emitting a single E.164 string so it
 * drops into the existing `phone` form field unchanged. Country list comes
 * from src/lib/countries.ts.
 *
 * The selected country is held in local state (not derived purely from the
 * value) so the user can switch country even when the number field is empty —
 * an empty value can't carry a dial code.
 */
export function PhoneNumberInput({
  value,
  onChange,
  id,
  disabled,
  autoFocus,
  invalid,
  describedById,
}: PhoneNumberInputProps) {
  const [country, setCountry] = useState<Country>(
    () => findCountryByNumber(value) ?? DEFAULT_COUNTRY,
  );

  // If an external value arrives carrying a detectable (different) country
  // — e.g. editing a saved +91 number — sync the selector to it.
  useEffect(() => {
    const detected = findCountryByNumber(value);
    if (detected && detected.iso2 !== country.iso2) setCountry(detected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const national = useMemo(() => nationalDigits(value), [value]);

  return (
    <div className="flex items-stretch gap-2">
      <select
        aria-label="Country code"
        disabled={disabled}
        value={country.iso2}
        onChange={(e) => {
          const next = findCountryByIso2(e.target.value) ?? DEFAULT_COUNTRY;
          setCountry(next);
          onChange(combine(next, national));
        }}
        className={cn(
          'bg-transparent border-b py-2.5 pr-1 text-text-primary outline-none transition-colors',
          'focus:border-text-primary disabled:opacity-60',
          invalid ? 'border-red-500' : 'border-black/15',
        )}
      >
        {SUPPORTED_COUNTRIES.map((c) => (
          <option key={c.iso2} value={c.iso2}>
            {c.flag} {c.dialCode}
          </option>
        ))}
      </select>
      <input
        id={id}
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        autoFocus={autoFocus}
        disabled={disabled}
        value={national}
        placeholder={country.placeholder}
        aria-invalid={invalid || undefined}
        aria-describedby={describedById}
        onChange={(e) => onChange(combine(country, e.target.value))}
        className={cn(
          'flex-1 bg-transparent border-b py-2.5 text-text-primary outline-none transition-colors',
          'focus:border-text-primary disabled:opacity-60',
          invalid ? 'border-red-500' : 'border-black/15',
        )}
      />
    </div>
  );
}
