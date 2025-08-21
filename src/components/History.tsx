import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Earth3D from './Earth3D';
import Timeline from './Timeline';

gsap.registerPlugin(ScrollTrigger);

const History: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Enhanced canvas parallax effect
      gsap.to(canvasRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
        y: -100,
        scale: 1.1,
        opacity: 0.8,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="history-section relative bg-gradient-to-b from-black via-slate-900 to-black"
    >
      {/* Background 3D Earth with enhanced effects */}
      <div 
        ref={canvasRef}
        className="fixed inset-0 opacity-40 pointer-events-none"
        style={{ zIndex: 1 }}
      >
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          gl={{ 
            antialias: true, 
            alpha: true,
            powerPreference: "high-performance"
          }}
        >
          <Earth3D section="history" />
        </Canvas>
      </div>

      {/* Timeline Component */}
      <div className="relative z-10">
        <Timeline />
      </div>
    </section>
  );
};

export default History;