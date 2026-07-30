import { useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

/* Shared shell for the long-form legal pages (Privacy Policy, Refund Policy).
   Mirrors the TermsPage composition — bone surface, gold eyebrows, serif
   headings, hairline dividers between sections. */

type PolicyShellProps = {
  eyebrow: string;
  title: ReactNode;
  intro: ReactNode;
  children: ReactNode;
};

export function PolicyShell({ eyebrow, title, intro, children }: PolicyShellProps) {
  const navigate = useNavigate();

  // Footer links sit at the bottom of the page — open the policy at the top.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  return (
    <main
      className="min-h-screen bg-bg-primary text-text-primary pb-28 lg:pb-16"
      style={{ paddingTop: 'var(--nav-offset, 0px)' }}
    >
      {/* Hero */}
      <section className="px-6 lg:px-16 pt-10 pb-12 border-b border-black/10">
        <div className="mx-auto max-w-3xl">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-text-secondary hover:text-text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </button>

          <p className="text-[10px] uppercase tracking-[0.22em] text-accent-gold mb-3">
            {eyebrow}
          </p>
          <h1 className="font-serif text-4xl lg:text-6xl text-text-primary leading-[1.02] mb-5">
            {title}
          </h1>
          <div className="space-y-4 text-base text-text-secondary leading-relaxed max-w-prose">
            {intro}
          </div>
        </div>
      </section>

      {children}
    </main>
  );
}

type PolicySectionProps = {
  /** Rendered as the small eyebrow above the heading, e.g. "Section 01". */
  label: string;
  title: ReactNode;
  children: ReactNode;
  /** Drops the bottom hairline and adds closing breathing room. */
  last?: boolean;
};

export function PolicySection({ label, title, children, last }: PolicySectionProps) {
  return (
    <section
      className={
        last
          ? 'px-6 lg:px-16 pt-14 pb-20'
          : 'px-6 lg:px-16 pt-14 pb-14 border-b border-black/10'
      }
    >
      <div className="mx-auto max-w-3xl">
        <p className="text-[10px] uppercase tracking-[0.22em] text-text-secondary mb-3">
          {label}
        </p>
        <h2 className="font-serif text-3xl lg:text-4xl text-text-primary leading-[1.05] mb-6">
          {title}
        </h2>
        <div className="space-y-5">{children}</div>
      </div>
    </section>
  );
}

export function PolicyText({ children }: { children: ReactNode }) {
  return (
    <p className="text-sm lg:text-base text-text-primary leading-relaxed">
      {children}
    </p>
  );
}

export function PolicyNote({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs lg:text-sm text-text-secondary leading-relaxed">
      {children}
    </p>
  );
}

/** Sub-heading used inside a section for a titled block. */
export function PolicySubheading({ children }: { children: ReactNode }) {
  return (
    <h3 className="font-serif text-xl lg:text-2xl text-text-primary leading-tight">
      {children}
    </h3>
  );
}

/** Bulleted list with a small gold marker. */
export function PolicyList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 items-baseline">
          <span className="w-1 h-1 rounded-full bg-accent-gold shrink-0 translate-y-[-2px]" />
          <span className="text-sm lg:text-base text-text-primary leading-relaxed">
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Numbered list matching the TermsPage treatment. */
export function PolicyNumberedList({ items }: { items: ReactNode[] }) {
  return (
    <ol className="space-y-4 list-none">
      {items.map((item, i) => (
        <li
          key={i}
          className="flex gap-4 items-baseline border-l border-accent-gold/30 pl-4"
        >
          <span className="text-[11px] uppercase tracking-[0.22em] text-accent-gold tabular-nums shrink-0">
            {String(i + 1).padStart(2, '0')}
          </span>
          <span className="text-sm lg:text-base text-text-primary leading-relaxed">
            {item}
          </span>
        </li>
      ))}
    </ol>
  );
}

/** Indented block for a nested topic (e.g. "Payment Information"). */
export function PolicyBlock({
  title,
  children,
}: {
  title: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="border-l border-accent-gold/30 pl-4 lg:pl-5 space-y-3">
      <p className="text-[11px] uppercase tracking-[0.22em] text-accent-gold">
        {title}
      </p>
      {children}
    </div>
  );
}
