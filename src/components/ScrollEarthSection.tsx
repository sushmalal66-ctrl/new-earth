import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ReactLenis, useLenis } from '@studio-freight/react-lenis';
import ScrollEarth from './ScrollEarth';
import HistoryContent from './HistoryContent';
import CloudTransition from './CloudTransition';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const ScrollEarthSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const earthRef = useRef<any>(null);
  const rafIdRef = useRef<number | null>(null);
  const lastScrollTime = useRef<number>(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isInCloudTransition, setIsInCloudTransition] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const cloudOpacity = useTransform(scrollYProgress, [0.3, 0.5, 0.7, 0.9], [0, 0.3, 0.8, 1]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);

  // Throttled scroll progress handler with RAF
  const handleScrollProgress = useCallback((progress: number) => {
    const now = performance.now();
    if (now - lastScrollTime.current < 16) return; // Throttle to ~60fps
    
    lastScrollTime.current = now;
    
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }
    
    rafIdRef.current = requestAnimationFrame(() => {
      setScrollProgress(progress);
      
      // Cloud transition logic with proper bounds
      const shouldShowClouds = progress > 0.35 && progress < 0.75;
      if (shouldShowClouds !== isInCloudTransition) {
        setIsInCloudTransition(shouldShowClouds);
      }

      // Update Earth component with throttled updates
      if (earthRef.current?.updateScroll) {
        earthRef.current.updateScroll(progress);
      }
    });
  }, [isInCloudTransition]);

  // Lenis scroll handler
  const lenis = useLenis(({ scroll, limit, velocity, direction, progress }) => {
    handleScrollProgress(progress);
  });

  // Cleanup RAF on unmount
  useEffect(() => {
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  // Advanced GSAP scroll animations with performance optimization
  useEffect(() => {
    if (!containerRef.current || !isLoaded) return;

    // Disable ScrollTrigger refreshing during scroll for better performance
    ScrollTrigger.config({
      autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
      ignoreMobileResize: true
    });

    const ctx = gsap.context(() => {
      // Use will-change CSS property for better performance
      if (canvasRef.current) {
        gsap.set(canvasRef.current, {
          willChange: "transform, opacity"
        });
      }

      // Main Earth transformation timeline with optimized performance
      const earthTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5, // Reduced for more responsive feel
          invalidateOnRefresh: true,
          fastScrollEnd: true, // Better performance on fast scrolling
          preventOverlaps: true,
          onUpdate: (self) => {
            // Use direct progress updates instead of callbacks
            const progress = self.progress;
            handleScrollProgress(progress);
          }
        }
      });

      // Optimized canvas animations with GPU acceleration
      if (canvasRef.current) {
        earthTimeline
          .to(canvasRef.current, {
            scale: 2.5,
            y: -100,
            duration: 0.4,
            ease: "none", // Linear easing for smoother scrub
            force3D: true // Force GPU acceleration
          })
          .to(canvasRef.current, {
            scale: 4.5,
            y: -200,
            duration: 0.4,
            ease: "none",
            force3D: true
          }, 0.4)
          .to(canvasRef.current, {
            scale: 6,
            y: -300,
            opacity: 0.6,
            duration: 0.2,
            ease: "none",
            force3D: true
          }, 0.8);
      }

      // Batch DOM queries for better performance
      const historyElements = containerRef.current.querySelectorAll('.history-item');
      const elementsArray = Array.from(historyElements);
      
      // Use single ScrollTrigger.batch for better performance
      ScrollTrigger.batch(elementsArray, {
        onEnter: (elements) => {
          gsap.fromTo(elements, 
            { 
              opacity: 0, 
              y: 120,
              scale: 0.95,
              rotateX: -10
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              rotateX: 0,
              duration: 1.2,
              ease: "power3.out",
              stagger: 0.1,
              force3D: true
            }
          );
        },
        onLeave: (elements) => {
          gsap.to(elements, {
            opacity: 0,
            y: -50,
            duration: 0.5,
            force3D: true
          });
        },
        onEnterBack: (elements) => {
          gsap.to(elements, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            force3D: true
          });
        },
        start: "top 85%",
        end: "top 25%"
      });

    }, containerRef);

    return () => {
      ctx.revert();
      // Clean up will-change
      if (canvasRef.current) {
        gsap.set(canvasRef.current, {
          willChange: "auto"
        });
      }
    };
  }, [isLoaded, handleScrollProgress]);

  // Loading handler
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative min-h-[600vh] bg-gradient-to-b from-slate-900 via-blue-950 to-black overflow-hidden transform-gpu"
    >
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center">
        {/* Fixed 3D Earth Canvas - SINGLE INSTANCE */}
        <div 
          ref={canvasRef}
          className="fixed inset-0 z-10 pointer-events-none"
          style={{
            transform: 'translateZ(0)', // Force GPU acceleration
            willChange: 'transform, opacity'
          }}
        >
          <Canvas
            camera={{ position: [0, 0, 5], fov: 50 }}
            gl={{ 
              antialias: true, 
              alpha: true,
              powerPreference: "high-performance", 
              stencil: false,
              depth: true,
            }}
            dpr={Math.min(window.devicePixelRatio, 2)} // Optimize pixel ratio
            performance={{ min: 0.8 }} // Performance threshold
          >
            {/* SINGLE Earth instance with proper ref */}
            <ScrollEarth 
              ref={earthRef}
              scrollProgress={scrollProgress}
            />
          </Canvas>
        </div>

        {/* Hero Content Overlay */}
        <div className="relative z-20 text-center px-6 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-7xl md:text-9xl lg:text-[12rem] font-bold mb-4 tracking-tight leading-none">
              <span 
                className="bg-gradient-to-b from-slate-100 via-blue-100 to-slate-300 bg-clip-text text-transparent"
                style={{
                  filter: 'drop-shadow(0 0 40px rgba(148, 163, 184, 0.4))',
                }}
              >
                EARTH
              </span>
            </h1>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 1 }}
            className="mb-12"
          >
            <p className="text-xl md:text-2xl lg:text-3xl text-slate-300 font-light tracking-wide leading-relaxed max-w-4xl mx-auto">
              Journey Through 4.6 Billion Years of Wonder
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 1.5 }}
            className="mb-16"
          >
            <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Discover the incredible story of our planet through an immersive 
              experience that brings Earth's magnificent history to life
            </p>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer z-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 1 }}
          whileHover={{ scale: 1.1 }}
        >
          <div className="flex flex-col items-center space-y-3">
            <span className="text-slate-400 text-sm font-medium tracking-wide">
              Scroll to explore
            </span>
            <motion.div 
              className="w-8 h-12 border-2 border-slate-400 rounded-full flex justify-center relative overflow-hidden"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div 
                className="w-1 h-3 bg-slate-400 rounded-full mt-2"
                animate={{ y: [0, 16, 0], opacity: [1, 0, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Cloud Transition Layer */}
      <CloudTransition 
        opacity={cloudOpacity}
        isActive={isInCloudTransition}
      />

      {/* Scrollable Content */}
      <div className="relative z-20">
        {/* History Content Sections */}
        <motion.div 
          className="relative"
          style={{ opacity: contentOpacity }}
        >
          <HistoryContent scrollProgress={scrollProgress} />
        </motion.div>

        {/* Final spacer */}
        <div className="h-screen" />
      </div>

      {/* Optimized Scroll Progress Indicator */}
      <div className="fixed top-1/2 right-8 transform -translate-y-1/2 z-30">
        <div className="w-1 h-32 bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            className="w-full bg-gradient-to-t from-blue-400 to-slate-300 rounded-full origin-bottom"
            style={{ 
              scaleY: scrollYProgress,
              transformOrigin: 'bottom'
            }}
          />
        </div>
        <div className="text-slate-400 text-xs mt-2 text-center">
          {Math.round(scrollProgress * 100)}%
        </div>
      </div>

      {/* Cinematic Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/20 to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-slate-500/10 rounded-full blur-3xl" />
        
        {/* Subtle star field */}
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-0.5 h-0.5 bg-slate-300 rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>
    </div>
  );
};

// Wrap with ReactLenis for optimized smooth scrolling
const ScrollEarthSectionWithLenis: React.FC = () => {
  return (
    <ReactLenis 
      root 
      options={{
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
      }}
    >
      <ScrollEarthSection />
    </ReactLenis>
  );
};

export default ScrollEarthSectionWithLenis;