import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone } from 'lucide-react';

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

const IMG_WELLNESS = '/assets/Images/two-hairstylers-posing-standing-modern-spacy-beaty-salon.jpg';
const RA_EMBLEM = '/assets/Logo/ra-emblem.png';

export function DesktopMenu({ open, onClose }: DesktopMenuProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

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

              {/* Right column — editorial image (service categories now live in
                  the top nav, so the previous 2×2 cards grid is redundant) */}
              <motion.div
                variants={itemVariants}
                className="col-span-8 relative rounded-2xl overflow-hidden min-h-[500px]"
              >
                <img
                  src={IMG_WELLNESS}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-8">
                  <img
                    src={RA_EMBLEM}
                    alt="Ra"
                    className="w-14 h-14 object-contain mb-4 drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
                  />
                  <p className="text-[10px] uppercase tracking-[0.22em] text-accent-gold mb-3">
                    Imperial Avenue · Downtown Dubai
                  </p>
                  <h3 className="font-serif text-3xl xl:text-4xl text-white leading-[1.05] mb-4 max-w-md">
                    An elevated wellness and beauty <span className="italic">experience</span>.
                  </h3>
                  <p className="text-sm text-white/70 leading-relaxed max-w-md">
                    Our new home is taking shape. In the meantime, signature care
                    comes to you with Ra at Home.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
