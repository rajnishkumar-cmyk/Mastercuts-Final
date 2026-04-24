import { ShoppingBag } from 'lucide-react';
import { useCart, useCartTotals } from './CartProvider';
import { cn } from '@/lib/utils';

interface Props {
  className?: string;
  tone?: 'light' | 'dark';
}

export function CartIcon({ className, tone = 'dark' }: Props) {
  const { openCart } = useCart();
  const { count } = useCartTotals();

  if (count === 0) return null;

  return (
    <button
      type="button"
      onClick={() => openCart()}
      aria-label={`Cart, ${count} ${count === 1 ? 'item' : 'items'}`}
      className={cn(
        'relative w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200',
        tone === 'dark'
          ? 'bg-black/10 text-text-primary hover:bg-black/15'
          : 'bg-white/20 text-white hover:bg-white/30',
        className
      )}
    >
      <ShoppingBag className="w-4 h-4" />
      <span
        className={cn(
          'absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-medium flex items-center justify-center',
          tone === 'dark' ? 'bg-text-primary text-white' : 'bg-white text-text-primary'
        )}
      >
        {count}
      </span>
    </button>
  );
}
