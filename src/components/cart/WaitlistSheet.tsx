import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Bell, Calendar as CalendarIcon, User as UserIcon, X } from 'lucide-react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useCart } from './CartProvider';
import { useIsMobile } from '@/hooks/use-mobile';
import type { WaitlistSource, WaitlistTimeOfDay } from '@/lib/booking/types';
import { cn } from '@/lib/utils';

export interface WaitlistContext {
  preferredDate: string;
  preferredTherapistId?: string;
  preferredTherapistName?: string;
  source: WaitlistSource;
}

interface WaitlistSheetProps {
  open: boolean;
  onClose: () => void;
  context: WaitlistContext | null;
}

const TIME_OPTIONS: { id: WaitlistTimeOfDay; label: string }[] = [
  { id: 'morning', label: 'Morning' },
  { id: 'afternoon', label: 'Afternoon' },
  { id: 'evening', label: 'Evening' },
  { id: 'any', label: 'Any' },
];

function formatDateLabel(key: string): string {
  const [Y, M, D] = key.split('-').map(Number);
  const d = new Date(Y, M - 1, D);
  return d.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

function Body({
  context,
  onClose,
}: {
  context: WaitlistContext;
  onClose: () => void;
}) {
  const { account, addWaitlistRequest } = useCart();

  const accountName = account?.name?.trim() ?? '';
  const accountPhone = account?.phone ?? '';

  // Pre-fill from the account when available, but always remain editable —
  // the waitlist contact can differ from the account holder (e.g. booking
  // on behalf of someone else).
  const [name, setName] = useState(accountName);
  const [phone, setPhone] = useState(accountPhone);
  const [timeOfDay, setTimeOfDay] = useState<WaitlistTimeOfDay>('any');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const canSubmit = useMemo(
    () => name.trim().length > 0 && phone.trim().length >= 6 && !submitting,
    [name, phone, submitting]
  );

  const handleSubmit = () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      addWaitlistRequest({
        guestName: name.trim(),
        guestPhone: phone.trim(),
        preferredDate: context.preferredDate,
        preferredTimeOfDay: timeOfDay,
        preferredTherapistId: context.preferredTherapistId,
        preferredTherapistName: context.preferredTherapistName,
        notes: notes.trim() || undefined,
        source: context.source,
      });
      toast.success(
        context.preferredTherapistName
          ? `You're on the waitlist for ${context.preferredTherapistName}.`
          : `You're on the waitlist for ${formatDateLabel(context.preferredDate)}.`
      );
      onClose();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="px-6 pt-7 pb-8 max-h-[88vh] overflow-y-auto">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close waitlist form"
        className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/5 flex items-center justify-center text-text-primary hover:bg-black/10 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>

      <p className="text-[10px] uppercase tracking-[0.22em] text-text-secondary mb-2">
        Waitlist
      </p>
      <DialogTitle asChild>
        <h2 className="font-serif text-3xl text-text-primary leading-[1.05] mb-5">
          Join the <span className="italic">waitlist</span>
        </h2>
      </DialogTitle>

      {/* Context card — read-only preview of date / therapist */}
      <div className="rounded-2xl border border-accent-gold/25 bg-accent-gold/5 p-4 mb-5 space-y-2">
        <div className="flex items-center gap-2.5 text-sm text-text-primary">
          <CalendarIcon className="w-4 h-4 text-accent-gold shrink-0" />
          <span>{formatDateLabel(context.preferredDate)}</span>
        </div>
        {context.preferredTherapistName && (
          <div className="flex items-center gap-2.5 text-sm text-text-primary">
            <UserIcon className="w-4 h-4 text-accent-gold shrink-0" />
            <span>{context.preferredTherapistName}</span>
          </div>
        )}
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-xs uppercase tracking-wider text-text-secondary mb-2">
            Full name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Maya Khan"
            className="w-full bg-transparent border-b border-black/15 py-2.5 text-text-primary outline-none focus:border-text-primary transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wider text-text-secondary mb-2">
            Phone
          </label>
          <input
            type="tel"
            inputMode="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+971 …"
            className="w-full bg-transparent border-b border-black/15 py-2.5 text-text-primary outline-none focus:border-text-primary transition-colors"
          />
        </div>

        <div>
          <p className="text-xs uppercase tracking-wider text-text-secondary mb-3">
            Preferred time of day
          </p>
          <div className="flex flex-wrap gap-2">
            {TIME_OPTIONS.map((opt) => {
              const active = opt.id === timeOfDay;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setTimeOfDay(opt.id)}
                  className={cn(
                    'rounded-full border px-4 py-2 text-xs transition-colors',
                    active
                      ? 'border-bg-dark bg-bg-dark text-white'
                      : 'border-black/15 text-text-primary hover:bg-black/5'
                  )}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-text-secondary mb-2">
            Notes (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value.slice(0, 200))}
            placeholder="Anything we should know?"
            rows={2}
            className="w-full bg-transparent border-b border-black/15 py-2.5 text-text-primary outline-none focus:border-text-primary transition-colors resize-none"
          />
          <p className="text-[10px] text-text-secondary text-right mt-1 tabular-nums">
            {notes.length}/200
          </p>
        </div>

        {error && <p className="text-xs text-red-600">{error}</p>}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={cn(
            'w-full rounded-full py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors',
            canSubmit
              ? 'bg-bg-dark text-white hover:bg-bg-darker'
              : 'bg-black/10 text-text-muted cursor-not-allowed'
          )}
        >
          <Bell className="w-4 h-4" strokeWidth={1.5} />
          {submitting ? 'Adding…' : 'Add me to the waitlist'}
        </button>

        <p className="text-[11px] text-text-secondary text-center leading-relaxed">
          We'll text you on WhatsApp if a slot opens up.
        </p>
      </div>
    </div>
  );
}

export function WaitlistSheet({ open, onClose, context }: WaitlistSheetProps) {
  const isMobile = useIsMobile();

  // Don't render until we have context — keeps form state clean.
  useEffect(() => {
    // intentionally empty — re-rendered via parent state. Body resets locally
    // when context changes because it reads from useCart at render time.
  }, [open]);

  if (!context) return null;

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={(v) => (v ? null : onClose())}>
        <SheetContent
          side="bottom"
          hideDefaultClose
          className="bg-bg-primary border-none p-0 w-full max-w-full rounded-t-3xl h-auto max-h-[88vh] z-[90]"
        >
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-black/20" />
          <Body context={context} onClose={onClose} />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? null : onClose())}>
      <DialogContent
        showCloseButton={false}
        className="bg-bg-primary border-none p-0 sm:max-w-md w-[calc(100%-2rem)] overflow-hidden rounded-2xl shadow-2xl z-[90]"
      >
        <Body context={context} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
}
