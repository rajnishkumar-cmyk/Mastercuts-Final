import { motion } from 'framer-motion';

const STATS = [
  { value: '4', label: 'Senior stylists' },
  { value: '6', label: 'Junior stylists' },
  { value: '100+', label: 'Years combined experience' },
];

export function StatsTeamSection() {
  return (
    <section id="team" className="bg-bg-primary py-20 lg:py-28 border-t border-black/5">
      <div className="px-6 lg:px-16 max-w-5xl mx-auto">
        <div className="max-w-2xl mb-12 lg:mb-16">
          <p className="text-[10px] uppercase tracking-[0.22em] text-text-secondary mb-3">
            Our team
          </p>
          <h2 className="font-serif text-4xl lg:text-6xl text-text-primary leading-[1.02]">
            Senior and junior stylists, trained in the{' '}
            <span className="italic">Mastercuts method</span>.
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-4 lg:gap-10 mb-12 lg:mb-16">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.55, delay: 0.08 + i * 0.07, ease: 'easeOut' }}
              className="border-t border-black/10 pt-5"
            >
              <p className="font-serif text-5xl lg:text-7xl text-text-primary leading-none mb-2">
                {s.value}
              </p>
              <p className="text-[10px] lg:text-xs uppercase tracking-[0.18em] text-text-secondary leading-snug">
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>

        <p className="text-sm lg:text-base text-text-secondary leading-relaxed max-w-prose">
          Every stylist on the Mastercuts team is trained internally in our method —
          a slow consultation, intentional cutting, and finishing techniques
          you can recreate at home. Our junior stylists shadow senior team
          members for a full year before they take a chair of their own.
        </p>
      </div>
    </section>
  );
}
