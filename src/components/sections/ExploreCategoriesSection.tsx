import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useCart } from '@/components/cart/CartProvider';
import { useAudience } from '@/components/services/useAudience';

const IMG_AT_HOME = '/assets/Images/Ra at home.jpeg';
const IMG_GENTS = '/assets/Images/Ra for gents.jpg';
const IMG_LADIES = '/assets/Images/Ra for ladies.jpg';
const IMG_WELLNESS = '/assets/Images/two-hairstylers-posing-standing-modern-spacy-beaty-salon.jpg';
const RA_EMBLEM = '/assets/Logo/ra-emblem.png';

interface CategoryCardProps {
  eyebrow?: string;
  titleStart: string;
  titleItalic: string;
  description?: string;
  image: string;
  /** Tailwind aspect class (e.g. "aspect-[5/6]") */
  aspectClass?: string;
  /** Show the Ra emblem badge in the top-right (for Ra sub-experiences only). */
  raBadge?: boolean;
  onClick: () => void;
}

function CategoryCard({
  eyebrow,
  titleStart,
  titleItalic,
  description,
  image,
  aspectClass = 'aspect-[5/6]',
  raBadge = false,
  onClick,
}: CategoryCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.985 }}
      className={`group relative w-full overflow-hidden rounded-2xl text-left bg-bg-dark border border-white/5 hover:border-accent-gold/40 transition-colors ${aspectClass}`}
    >
      <img
        src={image}
        alt=""
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105 opacity-85"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-4 lg:p-5">
        {raBadge && (
          <img
            src={RA_EMBLEM}
            alt="Ra"
            className="w-14 h-14 lg:w-16 lg:h-16 object-contain mb-3 drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
          />
        )}
        {eyebrow && (
          <p className="text-[10px] uppercase tracking-[0.22em] text-accent-gold mb-1.5">
            {eyebrow}
          </p>
        )}
        <div className="flex items-end justify-between gap-3">
          <h3 className="font-serif text-white leading-[1.05] text-lg lg:text-2xl">
            {titleStart} <span className="italic">{titleItalic}</span>
          </h3>
          <span className="shrink-0 w-8 h-8 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white group-hover:bg-accent-gold group-hover:text-bg-dark transition-colors">
            <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>
        {description && (
          <p className="mt-2 text-xs sm:text-sm text-white/70 leading-relaxed max-w-md">
            {description}
          </p>
        )}
      </div>
    </motion.button>
  );
}

export function ExploreCategoriesSection() {
  const navigate = useNavigate();
  const [, setAudience] = useAudience();
  const { openAudiencePicker, openWellnessHub } = useCart();

  const handleSalon = (audience: 'gentlemen' | 'ladies') => {
    setAudience(audience);
    navigate('/explore');
  };

  return (
    <section id="services" className="bg-bg-primary py-8 lg:py-40">
      <div className="px-6 lg:px-16 max-w-6xl mx-auto">
        {/* Section heading */}
        <div className="mb-6 lg:mb-8 max-w-2xl">
          <p className="text-[10px] uppercase tracking-[0.22em] text-text-secondary mb-2">
            Three paths
          </p>
          <h2 className="font-serif text-2xl lg:text-4xl text-text-primary leading-[1.05]">
            Choose your <span className="italic">experience</span>.
          </h2>
        </div>

        {/* Mobile stacks vertically; desktop renders all 4 cards equal-width
            in a single horizontal row. */}
        <div className="grid grid-cols-12 gap-3 lg:gap-4">
          {/* Mobile-only: Home services eyebrow */}
          <p className="col-span-12 lg:hidden text-[10px] uppercase tracking-[0.22em] text-text-secondary mb-1">
            Home services
          </p>

          {/* Ra at Home — full width on mobile, equal column on desktop */}
          <div className="col-span-12 lg:col-span-3">
            <CategoryCard
              eyebrow="Massage · More coming soon"
              titleStart="Ra at"
              titleItalic="Home"
              image={IMG_AT_HOME}
              aspectClass="aspect-[2/1] lg:aspect-[5/6]"
              raBadge
              onClick={() => openAudiencePicker('/at-home')}
            />
          </div>

          {/* Mobile-only: Salon services eyebrow */}
          <p className="col-span-12 lg:hidden text-[10px] uppercase tracking-[0.22em] text-text-secondary mt-2 mb-1">
            Salon services
          </p>

          {/* Mastercuts For Gents */}
          <div className="col-span-6 lg:col-span-3">
            <CategoryCard
              titleStart="Mastercuts For"
              titleItalic="Gents"
              image={IMG_GENTS}
              aspectClass="aspect-[5/6]"
              onClick={() => handleSalon('gentlemen')}
            />
          </div>

          {/* Mastercuts For Ladies */}
          <div className="col-span-6 lg:col-span-3">
            <CategoryCard
              titleStart="Mastercuts For"
              titleItalic="Ladies"
              image={IMG_LADIES}
              aspectClass="aspect-[5/6]"
              onClick={() => handleSalon('ladies')}
            />
          </div>

          {/* Mobile-only: For members only eyebrow */}
          <p className="col-span-12 lg:hidden text-[10px] uppercase tracking-[0.22em] text-text-secondary mt-2 mb-1">
            For members only
          </p>

          {/* Wellness Hub */}
          <div className="col-span-12 lg:col-span-3">
            <CategoryCard
              eyebrow="By invitation"
              titleStart="Ra Wellness"
              titleItalic="Hub"
              image={IMG_WELLNESS}
              aspectClass="aspect-[2/1] lg:aspect-[5/6]"
              raBadge
              onClick={openWellnessHub}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
