import { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { rituals, getServicesForRitual, packages } from '@/lib/booking/catalog';
import { useCart } from '@/components/cart/CartProvider';
import { useAudience } from '@/components/services/useAudience';
import { AudienceToggle } from '@/components/services/AudienceToggle';
import {
  RitualChipRow,
  HOME_CHIPS,
  type ChipId,
} from '@/components/services/RitualChipRow';
import { ServiceCard, JourneyCard } from '@/components/services/ServiceCard';

// Extra breathing room between the bottom of the sticky filter bar and
// the heading of the section it "reveals". Keeps the heading from kissing
// the filter on smooth scroll.
const SCROLL_BREATHING = 12;

export function ExplorePage() {
  const { openCart } = useCart();
  const { hash } = useLocation();
  const [audience, setAudience] = useAudience();
  const [activeId, setActiveId] = useState<ChipId>('curated-journeys');

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
            Our Rituals for
          </p>
          <AudienceToggle value={audience} onChange={setAudience} size="sm" />
        </div>
        <RitualChipRow
          activeId={activeId}
          onChange={handleChipChange}
          variant="dark"
        />
      </div>

      {/* ───────── Curated Journeys ───────── */}
      <section
        ref={setSectionRef('curated-journeys')}
        id="curated-journeys"
        className="px-6 lg:px-16 pt-10 pb-14"
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
      {rituals.map((ritual) => {
        const services = getServicesForRitual(ritual.id, audience);
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
      })}

      {/* ───────── Cart CTA ───────── */}
      <div className="px-6 lg:px-16 pt-6">
        <div className="mx-auto max-w-lg">
          <Button
            onClick={() => openCart()}
            className="bg-white text-text-primary hover:bg-white/90 rounded-full px-8 py-6 text-sm font-medium flex items-center justify-center gap-3 group w-full"
          >
            Open Cart
            <Plus className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" />
          </Button>
        </div>
      </div>
    </main>
  );
}
