import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useCart } from '../CartProvider';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { isValidPhone, normalizePhone } from '@/lib/phone';
import { updateProfile } from '@/lib/api/auth';
import { toErrorMessage } from '@/lib/api/errors';

const contactSchema = z.object({
  name: z.string().min(2, 'Please enter your name'),
  phone: z
    .string()
    .min(1, 'Mobile number is required')
    .refine((v) => isValidPhone(v), {
      // Same validator as the login step: accepts UAE, India, and generic
      // international "+<cc>…" numbers — not UAE-only.
      message: 'Enter a valid mobile number with country code',
    }),
});

type ContactFormValues = z.infer<typeof contactSchema>;

interface BodyProps {
  defaults: ContactFormValues;
  onSave: (values: ContactFormValues) => void;
  onClose: () => void;
  submitting: boolean;
}

function Body({ defaults, onSave, onClose, submitting }: BodyProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: defaults,
    mode: 'onChange',
  });

  // Re-sync when the dialog reopens with fresh account values.
  useEffect(() => {
    reset(defaults);
  }, [defaults.name, defaults.phone, reset]);

  return (
    <form onSubmit={handleSubmit(onSave)} className="flex flex-col">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/5 flex items-center justify-center text-text-primary hover:bg-black/10 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="px-6 pt-7 pb-4">
        <p className="text-[10px] uppercase tracking-[0.22em] text-text-secondary mb-2">
          Contact details
        </p>
        <DialogTitle asChild>
          <h2 className="font-serif text-3xl text-text-primary leading-[1.05] mb-1">
            Your <span className="italic">details</span>
          </h2>
        </DialogTitle>
        <p className="text-sm text-text-secondary mb-7">
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
              Mobile
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

      <div className="px-6 pt-3 pb-6">
        <button
          type="submit"
          disabled={!isValid || submitting}
          className={cn(
            'w-full rounded-full py-3.5 text-sm font-medium transition-colors',
            isValid && !submitting
              ? 'bg-bg-dark text-white hover:bg-bg-darker'
              : 'bg-black/10 text-text-muted cursor-not-allowed'
          )}
        >
          {submitting ? 'Saving…' : 'Save'}
        </button>
      </div>
    </form>
  );
}

export function EditContactOverlay() {
  const { account, saveLightAccount, isContactEditOpen, closeContactEdit } = useCart();
  const isMobile = useIsMobile();
  const [submitting, setSubmitting] = useState(false);

  const defaults: ContactFormValues = {
    name: account?.name ?? '',
    phone: account?.phone ?? '',
  };

  const onSave = async (values: ContactFormValues) => {
    if (!account) {
      // EditContact is only reachable from a logged-in surface — guard
      // here so we never construct a tokenless LightAccount.
      closeContactEdit();
      return;
    }
    const mobileNumber = normalizePhone(values.phone) ?? values.phone;
    setSubmitting(true);
    try {
      // Persist to the backend (PUT /auth/me) first, then mirror the
      // server's response into the local LightAccount.
      const { customer } = await updateProfile(account.token, {
        name: values.name,
        mobileNumber,
      });
      saveLightAccount({
        ...account,
        name: customer.name ?? values.name,
        phone: customer.mobile ?? mobileNumber,
      });
      toast.success('Details updated');
      closeContactEdit();
    } catch (err) {
      toast.error(
        toErrorMessage(err, 'Could not update your details. Please try again.'),
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (isMobile) {
    return (
      <Sheet open={isContactEditOpen} onOpenChange={(v) => (v ? null : closeContactEdit())}>
        <SheetContent
          side="bottom"
          hideDefaultClose
          className="bg-bg-primary border-none p-0 w-full max-w-full rounded-t-3xl h-auto max-h-[88vh] z-[90]"
        >
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-black/20" />
          <Body defaults={defaults} onSave={onSave} onClose={closeContactEdit} submitting={submitting} />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={isContactEditOpen} onOpenChange={(v) => (v ? null : closeContactEdit())}>
      <DialogContent
        showCloseButton={false}
        className="bg-bg-primary border-none p-0 sm:max-w-md w-[calc(100%-2rem)] overflow-hidden rounded-2xl shadow-2xl z-[90]"
      >
        <Body defaults={defaults} onSave={onSave} onClose={closeContactEdit} submitting={submitting} />
      </DialogContent>
    </Dialog>
  );
}
