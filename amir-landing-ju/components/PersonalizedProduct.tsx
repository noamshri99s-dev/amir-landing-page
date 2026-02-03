import React, { useState, useEffect, useRef } from 'react';
import { Phone, Palette, Hammer, Truck } from 'lucide-react';

const steps = [
  {
    id: 1,
    title: 'שיחת אפיון עם הלקוח',
    description: 'התאמה אישית ודיון מעמיק על החלומות והציפיות שלך',
    icon: Phone,
    color: 'from-emerald-500/20 to-emerald-600/20',
    iconColor: 'text-emerald-600'
  },
  {
    id: 2,
    title: 'הכנת העיצוב',
    description: 'יצירת סקיצות ומודלים תלת-ממדיים עד לדיוק המושלם',
    icon: Palette,
    color: 'from-emerald-500/20 to-emerald-600/20',
    iconColor: 'text-emerald-600'
  },
  {
    id: 3,
    title: 'ביצוע הכנה של הטבעת',
    description: 'עבודת אמנות מדויקת עם חומרים בעלי איכות הגבוהה ביותר',
    icon: Hammer,
    color: 'from-emerald-500/20 to-emerald-600/20',
    iconColor: 'text-emerald-600'
  },
  {
    id: 4,
    title: 'שליחת הטבעת ללקוח',
    description: 'אריזה יוקרתית ומשלוח בטוח עד אליך',
    icon: Truck,
    color: 'from-emerald-500/20 to-emerald-600/20',
    iconColor: 'text-emerald-600'
  }
];

const PersonalizedProduct: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let rafId: number | null = null;
    let isActive = false;

    const updateProgress = () => {
      if (!sectionRef.current || !isActive) {
        rafId = null;
        return;
      }

      const sectionRect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate scroll progress through the section (0 to 1)
      const sectionStart = windowHeight * 0.6;
      const sectionEnd = -windowHeight * 0.2;
      const sectionRange = sectionStart - sectionEnd;
      
      if (sectionRange <= 0) {
        rafId = null;
        return;
      }
      
      // Current position: distance from section start
      const currentPos = sectionRect.top - sectionStart;
      
      // Calculate progress (0 = start, 1 = end, >1 = all done)
      const progress = Math.max(0, Math.min(1, -currentPos / sectionRange));
      
      setScrollProgress(progress);
      rafId = null;
    };

    const handleScroll = () => {
      if (!rafId && isActive) {
        rafId = window.requestAnimationFrame(updateProgress);
      }
    };

    const handleResize = () => {
      if (!rafId && isActive) {
        rafId = window.requestAnimationFrame(updateProgress);
      }
    };

    // Use IntersectionObserver to trigger when section is in view
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isActive = true;
            if (!rafId) {
              rafId = window.requestAnimationFrame(updateProgress);
            }
            window.addEventListener('scroll', handleScroll, { passive: true });
            window.addEventListener('resize', handleResize, { passive: true });
          } else {
            isActive = false;
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
            // Reset when section is out of view
            if (entry.boundingClientRect.top > window.innerHeight) {
              setScrollProgress(0);
            } else {
              setScrollProgress(1);
            }
            if (rafId) {
              window.cancelAnimationFrame(rafId);
              rafId = null;
            }
          }
        });
      },
      { threshold: 0, rootMargin: '0px 0px 0px 0px' }
    );

    if (sectionRef.current) {
      sectionObserver.observe(sectionRef.current);
    }

    return () => {
      isActive = false;
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
      if (sectionRef.current) {
        sectionObserver.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="personalized" 
      className="py-20 md:py-48 bg-[#e0d7d3] relative z-10 separation-border ornate-pattern-bg"
      style={{ overflow: 'visible' }}
    >
      <div className="container mx-auto px-8" style={{ position: 'relative', zIndex: 1 }}>
        <div className="max-w-6xl mx-auto" style={{ position: 'relative' }}>
          {/* Header */}
          <div className="text-center mb-16 md:mb-24 reveal">
            <span className="text-[10px] uppercase tracking-[0.6em] text-[#4a5c52] mb-6 block font-medium gold-glow">
              Bespoke Creation
            </span>
            <h2 className="text-5xl md:text-8xl font-serif leading-none hero-title-glow mb-6 text-[#16382b]">
              עיצוב <br />
              <span className="italic text-[#4a5c52]">אישי</span>
            </h2>
            <p className="text-[#4a5c52] font-light text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
              כל תכשיט שאנו יוצרים הוא יצירת אמנות ייחודית. תהליך מלא ליווי אישי משלב הראשון עד המסירה.
            </p>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 relative" style={{ overflow: 'visible', zIndex: 1 }}>
            {steps.map((step, index) => {
              const Icon = step.icon;
              // Each step activates progressively based on scroll progress
              // Step 1 starts at 0%, Step 2 at 25%, Step 3 at 50%, Step 4 at 75%
              const stepStart = index * 0.25;
              const stepEnd = (index + 1) * 0.25;
              // Individual step progress (0 to 1)
              const stepProgress = Math.max(0, Math.min(1, (scrollProgress - stepStart) / (stepEnd - stepStart)));
              // Overall activation for this step
              const isActive = scrollProgress >= stepStart;
              const isFullyActive = scrollProgress >= stepEnd;
              const isCompleted = scrollProgress > stepEnd;

              return (
                <div
                  key={step.id}
                  ref={(el) => {
                    stepRefs.current[index] = el;
                  }}
                  className="relative glass-panel rounded-[24px] p-8 md:p-10 reveal"
                  style={{ 
                    transitionDelay: `${index * 0.05}s`,
                  }}
                >
                  {/* Step Number Badge */}
                  <div 
                    className="absolute -top-4 -right-4 w-12 h-12 bg-[#e0d7d3] border-2 rounded-full flex items-center justify-center font-serif text-xl transition-all duration-500"
                    style={{
                      borderColor: isActive 
                        ? `rgba(61, 40, 23, ${0.3 + stepProgress * 0.5})` 
                        : 'rgba(61, 40, 23, 0.2)',
                      transform: `scale(${isActive ? 0.95 + stepProgress * 0.15 : 1})`
                    }}
                  >
                    <span 
                      style={{ 
                        color: isActive 
                          ? `rgba(61, 40, 23, ${0.5 + stepProgress * 0.5})` 
                          : 'rgba(107, 91, 79, 0.5)',
                        transition: 'color 0.5s ease-out'
                      }}
                    >
                      {step.id}
                    </span>
                  </div>

                  {/* Animated Progress Line - connects to next step */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -translate-y-1/2 left-full w-8 h-0.5 bg-[#16382b]/20 overflow-hidden z-0">
                      <div
                        className="h-full bg-[#16382b] transition-all duration-500 ease-out"
                        style={{ 
                          width: `${isCompleted ? 100 : Math.max(0, (scrollProgress - stepEnd) / 0.25) * 100}%`
                        }}
                      />
                    </div>
                  )}

                  {/* Icon */}
                  <div 
                    className={`mb-6 w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center transition-all duration-500 ease-out ${
                      step.color
                    }`}
                    style={{
                      transform: `scale(${0.7 + stepProgress * 0.3})`,
                      opacity: 0.3 + stepProgress * 0.7,
                      filter: `brightness(${0.5 + stepProgress * 0.7})`,
                      willChange: 'transform, opacity, filter'
                    }}
                  >
                    <Icon 
                      className={`w-8 h-8 transition-all duration-500 ease-out ${step.iconColor}`}
                      style={{
                        transform: `scale(${0.7 + stepProgress * 0.3})`,
                        opacity: 0.5 + stepProgress * 0.5
                      }}
                    />
                  </div>

                  {/* Content */}
                  <h3 
                    className="text-2xl md:text-3xl font-serif mb-4 transition-colors duration-500"
                    style={{
                      color: isActive 
                        ? `rgba(61, 40, 23, ${0.4 + stepProgress * 0.6})` 
                        : 'rgba(107, 91, 79, 0.5)'
                    }}
                  >
                    {step.title}
                  </h3>
                  <p 
                    className="text-sm md:text-base font-light leading-relaxed transition-colors duration-500"
                    style={{
                      color: isActive 
                        ? `rgba(107, 91, 79, ${0.4 + stepProgress * 0.6})` 
                        : 'rgba(107, 91, 79, 0.5)'
                    }}
                  >
                    {step.description}
                  </p>

                  {/* Active Indicator - only show when fully active */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#16382b] to-transparent transition-all duration-500"
                    style={{
                      opacity: isFullyActive ? 1 : 0,
                      transform: `scaleX(${isFullyActive ? 1 : 0})`
                    }}
                  >
                    <div className="h-full w-1/3 bg-[#16382b] animate-pulse" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA Button */}
          <div className="text-center mt-16 md:mt-24 reveal">
            <a
              href="#contact"
              className="inline-block px-16 md:px-24 py-6 md:py-8 bg-[#16382b] text-[#e0d7d3] text-sm md:text-base font-bold uppercase tracking-[0.4em] overflow-hidden rounded-full transition-all hover:scale-105 active:scale-95 button-glow"
            >
              התחל תהליך אישי
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PersonalizedProduct;

