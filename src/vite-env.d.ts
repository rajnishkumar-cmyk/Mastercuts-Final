/// <reference types="vite/client" />

/**
 * Typed declarations for the env vars Vite exposes to client code.
 *
 * All vars MUST be prefixed `VITE_` (Vite hides anything else). Adding a
 * new entry here makes it discoverable via `import.meta.env.<NAME>` with
 * proper TypeScript narrowing.
 *
 * Note: every key is still typed `string | undefined` because Vite doesn't
 * guarantee presence at compile time. Use `src/lib/api/env.ts` to resolve
 * required vars with a single throw site.
 */
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_OTP_LENGTH?: string;
  readonly VITE_OTP_RESEND_COOLDOWN_SEC?: string;
  /** Partner (tenant) id sent as `X-Partner-Id`. See src/lib/api/env.ts. */
  readonly VITE_PARTNER_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
