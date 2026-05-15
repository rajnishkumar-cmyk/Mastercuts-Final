import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { ExploreCategoriesSection } from '@/components/sections/ExploreCategoriesSection';
import { OffersSection } from '@/components/sections/OffersSection';
import { RaAtHomeSection } from '@/components/sections/RaAtHomeSection';
import { DrSaraMessageSection } from '@/components/sections/DrSaraMessageSection';
import { StatsTeamSection } from '@/components/sections/StatsTeamSection';
import { StatsSection } from '@/components/sections/StatsSection';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { CTASection } from '@/components/sections/CTASection';
import { Footer } from '@/components/layout/Footer';

export function HomePage() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: 'auto' });
      return;
    }
    const id = location.hash.replace('#', '');
    const t = window.setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
    return () => window.clearTimeout(t);
  }, [location.pathname, location.hash]);

  return (
    <>
      <main>
        <HeroSection />
        <ExploreCategoriesSection />
        <OffersSection />
        <RaAtHomeSection />
        <AboutSection />
        <DrSaraMessageSection />
        <StatsTeamSection />
        <StatsSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
