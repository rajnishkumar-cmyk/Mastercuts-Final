import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

export function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Use the section as the scroll target.
  // With h-[200vh], scrolling from top of section to bottom equals exactly 100vh of scroll distance.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Section is h-[300vh]. With offset ["start start","end end"], scroll range = 300vh-100vh = 200vh.
  // Animations complete at scroll=100vh → progress=0.5. Hero holds in end-state 100vh→200vh
  // so the about section can slide over it from below.

  // 1. Text fades out in the first ~3vh of scroll (0.015 = 3/200)
  const initialTextOpacity = useTransform(scrollYProgress, [0, 0.015, 0.5], [1, 0, 0]);
  const initialTextY = useTransform(scrollYProgress, [0, 0.015, 0.5], [0, -30, -30]);

  // 2. Right container expands over the first half of the scroll range
  const rightContainerWidth = useTransform(scrollYProgress, [0, 0.5], ["50%", "100%"]);

  // 3. Slogan fades in and reaches full opacity early (before container fully expands)
  const largeTextColor = useTransform(scrollYProgress, [0.015, 0.35, 1], ["rgba(255,255,255,0)", "rgba(255,255,255,1)", "rgba(255,255,255,1)"]);

  // 4. Slogan slides smoothly from slightly right of the container's left edge to perfectly dead center.
  // 20vw pushes it enough to avoid clipping at the 50% width start state without throwing it out of the container completely.
  const sloganX = useTransform(scrollYProgress, [0.015, 0.5], ["20vw", "0vw"]);

  // Use color interpolation for the main title because iOS/Safari ignores parent opacity when mix-blend-difference is used
  const initialTextColor = useTransform(scrollYProgress, [0, 0.015, 0.5], ["rgba(255, 255, 255, 1)", "rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0)"]);

  return (
    <section id="hero" ref={containerRef} className="relative w-full h-auto lg:h-[300vh] bg-bg-primary">
      {/* Sticky Inner Container for Desktop */}
      <div className="lg:sticky lg:top-0 lg:h-screen w-full flex flex-col lg:flex-row overflow-hidden">

        {/* Mobile Layout (Visible only on small screens) */}
        <div className="lg:hidden flex flex-col items-center justify-center px-4 pt-36 pb-10 z-10 w-full text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-[10px] uppercase tracking-[0.22em] text-text-primary/60 mb-5 leading-[1.6]"
          >
            Home services available
            <br />
            Studio opening soon
          </motion.p>

          <motion.img
            src="/assets/Logo/mastercutlogo.png"
            alt="Ra by Mastercuts"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.22 }}
            className="w-20 h-20 object-contain mb-5"
          />

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="font-serif text-[2.25rem] tracking-tight text-text-primary leading-[1.1]"
          >
            Your Sanctuary of
            <br />
            <span className="italic">beauty &amp; inner power</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.9 }}
            className="font-serif text-base text-text-primary/80 italic mt-6 max-w-[300px] leading-snug text-center"
          >
            Experience the pinnacle of beauty and wellness at Dubai's most exclusive spa and salon destination.
          </motion.p>
        </div>

        {/* Mobile Bottom Image (Only visible on small screens) */}
        <div className="w-full h-[50vh] relative z-0 flex-none lg:hidden">
          <motion.div
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <video
              src="/assets/Images/hero-section-video.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
          </motion.div>
        </div>

        {/* Desktop Left Side Placeholder to maintain 50/50 flex layout underneath */}
        <div className="hidden lg:block w-1/2 relative z-0 flex-none bg-bg-primary" />

        {/* Desktop Animated Right Image */}
        <motion.div
          className="hidden lg:block absolute right-0 top-0 h-full z-0 flex-none overflow-hidden"
          style={{ width: rightContainerWidth }}
        >
          {/* Image entry animation — isolated so its opacity animate doesn't affect slogan */}
          <motion.div
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0 w-full h-full"
          >
            <video
              src="/assets/Images/hero-section-video.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-black/40" />
          </motion.div>

          {/* Slogan — Starts offset to avoid clipping, then slides naturally into exact center! */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
          >
            <motion.h2
              style={{ color: largeTextColor, x: sloganX }}
              className="font-serif text-[6rem] xl:text-[8rem] 2xl:text-[10rem] whitespace-nowrap"
            >
              Your look, effortlessly elegant
            </motion.h2>
          </motion.div>
        </motion.div>

        {/* Desktop Bottom Info Overlay */}
        <div className="hidden lg:grid grid-cols-2 absolute bottom-12 left-0 w-full z-20 pointer-events-none items-start">
          {/* Left Side Content (Permanently visible) */}
          <div className="px-12 xl:px-20 pointer-events-auto h-fit">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: "easeOut", delay: 1.2 }}
            >
              <p className="text-sm text-text-secondary mb-2">Based in:</p>
              <div className="text-text-primary font-medium">
                <p>Downtown</p>
                <p>Marina District</p>
                <p>Uptown</p>
              </div>
            </motion.div>
          </div>

          {/* Right Side Content (Fades out with scroll) */}
          <div className="px-12 xl:px-20 pointer-events-auto h-fit">
            {/* Plain div for entry fade — no framer-motion context to conflict with scroll MotionValue */}
            <div
              className="max-w-md"
              style={{
                opacity: isLoaded ? 1 : 0,
                transition: 'opacity 0.8s ease 0.8s',
              }}
            >
              <motion.div style={{ opacity: initialTextOpacity, y: initialTextY }}>
                <p className="font-serif text-lg lg:text-xl xl:text-2xl text-white/90 italic leading-snug max-w-md">
                  Experience the pinnacle of beauty and wellness at Dubai's most exclusive spa and salon destination.
                </p>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Desktop Main Title with Mix Blend Difference */}
        <div className="hidden lg:flex absolute inset-0 z-10 pointer-events-none flex-col items-center justify-center pb-32 px-6 xl:px-12">
          {/* Ra logo — sits above the title, fades with scroll like the h1 */}
          <motion.img
            src="/assets/Logo/mastercutlogo.png"
            alt="Ra by Mastercuts"
            style={{ opacity: initialTextOpacity, y: initialTextY }}
            className="w-28 h-28 object-contain mb-6"
          />

          {/* Outer: entry clip-path animation only */}
          <motion.div
            initial={{ clipPath: 'inset(100% 0 0 0)' }}
            animate={isLoaded ? { clipPath: 'inset(0% 0 0 0)' } : {}}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
          >
            {/* Inner: scroll-based fade with explicit color to workaround Safari Webkit mix-blend bugs */}
            <motion.div
              style={{ opacity: initialTextOpacity, y: initialTextY, color: initialTextColor }}
              className="relative text-center mix-blend-difference"
            >
              <h1 className="font-serif text-[4.5rem] xl:text-[5.5rem] 2xl:text-[6.5rem] leading-[1.05] tracking-tight pb-2 pr-[0.15em]">
                Your Sanctuary of
                <br />
                <span className="italic">beauty &amp; inner power</span>
              </h1>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          style={{ opacity: initialTextOpacity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 hidden lg:block mix-blend-difference text-white"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2"
            >
              <motion.div className="w-1 h-2 bg-white/70 rounded-full" />
            </motion.div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
