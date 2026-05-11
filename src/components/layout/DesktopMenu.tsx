import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, X, Phone } from 'lucide-react';
import { useCart } from '@/components/cart/CartProvider';
import { useAudience } from '@/components/services/useAudience';

interface DesktopMenuProps {
  open: boolean;
  onClose: () => void;
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const contentVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

const IMG_AT_HOME = '/assets/Images/Ra at home.jpeg';
const IMG_GENTS = '/assets/Images/Ra for gents.jpg';
const IMG_LADIES = '/assets/Images/Ra for ladies.jpg';
const IMG_WELLNESS = '/assets/Images/two-hairstylers-posing-standing-modern-spacy-beaty-salon.jpg';
const RA_EMBLEM = '/assets/Logo/ra-emblem.png';

export function DesktopMenu({ open, onClose }: DesktopMenuProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { openAudiencePicker, openWellnessHub } = useCart();
  const [, setAudience] = useAudience();
  const isHome = location.pathname === '/';

  const handleAtHome = () => {
    onClose();
    setTimeout(() => openAudiencePicker('/at-home'), 300);
  };

  const handleSalon = (audience: 'gentlemen' | 'ladies') => {
    setAudience(audience);
    onClose();
    setTimeout(() => navigate('/explore'), 300);
  };

  const handleWellness = () => {
    onClose();
    setTimeout(openWellnessHub, 300);
  };

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const goToSection = (sectionId: string) => {
    onClose();
    if (isHome) {
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    } else {
      navigate(`/#${sectionId}`);
    }
  };

  const handleNavClick = (path: string) => {
    onClose();
    navigate(path);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="desktop-menu"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="fixed inset-0 z-[60] bg-bg-dark overflow-y-auto hidden lg:block"
        >
          <motion.div
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            className="min-h-screen flex flex-col"
          >
            {/* Top bar */}
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-between px-12 py-6"
            >
              <button
                onClick={() => handleNavClick('/')}
                className="flex items-center group"
              >
                <img
                  src="/assets/Logo/mastercut-wordmark.png"
                  alt="Mastercuts"
                  className="h-9 transition-transform duration-300 group-hover:scale-105 object-contain brightness-0 invert"
                />
              </button>

              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>

            {/* Main content */}
            <div className="flex-1 grid grid-cols-12 gap-8 xl:gap-12 px-12 pt-8 pb-16">
              {/* Left column — Navigation */}
              <div className="col-span-4 flex flex-col justify-between">
                <div>
                  <motion.p
                    variants={itemVariants}
                    className="text-[10px] uppercase tracking-[0.22em] text-white/40 mb-8"
                  >
                    Navigate
                  </motion.p>

                  <nav className="flex flex-col gap-6">
                    <motion.button
                      variants={itemVariants}
                      type="button"
                      onClick={() => handleNavClick('/')}
                      className="text-left font-serif text-4xl xl:text-5xl text-white hover:opacity-60 transition-opacity"
                    >
                      Home
                    </motion.button>
                    <motion.button
                      variants={itemVariants}
                      type="button"
                      onClick={() => goToSection('about')}
                      className="text-left font-serif text-4xl xl:text-5xl text-white hover:opacity-60 transition-opacity"
                    >
                      About Us
                    </motion.button>
                    <motion.button
                      variants={itemVariants}
                      type="button"
                      onClick={() => goToSection('dr-sara')}
                      className="text-left font-serif text-4xl xl:text-5xl text-white hover:opacity-60 transition-opacity"
                    >
                      Dr Sara
                    </motion.button>
                    <motion.button
                      variants={itemVariants}
                      type="button"
                      onClick={() => goToSection('team')}
                      className="text-left font-serif text-4xl xl:text-5xl text-white hover:opacity-60 transition-opacity"
                    >
                      Our Stylists
                    </motion.button>
                    <motion.button
                      variants={itemVariants}
                      type="button"
                      onClick={() => goToSection('contact')}
                      className="text-left font-serif text-4xl xl:text-5xl text-white hover:opacity-60 transition-opacity"
                    >
                      Contact
                    </motion.button>
                  </nav>
                </div>

                <motion.div variants={itemVariants} className="space-y-6 mt-12">
                  <a
                    href="tel:+97145550100"
                    className="flex items-center gap-3 text-white/70 hover:text-white transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    <span className="text-sm font-medium">+971 4 555 0100</span>
                    <span className="text-xs text-white/40">Dubai</span>
                  </a>
                </motion.div>
              </div>

              {/* Right column — 4 Explore category cards */}
              <div className="col-span-8">
                <motion.p
                  variants={itemVariants}
                  className="text-[10px] uppercase tracking-[0.22em] text-white/40 mb-8"
                >
                  Explore services
                </motion.p>

                {/* 2x2 grid — all 4 cards same size, equal weight */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Ra at Home */}
                  <motion.button
                    type="button"
                    variants={itemVariants}
                    onClick={handleAtHome}
                    className="group relative aspect-[4/3] rounded-2xl overflow-hidden text-left border border-white/5 hover:border-accent-gold/40 transition-colors"
                  >
                    <img
                      src={IMG_AT_HOME}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover opacity-85 transition-transform duration-[1400ms] ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      {/* Ra emblem badge (on top of content) */}
                      <img
                        src={RA_EMBLEM}
                        alt="Ra"
                        className="w-14 h-14 object-contain mb-2 drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
                      />
                      <p className="text-[10px] uppercase tracking-[0.22em] text-accent-gold mb-1">
                        Nails · Massage · Threading
                      </p>
                      <div className="flex items-end justify-between gap-3">
                        <h3 className="font-serif text-xl text-white leading-[1.05] whitespace-nowrap">
                          Ra at <span className="italic">Home</span>
                        </h3>
                        <span className="shrink-0 w-8 h-8 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white group-hover:bg-accent-gold group-hover:text-bg-dark transition-colors">
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </motion.button>

                  {/* Wellness Hub */}
                  <motion.button
                    type="button"
                    variants={itemVariants}
                    onClick={handleWellness}
                    className="group relative aspect-[4/3] rounded-2xl overflow-hidden text-left border border-white/5 hover:border-accent-gold/40 transition-colors"
                  >
                    <img
                      src={IMG_WELLNESS}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover opacity-85 transition-transform duration-[1400ms] ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      {/* Ra emblem badge (on top of content) */}
                      <img
                        src={RA_EMBLEM}
                        alt="Ra"
                        className="w-14 h-14 object-contain mb-2 drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
                      />
                      <p className="text-[10px] uppercase tracking-[0.22em] text-accent-gold mb-1">
                        By invitation
                      </p>
                      <div className="flex items-end justify-between gap-3">
                        <h3 className="font-serif text-xl text-white leading-[1.05] whitespace-nowrap">
                          Ra Wellness <span className="italic">Centre</span>
                        </h3>
                        <span className="shrink-0 w-8 h-8 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white group-hover:bg-accent-gold group-hover:text-bg-dark transition-colors">
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </motion.button>

                  {/* Gents */}
                  <motion.button
                    type="button"
                    variants={itemVariants}
                    onClick={() => handleSalon('gentlemen')}
                    className="group relative aspect-[4/3] rounded-2xl overflow-hidden text-left border border-white/5 hover:border-accent-gold/40 transition-colors"
                  >
                    <img
                      src={IMG_GENTS}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover opacity-85 transition-transform duration-[1400ms] ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <div className="flex items-end justify-between gap-3">
                        <h3 className="font-serif text-xl text-white leading-[1.05]">
                          Mastercuts For <span className="italic">Gents</span>
                        </h3>
                        <span className="shrink-0 w-8 h-8 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white group-hover:bg-accent-gold group-hover:text-bg-dark transition-colors">
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </motion.button>

                  {/* Ladies */}
                  <motion.button
                    type="button"
                    variants={itemVariants}
                    onClick={() => handleSalon('ladies')}
                    className="group relative aspect-[4/3] rounded-2xl overflow-hidden text-left border border-white/5 hover:border-accent-gold/40 transition-colors"
                  >
                    <img
                      src={IMG_LADIES}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover opacity-85 transition-transform duration-[1400ms] ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <div className="flex items-end justify-between gap-3">
                        <h3 className="font-serif text-xl text-white leading-[1.05]">
                          Mastercuts For <span className="italic">Ladies</span>
                        </h3>
                        <span className="shrink-0 w-8 h-8 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white group-hover:bg-accent-gold group-hover:text-bg-dark transition-colors">
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
