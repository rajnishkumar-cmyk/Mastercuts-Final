import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, X } from 'lucide-react';
import { useCart } from './CartProvider';
import type { CheckoutStep } from './CartProvider';
import { PhoneLoginStep } from './steps/PhoneLoginStep';
import { OtpVerifyStep } from './steps/OtpVerifyStep';
import { AddressStep } from './steps/AddressStep';
import { EditContactOverlay } from './steps/EditContactOverlay';
import { DateTimeStep } from './steps/DateTimeStep';

function getPrevStep(current: CheckoutStep, hasAccount: boolean): CheckoutStep | null {
  switch (current) {
    case 'phone-login':
      return null; // back to basket
    case 'otp-verify':
      return 'phone-login';
    case 'address':
      return null; // back to basket
    case 'edit-contact':
      return 'address';
    case 'date-time':
      return hasAccount ? null : null; // back to basket — address is "done"
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
    case 'edit-contact':
      return 'Contact';
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
      case 'edit-contact':
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
    case 'edit-contact':
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

export function CartCheckoutOverlay() {
  const { checkoutStep, setCheckoutStep, closeAll, account } = useCart();
  const isOpen = checkoutStep !== 'none';
  const hasAccount = !!account;

  const handleBack = () => {
    const prev = getPrevStep(checkoutStep, hasAccount);
    if (prev) {
      setCheckoutStep(prev);
    } else {
      setCheckoutStep('none');
    }
  };

  const stepNum = getVisualStep(checkoutStep, hasAccount);
  const totalSteps = getTotalVisualSteps(hasAccount);

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
            className="absolute inset-0 bg-black/30 z-10"
            onClick={handleBack}
          />

          {/* Bottom sheet */}
          <motion.div
            key={`checkout-sheet-${checkoutStep}`}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            className="absolute inset-x-0 bottom-0 top-12 z-20 bg-bg-primary rounded-t-2xl flex flex-col overflow-hidden shadow-xl"
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
              {checkoutStep === 'edit-contact' && <EditContactOverlay />}
              {checkoutStep === 'date-time' && <DateTimeStep />}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
