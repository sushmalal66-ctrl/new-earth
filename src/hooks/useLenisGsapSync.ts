import { useEffect, useRef } from 'react';
import { useMotionValue } from 'framer-motion';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

export const useLenisGsapSync = () => {
  const lenisRef = useRef<Lenis | null>(null);
  const scrollProgress = useMotionValue(0);
  const earthProgress = useMotionValue(0);
  const timelineProgress = useMotionValue(0);

  useEffect(() => {
    // Initialize Lenis with optimized settings for GSAP integration
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
      autoResize: true,
      normalizeWheel: true,
      syncTouch: false, // Changed to false for better performance
      lerp: 0.1,
      wheelMultiplier: 1,
      touchInertiaMultiplier: 35
    });

    lenisRef.current = lenis;

    // Configure ScrollTrigger to work with Lenis
    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        return arguments.length 
          ? lenis.scrollTo(value, { immediate: true })
          : lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight
        };
      },
      pinType: document.body.style.transform ? 'transform' : 'fixed'
    });

    // Set ScrollTrigger defaults
    ScrollTrigger.defaults({ 
      scroller: document.body
    });

    // Configure ScrollTrigger for better performance
    ScrollTrigger.config({
      autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
      limitCallbacks: true,
      ignoreMobileResize: true
    });

    // CRITICAL: Use GSAP ticker instead of requestAnimationFrame
    const update = (time: number) => {
      lenis.raf(time * 1000); // Convert to milliseconds
    };

    gsap.ticker.add(update);

    // Update ScrollTrigger and motion values on Lenis scroll
    lenis.on('scroll', ({ scroll, limit, velocity, direction, progress }) => {
      ScrollTrigger.update();
      
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

    // Refresh ScrollTrigger after Lenis is ready
    ScrollTrigger.addEventListener('refresh', () => {
      lenis.resize();
    });
    
    // Initial refresh with proper timing
    const refreshTimeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    // Cleanup function
    return () => {
      clearTimeout(refreshTimeout);
      gsap.ticker.remove(update);
      lenis.off('scroll');
      lenis.destroy();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      ScrollTrigger.clearScrollMemory();
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