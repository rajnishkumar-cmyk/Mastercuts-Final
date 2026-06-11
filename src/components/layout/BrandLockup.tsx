import { cn } from '@/lib/utils';

interface Props {
  /**
   * Text colour context.
   * - `light` → white text, for the dark/transparent top nav.
   * - `dark`  → charcoal text, for the ivory menu screens.
   */
  tone?: 'light' | 'dark';
  className?: string;
}

/**
 * Ra by Mastercuts brand lockup — the emblem paired with the two-line
 * "Ra / By Mastercuts" logotype. Single source of truth so the size and
 * typography stay identical across the top nav bar and every menu screen
 * (desktop + mobile). Emblem size matches the home-page nav (h-12 lg:h-14).
 */
export function BrandLockup({ tone = 'light', className }: Props) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <img
        src="/assets/Logo/ra-emblem.png"
        alt="Ra by Mastercuts"
        className="h-12 lg:h-14 w-auto object-contain shrink-0"
      />
      <span className="flex flex-col items-start text-left leading-none">
        <span
          className={cn(
            'font-serif text-2xl lg:text-[1.75rem] leading-[0.9]',
            tone === 'light' ? 'text-white' : 'text-text-primary',
          )}
        >
          Ra
        </span>
        <span
          className={cn(
            'font-accent text-[9px] lg:text-[10px] uppercase tracking-[0.2em] leading-none mt-1',
            tone === 'light' ? 'text-white/70' : 'text-text-secondary',
          )}
        >
          By Mastercuts
        </span>
      </span>
    </span>
  );
}
