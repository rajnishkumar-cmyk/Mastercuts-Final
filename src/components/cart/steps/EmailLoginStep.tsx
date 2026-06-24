import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Phone } from 'lucide-react';
import { useCart } from '../CartProvider';
import { cn } from '@/lib/utils';
import { isValidEmail, normalizeEmail } from '@/lib/email';
import { isValidPhone, normalizePhone } from '@/lib/phone';
import { sendOtp, type OtpChannel } from '@/lib/api/auth';
import { toErrorMessage } from '@/lib/api/errors';

// Session-scoped keys handed off to OtpVerifyStep. Constants (not inline
// strings) so both files agree on the contract.
export const LOGIN_EMAIL_KEY = 'mc-login-email';
export const LOGIN_PHONE_KEY = 'mc-login-phone';
export const LOGIN_CHANNEL_KEY = 'mc-login-channel';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .refine((v) => isValidEmail(v), { message: 'Enter a valid email address' }),
  phone: z
    .string()
    .min(1, 'Mobile number is required')
    .refine((v) => isValidPhone(v), {
      message: 'Enter a valid mobile number with country code',
    }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function EmailLoginStep() {
  const { setCheckoutStep } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', phone: '' },
    mode: 'onChange',
  });

  const onSubmit = handleSubmit(async (values) => {
    setApiError(null);
    const email = normalizeEmail(values.email);
    const phone = normalizePhone(values.phone);
    if (!email || !phone) {
      setApiError('Enter a valid email and mobile number');
      return;
    }

    setSubmitting(true);
    try {
      const { channel } = await sendOtp(email, phone);
      // Hand off to the OTP step. sessionStorage (not state) so a hard reload
      // mid-flow still works.
      sessionStorage.setItem(LOGIN_EMAIL_KEY, email);
      sessionStorage.setItem(LOGIN_PHONE_KEY, phone);
      sessionStorage.setItem(LOGIN_CHANNEL_KEY, channel satisfies OtpChannel);
      setCheckoutStep('otp-verify');
    } catch (err) {
      setApiError(toErrorMessage(err, 'Could not send OTP. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  });

  const ctaDisabled = !isValid || submitting;

  return (
    <form onSubmit={onSubmit} className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-4">
        <p className="text-[10px] uppercase tracking-[0.2em] text-text-secondary mb-3">
          Login
        </p>
        <h2 className="font-serif text-3xl text-text-primary leading-[1.05] mb-1">
          Enter your <span className="italic">email</span>
        </h2>
        <p className="text-sm text-text-secondary mb-8">
          We'll send a verification code to your email. Your mobile number lets
          our therapist reach you.
        </p>

        <div className="space-y-5">
          <div>
            <label
              htmlFor="email-input"
              className="block text-xs uppercase tracking-wider text-text-secondary mb-2"
            >
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input
                id="email-input"
                type="email"
                {...register('email')}
                placeholder="you@example.com"
                inputMode="email"
                autoComplete="email"
                autoFocus
                disabled={submitting}
                aria-invalid={!!errors.email}
                className="w-full bg-transparent border-b border-black/15 py-2.5 pl-6 text-text-primary focus:border-text-primary outline-none transition-colors disabled:opacity-60"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-600 mt-1" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="phone-input"
              className="block text-xs uppercase tracking-wider text-text-secondary mb-2"
            >
              Mobile number
            </label>
            <div className="relative">
              <Phone className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input
                id="phone-input"
                {...register('phone')}
                placeholder="+971 50 123 4567"
                inputMode="tel"
                autoComplete="tel"
                disabled={submitting}
                aria-invalid={!!errors.phone}
                className="w-full bg-transparent border-b border-black/15 py-2.5 pl-6 text-text-primary focus:border-text-primary outline-none transition-colors disabled:opacity-60"
              />
            </div>
            {errors.phone && (
              <p className="text-xs text-red-600 mt-1" role="alert">
                {errors.phone.message}
              </p>
            )}
          </div>

          {apiError && (
            <p className="text-xs text-red-600" role="alert">
              {apiError}
            </p>
          )}
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="flex-shrink-0 border-t border-black/10 bg-bg-primary px-6 pt-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
        <button
          type="submit"
          disabled={ctaDisabled}
          className={cn(
            'w-full rounded-full py-4 text-sm font-medium transition-colors',
            !ctaDisabled
              ? 'bg-bg-dark text-white hover:bg-bg-darker'
              : 'bg-black/10 text-text-muted cursor-not-allowed',
          )}
        >
          {submitting ? 'Sending OTP…' : 'Get OTP'}
        </button>
      </div>
    </form>
  );
}
