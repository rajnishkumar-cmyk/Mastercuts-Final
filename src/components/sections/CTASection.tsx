import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/components/cart/CartProvider';

export function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { openCart } = useCart();

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden" ref={ref}>
      {/* Background Image */}
      <motion.div
        initial={{ opacity: 0, scale: 1.1 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0"
      >
        <video
          src="/assets/Images/cta-section-video.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/80 via-bg-dark/40 to-transparent" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-7xl text-white leading-[0.95] mb-10">
            Bringing
            <br />
            Your <span className="italic">Perfect</span>
            <br />
            Look to Life
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
        >
          <Button
            onClick={() => openCart()}
            className="bg-white text-text-primary hover:bg-white/90 rounded-full px-8 py-6 text-sm font-medium flex items-center gap-3 group mx-auto"
          >
            Book Your Visit
            <Plus className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
