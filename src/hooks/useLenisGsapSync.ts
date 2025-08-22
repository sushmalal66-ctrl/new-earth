import { useEffect, useRef } from 'react';
import { useMotionValue } from 'framer-motion';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

export const useLenisGsapSync = () => {
  const lenisRef = useRef<Lenis | null>(null);
  const scrollProgress = useMotionValue(0);
  const earthProgress = useMotionValue(0);
  const timelineProgress = useMotionValue(0);
  const rafId = useRef<number>();

  useEffect(() => {
    // Initialize Lenis with optimized settings
    const lenis = new Lenis({
      lerp: 0.1,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      smoothTouch: false,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      normalizeWheel: true,
      autoResize: true
    });

    lenisRef.current = lenis;

    // Configure ScrollTrigger to work with Lenis
    lenis.on('scroll', ScrollTrigger.update);
    
    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value) {
        if (arguments.length) {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis.animatedScroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight
        };
      },
      pinType: document.documentElement.style.transform ? 'transform' : 'fixed'
    });

    // Set ScrollTrigger defaults with enhanced settings for horizontal scroll
    ScrollTrigger.defaults({ 
      scroller: document.documentElement
    });

    // Sync Lenis with GSAP ticker for perfect synchronization
    gsap.ticker.add((time) => {
      lenis.raf(time);
    });
    
    gsap.ticker.lagSmoothing(0);

    // Update ScrollTrigger on Lenis scroll
    lenis.on('scroll', ({ scroll, limit, velocity, direction, progress }) => {
      // Update motion values
      scrollProgress.set(progress);
      
      // Calculate earth-specific progress (0-1 across all sections)
      const earthProgressValue = Math.min(1, Math.max(0, progress));
      earthProgress.set(earthProgressValue);
      
      // Update timeline progress for horizontal scroll synchronization
      timelineProgress.set(progress);
      
      // Dispatch custom events for component communication
      window.dispatchEvent(new CustomEvent('scroll-progress', { 
        detail: { 
          progress, 
          scroll, 
          velocity, 
          direction 
        } 
      }));
    });

    // Initial refresh
    ScrollTrigger.refresh();

    // Cleanup function
    return () => {
      gsap.ticker.remove((time) => {
        lenis.raf(time * 1000);
      });
      lenis.off('scroll');
      lenis.destroy();
      ScrollTrigger.killAll();
    };
  }, [scrollProgress, earthProgress, timelineProgress]);

  // Expose scroll methods
  const scrollTo = (target: string | number, options?: any) => {
    lenisRef.current?.scrollTo(target, options);
  };

  const scrollToTop = () => {
    lenisRef.current?.scrollTo(0, { duration: 2 });
  };

  // Method to scroll to specific timeline position
  const scrollToTimelinePosition = (progress: number) => {
    if (lenisRef.current) {
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const targetScroll = maxScroll * progress;
      lenisRef.current.scrollTo(targetScroll, { duration: 1.5 });
    }
  };

  return {
    scrollProgress,
    earthProgress,
    timelineProgress,
    scrollTo,
    scrollToTop,
    scrollToTimelinePosition,
    lenis: lenisRef.current
  };
};