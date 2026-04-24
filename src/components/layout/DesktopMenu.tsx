import { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/components/cart/CartProvider';
import { rituals } from '@/lib/booking/catalog';

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

export function DesktopMenu({ open, onClose }: DesktopMenuProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { openCart } = useCart();
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
                className="flex items-center gap-3 group"
              >
                <img
                  src="/assets/Logo/mastercutlogo.png"
                  alt="Ra Logo"
                  className="w-10 h-10 transition-transform duration-300 group-hover:scale-105 object-contain"
                />
                <div className="flex flex-col -space-y-0.5">
                  <span className="text-sm font-medium text-white tracking-wide leading-none">
                    Ra
                  </span>
                  <span className="text-sm font-medium text-white/70 tracking-wide leading-none">
                    by Mastercuts
                  </span>
                </div>
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

              {/* Right column — Ritual cards */}
              <div className="col-span-8">
                <motion.p
                  variants={itemVariants}
                  className="text-[10px] uppercase tracking-[0.22em] text-white/40 mb-8"
                >
                  Our Rituals
                </motion.p>

                <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
                  {rituals.map((r) => (
                    <motion.div key={r.id} variants={itemVariants}>
                      <Link
                        to={`/explore#${r.id}`}
                        onClick={onClose}
                        className="group block relative rounded-lg overflow-hidden"
                      >
                        <div className="aspect-[4/3] overflow-hidden">
                          <img
                            src={r.image}
                            alt={`${r.title} ${r.titleItalic}`}
                            className="w-full h-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-105"
                          />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <p className="text-[10px] uppercase tracking-[0.2em] text-accent-gold mb-1">
                            {r.tagline}
                          </p>
                          <p className="font-serif text-lg text-white leading-tight">
                            {r.title} <span className="italic">{r.titleItalic}</span>
                          </p>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                <motion.div variants={itemVariants} className="mt-8">
                  <Button
                    onClick={() => {
                      onClose();
                      setTimeout(() => openCart(), 300);
                    }}
                    className="bg-white text-text-primary hover:bg-white/90 rounded-full px-8 py-3 text-sm font-medium flex items-center gap-2 group"
                  >
                    Book Now
                    <Plus className="w-4 h-4 transition-transform duration-200 group-hover:rotate-90" />
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
