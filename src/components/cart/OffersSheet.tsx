import { useEffect, useState } from 'react';
import { Check, X } from 'lucide-react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useCart } from './CartProvider';
import { useIsMobile } from '@/hooks/use-mobile';
import { getActiveOffers, type Offer } from '@/lib/offers';
import { cn } from '@/lib/utils';

interface BodyProps {
  selectedOfferId: string | undefined;
  offers: Offer[];
  onSelect: (offerId: string | null) => void;
  onClose: () => void;
}

function formatValidLabel(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function Body({ selectedOfferId, offers, onSelect, onClose }: BodyProps) {
  return (
    <div className="px-6 pt-7 pb-8 max-h-[88vh] overflow-y-auto">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close offers"
        className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/5 flex items-center justify-center text-text-primary hover:bg-black/10 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>

      <p className="text-[10px] uppercase tracking-[0.22em] text-text-secondary mb-2">
        Offers
      </p>
      <DialogTitle asChild>
        <h2 className="font-serif text-3xl text-text-primary leading-[1.05] mb-6">
          Apply <span className="italic">an offer</span>
        </h2>
      </DialogTitle>

      <div className="space-y-3">
        {/* None — stays visually distinct (light surface) since it's a
            clear-selection action, not an offer. */}
        <button
          type="button"
          onClick={() => onSelect(null)}
          className={cn(
            'w-full flex items-center gap-4 px-5 py-4 rounded-2xl border text-left transition-colors',
            !selectedOfferId
              ? 'border-bg-dark bg-bg-primary'
              : 'border-black/10 hover:border-black/30 bg-bg-primary',
          )}
        >
          <div className="w-11 h-11 rounded-full bg-circle-light flex items-center justify-center text-text-secondary shrink-0">
            <X className="w-5 h-5" strokeWidth={1.5} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-serif text-lg text-text-primary leading-tight">None</p>
            <p className="text-xs text-text-secondary mt-0.5">
              Don't apply an offer to this booking.
            </p>
          </div>
          {!selectedOfferId && (
            <span className="shrink-0 w-7 h-7 rounded-full bg-bg-dark text-white flex items-center justify-center">
              <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
            </span>
          )}
        </button>

        {/* Offer cards — mirror the home-page OffersSection style: indigo
            surface, gold hero discount, decorative rings, white serif name. */}
        {offers.map((offer) => {
          const isSelected = offer.id === selectedOfferId;
          return (
            <button
              key={offer.id}
              type="button"
              onClick={() => onSelect(offer.id)}
              aria-pressed={isSelected}
              className={cn(
                'relative w-full overflow-hidden rounded-2xl bg-ra-indigo text-white text-left transition-all px-5 py-5',
                isSelected
                  ? 'ring-2 ring-accent-gold ring-offset-2 ring-offset-bg-primary'
                  : 'ring-1 ring-white/5 hover:ring-accent-gold/40',
              )}
            >
              {/* Decorative gold rings — top-right, scaled smaller than the
                  home-page card so they fit the compact list row. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-10 -right-10 w-32 h-32 rounded-full border border-accent-gold/15"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-7 -right-7 w-24 h-24 rounded-full border border-accent-gold/10"
              />

              <div className="relative flex items-start gap-4">
                {/* Discount — the hero element */}
                <div className="shrink-0 flex items-baseline gap-0.5">
                  <span className="font-serif text-4xl text-accent-gold leading-none tabular-nums">
                    {offer.discountPercent}
                  </span>
                  <span className="font-serif text-base text-accent-gold leading-none">
                    %
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-accent-gold mb-1">
                    Limited time
                  </p>
                  <p className="font-serif text-xl text-white leading-tight truncate">
                    {offer.name}
                  </p>
                  <p className="text-xs text-white/70 mt-1.5">
                    Valid until {formatValidLabel(offer.validUntil)}
                  </p>
                  {offer.limitedNote && (
                    <p className="text-[10px] uppercase tracking-[0.15em] text-accent-gold mt-2">
                      {offer.limitedNote}
                    </p>
                  )}
                </div>

                {/* Selection affordance */}
                {isSelected ? (
                  <span className="shrink-0 mt-1 w-7 h-7 rounded-full bg-accent-gold text-ra-indigo flex items-center justify-center">
                    <Check className="w-3.5 h-3.5" strokeWidth={3} />
                  </span>
                ) : (
                  <span
                    aria-hidden="true"
                    className="shrink-0 mt-1 w-7 h-7 rounded-full border border-white/25"
                  />
                )}
              </div>
            </button>
          );
        })}
      </div>

      <p className="mt-6 text-[11px] text-text-secondary text-center leading-relaxed">
        One offer per booking. Eligibility is verified at checkout.
      </p>
    </div>
  );
}

interface OffersSheetProps {
  open: boolean;
  onClose: () => void;
}

export function OffersSheet({ open, onClose }: OffersSheetProps) {
  const { cart, setPendingOffer, clearPendingOffer } = useCart();
  const isMobile = useIsMobile();
  const [offers, setOffers] = useState<Offer[]>([]);

  useEffect(() => {
    if (open) setOffers(getActiveOffers());
  }, [open]);

  const handleSelect = (offerId: string | null) => {
    if (offerId) {
      setPendingOffer(offerId);
    } else {
      clearPendingOffer();
    }
    onClose();
  };

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={(v) => (v ? null : onClose())}>
        <SheetContent
          side="bottom"
          hideDefaultClose
          className="bg-bg-primary border-none p-0 w-full max-w-full rounded-t-3xl h-auto max-h-[88vh] z-[90]"
        >
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-black/20" />
          <Body
            selectedOfferId={cart.pendingOfferId}
            offers={offers}
            onSelect={handleSelect}
            onClose={onClose}
          />
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
        <Body
          selectedOfferId={cart.pendingOfferId}
          offers={offers}
          onSelect={handleSelect}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
