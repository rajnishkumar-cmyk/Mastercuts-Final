import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Instagram, Linkedin } from 'lucide-react';
import { useCart } from '@/components/cart/CartProvider';
import { useAudience } from '@/components/services/useAudience';

interface Location {
  name: string;
  address: string;
  phone: string;
  hours: string;
}

const locations: Location[] = [
  {
    name: 'Downtown',
    address: '100 Main Street Suite 101, City Center, FL 33180',
    phone: '(305) 555-0100',
    hours: 'Mo-Th 8:30 am - 7:00 pm\nFriday 8:30 am - 8:00 pm'
  }
];

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
            Ready to Transform Your
            <br />
            Look? <span className="italic">Book an appointment.</span>
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
                Book Now
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
                  Ra Wellness Centre
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

          {/* Location */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="lg:col-span-1"
          >
            <p className="text-white/50 text-sm mb-6">Location</p>
            <div className="space-y-6">
              {locations.map((location) => (
                <div key={location.name} className="border-l border-white/20 pl-4">
                  <p className="text-white font-medium mb-1">{location.name}</p>
                  <p className="text-white/50 text-sm mb-1">{location.address}</p>
                  <p className="text-white text-sm">{location.phone}</p>
                  <p className="text-white/50 text-xs whitespace-pre-line mt-1">{location.hours}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

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
            <a href="#" className="text-white/50 hover:text-white transition-colors duration-200">
              Privacy Policy
            </a>
            <a href="#" className="text-white/50 hover:text-white transition-colors duration-200">
              Accessibility Statement
            </a>
            <a href="#" className="text-white/50 hover:text-white transition-colors duration-200">
              Terms & Conditions
            </a>
          </div>

          <p className="text-white/50 text-sm">
            Developed by <span className="text-white">Mrikal</span>
          </p>
        </motion.div>

      </div>
    </footer>
  );
}
