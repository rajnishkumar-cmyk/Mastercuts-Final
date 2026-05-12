import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useCart } from '../CartProvider';
import { useIsMobile } from '@/hooks/use-mobile';
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

interface BodyProps {
  defaults: ContactFormValues;
  onSave: (values: ContactFormValues) => void;
  onClose: () => void;
}

function Body({ defaults, onSave, onClose }: BodyProps) {
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

      <div className="px-6 pt-3 pb-6">
        <button
          type="submit"
          disabled={!isValid}
          className={cn(
            'w-full rounded-full py-3.5 text-sm font-medium transition-colors',
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

export function EditContactOverlay() {
  const { account, saveLightAccount, isContactEditOpen, closeContactEdit } = useCart();
  const isMobile = useIsMobile();

  const defaults: ContactFormValues = {
    name: account?.name ?? '',
    phone: account?.phone ?? '',
  };

  const onSave = (values: ContactFormValues) => {
    saveLightAccount({
      name: values.name,
      phone: values.phone,
      addresses: account?.addresses ?? [],
      createdAt: account?.createdAt ?? Date.now(),
    });
    closeContactEdit();
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
          <Body defaults={defaults} onSave={onSave} onClose={closeContactEdit} />
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
        <Body defaults={defaults} onSave={onSave} onClose={closeContactEdit} />
      </DialogContent>
    </Dialog>
  );
}
