import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Compass, User } from 'lucide-react';
import { useCart } from '@/components/cart/CartProvider';
import { cn } from '@/lib/utils';

type TabId = 'home' | 'explore' | 'profile';

const tabs: { id: TabId; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'explore', label: 'Explore', icon: Compass },
  { id: 'profile', label: 'Profile', icon: User },
];

export function BottomNav() {
  const { openProfile, openExplorePicker, surface } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isExplorePage = location.pathname.startsWith('/explore');
  const [activeTab, setActiveTab] = useState<TabId>('home');

  useEffect(() => {
    if (isExplorePage) {
      setActiveTab('explore');
      return;
    }
    setActiveTab('home');
  }, [isHome, isExplorePage, location.pathname]);

  const onTabClick = (id: TabId) => {
    if (id === 'profile') {
      openProfile();
      return;
    }
    if (id === 'home') {
      if (isHome) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        navigate('/');
      }
      return;
    }
    if (id === 'explore') {
      openExplorePicker();
    }
  };

  // Hide when a surface is open so the drawer/checkout owns the bottom area
  const hidden = surface !== 'none';

  return (
    <motion.nav
      aria-label="Main navigation"
      initial={false}
      animate={{ y: hidden ? 80 : 0, opacity: hidden ? 0 : 1 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-bg-dark/95 backdrop-blur-md border-t border-white/10"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="relative flex items-stretch justify-between px-2 h-16">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <li key={tab.id} className="flex-1 flex">
              <button
                type="button"
                onClick={() => onTabClick(tab.id)}
                className="group w-full flex flex-col items-center justify-center gap-1 relative"
                aria-current={isActive ? 'page' : undefined}
              >
                <span
                  className={cn(
                    'absolute top-0 h-0.5 w-6 rounded-full transition-colors',
                    isActive ? 'bg-white' : 'bg-transparent'
                  )}
                />
                <Icon
                  className={cn(
                    'w-5 h-5 transition-colors',
                    isActive ? 'text-white' : 'text-white/50 group-hover:text-white/80'
                  )}
                />
                <span
                  className={cn(
                    'text-[9px] uppercase tracking-[0.15em] transition-colors',
                    isActive ? 'text-white' : 'text-white/50 group-hover:text-white/80'
                  )}
                >
                  {tab.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </motion.nav>
  );
}
