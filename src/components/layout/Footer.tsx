import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import { useCart } from '@/components/cart/CartProvider';
import { useAudience } from '@/components/services/useAudience';

const STUDIO_ADDRESS = 'R05 Imperial Avenue, Burj Khalifa Street, Downtown Dubai';
const STUDIO_PHONE = '+971 56 466 7165';
const STUDIO_PHONE_HREF = '+971564667165';
const STUDIO_EMAIL = 'ask@mastercuts.ae';
const STUDIO_HOURS = '10:00 AM – 10:00 PM · Monday – Sunday';
const AT_HOME_HOURS = '10:00 AM – 8:00 PM · Monday – Sunday';
const STORE_MAP_SRC =
  'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3610.4484125620006!2d55.2738043!3d25.1880962!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f690dc8f8025d%3A0xb76a5aca87edadd3!2sMastercuts%20Beauty%20Salon!5e0!3m2!1sen!2sin!4v1779082369113!5m2!1sen!2sin';

export function Footer() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { openExplorePicker, openAudiencePicker, openWellnessHub } = useCart();
  const [, setAudience] = useAudience();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  const goToSalon = (audience: 'gentlemen' | 'ladies') => {
    setAudience(audience);
    navigate('/explore');
  };
  const goToAtHome = () => openAudiencePicker('/at-home');

  const goToSection = (id: string) => {
    if (isHome) {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      navigate(`/#${id}`);
    }
  };

  const goHome = () => {
    if (isHome) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  const clinicLinks: { label: string; onClick: () => void }[] = [
    { label: 'Home', onClick: goHome },
    { label: 'About us', onClick: () => goToSection('about') },
    { label: 'A note from Dr Sara', onClick: () => goToSection('dr-sara') },
    { label: 'Our team', onClick: () => goToSection('team') },
    { label: 'Contact', onClick: () => goToSection('contact') },
  ];

  return (
    <footer id="contact" className="bg-bg-dark pt-24 lg:pt-32 pb-8" ref={ref}>
      <div className="w-full px-6 lg:px-12 xl:px-20">

        {/* CTA Section — title + button in a horizontal row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row items-stretch gap-6 sm:gap-12 lg:gap-20 mb-16 lg:mb-24"
        >
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex-1 font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-white leading-tight"
          >
            We don't simply provide services.
            <br />
            We <span className="italic">create experiences.</span>
          </motion.h2>

          {/* Pill-shaped button — height stretches to match h2, width is fixed for pill proportion */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="flex-shrink-0 w-full sm:w-72 lg:w-96 h-20 sm:h-auto"
          >
            <button
              type="button"
              onClick={openExplorePicker}
              className="group relative w-full h-full rounded-full border border-white/30 flex items-center justify-center overflow-hidden transition-colors duration-500"
            >
              {/* Fill layer — scales up from center on hover */}
              <span
                className="absolute inset-0 rounded-full bg-white scale-0 group-hover:scale-100 transition-transform duration-500 ease-in-out origin-center"
              />
              {/* Label */}
              <span className="relative z-10 font-serif text-2xl italic text-white group-hover:text-text-primary transition-colors duration-300">
                Book an Experience
              </span>
            </button>
          </motion.div>
        </motion.div>

        {/* Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-12 border-t border-white/10">

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <p className="text-white/50 text-sm mb-6">Services</p>
            <ul className="space-y-3">
              <li>
                <button
                  type="button"
                  onClick={goToAtHome}
                  className="text-white hover:text-white/70 transition-colors duration-200 text-left"
                >
                  Ra at Home
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => goToSalon('gentlemen')}
                  className="text-white hover:text-white/70 transition-colors duration-200 text-left"
                >
                  Mastercuts For Gents
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => goToSalon('ladies')}
                  className="text-white hover:text-white/70 transition-colors duration-200 text-left"
                >
                  Mastercuts For Ladies
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={openWellnessHub}
                  className="text-white hover:text-white/70 transition-colors duration-200 text-left"
                >
                  Ra Wellness Hub
                </button>
              </li>
            </ul>
          </motion.div>

          {/* Our Salon */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <p className="text-white/50 text-sm mb-6">Our Salon</p>
            <ul className="space-y-3">
              {clinicLinks.map((link) => (
                <li key={link.label}>
                  <button
                    type="button"
                    onClick={link.onClick}
                    className="text-white hover:text-white/70 transition-colors duration-200 text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Social */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="flex gap-4">
              <a
                href="#"
                className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors duration-200"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors duration-200"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="lg:col-span-1"
          >
            <p className="text-white/50 text-sm mb-6">Contact</p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-accent-gold shrink-0 mt-1" />
                <p className="text-white text-sm leading-relaxed">
                  {STUDIO_ADDRESS}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-accent-gold shrink-0" />
                <a
                  href={`tel:${STUDIO_PHONE_HREF}`}
                  className="text-white text-sm hover:text-white/70 transition-colors"
                >
                  {STUDIO_PHONE}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-accent-gold shrink-0" />
                <a
                  href={`mailto:${STUDIO_EMAIL}`}
                  className="text-white text-sm hover:text-white/70 transition-colors"
                >
                  {STUDIO_EMAIL}
                </a>
              </div>
              <div className="pt-2 border-t border-white/10 space-y-1">
                <p className="text-[10px] uppercase tracking-[0.18em] text-white/40">
                  Studio hours
                </p>
                <p className="text-white/80 text-xs leading-snug">{STUDIO_HOURS}</p>
                <p className="text-[10px] uppercase tracking-[0.18em] text-white/40 pt-2">
                  At-home hours (transition)
                </p>
                <p className="text-white/80 text-xs leading-snug">{AT_HOME_HOURS}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Studio map — the actual store currently being revamped. The
            Imperial Avenue location is for at-home services delivery only
            during the transition period. */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 pt-12 border-t border-white/10"
        >
          <div className="flex items-baseline justify-between gap-4 mb-4 flex-wrap">
            <p className="text-white/50 text-sm">Visit the studio</p>
            <p className="text-[10px] uppercase tracking-[0.22em] text-accent-gold">
              Currently being revamped · Opening soon
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden border border-white/10 aspect-[16/9] md:aspect-[21/9]">
            <iframe
              title="Map of Mastercuts Beauty Salon"
              src={STORE_MAP_SRC}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </motion.div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4"
        >
          <div className="text-white/50 text-sm">
            <p>Copyright 2026</p>
            <p>Mastercuts</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 text-sm items-center sm:items-start">
            <button
              type="button"
              onClick={() => navigate('/terms')}
              className="text-white/50 hover:text-white transition-colors duration-200"
            >
              Terms &amp; Conditions
            </button>
            <button
              type="button"
              onClick={() => navigate('/terms')}
              className="text-white/50 hover:text-white transition-colors duration-200"
            >
              Privacy Policy
            </button>
          </div>

          <p className="text-white/50 text-sm">
            Developed by <span className="text-white">Mrikal</span>
          </p>
        </motion.div>

      </div>
    </footer>
  );
}
