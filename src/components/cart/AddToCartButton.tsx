import { useState } from 'react';
import { Plus, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from './CartProvider';
import { getService } from '@/lib/booking/catalog';
import { cn } from '@/lib/utils';

interface Props {
  serviceId: string;
  variantId?: string;
  label?: string;
  variant?: 'pill' | 'icon' | 'ghost';
  tone?: 'dark' | 'light';
  className?: string;
}

export function AddToCartButton({
  serviceId,
  variantId,
  label = 'Add to Cart',
  variant = 'pill',
  tone = 'dark',
  className,
}: Props) {
  const { addToCart, removeItem, cart } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const cartItem = cart.items.find((i) => i.serviceId === serviceId);
  const inCart = !!cartItem;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCart && cartItem) {
      removeItem(cartItem.id);
      const svc = getService(serviceId);
      toast.info(`${svc?.name ?? 'Service'} removed`);
      return;
    }
    const ok = addToCart(serviceId, 'any', variantId);
    if (ok) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1200);
    }
  };

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-label={inCart ? 'Remove from cart' : 'Add to cart'}
        className={cn(
          'group/add w-10 h-10 rounded-full flex items-center justify-center transition-all relative',
          tone === 'dark'
            ? inCart
              ? 'bg-white text-bg-dark border border-white hover:bg-white/80'
              : 'border border-white/20 bg-white/5 text-white hover:bg-white hover:text-bg-dark'
            : inCart
              ? 'bg-bg-dark text-white border border-bg-dark hover:bg-bg-dark/80'
              : 'border border-black/15 bg-transparent text-text-primary hover:bg-bg-dark hover:text-white hover:border-bg-dark',
          className
        )}
      >
        {inCart ? (
          <>
            <Check className="w-4 h-4 transition-opacity duration-150 group-hover/add:opacity-0" />
            <X className="w-4 h-4 absolute opacity-0 transition-opacity duration-150 group-hover/add:opacity-100" />
          </>
        ) : (
          <Plus
            className={cn(
              'w-4 h-4 transition-transform duration-200',
              justAdded ? 'rotate-45' : 'group-hover/add:rotate-90'
            )}
          />
        )}
      </button>
    );
  }

  if (variant === 'ghost') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={cn(
          'group/add inline-flex items-center gap-2 text-sm transition-colors',
          inCart ? 'text-white/70 hover:text-white' : 'text-white/80 hover:text-white',
          className
        )}
      >
        {inCart ? (
          <>
            <Check className="w-4 h-4 group-hover/add:hidden" />
            <X className="w-4 h-4 hidden group-hover/add:inline" />
            <span className="group-hover/add:hidden">In cart</span>
            <span className="hidden group-hover/add:inline">Remove</span>
          </>
        ) : (
          <>
            {label}
            <Plus className="w-4 h-4 transition-transform duration-200 group-hover/add:rotate-90" />
          </>
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'group/add inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition-all',
        inCart
          ? 'bg-white/10 text-white hover:bg-white/20'
          : 'bg-white text-text-primary hover:bg-white/90',
        className
      )}
    >
      {inCart ? (
        <>
          <Check className="w-4 h-4 group-hover/add:hidden" />
          <X className="w-4 h-4 hidden group-hover/add:inline" />
          <span className="group-hover/add:hidden">In cart</span>
          <span className="hidden group-hover/add:inline">Remove</span>
        </>
      ) : justAdded ? (
        <>
          <Check className="w-4 h-4" /> Added
        </>
      ) : (
        <>
          {label}
          <Plus className="w-4 h-4 transition-transform duration-200 group-hover/add:rotate-90" />
        </>
      )}
    </button>
  );
}
