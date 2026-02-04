
import React, { memo } from 'react';

const Hero = memo(function Hero() {
  return (
    <section 
      className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[#e0d7d3] overflow-x-hidden overflow-y-visible" 
      style={{ 
        zIndex: 10, 
        position: 'relative', 
        backgroundColor: '#e0d7d3', 
        width: '100vw', 
        maxWidth: '100%',
        left: 0, 
        right: 0,
        margin: 0,
        padding: 0
      }}
    >
      {/* Solid background overlay to ensure consistent color - extends full width */}
      <div 
        className="absolute inset-0 bg-[#e0d7d3] -z-10" 
        style={{ 
          width: '100vw', 
          left: '50%', 
          transform: 'translateX(-50%)',
          minHeight: '100vh'
        }}
      ></div>

      <div className="container mx-auto px-8 relative z-0 md:z-10 text-center">
        <div className="reveal stagger-1">
          {/* Full Logo */}
          <div className="mb-0 md:mb-2 lg:mb-4 flex justify-center">
            <div className="w-full max-w-md md:max-w-xl lg:max-w-2xl xl:max-w-3xl 2xl:max-w-4xl flex items-center justify-center overflow-hidden">
              <img 
                src="/images/logo.png" 
                alt="AVIVI Custom Made Jewelry" 
                className="w-full h-auto object-contain"
                style={{ transform: 'scale(1.15)' }}
                loading="eager"
                decoding="async"
                onError={(e) => {
                  // Hide logo if image not found - user can add it later
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          </div>
        </div>
        
        <div className="reveal stagger-4 flex flex-col sm:flex-row items-center justify-center gap-8 md:gap-12 -mt-8 md:-mt-12 lg:-mt-16 xl:-mt-20 relative z-10 md:z-20">
          <a 
            href="#collection" 
            className="group relative px-12 md:px-16 py-5 md:py-6 bg-[#16382b] text-[#e0d7d3] text-[10px] font-bold uppercase tracking-[0.4em] overflow-hidden rounded-full transition-all hover:scale-105 active:scale-95 w-auto max-w-[280px] sm:max-w-none button-glow"
          >
            <span className="relative z-10">Discover Now</span>
          </a>
          <a 
            href="#contact" 
            className="text-[#4a5c52] text-[10px] uppercase tracking-[0.4em] font-medium hover:text-[#16382b] transition-colors py-4"
          >
            Private Appointment
          </a>
        </div>
      </div>

      {/* Hero Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 reveal stagger-4 opacity-30">
        <div className="w-px h-16 md:h-24 bg-gradient-to-b from-transparent to-[#16382b]/30"></div>
      </div>
    </section>
  );
});

export default Hero;
