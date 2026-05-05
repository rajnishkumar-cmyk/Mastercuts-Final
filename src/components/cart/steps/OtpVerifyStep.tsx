import { useState, useEffect, useCallback } from 'react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useCart } from '../CartProvider';
import { cn } from '@/lib/utils';

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 30;

export function OtpVerifyStep() {
  const { saveLightAccount, setCheckoutStep, surface, closeAll } = useCart();

  const phone = sessionStorage.getItem('ra-login-phone') ?? '';
  const [otp, setOtp] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN);

  // Countdown timer for resend
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const handleVerify = useCallback(async () => {
    if (otp.length !== OTP_LENGTH) return;
    setVerifying(true);
    setError('');

    // Simulated verification — accept any 6-digit code
    await new Promise((r) => setTimeout(r, 600));

    // Create LightAccount with phone only
    saveLightAccount({
      name: '',
      phone,
      addresses: [],
      createdAt: Date.now(),
    });

    sessionStorage.removeItem('ra-login-phone');
    if (surface === 'login') {
      closeAll();
    } else {
      setCheckoutStep('address');
    }
    setVerifying(false);
  }, [otp, phone, saveLightAccount, setCheckoutStep, surface, closeAll]);

  const handleResend = () => {
    if (cooldown > 0) return;
    setCooldown(RESEND_COOLDOWN);
    // Simulated resend
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
          We sent a 6-digit code to{' '}
          <span className="text-text-primary">{phone}</span>
        </p>

        <div className="flex justify-center mb-6">
          <InputOTP
            maxLength={OTP_LENGTH}
            value={otp}
            onChange={(value) => {
              setOtp(value);
              setError('');
            }}
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
          <p className="text-xs text-red-600 text-center mb-4">{error}</p>
        )}

        <div className="text-center">
          <button
            type="button"
            onClick={handleResend}
            disabled={cooldown > 0}
            className={cn(
              'text-xs transition-colors',
              cooldown > 0
                ? 'text-text-muted cursor-not-allowed'
                : 'text-text-primary underline hover:no-underline'
            )}
          >
            {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend code'}
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
              : 'bg-black/10 text-text-muted cursor-not-allowed'
          )}
        >
          {verifying ? 'Verifying...' : 'Verify'}
        </button>
      </div>
    </div>
  );
}
