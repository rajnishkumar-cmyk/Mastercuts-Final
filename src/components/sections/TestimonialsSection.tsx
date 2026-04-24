import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

interface Testimonial {
  id: number;
  quote: string;
  author: string;
  service: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    quote: "I had an excellent experience at Mastercuts with Sarah for my new look. The stylist was thorough, explained the process clearly, and made me feel completely at ease. The staff was friendly, and the salon was clean and welcoming. My hair feels amazing, and I'm already looking forward to my next visit. Highly recommend this salon for top-notch care.",
    author: "Alessandro B.",
    service: "Signature Cut & Style"
  },
  {
    id: 2,
    quote: "Staff is amazing as always. Everyone is friendly and makes you feel welcomed. David is always friendly and takes the time to listen and render an exceptional service. He often checks on his past and current clients. I really appreciate his artistry. The salon feels like home.",
    author: "Jenny S.",
    service: "Colour Transformation"
  },
  {
    id: 3,
    quote: "The deep conditioning ritual completely transformed my hair. After years of heat damage I had given up hope, but the team here knew exactly what my hair needed. The treatment was incredibly relaxing and the results were immediate — soft, shiny, and full of life again.",
    author: "Priya M.",
    service: "Deep Conditioning Ritual"
  },
  {
    id: 4,
    quote: "I cannot imagine a more perfect wedding day experience. The bridal hair team was calm, creative, and precise — they brought my vision to life better than I had pictured it. Every bridesmaid felt beautiful and the whole morning felt like a luxury ritual rather than a rushed appointment.",
    author: "Claire D.",
    service: "Bridal Hair Design"
  }
];

const services = [
  'Signature Cut & Style',
  'Colour Transformation',
  'Deep Conditioning Ritual',
  'Bridal Hair Design'
];

const TIMER_DURATION = 6000;
const TICK_MS = 50;

// Ring SVG constants — sized to sit inline as a bullet replacement
const RING_SIZE = 16;   // px, matches ~w-4 h-4
const RING_R = 6;
const RING_CIRC = 2 * Math.PI * RING_R;

const LEFT_CURSOR = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='72' height='72' viewBox='0 0 72 72'%3E%3Ccircle cx='36' cy='36' r='34' fill='rgba(0%2C0%2C0%2C0.55)'/%3E%3Cpath d='M43 21L28 36L43 51' stroke='white' stroke-width='3' stroke-linecap='round' stroke-linejoin='round' fill='none'/%3E%3C/svg%3E") 36 36, w-resize`;
const RIGHT_CURSOR = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='72' height='72' viewBox='0 0 72 72'%3E%3Ccircle cx='36' cy='36' r='34' fill='rgba(0%2C0%2C0%2C0.55)'/%3E%3Cpath d='M29 21L44 36L29 51' stroke='white' stroke-width='3' stroke-linecap='round' stroke-linejoin='round' fill='none'/%3E%3C/svg%3E") 36 36, e-resize`;

export function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [progress, setProgress] = useState(0);

  // Timer resets on every testimonial change
  useEffect(() => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => Math.min(prev + (TICK_MS / TIMER_DURATION) * 100, 100));
    }, TICK_MS);
    return () => clearInterval(interval);
  }, [activeTestimonial]);

  // Auto-advance when ring completes
  useEffect(() => {
    if (progress >= 100) {
      setActiveTestimonial(prev => (prev + 1) % testimonials.length);
    }
  }, [progress]);

  const goPrev = () =>
    setActiveTestimonial(prev => (prev - 1 + testimonials.length) % testimonials.length);

  const goNext = () =>
    setActiveTestimonial(prev => (prev + 1) % testimonials.length);

  const strokeDashoffset = RING_CIRC * (1 - progress / 100);

  return (
    <section className="relative bg-bg-dark py-24 lg:py-32 select-none overflow-hidden" ref={ref}>

      {/* Full-width left zone → previous */}
      <div
        className="absolute inset-y-0 left-0 w-1/2 z-10"
        style={{ cursor: LEFT_CURSOR }}
        onClick={goPrev}
      />
      {/* Full-width right zone → next */}
      <div
        className="absolute inset-y-0 right-0 w-1/2 z-10"
        style={{ cursor: RIGHT_CURSOR }}
        onClick={goNext}
      />

      <div className="relative z-20 w-full px-6 lg:px-12 xl:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-0">

          {/* Left - Service list; ring replaces the bullet of the active item */}
          <div className="lg:pr-16 lg:border-r border-white/10">
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-white text-lg mb-8"
            >
              Testimonials
            </motion.p>

            <ul className="space-y-3">
              {services.map((service, index) => {
                const isActive = index === activeTestimonial;
                const hasTestimonial = index < testimonials.length;

                return (
                  <motion.li
                    key={service}
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  >
                    <button
                      onClick={() => hasTestimonial && setActiveTestimonial(index)}
                      className={`flex items-center gap-3 text-sm transition-colors duration-200 ${
                        isActive ? 'text-white' : 'text-white/40 hover:text-white/70'
                      }`}
                    >
                      {/* Bullet: ring for active item, dot otherwise */}
                      {isActive ? (
                        <span
                          className="flex-shrink-0"
                          style={{ width: RING_SIZE, height: RING_SIZE }}
                        >
                          <svg
                            width={RING_SIZE}
                            height={RING_SIZE}
                            viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
                            style={{ transform: 'rotate(-90deg)' }}
                          >
                            {/* Track */}
                            <circle
                              cx={RING_SIZE / 2}
                              cy={RING_SIZE / 2}
                              r={RING_R}
                              fill="none"
                              stroke="rgba(255,255,255,0.2)"
                              strokeWidth="1.5"
                            />
                            {/* Progress */}
                            <circle
                              cx={RING_SIZE / 2}
                              cy={RING_SIZE / 2}
                              r={RING_R}
                              fill="none"
                              stroke="white"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeDasharray={RING_CIRC}
                              strokeDashoffset={strokeDashoffset}
                              style={{ transition: `stroke-dashoffset ${TICK_MS}ms linear` }}
                            />
                          </svg>
                        </span>
                      ) : null}

                      {service}
                    </button>
                  </motion.li>
                );
              })}
            </ul>
          </div>

          {/* Right - Testimonial content */}
          <div className="lg:pl-16">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
              >
                <blockquote className="text-white text-lg lg:text-xl leading-relaxed mb-8">
                  &quot; {testimonials[activeTestimonial].quote} &quot;
                </blockquote>

                <p className="text-white/50 text-sm">
                  {testimonials[activeTestimonial].author}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
