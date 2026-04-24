import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Phone } from 'lucide-react';
import { useCart } from '../CartProvider';
import { cn } from '@/lib/utils';

const phoneSchema = z.object({
  phone: z
    .string()
    .regex(
      /^\+971\s?\d{2}\s?\d{3}\s?\d{4}$|^05\d\s?\d{3}\s?\d{4}$/,
      'Please enter a valid UAE mobile number'
    ),
});

type PhoneFormValues = z.infer<typeof phoneSchema>;

export function PhoneLoginStep() {
  const { updateDraftCheckout, setCheckoutStep } = useCart();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<PhoneFormValues>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone: '' },
    mode: 'onChange',
  });

  const onSubmit = handleSubmit((values) => {
    updateDraftCheckout({} as never);
    // Store phone temporarily — will be used by OTP step
    sessionStorage.setItem('ra-login-phone', values.phone);
    setCheckoutStep('otp-verify');
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-4">
        <p className="text-[10px] uppercase tracking-[0.2em] text-text-secondary mb-3">
          Login
        </p>
        <h2 className="font-serif text-3xl text-text-primary leading-[1.05] mb-1">
          Enter your <span className="italic">mobile number</span>
        </h2>
        <p className="text-sm text-text-secondary mb-8">
          We'll send a verification code to confirm your identity.
        </p>

        <div className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-wider text-text-secondary mb-2">
              Mobile (UAE)
            </label>
            <div className="relative">
              <Phone className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input
                {...register('phone')}
                placeholder="+971 50 123 4567"
                inputMode="tel"
                autoComplete="tel"
                autoFocus
                className="w-full bg-transparent border-b border-black/15 py-2.5 pl-6 text-text-primary focus:border-text-primary outline-none transition-colors"
              />
            </div>
            {errors.phone && (
              <p className="text-xs text-red-600 mt-1">{errors.phone.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="flex-shrink-0 border-t border-black/10 bg-bg-primary px-6 pt-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
        <button
          type="submit"
          disabled={!isValid}
          className={cn(
            'w-full rounded-full py-4 text-sm font-medium transition-colors',
            isValid
              ? 'bg-bg-dark text-white hover:bg-bg-darker'
              : 'bg-black/10 text-text-muted cursor-not-allowed'
          )}
        >
          Get OTP
        </button>
      </div>
    </form>
  );
}
