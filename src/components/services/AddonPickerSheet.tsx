import { useEffect, useMemo, useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { useCart, formatAed, formatDuration } from '@/components/cart/CartProvider';
import { getService, getAddOnsForService } from '@/lib/booking/catalog';
import { pickServiceImage } from '@/lib/booking/types';
import { useAudience } from '@/components/services/useAudience';
import { cn } from '@/lib/utils';

// Compact bottom sheet shown from a service's quick-add "Add" button when the
// service has add-ons. Lets the guest pick a duration (if the service has
// variants) and toggle add-ons before adding everything to the cart in one go.
export function AddonPickerSheet() {
  const { surface, addonPickerServiceId, closeAddonPicker, addToCart } = useCart();
  const [audience] = useAudience();

  const open = surface === 'addon-picker' && !!addonPickerServiceId;

  const service = useMemo(
    () => (addonPickerServiceId ? getService(addonPickerServiceId) : undefined),
    [addonPickerServiceId]
  );
  const addOns = useMemo(
    () => (addonPickerServiceId ? getAddOnsForService(addonPickerServiceId) : []),
    [addonPickerServiceId]
  );

  const variants = service?.variants ?? [];
  const hasVariants = variants.length > 1;
  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(
    variants[0]?.id
  );
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>([]);

  // Reset selections each time the sheet opens for a (new) service.
  useEffect(() => {
    setSelectedVariantId(service?.variants?.[0]?.id);
    setSelectedAddOnIds([]);
  }, [addonPickerServiceId, service]);

  if (!service) return null;

  const selectedVariant =
    variants.find((v) => v.id === selectedVariantId) ?? variants[0] ?? null;
  const basePrice = selectedVariant?.price ?? service.price;
  const baseDuration = selectedVariant?.durationMin ?? service.durationMin;

  const chosenAddOns = addOns.filter((a) => selectedAddOnIds.includes(a.id));
  const addOnTotal = chosenAddOns.reduce((s, a) => s + a.price, 0);

  const toggleAddOn = (id: string) =>
    setSelectedAddOnIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const handleAdd = () => {
    const ok = addToCart(service.id, 'any', selectedVariantId, selectedAddOnIds);
    if (ok) closeAddonPicker();
  };

  return (
    <Sheet open={open} onOpenChange={(v) => (v ? null : closeAddonPicker())}>
      <SheetContent
        side="bottom"
        hideDefaultClose
        className="bg-bg-primary text-text-primary border-none p-0 flex flex-col max-h-[90vh] rounded-t-3xl overflow-hidden"
      >
        <SheetTitle className="sr-only">Add {service.name}</SheetTitle>
        {/* Grabber handle */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 w-10 h-1 rounded-full bg-black/25" />
        <button
          type="button"
          onClick={closeAddonPicker}
          aria-label="Close"
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/5 text-text-primary flex items-center justify-center hover:bg-black/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="overflow-y-auto px-6 pt-8 pb-6">
          {/* Header */}
          <div className="flex gap-4 mb-6">
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-circle-light shrink-0">
              <img
                src={pickServiceImage(service, audience)}
                alt={service.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <h2 className="font-serif text-2xl text-text-primary leading-tight">
                {service.name}
              </h2>
              <p className="text-sm text-text-secondary mt-1">
                {formatAed(basePrice)} · {formatDuration(baseDuration)}
              </p>
            </div>
          </div>

          {/* Duration pills */}
          {hasVariants && (
            <div className="mb-6">
              <p className="text-[10px] uppercase tracking-[0.2em] text-text-muted mb-3">
                Choose duration
              </p>
              <div className="flex flex-wrap gap-2">
                {variants.map((v) => {
                  const isActive = v.id === selectedVariantId;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVariantId(v.id)}
                      className={cn(
                        'flex flex-col items-center px-4 py-3 rounded-xl border transition-all min-w-[5rem]',
                        isActive
                          ? 'bg-bg-dark text-white border-bg-dark'
                          : 'bg-transparent text-text-primary/80 border-black/15 hover:border-black/40 hover:text-text-primary'
                      )}
                    >
                      <span className="text-sm font-medium">{v.durationMin} min</span>
                      <span
                        className={cn(
                          'text-[10px] uppercase tracking-[0.16em] mt-1',
                          isActive ? 'text-white/60' : 'text-text-secondary'
                        )}
                      >
                        {formatAed(v.price)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Add-on checklist */}
          {addOns.length > 0 && (
            <div className="mb-2">
              <p className="text-[10px] uppercase tracking-[0.2em] text-text-muted mb-3">
                Enhance your ritual
              </p>
              <div className="space-y-2">
                {addOns.map((a) => (
                  <label
                    key={a.id}
                    className="flex items-center gap-3 cursor-pointer rounded-xl border border-black/10 p-2.5 hover:border-black/25 transition-colors"
                  >
                    <Checkbox
                      checked={selectedAddOnIds.includes(a.id)}
                      onCheckedChange={() => toggleAddOn(a.id)}
                    />
                    <img
                      src={pickServiceImage(a, audience)}
                      alt=""
                      className="w-11 h-11 rounded-lg object-cover shrink-0"
                    />
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm text-text-primary leading-tight">
                        {a.name}
                      </span>
                      <span className="block text-[11px] text-text-secondary">
                        {formatDuration(a.durationMin)} · +{formatAed(a.price)}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sticky footer CTA */}
        <div className="border-t border-black/10 bg-bg-primary px-6 py-4">
          <button
            type="button"
            onClick={handleAdd}
            className="group w-full rounded-full py-4 text-sm font-medium flex items-center justify-center gap-2 bg-bg-dark text-white hover:bg-bg-dark/90 transition-colors"
          >
            Add to cart · {formatAed(basePrice + addOnTotal)}
            <Plus className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" />
          </button>
          {chosenAddOns.length > 0 && (
            <p className="mt-2 text-[11px] text-text-secondary text-center">
              Includes {chosenAddOns.length} add-on{chosenAddOns.length > 1 ? 's' : ''} · +{formatAed(addOnTotal)}
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
