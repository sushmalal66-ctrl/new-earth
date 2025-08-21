import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Earth3D from './Earth3D';

gsap.registerPlugin(ScrollTrigger);

const TravelBack: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top center",
          end: "bottom center",
          scrub: 1,
        }
      });

      tl.fromTo(contentRef.current,
        { opacity: 0, scale: 0.8, y: 100 },
        { opacity: 1, scale: 1, y: 0, duration: 1 }
      );

      // Parallax effect for background text
      gsap.to('.parallax-text', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 2,
        },
        y: -200,
        opacity: 0.1,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="travel-section relative min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-blue-900/10 to-black overflow-hidden"
    >
      {/* Large background text */}
      <div className="parallax-text absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-[20vw] font-bold text-white/5 tracking-tighter">
          TIME
        </span>
      </div>

      {/* 3D Earth Background */}
      <div className="absolute inset-0 opacity-70">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
        >
          <Earth3D section="travel" />
        </Canvas>
      </div>

      {/* Content */}
      <div 
        ref={contentRef}
        className="relative z-10 text-center px-6 max-w-4xl"
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          viewport={{ once: true }}
        >
          <h2 className="text-6xl md:text-8xl font-bold mb-8 tracking-tight">
            <span className="bg-gradient-to-r from-blue-300 via-white to-blue-100 bg-clip-text text-transparent">
              Travel Back
            </span>
          </h2>
          
          <p className="text-2xl md:text-3xl text-blue-100/80 mb-8 font-light leading-relaxed">
            Through time and space to witness the incredible journey of our planet
          </p>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            viewport={{ once: true }}
          >
            {[
              { number: "4.6B", label: "Years of History" },
              { number: "8.7M", label: "Species on Earth" },
              { number: "1", label: "Unique Planet" }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                className="text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-4xl md:text-5xl font-bold text-blue-300 mb-2">
                  {stat.number}
                </div>
                <div className="text-blue-100/60 text-lg">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default TravelBack;