import { useState } from 'react';
import { ChevronDown, User as UserIcon, X, Sparkles } from 'lucide-react';
import type { CartItem } from '@/lib/booking/types';
import { useCart, formatAed, formatDuration } from './CartProvider';
import { getTherapistsForRitual, getTherapist, getService } from '@/lib/booking/catalog';
import { GuestPickerSheet } from './GuestPickerSheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Props {
  item: CartItem;
}

export function CartItemRow({ item }: Props) {
  const {
    removeItem,
    updateTherapistPref,
    openServiceDetail,
    getGuestForItem,
    account,
  } = useCart();
  const isJourney = !!item.journeyId;
  const [guestPickerOpen, setGuestPickerOpen] = useState(false);
  const assignedGuest = getGuestForItem(item);

  if (isJourney) {
    const constituentServices = (item.journeyServiceIds ?? [])
      .map(getService)
      .filter(Boolean);
    return (
      <div className="flex gap-4 py-5 border-b border-black/10">
        <div className="w-20 h-24 flex-shrink-0 overflow-hidden bg-circle-light relative">
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          <span className="absolute bottom-1 left-1 w-5 h-5 rounded-full bg-bg-dark text-white flex items-center justify-center">
            <Sparkles className="w-2.5 h-2.5" />
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.18em] text-text-secondary mb-1">
                Curated journey · {constituentServices.length} services
              </p>
              <h3 className="font-serif text-lg leading-tight text-text-primary">
                {item.name}
              </h3>
              <p className="text-xs text-text-secondary mt-1">
                {formatDuration(item.durationMin)} · {formatAed(item.price)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => removeItem(item.id)}
              aria-label={`Remove ${item.name}`}
              className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-text-secondary hover:bg-black/10 hover:text-text-primary transition-colors flex-shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {constituentServices.length > 0 && (
            <ul className="mt-3 space-y-1 border-l border-black/10 pl-3">
              {constituentServices.map((svc) =>
                svc ? (
                  <li key={svc.id} className="text-[11px] text-text-secondary truncate">
                    · {svc.name}
                  </li>
                ) : null
              )}
            </ul>
          )}
        </div>
      </div>
    );
  }

  const eligibleTherapists = getTherapistsForRitual(item.ritualId);
  const currentTherapist = item.therapistPref !== 'any' ? getTherapist(item.therapistPref) : null;

  return (
    <div className="flex gap-4 py-5 border-b border-black/10">
      <button
        type="button"
        onClick={() => openServiceDetail(item.serviceId, item.ritualId)}
        className="w-20 h-24 flex-shrink-0 overflow-hidden bg-circle-light"
        aria-label={`View details for ${item.name}`}
      >
        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <button
            type="button"
            onClick={() => openServiceDetail(item.serviceId, item.ritualId)}
            className="min-w-0 text-left"
          >
            <h3 className="font-serif text-lg leading-tight text-text-primary truncate">
              {item.name}
            </h3>
            {item.variantLabel && (
              <p className="text-[10px] uppercase tracking-[0.18em] text-text-secondary mt-1">
                {item.variantLabel}
              </p>
            )}
            <p className="text-xs text-text-secondary mt-1">
              {formatDuration(item.durationMin)} · {formatAed(item.price)}
            </p>
          </button>
          <button
            type="button"
            onClick={() => removeItem(item.id)}
            aria-label={`Remove ${item.name}`}
            className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-text-secondary hover:bg-black/10 hover:text-text-primary transition-colors flex-shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="mt-3 space-y-2">
          <Select
            value={item.therapistPref}
            onValueChange={(v) => updateTherapistPref(item.id, v)}
          >
            <SelectTrigger className="h-9 w-full border-black/15 bg-transparent text-xs text-text-primary rounded-full px-4 [&>svg]:opacity-50">
              <SelectValue>
                <span className="flex items-center gap-2">
                  <span className="text-text-secondary">Therapist:</span>
                  <span>{currentTherapist ? currentTherapist.name : 'Any available'}</span>
                </span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any available (recommended)</SelectItem>
              {eligibleTherapists.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name} — {s.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Guest picker — only meaningful once an account exists (then a
              "self" profile is auto-created). Hidden pre-login. */}
          {account && (
            <button
              type="button"
              onClick={() => setGuestPickerOpen(true)}
              aria-label="Choose who this service is for"
              className="h-9 w-full flex items-center gap-2 rounded-full border border-black/15 bg-transparent px-4 text-xs text-text-primary hover:bg-black/[0.03] transition-colors"
            >
              <UserIcon className="w-3.5 h-3.5 text-text-secondary shrink-0" />
              <span className="text-text-secondary">For:</span>
              <span className="flex-1 text-left truncate">
                {assignedGuest?.name ?? 'You'}
                {assignedGuest?.isSelf && (
                  <span className="text-text-secondary"> (you)</span>
                )}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-text-secondary shrink-0" />
            </button>
          )}
        </div>
      </div>

      <GuestPickerSheet
        open={guestPickerOpen}
        onClose={() => setGuestPickerOpen(false)}
        itemId={item.id}
      />
    </div>
  );
}
