import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type ComponentType } from 'react';
import { useReducedMotion } from 'framer-motion';
import { Flower2, HandHeart, Scissors, Sun } from 'lucide-react';
import { useCatalog } from '@/lib/booking/CatalogProvider';
import { useAudience } from '@/components/services/useAudience';
import { AudienceToggle } from '@/components/services/AudienceToggle';
import { ServiceCard } from '@/components/services/ServiceCard';
import { cn } from '@/lib/utils';

const RA_EMBLEM = '/assets/Logo/ra-emblem.png';

// At-home categories during the transition. 'signature' is the entry-tier
// Ra Experience intro; the other three are the existing studio rituals.
type GroupId = 'signature' | 'massage' | 'nails' | 'threading';

type IconComponent = ComponentType<{ className?: string; strokeWidth?: number }>;

interface Group {
  id: GroupId;
  title: string;
  italic?: string;
  tagline: string;
  description: string;
  icon: IconComponent;
  /**
   * Returns true if a Service belongs in this group. Matches on `ritualId`
   * (a stable slug set by the adapter) rather than `id`, because the bookable
   * service id is now a backend UUID and no longer carries a category prefix.
   */
  matches: (service: { id: string; ritualId: string }) => boolean;
}

const GROUPS: Group[] = [
  {
    id: 'signature',
    title: 'Signature',
    italic: 'Rituals',
    tagline: 'Begin your Ra Experience',
    description:
      'A focused 45-minute introduction to the Ra approach — choose this to meet the studio for the first time.',
    icon: Sun,
    matches: (s) => s.ritualId === 'signature-rituals',
  },
  {
    id: 'massage',
    title: 'Body Rituals',
    italic: 'Massages',
    tagline: 'Wellness',
    description:
      'Signature, deep tissue, Balinese and Swedish — brought into your home.',
    icon: HandHeart,
    matches: (s) => s.ritualId === 'somatic-recovery',
  },
  {
    id: 'nails',
    title: 'Hand & Feet',
    italic: 'Rituals',
    tagline: 'Coming soon',
    description: 'Manicure, pedicure and care rituals, launching ahead of full studio opening.',
    icon: Flower2,
    matches: (s) => s.ritualId === 'alchemic-aesthetics',
  },
  {
    id: 'threading',
    title: 'Threading',
    italic: 'Rituals',
    tagline: 'Coming soon',
    description: 'Precise brow, lip and full-face shaping, launching ahead of full studio opening.',
    icon: Scissors,
    matches: (s) => s.ritualId === 'velvet-smooth',
  },
];

const SCROLL_BREATHING = 12;

export function AtHomePage() {
  const [audience, setAudience] = useAudience();
  const [activeId, setActiveId] = useState<GroupId>('signature');

  const filterRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<GroupId, HTMLElement | null>>({} as never);
  const chipScrollRef = useRef<HTMLDivElement>(null);
  const chipRefs = useRef<Record<GroupId, HTMLButtonElement | null>>({} as never);
  const reduceMotion = useReducedMotion();

  const { getAtHomeServices } = useCatalog();
  const services = useMemo(() => getAtHomeServices(audience), [audience, getAtHomeServices]);

  const grouped = useMemo(() => {
    return GROUPS.map((g) => ({
      group: g,
      items: services.filter((s) => g.matches(s)),
    }));
  }, [services]);

  useLayoutEffect(() => {
    const update = () => {
      const h = filterRef.current?.offsetHeight ?? 120;
      document.documentElement.style.setProperty('--athome-filter-h', `${h}px`);
    };
    update();
    if (!filterRef.current) return;
    const ro = new ResizeObserver(update);
    ro.observe(filterRef.current);
    window.addEventListener('resize', update);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', update);
    };
  }, []);

  useEffect(() => {
    return () => {
      document.documentElement.style.removeProperty('--athome-filter-h');
    };
  }, []);

  const scrollToSection = useCallback((id: GroupId, behavior: ScrollBehavior = 'smooth') => {
    const el = sectionRefs.current[id];
    if (!el) return;
    const filter = filterRef.current;
    const filterBottom = filter?.getBoundingClientRect().bottom ?? 120;
    const y = window.scrollY + el.getBoundingClientRect().top - filterBottom - SCROLL_BREATHING;
    window.scrollTo({ top: y, behavior });
  }, []);

  useEffect(() => {
    let raf = 0;
    const compute = () => {
      const filterBottom = filterRef.current?.getBoundingClientRect().bottom ?? 120;
      const threshold = filterBottom + SCROLL_BREATHING + 4;
      let candidate: GroupId = grouped[0]?.group.id ?? 'signature';
      for (const { group } of grouped) {
        const el = sectionRefs.current[group.id];
        if (!el) continue;
        if (el.getBoundingClientRect().top <= threshold) candidate = group.id;
      }
      setActiveId((prev) => (prev === candidate ? prev : candidate));
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        compute();
        raf = 0;
      });
    };
    compute();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [grouped]);

  // Keep the active chip centered in its horizontally-scrollable container.
  // Fires whenever the active id changes — either from scroll-spy or a tap.
  // Manual math (not scrollIntoView) so it cannot disturb the page's vertical
  // scroll position; only the chip row's horizontal scroll is touched.
  useEffect(() => {
    const container = chipScrollRef.current;
    const chip = chipRefs.current[activeId];
    if (!container || !chip) return;
    const containerRect = container.getBoundingClientRect();
    const chipRect = chip.getBoundingClientRect();
    const chipCenter =
      chipRect.left - containerRect.left + container.scrollLeft + chipRect.width / 2;
    const target = chipCenter - container.clientWidth / 2;
    const max = container.scrollWidth - container.clientWidth;
    const clamped = Math.max(0, Math.min(target, max));
    container.scrollTo({ left: clamped, behavior: reduceMotion ? 'auto' : 'smooth' });
  }, [activeId, reduceMotion]);

  const handleChipClick = (id: GroupId) => {
    setActiveId(id);
    scrollToSection(id);
  };

  const setSectionRef = (id: GroupId) => (el: HTMLElement | null) => {
    sectionRefs.current[id] = el;
  };

  return (
    <main
      className="min-h-screen bg-ra-ivory text-text-primary pb-28 lg:pb-16"
      style={{ paddingTop: 'var(--nav-offset, 0px)' }}
    >
      {/* Exclusivity strapline — emblem + eyebrow + italic note. Scrolls
          away as users move into the filter bar and service list. */}
      <div className="px-6 lg:px-16 pt-6 pb-4">
        {/* Mobile: centered emblem → eyebrow → italic note (2 lines) */}
        <div className="flex flex-col items-center text-center lg:hidden">
          <img
            src={RA_EMBLEM}
            alt="Ra"
            className="h-20 w-auto object-contain mb-3"
          />
          <p className="text-[11px] uppercase tracking-[0.2em] text-accent-gold mb-3">
            Ra at Home
          </p>
          <p className="text-sm italic text-text-secondary max-w-prose">
            Currently available exclusively to residents of
            <br />
            <span className="text-accent-gold">Imperial Avenue Residences</span>.
          </p>
        </div>

        {/* Desktop: emblem on left, eyebrow + italic note stacked on right, centered */}
        <div className="hidden lg:flex items-center justify-center gap-5">
          <img
            src={RA_EMBLEM}
            alt="Ra"
            className="h-20 w-auto object-contain shrink-0"
          />
          <div className="flex flex-col">
            <p className="text-[11px] uppercase tracking-[0.2em] text-accent-gold">
              Ra at Home
            </p>
            <p className="mt-1 text-base italic text-text-secondary">
              Currently available exclusively to residents of{' '}
              <span className="text-accent-gold">Imperial Avenue Residences.</span>
            </p>
          </div>
        </div>
      </div>

      {/* Sticky filter bar — back link, audience toggle, category chips. */}
      <div
        ref={filterRef}
        className="sticky z-30 bg-ra-ivory/95 backdrop-blur-md border-b border-black/10 pt-4 pb-4"
        style={{ top: 'var(--nav-offset, 0px)' }}
      >
        {/* Audience toggle row — full width on desktop (with generous 320px
            outer padding to keep the row visually contained), capped on mobile */}
        <div className="mx-auto max-w-lg lg:max-w-none px-6 lg:px-[320px] flex items-center justify-between gap-4 mb-3">
          <p className="text-text-secondary text-[11px] uppercase tracking-[0.18em] whitespace-nowrap">
            Home services for
          </p>
          <AudienceToggle value={audience} onChange={setAudience} size="sm" variant="light" />
        </div>

        {/* Category chip row — full width container. Inner uses w-max so it
            centers when content fits and overflows-scrolls when it doesn't. */}
        {grouped.length > 0 && (
          <div className="px-6 lg:px-16 flex justify-center">
            <div
              ref={chipScrollRef}
              className="flex gap-2 w-max max-w-full overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {grouped.map(({ group }) => {
                const active = group.id === activeId;
                const Icon = group.icon;
                return (
                  <button
                    key={group.id}
                    ref={(el) => {
                      chipRefs.current[group.id] = el;
                    }}
                    type="button"
                    onClick={() => handleChipClick(group.id)}
                    className={cn(
                      'shrink-0 rounded-2xl border px-3 py-2.5 transition-colors text-left flex items-center gap-2.5 min-w-[140px]',
                      active
                        ? 'bg-bg-dark text-white border-bg-dark'
                        : 'bg-white/60 text-text-primary border-black/15 hover:border-black/40 hover:bg-white',
                    )}
                  >
                    <span
                      className={cn(
                        'shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
                        active ? 'bg-white text-bg-dark' : 'bg-bg-dark/[0.06] text-accent-gold',
                      )}
                    >
                      <Icon className="w-4 h-4" strokeWidth={1.5} />
                    </span>
                    <span className="flex flex-col min-w-0">
                      <span
                        className={cn(
                          'font-sans text-[13px] leading-[18px] whitespace-nowrap',
                          active ? 'text-white' : 'text-text-primary',
                        )}
                      >
                        {group.title}
                        {group.italic ? <span className="italic"> {group.italic}</span> : null}
                      </span>
                      <span
                        className={cn(
                          'text-[10px] uppercase tracking-[0.18em] leading-tight mt-0.5',
                          active ? 'text-white/60' : 'text-text-secondary',
                        )}
                      >
                        {group.tagline}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Grouped categories */}
      {grouped.length === 0 ? (
        <div className="px-6 lg:px-16 pt-16 pb-20">
          <div className="mx-auto max-w-lg text-center">
            <p className="text-sm text-text-secondary">
              No at-home services available for this audience yet. Try
              switching the filter above.
            </p>
          </div>
        </div>
      ) : (
        grouped.map(({ group, items }) => (
          <section
            key={group.id}
            ref={setSectionRef(group.id)}
            id={group.id}
            className="px-6 lg:px-16 pt-10 pb-14 border-b border-black/5"
            style={{ scrollMarginTop: 'calc(var(--athome-filter-h, 120px) + 12px)' }}
          >
            <div className="mx-auto max-w-lg">
              <div className="mb-6">
                {items.length > 0 ? (
                  /* Active section: thin gold rules flank a small uppercase title */
                  <div className="flex items-center gap-3">
                    <span className="flex-1 h-px bg-accent-gold/60" />
                    <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-text-secondary whitespace-nowrap">
                      {group.title}
                      {group.italic ? ` ${group.italic}` : ''}
                    </p>
                    <span className="flex-1 h-px bg-accent-gold/60" />
                  </div>
                ) : (
                  /* Coming-soon section: full editorial header */
                  <div className="space-y-2">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-accent-gold">
                      {group.tagline}
                    </p>
                    <h2 className="font-serif text-[32px] text-text-primary leading-[1.05]">
                      {group.title}
                      {group.italic && (
                        <>
                          {' '}
                          <span className="italic">{group.italic}</span>
                        </>
                      )}
                    </h2>
                    <p className="text-text-secondary text-sm lg:text-base leading-6 max-w-prose">
                      {group.description}
                    </p>
                  </div>
                )}
              </div>
              <div className="space-y-4">
                {items.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-black/15 bg-white/60 px-6 py-10 text-center">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-accent-gold mb-3">
                      Coming soon
                    </p>
                    <p className="text-text-secondary text-sm leading-relaxed max-w-sm mx-auto">
                      We're finalising this menu. {group.title} {group.italic} will be available shortly, check back ahead of the full studio opening.
                    </p>
                  </div>
                ) : (
                  items.map((svc) => (
                    <ServiceCard key={svc.id} service={svc} />
                  ))
                )}
              </div>
            </div>
          </section>
        ))
      )}

    </main>
  );
}
