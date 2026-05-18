import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search as SearchIcon, X, ArrowUpRight } from 'lucide-react';
import { useCart, formatAed, formatDuration } from '@/components/cart/CartProvider';
import { getAtHomeServices } from '@/lib/booking/catalog';

const QUERY_DEBOUNCE_MS = 120;

export function SearchSheet() {
  const { isSearchOpen, closeSearch, openServiceDetail } = useCart();
  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Reset query when the sheet closes; refocus the input when it opens.
  useEffect(() => {
    if (isSearchOpen) {
      // Slight defer so the input is mounted before we focus.
      const t = window.setTimeout(() => inputRef.current?.focus(), 50);
      return () => window.clearTimeout(t);
    }
    setQuery('');
    setDebounced('');
  }, [isSearchOpen]);

  // Debounce the query so we're not re-filtering on every keystroke.
  useEffect(() => {
    const t = window.setTimeout(
      () => setDebounced(query.trim().toLowerCase()),
      QUERY_DEBOUNCE_MS,
    );
    return () => window.clearTimeout(t);
  }, [query]);

  // Lock body scroll while open.
  useEffect(() => {
    if (!isSearchOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [isSearchOpen]);

  // Close on ESC.
  useEffect(() => {
    if (!isSearchOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSearch();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isSearchOpen, closeSearch]);

  const results = useMemo(() => {
    if (!debounced) return [];
    const services = getAtHomeServices();
    return services.filter(
      (s) =>
        s.name.toLowerCase().includes(debounced) ||
        s.description.toLowerCase().includes(debounced),
    );
  }, [debounced]);

  const handleOpenService = (serviceId: string, ritualId: string) => {
    closeSearch();
    // Small defer so the search sheet's exit animation can begin before the
    // service detail sheet opens — avoids two stacked transitions.
    window.setTimeout(() => openServiceDetail(serviceId, ritualId as never), 180);
  };

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div
          key="search-sheet"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="fixed inset-0 z-[80] bg-bg-primary overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Search at-home rituals"
        >
          {/* Top bar */}
          <div className="sticky top-0 z-10 bg-bg-primary border-b border-black/10">
            <div
              className="flex items-center gap-3 px-6 py-4 max-w-3xl mx-auto"
              style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
            >
              <SearchIcon className="w-4 h-4 text-text-secondary shrink-0" />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search at-home rituals…"
                className="flex-1 bg-transparent outline-none text-base text-text-primary placeholder:text-text-secondary"
                autoComplete="off"
                aria-label="Search at-home rituals"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  className="w-7 h-7 rounded-full bg-black/5 flex items-center justify-center text-text-secondary hover:bg-black/10 hover:text-text-primary transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={closeSearch}
                aria-label="Close search"
                className="ml-1 text-xs uppercase tracking-[0.18em] text-text-secondary hover:text-text-primary transition-colors"
              >
                Close
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-8 max-w-3xl mx-auto">
            {!debounced ? (
              <div className="py-10 text-center">
                <p className="text-[10px] uppercase tracking-[0.22em] text-text-secondary mb-3">
                  At-home rituals
                </p>
                <h2 className="font-serif text-3xl lg:text-4xl text-text-primary leading-[1.05] mb-3">
                  What are you looking <span className="italic">for?</span>
                </h2>
                <p className="text-sm text-text-secondary leading-relaxed max-w-sm mx-auto">
                  Search by name or technique — try &ldquo;Balinese&rdquo;,
                  &ldquo;deep tissue&rdquo;, or &ldquo;aromatherapy&rdquo;.
                </p>
              </div>
            ) : results.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-[10px] uppercase tracking-[0.22em] text-text-secondary mb-3">
                  No matches
                </p>
                <h2 className="font-serif text-2xl lg:text-3xl text-text-primary leading-[1.05] mb-3">
                  We don&apos;t have that <span className="italic">yet</span>.
                </h2>
                <p className="text-sm text-text-secondary leading-relaxed max-w-sm mx-auto">
                  Only at-home massage rituals are available during this
                  transition. Hand &amp; feet and threading rituals are
                  coming soon.
                </p>
              </div>
            ) : (
              <>
                <p className="text-[10px] uppercase tracking-[0.22em] text-text-secondary mb-4">
                  {results.length}{' '}
                  {results.length === 1 ? 'result' : 'results'}
                </p>
                <ul className="divide-y divide-black/10 border-y border-black/10">
                  {results.map((s) => (
                    <li key={s.id}>
                      <button
                        type="button"
                        onClick={() => handleOpenService(s.id, s.ritualId)}
                        className="group w-full flex items-center gap-4 py-4 text-left"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-serif text-lg text-text-primary leading-tight truncate">
                            {s.name}
                          </p>
                          <p className="text-xs text-text-secondary mt-0.5 truncate">
                            {formatDuration(s.durationMin)} · {formatAed(s.price)}
                          </p>
                        </div>
                        <span className="shrink-0 w-9 h-9 rounded-full bg-black/5 flex items-center justify-center text-text-primary group-hover:bg-black/10 transition-colors">
                          <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
