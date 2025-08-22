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
  const earthProgress = useMotionValue(1);
  const rafId = useRef<number>();

  useEffect(() => {
    // Initialize Lenis with optimized settings
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
      syncTouch: true
    });

    lenisRef.current = lenis;

    // Configure ScrollTrigger to work with Lenis
    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        return arguments.length 
          ? lenis.scrollTo(value, { immediate: true })
          : window.scrollY;
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
    ScrollTrigger.defaults({ scroller: document.body });

    // Sync Lenis with GSAP ticker for perfect synchronization
    const raf = (time: number) => {
      lenis.raf(time);
      rafId.current = requestAnimationFrame(raf);
    };
    rafId.current = requestAnimationFrame(raf);

    // Update ScrollTrigger on Lenis scroll
    lenis.on('scroll', ({ scroll, limit, velocity, direction, progress }) => {
      ScrollTrigger.update();
      
      // Update motion values
      scrollProgress.set(progress);
      
      // Calculate earth-specific progress (0-1 across all sections)
      const earthProgressValue = Math.min(1, Math.max(0, progress));
      earthProgress.set(earthProgressValue);
    });

    // Refresh ScrollTrigger after Lenis is ready
    ScrollTrigger.addEventListener('refresh', () => lenis.resize());
    ScrollTrigger.refresh();

    // Cleanup function
    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
      lenis.destroy();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [scrollProgress, earthProgress]);

  // Expose scroll methods
  const scrollTo = (target: string | number, options?: any) => {
    lenisRef.current?.scrollTo(target, options);
  };

  const scrollToTop = () => {
    lenisRef.current?.scrollTo(0, { duration: 2 });
  };

  return {
    scrollProgress,
    earthProgress,
    scrollTo,
    scrollToTop,
    lenis: lenisRef.current
  };
};