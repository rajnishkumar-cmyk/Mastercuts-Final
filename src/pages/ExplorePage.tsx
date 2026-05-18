import { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Search, X } from 'lucide-react';
import { rituals, getServicesForRitual, packages } from '@/lib/booking/catalog';
import { useAudience } from '@/components/services/useAudience';
import { AudienceToggle } from '@/components/services/AudienceToggle';
import {
  RitualChipRow,
  HOME_CHIPS,
  type ChipId,
} from '@/components/services/RitualChipRow';
import { ServiceCard, JourneyCard } from '@/components/services/ServiceCard';

// Flip to true once the salon reopens. Hides the live catalog and routes
// users into Ra at Home during the transition.
const SALON_OPEN = false;

// Extra breathing room between the bottom of the sticky filter bar and
// the heading of the section it "reveals". Keeps the heading from kissing
// the filter on smooth scroll.
const SCROLL_BREATHING = 12;

export function ExplorePage() {
  const { hash } = useLocation();
  const navigate = useNavigate();
  const [audience, setAudience] = useAudience();
  const [activeId, setActiveId] = useState<ChipId>('curated-journeys');
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [searchHidden, setSearchHidden] = useState(false);

  // Hide the search input on scroll-down (after 100px), reveal on scroll-up.
  // Same direction-aware pattern used in Navigation.tsx.
  useEffect(() => {
    if (!SALON_OPEN) return;
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (y > lastY && y > 100) setSearchHidden(true);
      else if (y < lastY) setSearchHidden(false);
      lastY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Renovation empty state — shown when the salon is closed for transition.
  if (!SALON_OPEN) {
    return (
      <main
        className="min-h-screen bg-bg-dark text-white flex flex-col"
        style={{ paddingTop: 'var(--nav-offset, 0px)' }}
      >
        <div className="flex-1 flex items-center justify-center px-6 lg:px-16 py-16">
          <div className="max-w-lg w-full text-center">
            <p className="text-[10px] uppercase tracking-[0.22em] text-accent-gold mb-4">
              In-salon services
            </p>
            <h1 className="font-serif text-4xl lg:text-5xl text-white leading-[1.05] mb-5">
              Our <span className="italic">salon</span> is renovating.
            </h1>
            <p className="text-sm lg:text-base text-white/65 leading-relaxed mb-10 max-w-md mx-auto">
              While the new studio is being thoughtfully prepared, our at-home
              massage rituals continue — delivered to Imperial Avenue Residences
              by our DHA-certified therapists. The new space at Imperial Avenue,
              Burj Khalifa Street, opens soon.
            </p>
            <button
              type="button"
              onClick={() => navigate('/at-home')}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-white text-text-primary px-7 py-3.5 text-sm font-medium hover:bg-white/90 transition-colors"
            >
              Explore Ra at Home
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to home
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Debounce the query 150ms so live-typing doesn't thrash render
  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedQuery(query.trim().toLowerCase()), 150);
    return () => window.clearTimeout(t);
  }, [query]);

  const isSearching = debouncedQuery.length > 0;
  const matchesQuery = useCallback(
    (text: string) => text.toLowerCase().includes(debouncedQuery),
    [debouncedQuery],
  );

  const filterRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<ChipId, HTMLElement | null>>({} as never);

  // Measure filter bar height so sections get the correct scroll-margin-top.
  // Stored as a CSS variable on the element tree so the sections can read it
  // without prop drilling.
  useLayoutEffect(() => {
    const update = () => {
      const h = filterRef.current?.offsetHeight ?? 180;
      document.documentElement.style.setProperty('--explore-filter-h', `${h}px`);
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

  // Cleanup CSS variable on unmount so it doesn't leak to other pages.
  useEffect(() => {
    return () => {
      document.documentElement.style.removeProperty('--explore-filter-h');
    };
  }, []);

  // Smooth-scroll a given chip id into view, offset by the sticky filter's
  // bottom edge. Used by both chip clicks and hash deep-links.
  const scrollToSection = useCallback((id: ChipId, behavior: ScrollBehavior = 'smooth') => {
    const el = sectionRefs.current[id];
    if (!el) return;
    const filter = filterRef.current;
    const filterBottom = filter?.getBoundingClientRect().bottom ?? 180;
    const targetY = window.scrollY + el.getBoundingClientRect().top - filterBottom - SCROLL_BREATHING;
    window.scrollTo({ top: targetY, behavior });
  }, []);

  // Handle deep links from the home page ("Explore the ritual" → /explore#id).
  // Run after layout settles.
  useLayoutEffect(() => {
    if (!hash) return;
    const id = hash.replace('#', '') as ChipId;
    if (!HOME_CHIPS.some((c) => c.id === id)) return;
    // Wait a frame for layout + image loads
    const raf = requestAnimationFrame(() => {
      setActiveId(id);
      scrollToSection(id, 'auto');
    });
    return () => cancelAnimationFrame(raf);
  }, [hash, scrollToSection]);

  // Scroll spy — find the last section whose top has passed under the sticky
  // filter. Runs on every scroll, throttled by rAF.
  useEffect(() => {
    let raf = 0;
    const compute = () => {
      const filterBottom = filterRef.current?.getBoundingClientRect().bottom ?? 180;
      const threshold = filterBottom + SCROLL_BREATHING + 4;
      let candidate: ChipId = HOME_CHIPS[0].id;
      for (const chip of HOME_CHIPS) {
        const el = sectionRefs.current[chip.id];
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top <= threshold) {
          candidate = chip.id;
        }
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
  }, []);

  const handleChipChange = useCallback(
    (id: ChipId) => {
      setActiveId(id);
      scrollToSection(id);
    },
    [scrollToSection],
  );

  const setSectionRef = (id: ChipId) => (el: HTMLElement | null) => {
    sectionRefs.current[id] = el;
  };

  return (
    <main
      className="min-h-screen bg-bg-dark text-white pb-28 lg:pb-16"
      style={{ paddingTop: 'var(--nav-offset, 0px)' }}
    >
      {/* ───────── Sticky filter bar — stacks below Navigation ───────── */}
      <div
        ref={filterRef}
        className="sticky z-30 bg-bg-dark/95 backdrop-blur-md border-b border-white/5 pt-4 pb-4 transition-[top] duration-300 ease-out"
        style={{ top: 'var(--nav-offset, 0px)' }}
      >
        <div className="px-6 lg:px-16 flex items-center justify-between mb-3">
          <p className="text-white/50 text-[11px] uppercase tracking-[0.18em]">
            Our services for
          </p>
          <AudienceToggle value={audience} onChange={setAudience} size="sm" />
        </div>

        {/* Search input — collapses on scroll-down, reveals on scroll-up */}
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
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search services"
                aria-label="Search services"
                className="w-full bg-white/5 border border-white/10 rounded-full pl-10 pr-10 py-2.5 text-sm text-white placeholder:text-white/40 focus:bg-white/10 focus:border-white/30 outline-none transition-colors"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Chip row hides while searching to keep the focus on results */}
        {!isSearching && (
          <RitualChipRow
            activeId={activeId}
            onChange={handleChipChange}
            variant="dark"
          />
        )}
      </div>

      {/* ───────── Curated Journeys ───────── */}
      <section
        ref={setSectionRef('curated-journeys')}
        id="curated-journeys"
        className={`px-6 lg:px-16 pt-10 pb-14 ${isSearching ? 'hidden' : ''}`}
        style={{ scrollMarginTop: 'calc(var(--explore-filter-h, 180px) + 12px)' }}
      >
        <div className="mx-auto max-w-lg">
          <div className="mb-6 space-y-2">
            <p className="text-[10px] uppercase tracking-[0.22em] text-accent-gold">
              Packages
            </p>
            <h2 className="font-serif text-3xl lg:text-4xl text-white leading-[1.05]">
              <span className="italic text-white/90">Curated</span> Journeys
            </h2>
            <p className="text-white/60 text-sm lg:text-base leading-6 max-w-prose">
              Half-day and full-day packages, thoughtfully assembled so every transition is calm.
            </p>
          </div>
          <div className="space-y-4">
            {packages.map((pkg) => (
              <JourneyCard key={pkg.id} journey={pkg} />
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Every ritual, in chip order ───────── */}
      {(() => {
        let totalMatches = 0;
        const sections = rituals.map((ritual) => {
          const base = getServicesForRitual(ritual.id, audience);
          const services = isSearching
            ? base.filter((s) => matchesQuery(s.name) || matchesQuery(s.description))
            : base;
          if (isSearching) totalMatches += services.length;
          if (isSearching && services.length === 0) return null;
          return (
            <section
              key={ritual.id}
              ref={setSectionRef(ritual.id)}
              id={ritual.id}
              className="px-6 lg:px-16 pt-4 pb-14 border-t border-white/5"
              style={{ scrollMarginTop: 'calc(var(--explore-filter-h, 180px) + 12px)' }}
            >
              <div className="mx-auto max-w-lg pt-8">
                <div className="mb-6 space-y-2">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-accent-gold">
                    {ritual.tagline}
                  </p>
                  <h2 className="font-serif text-3xl lg:text-4xl text-white leading-[1.05]">
                    <span className="italic text-white/90">{ritual.title}</span>{' '}
                    {ritual.titleItalic}
                  </h2>
                  <p className="text-white/60 text-sm lg:text-base leading-6 max-w-prose">
                    {ritual.description}
                  </p>
                </div>
                <div className="space-y-4">
                  {services.length === 0 ? (
                    <div className="rounded-xl border border-white/10 bg-white/[0.02] py-6 px-5 text-sm text-white/50 italic">
                      No services available for this audience yet. Try switching the filter above.
                    </div>
                  ) : (
                    services.map((svc) => <ServiceCard key={svc.id} service={svc} />)
                  )}
                </div>
              </div>
            </section>
          );
        });
        return (
          <>
            {isSearching && (
              <div className="px-6 lg:px-16 pt-6 pb-2">
                <div className="mx-auto max-w-lg">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-white/50">
                    {totalMatches === 0
                      ? `No services match "${debouncedQuery}"`
                      : `${totalMatches} ${totalMatches === 1 ? 'service' : 'services'} match "${debouncedQuery}"`}
                  </p>
                </div>
              </div>
            )}
            {sections}
          </>
        );
      })()}

    </main>
  );
}
