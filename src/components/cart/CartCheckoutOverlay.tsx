import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, X } from 'lucide-react';
import { useCart } from './CartProvider';
import type { CheckoutStep } from './CartProvider';
import { useIsMobile } from '@/hooks/use-mobile';
import { PhoneLoginStep } from './steps/PhoneLoginStep';
import { OtpVerifyStep } from './steps/OtpVerifyStep';
import { AddressStep } from './steps/AddressStep';
import { DateTimeStep } from './steps/DateTimeStep';

function getPrevStep(current: CheckoutStep, _hasAccount: boolean): CheckoutStep | null {
  switch (current) {
    case 'phone-login':
      return null; // back to basket
    case 'otp-verify':
      return 'phone-login';
    case 'address':
      return null; // back to basket
    case 'date-time':
      return null; // back to basket — address is "done"
    default:
      return null;
  }
}

function getStepLabel(step: CheckoutStep): string {
  switch (step) {
    case 'phone-login':
    case 'otp-verify':
      return 'Login';
    case 'address':
      return 'Address';
    case 'date-time':
      return 'Date & time';
    default:
      return '';
  }
}

// Visual step number (login=1, address=2, time=3)
function getVisualStep(step: CheckoutStep, hasAccount: boolean): number {
  if (hasAccount) {
    // Returning user: address=1, time=2
    switch (step) {
      case 'address':
        return 1;
      case 'date-time':
        return 2;
      default:
        return 1;
    }
  }
  // New user: login=1, address=2, time=3
  switch (step) {
    case 'phone-login':
    case 'otp-verify':
      return 1;
    case 'address':
      return 2;
    case 'date-time':
      return 3;
    default:
      return 1;
  }
}

function getTotalVisualSteps(hasAccount: boolean): number {
  return hasAccount ? 2 : 3;
}

interface OverlayProps {
  mode?: 'embedded' | 'standalone';
}

export function CartCheckoutOverlay({ mode = 'embedded' }: OverlayProps = {}) {
  const { checkoutStep, setCheckoutStep, closeAll, account, surface } = useCart();
  const isMobile = useIsMobile();
  // Embedded overlay belongs to the cart drawer; standalone overlay belongs to
  // the login surface. Each only renders when its own surface is active so the
  // two never collide.
  const surfaceMatches = mode === 'standalone' ? surface === 'login' : surface === 'cart';
  const isOpen = checkoutStep !== 'none' && surfaceMatches;
  const hasAccount = !!account;

  const handleBack = () => {
    const prev = getPrevStep(checkoutStep, hasAccount);
    if (prev) {
      setCheckoutStep(prev);
    } else if (mode === 'standalone') {
      // Standalone has no underlying surface to return to — fully close.
      closeAll();
    } else {
      setCheckoutStep('none');
    }
  };

  const stepNum = getVisualStep(checkoutStep, hasAccount);
  const totalSteps = getTotalVisualSteps(hasAccount);

  const isStandalone = mode === 'standalone';
  // Standalone on desktop renders as a right-side drawer (same pattern as
  // CartDrawer). Standalone on mobile and embedded everywhere stay as a
  // bottom sheet.
  const desktopDrawer = isStandalone && !isMobile;

  const backdropClass = isStandalone
    ? 'fixed inset-0 bg-black/40 z-[70]'
    : 'absolute inset-0 bg-black/30 z-10';
  const sheetClass = desktopDrawer
    ? 'fixed right-0 top-0 bottom-0 z-[80] bg-bg-primary w-full max-w-md flex flex-col overflow-hidden shadow-2xl'
    : isStandalone
      ? 'fixed inset-x-0 bottom-0 top-12 z-[80] bg-bg-primary rounded-t-2xl flex flex-col overflow-hidden shadow-xl'
      : 'absolute inset-x-0 bottom-0 top-12 z-20 bg-bg-primary rounded-t-2xl flex flex-col overflow-hidden shadow-xl';

  // Slide-in from right on desktop standalone, slide-up from bottom otherwise.
  const sheetMotion = desktopDrawer
    ? { initial: { x: '100%' }, animate: { x: 0 }, exit: { x: '100%' } }
    : { initial: { y: '100%' }, animate: { y: 0 }, exit: { y: '100%' } };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="checkout-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className={backdropClass}
            onClick={handleBack}
          />

          {/* Drawer / sheet */}
          <motion.div
            key={`checkout-sheet-${checkoutStep}`}
            initial={sheetMotion.initial}
            animate={sheetMotion.animate}
            exit={sheetMotion.exit}
            transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            className={sheetClass}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-3 flex-shrink-0">
              <button
                type="button"
                onClick={handleBack}
                aria-label="Back"
                className="w-9 h-9 rounded-full bg-black/5 flex items-center justify-center text-text-primary hover:bg-black/10 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div className="text-center">
                <p className="text-[10px] uppercase tracking-[0.2em] text-text-secondary">
                  {getStepLabel(checkoutStep)}
                </p>
                <p className="text-xs text-text-primary mt-0.5">
                  0{stepNum} / 0{totalSteps}
                </p>
              </div>
              <button
                type="button"
                onClick={closeAll}
                aria-label="Close"
                className="w-9 h-9 rounded-full bg-black/5 flex items-center justify-center text-text-primary hover:bg-black/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Progress bar */}
            <div className="px-5 pb-2 flex-shrink-0">
              <div className="flex gap-1.5">
                {Array.from({ length: totalSteps }, (_, i) => (
                  <div
                    key={i}
                    className={`h-0.5 flex-1 rounded-full transition-colors ${
                      i < stepNum ? 'bg-bg-dark' : 'bg-black/10'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Step content */}
            <div className="flex-1 overflow-hidden">
              {checkoutStep === 'phone-login' && <PhoneLoginStep />}
              {checkoutStep === 'otp-verify' && <OtpVerifyStep />}
              {checkoutStep === 'address' && <AddressStep />}
              {checkoutStep === 'date-time' && <DateTimeStep />}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
