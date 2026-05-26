import type { ServiceAudience } from '@/lib/booking/types';

interface AudienceToggleProps {
  value: ServiceAudience;
  onChange: (next: ServiceAudience) => void;
  size?: 'sm' | 'md';
  /** Surface the toggle sits on. 'dark' = on indigo/charcoal section, 'light' =
   *  on Bone/Ivory page. Active saffron pill is identical in both. */
  variant?: 'dark' | 'light';
  className?: string;
}

export function AudienceToggle({
  value,
  onChange,
  size = 'sm',
  variant = 'dark',
  className = '',
}: AudienceToggleProps) {
  const dims = size === 'md'
    ? 'text-sm px-4 py-1.5'
    : 'text-xs px-3 py-1';

  const options: { key: Exclude<ServiceAudience, 'unisex'>; label: string }[] = [
    { key: 'gentlemen', label: 'Gentlemen' },
    { key: 'ladies', label: 'Ladies' },
  ];

  const isDark = variant === 'dark';
  const containerTone = isDark
    ? 'bg-bg-primary/10 border-white/15'
    : 'bg-bg-dark/5 border-black/10';
  const inactiveTone = isDark
    ? 'text-white/70 hover:text-white'
    : 'text-text-secondary hover:text-text-primary';

  return (
    <div
      role="tablist"
      aria-label="Audience"
      className={`inline-flex items-center rounded-full border p-0.5 ${containerTone} ${className}`}
    >
      {options.map((opt) => {
        const active = value === opt.key;
        return (
          <button
            key={opt.key}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.key)}
            className={`${dims} rounded-full font-sans transition-colors duration-200 ${
              active
                ? 'bg-accent-gold text-text-primary'
                : inactiveTone
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
