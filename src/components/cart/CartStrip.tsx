import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useCart, useCartTotals, formatAed } from './CartProvider';

export function CartStrip() {
  const { cart, surface, openCart } = useCart();
  const { count, totalPrice } = useCartTotals();
  const visible = count > 0 && surface === 'none';

  const thumbs = cart.items.slice(0, 3);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="cart-strip"
          initial={{ y: 140, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 140, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 30 }}
          className="lg:hidden fixed left-4 right-4 z-40"
          style={{
            bottom: 'calc(4rem + 0.75rem + env(safe-area-inset-bottom))',
          }}
        >
          <button
            type="button"
            onClick={() => openCart({ name: 'basket' })}
            className="group w-full rounded-full bg-bg-dark text-white pl-3 pr-5 py-2.5 flex items-center gap-3 shadow-xl shadow-black/30 active:scale-[0.99] transition-transform"
          >
            {/* Thumbnail stack */}
            <div className="flex -space-x-6 flex-shrink-0">
              {thumbs.map((item) => (
                <div
                  key={item.id}
                  className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-bg-dark bg-black/30"
                >
                  <img src={item.image} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>

            {/* Count + total */}
            <div className="flex-1 min-w-0 text-left overflow-hidden">
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/50 leading-none mb-1">
                Your cart
              </p>
              <motion.p
                key={`${count}-${totalPrice}`}
                initial={{ y: -6, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="text-sm text-white leading-none truncate"
              >
                {count} {count === 1 ? 'service' : 'services'}
                <span className="text-white/50"> · </span>
                {formatAed(totalPrice)}
              </motion.p>
            </div>

            {/* Right action */}
            <span className="flex items-center gap-1.5 text-xs font-medium text-white flex-shrink-0">
              View cart
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
