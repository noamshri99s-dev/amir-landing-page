import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FloatingActions from '../components/FloatingActions';
import ProductCatalog from '../components/ProductCatalog';
import { usePageEffects } from '../hooks/usePageEffects';

const BraceletsPage: React.FC = () => {
  usePageEffects();

  return (
    <div className="min-h-screen bg-[#e0d7d3] text-[#16382b] selection:bg-[#16382b] selection:text-[#e0d7d3]">
      <Header />
      
      <main className="relative pt-32">
        {/* Living background layers */}
        <div className="bg-motion" aria-hidden="true">
          <div className="bg-layer bg-gradient"></div>
          <div className="bg-layer bg-beams"></div>
          <div className="bg-layer bg-grid"></div>
          <div className="bg-layer bg-particles"></div>
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

        {/* Hero Section */}
        <section className="relative min-h-[40vh] md:min-h-[50vh] flex flex-col items-center justify-center bg-[#e0d7d3] overflow-hidden">
          <div className="container mx-auto px-6 md:px-8 relative z-10 text-center">
            <div className="reveal stagger-1">
              <span className="text-[10px] uppercase tracking-[0.7em] text-[#16382b] mb-6 md:mb-8 block font-medium gold-glow">Elegant Bracelets</span>
            </div>
            
            <div className="reveal stagger-2">
              <h1 className="text-5xl md:text-8xl font-serif leading-[0.9] mb-6 md:mb-8 hero-title-glow text-[#16382b]">
                צמידים
              </h1>
            </div>

            <div className="reveal stagger-3 max-w-xl mx-auto">
              <p className="text-[#4a5c52] text-sm md:text-lg font-light leading-relaxed px-4 md:px-0">
                צמידים יוקרתיים בעיצובים קלאסיים ומודרניים, מושלמים להשלמת המראה האלגנטי
              </p>
            </div>
          </div>
        </section>

        {/* Catalog Section */}
        <section className="py-8 md:py-16 bg-[#e0d7d3] overflow-hidden relative z-10">
          <div className="container mx-auto px-4 md:px-8">
            <ProductCatalog 
              category="bracelets" 
              productLabel="צמיד"
            />
          </div>
        </section>

        {/* CTA Section */}
        <section id="contact" className="py-16 md:py-32 bg-[#e0d7d3] relative z-10 separation-border">
          <div className="container mx-auto px-6 md:px-8">
            <div className="max-w-2xl mx-auto text-center reveal">
              <h2 className="text-3xl md:text-5xl font-serif mb-4 md:mb-6 hero-title-glow text-[#16382b]">
                מחפש משהו מיוחד?
              </h2>
              <p className="text-[#4a5c52] text-sm md:text-lg font-light leading-relaxed mb-6 md:mb-8">
                אנחנו ניצור עבורך צמיד ייחודי בהתאמה אישית מלאה
              </p>
              <a
                href="/#contact"
                className="inline-block px-10 md:px-16 py-4 md:py-6 bg-[#16382b] text-[#e0d7d3] text-[10px] font-bold uppercase tracking-[0.4em] overflow-hidden rounded-full transition-all hover:scale-105 active:scale-95 button-glow"
              >
                צור קשר
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <FloatingActions />
    </div>
  );
};

export default BraceletsPage;
