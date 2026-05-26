import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const RA_EMBLEM = '/assets/Logo/ra-emblem.png';

export interface CategoryCardProps {
  eyebrow?: string;
  titleStart: string;
  titleItalic: string;
  description?: string;
  image: string;
  /** Tailwind aspect class (e.g. "aspect-[5/6]") */
  aspectClass?: string;
  /** Show the Ra emblem badge in the top-right (for Ra sub-experiences only). */
  raBadge?: boolean;
  /** Overlay gradient style. 'soft' (default) suits Ra cards where copy is light;
   *  'heavy' darkens the lower half for salon cards with 2-line titles. */
  gradient?: 'soft' | 'heavy';
  /** Vertical alignment of the title row. 'center' for single-line titles
   *  (Ra at Home, Wellness Hub); 'end' for 2-line wraps (Gents, Ladies). */
  titleAlign?: 'center' | 'end';
  /** Tailwind object-position class fragment, e.g. "object-[50%_71%] lg:object-[53%_67%]"
   *  for cards that need a non-center crop focus. */
  imageObjectPosition?: string;
  onClick: () => void;
}

export function CategoryCard({
  eyebrow,
  titleStart,
  titleItalic,
  description,
  image,
  aspectClass = 'aspect-[5/6]',
  raBadge = false,
  gradient = 'soft',
  titleAlign = 'end',
  imageObjectPosition,
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
        className={cn(
          'absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105 opacity-85',
          imageObjectPosition,
        )}
      />
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-t to-transparent',
          gradient === 'heavy'
            ? 'from-black/90 via-black/50'
            : 'from-black/90 via-black/25',
        )}
      />

      <div className="absolute inset-x-0 bottom-0 p-4 lg:p-5">
        {raBadge && (
          <div className="mb-3 inline-flex items-center justify-center rounded-full bg-white/10 p-2 h-[85px] lg:h-[90px] aspect-[64/85] lg:aspect-[68/90] drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
            <img
              src={RA_EMBLEM}
              alt="Ra"
              className="h-full w-auto object-contain"
            />
          </div>
        )}
        {eyebrow && (
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-accent-gold mb-1.5">
            {eyebrow}
          </p>
        )}
        <div
          className={cn(
            'flex justify-between gap-3',
            titleAlign === 'center' ? 'items-center' : 'items-end',
          )}
        >
          <h3 className="font-serif text-white text-2xl leading-none">
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
