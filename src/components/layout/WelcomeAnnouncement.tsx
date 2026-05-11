import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, HeartHandshake, Wand2, Wind, MapPin, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

const services = [
  { icon: HeartHandshake, label: 'Massages' },
  { icon: Wand2, label: 'Nail care' },
  { icon: Wind, label: 'Blow-dry' },
] as const;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NEWSLETTER_KEY = 'mastercuts-newsletter-emails';

interface StoredEmail {
  email: string;
  createdAt: number;
}

export function WelcomeAnnouncement() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [emailError, setEmailError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const t = setTimeout(() => setOpen(true), 600);
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => {
    setOpen(false);
  };

  const handleExplore = () => {
    setOpen(false);
    navigate('/explore');
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!EMAIL_REGEX.test(trimmed)) {
      setEmailError('Please enter a valid email.');
      return;
    }
    try {
      const raw = localStorage.getItem(NEWSLETTER_KEY);
      const list: StoredEmail[] = raw ? JSON.parse(raw) : [];
      list.push({ email: trimmed, createdAt: Date.now() });
      localStorage.setItem(NEWSLETTER_KEY, JSON.stringify(list));
    } catch {
      // storage may be blocked — still show success so we're not hostile
    }
    setSubmitted(true);
    setEmailError('');
  };

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? setOpen(true) : dismiss())}>
      <AnimatePresence>
        {open && (
          <DialogContent
            showCloseButton={false}
            className="bg-bg-primary border-none p-0 sm:max-w-lg w-[calc(100%-2rem)] max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
              className="flex flex-col max-h-[90vh]"
            >
              {/* Close button */}
              <button
                type="button"
                onClick={dismiss}
                aria-label="Close announcement"
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/5 flex items-center justify-center text-text-primary hover:bg-black/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex-1 overflow-y-auto px-6 pt-10 pb-6 sm:px-10 sm:pt-12">
                {/* Eyebrow */}
                <p className="text-[10px] uppercase tracking-[0.22em] text-text-secondary mb-4">
                  A note from Mastercuts
                </p>

                {/* Headline */}
                <DialogTitle asChild>
                  <h2 className="font-serif text-text-primary leading-[1.05] text-3xl sm:text-4xl mb-1">
                    We've relocated.
                  </h2>
                </DialogTitle>
                <p className="font-serif italic text-text-primary leading-[1.05] text-3xl sm:text-4xl mb-6">
                  And we're transforming.
                </p>

                <div className="h-px bg-accent-gold/40 mb-6" />

                {/* Body intro */}
                <DialogDescription asChild>
                  <p className="text-sm text-text-secondary leading-relaxed mb-6">
                    In the meantime, our signature care comes to you —
                    <span className="text-text-primary"> select at-home services</span>{' '}
                    you can book today:
                  </p>
                </DialogDescription>

                {/* Service icons */}
                <div className="flex items-start justify-center gap-3 sm:gap-5 mb-7">
                  {services.map(({ icon: Icon, label }) => (
                    <div
                      key={label}
                      className="flex flex-col items-center gap-2 flex-1 min-w-0"
                    >
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-circle-light flex items-center justify-center shadow-sm">
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-accent-gold" strokeWidth={1.5} />
                      </div>
                      <span className="text-[10px] sm:text-xs uppercase tracking-[0.14em] text-text-primary text-center">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="h-px bg-accent-gold/40 mb-6" />

                {/* New home */}
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-3.5 h-3.5 text-accent-gold" strokeWidth={2} />
                  <p className="text-[10px] uppercase tracking-[0.22em] text-text-secondary">
                    Our new home
                  </p>
                </div>
                <p className="font-serif text-text-primary text-xl sm:text-2xl leading-tight mb-1">
                  Imperial Avenue
                </p>
                <p className="text-sm text-text-secondary mb-6">
                  Burj Khalifa Street, Downtown Dubai
                </p>

                <div className="h-px bg-accent-gold/40 mb-6" />

                {/* Closer */}
                <p className="font-serif italic text-text-primary text-sm sm:text-base leading-relaxed">
                  Stay connected as we prepare to unveil the{' '}
                  <span className="not-italic">OGee</span> experience —
                  refined, immersive, and thoughtfully designed for you.
                </p>

                <div className="h-px bg-accent-gold/40 mt-6 mb-5" />

                {/* Email capture */}
                <form onSubmit={handleEmailSubmit}>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-text-secondary mb-3">
                    Be there when we open
                  </p>
                  {submitted ? (
                    <div className="flex items-center gap-2.5 py-1">
                      <span className="w-7 h-7 rounded-full bg-accent-gold/20 flex items-center justify-center text-accent-gold shrink-0">
                        <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                      </span>
                      <p className="text-sm text-text-primary">
                        Thanks — we'll be in touch.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
                        <input
                          type="email"
                          inputMode="email"
                          autoComplete="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (emailError) setEmailError('');
                          }}
                          placeholder="you@email.com"
                          className="flex-1 bg-transparent border-b border-black/15 py-2 text-text-primary placeholder:text-text-muted focus:border-text-primary outline-none transition-colors text-sm"
                        />
                        <button
                          type="submit"
                          className="shrink-0 rounded-full bg-bg-dark text-white px-5 py-2.5 text-[11px] uppercase tracking-wider font-medium hover:bg-bg-darker transition-colors"
                        >
                          Notify me
                        </button>
                      </div>
                      {emailError && (
                        <p className="text-xs text-red-600 mt-1.5">{emailError}</p>
                      )}
                      <p className="text-[10px] uppercase tracking-[0.18em] text-text-secondary mt-2">
                        We'll only write when there's something to share.
                      </p>
                    </>
                  )}
                </form>
              </div>

              {/* Sticky CTA bar */}
              <div className="flex-shrink-0 border-t border-black/10 bg-bg-primary px-6 py-4 sm:px-10 flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={handleExplore}
                  className="flex-1 rounded-full bg-bg-dark text-white py-3.5 text-sm font-medium hover:bg-bg-darker transition-colors"
                >
                  Explore at-home services
                </button>
                <button
                  type="button"
                  onClick={dismiss}
                  className="flex-1 rounded-full border border-black/15 text-text-primary py-3.5 text-sm font-medium hover:bg-black/5 transition-colors"
                >
                  Continue browsing
                </button>
              </div>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
}
