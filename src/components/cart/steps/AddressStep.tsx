import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MapPin, Pencil, Home, Building, Plus, Check } from 'lucide-react';
import { useCart } from '../CartProvider';
import { cn } from '@/lib/utils';
import type { ServiceAddress } from '@/lib/booking/types';

const addressSchema = z.object({
  flatVilla: z.string().min(1, 'Please enter your house or flat number'),
  landmark: z.string().max(200).optional(),
});

type AddressFormValues = z.infer<typeof addressSchema>;

export function AddressStep() {
  const {
    account,
    saveLightAccount,
    updateDraftCheckout,
    setCheckoutStep,
    openContactEdit,
  } = useCart();

  const savedAddresses = account?.addresses ?? [];
  const [mode, setMode] = useState<'select' | 'new'>(
    savedAddresses.length > 0 ? 'select' : 'new'
  );
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    savedAddresses[0]?.id ?? ''
  );
  const [label, setLabel] = useState<'home' | 'other'>('home');

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      flatVilla: '',
      landmark: '',
    },
    mode: 'onChange',
  });

  const onSubmitNew = handleSubmit((values) => {
    if (!account) return;

    const newAddress: ServiceAddress = {
      id: crypto.randomUUID(),
      flatVilla: values.flatVilla,
      landmark: values.landmark || undefined,
      label,
      displayAddress: 'Dubai Marina, Dubai',
    };

    // Save address to account
    const updatedAccount = {
      ...account,
      addresses: [...account.addresses, newAddress],
    };
    saveLightAccount(updatedAccount);

    // Set as selected in draft
    updateDraftCheckout({ addressId: newAddress.id });
    setCheckoutStep('date-time');
  });

  const onSelectExisting = () => {
    if (!selectedAddressId) return;
    updateDraftCheckout({ addressId: selectedAddressId });
    setCheckoutStep('date-time');
  };

  // Mode B: Saved address selection
  if (mode === 'select') {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto px-6 pt-6 pb-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-text-secondary mb-3">
            Service address
          </p>
          <h2 className="font-serif text-3xl text-text-primary leading-[1.05] mb-1">
            Where should <span className="italic">we come?</span>
          </h2>
          <p className="text-sm text-text-secondary mb-6">
            Select a saved address or add a new one.
          </p>

          <div className="space-y-3">
            {savedAddresses.map((addr) => (
              <button
                key={addr.id}
                type="button"
                onClick={() => setSelectedAddressId(addr.id)}
                className={cn(
                  'w-full flex items-center gap-3 p-4 rounded-xl border transition-colors text-left',
                  selectedAddressId === addr.id
                    ? 'border-bg-dark bg-bg-dark/5'
                    : 'border-black/10 hover:border-black/20'
                )}
              >
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
                    selectedAddressId === addr.id
                      ? 'bg-bg-dark text-white'
                      : 'bg-black/5 text-text-secondary'
                  )}
                >
                  {addr.label === 'home' ? (
                    <Home className="w-4 h-4" />
                  ) : (
                    <Building className="w-4 h-4" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-text-primary capitalize">
                    {addr.label}
                  </p>
                  <p className="text-xs text-text-secondary truncate">
                    {addr.displayAddress}
                    {addr.flatVilla ? ` · Flat ${addr.flatVilla}` : ''}
                  </p>
                </div>
                {selectedAddressId === addr.id && (
                  <div className="w-5 h-5 rounded-full bg-bg-dark flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </button>
            ))}

            {/* Add new address */}
            <button
              type="button"
              onClick={() => setMode('new')}
              className="w-full flex items-center gap-3 p-4 rounded-xl border border-dashed border-black/15 hover:border-black/30 transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center shrink-0 text-text-secondary">
                <Plus className="w-4 h-4" />
              </div>
              <p className="text-sm text-text-secondary">Add new address</p>
            </button>
          </div>
        </div>

        {/* Sticky CTA */}
        <div className="flex-shrink-0 border-t border-black/10 bg-bg-primary px-6 pt-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
          <button
            type="button"
            disabled={!selectedAddressId}
            onClick={onSelectExisting}
            className={cn(
              'w-full rounded-full py-4 text-sm font-medium transition-colors',
              selectedAddressId
                ? 'bg-bg-dark text-white hover:bg-bg-darker'
                : 'bg-black/10 text-text-muted cursor-not-allowed'
            )}
          >
            Continue with this address
          </button>
        </div>
      </div>
    );
  }

  // Mode A: New address form
  return (
    <form onSubmit={onSubmitNew} className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-4">
        <p className="text-[10px] uppercase tracking-[0.2em] text-text-secondary mb-3">
          Service address
        </p>
        <h2 className="font-serif text-3xl text-text-primary leading-[1.05] mb-1">
          Where should <span className="italic">we come?</span>
        </h2>
        <p className="text-sm text-text-secondary mb-6">
          Our team will come to you. Please provide your address in Dubai.
        </p>

        {/* Studio map — for orientation. The therapist comes to the address
            entered below; this just shows where the Ra studio is located. */}
        <div className="rounded-2xl overflow-hidden border border-black/10 mb-3 aspect-[4/3] sm:aspect-[16/9]">
          <iframe
            title="Map of Ra by Mastercuts, Imperial Avenue, Downtown Dubai"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3610.439726790797!2d55.27167767538154!3d25.188389277716638!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x672b374be124f7d5%3A0xefae5da9eed44c44!2sImperial%20Avenue%2C%20Downtown%20Dubai!5e0!3m2!1sen!2sin!4v1778785289318!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>

        {/* Studio address — hyperlinked so users can open in their native Maps app */}
        <a
          href="https://maps.app.goo.gl/Fz9w2aCrn2VStaxi7"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-between bg-black/[0.03] hover:bg-black/[0.06] rounded-xl p-3 mb-6 transition-colors"
        >
          <div className="flex items-center gap-2 min-w-0">
            <MapPin className="w-4 h-4 text-text-secondary shrink-0" />
            <p className="text-sm text-text-primary truncate">
              Imperial Avenue, Downtown Dubai
            </p>
          </div>
          <span className="text-[11px] text-text-secondary group-hover:text-text-primary transition-colors shrink-0">
            Open in Maps →
          </span>
        </a>

        <div className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-wider text-text-secondary mb-2">
              House / flat number
            </label>
            <input
              {...register('flatVilla')}
              placeholder="e.g. 2401"
              autoFocus
              className="w-full bg-transparent border-b border-black/15 py-2.5 text-text-primary focus:border-text-primary outline-none transition-colors"
            />
            {errors.flatVilla && (
              <p className="text-xs text-red-600 mt-1">{errors.flatVilla.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-text-secondary mb-2">
              Landmark (optional)
            </label>
            <input
              {...register('landmark')}
              placeholder="Nearest landmark or directions"
              className="w-full bg-transparent border-b border-black/15 py-2.5 text-text-primary focus:border-text-primary outline-none transition-colors"
            />
          </div>
        </div>

        {/* Save as tags */}
        <div className="mt-6">
          <p className="text-xs uppercase tracking-wider text-text-secondary mb-3">
            Save as
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setLabel('home')}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-full text-xs border transition-colors',
                label === 'home'
                  ? 'border-bg-dark bg-bg-dark text-white'
                  : 'border-black/15 text-text-primary hover:bg-black/5'
              )}
            >
              <Home className="w-3.5 h-3.5" />
              Home
            </button>
            <button
              type="button"
              onClick={() => setLabel('other')}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-full text-xs border transition-colors',
                label === 'other'
                  ? 'border-bg-dark bg-bg-dark text-white'
                  : 'border-black/15 text-text-primary hover:bg-black/5'
              )}
            >
              <Building className="w-3.5 h-3.5" />
              Other
            </button>
          </div>
        </div>

        {/* Contact details row */}
        <div className="mt-6 border-t border-black/10 pt-5">
          <p className="text-xs uppercase tracking-wider text-text-secondary mb-3">
            Contact details
          </p>
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              {account?.name ? (
                <p className="text-sm text-text-primary">
                  {account.name}, {account.phone}
                </p>
              ) : (
                <p className="text-sm text-accent-gold">
                  Add your name
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={openContactEdit}
              className="flex items-center gap-1 text-[11px] text-text-secondary hover:text-text-primary transition-colors shrink-0"
            >
              <Pencil className="w-3 h-3" /> Edit
            </button>
          </div>
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="flex-shrink-0 border-t border-black/10 bg-bg-primary px-6 pt-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
        <button
          type="submit"
          disabled={!isValid || !account?.name}
          className={cn(
            'w-full rounded-full py-4 text-sm font-medium transition-colors',
            isValid && account?.name
              ? 'bg-bg-dark text-white hover:bg-bg-darker'
              : 'bg-black/10 text-text-muted cursor-not-allowed'
          )}
        >
          Save and proceed to slots
        </button>
      </div>
    </form>
  );
}
