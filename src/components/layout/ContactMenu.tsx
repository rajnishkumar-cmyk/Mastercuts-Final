import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  STUDIO_PHONE_DISPLAY,
  STUDIO_PHONE_E164,
  STUDIO_WHATSAPP,
} from '@/lib/contact';

/** WhatsApp brand glyph — lucide dropped brand icons, so it is inlined. */
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 21.785h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 0 1 6.988 2.896 9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

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
