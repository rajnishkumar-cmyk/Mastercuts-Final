import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useCart } from '../CartProvider';
import { cn } from '@/lib/utils';
import { formatPhoneForDisplay } from '@/lib/phone';
import {
  resendOtp,
  verifyOtp,
  type OtpChannel,
} from '@/lib/api/auth';
import { toErrorMessage } from '@/lib/api/errors';
import { authConfig } from '@/lib/authConfig';
import { LOGIN_PHONE_KEY, LOGIN_CHANNEL_KEY } from './PhoneLoginStep';

const OTP_LENGTH = authConfig.otpLength;
const RESEND_COOLDOWN_SEC = authConfig.resendCooldownSec;

function channelCopy(channel: OtpChannel): string {
  switch (channel) {
    case 'whatsapp':
      return 'Check your WhatsApp messages.';
    case 'sms':
      return 'Check your SMS inbox.';
    default:
      return 'Check your messages.';
  }
}

export function OtpVerifyStep() {
  const { saveLightAccount, setCheckoutStep, surface, closeAll, account } =
    useCart();

  // Read handoff from PhoneLoginStep on mount. We snapshot into state so
  // the values stay stable across re-renders (and so a stale tab can't
  // start verifying with a phone the user changed in a different tab).
  const [phone] = useState<string>(
    () => sessionStorage.getItem(LOGIN_PHONE_KEY) ?? '',
  );
  const [channel] = useState<OtpChannel>(
    () =>
      (sessionStorage.getItem(LOGIN_CHANNEL_KEY) as OtpChannel | null) ??
      'whatsapp',
  );

  const [otp, setOtp] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SEC);

  const displayPhone = useMemo(() => formatPhoneForDisplay(phone), [phone]);

  // If we somehow landed here without a phone (e.g. user reloaded mid-flow
  // after sessionStorage was wiped), bounce back to the entry step.
  useEffect(() => {
    if (!phone) setCheckoutStep('phone-login');
  }, [phone, setCheckoutStep]);

  // Resend cooldown ticker.
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const handleVerify = useCallback(async () => {
    if (otp.length !== OTP_LENGTH || verifying || !phone) return;
    setVerifying(true);
    setError(null);

    try {
      const result = await verifyOtp(phone, otp);

      // Persist auth into the LightAccount. We keep existing addresses
      // when the user is already logged in and is just re-authenticating
      // (rare in Phase 1 but cheap to support).
      saveLightAccount({
        name: result.customer.name ?? account?.name ?? '',
        phone: result.customer.mobile,
        addresses: account?.addresses ?? [],
        createdAt: account?.createdAt ?? Date.now(),
        token: result.token,
        customerId: result.customer.id,
      });

      sessionStorage.removeItem(LOGIN_PHONE_KEY);
      sessionStorage.removeItem(LOGIN_CHANNEL_KEY);

      if (surface === 'login') {
        toast.success('Signed in');
        closeAll();
      } else {
        // Continuing the booking flow: hop to address step.
        setCheckoutStep('address');
      }
    } catch (err) {
      setError(toErrorMessage(err, 'Could not verify OTP. Please try again.'));
      // Clear the input so the user can retype without manually backspacing
      // each slot. The OTP field is auto-focused, so this is a clean reset.
      setOtp('');
    } finally {
      setVerifying(false);
    }
  }, [
    otp,
    phone,
    verifying,
    saveLightAccount,
    account,
    surface,
    closeAll,
    setCheckoutStep,
  ]);

  // Auto-submit when all OTP digits are entered — typical OTP UX.
  useEffect(() => {
    if (otp.length === OTP_LENGTH && !verifying) {
      void handleVerify();
    }
    // We intentionally don't depend on handleVerify here to avoid
    // re-triggering submission on every keystroke. The latest closure
    // captures the current otp value.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);

  const handleResend = async () => {
    if (cooldown > 0 || resending || !phone) return;
    setResending(true);
    setError(null);
    try {
      await resendOtp(phone);
      setCooldown(RESEND_COOLDOWN_SEC);
      toast.success('OTP resent');
    } catch (err) {
      setError(toErrorMessage(err, 'Could not resend OTP. Please try again.'));
    } finally {
      setResending(false);
    }
  };

  const isComplete = otp.length === OTP_LENGTH;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-4">
        <p className="text-[10px] uppercase tracking-[0.2em] text-text-secondary mb-3">
          Verification
        </p>
        <h2 className="font-serif text-3xl text-text-primary leading-[1.05] mb-1">
          Enter <span className="italic">OTP</span>
        </h2>
        <p className="text-sm text-text-secondary mb-8">
          We sent a {OTP_LENGTH}-digit code to{' '}
          <span className="text-text-primary">{displayPhone}</span>.{' '}
          {channelCopy(channel)}
        </p>

        <div className="flex justify-center mb-6">
          <InputOTP
            maxLength={OTP_LENGTH}
            value={otp}
            onChange={(value) => {
              setOtp(value);
              if (error) setError(null);
            }}
            disabled={verifying}
            autoFocus
          >
            <InputOTPGroup className="gap-2">
              {Array.from({ length: OTP_LENGTH }, (_, i) => (
                <InputOTPSlot
                  key={i}
                  index={i}
                  className="w-12 h-14 text-lg border rounded-xl border-black/15 first:border-l data-[active=true]:border-bg-dark data-[active=true]:ring-1 data-[active=true]:ring-bg-dark/30"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>

        {error && (
          <p className="text-xs text-red-600 text-center mb-4" role="alert">
            {error}
          </p>
        )}

        <div className="text-center">
          <button
            type="button"
            onClick={handleResend}
            disabled={cooldown > 0 || resending || verifying}
            className={cn(
              'text-xs transition-colors',
              cooldown > 0 || resending || verifying
                ? 'text-text-muted cursor-not-allowed'
                : 'text-text-primary underline hover:no-underline',
            )}
          >
            {resending
              ? 'Resending…'
              : cooldown > 0
                ? `Resend code in ${cooldown}s`
                : 'Resend code'}
          </button>
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="flex-shrink-0 border-t border-black/10 bg-bg-primary px-6 pt-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
        <button
          type="button"
          disabled={!isComplete || verifying}
          onClick={handleVerify}
          className={cn(
            'w-full rounded-full py-4 text-sm font-medium transition-colors',
            isComplete && !verifying
              ? 'bg-bg-dark text-white hover:bg-bg-darker'
              : 'bg-black/10 text-text-muted cursor-not-allowed',
          )}
        >
          {verifying ? 'Verifying…' : 'Verify'}
        </button>
      </div>
    </div>
  );
}
