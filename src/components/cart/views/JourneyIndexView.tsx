import { ArrowLeft, X, ArrowUpRight } from 'lucide-react';
import { useCart, formatAed, formatDuration } from '../CartProvider';
import { journeys, getJourneyTotals } from '@/lib/booking/catalog';
import { DrawerStickyFooter } from './DrawerStickyFooter';

interface Props {
  onClose: () => void;
  canGoBack: boolean;
  onBack: () => void;
}

export function JourneyIndexView({ onClose, canGoBack, onBack }: Props) {
  const { pushDrawerView } = useCart();

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-3 px-6 pt-6 pb-5 border-b border-black/10 flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          {canGoBack && (
            <button
              type="button"
              onClick={onBack}
              aria-label="Back"
              className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-text-primary hover:bg-black/10 transition-colors flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.2em] text-text-secondary mb-1">
              Hand-assembled
            </p>
            <h2 className="font-serif text-2xl text-text-primary leading-none">
              Curated <span className="italic">journeys</span>
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
        <p className="px-6 pt-5 pb-3 text-sm text-text-secondary leading-relaxed">
          Pre-sequenced experiences that flow from one room to the next — save time, save money,
          and save the thinking.
        </p>
        <ul className="px-6 pb-4">
          {journeys.map((journey) => {
            const totals = getJourneyTotals(journey);
            return (
              <li key={journey.id}>
                <button
                  type="button"
                  onClick={() =>
                    pushDrawerView({ name: 'journey-detail', journeyId: journey.id })
                  }
                  className="group w-full flex items-start gap-4 py-5 text-left border-b border-black/10"
                >
                  <div className="w-24 h-28 flex-shrink-0 overflow-hidden bg-black/5">
                    <img
                      src={journey.image}
                      alt={journey.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-text-secondary mb-1">
                      {journey.category} · save {journey.savings}%
                    </p>
                    <p className="font-serif text-xl text-text-primary leading-tight">
                      {journey.name}
                    </p>
                    <p className="text-xs text-text-secondary mt-2 line-clamp-2">
                      {journey.description}
                    </p>
                    <p className="text-[11px] uppercase tracking-wider text-text-secondary mt-2">
                      {formatDuration(totals.totalDuration)} · from{' '}
                      {formatAed(totals.totalPriceDiscounted)}
                    </p>
                  </div>
                  <span className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-text-primary group-hover:bg-black/10 transition-colors flex-shrink-0">
                    <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <DrawerStickyFooter />
    </div>
  );
}
