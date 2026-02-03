
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Collection from './components/Collection';
import FloatingActions from './components/FloatingActions';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import LoadingScreen from './components/LoadingScreen';

// Lazy load heavy components
const BirthdayPopup = lazy(() => import('./components/BirthdayPopup'));
const LeadForm = lazy(() => import('./components/LeadForm'));
const Proof = lazy(() => import('./components/Proof'));
const Quality = lazy(() => import('./components/Quality'));
const PersonalizedProduct = lazy(() => import('./components/PersonalizedProduct'));

// Lazy load pages - they will only load when navigated to
const RingsPage = lazy(() => import('./pages/RingsPage'));
const BraceletsPage = lazy(() => import('./pages/BraceletsPage'));
const EarringsPage = lazy(() => import('./pages/EarringsPage'));
const NecklacesPage = lazy(() => import('./pages/NecklacesPage'));
const SizeGuidePage = lazy(() => import('./pages/SizeGuidePage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));

// Loading skeleton component
const PageSkeleton: React.FC = () => (
  <div className="min-h-screen bg-[#e0d7d3] pt-32 animate-pulse">
    <div className="container mx-auto px-8">
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-24 h-3 bg-[#E8E0D5] rounded mb-8"></div>
        <div className="w-64 h-16 bg-[#E8E0D5] rounded mb-4"></div>
        <div className="w-48 h-4 bg-[#E8E0D5] rounded"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-24 py-20">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-4">
            <div className="aspect-[4/5] bg-[#E8E0D5] rounded"></div>
            <div className="w-3/4 h-6 bg-[#E8E0D5] rounded"></div>
            <div className="w-1/2 h-4 bg-[#E8E0D5] rounded"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Section skeleton for lazy-loaded sections
const SectionSkeleton: React.FC = () => (
  <div className="py-20 animate-pulse">
    <div className="container mx-auto px-8">
      <div className="max-w-2xl mx-auto text-center space-y-4">
        <div className="w-32 h-3 bg-[#E8E0D5] rounded mx-auto"></div>
        <div className="w-64 h-8 bg-[#E8E0D5] rounded mx-auto"></div>
        <div className="w-full h-24 bg-[#E8E0D5] rounded mt-8"></div>
      </div>
    </div>
  </div>
);

// Import the shared hook
import { usePageEffects } from './hooks/usePageEffects';

const HomePage: React.FC = () => {
  // Use the optimized shared hook for parallax and reveal effects
  usePageEffects();

  return (
    <>
      <Header />
      
      <main className="relative w-full" style={{ width: '100%', margin: 0, padding: 0 }}>
        {/* Living background layers */}
        <div className="bg-motion" aria-hidden="true">
          <div className="bg-layer bg-gradient"></div>
          <div className="bg-layer bg-beams"></div>
          <div className="bg-layer bg-grid"></div>
          <div className="bg-layer bg-particles"></div>
          <div className="bg-layer bg-orbs"></div>
          <div className="bg-shapes">
            <div className="shape shape-1"><div className="shape-inner"></div></div>
            <div className="shape shape-2"><div className="shape-inner"></div></div>
            <div className="shape shape-3"><div className="shape-inner"></div></div>
          </div>
        </div>

        {/* Background Vertical Guide Lines */}
        <div className="fixed inset-0 pointer-events-none flex justify-between px-8 opacity-[0.03] z-0">
          <div className="w-px h-full bg-[#16382b]"></div>
          <div className="w-px h-full bg-[#16382b] hidden md:block"></div>
          <div className="w-px h-full bg-[#16382b] hidden md:block"></div>
          <div className="w-px h-full bg-[#16382b]"></div>
        </div>

        <Hero />
        
        {/* Transitional Editorial Block - Reduced padding on mobile */}
        <section className="py-16 md:py-24 bg-[#e0d7d3] relative z-10 separation-border ornate-pattern-bg">
          <div className="container mx-auto px-8 text-center reveal">
             <p className="text-[9px] uppercase tracking-[0.8em] text-[#4a5c52] mb-4">The Philosophy</p>
             <h3 className="text-lg md:text-2xl font-light text-[#16382b] max-w-2xl mx-auto leading-relaxed px-4">
               אנחנו לא רק מעצבים תכשיטים. אנחנו יוצרים סיפורים שנשמרים לנצח, תוך הקפדה על הסטנדרטים הגבוהים ביותר בעולם הגמולוגיה.
             </h3>
          </div>
        </section>

        <section id="collection" className="py-20 md:py-48 bg-[#e0d7d3] overflow-hidden relative z-10 ornate-pattern-bg">
          <div className="container mx-auto px-8">
            <div className="max-w-3xl mb-16 md:mb-32 reveal flex items-end gap-12">
              <div>
                <span className="text-[10px] uppercase tracking-[0.6em] text-[#4a5c52] mb-6 block font-medium gold-glow">Atelier Excellence</span>
                <h2 className="text-5xl md:text-8xl font-serif leading-none hero-title-glow text-[#16382b]">
                  קולקציית <br />
                  <span className="italic text-[#4a5c52]">2025</span>
                </h2>
              </div>
              <div className="hidden lg:block pb-4">
                <p className="text-[10px] uppercase tracking-[0.4em] text-[#4a5c52] leading-loose max-w-[200px]">
                  Selection of high-grade natural diamonds, set in handcrafted 18K gold.
                </p>
              </div>
            </div>
            <Collection />
          </div>
        </section>

        <Suspense fallback={<SectionSkeleton />}>
          <PersonalizedProduct />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <Quality />
        </Suspense>

        <section className="py-20 md:py-48 bg-[#e0d7d3] relative z-10 ornate-pattern-bg">
          <div className="container mx-auto px-8">
            <Suspense fallback={<SectionSkeleton />}>
              <Proof />
            </Suspense>
          </div>
        </section>

        <section id="contact" className="py-20 md:py-48 bg-[#e0d7d3] relative z-10 separation-border ornate-pattern-bg">
          <div className="container mx-auto px-8">
            <Suspense fallback={<SectionSkeleton />}>
              <LeadForm />
            </Suspense>
          </div>
        </section>
      </main>

      <Footer />
      <FloatingActions />
    </>
  );
};

const App: React.FC = () => {
  console.log('🎨 App component rendering...');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Only show popup after loading is complete
    if (!isLoading) {
      const timer = setTimeout(() => {
        setIsPopupOpen(true);
      }, 3000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [isLoading]);

  return (
    <Router>
      {/* Loading Screen with door-opening effect */}
      <LoadingScreen 
        onLoadingComplete={() => setIsLoading(false)}
        minLoadingTime={2500}
      />
      
      <div className="min-h-screen w-full bg-[#e0d7d3] text-[#16382b] selection:bg-[#16382b] selection:text-[#e0d7d3]" style={{ width: '100%', margin: 0, padding: 0 }}>
        <ScrollToTop />
        
        {/* Lazy load popup only when needed */}
        {isPopupOpen && (
          <Suspense fallback={null}>
            <BirthdayPopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
          </Suspense>
        )}
        
        <Suspense fallback={<PageSkeleton />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/rings" element={<RingsPage />} />
            <Route path="/bracelets" element={<BraceletsPage />} />
            <Route path="/earrings" element={<EarringsPage />} />
            <Route path="/necklaces" element={<NecklacesPage />} />
            <Route path="/size-guide" element={<SizeGuidePage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
};

export default App;
