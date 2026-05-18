import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const AT_HOME_TERMS = [
  'Appointments are confirmed upon booking and subject to availability.',
  'Payment is collected at the time of service.',
  'Therapists arrive 10 minutes early to set up.',
  'Cancellations require 4 hours’ notice.',
  'Health conditions must be disclosed prior to the service.',
  'Services may be declined if the environment is unsafe or the client is unwell.',
  'Respectful conduct is expected.',
];

export function TermsPage() {
  const navigate = useNavigate();

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
            Booking · Cancellation · Privacy
          </p>
          <h1 className="font-serif text-4xl lg:text-6xl text-text-primary leading-[1.02] mb-5">
            Terms &amp; <span className="italic">Conditions</span>
          </h1>
          <p className="text-base text-text-secondary leading-relaxed max-w-prose">
            The terms that govern your booking with Mastercuts and Ra at Home,
            our cancellation rules, and how we handle your data.
          </p>
        </div>
      </section>

      {/* Ra at Home Booking & Service Terms */}
      <section className="px-6 lg:px-16 pt-14 pb-14 border-b border-black/10">
        <div className="mx-auto max-w-3xl">
          <p className="text-[10px] uppercase tracking-[0.22em] text-text-secondary mb-3">
            Section 01
          </p>
          <h2 className="font-serif text-3xl lg:text-4xl text-text-primary leading-[1.05] mb-8">
            Booking &amp; service terms <span className="italic">(Ra at Home)</span>
          </h2>
          <ol className="space-y-4 list-none counter-reset-[items]">
            {AT_HOME_TERMS.map((term, i) => (
              <li
                key={term}
                className="flex gap-4 items-baseline border-l border-accent-gold/30 pl-4"
              >
                <span className="text-[11px] uppercase tracking-[0.22em] text-accent-gold tabular-nums shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="text-sm lg:text-base text-text-primary leading-relaxed">
                  {term}
                </p>
              </li>
            ))}
          </ol>
          <p className="mt-8 text-xs text-text-secondary leading-relaxed">
            For Ra at Home bookings, clients are required to specify their flat
            number in Imperial Avenue Residences when making a booking.
          </p>
        </div>
      </section>

      {/* Cancellation policy */}
      <section className="px-6 lg:px-16 pt-14 pb-14 border-b border-black/10">
        <div className="mx-auto max-w-3xl">
          <p className="text-[10px] uppercase tracking-[0.22em] text-text-secondary mb-3">
            Section 02
          </p>
          <h2 className="font-serif text-3xl lg:text-4xl text-text-primary leading-[1.05] mb-6">
            Cancellation <span className="italic">policy</span>
          </h2>
          <p className="text-sm lg:text-base text-text-primary leading-relaxed mb-4">
            Cancellations require at least <strong>4 hours&rsquo; notice</strong>{' '}
            before your scheduled appointment.
          </p>
          <p className="text-xs text-text-secondary italic">
            Full cancellation, no-show and deposit policy details are being
            finalised and will appear here shortly.
          </p>
        </div>
      </section>

      {/* Privacy & Terms of Service placeholders */}
      <section className="px-6 lg:px-16 pt-14 pb-20">
        <div className="mx-auto max-w-3xl">
          <p className="text-[10px] uppercase tracking-[0.22em] text-text-secondary mb-3">
            Section 03
          </p>
          <h2 className="font-serif text-3xl lg:text-4xl text-text-primary leading-[1.05] mb-6">
            Privacy &amp; <span className="italic">terms of service</span>
          </h2>
          <p className="text-sm text-text-secondary italic leading-relaxed">
            Our full Privacy Policy and Terms of Service are being finalised
            and will be published here ahead of the studio opening.
          </p>
        </div>
      </section>
    </main>
  );
}
