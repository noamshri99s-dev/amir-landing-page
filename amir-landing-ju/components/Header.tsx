
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // Close menu when location changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  const NavLink: React.FC<{ to: string; children: React.ReactNode; isActive?: boolean; mobile?: boolean }> = ({ to, children, isActive, mobile }) => {
    return (
      <Link 
        to={to}
          className={`
          relative px-4 py-2 text-[10px] uppercase tracking-[0.4em] font-light
          transition-all duration-300 ease-out
          ${isActive 
            ? 'text-[#16382b]' 
            : 'text-[#16382b] hover:text-[#1f4a3a]'
          }
          hover:scale-105 active:scale-95
          group
          ${mobile ? 'text-lg tracking-[0.6em] py-4 w-full text-center' : ''}
        `}
        onClick={() => setIsMenuOpen(false)}
      >
        <span className="relative z-10">{children}</span>
        {!mobile && (
          <>
            {/* Background on hover */}
            <span className={`
              absolute inset-0 rounded-lg
              transition-all duration-300 ease-out
              ${isActive 
                ? 'bg-[#16382b]/10' 
                : 'bg-[#16382b]/0 group-hover:bg-[#16382b]/10'
              }
            `} />
            {/* Underline - always visible, thicker on hover/active */}
            <span className={`
              absolute bottom-0 left-0 right-0
              transition-all duration-300 ease-out
              ${isActive 
                ? 'bg-[#16382b] h-[2px]' 
                : 'bg-[#4a5c52]/30 group-hover:bg-[#16382b] h-[1px] group-hover:h-[2px]'
              }
            `} />
          </>
        )}
      </Link>
    );
  };

  const NavAnchor: React.FC<{ href: string; to?: string; children: React.ReactNode; mobile?: boolean }> = ({ href, to, children, mobile }) => {
    const handleClick = (e: React.MouseEvent) => {
      setIsMenuOpen(false);
      if (!isHomePage && to) {
        // Let React Router handle navigation to the home page first
        return;
      }
      if (href.startsWith('#')) {
        e.preventDefault();
        const element = document.querySelector(href);
        if (element) {
          const headerHeight = 120; // Updated to account for top bar (40px) + main header (80px)
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    };

    if (!isHomePage && to) {
      return (
        <Link 
          to={to}
          className={`
            relative px-4 py-2 text-[10px] uppercase tracking-[0.4em] font-light
            text-[#16382b] hover:text-[#1f4a3a]
            transition-all duration-300 ease-out
            hover:scale-105 active:scale-95
            group
            ${mobile ? 'text-lg tracking-[0.6em] py-4 w-full text-center' : ''}
          `}
          onClick={() => setIsMenuOpen(false)}
        >
          <span className="relative z-10">{children}</span>
          {!mobile && (
            <>
              <span className="absolute inset-0 rounded-lg bg-[#16382b]/0 group-hover:bg-[#16382b]/10 transition-all duration-300 ease-out" />
              <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#4a5c52]/30 group-hover:bg-[#16382b] group-hover:h-[2px] transition-all duration-300 ease-out" />
            </>
          )}
        </Link>
      );
    }

    return (
      <a 
        href={href}
        className={`
          relative px-4 py-2 text-[10px] uppercase tracking-[0.4em] font-light
          text-[#16382b] hover:text-[#1f4a3a]
          transition-all duration-300 ease-out
          hover:scale-105 active:scale-95
          group
          ${mobile ? 'text-lg tracking-[0.6em] py-4 w-full text-center' : ''}
        `}
        onClick={handleClick}
      >
        <span className="relative z-10">{children}</span>
        {!mobile && (
          <>
            {/* Background on hover */}
            <span className="
              absolute inset-0 rounded-lg bg-[#16382b]/0 group-hover:bg-[#16382b]/10
              transition-all duration-300 ease-out
            " />
            {/* Underline - always visible, thicker on hover */}
            <span className="
              absolute bottom-0 left-0 right-0 h-[1px]
              bg-[#4a5c52]/30 group-hover:bg-[#16382b] group-hover:h-[2px]
              transition-all duration-300 ease-out
            " />
          </>
        )}
      </a>
    );
  };

  return (
    <>
      {/* Top Bar - Business Blessing */}
      <div className="fixed top-0 w-full z-[101] bg-[#16382b]/95 backdrop-blur-sm border-b border-[#16382b]/20">
        <div className="container mx-auto px-6 md:px-12 py-2 flex justify-center items-center">
          <p className="text-xs md:text-sm text-[#e0d7d3]/90 tracking-[0.3em] font-light text-center">
            עסק זה נבנה בחסדי השם
          </p>
        </div>
      </div>
      
      <header className={`fixed top-[36px] md:top-[40px] w-full z-[100] transition-all duration-500 ${isMenuOpen ? 'bg-[#e0d7d3]' : 'bg-[#e0d7d3]/90 backdrop-blur-md border-b border-[#16382b]/10 shadow-2xl'}`}>
        <div className="container mx-auto px-6 md:px-12 py-5 md:py-7 flex justify-between items-center relative z-[110]">
        <div className="flex items-center gap-2">
          <Link 
            to="/" 
            className="text-2xl md:text-3xl font-serif tracking-[0.25em] text-[#16382b] hover:text-[#1f4a3a] transition-all duration-500 hover:scale-105 active:scale-95"
            onClick={() => setIsMenuOpen(false)}
          >
            AVIVI
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex gap-4 items-center text-[10px] uppercase tracking-[0.4em] font-light">
          <NavLink to="/" isActive={location.pathname === '/'}>בית</NavLink>
          <NavAnchor href="#collection" to="/#collection">קולקציה</NavAnchor>
          <NavAnchor href="#personalized" to="/#personalized">עיצוב אישי</NavAnchor>
          <NavAnchor href="#contact" to="/#contact">יצירת קשר</NavAnchor>
          <div className="w-px h-4 bg-[#16382b]/20 mx-2" />
          <NavLink to="/rings" isActive={location.pathname === '/rings'}>טבעות</NavLink>
          <NavLink to="/bracelets" isActive={location.pathname === '/bracelets'}>צמידים</NavLink>
          <NavLink to="/earrings" isActive={location.pathname === '/earrings'}>עגילים</NavLink>
          <NavLink to="/necklaces" isActive={location.pathname === '/necklaces'}>שרשראות</NavLink>
          <NavLink to="/size-guide" isActive={location.pathname === '/size-guide'}>מדריך מידות</NavLink>
        </nav>

        <div className="flex items-center gap-6">
          <Link 
            to={isHomePage ? "#contact" : "/#contact"} 
            className="
              hidden sm:flex items-center gap-2
              relative px-6 py-2.5 text-[9px] uppercase tracking-[0.4em] font-medium 
              text-[#16382b] border border-[#16382b]/30 rounded-full
              transition-all duration-500 ease-out
              hover:bg-[#16382b] hover:text-[#e0d7d3] hover:border-[#16382b]
              hover:scale-105 active:scale-95
              group
            "
          >
            <span className="relative z-10">Private Appointment</span>
          </Link>

          {/* Mobile Menu Button - Stylish & Minimalist */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden relative z-[120] flex flex-col justify-center items-center w-10 h-10 gap-1.5 focus:outline-none group"
            aria-label="תפריט"
          >
            <span className={`w-6 h-0.5 bg-[#16382b] transition-all duration-500 ease-in-out ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-[#16382b] transition-all duration-500 ease-in-out ${isMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-[#16382b] transition-all duration-500 ease-in-out ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Overlay - Fully Opaque & Modern */}
      <div className={`
        fixed inset-0 bg-[#e0d7d3] z-[105] transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1)
        ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}
      `}>
        <nav className="flex flex-col items-center justify-center h-full px-10 pt-20">
          <div className={`w-full max-w-sm flex flex-col items-center space-y-8 transition-all duration-700 delay-300 ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex flex-col items-center space-y-2 mb-4">
              <span className="text-[10px] uppercase tracking-[0.8em] text-[#4a5c52]">Explore Collection</span>
              <div className="h-px w-12 bg-[#16382b]/40" />
            </div>

            <div className="flex flex-col items-center w-full space-y-2">
              <NavLink to="/" isActive={location.pathname === '/'} mobile>בית</NavLink>
              <NavAnchor href="#collection" to="/#collection" mobile>קולקציה</NavAnchor>
              <NavAnchor href="#personalized" to="/#personalized" mobile>עיצוב אישי</NavAnchor>
              <NavAnchor href="#contact" to="/#contact" mobile>יצירת קשר</NavAnchor>
            </div>
            
            <div className="h-px bg-[#16382b]/20 w-24 my-4" />
            
            <div className="flex flex-col items-center w-full space-y-2">
              <NavLink to="/rings" isActive={location.pathname === '/rings'} mobile>טבעות</NavLink>
              <NavLink to="/bracelets" isActive={location.pathname === '/bracelets'} mobile>צמידים</NavLink>
              <NavLink to="/earrings" isActive={location.pathname === '/earrings'} mobile>עגילים</NavLink>
              <NavLink to="/necklaces" isActive={location.pathname === '/necklaces'} mobile>שרשראות</NavLink>
              <NavLink to="/size-guide" isActive={location.pathname === '/size-guide'} mobile>מדריך מידות</NavLink>
            </div>

            <div className="pt-8 flex flex-col items-center">
              <Link 
                to={isHomePage ? "#contact" : "/#contact"}
                className="px-12 py-5 bg-[#16382b] text-[#e0d7d3] text-[10px] uppercase tracking-[0.5em] font-bold rounded-full hover:scale-105 transition-all duration-300 active:scale-95"
                onClick={() => setIsMenuOpen(false)}
              >
                Private Appointment
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </header>
    </>

  );
};

export default Header;
