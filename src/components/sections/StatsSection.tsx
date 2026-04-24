import { motion, useInView, useScroll, useMotionValueEvent } from 'framer-motion';
import { useRef, useState } from 'react';

const stats = [
  { value: '15',   label: 'YEARS OF SERVICE',     color: 'dark'  },
  { value: '50k',  label: 'HAIRCUTS STYLED',       color: 'white' },
  { value: '20K+', label: 'SATISFIED CLIENTS',     color: 'light' },
  { value: '10K',  label: 'COLOR TRANSFORMATIONS', color: 'light' },
] as const;

const colorClasses = {
  light: 'bg-circle-light text-text-primary',
  white: 'bg-white text-text-primary',
  dark:  'bg-circle-dark text-white',
};

// Scroll threshold at which each bubble (index i) pops in
const BUBBLE_THRESHOLDS = [0.15, 0.35, 0.55, 0.75];

export function StatsSection() {
  const wrapperRef        = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sectionRef        = useRef<HTMLElement>(null);
  const isInView          = useInView(wrapperRef, { once: true, margin: '-100px' });
  const [visibleCount, setVisibleCount] = useState(0);

  const { scrollYProgress } = useScroll({
    target: scrollContainerRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    let count = 0;
    for (let i = 0; i < BUBBLE_THRESHOLDS.length; i++) {
      if (latest >= BUBBLE_THRESHOLDS[i]) count = i + 1;
    }
    // Only ever increase — bubbles stay once revealed
    setVisibleCount((prev) => Math.max(prev, count));
  });

  return (
    <div ref={wrapperRef}>

      {/* ─────────────────────────────────────────────
          DESKTOP — scroll-pinned, bubbles pop in L→R
      ───────────────────────────────────────────── */}
      <div
        ref={scrollContainerRef}
        className="hidden lg:block relative"
        style={{ height: '200vh' }}
      >
        <section
          ref={sectionRef}
          className="sticky top-0 h-screen bg-bg-darker flex flex-col overflow-hidden"
        >
          {/* Rotating arcs background */}
          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px]"
            >
              <svg viewBox="0 0 900 900" className="w-full h-full opacity-10">
                <circle cx="450" cy="450" r="400" fill="none" stroke="white" strokeWidth="1" />
                <circle cx="450" cy="450" r="320" fill="none" stroke="white" strokeWidth="1" />
                <circle cx="450" cy="450" r="230" fill="none" stroke="white" strokeWidth="1" />
              </svg>
            </motion.div>
          </div>

          <div className="relative z-10 flex flex-col justify-center h-full gap-14 px-6 lg:px-12 xl:px-20 py-20">

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="text-center"
            >
              <p className="text-sm text-white/50 mb-4">Why choose us?</p>
              <h2 className="font-serif text-5xl lg:text-7xl text-white leading-tight">
                We are <span className="italic">here</span> to Enhance
              </h2>
              <h2 className="font-serif text-5xl lg:text-7xl text-white leading-tight">
                Your Style
              </h2>
            </motion.div>

            {/* Bubbles — equal size, fill width, pop in L→R */}
            <div className="grid grid-cols-4 gap-5 xl:gap-7 w-full">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ scale: 0.25, opacity: 0 }}
                  animate={
                    i < visibleCount
                      ? { scale: 1, opacity: 1 }
                      : { scale: 0.25, opacity: 0 }
                  }
                  transition={{
                    type: 'spring',
                    damping: 18,
                    stiffness: 180,
                  }}
                  className={`aspect-square rounded-full ${colorClasses[stat.color]} flex flex-col items-center justify-center text-center p-6`}
                >
                  <span className="font-serif text-3xl xl:text-4xl leading-none">
                    {stat.value}
                  </span>
                  <span className="text-[10px] xl:text-xs uppercase tracking-wider mt-2 opacity-70 leading-tight">
                    {stat.label}
                  </span>
                </motion.div>
              ))}
            </div>

          </div>
        </section>
      </div>

      {/* ─────────────────────────────────────────────
          MOBILE — equal 2×2 grid, fade-up entrance
      ───────────────────────────────────────────── */}
      <section className="lg:hidden bg-bg-darker py-20 relative overflow-hidden">

        {/* Rotating arcs background */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]"
          >
            <svg viewBox="0 0 600 600" className="w-full h-full opacity-10">
              <circle cx="300" cy="300" r="270" fill="none" stroke="white" strokeWidth="1" />
              <circle cx="300" cy="300" r="200" fill="none" stroke="white" strokeWidth="1" />
            </svg>
          </motion.div>
        </div>

        <div className="relative z-10 px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-center mb-12"
          >
            <p className="text-sm text-white/50 mb-3">Why choose us?</p>
            <h2 className="font-serif text-3xl sm:text-4xl text-white leading-tight">
              We are <span className="italic">here</span> to Enhance Your Style
            </h2>
          </motion.div>

          {/* 2×2 grid */}
          <div className="grid grid-cols-2 gap-4 place-items-center">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 + i * 0.12 }}
                className={`w-36 h-36 rounded-full ${colorClasses[stat.color]} flex flex-col items-center justify-center text-center p-4`}
              >
                <span className="font-serif text-2xl leading-none">{stat.value}</span>
                <span className="text-[9px] uppercase tracking-wider mt-1 opacity-70 leading-tight">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
