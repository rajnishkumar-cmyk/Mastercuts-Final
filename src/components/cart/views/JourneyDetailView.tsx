import { ArrowLeft, X, Check, Plus } from 'lucide-react';
import { useCart, formatAed, formatDuration } from '../CartProvider';
import { getJourney, getJourneyTotals, getService } from '@/lib/booking/catalog';
import { pickServiceImage } from '@/lib/booking/types';
import { useAudience } from '@/components/services/useAudience';
import { cn } from '@/lib/utils';

interface Props {
  journeyId: string;
  onClose: () => void;
  onBack: () => void;
}

export function JourneyDetailView({ journeyId, onClose, onBack }: Props) {
  const { cart, addJourneyToCart, removeItem } = useCart();
  const [audience] = useAudience();
  const journey = getJourney(journeyId);
  if (!journey) return null;
  const totals = getJourneyTotals(journey);
  const services = journey.serviceIds.map(getService).filter(Boolean);

  const bundleServiceId = `journey:${journey.id}`;
  const cartItem = cart.items.find((i) => i.serviceId === bundleServiceId);
  const inCart = !!cartItem;

  const handleCta = () => {
    if (inCart && cartItem) {
      removeItem(cartItem.id);
      return;
    }
    addJourneyToCart(journey.id);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-3 px-6 pt-6 pb-5 border-b border-black/10 flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onBack}
            aria-label="Back"
            className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-text-primary hover:bg-black/10 transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.2em] text-text-secondary mb-1">
              {journey.category}
            </p>
            <h2 className="font-serif text-2xl text-text-primary leading-none truncate">
              {journey.name}
            </h2>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-text-primary hover:bg-black/10 transition-colors flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        <div className="aspect-[16/9] overflow-hidden bg-black/5">
          <img src={journey.image} alt={journey.name} className="w-full h-full object-cover" />
        </div>

        <div className="px-6 pt-6 pb-2">
          <p className="font-serif italic text-lg text-text-primary mb-4">
            {journey.philosophy}
          </p>
          <p className="text-sm text-text-secondary leading-relaxed">{journey.description}</p>
        </div>

        <div className="px-6 pt-6 pb-5 border-t border-black/10 mt-6">
          <p className="text-[10px] uppercase tracking-[0.22em] text-text-secondary mb-4">
            Included ({services.length} services)
          </p>
          <ul className="space-y-4">
            {services.map((svc) =>
              svc ? (
                <li
                  key={svc.id}
                  className="flex items-start gap-3 border-b border-black/5 pb-3 last:border-b-0"
                >
                  <div className="w-14 h-14 flex-shrink-0 overflow-hidden bg-black/5">
                    <img src={pickServiceImage(svc, audience)} alt={svc.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text-primary leading-tight">{svc.name}</p>
                    <p className="text-[11px] uppercase tracking-wider text-text-secondary mt-1">
                      {formatDuration(svc.durationMin)} · {formatAed(svc.price)}
                    </p>
                  </div>
                </li>
              ) : null
            )}
          </ul>
        </div>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 border-t border-black/10 bg-bg-primary px-6 pt-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
        <div className="flex items-baseline justify-between mb-1">
          <span className="text-xs uppercase tracking-wider text-text-secondary">Journey total</span>
          <div className="flex items-baseline gap-2">
            <span className="line-through text-text-secondary/60 text-xs">
              {formatAed(totals.totalPriceFull)}
            </span>
            <span className="font-serif text-2xl text-text-primary">
              {formatAed(totals.totalPriceDiscounted)}
            </span>
          </div>
        </div>
        <div className="flex items-baseline justify-between mb-5">
          <span className="text-xs uppercase tracking-wider text-text-secondary">
            {formatDuration(totals.totalDuration)}
          </span>
          <span className="text-xs text-text-secondary">
            Save {formatAed(totals.savingsAed)} ({journey.savings}% off)
          </span>
        </div>
        <button
          type="button"
          onClick={handleCta}
          className={cn(
            'w-full rounded-full py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors',
            inCart
              ? 'bg-black/5 text-text-primary hover:bg-black/10 border border-black/10'
              : 'bg-bg-dark text-white hover:bg-bg-darker'
          )}
        >
          {inCart ? (
            <>
              <Check className="w-4 h-4" /> Journey in your cart
            </>
          ) : (
            <>
              Add journey to cart
              <Plus className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
