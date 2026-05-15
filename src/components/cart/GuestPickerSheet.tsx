import { useEffect, useState } from 'react';
import { Check, Plus, Trash2, User as UserIcon, Users, X } from 'lucide-react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useCart } from './CartProvider';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface GuestPickerSheetProps {
  open: boolean;
  onClose: () => void;
  itemId: string | null;
}

type Mode = 'list' | 'add';

function PickerBody({ itemId, onClose }: { itemId: string | null; onClose: () => void }) {
  const {
    cart,
    guestProfiles,
    addGuestProfile,
    removeGuestProfile,
    setItemGuest,
  } = useCart();

  const currentItem = itemId ? cart.items.find((i) => i.id === itemId) : null;
  const selectedGuestId = currentItem?.forGuestId ?? 'self';

  const [mode, setMode] = useState<Mode>('list');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setMode('list');
    setName('');
    setPhone('');
    setError('');
  }, [itemId]);

  const handleSelect = (guestId: string) => {
    if (!itemId) return;
    setItemGuest(itemId, guestId);
    onClose();
  };

  const handleAdd = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Please enter a name');
      return;
    }
    const id = addGuestProfile({ name: trimmed, phone: phone.trim() || undefined });
    if (itemId) setItemGuest(itemId, id);
    onClose();
  };

  return (
    <div className="px-6 pt-7 pb-8 max-h-[88vh] overflow-y-auto">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close guest picker"
        className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/5 flex items-center justify-center text-text-primary hover:bg-black/10 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>

      <p className="text-[10px] uppercase tracking-[0.22em] text-text-secondary mb-2">
        Booking for
      </p>
      <DialogTitle asChild>
        <h2 className="font-serif text-3xl text-text-primary leading-[1.05] mb-6">
          {mode === 'add' ? (
            <>Add a <span className="italic">guest</span></>
          ) : (
            <>Choose a <span className="italic">guest</span></>
          )}
        </h2>
      </DialogTitle>

      {mode === 'list' ? (
        <>
          <div className="space-y-2.5">
            {guestProfiles.length === 0 ? (
              <p className="text-sm text-text-secondary py-4">
                No guest profiles yet. Add one below.
              </p>
            ) : (
              guestProfiles.map((g) => {
                const isSelected = g.id === selectedGuestId;
                return (
                  <div key={g.id} className="flex items-stretch gap-2">
                    <button
                      type="button"
                      onClick={() => handleSelect(g.id)}
                      aria-pressed={isSelected}
                      className={cn(
                        'flex-1 flex items-center gap-4 px-5 py-4 rounded-2xl border text-left transition-colors',
                        isSelected
                          ? 'border-bg-dark bg-bg-primary'
                          : 'border-black/10 hover:border-black/30 bg-bg-primary',
                      )}
                    >
                      <span className="shrink-0 w-11 h-11 rounded-full bg-circle-light flex items-center justify-center text-accent-gold">
                        <UserIcon className="w-5 h-5" strokeWidth={1.5} />
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="flex items-baseline gap-2">
                          <span className="font-serif text-lg text-text-primary leading-tight truncate">
                            {g.name}
                          </span>
                          {g.isSelf && (
                            <span className="shrink-0 text-[10px] uppercase tracking-[0.18em] text-accent-gold">
                              You
                            </span>
                          )}
                        </span>
                        {g.phone && (
                          <span className="block text-xs text-text-secondary mt-0.5 truncate">
                            {g.phone}
                          </span>
                        )}
                      </span>
                      {isSelected && (
                        <span className="shrink-0 w-7 h-7 rounded-full bg-bg-dark text-white flex items-center justify-center">
                          <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                        </span>
                      )}
                    </button>
                    {!g.isSelf && (
                      <button
                        type="button"
                        onClick={() => removeGuestProfile(g.id)}
                        aria-label={`Remove ${g.name}`}
                        className="shrink-0 self-center w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-text-secondary hover:bg-black/10 hover:text-text-primary transition-colors"
                      >
                        <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>

          <button
            type="button"
            onClick={() => setMode('add')}
            className="mt-4 w-full flex items-center gap-3 px-5 py-4 rounded-2xl border border-dashed border-black/20 hover:border-black/40 transition-colors text-left"
          >
            <span className="shrink-0 w-11 h-11 rounded-full bg-black/5 flex items-center justify-center text-text-primary">
              <Plus className="w-5 h-5" strokeWidth={1.5} />
            </span>
            <span className="flex-1">
              <span className="block font-serif text-lg text-text-primary leading-tight">
                Add a new guest
              </span>
              <span className="block text-xs text-text-secondary mt-0.5">
                Save name and phone for next time.
              </span>
            </span>
          </button>

          <p className="mt-6 text-[11px] text-text-secondary text-center leading-relaxed">
            Pick who this service is for. Guests are saved on this device.
          </p>
        </>
      ) : (
        <div className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-wider text-text-secondary mb-2">
              Full name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              placeholder="e.g. Maya Khan"
              autoFocus
              className="w-full bg-transparent border-b border-black/15 py-2.5 text-text-primary focus:border-text-primary outline-none transition-colors"
            />
            {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-text-secondary mb-2">
              Phone (optional)
            </label>
            <input
              type="tel"
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+971 …"
              className="w-full bg-transparent border-b border-black/15 py-2.5 text-text-primary focus:border-text-primary outline-none transition-colors"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setMode('list')}
              className="flex-1 rounded-full border border-black/15 py-3.5 text-sm font-medium text-text-primary hover:bg-black/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAdd}
              disabled={!name.trim()}
              className={cn(
                'flex-1 rounded-full py-3.5 text-sm font-medium transition-colors',
                name.trim()
                  ? 'bg-bg-dark text-white hover:bg-bg-darker'
                  : 'bg-black/10 text-text-muted cursor-not-allowed',
              )}
            >
              Save guest
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function GuestPickerSheet({ open, onClose, itemId }: GuestPickerSheetProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={(v) => (v ? null : onClose())}>
        <SheetContent
          side="bottom"
          hideDefaultClose
          className="bg-bg-primary border-none p-0 w-full max-w-full rounded-t-3xl h-auto max-h-[88vh] z-[90]"
        >
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-black/20" />
          <PickerBody itemId={itemId} onClose={onClose} />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? null : onClose())}>
      <DialogContent
        showCloseButton={false}
        className="bg-bg-primary border-none p-0 sm:max-w-md w-[calc(100%-2rem)] overflow-hidden rounded-2xl shadow-2xl z-[90]"
      >
        <PickerBody itemId={itemId} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
}

// Re-export for use by ProfileDrawer's read-only guest list, etc.
export { Users };
