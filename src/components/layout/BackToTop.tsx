import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { useCart, useCartTotals } from '@/components/cart/CartProvider';

// How close to the document end counts as "reached the bottom".
const BOTTOM_THRESHOLD = 160;

/**
 * The header's navigate icon drops the user at the footer address card; this
 * brings them back without a long scroll. Only appears once the page is
 * actually at its end.
 */
export function BackToTop() {
  const { surface } = useCart();
  const { count } = useCartTotals();
  const [atBottom, setAtBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      // Nothing to return from on a page that barely scrolls.
      if (scrollable < BOTTOM_THRESHOLD * 2) {
        setAtBottom(false);
        return;
      }
      setAtBottom(window.scrollY >= scrollable - BOTTOM_THRESHOLD);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // Drawers and checkout own the bottom area when they are open.
  const visible = atBottom && surface === 'none';

  // Mobile stacks above the bottom nav, and above the cart strip when it is
  // showing. Desktop has neither — the cart strip floats centred there, clear
  // of the right gutter — so it sits at the corner.
  const bottomOffset =
    count > 0
      ? 'bottom-[calc(4rem+4.25rem+0.75rem+env(safe-area-inset-bottom))]'
      : 'bottom-[calc(4rem+0.75rem+env(safe-area-inset-bottom))]';

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="back-to-top"
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          initial={{ opacity: 0, scale: 0.8, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 8 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          // Ivory on dark — the button lives over the footer, which is
          // bg-dark, so a dark chip would disappear into it.
          className={`fixed right-4 z-40 w-11 h-11 rounded-full bg-ra-ivory text-bg-dark ring-1 ring-black/10 flex items-center justify-center shadow-xl shadow-black/40 hover:bg-white active:scale-95 transition-[transform,background-color] lg:w-12 lg:h-12 lg:right-6 lg:bottom-6 ${bottomOffset}`}
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
