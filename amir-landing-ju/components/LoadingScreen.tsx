import React, { useState, useEffect } from 'react';

interface LoadingScreenProps {
  onLoadingComplete?: () => void;
  minLoadingTime?: number;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  onLoadingComplete,
  minLoadingTime = 2500 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isOpening, setIsOpening] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    // Wait for minimum loading time, then start opening animation
    const loadingTimer = setTimeout(() => {
      setIsOpening(true);
      
      // After opening animation completes, hide completely
      const hideTimer = setTimeout(() => {
        setIsHidden(true);
        setIsLoading(false);
        onLoadingComplete?.();
      }, 1200); // Duration of opening animation

      return () => clearTimeout(hideTimer);
    }, minLoadingTime);

    return () => clearTimeout(loadingTimer);
  }, [minLoadingTime, onLoadingComplete]);

  if (isHidden) return null;

  return (
    <div 
      className={`loading-screen-container ${isOpening ? 'opening' : ''}`}
      aria-hidden={!isLoading}
    >
      {/* Left Door */}
      <div className="loading-door loading-door-left">
        <div className="loading-door-inner">
          {/* Logo on left door - will slide left */}
          <div className="loading-logo-half loading-logo-left">
            <img 
              src="/images/loading-logo.png" 
              alt="" 
              className="loading-logo-img"
            />
          </div>
        </div>
      </div>

      {/* Right Door */}
      <div className="loading-door loading-door-right">
        <div className="loading-door-inner">
          {/* Logo on right door - will slide right */}
          <div className="loading-logo-half loading-logo-right">
            <img 
              src="/images/loading-logo.png" 
              alt="" 
              className="loading-logo-img"
            />
          </div>
        </div>
      </div>

      {/* Center Logo - visible during loading, fades on open */}
      <div className={`loading-center-logo ${isOpening ? 'fade-out' : ''}`}>
        <img 
          src="/images/loading-logo.png" 
          alt="Loading..." 
          className="loading-main-logo"
        />
        {/* Subtle loading indicator */}
        <div className="loading-indicator">
          <div className="loading-dot"></div>
          <div className="loading-dot"></div>
          <div className="loading-dot"></div>
        </div>
      </div>

      <style>{`
        .loading-screen-container {
          position: fixed;
          inset: 0;
          z-index: 9999;
          pointer-events: all;
        }

        .loading-door {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 50%;
          background: #16382b;
          overflow: hidden;
          transition: transform 1.2s cubic-bezier(0.76, 0, 0.24, 1);
        }

        .loading-door-left {
          left: 0;
          transform-origin: left center;
        }

        .loading-door-right {
          right: 0;
          transform-origin: right center;
        }

        .loading-screen-container.opening .loading-door-left {
          transform: translateX(-100%);
        }

        .loading-screen-container.opening .loading-door-right {
          transform: translateX(100%);
        }

        .loading-door-inner {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .loading-logo-half {
          position: absolute;
          width: 200%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
        }

        .loading-logo-left {
          left: 0;
        }

        .loading-logo-right {
          right: 0;
        }

        .loading-logo-img {
          width: 120px;
          height: auto;
          opacity: 0.1;
        }

        .loading-center-logo {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 32px;
          z-index: 10;
          transition: opacity 0.4s ease-out;
        }

        .loading-center-logo.fade-out {
          opacity: 0;
        }

        .loading-main-logo {
          width: 160px;
          height: auto;
          animation: logoPulse 2s ease-in-out infinite;
        }

        @media (min-width: 768px) {
          .loading-main-logo {
            width: 220px;
          }
        }

        @keyframes logoPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.8;
          }
        }

        .loading-indicator {
          display: flex;
          gap: 8px;
        }

        .loading-dot {
          width: 6px;
          height: 6px;
          background: rgba(224, 215, 211, 0.6);
          border-radius: 50%;
          animation: dotPulse 1.4s ease-in-out infinite;
        }

        .loading-dot:nth-child(2) {
          animation-delay: 0.2s;
        }

        .loading-dot:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes dotPulse {
          0%, 80%, 100% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          40% {
            transform: scale(1.2);
            opacity: 1;
          }
        }

        /* Add subtle gradient overlay on doors */
        .loading-door::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(22, 56, 43, 0) 0%,
            rgba(22, 56, 43, 0.3) 50%,
            rgba(22, 56, 43, 0) 100%
          );
          pointer-events: none;
        }

        /* Decorative pattern on doors */
        .loading-door::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(
            circle at center,
            rgba(224, 215, 211, 0.03) 1px,
            transparent 1px
          );
          background-size: 24px 24px;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
