/**
 * Typed errors thrown by the API client.
 *
 * Two categories so callers can branch UX:
 *   - `ApiError`     — server returned a non-2xx with a JSON body. Carries
 *                      the original status code, the `message` field from
 *                      the createResponse envelope, and any `data` payload.
 *   - `NetworkError` — fetch itself rejected (offline, DNS, CORS preflight
 *                      failure, request aborted). No HTTP status.
 *
 * Both extend the native Error so they survive `throw` across async
 * boundaries and play nicely with React error boundaries / Sentry.
 */

export class ApiError extends Error {
  readonly statusCode: number;
  readonly data: unknown;

  constructor(statusCode: number, message: string, data: unknown = null) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.data = data;
  }
}

export class NetworkError extends Error {
  readonly cause?: unknown;

  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = 'NetworkError';
    this.cause = cause;
  }
}

/**
 * Narrow a thrown value into a user-facing message string. Use in catch
 * blocks where you only want a single line for an inline form error.
 */
export function toErrorMessage(err: unknown, fallback = 'Something went wrong'): string {
  if (err instanceof ApiError || err instanceof NetworkError) {
    return err.message || fallback;
  }
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}
