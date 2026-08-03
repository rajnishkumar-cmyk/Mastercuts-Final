import type { ReactNode } from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon';
import {
  STUDIO_ADDRESS,
  STUDIO_EMAIL,
  STUDIO_MAPS_URL,
  STUDIO_PHONE_DISPLAY,
  STUDIO_PHONE_E164,
  STUDIO_WHATSAPP,
} from '@/lib/contact';

/* Contact details shared by the desktop "More" overlay and the mobile
   hamburger sheet. Both sit on the ivory surface, so one treatment serves
   both — only the column count and alignment differ. */

interface RowProps {
  href: string;
  external?: boolean;
  icon: ReactNode;
  label: string;
  value: string;
  className?: string;
}

function ContactRow({ href, external, icon, label, value, className }: RowProps) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={cn('group flex items-start gap-3 text-left', className)}
    >
      <span className="shrink-0 w-9 h-9 rounded-full bg-black/[0.04] flex items-center justify-center text-accent-gold group-hover:bg-black/[0.08] transition-colors duration-200">
        {icon}
      </span>
      <span className="flex flex-col min-w-0 pt-0.5">
        <span className="text-[10px] uppercase tracking-[0.18em] text-text-secondary">
          {label}
        </span>
        <span className="text-sm text-text-primary leading-snug group-hover:opacity-60 transition-opacity break-words">
          {value}
        </span>
      </span>
    </a>
  );
}

interface MenuContactDetailsProps {
  /** 'overlay' is the centered desktop menu; 'sheet' is the mobile drawer. */
  variant: 'overlay' | 'sheet';
}

export function MenuContactDetails({ variant }: MenuContactDetailsProps) {
  const isOverlay = variant === 'overlay';

  return (
    <div className={cn('w-full', isOverlay && 'mt-14')}>
      <div className={cn('border-t border-black/10', isOverlay ? 'pt-8' : 'pt-5')} />

      <p
        className={cn(
          'text-[10px] uppercase tracking-[0.22em] text-text-secondary mb-6',
          isOverlay && 'text-center',
        )}
      >
        Get in touch
      </p>

      <div
        className={cn(
          'grid gap-x-10 gap-y-5',
          isOverlay ? 'sm:grid-cols-2' : 'grid-cols-1',
        )}
      >
        <ContactRow
          href={`tel:${STUDIO_PHONE_E164}`}
          icon={<Phone className="w-4 h-4" />}
          label="Call"
          value={STUDIO_PHONE_DISPLAY}
        />
        <ContactRow
          href={`https://wa.me/${STUDIO_WHATSAPP}`}
          external
          icon={<WhatsAppIcon className="w-4 h-4" />}
          label="WhatsApp"
          value={STUDIO_PHONE_DISPLAY}
        />
        <ContactRow
          href={`mailto:${STUDIO_EMAIL}`}
          icon={<Mail className="w-4 h-4" />}
          label="Email"
          value={STUDIO_EMAIL}
        />
        <ContactRow
          href={STUDIO_MAPS_URL}
          external
          icon={<MapPin className="w-4 h-4" />}
          label="Visit"
          value={STUDIO_ADDRESS}
        />
      </div>
    </div>
  );
}
