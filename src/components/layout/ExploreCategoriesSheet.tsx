import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, X } from 'lucide-react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useCart } from '@/components/cart/CartProvider';
import { useAudience } from '@/components/services/useAudience';
import { useIsMobile } from '@/hooks/use-mobile';

const RA_EMBLEM = '/assets/Logo/ra-emblem.png';

interface CardProps {
  variant?: 'compact' | 'full';
  eyebrow?: string;
  titleStart: string;
  titleItalic: string;
  image: string;
  raBadge?: boolean;
  onClick: () => void;
}

function MiniCard({
  variant = 'full',
  eyebrow,
  titleStart,
  titleItalic,
  image,
  raBadge = false,
  onClick,
}: CardProps) {
  const compact = variant === 'compact';
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.985 }}
      className={`group relative w-full overflow-hidden rounded-xl text-left bg-bg-dark border border-white/5 hover:border-accent-gold/40 transition-colors ${
        compact ? 'aspect-square' : 'aspect-[5/2]'
      }`}
    >
      <img
        src={image}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-80 transition-transform duration-[1400ms] ease-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-3">
        {raBadge && (
          <img
            src={RA_EMBLEM}
            alt="Ra"
            className={`object-contain mb-2 drop-shadow-[0_3px_8px_rgba(0,0,0,0.4)] ${compact ? 'w-9 h-9' : 'w-12 h-12'}`}
          />
        )}
        {eyebrow && (
          <p className="text-[9px] uppercase tracking-[0.22em] text-accent-gold mb-1">
            {eyebrow}
          </p>
        )}
        <div className="flex items-end justify-between gap-2">
          <h3
            className={`font-serif text-white leading-[1.05] ${
              compact ? 'text-sm' : 'text-xl'
            }`}
          >
            {titleStart} <span className="italic">{titleItalic}</span>
          </h3>
          <span className="shrink-0 w-7 h-7 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white group-hover:bg-accent-gold group-hover:text-bg-dark transition-colors">
            <ArrowUpRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </motion.button>
  );
}

function Body({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const [, setAudience] = useAudience();
  const { openAudiencePicker, openWellnessHub } = useCart();

  const handleSalon = (audience: 'gentlemen' | 'ladies') => {
    setAudience(audience);
    onClose();
    setTimeout(() => navigate('/explore'), 220);
  };

  const handleAtHome = () => {
    onClose();
    setTimeout(() => openAudiencePicker('/at-home'), 220);
  };

  const handleHub = () => {
    onClose();
    setTimeout(openWellnessHub, 220);
  };

  return (
    <div className="px-6 pt-7 pb-7 max-h-[92vh] overflow-y-auto">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/10 backdrop-blur text-white flex items-center justify-center hover:bg-white/20 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>

      <p className="text-[10px] uppercase tracking-[0.22em] text-accent-gold mb-2">
        Explore services
      </p>
      <DialogTitle asChild>
        <h2 className="font-serif text-2xl lg:text-3xl text-white leading-[1.05] mb-6">
          Where would you like to <span className="italic">begin</span>?
        </h2>
      </DialogTitle>

      {/* Salon */}
      <div className="mb-4">
        <p className="text-[10px] uppercase tracking-[0.22em] text-white/50 mb-2">
          Salon services
        </p>
        <div className="grid grid-cols-2 gap-2">
          <MiniCard
            variant="compact"
            titleStart="Mastercuts For"
            titleItalic="Gents"
            image="/assets/Images/Ra for gents.jpg"
            onClick={() => handleSalon('gentlemen')}
          />
          <MiniCard
            variant="compact"
            titleStart="Mastercuts For"
            titleItalic="Ladies"
            image="/assets/Images/Ra for ladies.jpg"
            onClick={() => handleSalon('ladies')}
          />
        </div>
      </div>

      {/* Home */}
      <div className="mb-4">
        <p className="text-[10px] uppercase tracking-[0.22em] text-white/50 mb-2">
          Home services
        </p>
        <MiniCard
          eyebrow="Nails · Massage · Threading"
          titleStart="Ra at"
          titleItalic="Home"
          image="/assets/Images/Ra at home.jpeg"
          raBadge
          onClick={handleAtHome}
        />
      </div>

      {/* Wellness */}
      <div>
        <p className="text-[10px] uppercase tracking-[0.22em] text-white/50 mb-2">
          For members only
        </p>
        <MiniCard
          eyebrow="By invitation"
          titleStart="Ra Wellness"
          titleItalic="Hub"
          image="/assets/Images/two-hairstylers-posing-standing-modern-spacy-beaty-salon.jpg"
          raBadge
          onClick={handleHub}
        />
      </div>
    </div>
  );
}

export function ExploreCategoriesSheet() {
  const { surface, closeAll } = useCart();
  const isMobile = useIsMobile();
  const open = surface === 'explore-picker';

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={(v) => (v ? null : closeAll())}>
        <SheetContent
          side="bottom"
          hideDefaultClose
          className="bg-bg-dark border-none p-0 w-full max-w-full rounded-t-3xl h-auto max-h-[92vh]"
        >
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-white/25 z-10" />
          <Body onClose={closeAll} />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? null : closeAll())}>
      <DialogContent
        showCloseButton={false}
        className="bg-bg-dark border-none p-0 sm:max-w-lg w-[calc(100%-2rem)] overflow-hidden rounded-2xl shadow-2xl"
      >
        <Body onClose={closeAll} />
      </DialogContent>
    </Dialog>
  );
}
