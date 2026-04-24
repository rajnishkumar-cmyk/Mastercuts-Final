import type { ServiceAudience } from '@/lib/booking/types';

interface AudienceToggleProps {
  value: ServiceAudience;
  onChange: (next: ServiceAudience) => void;
  size?: 'sm' | 'md';
  className?: string;
}

export function AudienceToggle({
  value,
  onChange,
  size = 'sm',
  className = '',
}: AudienceToggleProps) {
  const dims = size === 'md'
    ? 'text-sm px-4 py-1.5'
    : 'text-xs px-3 py-1';

  const options: { key: Exclude<ServiceAudience, 'unisex'>; label: string }[] = [
    { key: 'gentlemen', label: 'Gentlemen' },
    { key: 'ladies', label: 'Ladies' },
  ];

  return (
    <div
      role="tablist"
      aria-label="Audience"
      className={`inline-flex items-center rounded-full bg-bg-primary/10 border border-white/15 p-0.5 ${className}`}
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
                : 'text-white/70 hover:text-white'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
