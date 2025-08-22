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
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isInCloudTransition, setIsInCloudTransition] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Simplified scroll transforms
  const earthOpacity = useTransform(scrollYProgress, [0, 0.1, 0.85, 1], [1, 1, 0.8, 0.3]);
  const cloudOpacity = useTransform(scrollYProgress, [0.3, 0.5, 0.7, 0.9], [0, 0.3, 0.8, 1]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);

  // Optimized scroll progress handler
  const handleScrollProgress = useCallback((progress: number) => {
    setScrollProgress(progress);
    
    // Cloud transition logic
    const shouldShowClouds = progress > 0.35 && progress < 0.75;
    if (shouldShowClouds !== isInCloudTransition) {
      setIsInCloudTransition(shouldShowClouds);
    }

    // Update Earth component
    if (earthRef.current?.updateScroll) {
      earthRef.current.updateScroll(progress);
    }
  }, [isInCloudTransition]);

  // Lenis scroll handler with throttling
  const lenis = useLenis(({ progress }) => {
    handleScrollProgress(progress);
  });

  // Simplified GSAP scroll animations
  useEffect(() => {
    if (!containerRef.current || !isLoaded) return;

    const ctx = gsap.context(() => {
      // Simple canvas scale and position animation
      if (canvasRef.current) {
        gsap.to(canvasRef.current, {
          scale: 3,
          y: -200,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            ease: "none"
          }
        });
      }

      // History items animation
      const historyElements = containerRef.current.querySelectorAll('.history-item');
      
      ScrollTrigger.batch(historyElements, {
        onEnter: (elements) => {
          gsap.fromTo(elements, 
            { opacity: 0, y: 100 },
            { opacity: 1, y: 0, duration: 1, stagger: 0.1 }
          );
        },
        start: "top 80%",
        end: "top 20%"
      });

    }, containerRef);

    return () => ctx.revert();
  }, [isLoaded]);

  // Loading handler
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative min-h-[600vh] bg-gradient-to-b from-slate-900 via-blue-950 to-black overflow-hidden"
    >
      {/* Hero Section with Earth */}
      <div className="relative h-screen flex items-center justify-center">
        {/* Fixed 3D Earth Canvas - Always visible */}
        <div 
          ref={canvasRef}
          className="fixed inset-0 z-10 pointer-events-none"
        >
          <Canvas
            camera={{ position: [0, 0, 5], fov: 50 }}
            gl={{ 
              antialias: true, 
              alpha: true,
              powerPreference: "high-performance"
            }}
            dpr={Math.min(window.devicePixelRatio, 2)}
          >
            <ScrollEarth 
              ref={earthRef}
              scrollProgress={scrollProgress}
              isInCloudTransition={isInCloudTransition}
              opacity={earthOpacity}
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
        <motion.div 
          className="relative"
          style={{ opacity: contentOpacity }}
        >
          <HistoryContent scrollProgress={scrollProgress} />
        </motion.div>

        {/* Final spacer */}
        <div className="h-screen" />
      </div>

      {/* Scroll Progress Indicator */}
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

      {/* Background Effects */}
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

// Wrap with ReactLenis for smooth scrolling
const ScrollEarthSectionWithLenis: React.FC = () => {
  return (
    <ReactLenis 
      root 
      options={{
        duration: 1.0,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 0.8,
        smoothTouch: false,
        touchMultiplier: 1.5,
        infinite: false,
        autoResize: true,
      }}
    >
      <ScrollEarthSection />
    </ReactLenis>
  );
};

export default ScrollEarthSectionWithLenis;