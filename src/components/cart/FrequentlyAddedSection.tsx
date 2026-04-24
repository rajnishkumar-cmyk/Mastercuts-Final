import { useMemo } from 'react';
import { Plus } from 'lucide-react';
import { useCart, formatAed, formatDuration } from './CartProvider';
import { getFrequentlyAddedSuggestions } from '@/lib/booking/catalog';

export function FrequentlyAddedSection() {
  const { cart, addToCart } = useCart();

  const cartServiceIds = useMemo(
    () => cart.items.map((i) => i.serviceId),
    [cart.items]
  );

  const suggestions = useMemo(
    () => getFrequentlyAddedSuggestions(cartServiceIds, 6),
    [cartServiceIds]
  );

  if (suggestions.length === 0) return null;

  return (
    <div className="py-5 border-b border-black/10">
      <p className="text-[10px] uppercase tracking-[0.2em] text-text-secondary mb-3">
        Frequently added together
      </p>

      <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-none">
        {suggestions.map((svc) => (
          <div
            key={svc.id}
            className="flex-shrink-0 w-[140px] rounded-xl border border-black/10 overflow-hidden"
          >
            <div className="h-20 bg-black/[0.03] overflow-hidden">
              <img
                src={svc.image}
                alt={svc.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-2.5">
              <p className="text-xs font-medium text-text-primary leading-tight line-clamp-2 mb-1">
                {svc.name}
              </p>
              <p className="text-[10px] text-text-secondary mb-2">
                {formatDuration(svc.durationMin)} · {formatAed(svc.price)}
              </p>
              <button
                type="button"
                onClick={() => addToCart(svc.id)}
                className="w-full flex items-center justify-center gap-1 py-1.5 rounded-full border border-bg-dark text-bg-dark text-[11px] font-medium hover:bg-bg-dark hover:text-white transition-colors"
              >
                <Plus className="w-3 h-3" />
                Add
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
