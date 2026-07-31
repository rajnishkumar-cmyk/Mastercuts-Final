/**
 * Studio contact channels — one definition, three presentations.
 *
 * The header only has room for the phone number, so email used to live in the
 * footer alone. Instead of crowding the nav with a second address, the phone
 * cluster becomes a trigger that reveals every channel:
 *   - `ContactTrigger` — desktop header: number stays visible, opens a popover.
 *   - `ContactLinks`   — stacked list for the mobile sheet and the DesktopMenu
 *                        overlay, which previously showed phone only.
 *
 * Numbers and the address come from `@/lib/contact`, never hardcoded here.
 */
import { ChevronDown, Mail, MessageCircle, Phone } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import {
  STUDIO_EMAIL,
  STUDIO_PHONE_DISPLAY,
  STUDIO_PHONE_E164,
  STUDIO_WHATSAPP,
} from '@/lib/contact';

const WHATSAPP_GREETING = "Hello Mastercuts, I'd like to ask about your services.";

interface Channel {
  key: string;
  icon: typeof Phone;
  label: string;
  value: string;
  href: string;
  /** Opens in a new tab — WhatsApp Web / the WhatsApp app. */
  external?: boolean;
}

const CHANNELS: Channel[] = [
  {
    key: 'call',
    icon: Phone,
    label: 'Call the studio',
    value: STUDIO_PHONE_DISPLAY,
    href: `tel:${STUDIO_PHONE_E164}`,
  },
  {
    key: 'whatsapp',
    icon: MessageCircle,
    label: 'WhatsApp',
    value: 'Chat with us',
    href: `https://wa.me/${STUDIO_WHATSAPP}?text=${encodeURIComponent(WHATSAPP_GREETING)}`,
    external: true,
  },
  {
    key: 'email',
    icon: Mail,
    label: 'Email',
    value: STUDIO_EMAIL,
    href: `mailto:${STUDIO_EMAIL}`,
  },
];

/** `target`/`rel` for a channel — only WhatsApp leaves the site. */
function linkTarget(channel: Channel) {
  return channel.external
    ? { target: '_blank' as const, rel: 'noreferrer noopener' }
    : {};
}

interface ContactLinksProps {
  /** `dark` = white text on a dark surface, `light` = dark text on ivory. */
  tone: 'dark' | 'light';
  /** Fired after a channel is picked, so the host menu can close itself. */
  onSelect?: () => void;
  className?: string;
}

/**
 * Stacked Call / WhatsApp / Email list. Used inside the mobile hamburger
 * sheet and the full-screen DesktopMenu, both of which sit on ivory.
 */
export function ContactLinks({ tone, onSelect, className = '' }: ContactLinksProps) {
  const isDark = tone === 'dark';

  return (
    <div className={`flex flex-col ${isDark ? '' : 'gap-4'} ${className}`}>
      {CHANNELS.map((channel) => {
        const Icon = channel.icon;
        return (
          <a
            key={channel.key}
            href={channel.href}
            {...linkTarget(channel)}
            onClick={onSelect}
            className={
              isDark
                ? 'flex items-center gap-3 px-5 py-3 hover:bg-white/10 transition-colors duration-200 group'
                : 'flex items-center gap-3 group'
            }
          >
            <Icon
              className={`w-4 h-4 shrink-0 ${
                isDark ? 'text-white/50 group-hover:text-white/80' : 'text-text-muted'
              } transition-colors duration-200`}
            />
            <span className="flex flex-col gap-0.5 min-w-0">
              <span
                className={`text-[10px] uppercase tracking-[0.18em] ${
                  isDark
                    ? 'text-white/40 group-hover:text-white/60'
                    : 'text-text-muted'
                } transition-colors duration-200`}
              >
                {channel.label}
              </span>
              <span
                className={`text-sm truncate ${
                  isDark
                    ? 'text-white/80 group-hover:text-white'
                    : 'text-text-secondary group-hover:text-text-primary'
                } transition-colors duration-200`}
              >
                {channel.value}
              </span>
            </span>
          </a>
        );
      })}
    </div>
  );
}

/**
 * Desktop header cluster. The number stays readable at a glance; clicking
 * anywhere on it opens the full channel list rather than firing a `tel:`
 * that most desktop browsers cannot act on anyway.
 */
export function ContactTrigger() {
  return (
    <Popover>
      <PopoverTrigger
        aria-label="Contact Mastercuts"
        className="group flex items-center gap-2 text-sm text-white transition-colors duration-200 hover:opacity-70"
      >
        <Phone className="w-4 h-4" />
        <span className="font-medium">{STUDIO_PHONE_DISPLAY}</span>
        <span className="text-xs text-white/60">Dubai</span>
        <ChevronDown className="w-4 h-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={16}
        className="w-72 p-0 bg-bg-dark border-none rounded-lg shadow-xl overflow-hidden"
      >
        <ContactLinks tone="dark" />
      </PopoverContent>
    </Popover>
  );
}
