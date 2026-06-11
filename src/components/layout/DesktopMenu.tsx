import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone } from 'lucide-react';
import { BrandLockup } from './BrandLockup';

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
  const isHome = location.pathname === '/';

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

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
          className="fixed inset-0 z-[60] bg-ra-ivory text-text-primary overflow-y-auto hidden lg:block"
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
                <BrandLockup
                  tone="dark"
                  className="transition-transform duration-300 group-hover:scale-105"
                />
              </button>

              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-text-primary hover:bg-black/10 transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>

            {/* Centered nav — single column, generous whitespace */}
            <div className="flex-1 flex flex-col items-center justify-center px-12 pb-16">
              <div className="mx-auto max-w-md w-full flex flex-col items-center text-center">
                <motion.p
                  variants={itemVariants}
                  className="text-[10px] uppercase tracking-[0.22em] text-text-secondary mb-10"
                >
                  Navigate
                </motion.p>

                <nav className="flex flex-col items-center gap-6">
                  <motion.button
                    variants={itemVariants}
                    type="button"
                    onClick={() => handleNavClick('/')}
                    className="font-serif text-4xl xl:text-5xl text-text-primary hover:opacity-60 transition-opacity"
                  >
                    Home
                  </motion.button>
                  <motion.button
                    variants={itemVariants}
                    type="button"
                    onClick={() => goToSection('about')}
                    className="font-serif text-4xl xl:text-5xl text-text-primary hover:opacity-60 transition-opacity"
                  >
                    About Us
                  </motion.button>
                  <motion.button
                    variants={itemVariants}
                    type="button"
                    onClick={() => goToSection('dr-sara')}
                    className="font-serif text-4xl xl:text-5xl text-text-primary hover:opacity-60 transition-opacity"
                  >
                    Dr Sara
                  </motion.button>
                  <motion.button
                    variants={itemVariants}
                    type="button"
                    onClick={() => goToSection('team')}
                    className="font-serif text-4xl xl:text-5xl text-text-primary hover:opacity-60 transition-opacity"
                  >
                    Our Therapists
                  </motion.button>
                  <motion.button
                    variants={itemVariants}
                    type="button"
                    onClick={() => goToSection('contact')}
                    className="font-serif text-4xl xl:text-5xl text-text-primary hover:opacity-60 transition-opacity"
                  >
                    Contact
                  </motion.button>
                </nav>

                <motion.div variants={itemVariants} className="mt-14">
                  <a
                    href="tel:+971564667165"
                    className="inline-flex items-center gap-3 text-text-secondary hover:text-text-primary transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    <span className="text-sm font-medium">+971 56 466 7165</span>
                    <span className="text-xs text-text-muted">Dubai</span>
                  </a>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
