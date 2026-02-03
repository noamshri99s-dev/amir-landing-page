
import React, { memo } from 'react';

const Proof = memo(function Proof() {
  return (
    <div className="max-w-6xl mx-auto relative">
      {/* Decorative Side Image Peek for this section */}
      <div className="absolute -right-40 top-0 w-64 h-96 opacity-10 hidden xl:block">
        <img 
          src="/images/proof-side.png" 
          className="w-full h-full object-cover rounded-l-full grayscale" 
          alt=""
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      </div>

      <div className="grid md:grid-cols-12 gap-12 items-center">
        <div className="md:col-span-8 reveal">
          <span className="text-[10px] uppercase tracking-[0.6em] text-[#16382b] mb-12 block">The Experience</span>
          <h3 className="text-4xl md:text-6xl font-serif leading-[1.2] mb-12 italic text-[#16382b]">
            ״כשחיפשתי את הטבעת המושלמת, לא חיפשתי רק תכשיט. חיפשתי רגש. ב-AVIVI מצאתי אומנות שמרגישה כאילו נוצרה עבורי בלבד.״
          </h3>
          <p className="text-sm uppercase tracking-[0.4em] text-[#4a5c52]">— אלעד לוי, לקוחות פרטיים</p>
        </div>
        
        <div className="md:col-span-4 flex flex-col gap-8 py-12 md:pr-12">
          <div className="reveal stagger-1 glass-panel p-6 rounded-2xl shadow-angled">
            <span className="text-3xl font-serif mb-2 block text-[#16382b]">30+</span>
            <span className="text-[9px] uppercase tracking-[0.4em] text-[#4a5c52] block mb-2">Years of Heritage</span>
            <p className="text-[11px] text-[#4a5c52] leading-relaxed italic">דורות של מומחיות ביהלומים.</p>
          </div>
          <div className="reveal stagger-2 glass-panel p-6 rounded-2xl shadow-angled">
            <span className="text-3xl font-serif mb-2 block text-[#16382b]">GIA</span>
            <span className="text-[9px] uppercase tracking-[0.4em] text-[#4a5c52] block mb-2">Certified Brilliance</span>
            <p className="text-[11px] text-[#4a5c52] leading-relaxed italic">כל אבן מלווה בתעודה בינלאומית.</p>
          </div>
          <div className="reveal stagger-3 glass-panel p-6 rounded-2xl shadow-angled">
            <span className="text-3xl font-serif mb-2 block text-[#16382b]">Handmade</span>
            <span className="text-[9px] uppercase tracking-[0.4em] text-[#4a5c52] block mb-2">Atelier Production</span>
            <p className="text-[11px] text-[#4a5c52] leading-relaxed italic">ייצור אישי תחת בקרה קפדנית.</p>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Proof;
