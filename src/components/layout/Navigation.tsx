import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, ChevronDown, Phone, Plus, X, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetClose, SheetTrigger } from '@/components/ui/sheet';
import { useCart } from '@/components/cart/CartProvider';
import { CartIcon } from '@/components/cart/CartIcon';
import { rituals } from '@/lib/booking/catalog';
import { DesktopMenu } from './DesktopMenu';

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopMenuOpen, setDesktopMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [heroInView, setHeroInView] = useState(true);
  const headerRef = useRef<HTMLElement>(null);
  const { openCart, cart, account, openLogin, openProfile } = useCart();
  const cartHasItemsRef = useRef(false);
  cartHasItemsRef.current = cart.items.length > 0;
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 50);
      // Keep nav visible when cart has items so the cart icon stays accessible
      if (cartHasItemsRef.current) {
        setHidden(false);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastScrollY = currentScrollY;
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Expose the nav's effective height as a CSS variable so sticky bars
  // elsewhere can stack below it. When hidden, reset to 0 so sticky bars
  // slide up to the viewport edge.
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const el = headerRef.current;
      const height = el?.offsetHeight ?? 0;
      document.documentElement.style.setProperty(
        '--nav-offset',
        hidden ? '0px' : `${height}px`,
      );
    });
    return () => cancelAnimationFrame(raf);
  }, [hidden, scrolled, heroInView, isHome]);

  useEffect(() => {
    return () => {
      document.documentElement.style.setProperty('--nav-offset', '0px');
    };
  }, []);

  // Track whether the hero section is still in the viewport. Used to gate the
  // desktop announcement strip — it should only appear while the user is on
  // the hero. On non-home pages there is no #hero, so default to false.
  useEffect(() => {
    if (!isHome) {
      setHeroInView(false);
      return;
    }
    const el = document.getElementById('hero');
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setHeroInView(entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isHome]);

  // On ritual pages the hero is dark, so treat nav like scrolled (dark chrome).
  const darkChrome = scrolled || !isHome;

  const initials = account?.name
    ? account.name
        .trim()
        .split(/\s+/)
        .map((p) => p[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : account?.phone
      ? account.phone.slice(-2)
      : '';

  const goToSection = (sectionId: string) => {
    if (isHome) {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      navigate(`/#${sectionId}`);
    }
  };

  return (
  <>
    <motion.header
      ref={headerRef}
      initial={{ y: -100 }}
      animate={{ y: hidden ? '-100%' : 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        darkChrome ? 'bg-bg-dark/95 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      {/* Announcement strip — desktop only, visible while the hero is in view */}
      {isHome && heroInView && (
        <Link
          to="/explore"
          className="hidden lg:block bg-bg-dark border-b border-white/10 py-2 px-6 lg:px-12 text-center group"
        >
          <span className="text-[10px] uppercase tracking-[0.22em] text-white/80 group-hover:text-white transition-colors">
            The sanctuary is taking shape · Home services available
            <span className="ml-2 text-accent-gold">→</span>
          </span>
        </Link>
      )}

      <div className={`w-full px-6 lg:px-12 transition-[padding] duration-300 ${darkChrome ? 'py-4' : 'py-6'}`}>
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <img
                src="/assets/Logo/mastercutlogo.png"
                alt="Ra Logo"
                className="w-10 h-10 transition-transform duration-300 group-hover:scale-105 object-contain"
              />
            </div>
            <div
              className={`flex flex-col -space-y-0.3 transition-colors duration-300 ${
                darkChrome ? 'text-white' : 'text-text-primary'
              }`}
            >
              <span className="text-sm font-medium tracking-wide leading-none">Ra</span>
              <span
                className={`text-sm font-medium tracking-wide leading-none ${
                  darkChrome ? 'text-white/70' : 'text-text-primary/70'
                }`}
              >
                by Mastercuts
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {/* Menu */}
            <div className="relative">
              <button
                onClick={() => setDesktopMenuOpen(true)}
                className={`flex items-center gap-2 text-sm font-medium transition-colors duration-200 hover:opacity-70 ${
                  darkChrome ? 'text-white' : 'text-text-primary'
                }`}
              >
                Menu
                <Menu className="w-4 h-4" />
              </button>
            </div>

            {/* Rituals Dropdown */}
            <div className="relative">
              <button
                onClick={() => setServicesOpen(!servicesOpen)}
                className={`flex items-center gap-2 text-sm font-medium transition-colors duration-200 hover:opacity-70 ${
                  darkChrome ? 'text-white' : 'text-text-primary'
                }`}
              >
                Rituals
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    servicesOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {servicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-4 w-72 bg-bg-dark rounded-lg shadow-xl overflow-hidden"
                  >
                    {rituals.map((r) => (
                      <Link
                        key={r.id}
                        to={`/explore#${r.id}`}
                        className="flex flex-col gap-0.5 px-5 py-3 hover:bg-white/10 transition-colors duration-200 group"
                        onClick={() => setServicesOpen(false)}
                      >
                        <span className="text-sm text-white/80 group-hover:text-white">
                          {r.title} <span className="italic">{r.titleItalic}</span>
                        </span>
                        <span className="text-[10px] uppercase tracking-[0.18em] text-white/40 group-hover:text-white/60">
                          {r.tagline}
                        </span>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Side */}
          <div className="hidden lg:flex items-center gap-6">
            <a
              href="tel:+97145550100"
              className={`flex items-center gap-2 text-sm transition-colors duration-200 hover:opacity-70 ${
                darkChrome ? 'text-white' : 'text-text-primary'
              }`}
            >
              <Phone className="w-4 h-4" />
              <span className="font-medium">+971 4 555 0100</span>
              <span className={`text-xs ${darkChrome ? 'text-white/60' : 'text-text-primary/60'}`}>
                Dubai
              </span>
            </a>

            <CartIcon tone={darkChrome ? 'light' : 'dark'} />

            {account ? (
              <button
                type="button"
                onClick={openProfile}
                aria-label="Open profile"
                className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-medium tracking-wide transition-colors duration-200 ${
                  darkChrome
                    ? 'bg-white text-text-primary hover:bg-white/90'
                    : 'bg-bg-dark text-white hover:bg-bg-dark/90'
                }`}
              >
                {initials || <UserIcon className="w-4 h-4" />}
              </button>
            ) : (
              <Button
                onClick={openLogin}
                className={`rounded-full px-6 py-2 text-sm font-medium flex items-center gap-2 transition-colors duration-200 ${
                  darkChrome
                    ? 'bg-white text-text-primary hover:bg-white/90'
                    : 'bg-bg-dark text-white hover:bg-bg-dark/90'
                }`}
              >
                <UserIcon className="w-4 h-4" />
                Log in
              </Button>
            )}
          </div>

          {/* Mobile Right Buttons */}
          <div className="flex items-center gap-2 lg:hidden">
            <a
              href="tel:+97145550100"
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 ${
                darkChrome
                  ? 'bg-white/20 text-white hover:bg-white/30'
                  : 'bg-black/10 text-text-primary hover:bg-black/15'
              }`}
            >
              <Phone className="w-4 h-4" />
            </a>

            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <button className="w-10 h-10 rounded-full bg-bg-dark flex items-center justify-center text-white hover:bg-bg-dark/80 transition-colors duration-200">
                  <Menu className="w-5 h-5" />
                </button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-full sm:w-96 bg-bg-dark border-none"
                hideDefaultClose
              >
                <div className="flex flex-col h-full px-8 pt-8 pb-10">
                  <div className="flex items-center justify-between mb-12">
                    <div className="flex flex-col -space-y-0.5">
                      <span className="text-sm font-medium text-white tracking-wide leading-none">
                        Ra
                      </span>
                      <span className="text-sm font-medium text-white/60 tracking-wide leading-none">
                        by Mastercuts
                      </span>
                    </div>
                    <SheetClose className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors duration-200">
                      <X className="w-5 h-5" />
                    </SheetClose>
                  </div>

                  <nav className="flex flex-col gap-5">
                    <button
                      type="button"
                      className="text-left text-2xl font-serif text-white hover:opacity-60 transition-opacity"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        navigate('/');
                      }}
                    >
                      Home
                    </button>
                    <button
                      type="button"
                      className="text-left text-2xl font-serif text-white hover:opacity-60 transition-opacity"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setTimeout(() => goToSection('about'), 220);
                      }}
                    >
                      About Us
                    </button>

                    <div className="pt-2">
                      <p className="text-[10px] uppercase tracking-[0.22em] text-white/40 mb-3">
                        Rituals
                      </p>
                      <div className="flex flex-col gap-4">
                        {rituals.map((r) => (
                          <Link
                            key={r.id}
                            to={`/explore#${r.id}`}
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex flex-col gap-0.5 group"
                          >
                            <span className="text-xl font-serif text-white/90 group-hover:text-white transition-colors">
                              {r.title} <span className="italic">{r.titleItalic}</span>
                            </span>
                            <span className="text-[11px] uppercase tracking-[0.18em] text-white/40 group-hover:text-white/60 transition-colors">
                              {r.tagline}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      className="text-left text-2xl font-serif text-white hover:opacity-60 transition-opacity pt-2"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setTimeout(() => goToSection('team'), 220);
                      }}
                    >
                      Our Stylists
                    </button>
                    <button
                      type="button"
                      className="text-left text-2xl font-serif text-white hover:opacity-60 transition-opacity"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setTimeout(() => goToSection('contact'), 220);
                      }}
                    >
                      Contact
                    </button>
                  </nav>

                  <div className="mt-auto space-y-5">
                    <Button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setTimeout(() => openCart(), 220);
                      }}
                      className="w-full bg-white text-text-primary hover:bg-white/90 rounded-full py-6 text-sm font-medium flex items-center justify-center gap-2 group"
                    >
                      Book Now
                      <Plus className="w-4 h-4 transition-transform duration-200 group-hover:rotate-90" />
                    </Button>
                    <div className="border-t border-white/10 pt-5">
                      <a
                        href="tel:+97145550100"
                        className="flex items-center gap-3 text-white/70 hover:text-white transition-colors"
                      >
                        <Phone className="w-4 h-4" />
                        <span className="text-sm">+971 4 555 0100</span>
                      </a>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </motion.header>

    <DesktopMenu open={desktopMenuOpen} onClose={() => setDesktopMenuOpen(false)} />
  </>
  );
}
