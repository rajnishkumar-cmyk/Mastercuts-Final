import { useState } from 'react';
import { X, ArrowRight, ArrowUpRight, Sparkles, User, MapPin, Clock, Banknote, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart, useCartTotals, formatAed, formatDuration } from '../CartProvider';
import { CartItemRow } from '../CartItemRow';
import { FrequentlyAddedSection } from '../FrequentlyAddedSection';
import { cn } from '@/lib/utils';

function formatDateLabel(key: string): string {
  const [Y, M, D] = key.split('-').map(Number);
  const d = new Date(Y, M - 1, D);
  return d.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

function formatTimeLabel(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hh = h % 12 === 0 ? 12 : h % 12;
  return `${hh}:${String(m).padStart(2, '0')} ${period}`;
}

interface Props {
  onClose: () => void;
  onContinue: () => void;
}

export function BasketView({ onClose, onContinue }: Props) {
  const {
    cart,
    account,
    setCheckoutStep,
    confirmBooking,
    getSelectedAddress,
    paymentMethod,
    setPaymentMethod,
  } = useCart();
  const { totalPrice, totalDuration, count } = useCartTotals();
  const navigate = useNavigate();
  const isEmpty = count === 0;

  const [policyAccepted, setPolicyAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const selectedAddress = getSelectedAddress();
  const hasAddress = !!selectedAddress;
  const hasTimeSlot = !!(cart.draftCheckout?.date && cart.draftCheckout?.time);

  const canPay = hasAddress && hasTimeSlot && policyAccepted && !submitting;

  const handlePay = async () => {
    if (!canPay) return;
    setSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      confirmBooking();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 pt-6 pb-5 border-b border-black/10 flex-shrink-0">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-text-secondary mb-1">
            Your cart
          </p>
          <h2 className="font-serif text-2xl text-text-primary leading-none">
            Ritual <span className="italic">Cart</span>
            {count > 0 && (
              <span className="ml-3 text-sm text-text-secondary align-middle">
                {count} {count === 1 ? 'item' : 'items'}
              </span>
            )}
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close cart"
          className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-text-primary hover:bg-black/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        {isEmpty ? (
          <div className="flex flex-col items-center text-center px-6 pt-10 pb-10">
            <p className="text-xs uppercase tracking-[0.2em] text-text-secondary mb-6">
              Your cart is empty
            </p>
            <h3 className="font-serif text-4xl leading-[1.05] text-text-primary mb-4">
              Begin your <span className="italic">ritual</span>
            </h3>
            <p className="text-text-secondary text-sm max-w-xs mb-8 leading-relaxed">
              Explore the five sanctuaries of Ra and add your favourite services to begin building your visit.
            </p>
            <button
              type="button"
              onClick={() => { onClose(); navigate('/#services'); }}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-bg-dark text-white px-6 py-3.5 text-sm font-medium hover:bg-bg-darker transition-colors"
            >
              Browse rituals
              <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>
        ) : (
          <div className="px-6">
            {/* Contact info for returning users */}
            {account && account.name && (
              <div className="flex items-center gap-3 py-4 border-b border-black/10">
                <div className="w-9 h-9 rounded-full bg-bg-dark text-white flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-text-primary truncate">
                    {account.name}
                  </p>
                  <p className="text-xs text-text-secondary truncate">
                    {account.phone}
                  </p>
                </div>
              </div>
            )}

            {cart.items.map((item) => (
              <CartItemRow key={item.id} item={item} />
            ))}

            {/* Frequently added together */}
            <FrequentlyAddedSection />

            {/* Inline "Add more rituals" row */}
            <button
              type="button"
              onClick={() => { onClose(); navigate('/#services'); }}
              className="group w-full flex items-center justify-between gap-4 py-5 border-b border-black/10 text-left"
            >
              <span className="flex flex-col min-w-0">
                <span className="font-serif text-lg text-text-primary leading-tight">
                  Add more <span className="italic">rituals</span>
                </span>
                <span className="text-[11px] uppercase tracking-wider text-text-secondary mt-1">
                  Browse the five sanctuaries
                </span>
              </span>
              <span className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-text-primary group-hover:bg-black/10 transition-colors flex-shrink-0">
                <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </button>

            {/* Journey entry */}
            <button
              type="button"
              onClick={() => { onClose(); navigate('/explore#curated-journeys'); }}
              className="group w-full flex items-center justify-between gap-4 py-5 border-b border-black/10 text-left"
            >
              <span className="flex items-center gap-3 min-w-0">
                <span className="w-10 h-10 rounded-full bg-bg-dark text-white flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4" />
                </span>
                <span className="flex flex-col min-w-0">
                  <span className="font-serif text-lg text-text-primary leading-tight">
                    Add a curated <span className="italic">journey</span>
                  </span>
                  <span className="text-[11px] uppercase tracking-wider text-text-secondary mt-1">
                    Hand-assembled · save up to 15%
                  </span>
                </span>
              </span>
              <span className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-text-primary group-hover:bg-black/10 transition-colors flex-shrink-0">
                <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </button>

            <div className="py-6 border-b border-black/10">
              <p className="text-[10px] uppercase tracking-[0.2em] text-text-secondary mb-3">
                Good to know
              </p>
              <ul className="space-y-2 text-xs text-text-secondary">
                <li>· Free cancellation up to 4 hours before your visit</li>
                <li>· No payment required now — settle when your therapist arrives</li>
                <li>· Services run sequentially in one visit</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Progressive sticky footer — only when cart has items */}
      {!isEmpty && (
        <div className="flex-shrink-0 border-t border-black/10 bg-bg-primary px-6 pt-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
          {/* Address row (visible after address is saved) */}
          {hasAddress && (
            <div className="flex items-center justify-between py-2.5 mb-2 border-b border-black/10">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <MapPin className="w-3.5 h-3.5 text-text-secondary shrink-0" />
                <p className="text-xs text-text-primary truncate">
                  {selectedAddress.displayAddress} · Flat {selectedAddress.flatVilla}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCheckoutStep('address')}
                className="text-[11px] text-text-secondary hover:text-text-primary transition-colors shrink-0 ml-2"
              >
                Change
              </button>
            </div>
          )}

          {/* Time row (visible after date/time is selected) */}
          {hasAddress && hasTimeSlot && (
            <div className="flex items-center justify-between py-2.5 mb-2 border-b border-black/10">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <Clock className="w-3.5 h-3.5 text-text-secondary shrink-0" />
                <p className="text-xs text-text-primary truncate">
                  {cart.draftCheckout?.date ? formatDateLabel(cart.draftCheckout.date) : ''} · {cart.draftCheckout?.time ? formatTimeLabel(cart.draftCheckout.time) : ''}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCheckoutStep('date-time')}
                className="text-[11px] text-text-secondary hover:text-text-primary transition-colors shrink-0 ml-2"
              >
                Change
              </button>
            </div>
          )}

          {/* Payment method toggle (visible in final state) */}
          {hasAddress && hasTimeSlot && (
            <div className="flex items-center gap-2 py-2.5 mb-3">
              <span className="text-[10px] uppercase tracking-wider text-text-secondary shrink-0">
                Pay via
              </span>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash')}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] border transition-colors',
                    paymentMethod === 'cash'
                      ? 'border-bg-dark bg-bg-dark text-white'
                      : 'border-black/15 text-text-primary hover:bg-black/5'
                  )}
                >
                  <Banknote className="w-3 h-3" />
                  Cash
                </button>
                <button
                  type="button"
                  disabled
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] border border-black/10 text-text-muted cursor-not-allowed opacity-50"
                >
                  <CreditCard className="w-3 h-3" />
                  Card
                  <span className="text-[9px] uppercase tracking-wider bg-black/5 px-1.5 py-0.5 rounded-full">
                    Soon
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Policy + Pay (final state) */}
          {hasAddress && hasTimeSlot && (
            <label className="flex items-start gap-2.5 text-xs text-text-secondary mb-3 cursor-pointer">
              <input
                type="checkbox"
                checked={policyAccepted}
                onChange={(e) => setPolicyAccepted(e.target.checked)}
                className="mt-0.5 accent-bg-dark"
              />
              <span>
                I agree to the booking & cancellation policy
              </span>
            </label>
          )}

          {/* Subtotal row (always visible) */}
          {!(hasAddress && hasTimeSlot) && (
            <>
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-xs uppercase tracking-wider text-text-secondary">Subtotal</span>
                <span className="font-serif text-2xl text-text-primary">{formatAed(totalPrice)}</span>
              </div>
              <div className="flex items-baseline justify-between mb-5">
                <span className="text-xs uppercase tracking-wider text-text-secondary">Duration</span>
                <span className="text-sm text-text-primary">{formatDuration(totalDuration)}</span>
              </div>
            </>
          )}

          {/* CTA button — changes based on state */}
          {hasAddress && hasTimeSlot ? (
            <button
              type="button"
              disabled={!canPay}
              onClick={handlePay}
              className={cn(
                'w-full rounded-full py-4 text-sm font-medium transition-colors',
                canPay
                  ? 'bg-bg-dark text-white hover:bg-bg-darker'
                  : 'bg-black/10 text-text-muted cursor-not-allowed'
              )}
            >
              {submitting
                ? 'Confirming...'
                : `Pay via ${paymentMethod === 'cash' ? 'Cash' : 'Card'} · ${formatAed(totalPrice)}`}
            </button>
          ) : hasAddress ? (
            <button
              type="button"
              onClick={() => setCheckoutStep('date-time')}
              className="group w-full rounded-full bg-bg-dark text-white py-4 text-sm font-medium flex items-center justify-center gap-2 hover:bg-bg-darker transition-colors"
            >
              Select time slot
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onContinue}
              className="group w-full rounded-full bg-bg-dark text-white py-4 text-sm font-medium flex items-center justify-center gap-2 hover:bg-bg-darker transition-colors"
            >
              {account ? 'Add address & slot' : 'Continue'}
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
