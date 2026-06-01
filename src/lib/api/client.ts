/**
 * Thin typed fetch wrapper for the Mastercuts backend.
 *
 * Contract assumptions (match local-dev/models-layer/.../createResponse.mjs):
 *   - Success bodies: `{ message: string, data?: T }`. We return `data` as
 *     the typed payload — callers don't see the envelope.
 *   - Error bodies: `{ message: string, data?: unknown }` with the HTTP
 *     status code as the source of truth (createResponse throws for >=400).
 *
 * Why not react-query / axios: there are only ~6 endpoints in Phase 1
 * and they each fire once per user action. Adding a data-fetching library
 * for that surface would cost more than it saves, and the typed fetch
 * here is small enough to read top-to-bottom.
 */
import { getApiBaseUrl } from './env';
import { ApiError, NetworkError } from './errors';

/** Subset of envelope fields we care about decoding. */
interface ResponseEnvelope<T> {
  message?: string;
  data?: T;
}

export interface RequestOptions {
  /** Bearer token. Sent as `Authorization: Bearer <token>` when provided. */
  token?: string;
  /** Per-request abort signal (e.g. from React unmount). */
  signal?: AbortSignal;
  /** Request timeout in ms. Default 15s. */
  timeoutMs?: number;
}

const DEFAULT_TIMEOUT_MS = 15_000;

async function parseEnvelope<T>(res: Response): Promise<ResponseEnvelope<T>> {
  // 204 No Content + error pages without JSON shouldn't crash the parser.
  const text = await res.text();
  if (!text) return {};
  try {
    return JSON.parse(text) as ResponseEnvelope<T>;
  } catch {
    // Non-JSON body (e.g. plain "Bad Gateway" from a proxy). Surface as
    // an ApiError with the raw text so the user gets *something*.
    throw new ApiError(res.status, text.slice(0, 200) || `HTTP ${res.status}`);
  }
}

/**
 * Core request function. Generic `T` is the shape of `data` inside the
 * success envelope — `void` for endpoints that return only a message.
 */
async function request<T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  path: string,
  body: unknown,
  opts: RequestOptions = {},
): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;

  const headers: Record<string, string> = {
    Accept: 'application/json',
  };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (opts.token) headers.Authorization = `Bearer ${opts.token}`;

  // Combine caller signal with our timeout via AbortController.
  const controller = new AbortController();
  const timer = setTimeout(
    () => controller.abort(new Error('Request timed out')),
    opts.timeoutMs ?? DEFAULT_TIMEOUT_MS,
  );
  if (opts.signal) {
    if (opts.signal.aborted) controller.abort(opts.signal.reason);
    else opts.signal.addEventListener('abort', () => controller.abort(opts.signal?.reason));
  }

  let res: Response;
  try {
    res = await fetch(url, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (err) {
    // fetch() rejects for network failures and aborts — both reach here.
    if (controller.signal.aborted) {
      throw new NetworkError('Request was cancelled or timed out', err);
    }
    throw new NetworkError(
      'Network error — check your connection and try again',
      err,
    );
  } finally {
    clearTimeout(timer);
  }

  const envelope = await parseEnvelope<T>(res);

  if (!res.ok) {
    throw new ApiError(
      res.status,
      envelope.message ?? `Request failed (HTTP ${res.status})`,
      envelope.data ?? null,
    );
  }

  // `data` may legitimately be absent (e.g. simple OK responses) — callers
  // who declare `T = void` get `undefined` and don't read it.
  return (envelope.data ?? (undefined as T)) as T;
}

export const apiClient = {
  get: <T>(path: string, opts?: RequestOptions) =>
    request<T>('GET', path, undefined, opts),
  post: <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    request<T>('POST', path, body, opts),
};
