/**
 * Resolved, validated runtime env for the API layer.
 *
 * This is the ONE place we read `import.meta.env`. Everything else imports
 * from here so:
 *   1. The `VITE_API_BASE_URL` literal lives in one place.
 *   2. We fail loudly at module-load time (red error in the dev console
 *      and a thrown error from `getApiBaseUrl`) if the env var is missing,
 *      instead of every fetch silently hitting `undefined/auth/send-otp`.
 *
 * Why a getter instead of a top-level `const`: in some test/SSR setups the
 * env isn't ready at module evaluation, and we'd rather not crash the
 * whole bundle just because one consumer was eagerly imported. The getter
 * still throws on first use, which is when we actually need the value.
 */

function readApiBaseUrl(): string {
  const raw = import.meta.env.VITE_API_BASE_URL;
  if (!raw || typeof raw !== 'string' || raw.trim() === '') {
    throw new Error(
      '[api/env] VITE_API_BASE_URL is not set. Add it to your .env.local ' +
        '(see .env.example) and restart the dev server.',
    );
  }
  // Strip trailing slash so callers can join paths with a leading "/".
  return raw.replace(/\/+$/, '');
}

let cached: string | null = null;

export function getApiBaseUrl(): string {
  if (cached === null) {
    cached = readApiBaseUrl();
  }
  return cached;
}

/**
 * The partner (tenant) this deployment books for, sent as `X-Partner-Id` on
 * every API call.
 *
 * The salon lambdas resolve a request's partner from this header and fall back
 * to their deployed env partner when it is absent. This build is single-brand,
 * so the value is a build-time constant rather than anything the user can
 * influence — there is no tenant picker, and nothing reads it from the URL,
 * localStorage or the JWT.
 *
 * Deliberately OPTIONAL, unlike the base URL: when unset we omit the header and
 * the backend keeps its existing behaviour. That makes adding the variable a
 * safe, independently-deployable step — a bundle built before the var existed
 * behaves exactly as it does today instead of throwing at startup.
 */
function readPartnerId(): string | undefined {
  const raw = import.meta.env.VITE_PARTNER_ID;
  if (!raw || typeof raw !== 'string' || raw.trim() === '') return undefined;
  return raw.trim();
}

// `undefined` is a legitimate resolved value here, so the `null` sentinel the
// base-URL memo uses does not work — track resolution with a separate flag.
let partnerResolved = false;
let partnerCached: string | undefined;

export function getPartnerId(): string | undefined {
  if (!partnerResolved) {
    partnerCached = readPartnerId();
    partnerResolved = true;
  }
  return partnerCached;
}
