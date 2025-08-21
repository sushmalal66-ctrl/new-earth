import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown } from 'lucide-react';
import Earth3D from './Earth3D';

gsap.registerPlugin(ScrollTrigger);

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Enhanced entrance animation
      const tl = gsap.timeline({ delay: 0.5 });
      
      tl.fromTo(titleRef.current, 
        { opacity: 0, y: 150, scale: 0.8 },
        { opacity: 1, y: 0, scale: 1, duration: 2, ease: "power3.out" }
      )
      .fromTo(subtitleRef.current,
        { opacity: 0, y: 80, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 1.5, ease: "power3.out" },
        "-=1.2"
      )
      .fromTo(canvasRef.current,
        { opacity: 0, scale: 0.5 },
        { opacity: 1, scale: 1, duration: 2.5, ease: "power2.out" },
        "-=2"
      );

      // Parallax scroll effects
      gsap.to([titleRef.current, subtitleRef.current], {
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
        y: -200,
        opacity: 0.2,
        scale: 0.8,
      });

      gsap.to(canvasRef.current, {
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
        y: -100,
        scale: 1.2,
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={heroRef}
      className="relative h-screen w-full flex items-center justify-center overflow-hidden"
    >
      {/* Enhanced Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-slate-900 to-black">
        {/* Animated stars */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-60"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>
      
      {/* 3D Earth Canvas */}
      <div ref={canvasRef} className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 50 }}
          gl={{ 
            antialias: true, 
            alpha: true,
            powerPreference: "high-performance"
          }}
          className="w-full h-full"
        >
          <Earth3D section="hero" />
        </Canvas>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 text-center px-6 max-w-4xl">
        <motion.h1 
          ref={titleRef}
          className="text-7xl md:text-9xl font-bold mb-8 tracking-tight leading-none"
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #87ceeb 50%, #4169e1 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 30px rgba(135, 206, 235, 0.3))',
          }}
        >
          EARTH
        </motion.h1>
        
        <motion.p 
          ref={subtitleRef}
          className="text-2xl md:text-3xl text-blue-100/90 font-light tracking-wide leading-relaxed"
        >
          Journey Through 4.6 Billion Years of Wonder
        </motion.p>
        
        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 1 }}
        >
          <p className="text-blue-200/70 text-lg mb-8 max-w-2xl mx-auto">
            Discover the incredible story of our planet through an immersive 
            3D experience that brings Earth's history to life
          </p>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2 cursor-pointer"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3, duration: 1 }}
        whileHover={{ scale: 1.1 }}
      >
        <div className="flex flex-col items-center space-y-2">
          <span className="text-blue-200/70 text-sm font-medium tracking-wide">
            Scroll to explore
          </span>
          <motion.div 
            className="w-8 h-12 border-2 border-blue-300/50 rounded-full flex justify-center relative overflow-hidden"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div 
              className="w-1 h-3 bg-blue-300/80 rounded-full mt-2"
              animate={{ y: [0, 16, 0], opacity: [1, 0, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
          <ChevronDown className="w-5 h-5 text-blue-300/70 animate-bounce" />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;