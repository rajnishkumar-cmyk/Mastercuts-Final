import { motion, useInView, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { journeys, getJourneyTotals } from '@/lib/booking/catalog';
import { formatAed, formatDuration } from '@/components/cart/CartProvider';

export function TechnologySection() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(wrapperRef, { once: true, margin: '-100px' });
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();

  const { scrollYProgress } = useScroll({
    target: scrollContainerRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const index = Math.min(
      Math.floor(latest * journeys.length),
      journeys.length - 1
    );
    setActiveIndex(index);
  });

  const handlePrev = () => setActiveIndex((prev) => Math.max(0, prev - 1));
  const handleNext = () =>
    setActiveIndex((prev) => Math.min(journeys.length - 1, prev + 1));

  const active = journeys[activeIndex];
  const activeTotals = getJourneyTotals(active);

  return (
    <div ref={wrapperRef}>
      {/* ─────────────────────────────────────────────
          DESKTOP — header scrolls off, content pins
      ───────────────────────────────────────────── */}
      <section id="experiences" className="hidden lg:block bg-bg-primary">

        <div className="px-6 lg:px-12 xl:px-20 pt-24 lg:pt-32 pb-16 lg:pb-20 flex flex-col lg:flex-row lg:items-end justify-between">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-sm text-text-secondary mb-4"
            >
              Curated Journeys
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-serif text-section lg:text-section-lg text-text-primary leading-tight"
            >
              Beyond the <span className="italic">Appointment</span>
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex gap-12 mt-8"
            >
              <span className="text-sm text-text-secondary">Relaxing</span>
              <span className="text-sm text-text-secondary">Transformative</span>
              <span className="text-sm text-text-secondary">Immersive</span>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 lg:mt-0"
          >
            <Button
              onClick={() => navigate(`/journeys/${active.id}`)}
              className="bg-bg-dark text-white hover:bg-bg-dark/90 rounded-full px-8 py-6 text-sm font-medium flex items-center gap-3 group"
            >
              Explore this journey
              <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Button>
          </motion.div>
        </div>

        <div
          ref={scrollContainerRef}
          className="relative"
          style={{ height: `${journeys.length * 100}vh` }}
        >
          <div className="sticky top-0 h-screen flex items-center">
            <div className="w-full px-6 lg:px-12 xl:px-20 py-16 lg:py-24">
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="relative pl-16 lg:pl-20 flex items-center"
                >
                  <div className="overflow-hidden bg-black max-w-[400px] w-full" style={{ aspectRatio: '4/5', maxHeight: '480px' }}>
                    <motion.img
                      key={activeIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.6 }}
                      src={active.image}
                      alt={active.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-baseline gap-1.5">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={activeIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="font-serif text-5xl lg:text-6xl text-text-primary leading-none tracking-normal"
                      >
                        {String(activeIndex + 1).padStart(2, '0')}
                      </motion.span>
                    </AnimatePresence>
                    <span className="text-xs text-text-secondary">
                      / {String(journeys.length).padStart(2, '0')}
                    </span>
                  </div>
                </motion.div>

                <div className="flex flex-col justify-center">
                  <div>
                    {journeys.map((journey, index) => {
                      const isActive = index === activeIndex;
                      return (
                        <motion.div
                          key={journey.id}
                          initial={{ opacity: 0, y: 30 }}
                          animate={isInView ? { opacity: 1, y: 0 } : {}}
                          transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                          className={`border-t border-text-primary/10 transition-all duration-500 ${
                            isActive ? 'py-8' : 'py-5'
                          }`}
                        >
                          <div className="flex flex-col gap-1">
                            {isActive && (
                              <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                className="text-xs text-text-secondary tracking-wide mb-1"
                              >
                                {journey.category}
                              </motion.p>
                            )}
                            <div className="flex items-center justify-between gap-4">
                              <h3
                                className={`font-serif transition-all duration-500 ${
                                  isActive
                                    ? 'text-3xl lg:text-4xl text-text-primary'
                                    : 'text-xl lg:text-2xl text-text-primary/40'
                                }`}
                              >
                                {journey.name}
                              </h3>
                              {!isActive && (
                                <button
                                  type="button"
                                  onClick={() => navigate(`/journeys/${journey.id}`)}
                                  className="text-sm text-text-secondary hover:text-text-primary transition-colors hidden sm:flex items-center gap-1"
                                >
                                  Learn more
                                  <ArrowUpRight className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                            {isActive && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                transition={{ duration: 0.4 }}
                                className="mt-2"
                              >
                                <p className="text-text-secondary text-sm max-w-sm">
                                  {journey.description}
                                </p>
                                <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-text-secondary">
                                  {formatDuration(activeTotals.totalDuration)} · from {formatAed(activeTotals.totalPriceDiscounted)} · save {journey.savings}%
                                </p>
                                <button
                                  type="button"
                                  onClick={() => navigate(`/journeys/${journey.id}`)}
                                  className="mt-4 group inline-flex items-center gap-1.5 text-sm text-text-primary underline underline-offset-4 hover:no-underline"
                                >
                                  Learn more
                                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                </button>
                              </motion.div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                    <div className="border-t border-text-primary/10" />
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

      </section>

      {/* ─────────────────────────────────────────────
          MOBILE — arrow carousel
      ───────────────────────────────────────────── */}
      <section id="experiences-mobile" className="lg:hidden bg-bg-primary py-16 overflow-hidden">

        <div className="px-6 mb-10">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-sm text-text-secondary mb-4"
          >
            Curated Journeys
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif text-section text-text-primary leading-tight"
          >
            Beyond the <span className="italic">Appointment</span>
          </motion.h2>
        </div>

        <div className="overflow-hidden">
          <motion.div
            className="flex gap-3"
            animate={{ x: `calc(10vw - ${activeIndex} * (80vw + 12px))` }}
            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
          >
            {journeys.map((journey, index) => (
              <button
                key={journey.id}
                type="button"
                onClick={() => navigate(`/journeys/${journey.id}`)}
                className="flex-shrink-0 overflow-hidden bg-black"
                style={{ width: '80vw', aspectRatio: '4/5' }}
                aria-label={`Open ${journey.name}`}
              >
                <img
                  src={journey.image}
                  alt={journey.name}
                  className={`w-full h-full object-cover transition-opacity duration-500 ${
                    index === activeIndex ? 'opacity-100' : 'opacity-40'
                  }`}
                />
              </button>
            ))}
          </motion.div>
        </div>

        <div className="px-6 mt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
            >
              <p className="text-xs uppercase tracking-[0.18em] text-text-secondary mb-2">
                {active.category}
              </p>
              <h3 className="font-serif text-2xl text-text-primary mb-3">
                {active.name}
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed mb-3">
                {active.description}
              </p>
              <p className="text-[11px] uppercase tracking-[0.18em] text-text-secondary mb-6">
                {formatDuration(activeTotals.totalDuration)} · from {formatAed(activeTotals.totalPriceDiscounted)} · save {active.savings}%
              </p>
              <button
                type="button"
                onClick={() => navigate(`/journeys/${active.id}`)}
                className="group inline-flex items-center gap-1.5 text-sm text-text-primary underline underline-offset-4"
              >
                Learn more
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between px-6 mt-10">
          <button
            onClick={handlePrev}
            disabled={activeIndex === 0}
            className="w-14 h-14 rounded-full border border-text-primary/20 flex items-center justify-center disabled:opacity-30 transition-opacity active:scale-95"
            aria-label="Previous journey"
          >
            <ChevronLeft className="w-5 h-5 text-text-primary" />
          </button>
          <span className="text-sm text-text-secondary tracking-widest">
            {String(activeIndex + 1).padStart(2, '0')} / {String(journeys.length).padStart(2, '0')}
          </span>
          <button
            onClick={handleNext}
            disabled={activeIndex === journeys.length - 1}
            className="w-14 h-14 rounded-full border border-text-primary/20 flex items-center justify-center disabled:opacity-30 transition-opacity active:scale-95"
            aria-label="Next journey"
          >
            <ChevronRight className="w-5 h-5 text-text-primary" />
          </button>
        </div>
      </section>
    </div>
  );
}
