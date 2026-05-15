import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Sparkles, Check } from 'lucide-react';
import { useCart, useCartTotals, formatAed } from './CartProvider';

const VISIBLE_MS = 2800;

export function OfferCelebration() {
  const { celebrationTriggerAt, appliedOffer } = useCart();
  const { discount } = useCartTotals();
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!celebrationTriggerAt || !appliedOffer || discount <= 0) return;
    setVisible(true);
    const t = window.setTimeout(() => setVisible(false), VISIBLE_MS);
    return () => window.clearTimeout(t);
  }, [celebrationTriggerAt, appliedOffer, discount]);

  if (!appliedOffer) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="status"
          aria-live="polite"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
          transition={{ duration: 0.24, ease: 'easeOut' }}
          className="pointer-events-none my-3 flex items-center gap-3 rounded-xl border border-accent-gold/30 bg-bg-primary px-4 py-3 shadow-[0_4px_16px_-4px_rgba(232,132,43,0.25)]"
        >
          <span className="shrink-0 w-9 h-9 rounded-full bg-accent-gold/15 text-accent-gold flex items-center justify-center">
            <Sparkles className="w-4 h-4" strokeWidth={2} />
          </span>
          <p className="text-sm text-text-primary leading-snug">
            <Check
              className="inline w-3.5 h-3.5 mr-1 -mt-0.5 text-accent-gold"
              strokeWidth={3}
              aria-hidden="true"
            />
            You're saving{' '}
            <span className="font-medium tabular-nums">{formatAed(discount)}</span>{' '}
            with <span className="italic">{appliedOffer.name}</span>
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
