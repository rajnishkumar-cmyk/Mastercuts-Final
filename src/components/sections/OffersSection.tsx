import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useCart } from '@/components/cart/CartProvider';
import { getActiveOffers, type Offer } from '@/lib/offers';

const COUNTDOWN_THRESHOLD_MS = 7 * 24 * 60 * 60 * 1000;

function formatCountdown(ms: number): string {
  if (ms <= 0) return 'Ending now';
  const totalMin = Math.floor(ms / 60000);
  const days = Math.floor(totalMin / (60 * 24));
  const hours = Math.floor((totalMin - days * 60 * 24) / 60);
  const minutes = totalMin - days * 60 * 24 - hours * 60;
  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

function formatValidUntil(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
  });
}

interface OfferCardProps {
  offer: Offer;
  onAvail: (offer: Offer) => void;
}

function OfferCard({ offer, onAvail }: OfferCardProps) {
  const validUntilMs = new Date(offer.validUntil).getTime();
  const [now, setNow] = useState(Date.now());
  const useTimer = validUntilMs - now <= COUNTDOWN_THRESHOLD_MS;

  useEffect(() => {
    if (!useTimer) return;
    const id = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(id);
  }, [useTimer]);

  const remainingMs = validUntilMs - now;

  return (
    <div className="relative flex flex-col h-full rounded-2xl bg-ra-indigo text-white p-6 lg:p-7 overflow-hidden transition-shadow hover:shadow-xl hover:shadow-ra-indigo/30">
      {/* Subtle decorative ring — mirrors the Ra emblem aesthetic without
          competing with the discount %, which stays the visual anchor. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-16 -right-16 w-48 h-48 rounded-full border border-accent-gold/15"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-12 -right-12 w-40 h-40 rounded-full border border-accent-gold/10"
      />

      {/* Top: eyebrow */}
      <div className="relative flex items-center justify-between gap-4 mb-6">
        <span className="text-[10px] uppercase tracking-[0.22em] text-accent-gold">
          Limited time
        </span>
      </div>

      {/* Discount — the dominant visual */}
      <div className="relative flex items-baseline gap-1 mb-5">
        <span className="font-serif text-6xl lg:text-7xl text-accent-gold leading-none tabular-nums">
          {offer.discountPercent}
        </span>
        <span className="font-serif text-2xl lg:text-3xl text-accent-gold leading-none">
          % OFF
        </span>
      </div>

      <h3 className="relative font-serif text-2xl lg:text-3xl text-white leading-[1.1] mb-3">
        {offer.name}
      </h3>

      {/* Validity */}
      <p className="relative text-xs lg:text-sm text-white/70 mb-2">
        {useTimer ? (
          <>
            Ends in{' '}
            <span className="text-white tabular-nums" aria-live="polite">
              {formatCountdown(remainingMs)}
            </span>
          </>
        ) : (
          <>Valid until {formatValidUntil(offer.validUntil)}</>
        )}
      </p>

      {offer.limitedNote && (
        <p className="relative text-[11px] uppercase tracking-[0.15em] text-accent-gold mb-6">
          {offer.limitedNote}
        </p>
      )}

      <div className="relative mt-auto pt-2">
        <button
          type="button"
          onClick={() => onAvail(offer)}
          className="group inline-flex items-center gap-2 rounded-full bg-white text-ra-indigo px-5 py-3 text-sm font-medium hover:bg-white/90 transition-colors"
        >
          Avail now
          <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>
      </div>
    </div>
  );
}

export function OffersSection() {
  const { setPendingOffer, openCart } = useCart();
  const reduce = useReducedMotion();
  const activeOffers = getActiveOffers();

  if (activeOffers.length === 0) return null;

  const handleAvail = (offer: Offer) => {
    setPendingOffer(offer.id);
    openCart({ name: 'basket' });
  };

  return (
    <section
      id="offers"
      className="bg-circle-light/40 border-y border-black/5 py-16 lg:py-24 overflow-x-clip"
    >
      <div className="max-w-6xl mx-auto">
        {/* Heading — keeps the section padding */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="px-6 lg:px-16 mb-10 lg:mb-14 max-w-2xl"
        >
          <p className="text-[10px] uppercase tracking-[0.22em] text-text-secondary mb-3">
            Offers
          </p>
          <h2 className="font-serif text-4xl lg:text-6xl text-text-primary leading-[1.02]">
            Seasonal <span className="italic">savings</span>.
          </h2>
          <p className="mt-4 text-sm lg:text-base text-text-secondary leading-relaxed">
            Apply an offer in one tap — the discount carries through to your
            cart and final payment breakdown.
          </p>
        </motion.div>

        {/* Mobile — horizontal scroll with peek of next card. Two-level
            structure (matches the RitualChipRow pattern that already works
            in this codebase): outer div is the scrollport with snap-padding;
            inner flex div carries the actual pl-6/pr-6 padding so the first
            and last cards sit reliably inset from the viewport edges. */}
        <div className="md:hidden overflow-x-auto snap-x snap-mandatory scroll-pl-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex gap-4 pl-6 pr-6 pb-3">
            {activeOffers.map((offer, i) => (
              <motion.div
                key={offer.id}
                initial={reduce ? false : { opacity: 0, y: 16 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: 0.08 + i * 0.08, ease: 'easeOut' }}
                className="snap-start shrink-0 w-[78%]"
              >
                <OfferCard offer={offer} onAvail={handleAvail} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Tablet & desktop — grid (padded) */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 px-6 lg:px-16">
          {activeOffers.map((offer, i) => (
            <motion.div
              key={offer.id}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: 0.08 + i * 0.08, ease: 'easeOut' }}
            >
              <OfferCard offer={offer} onAvail={handleAvail} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
