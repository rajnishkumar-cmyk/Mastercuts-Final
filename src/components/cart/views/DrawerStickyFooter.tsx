import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useCart, useCartTotals, formatAed } from '../CartProvider';

export function DrawerStickyFooter() {
  const { pushDrawerView } = useCart();
  const { totalPrice, count } = useCartTotals();

  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          className="flex-shrink-0 border-t border-black/10 bg-bg-primary px-6 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))]"
        >
          <button
            type="button"
            onClick={() => pushDrawerView({ name: 'basket' })}
            className="group w-full rounded-full bg-bg-dark text-white py-4 px-5 flex items-center justify-between gap-3 hover:bg-bg-darker transition-colors"
          >
            <span className="flex flex-col items-start">
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/60">
                {count} {count === 1 ? 'service' : 'services'} added
              </span>
              <span className="text-sm font-medium">{formatAed(totalPrice)}</span>
            </span>
            <span className="flex items-center gap-2 text-sm font-medium">
              View cart
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
