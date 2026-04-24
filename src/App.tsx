import { Toaster } from 'sonner';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/layout/Navigation';
import { HomePage } from './pages/HomePage';
import { JourneyPage } from './pages/JourneyPage';
import { ExplorePage } from './pages/ExplorePage';
import { CartProvider } from './components/cart/CartProvider';
import { CartDrawer } from './components/cart/CartDrawer';
import { CartStrip } from './components/cart/CartStrip';
import { ProfileDrawer } from './components/layout/ProfileDrawer';
import { AudiencePickerSheet } from './components/layout/AudiencePickerSheet';
import { BottomNav } from './components/layout/BottomNav';
import { ServiceDetailSheet } from './components/services/ServiceDetailSheet';

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <div className="min-h-screen pb-16 lg:pb-0">
          <Navigation />

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/journeys/:id" element={<JourneyPage />} />
          </Routes>

          {/* Global surfaces */}
          <CartDrawer />
          <ProfileDrawer />
          <AudiencePickerSheet />
          <ServiceDetailSheet />
          <CartStrip />
          <BottomNav />

          <Toaster
            position="top-center"
            visibleToasts={1}
            toastOptions={{
              unstyled: true,
              classNames: {
                toast:
                  'flex items-center gap-2 mx-auto bg-bg-dark text-white rounded-full px-5 py-3 text-[13px] shadow-lg shadow-black/20',
                title: 'font-normal',
                icon: 'opacity-70',
              },
            }}
          />
        </div>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
