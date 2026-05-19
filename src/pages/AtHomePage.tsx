import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type ComponentType } from 'react';
import { motion } from 'framer-motion';
import { Feather, Search, Sparkles, Sun, Wand2, X } from 'lucide-react';
import { getAtHomeServices } from '@/lib/booking/catalog';
import { useAudience } from '@/components/services/useAudience';
import { AudienceToggle } from '@/components/services/AudienceToggle';
import { ServiceCard } from '@/components/services/ServiceCard';
import { cn } from '@/lib/utils';

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
  matches: (serviceId: string) => boolean;
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
    // Future signature intros (Glow Intro, Atelier Intro) should share the
    // 'signature-' id prefix to surface here.
    matches: (id) => id.startsWith('signature-'),
  },
  {
    id: 'massage',
    title: 'Body Rituals',
    italic: 'Massages',
    tagline: 'Wellness',
    description:
      'Signature, deep tissue, Balinese, Swedish and aromatherapy — brought into your home.',
    icon: Sparkles,
    matches: (id) => id.startsWith('somatic-'),
  },
  {
    id: 'nails',
    title: 'Hand & Feet',
    italic: 'Rituals',
    tagline: 'Coming soon',
    description: 'Manicure, pedicure and care rituals — launching ahead of full studio opening.',
    icon: Wand2,
    matches: (id) => id.startsWith('alchemic-'),
  },
  {
    id: 'threading',
    title: 'Threading',
    italic: 'Rituals',
    tagline: 'Coming soon',
    description: 'Precise brow, lip and full-face shaping — launching ahead of full studio opening.',
    icon: Feather,
    matches: (id) => id.startsWith('velvet-threading-'),
  },
];

const SCROLL_BREATHING = 12;

export function AtHomePage() {
  const [audience, setAudience] = useAudience();
  const [activeId, setActiveId] = useState<GroupId>('signature');

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [searchHidden, setSearchHidden] = useState(false);

  // Debounce query (150ms)
  useEffect(() => {
    const t = window.setTimeout(
      () => setDebouncedQuery(searchQuery.trim().toLowerCase()),
      150,
    );
    return () => window.clearTimeout(t);
  }, [searchQuery]);

  // Collapse the search row based on absolute scrollY with a wide
  // hysteresis band. Direction-based detection is unstable on slow scroll —
  // sub-pixel jitter flips the perceived direction and re-fires the height
  // animation, which then visibly shifts content. Absolute thresholds with
  // a 180px dead zone mean the animation fires at most once per region.
  useEffect(() => {
    const HIDE_BELOW = 240;
    const SHOW_ABOVE = 60;
    let raf = 0;
    const apply = () => {
      const y = window.scrollY;
      setSearchHidden((prev) => {
        if (y > HIDE_BELOW) return true;
        if (y < SHOW_ABOVE) return false;
        return prev;
      });
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        apply();
        raf = 0;
      });
    };
    apply();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const filterRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<GroupId, HTMLElement | null>>({} as never);

  const services = useMemo(() => getAtHomeServices(audience), [audience]);

  const grouped = useMemo(() => {
    const matchesQuery = (text: string) => text.toLowerCase().includes(debouncedQuery);
    return GROUPS.map((g) => {
      const allItems = services.filter((s) => g.matches(s.id));
      const items = debouncedQuery
        ? allItems.filter((s) => matchesQuery(s.name) || matchesQuery(s.description))
        : allItems;
      return { group: g, items };
    }).filter((g) => {
      // When a search query is active, hide groups with zero matches so the
      // results list isn't padded with empty cards. With no query, show all
      // groups so coming-soon categories stay visible with their chip + a
      // "Coming soon" placeholder inside the section.
      return debouncedQuery ? g.items.length > 0 : true;
    });
  }, [services, debouncedQuery]);

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

  const handleChipClick = (id: GroupId) => {
    setActiveId(id);
    scrollToSection(id);
  };

  const setSectionRef = (id: GroupId) => (el: HTMLElement | null) => {
    sectionRefs.current[id] = el;
  };

  return (
    <main
      className="min-h-screen bg-bg-dark text-white pb-28 lg:pb-16"
      style={{ paddingTop: 'var(--nav-offset, 0px)' }}
    >
      {/* Exclusivity strapline — scrolls away as users move into the filter
          bar and service list. */}
      <div className="px-6 lg:px-16 pt-5 pb-4">
        <p className="text-[11px] uppercase tracking-[0.2em] text-accent-gold mb-1">
          Ra at Home
        </p>
        <p className="text-sm lg:text-base text-white/70 italic max-w-prose">
          Currently available exclusively to residents of Imperial Avenue
          Residences.
        </p>
      </div>

      {/* Sticky filter bar — back link, audience toggle, category chips. */}
      <div
        ref={filterRef}
        className="sticky z-30 bg-bg-dark/95 backdrop-blur-md border-b border-white/5 pt-4 pb-4"
        style={{ top: 'var(--nav-offset, 0px)' }}
      >
        {/* Audience toggle row — full width on desktop, capped on mobile */}
        <div className="mx-auto max-w-lg lg:max-w-none px-6 lg:px-16 flex items-center justify-between gap-4 mb-3">
          <p className="text-white/50 text-[11px] uppercase tracking-[0.18em] whitespace-nowrap">
            Home services for
          </p>
          <AudienceToggle value={audience} onChange={setAudience} size="sm" />
        </div>

        {/* Search row — sits between toggle and chips. Collapses to height: 0
            on scroll-down (no leftover gap); re-expands on scroll-up. */}
        <motion.div
          initial={false}
          animate={{
            height: searchHidden ? 0 : 'auto',
            opacity: searchHidden ? 0 : 1,
            marginBottom: searchHidden ? 0 : 12,
          }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="overflow-hidden"
        >
          <div className="px-6 lg:px-16">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search at-home services"
                aria-label="Search at-home services"
                className="w-full bg-white/5 border border-white/10 rounded-full pl-10 pr-10 py-2 text-sm text-white placeholder:text-white/40 focus:bg-white/10 focus:border-white/30 outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Category chip row — full width container. Inner uses w-max so it
            centers when content fits and overflows-scrolls when it doesn't. */}
        {grouped.length > 0 && (
          <div className="px-6 lg:px-16 flex justify-center">
            <div className="flex gap-2 w-max max-w-full overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {grouped.map(({ group }) => {
                const active = group.id === activeId;
                const Icon = group.icon;
                return (
                  <button
                    key={group.id}
                    type="button"
                    onClick={() => handleChipClick(group.id)}
                    className={cn(
                      'shrink-0 rounded-2xl border px-3 py-2.5 transition-colors text-left flex items-center gap-2.5 min-w-[140px]',
                      active
                        ? 'bg-white text-bg-dark border-white'
                        : 'bg-white/[0.03] text-white/80 border-white/15 hover:border-white/40 hover:text-white',
                    )}
                  >
                    <span
                      className={cn(
                        'shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
                        active ? 'bg-bg-dark text-white' : 'bg-white/10 text-accent-gold',
                      )}
                    >
                      <Icon className="w-4 h-4" strokeWidth={1.5} />
                    </span>
                    <span className="flex flex-col min-w-0">
                      <span
                        className={cn(
                          'font-serif text-sm leading-tight whitespace-nowrap',
                          active ? 'text-bg-dark' : 'text-white',
                        )}
                      >
                        {group.title}
                        {group.italic ? <span className="italic"> {group.italic}</span> : null}
                      </span>
                      <span
                        className={cn(
                          'text-[10px] uppercase tracking-[0.18em] leading-tight mt-0.5',
                          active ? 'text-bg-dark/60' : 'text-white/45',
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
            <p className="text-sm text-white/60">
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
            className="px-6 lg:px-16 pt-10 pb-14 border-b border-white/5"
            style={{ scrollMarginTop: 'calc(var(--athome-filter-h, 120px) + 12px)' }}
          >
            <div className="mx-auto max-w-lg">
              <div className="mb-6 space-y-2">
                <p className="text-[10px] uppercase tracking-[0.22em] text-accent-gold">
                  {group.tagline}
                </p>
                <h2 className="font-serif text-3xl lg:text-4xl text-white leading-[1.05]">
                  {group.title}
                  {group.italic && (
                    <>
                      {' '}
                      <span className="italic">{group.italic}</span>
                    </>
                  )}
                </h2>
                <p className="text-white/60 text-sm lg:text-base leading-6 max-w-prose">
                  {group.description}
                </p>
              </div>
              <div className="space-y-4">
                {items.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-10 text-center">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-accent-gold mb-3">
                      Coming soon
                    </p>
                    <p className="text-white/70 text-sm leading-relaxed max-w-sm mx-auto">
                      We're finalising this menu. {group.title} {group.italic} will be available shortly — check back ahead of the full studio opening.
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
