import React, { useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import ScrollEarth from './ScrollEarth';
import HistoryContent from './HistoryContent';
import CloudTransition from './CloudTransition';

gsap.registerPlugin(ScrollTrigger);

const ScrollEarthSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const earthRef = useRef<any>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isInCloudTransition, setIsInCloudTransition] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Transform scroll progress for different effects
  const earthScale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [1, 2.5, 4, 6]);
  const earthY = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, -100, -300, -600]);
  const cloudOpacity = useTransform(scrollYProgress, [0.2, 0.4, 0.6, 0.8], [0, 0.3, 0.8, 1]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  // Initialize Lenis smooth scrolling
  useEffect(() => {
    lenisRef.current = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time: number) {
      lenisRef.current?.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenisRef.current?.destroy();
    };
  }, []);

  // Advanced GSAP scroll animations
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Earth transformation timeline
      const earthTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          onUpdate: (self) => {
            const progress = self.progress;
            setScrollProgress(progress);
            
            // Trigger cloud transition at specific scroll points
            if (progress > 0.4 && progress < 0.8) {
              setIsInCloudTransition(true);
            } else {
              setIsInCloudTransition(false);
            }

            // Pass scroll data to Earth component
            if (earthRef.current) {
              earthRef.current.updateScroll(progress);
            }
          }
        }
      });

      // Canvas parallax and zoom effects
      earthTimeline
        .to(canvasRef.current, {
          scale: 3,
          y: -200,
          duration: 1,
          ease: "power2.inOut"
        })
        .to(canvasRef.current, {
          scale: 6,
          y: -500,
          opacity: 0.7,
          duration: 1,
          ease: "power2.inOut"
        }, 0.5);

      // History content animations
      const historyElements = containerRef.current.querySelectorAll('.history-item');
      historyElements.forEach((element, index) => {
        gsap.fromTo(element,
          { 
            opacity: 0, 
            y: 100,
            scale: 0.9,
            rotateX: -15
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateX: 0,
            duration: 1.5,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 80%",
              end: "top 20%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });

      // Cloud transition effects
      const cloudElements = containerRef.current.querySelectorAll('.cloud-layer');
      cloudElements.forEach((element, index) => {
        gsap.fromTo(element,
          { opacity: 0, scale: 0.8 },
          {
            opacity: 1,
            scale: 1,
            duration: 2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "30% top",
              end: "70% top",
              scrub: 1
            }
          }
        );
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Handle scroll progress updates
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      setScrollProgress(latest);
    });

    return () => unsubscribe();
  }, [scrollYProgress]);

  return (
    <div 
      ref={containerRef}
      className="relative min-h-[500vh] bg-gradient-to-b from-black via-slate-900 to-black"
    >
      {/* Fixed 3D Earth Canvas */}
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
        >
          <ScrollEarth 
            ref={earthRef}
            scrollProgress={scrollProgress}
            isInCloudTransition={isInCloudTransition}
          />
        </Canvas>
      </div>

      {/* Cloud Transition Layer */}
      <CloudTransition 
        opacity={cloudOpacity}
        isActive={isInCloudTransition}
      />

      {/* Scrollable Content */}
      <div className="relative z-20">
        {/* Spacer for initial Earth view */}
        <div className="h-screen" />

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

      {/* Scroll Progress Indicator */}
      <div className="fixed top-1/2 right-8 transform -translate-y-1/2 z-30">
        <div className="w-1 h-32 bg-white/20 rounded-full overflow-hidden">
          <motion.div 
            className="w-full bg-gradient-to-t from-blue-400 to-blue-300 rounded-full origin-bottom"
            style={{ 
              scaleY: scrollYProgress,
              transformOrigin: 'bottom'
            }}
          />
        </div>
        <div className="text-white/60 text-xs mt-2 text-center">
          {Math.round(scrollProgress * 100)}%
        </div>
      </div>

      {/* Ambient Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/5 to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
};

export default ScrollEarthSection;