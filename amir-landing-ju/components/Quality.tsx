
import React from 'react';

const Quality: React.FC = () => {
  return (
    <section className="py-24 md:py-48 border-y border-[#16382b]/10 bg-[#e0d7d3] relative z-10 ornate-pattern-bg" style={{ position: 'relative', zIndex: 10 }}>
      <div className="container mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-24">
          <div className="reveal stagger-1 glass-panel p-8 rounded-3xl shadow-angled group transition-all duration-700">
            <span className="gold-text text-[9px] uppercase tracking-[0.5em] mb-4 block gold-glow">01. Cut</span>
            <h4 className="text-2xl font-serif mb-4 group-hover-glow transition-all">ליטוש מושלם</h4>
            <p className="text-zinc-500 text-sm font-light leading-relaxed">
              כל יהלום נבחר בקפידה לפי רמת הליטוש הגבוהה ביותר (Excellent) כדי להבטיח נצנוץ מקסימלי בכל קרן אור.
            </p>
          </div>
          
          <div className="reveal stagger-2 glass-panel p-8 rounded-3xl shadow-angled group transition-all duration-700">
            <span className="gold-text text-[9px] uppercase tracking-[0.5em] mb-4 block gold-glow">02. Clarity</span>
            <h4 className="text-2xl font-serif mb-4 group-hover-glow transition-all">ניקיון נדיר</h4>
            <p className="text-zinc-500 text-sm font-light leading-relaxed">
              אנחנו מתמחים ביהלומים בדרגת ניקיון גבוהה, ללא פגמים הנראים לעין, לשקיפות מושלמת ומראה צלול.
            </p>
          </div>
          
          <div className="reveal stagger-3 glass-panel p-8 rounded-3xl shadow-angled group transition-all duration-700">
            <span className="gold-text text-[9px] uppercase tracking-[0.5em] mb-4 block gold-glow">03. Craft</span>
            <h4 className="text-2xl font-serif mb-4 group-hover-glow transition-all">אומנות ידנית</h4>
            <p className="text-zinc-500 text-sm font-light leading-relaxed">
              כל שיבוץ נעשה תחת מיקרוסקופ בסטודיו שלנו, בטכניקות מסורתיות המבטיחות עמידות לשנים רבות.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Quality;
