import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useCart } from '@/components/cart/CartProvider';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAudience } from '@/components/services/useAudience';
import type { ServiceAudience } from '@/lib/booking/types';
import { cn } from '@/lib/utils';

// The two cards in the sheet. "unisex" is not offered here — Explore is
// gendered by design; unisex services still surface inside both tabs.
const OPTIONS: {
  key: Exclude<ServiceAudience, 'unisex'>;
  label: string;
  tagline: string;
  image: string;
}[] = [
  {
    key: 'ladies',
    label: 'Ladies',
    tagline: 'Rituals tailored to her',
    image: '/assets/Images/H-04.png',
  },
  {
    key: 'gentlemen',
    label: 'Gentlemen',
    tagline: 'Rituals tailored to him',
    image: '/assets/Images/H-10.png',
  },
];

export function AudiencePickerSheet() {
  const { surface, closeAll } = useCart();
  const [, setAudience] = useAudience();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const open = surface === 'audience-picker';
  const side = isMobile ? 'bottom' : 'right';

  const handleSelect = (key: Exclude<ServiceAudience, 'unisex'>) => {
    setAudience(key);
    closeAll();
    // Delay navigation until the sheet's close animation completes so the
    // transition feels intentional instead of jarring.
    setTimeout(() => navigate('/explore'), 220);
  };

  return (
    <Sheet open={open} onOpenChange={(v) => (v ? null : closeAll())}>
      <SheetContent
        side={side}
        hideDefaultClose
        className={cn(
          'bg-bg-dark border-none p-0 flex flex-col overflow-hidden',
          isMobile
            ? 'w-full max-w-full rounded-t-3xl h-auto max-h-[88vh]'
            : 'w-full sm:max-w-md h-full max-h-screen',
        )}
      >
        {/* Grabber handle on mobile */}
        {isMobile && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 w-10 h-1 rounded-full bg-white/25" />
        )}

        {/* Close button */}
        <button
          type="button"
          onClick={closeAll}
          aria-label="Close"
          className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur text-white flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col px-6 pt-12 pb-10 lg:pt-16 lg:pb-14">
          {/* Heading */}
          <div className="mb-8 max-w-sm">
            <h2 className="font-serif text-4xl lg:text-5xl leading-[1.02] text-white">
              Who is this <span className="italic">visit</span> for?
            </h2>
          </div>

          {/* Option cards */}
          <div className="grid grid-cols-2 gap-3">
            {OPTIONS.map((opt, i) => (
              <motion.button
                key={opt.key}
                type="button"
                onClick={() => handleSelect(opt.key)}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.08 + i * 0.06, ease: 'easeOut' }}
                whileTap={{ scale: 0.98 }}
                className="group relative overflow-hidden rounded-2xl bg-bg-primary text-left border border-transparent hover:border-accent-gold transition-colors"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden">
                  <img
                    src={opt.image}
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-accent-gold mb-1.5">
                    {opt.tagline}
                  </p>
                  <p className="font-serif text-3xl text-white leading-none">
                    {opt.label}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>

          <p className="mt-8 text-center text-[11px] text-white/40 leading-relaxed">
            Unisex services appear in both selections.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
