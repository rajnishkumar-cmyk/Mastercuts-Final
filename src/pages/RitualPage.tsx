import { useEffect, useMemo, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowLeft, ArrowUpRight, Plus, ChevronRight } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { RitualServiceRow } from '@/components/sections/RitualServiceRow';
import { useCart, formatDuration } from '@/components/cart/CartProvider';
import {
  getRitual,
  getServicesForRitual,
  getTherapistsForRitual,
  getPackagesForRitual,
  rituals,
} from '@/lib/booking/catalog';
import { Footer } from '@/components/layout/Footer';

function RitualNotFound() {
  return (
    <div className="min-h-screen bg-bg-dark text-white flex flex-col items-center justify-center px-6 text-center">
      <p className="text-[11px] uppercase tracking-[0.22em] text-white/50 mb-4">404</p>
      <h1 className="font-serif text-5xl mb-6">
        This <span className="italic">ritual</span> does not exist
      </h1>
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Return home
      </Link>
    </div>
  );
}

export function RitualPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { openCart } = useCart();

  const ritual = useMemo(() => (id ? getRitual(id) : undefined), [id]);
  const services = useMemo(() => (id ? getServicesForRitual(id) : []), [id]);
  const therapists = useMemo(() => (id ? getTherapistsForRitual(id) : []), [id]);
  const ritualPackages = useMemo(() => (id ? getPackagesForRitual(id) : []), [id]);
  const otherRituals = useMemo(
    () => rituals.filter((r) => r.id !== id),
    [id]
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [id]);

  const storyRef = useRef<HTMLDivElement>(null);
  const storyInView = useInView(storyRef, { once: true, margin: '-100px' });

  const servicesRef = useRef<HTMLDivElement>(null);
  const servicesInView = useInView(servicesRef, { once: true, margin: '-100px' });

  if (!ritual) return <RitualNotFound />;

  const totalDuration = services.reduce((sum, s) => sum + s.durationMin, 0);

  return (
    <div className="bg-bg-dark text-white">
      {/* ───────── Hero ───────── */}
      <section className="relative h-[92vh] min-h-[640px] w-full overflow-hidden">
        <motion.div
          initial={{ scale: 1.12 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <img
            src={ritual.image}
            alt={`${ritual.title} ${ritual.titleItalic}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-bg-dark/40 via-bg-dark/10 to-bg-dark" />
        </motion.div>

        {/* Back link */}
        <div className="absolute top-6 left-6 lg:top-10 lg:left-12 z-10">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
            Back
          </button>
        </div>

        {/* Hero content */}
        <div className="absolute inset-x-0 bottom-0 px-6 lg:px-16 pb-14 lg:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 }}
            className="max-w-4xl"
          >
            <p className="text-[11px] uppercase tracking-[0.24em] text-white/60 mb-6">
              {ritual.tagline}
            </p>
            <h1 className="font-serif text-6xl sm:text-7xl lg:text-[9rem] leading-[0.92] mb-6">
              <span className="block text-white/90">{ritual.title}</span>
              <span className="block italic">{ritual.titleItalic}</span>
            </h1>
            <p className="font-serif italic text-xl lg:text-2xl text-white/70 max-w-xl">
              {ritual.philosophy}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ───────── Story ───────── */}
      <section ref={storyRef} className="relative py-24 lg:py-36 px-6 lg:px-16">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={storyInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="lg:col-span-4"
          >
            <p className="text-[11px] uppercase tracking-[0.22em] text-white/50 mb-4">
              The ritual
            </p>
            <h2 className="font-serif text-4xl lg:text-5xl leading-tight">
              A <span className="italic">quiet</span> inheritance.
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={storyInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.15 }}
            className="lg:col-span-8 space-y-6 text-white/75 text-lg lg:text-xl leading-relaxed font-light"
          >
            {ritual.longDescription.split('\n\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ───────── Services ───────── */}
      <section ref={servicesRef} className="relative py-24 lg:py-32 bg-bg-primary text-text-primary border-y border-black/10">
        <div className="px-6 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={servicesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="max-w-5xl mx-auto mb-16 lg:mb-20 flex items-end justify-between flex-wrap gap-6"
          >
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-text-secondary mb-3">
                The menu
              </p>
              <h2 className="font-serif text-4xl lg:text-6xl leading-none text-text-primary">
                Explore the <span className="italic">services</span>
              </h2>
            </div>
            <p className="text-sm text-text-secondary max-w-xs">
              {services.length} {services.length === 1 ? 'service' : 'services'} · approx.{' '}
              {formatDuration(totalDuration)} total
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto space-y-6 lg:space-y-8">
            {services.map((svc, index) => (
              <RitualServiceRow
                key={svc.id}
                service={svc}
                index={index}
                inView={servicesInView}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Specialists ───────── */}
      {therapists.length > 0 && (
        <section className="py-24 lg:py-32 px-6 lg:px-16">
          <div className="max-w-5xl mx-auto">
            <div className="mb-14 lg:mb-20">
              <p className="text-[11px] uppercase tracking-[0.22em] text-white/50 mb-3">
                The hands
              </p>
              <h2 className="font-serif text-4xl lg:text-6xl leading-none">
                Meet your <span className="italic">specialists</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
              {therapists.map((therapist) => (
                <div key={therapist.id} className="group">
                  <div className="aspect-[3/4] overflow-hidden mb-5">
                    <img
                      src={therapist.image}
                      alt={therapist.name}
                      className="w-full h-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-105"
                    />
                  </div>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-white/50 mb-1">
                    {therapist.title}
                  </p>
                  <h3 className="font-serif text-2xl text-white mb-3">{therapist.name}</h3>
                  <p className="text-sm text-white/60 leading-relaxed mb-3">{therapist.bio}</p>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-white/40">
                    {therapist.languages.join(' · ')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ───────── Experiences (packages) ───────── */}
      {ritualPackages.length > 0 && (
        <section className="py-24 lg:py-32 bg-white/[0.02] border-y border-white/5 px-6 lg:px-16">
          <div className="max-w-5xl mx-auto">
            <div className="mb-14 lg:mb-20 flex items-end justify-between flex-wrap gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-white/50 mb-3">
                  In good company
                </p>
                <h2 className="font-serif text-4xl lg:text-6xl leading-none">
                  Part of these <span className="italic">experiences</span>
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {ritualPackages.map((pkg) => (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => openCart()}
                  className="group text-left relative overflow-hidden aspect-[4/5]"
                >
                  <img
                    src={pkg.image}
                    alt={pkg.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.6s] ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-bg-dark/30 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 lg:p-8">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-white/60 mb-2">
                      {pkg.tagline}
                    </p>
                    <h3 className="font-serif text-3xl lg:text-4xl text-white leading-tight mb-2">
                      {pkg.name}
                    </h3>
                    <p className="text-xs text-white/60 mb-4 max-w-sm">{pkg.description}</p>
                    <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.22em] text-white/80 group-hover:text-white transition-colors">
                      Explore
                      <ArrowUpRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ───────── FAQ ───────── */}
      <section className="py-24 lg:py-32 px-6 lg:px-16">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-4">
            <p className="text-[11px] uppercase tracking-[0.22em] text-white/50 mb-3">
              Before you arrive
            </p>
            <h2 className="font-serif text-4xl lg:text-5xl leading-tight">
              Common <span className="italic">questions</span>
            </h2>
          </div>

          <div className="lg:col-span-8">
            <Accordion type="single" collapsible className="w-full">
              {ritual.faqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="border-white/10"
                >
                  <AccordionTrigger className="text-left text-base lg:text-lg font-serif text-white hover:text-white/90 py-5">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm lg:text-base text-white/60 leading-relaxed pb-6">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* ───────── CTA ───────── */}
      <section className="py-20 lg:py-28 px-6 lg:px-16 text-center border-t border-white/5">
        <p className="text-[11px] uppercase tracking-[0.22em] text-white/50 mb-5">
          Ready to begin
        </p>
        <h2 className="font-serif text-4xl lg:text-6xl leading-tight mb-10 max-w-2xl mx-auto">
          Begin your <span className="italic">{ritual.titleItalic.toLowerCase()}</span> ritual
        </h2>
        <Button
          onClick={() => openCart()}
          className="bg-white text-text-primary hover:bg-white/90 rounded-full px-8 py-6 text-sm font-medium inline-flex items-center gap-3 group mx-auto"
        >
          Book this ritual
          <Plus className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" />
        </Button>
      </section>

      {/* ───────── Also explore ───────── */}
      <section className="py-20 lg:py-28 px-6 lg:px-16 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <p className="text-[11px] uppercase tracking-[0.22em] text-white/50 mb-10">
            Also explore
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {otherRituals.map((r) => (
              <Link
                key={r.id}
                to={`/rituals/${r.id}`}
                className="group relative overflow-hidden aspect-[3/4] block"
              >
                <img
                  src={r.image}
                  alt={`${r.title} ${r.titleItalic}`}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.6s] ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/90 via-bg-dark/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-white/60 mb-1">
                    {r.tagline}
                  </p>
                  <h3 className="font-serif text-2xl text-white leading-tight">
                    {r.title} <span className="italic">{r.titleItalic}</span>
                  </h3>
                  <span className="mt-3 inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.2em] text-white/70 group-hover:text-white transition-colors">
                    View ritual
                    <ChevronRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
