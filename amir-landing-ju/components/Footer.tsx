
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-16 bg-[#e0d7d3] border-t border-[#16382b]/10 ornate-pattern-bg">
      <div className="container mx-auto px-4">
        <div className="flex justify-start mb-8">
          <p className="text-xs md:text-sm text-[#4a5c52] uppercase tracking-[0.3em] font-light">
            עסק זה נבנה בחסדי השם
          </p>
        </div>
        <div className="flex flex-col items-center mb-10">
           <svg width="40" height="30" viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#16382b] mb-4">
            <path d="M50 5L90 40L50 75L10 40L50 5Z" stroke="currentColor" strokeWidth="2" />
          </svg>
          <span className="text-2xl font-serif tracking-widest text-[#16382b]">AVIVI</span>
          <span className="text-xs uppercase tracking-[0.3em] text-[#4a5c52]">Diamond Jewelry</span>
        </div>
        
        <div className="flex gap-8 text-xs uppercase tracking-widest text-[#4a5c52] mb-10">
          <a href="#" className="hover:text-[#16382b] transition-colors">אינסטגרם</a>
          <a href="#" className="hover:text-[#16382b] transition-colors">פייסבוק</a>
          <a href="#" className="hover:text-[#16382b] transition-colors">טיקטוק</a>
        </div>
        
        <p className="text-[10px] text-[#4a5c52] uppercase tracking-widest">
          © {new Date().getFullYear()} Avivi Diamond Jewelry. כל הזכויות שמורות.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
