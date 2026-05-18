import { Check, CreditCard, Smartphone, X } from 'lucide-react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useCart } from '@/components/cart/CartProvider';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

type PaymentMethod = 'card' | 'apple-pay';

interface BodyProps {
  selected: PaymentMethod;
  onSelect: (method: PaymentMethod) => void;
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
        {/* Card */}
        <button
          type="button"
          onClick={() => onSelect('card')}
          className={cn(
            'w-full flex items-center gap-4 px-5 py-4 rounded-2xl border text-left transition-colors',
            selected === 'card'
              ? 'border-accent-gold bg-bg-primary'
              : 'border-black/10 hover:border-black/30 bg-bg-primary',
          )}
        >
          <div className="w-11 h-11 rounded-full bg-circle-light flex items-center justify-center text-accent-gold shrink-0">
            <CreditCard className="w-5 h-5" strokeWidth={1.5} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-serif text-lg text-text-primary leading-tight">Card</p>
            <p className="text-xs text-text-secondary mt-0.5">
              Pay on arrival via card machine.
            </p>
          </div>
          {selected === 'card' && (
            <span className="shrink-0 w-7 h-7 rounded-full bg-accent-gold text-bg-dark flex items-center justify-center">
              <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
            </span>
          )}
        </button>

        {/* Apple Pay */}
        <button
          type="button"
          onClick={() => onSelect('apple-pay')}
          className={cn(
            'w-full flex items-center gap-4 px-5 py-4 rounded-2xl border text-left transition-colors',
            selected === 'apple-pay'
              ? 'border-accent-gold bg-bg-primary'
              : 'border-black/10 hover:border-black/30 bg-bg-primary',
          )}
        >
          <div className="w-11 h-11 rounded-full bg-circle-light flex items-center justify-center text-accent-gold shrink-0">
            <Smartphone className="w-5 h-5" strokeWidth={1.5} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-serif text-lg text-text-primary leading-tight">Apple Pay</p>
            <p className="text-xs text-text-secondary mt-0.5">
              Tap to pay via the card machine on arrival.
            </p>
          </div>
          {selected === 'apple-pay' && (
            <span className="shrink-0 w-7 h-7 rounded-full bg-accent-gold text-bg-dark flex items-center justify-center">
              <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
            </span>
          )}
        </button>
      </div>

      <p className="mt-6 text-[11px] text-text-secondary text-center leading-relaxed">
        Payment is collected at the time of service. All prices in AED, inclusive of 5% VAT.
      </p>
    </div>
  );
}

export function PaymentMethodSheet() {
  const {
    isPaymentMethodOpen,
    closePaymentMethod,
    paymentMethod,
    setPaymentMethod,
  } = useCart();
  const isMobile = useIsMobile();

  const handleSelect = (method: PaymentMethod) => {
    setPaymentMethod(method);
    closePaymentMethod();
  };

  if (isMobile) {
    return (
      <Sheet
        open={isPaymentMethodOpen}
        onOpenChange={(v) => (v ? null : closePaymentMethod())}
      >
        <SheetContent
          side="bottom"
          hideDefaultClose
          className="bg-bg-primary border-none p-0 w-full max-w-full rounded-t-3xl h-auto max-h-[88vh] z-[90]"
        >
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-black/20" />
          <Body selected={paymentMethod} onSelect={handleSelect} onClose={closePaymentMethod} />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog
      open={isPaymentMethodOpen}
      onOpenChange={(v) => (v ? null : closePaymentMethod())}
    >
      <DialogContent
        showCloseButton={false}
        className="bg-bg-primary border-none p-0 sm:max-w-md w-[calc(100%-2rem)] overflow-hidden rounded-2xl shadow-2xl z-[90]"
      >
        <Body selected={paymentMethod} onSelect={handleSelect} onClose={closePaymentMethod} />
      </DialogContent>
    </Dialog>
  );
}
