import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section id="hero" className="relative w-full h-auto lg:h-screen bg-bg-primary overflow-hidden">
      <div className="w-full lg:h-full flex flex-col lg:flex-row">

        {/* Mobile Layout — copy + title above the video */}
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
            src="/assets/Logo/mastercut-mark.png"
            alt="Mastercuts"
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
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.9 }}
            className="font-serif text-base text-text-primary/80 italic mt-6 max-w-[300px] leading-snug text-center"
          >
            Experience the pinnacle of beauty and wellness at Dubai's most exclusive spa and salon destination.
          </motion.p>
        </div>

        {/* Mobile Bottom Video */}
        <div className="w-full h-[50vh] relative z-0 flex-none lg:hidden">
          <motion.div
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
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

        {/* Desktop Left Half — light beige bg */}
        <div className="hidden lg:block w-1/2 relative z-0 flex-none bg-bg-primary" />

        {/* Desktop Right Half — fixed 50% width video */}
        <div className="hidden lg:block absolute right-0 top-0 h-full w-1/2 z-0 flex-none overflow-hidden">
          <motion.div
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
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
        </div>

        {/* Desktop Bottom Info Overlay — Based-in + tagline */}
        <div className="hidden lg:grid grid-cols-2 absolute bottom-12 left-0 w-full z-20 pointer-events-none items-start">
          <div className="px-12 xl:px-20 pointer-events-auto h-fit">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 1.2 }}
            >
              <p className="text-sm text-text-secondary mb-2">Based in:</p>
              <div className="text-text-primary font-medium">
                <p>Downtown</p>
                <p>Marina District</p>
                <p>Uptown</p>
              </div>
            </motion.div>
          </div>

          <div className="px-12 xl:px-20 pointer-events-auto h-fit">
            <motion.div
              initial={{ opacity: 0 }}
              animate={isLoaded ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.8 }}
              className="max-w-md"
            >
              <p className="font-serif text-lg lg:text-xl xl:text-2xl text-white/90 italic leading-snug max-w-md">
                Experience the pinnacle of beauty and wellness at Dubai's most exclusive spa and salon destination.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Desktop Main Title (centered, mix-blend-difference) */}
        <div className="hidden lg:flex absolute inset-0 z-10 pointer-events-none flex-col items-center justify-center pb-32 px-6 xl:px-12">
          <motion.img
            src="/assets/Logo/mastercut-mark.png"
            alt="Mastercuts"
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
            className="w-28 h-28 object-contain mb-6"
          />

          <motion.div
            initial={{ clipPath: 'inset(100% 0 0 0)' }}
            animate={isLoaded ? { clipPath: 'inset(0% 0 0 0)' } : {}}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
          >
            <div className="relative text-center mix-blend-difference text-white">
              <h1 className="font-serif text-[4.5rem] xl:text-[5.5rem] 2xl:text-[6.5rem] leading-[1.05] tracking-tight pb-2 pr-[0.15em]">
                Your Sanctuary of
                <br />
                <span className="italic">beauty &amp; inner power</span>
              </h1>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator — entry animation only, no scroll-driven fade */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isLoaded ? { opacity: 1 } : {}}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 hidden lg:block mix-blend-difference text-white"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2"
          >
            <motion.div className="w-1 h-2 bg-white/70 rounded-full" />
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
