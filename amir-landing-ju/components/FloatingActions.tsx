
import React, { memo } from 'react';
import { MessageCircle, Phone } from 'lucide-react';

const FloatingActions = memo(function FloatingActions() {
  return (
    <div className="fixed bottom-8 left-6 md:bottom-12 md:left-12 z-[60] flex flex-col gap-4 md:gap-6">
      <a 
        href="tel:+972535627244" 
        className="w-10 h-10 md:w-12 md:h-12 bg-[#16382b] text-[#e0d7d3] rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-soft-xl group relative"
      >
        <Phone size={16} className="md:w-[18px]" />
        <span className="absolute right-full mr-4 opacity-0 group-hover:opacity-100 transition-opacity bg-[#16382b] text-[#e0d7d3] text-[9px] uppercase tracking-[0.4em] px-3 py-1 pointer-events-none whitespace-nowrap hidden md:block">Call</span>
      </a>

      <a 
        href="https://wa.me/972535627244" 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-10 h-10 md:w-12 md:h-12 glass-panel text-[#16382b] rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-soft-xl group relative border border-[#16382b]/20"
      >
        <MessageCircle size={16} className="md:w-[18px]" />
        <span className="absolute right-full mr-4 opacity-0 group-hover:opacity-100 transition-opacity bg-[#16382b] text-[#e0d7d3] text-[9px] uppercase tracking-[0.4em] px-3 py-1 pointer-events-none whitespace-nowrap hidden md:block">WhatsApp</span>
      </a>
    </div>
  );
});

export default FloatingActions;
