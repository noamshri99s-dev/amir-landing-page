import { useEffect, useRef } from 'react';

/**
 * Custom hook for page-level effects (reveal animations + parallax)
 * Optimized for performance with passive listeners and RAF throttling
 */
export function usePageEffects() {
  const rafRef = useRef<number>(0);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const mutationObserverRef = useRef<MutationObserver | null>(null);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    // Function to observe new reveal elements
    const observeRevealElements = () => {
      if (!observerRef.current) return;
      
      const elementsToReveal = document.querySelectorAll('.reveal:not(.active), .img-reveal:not(.active)');
      elementsToReveal.forEach((el) => {
        if (!observerRef.current) return;
        observerRef.current.observe(el);
      });
    };

    // Setup Intersection Observer for reveal animations
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            // Unobserve after revealing to reduce overhead
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      { 
        threshold: 0.1,
        rootMargin: '50px 0px' // Start animation slightly before element is visible
      }
    );

    // Observe elements initially
    observeRevealElements();

    // Use MutationObserver to watch for new elements added to DOM (for lazy-loaded components)
    mutationObserverRef.current = new MutationObserver(() => {
      observeRevealElements();
    });

    // Observe the entire document for added nodes
    mutationObserverRef.current.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Also check periodically for lazy-loaded components (fallback)
    const checkInterval = setInterval(() => {
      observeRevealElements();
    }, 500);

    // Parallax effect (only if user hasn't requested reduced motion)
    const updateParallax = () => {
      const y = window.scrollY || 0;
      document.documentElement.style.setProperty('--parallax-1', `${-y * 0.05}px`);
      document.documentElement.style.setProperty('--parallax-2', `${-y * 0.03}px`);
      document.documentElement.style.setProperty('--parallax-3', `${-y * 0.02}px`);
      rafRef.current = 0;
    };

    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(updateParallax);
    };

    if (!prefersReducedMotion) {
      updateParallax();
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    // Cleanup
    return () => {
      observerRef.current?.disconnect();
      mutationObserverRef.current?.disconnect();
      clearInterval(checkInterval);
      if (!prefersReducedMotion) {
        window.removeEventListener('scroll', onScroll);
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);
}

export default usePageEffects;

