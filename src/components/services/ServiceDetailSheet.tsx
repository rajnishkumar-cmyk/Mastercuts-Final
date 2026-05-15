import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Check, ArrowUpRight, HeartHandshake, Hourglass, Leaf } from 'lucide-react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useCart, formatAed, formatDuration } from '@/components/cart/CartProvider';
import {
  getRitual,
  getService,
  getServicesForRitual,
  getTherapistsForRitual,
} from '@/lib/booking/catalog';
import { cn } from '@/lib/utils';

export function ServiceDetailSheet() {
  const {
    surface,
    serviceDetail,
    closeServiceDetail,
    openServiceDetail,
    cart,
    addToCart,
    removeItem,
  } = useCart();
  const open = surface === 'service-detail' && !!serviceDetail;

  const service = useMemo(
    () => (serviceDetail ? getService(serviceDetail.serviceId) : undefined),
    [serviceDetail]
  );
  const ritual = useMemo(
    () => (serviceDetail ? getRitual(serviceDetail.ritualId) : undefined),
    [serviceDetail]
  );
  const therapists = useMemo(
    () => (serviceDetail ? getTherapistsForRitual(serviceDetail.ritualId) : []),
    [serviceDetail]
  );
  const relatedServices = useMemo(() => {
    if (!serviceDetail) return [];
    return getServicesForRitual(serviceDetail.ritualId).filter(
      (s) => s.id !== serviceDetail.serviceId
    );
  }, [serviceDetail]);

  const cartItem = cart.items.find((i) => i.serviceId === serviceDetail?.serviceId);
  const inCart = !!cartItem;

  const variants = service?.variants ?? [];
  const hasVariants = variants.length > 1;
  const defaultVariantId = variants[0]?.id;

  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(
    cartItem?.variantId ?? defaultVariantId
  );

  useEffect(() => {
    setSelectedVariantId(cartItem?.variantId ?? defaultVariantId);
  }, [cartItem?.variantId, defaultVariantId, serviceDetail?.serviceId]);

  if (!service || !ritual || !serviceDetail) return null;

  const selectedVariant =
    variants.find((v) => v.id === selectedVariantId) ?? variants[0] ?? null;
  const displayDuration = selectedVariant?.durationMin ?? service.durationMin;
  const displayPrice = selectedVariant?.price ?? service.price;

  const handlePillClick = (variantId: string) => {
    setSelectedVariantId(variantId);
    if (inCart && variantId !== cartItem?.variantId) {
      addToCart(service.id, 'any', variantId);
    }
  };

  const handleCta = () => {
    if (inCart && cartItem) {
      removeItem(cartItem.id);
      return;
    }
    const added = addToCart(service.id, 'any', selectedVariantId);
    if (added) closeServiceDetail();
  };

  return (
    <Sheet open={open} onOpenChange={(v) => (v ? null : closeServiceDetail())}>
      <SheetContent
        side="bottom"
        hideDefaultClose
        className="bg-bg-dark text-white border-none p-0 flex flex-col max-h-[92vh] rounded-t-3xl overflow-hidden"
      >
        {/* Close button */}
        <button
          type="button"
          onClick={closeServiceDetail}
          aria-label="Close"
          className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur text-white flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Grabber handle */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 w-10 h-1 rounded-full bg-white/30" />

        <div className="overflow-y-auto overflow-x-hidden flex-1">
          {/* ───────── Hero ───────── */}
          <section className="relative h-[52vh] min-h-[360px] w-full overflow-hidden">
            <motion.div
              initial={{ scale: 1.08 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <img
                src={service.image}
                alt={service.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-bg-dark/20 via-bg-dark/10 to-bg-dark" />
            </motion.div>

            {/* Hero content */}
            <div className="absolute inset-x-0 bottom-0 px-6 lg:px-10 pb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
                className="max-w-3xl"
              >
                <p className="text-[10px] uppercase tracking-[0.22em] text-white/60 mb-3">
                  {ritual.tagline} · {ritual.title} {ritual.titleItalic}
                </p>
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-[0.98] mb-4">
                  {service.name}
                </h1>
                <p className="text-sm lg:text-base text-white/70 max-w-xl leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            </div>
          </section>

          {/* ───────── Body grid: booking aside + descriptive content ───────── */}
          <div className="px-6 lg:px-10 pt-8 pb-10 lg:grid lg:grid-cols-12 lg:gap-12">
            {/* Booking aside — DOM-first so mobile shows it above content, visually right-column on lg */}
            <aside className="mb-10 lg:mb-0 lg:col-span-5 lg:col-start-8 lg:row-start-1">
              <div className="lg:sticky lg:top-6">
                <div className="border border-white/15 rounded-2xl p-6 lg:p-7 bg-white/[0.03]">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-white/50 mb-3">
                    Book this service
                  </p>
                  <div className="flex items-baseline gap-4 mb-6">
                    <span className="font-serif text-4xl lg:text-5xl text-white">
                      {formatAed(displayPrice)}
                    </span>
                    <span className="text-sm text-white/60">
                      {formatDuration(displayDuration)}
                    </span>
                  </div>

                  {hasVariants && (
                    <div className="mb-6">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-3">
                        Choose duration
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {variants.map((v) => {
                          const isActive = v.id === selectedVariantId;
                          return (
                            <button
                              key={v.id}
                              type="button"
                              onClick={() => handlePillClick(v.id)}
                              className={cn(
                                'flex flex-col items-center px-4 py-3 rounded-xl border transition-all min-w-[5rem]',
                                isActive
                                  ? 'bg-white text-bg-dark border-white'
                                  : 'bg-transparent text-white/80 border-white/20 hover:border-white/50 hover:text-white'
                              )}
                            >
                              <span className="text-sm font-medium">{v.durationMin} min</span>
                              <span
                                className={cn(
                                  'text-[10px] uppercase tracking-[0.16em] mt-1',
                                  isActive ? 'text-bg-dark/60' : 'text-white/50'
                                )}
                              >
                                {formatAed(v.price)}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={handleCta}
                    className={cn(
                      'group w-full rounded-full py-6 text-sm font-medium flex items-center justify-center gap-2',
                      inCart
                        ? 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                        : 'bg-white text-text-primary hover:bg-white/90'
                    )}
                  >
                    {inCart ? (
                      <>
                        <span className="group-hover:hidden inline-flex items-center gap-2">
                          <Check className="w-4 h-4" /> In your cart
                        </span>
                        <span className="hidden group-hover:inline-flex items-center gap-2">
                          <X className="w-4 h-4" /> Remove from cart
                        </span>
                      </>
                    ) : (
                      <>
                        Add to cart
                        <Plus className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" />
                      </>
                    )}
                  </Button>

                  <p className="mt-4 text-[11px] text-white/40 text-center leading-relaxed">
                    No payment now — settle when your therapist arrives at your home. Free cancellation up to 4 hours before.
                  </p>
                </div>
              </div>
            </aside>

            {/* Descriptive content column */}
            <div className="lg:col-span-7 lg:col-start-1 lg:row-start-1 space-y-12">
              {/* What to expect — highlights */}
              {service.highlights && service.highlights.length > 0 && (
                <section>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-white/50 mb-3">
                    What to expect
                  </p>
                  <ul className="space-y-3">
                    {service.highlights.map((h, i) => (
                      <li
                        key={i}
                        className="flex gap-3 text-base text-white/85 leading-relaxed"
                      >
                        <Check className="w-4 h-4 text-accent-gold flex-shrink-0 mt-[6px]" strokeWidth={2.5} />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Story */}
              <section className={service.highlights?.length ? 'pt-10 border-t border-white/5' : ''}>
                <p className="text-[10px] uppercase tracking-[0.22em] text-white/50 mb-3">
                  The detail
                </p>
                <h2 className="font-serif text-3xl lg:text-4xl leading-tight mb-6">
                  What this <span className="italic">includes</span>
                </h2>
                <div className="space-y-5 text-white/75 text-base leading-relaxed font-light">
                  {(service.detail ?? service.description).split('\n\n').map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>

                {service.requiresConsultation && (
                  <div className="mt-8 border border-white/15 rounded-2xl p-5">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-white/50 mb-2">
                      Consultation required
                    </p>
                    <p className="text-sm text-white/70 leading-relaxed">
                      This service requires a complimentary consultation before booking. We will
                      reach out after you confirm to schedule a fifteen-minute call.
                    </p>
                  </div>
                )}
              </section>

              {/* The Ra Promise — static trust tiles */}
              <section className="pt-10 border-t border-white/5">
                <p className="text-[10px] uppercase tracking-[0.22em] text-white/50 mb-3">
                  The Ra promise
                </p>
                <h2 className="font-serif text-3xl lg:text-4xl leading-tight mb-8">
                  Care that <span className="italic">holds</span>
                </h2>
                <div className="flex flex-col gap-3 lg:gap-4">
                  {[
                    {
                      icon: HeartHandshake,
                      title: 'Trained hands',
                      body: 'Every therapist is senior, certified, and reviewed.',
                    },
                    {
                      icon: Hourglass,
                      title: 'Unhurried time',
                      body: 'Sessions never overlap. The room is yours.',
                    },
                    {
                      icon: Leaf,
                      title: 'Clean formulations',
                      body: 'Products chosen for health as much as results.',
                    },
                  ].map(({ icon: Icon, title, body }) => (
                    <div
                      key={title}
                      className="rounded-xl border border-white/10 bg-white/[0.03] p-5 flex items-start gap-4"
                    >
                      <Icon
                        className="w-5 h-5 text-accent-gold flex-shrink-0 mt-1"
                        strokeWidth={1.5}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-serif text-lg text-white leading-tight mb-1">
                          {title}
                        </p>
                        <p className="text-sm text-white/60 leading-snug">
                          {body}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Specialists */}
              {therapists.length > 0 && (
                <section className="pt-10 border-t border-white/5">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-white/50 mb-3">
                    The hands
                  </p>
                  <h2 className="font-serif text-3xl lg:text-4xl leading-tight mb-8">
                    Performed by your <span className="italic">specialists</span>
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                    {therapists.map((therapist) => (
                      <div key={therapist.id}>
                        <div className="aspect-[3/4] overflow-hidden mb-3">
                          <img
                            src={therapist.image}
                            alt={therapist.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="text-[10px] uppercase tracking-[0.22em] text-white/50 mb-1">
                          {therapist.title}
                        </p>
                        <h3 className="font-serif text-lg text-white">{therapist.name}</h3>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Questions we're often asked — ritual FAQs */}
              {ritual.faqs.length > 0 && (
                <section className="pt-10 border-t border-white/5">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-white/50 mb-3">
                    Questions we're often asked
                  </p>
                  <h2 className="font-serif text-3xl lg:text-4xl leading-tight mb-6">
                    Before you <span className="italic">book</span>
                  </h2>
                  <Accordion type="single" collapsible className="w-full">
                    {ritual.faqs.map((faq, i) => (
                      <AccordionItem
                        key={i}
                        value={`faq-${i}`}
                        className="border-white/10"
                      >
                        <AccordionTrigger className="text-left text-white hover:text-white text-base font-sans font-normal hover:no-underline py-5">
                          {faq.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-white/70 text-sm leading-relaxed pb-5">
                          {faq.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </section>
              )}

              {/* Related services */}
              {relatedServices.length > 0 && (
                <section className="pt-10 border-t border-white/5">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-white/50 mb-3">
                    Also in this category
                  </p>
                  <h2 className="font-serif text-3xl lg:text-4xl leading-tight mb-8">
                    Other <span className="italic">{ritual.titleItalic.toLowerCase()}</span> services
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {relatedServices.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => openServiceDetail(s.id, ritual.id)}
                        className="group text-left"
                      >
                        <div className="aspect-[4/3] overflow-hidden mb-3">
                          <img
                            src={s.image}
                            alt={s.name}
                            className="w-full h-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-105"
                          />
                        </div>
                        <h3 className="font-serif text-xl text-white leading-tight mb-2">
                          {s.name}
                        </h3>
                        <p className="text-[11px] uppercase tracking-[0.18em] text-white/50">
                          {formatDuration(s.durationMin)} · {formatAed(s.price)}
                        </p>
                        <span className="mt-2 inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.2em] text-white/60 group-hover:text-white transition-colors">
                          Read more
                          <ArrowUpRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </span>
                      </button>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
