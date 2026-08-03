import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon';
import {
  STUDIO_PHONE_DISPLAY,
  STUDIO_PHONE_E164,
  STUDIO_WHATSAPP,
} from '@/lib/contact';

const WHATSAPP_HREF = `https://wa.me/${STUDIO_WHATSAPP}`;
const TEL_HREF = `tel:${STUDIO_PHONE_E164}`;

interface ContactMenuProps {
  /** 'desktop' shows the number inline; 'mobile' is a round icon button. */
  variant: 'desktop' | 'mobile';
  /** Mobile only — matches the surrounding header chrome. */
  darkChrome?: boolean;
}

/**
 * Phone control in the header. Rather than dialling straight away it offers
 * Call and WhatsApp as separate choices, since a good share of clients prefer
 * to message. Closes on outside click, Escape, or picking an option.
 */
export function ContactMenu({ variant, darkChrome = false }: ContactMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      {variant === 'desktop' ? (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="menu"
          aria-expanded={open}
          className="flex items-center gap-2 text-sm text-white transition-opacity duration-200 hover:opacity-70"
        >
          <Phone className="w-4 h-4" />
          <span className="font-medium">{STUDIO_PHONE_DISPLAY}</span>
          <ChevronDown
            className={cn('w-3.5 h-3.5 transition-transform duration-200', open && 'rotate-180')}
          />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Contact Mastercuts"
          aria-haspopup="menu"
          aria-expanded={open}
          className={cn(
            'w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200',
            darkChrome
              ? 'bg-white/20 text-white hover:bg-white/30'
              : 'bg-white/15 text-white hover:bg-white/25 backdrop-blur-sm',
          )}
        >
          <Phone className="w-4 h-4" />
        </button>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'absolute top-full right-0 z-50 w-60 bg-bg-dark rounded-lg shadow-xl overflow-hidden',
              variant === 'desktop' ? 'mt-4' : 'mt-3',
            )}
          >
            <a
              href={TEL_HREF}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-5 py-3 hover:bg-white/10 transition-colors duration-200 group"
            >
              <Phone className="w-4 h-4 text-accent-gold shrink-0" />
              <span className="flex flex-col min-w-0">
                <span className="text-sm text-white/80 group-hover:text-white">Call</span>
                <span className="text-[10px] uppercase tracking-[0.18em] text-white/40 group-hover:text-white/60">
                  {STUDIO_PHONE_DISPLAY}
                </span>
              </span>
            </a>

            <a
              href={WHATSAPP_HREF}
              role="menuitem"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-5 py-3 hover:bg-white/10 transition-colors duration-200 group border-t border-white/10"
            >
              <WhatsAppIcon className="w-4 h-4 text-accent-gold shrink-0" />
              <span className="flex flex-col min-w-0">
                <span className="text-sm text-white/80 group-hover:text-white">WhatsApp</span>
                <span className="text-[10px] uppercase tracking-[0.18em] text-white/40 group-hover:text-white/60">
                  Chat with us
                </span>
              </span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
