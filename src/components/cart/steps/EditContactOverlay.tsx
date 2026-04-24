import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCart } from '../CartProvider';
import { cn } from '@/lib/utils';

const contactSchema = z.object({
  name: z.string().min(2, 'Please enter your name'),
  phone: z
    .string()
    .regex(
      /^\+971\s?\d{2}\s?\d{3}\s?\d{4}$|^05\d\s?\d{3}\s?\d{4}$/,
      'Please enter a valid UAE mobile number'
    ),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export function EditContactOverlay() {
  const { account, saveLightAccount, setCheckoutStep } = useCart();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: account?.name ?? '',
      phone: account?.phone ?? '',
    },
    mode: 'onChange',
  });

  const onSubmit = handleSubmit((values) => {
    if (!account) return;
    saveLightAccount({
      ...account,
      name: values.name,
      phone: values.phone,
    });
    setCheckoutStep('address');
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-4">
        <p className="text-[10px] uppercase tracking-[0.2em] text-text-secondary mb-3">
          Contact details
        </p>
        <h2 className="font-serif text-3xl text-text-primary leading-[1.05] mb-1">
          Your <span className="italic">details</span>
        </h2>
        <p className="text-sm text-text-secondary mb-8">
          These details help our therapist reach you.
        </p>

        <div className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-wider text-text-secondary mb-2">
              Name
            </label>
            <input
              {...register('name')}
              placeholder="e.g. Aisha Khan"
              autoComplete="name"
              autoFocus
              className="w-full bg-transparent border-b border-black/15 py-2.5 text-text-primary focus:border-text-primary outline-none transition-colors"
            />
            {errors.name && (
              <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-text-secondary mb-2">
              Mobile (UAE)
            </label>
            <input
              {...register('phone')}
              placeholder="+971 50 123 4567"
              inputMode="tel"
              autoComplete="tel"
              className="w-full bg-transparent border-b border-black/15 py-2.5 text-text-primary focus:border-text-primary outline-none transition-colors"
            />
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
          Save
        </button>
      </div>
    </form>
  );
}
