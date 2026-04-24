import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  rituals,
  getServicesForRitual,
  packages,
} from '@/lib/booking/catalog';
import { useAudience } from '@/components/services/useAudience';
import { AudienceToggle } from '@/components/services/AudienceToggle';
import {
  RitualChipRow,
  HOME_CHIPS,
  type ChipId,
} from '@/components/services/RitualChipRow';
import { ServiceCard, JourneyCard } from '@/components/services/ServiceCard';

// Desktop wipe animation only operates on rituals (not the Curated Journeys chip).
const scrollRituals = rituals;

const WIPE_START = 0.5;

export function ServicesSection() {
  const ref = useRef(null);
  const sectionRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const [audience, setAudience] = useAudience();

  // Mobile chip selection — defaults to first ritual
  const [mobileChipId, setMobileChipId] = useState<ChipId>(HOME_CHIPS[1]?.id ?? 'atelier');

  // currentService drives all desktop content
  const [currentService, setCurrentService] = useState(0);
  const [bgService, setBgService] = useState(0);
  const [nextService, setNextService] = useState<number | null>(null);
  const [wipeProgress, setWipeProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const section = sectionRef.current;
      const rect = section.getBoundingClientRect();
      const sectionHeight = section.offsetHeight;
      const viewportHeight = window.innerHeight;

      if (rect.top <= 0 && rect.bottom >= viewportHeight) {
        const scrollProgress = Math.abs(rect.top) / (sectionHeight - viewportHeight);
        const serviceFloat = scrollProgress * scrollRituals.length;
        const baseIndex = Math.min(Math.floor(serviceFloat), scrollRituals.length - 1);
        const subProgress = serviceFloat - Math.floor(serviceFloat);

        const canWipe = baseIndex < scrollRituals.length - 1;

        if (canWipe && subProgress >= WIPE_START) {
          const progress = (subProgress - WIPE_START) / (1 - WIPE_START);
          setNextService(baseIndex + 1);
          setWipeProgress(progress);
          setBgService(baseIndex);
          setCurrentService(progress >= 0.5 ? baseIndex + 1 : baseIndex);
        } else {
          setCurrentService(baseIndex);
          setBgService(baseIndex);
          setNextService(null);
          setWipeProgress(0);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Desktop: click a chip → either scroll to that ritual OR deep-link to explore
  const handleDesktopChipChange = useCallback(
    (id: ChipId) => {
      if (id === 'curated-journeys') {
        navigate('/explore#curated-journeys');
        return;
      }
      const idx = scrollRituals.findIndex((r) => r.id === id);
      if (idx < 0 || !sectionRef.current) return;
      const section = sectionRef.current;
      const scrollable = section.offsetHeight - window.innerHeight;
      const target = section.offsetTop + (idx / scrollRituals.length) * scrollable + 2;
      window.scrollTo({ top: target, behavior: 'smooth' });
    },
    [navigate],
  );

  // Mobile: click a chip → swap card (curated-journeys has its own card)
  const handleMobileChipChange = useCallback((id: ChipId) => {
    setMobileChipId(id);
  }, []);

  const activeDesktopChipId: ChipId =
    scrollRituals[currentService]?.id ?? 'atelier';

  const mobileRitual = useMemo(
    () => rituals.find((r) => r.id === mobileChipId),
    [mobileChipId],
  );

  return (
    <div id="services">

    {/* ─────────────────────────────────────────────
        DESKTOP — scroll-driven wipe animation + chip row
    ───────────────────────────────────────────── */}
    <section
      ref={sectionRef}
      className="hidden lg:block relative bg-bg-dark min-h-[800vh]"
    >
      <div
        ref={ref}
        className="sticky overflow-hidden relative transition-[top,height] duration-300 ease-out"
        style={{
          top: 'var(--nav-offset, 0px)',
          height: 'calc(100vh - var(--nav-offset, 0px))',
        }}
      >
        {/* Desktop chip row — pinned to top of the sticky container */}
        <div className="absolute top-0 left-0 right-0 z-30 pt-6 pb-3 bg-gradient-to-b from-bg-dark/90 via-bg-dark/70 to-transparent">
          <div className="flex items-center justify-between px-6 lg:px-16 mb-4">
            <p className="text-white/50 text-xs uppercase tracking-[0.18em]">Our Rituals for</p>
            <AudienceToggle value={audience} onChange={setAudience} size="sm" />
          </div>
          <RitualChipRow
            activeId={activeDesktopChipId}
            onChange={handleDesktopChipChange}
            variant="dark"
            className="lg:px-10"
          />
        </div>

        <div className="h-full grid grid-cols-1 lg:grid-cols-2">

          {/* Left panel — image wipe + bottom-right ritual title block */}
          <div className="relative h-full hidden lg:block overflow-hidden">
            <div className="absolute inset-0">
              <img
                src={scrollRituals[bgService].image}
                alt={scrollRituals[bgService].title}
                className="w-full h-full object-cover"
              />
            </div>

            {nextService !== null && (
              <div
                className="absolute inset-0"
                style={{ transform: `translateY(${(1 - wipeProgress) * 100}%)` }}
              >
                <img
                  src={scrollRituals[nextService].image}
                  alt={scrollRituals[nextService].title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Readability gradient — pinned to bottom, behind text */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-bg-dark via-bg-dark/70 to-transparent" />

            {/* Ritual title block — bottom-right */}
            <motion.div
              key={currentService}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="absolute bottom-10 right-10 z-10 max-w-md text-right"
            >
              <p className="text-[10px] uppercase tracking-[0.22em] text-accent-gold mb-3">
                {scrollRituals[currentService].tagline}
              </p>
              <h2 className="font-serif text-6xl xl:text-7xl leading-[0.95] text-white">
                <span className="italic text-white/90">
                  {scrollRituals[currentService].title}
                </span>{' '}
                {scrollRituals[currentService].titleItalic}
              </h2>
              <p className="mt-5 text-sm xl:text-base text-white/75 leading-relaxed">
                {scrollRituals[currentService].description}
              </p>
            </motion.div>
          </div>

          {/* Right panel — ServiceCard stack */}
          <div className="h-full flex flex-col items-center px-8 lg:px-16 pt-48 pb-10 overflow-y-auto">
            <motion.div
              key={currentService + ':' + audience}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="w-full max-w-md space-y-4"
            >
              {getServicesForRitual(scrollRituals[currentService].id, audience)
                .slice(0, 4)
                .map((svc) => (
                  <ServiceCard key={svc.id} service={svc} />
                ))}

              <button
                type="button"
                onClick={() => navigate(`/explore#${scrollRituals[currentService].id}`)}
                className="group mt-2 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-white/70 hover:text-white transition-colors"
              >
                Explore the ritual
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-8 right-8 lg:right-16 z-20">
          <Button
            onClick={() => navigate('/explore')}
            className="bg-white text-text-primary hover:bg-white/90 rounded-full px-8 py-6 text-sm font-medium flex items-center gap-3 group"
          >
            Explore all rituals
            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Button>
        </div>

      </div>
    </section>

    {/* ─────────────────────────────────────────────
        MOBILE — chip row + active preview card
    ───────────────────────────────────────────── */}
    <section className="lg:hidden bg-bg-dark pb-14">
      {/* Sticky filter — pins below the top nav (via --nav-offset) while the
          services section is in viewport. Transitions with nav show/hide. */}
      <div
        className="sticky z-20 bg-bg-dark pt-4 pb-3 transition-[top] duration-300 ease-out"
        style={{ top: 'var(--nav-offset, 0px)' }}
      >
        <div className="px-6 mb-3">
          <div className="flex items-center justify-between">
            <p className="text-white/50 text-xs uppercase tracking-[0.18em]">Our Rituals for</p>
            <AudienceToggle value={audience} onChange={setAudience} size="sm" />
          </div>
        </div>
        <RitualChipRow
          chips={HOME_CHIPS.filter(c => c.id !== 'curated-journeys')}
          activeId={mobileChipId}
          onChange={handleMobileChipChange}
          variant="dark"
        />
      </div>

      <div className="px-6 pt-8">
        <AnimatePresence mode="wait">
          {mobileChipId === 'curated-journeys' ? (
            <motion.div
              key="curated-journeys"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="space-y-5"
            >
              <div className="space-y-2">
                <h2 className="font-serif text-3xl text-white leading-[1.05]">
                  <span className="italic text-white/90">Curated</span> Journeys
                </h2>
                <p className="text-white/60 text-sm leading-6 max-w-prose">
                  Thoughtfully assembled packages — half-days and full-days reserved for a single arc.
                </p>
              </div>

              <div className="space-y-3">
                {packages.slice(0, 4).map((pkg) => (
                  <JourneyCard key={pkg.id} journey={pkg} />
                ))}
              </div>

              <button
                type="button"
                onClick={() => navigate('/explore#curated-journeys')}
                className="group mt-1 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-white/70 hover:text-white transition-colors"
              >
                Explore all journeys
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </motion.div>
          ) : mobileRitual ? (
            <motion.div
              key={mobileRitual.id + ':' + audience}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="space-y-5"
            >
              <div className="space-y-2">
                <h2 className="font-serif text-3xl text-white leading-[1.05]">
                  <span className="italic text-white/90">{mobileRitual.title}</span>{' '}
                  {mobileRitual.titleItalic}
                </h2>
                <p className="text-white/60 text-sm leading-6 max-w-prose">
                  {mobileRitual.description}
                </p>
              </div>

              <div className="space-y-3">
                {(() => {
                  const filtered = getServicesForRitual(mobileRitual.id, audience);
                  if (filtered.length === 0) {
                    return (
                      <div className="rounded-xl border border-white/10 bg-white/[0.02] py-6 px-5 text-sm text-white/50 italic">
                        No services available for this audience yet. Try switching the filter above.
                      </div>
                    );
                  }
                  return filtered.slice(0, 4).map((svc) => (
                    <ServiceCard key={svc.id} service={svc} />
                  ));
                })()}
              </div>

              <button
                type="button"
                onClick={() => navigate(`/explore#${mobileRitual.id}`)}
                className="group mt-1 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-white/70 hover:text-white transition-colors"
              >
                Explore the ritual
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <div className="px-6 mt-12">
        <Button
          onClick={() => navigate('/explore')}
          className="bg-white text-text-primary hover:bg-white/90 rounded-full px-8 py-6 text-sm font-medium flex items-center justify-center gap-3 group w-full"
        >
          Explore all rituals
          <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Button>
      </div>
    </section>

    </div>
  );
}
