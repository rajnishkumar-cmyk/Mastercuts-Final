import { motion } from 'framer-motion';

export function DrSaraMessageSection() {
  return (
    <section
      id="dr-sara"
      className="bg-bg-dark text-white py-20 lg:py-28"
    >
      <div className="px-6 lg:px-16 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Image — full on mobile, left col on desktop */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="lg:col-span-5"
          >
            <div className="aspect-[4/5] w-full overflow-hidden rounded-2xl bg-circle-light">
              <img
                src="/assets/Images/about-dr-sara.png"
                alt="Dr Sara"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
            className="lg:col-span-7"
          >
            <p className="text-[10px] uppercase tracking-[0.22em] text-accent-gold mb-4">
              A note from our founder
            </p>
            <h2 className="font-serif text-4xl lg:text-6xl text-white leading-[1.02] mb-8">
              Dr <span className="italic">Sara</span>
            </h2>

            <div className="h-px w-12 bg-accent-gold mb-8" />

            <p className="font-serif text-xl lg:text-2xl text-white leading-[1.45] mb-6">
              Welcome to Mastercuts. Every detail of this space — the services, the
              techniques, the products we bring into your visit — has been
              chosen with intention.
            </p>

            <p className="text-sm lg:text-base text-white/70 leading-relaxed mb-6 max-w-prose">
              My promise is simple: you will leave feeling more like yourself
              than when you arrived. We are in the middle of an exciting
              transformation as we relocate, and I am personally overseeing
              every choice so the next chapter is worthy of the trust you've
              placed in us.
            </p>

            <p className="font-serif italic text-base text-white/90">
              — Dr Sara, Founder
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
