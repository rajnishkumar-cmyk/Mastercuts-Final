import { Banknote, Check, CreditCard, X } from 'lucide-react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useCart } from '@/components/cart/CartProvider';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface BodyProps {
  selected: 'cash' | 'card';
  onSelect: (method: 'cash') => void;
  onClose: () => void;
}

function Body({ selected, onSelect, onClose }: BodyProps) {
  return (
    <div className="px-6 pt-7 pb-8">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/5 flex items-center justify-center text-text-primary hover:bg-black/10 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>

      <p className="text-[10px] uppercase tracking-[0.22em] text-text-secondary mb-2">
        Payment
      </p>
      <DialogTitle asChild>
        <h2 className="font-serif text-3xl text-text-primary leading-[1.05] mb-6">
          Pay <span className="italic">via</span>
        </h2>
      </DialogTitle>

      <div className="space-y-3">
        {/* Cash */}
        <button
          type="button"
          onClick={() => onSelect('cash')}
          className={cn(
            'w-full flex items-center gap-4 px-5 py-4 rounded-2xl border text-left transition-colors',
            selected === 'cash'
              ? 'border-accent-gold bg-bg-primary'
              : 'border-black/10 hover:border-black/30 bg-bg-primary',
          )}
        >
          <div className="w-11 h-11 rounded-full bg-circle-light flex items-center justify-center text-accent-gold shrink-0">
            <Banknote className="w-5 h-5" strokeWidth={1.5} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-serif text-lg text-text-primary leading-tight">Cash</p>
            <p className="text-xs text-text-secondary mt-0.5">
              Pay when your therapist arrives.
            </p>
          </div>
          {selected === 'cash' && (
            <span className="shrink-0 w-7 h-7 rounded-full bg-accent-gold text-bg-dark flex items-center justify-center">
              <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
            </span>
          )}
        </button>

        {/* Card (disabled) */}
        <div
          aria-disabled
          className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl border border-black/10 bg-bg-primary opacity-50 cursor-not-allowed"
        >
          <div className="w-11 h-11 rounded-full bg-circle-light flex items-center justify-center text-text-secondary shrink-0">
            <CreditCard className="w-5 h-5" strokeWidth={1.5} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-serif text-lg text-text-primary leading-tight flex items-center gap-2">
              Card
              <span className="text-[9px] uppercase tracking-[0.18em] bg-black/10 text-text-secondary px-1.5 py-0.5 rounded-full">
                Soon
              </span>
            </p>
            <p className="text-xs text-text-secondary mt-0.5">
              Saved cards and Apple Pay coming soon.
            </p>
          </div>
        </div>
      </div>

      <p className="mt-6 text-[11px] text-text-secondary text-center leading-relaxed">
        All prices in AED. Includes 5% VAT.
      </p>
    </div>
  );
}

export function PaymentMethodSheet() {
  const { surface, closeAll, paymentMethod, setPaymentMethod } = useCart();
  const isMobile = useIsMobile();
  const open = surface === 'payment-method';

  const handleSelect = (method: 'cash') => {
    setPaymentMethod(method);
    closeAll();
  };

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={(v) => (v ? null : closeAll())}>
        <SheetContent
          side="bottom"
          hideDefaultClose
          className="bg-bg-primary border-none p-0 w-full max-w-full rounded-t-3xl h-auto max-h-[88vh]"
        >
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-black/20" />
          <Body selected={paymentMethod} onSelect={handleSelect} onClose={closeAll} />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? null : closeAll())}>
      <DialogContent
        showCloseButton={false}
        className="bg-bg-primary border-none p-0 sm:max-w-md w-[calc(100%-2rem)] overflow-hidden rounded-2xl shadow-2xl"
      >
        <Body selected={paymentMethod} onSelect={handleSelect} onClose={closeAll} />
      </DialogContent>
    </Dialog>
  );
}
