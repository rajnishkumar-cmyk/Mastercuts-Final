import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Pencil, Home, Building, Plus, Check } from 'lucide-react';
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
  // When set, the form is editing an existing saved address rather than
  // creating a new one. Reset to null on cancel/return-to-select.
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  // Tooltip-driven flag — when the user indicates they're booking from
  // somewhere other than Imperial Avenue Residences, surfaces a concierge
  // confirmation notice and tags the resulting booking with
  // requiresConfirmation: true.
  const [isOutsideImperialAvenue, setIsOutsideImperialAvenue] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      flatVilla: '',
      landmark: '',
    },
    mode: 'onChange',
  });

  const startEdit = (addr: ServiceAddress) => {
    setEditingAddressId(addr.id);
    setLabel(addr.label);
    setValue('flatVilla', addr.flatVilla, { shouldValidate: true });
    setValue('landmark', addr.landmark ?? '');
    setMode('new');
  };

  const onSubmitNew = handleSubmit((values) => {
    if (!account) return;

    if (editingAddressId) {
      // Update an existing saved address in place.
      const updatedAccount = {
        ...account,
        addresses: account.addresses.map((a) =>
          a.id === editingAddressId
            ? {
                ...a,
                flatVilla: values.flatVilla,
                landmark: values.landmark || undefined,
                label,
              }
            : a
        ),
      };
      saveLightAccount(updatedAccount);
      updateDraftCheckout({ addressId: editingAddressId });
      setEditingAddressId(null);
      setCheckoutStep('date-time');
      return;
    }

    const newAddress: ServiceAddress = {
      id: crypto.randomUUID(),
      flatVilla: values.flatVilla,
      landmark: values.landmark || undefined,
      label,
      displayAddress: isOutsideImperialAvenue
        ? 'Dubai (concierge confirmation)'
        : 'Imperial Avenue Residences, Downtown Dubai',
    };

    // Save address to account
    const updatedAccount = {
      ...account,
      addresses: [...account.addresses, newAddress],
    };
    saveLightAccount(updatedAccount);

    // Set as selected in draft, plus the outside-IA flag so the booking
    // record can be tagged with requiresConfirmation at submit time.
    updateDraftCheckout({
      addressId: newAddress.id,
      outsideImperialAvenue: isOutsideImperialAvenue,
    });
    setCheckoutStep('date-time');
  });

  const onSelectExisting = () => {
    if (!selectedAddressId) return;
    // Derive the outside-IA flag from the saved address's displayAddress
    // tag we set when it was created.
    const addr = savedAddresses.find((a) => a.id === selectedAddressId);
    const outside =
      !!addr && !addr.displayAddress.includes('Imperial Avenue Residences');
    updateDraftCheckout({
      addressId: selectedAddressId,
      outsideImperialAvenue: outside,
    });
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
            {savedAddresses.map((addr) => {
              const isSelected = selectedAddressId === addr.id;
              return (
                <div
                  key={addr.id}
                  className={cn(
                    'flex items-stretch gap-2 rounded-xl border transition-colors',
                    isSelected
                      ? 'border-bg-dark bg-bg-dark/5'
                      : 'border-black/10 hover:border-black/20'
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedAddressId(addr.id)}
                    aria-pressed={isSelected}
                    className="flex-1 flex items-center gap-3 p-4 text-left min-w-0"
                  >
                    <div
                      className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
                        isSelected
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
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-bg-dark flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => startEdit(addr)}
                    aria-label={`Edit ${addr.label} address`}
                    className="shrink-0 self-stretch px-3 flex items-center justify-center text-text-secondary hover:text-text-primary border-l border-black/10 hover:bg-black/[0.03] transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>
              );
            })}

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

  // Mode A: New / Edit address form
  const isEditing = !!editingAddressId;
  return (
    <form onSubmit={onSubmitNew} className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-4">
        <p className="text-[10px] uppercase tracking-[0.2em] text-text-secondary mb-3">
          {isEditing ? 'Edit address' : 'Service address'}
        </p>
        <h2 className="font-serif text-3xl text-text-primary leading-[1.05] mb-1">
          {isEditing ? (
            <>Update your <span className="italic">address</span></>
          ) : (
            <>Where should <span className="italic">we come?</span></>
          )}
        </h2>
        <p className="text-sm text-text-secondary mb-6">
          Our therapist will come to you at Imperial Avenue Residences.
        </p>

        {/* Studio map — for orientation. The therapist comes to the address
            entered below; this just shows where the Ra studio is located. */}
        <div className="rounded-2xl overflow-hidden border border-black/10 mb-6 aspect-[4/3] sm:aspect-[16/9]">
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

        <div className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-wider text-text-secondary mb-2">
              {isOutsideImperialAvenue ? (
                <>
                  Address{' '}
                  <span className="text-accent-gold normal-case tracking-normal">
                    (anywhere in Dubai)
                  </span>
                </>
              ) : (
                <>
                  Flat number{' '}
                  <span className="text-accent-gold normal-case tracking-normal">
                    (Imperial Avenue Residences)
                  </span>
                </>
              )}
            </label>
            <input
              {...register('flatVilla')}
              placeholder={
                isOutsideImperialAvenue
                  ? 'Building name, floor / flat, area'
                  : 'e.g. R05-1502'
              }
              autoFocus
              className="w-full bg-transparent border-b border-black/15 py-2.5 text-text-primary focus:border-text-primary outline-none transition-colors"
            />
            {!isOutsideImperialAvenue && (
              <p className="mt-2 text-[11px] text-text-secondary">
                Ra at Home is currently available exclusively at Imperial
                Avenue Residences.{' '}
                <button
                  type="button"
                  onClick={() => setIsOutsideImperialAvenue(true)}
                  className="text-text-primary underline hover:no-underline"
                >
                  Not staying there?
                </button>
              </p>
            )}
            {isOutsideImperialAvenue && (
              <div
                className="mt-3 rounded-xl border border-accent-gold/30 bg-accent-gold/5 px-4 py-3"
                aria-live="polite"
              >
                <p className="text-[11px] uppercase tracking-[0.18em] text-accent-gold mb-1.5">
                  A note from our concierge
                </p>
                <p className="text-xs text-text-primary leading-relaxed">
                  Beyond Imperial Avenue Residences during this transition,
                  our concierge will reach out personally to confirm your
                  booking and arrange your at-home experience.
                </p>
                <button
                  type="button"
                  onClick={() => setIsOutsideImperialAvenue(false)}
                  className="mt-2 text-[11px] text-text-secondary underline hover:no-underline"
                >
                  Actually, I'm at Imperial Avenue
                </button>
              </div>
            )}
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
          {isEditing ? 'Save changes and continue' : 'Save and proceed to slots'}
        </button>
      </div>
    </form>
  );
}
