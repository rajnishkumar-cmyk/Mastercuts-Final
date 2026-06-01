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
