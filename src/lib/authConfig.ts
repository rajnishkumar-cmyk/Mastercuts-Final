const DEFAULT_OTP_LENGTH = 4;
const DEFAULT_RESEND_COOLDOWN_SEC = 30;

function readPositiveInteger(
  value: string | undefined,
  fallback: number,
): number {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export const authConfig = {
  otpLength: readPositiveInteger(
    import.meta.env.VITE_OTP_LENGTH,
    DEFAULT_OTP_LENGTH,
  ),
  resendCooldownSec: readPositiveInteger(
    import.meta.env.VITE_OTP_RESEND_COOLDOWN_SEC,
    DEFAULT_RESEND_COOLDOWN_SEC,
  ),
};
