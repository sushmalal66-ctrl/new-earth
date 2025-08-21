import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Earth3D from './Earth3D';

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  return (
    <section 
      ref={heroRef}
      className="relative h-screen w-full flex items-center justify-center overflow-hidden"
    >
      {/* Enhanced Background with Gradients */}
      <div className="absolute inset-0">
        {/* Primary gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-slate-900 to-black" />
        
        {/* Radial gradient overlays for depth */}
        <div className="absolute inset-0 bg-gradient-radial from-blue-900/20 via-transparent to-transparent" />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-900/10 via-transparent to-purple-900/10" />
        
        {/* Subtle animated stars */}
        <div className="absolute inset-0">
          {[...Array(100)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-0.5 h-0.5 bg-white rounded-full opacity-60"
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
      
      {/* 3D Earth Canvas - Positioned as focal point */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-full max-w-4xl">
          <Canvas
            camera={{ position: [0, 0, 5], fov: 50 }}
            gl={{ 
              antialias: true, 
              alpha: true,
              powerPreference: "high-performance"
            }}
            className="w-full h-full"
          >
            <Earth3D />
          </Canvas>
        </div>
      </div>

      {/* Content Overlay - Positioned to match reference layout */}
      <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
        {/* Main Title */}
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-7xl md:text-9xl lg:text-[12rem] font-bold mb-4 tracking-tight leading-none">
            <span 
              className="bg-gradient-to-b from-white via-blue-100 to-blue-200 bg-clip-text text-transparent"
              style={{
                filter: 'drop-shadow(0 0 40px rgba(135, 206, 235, 0.4))',
              }}
            >
              EARTH
            </span>
          </h1>
        </motion.div>
        
        {/* Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 1 }}
          className="mb-12"
        >
          <p className="text-xl md:text-2xl lg:text-3xl text-blue-100/90 font-light tracking-wide leading-relaxed max-w-4xl mx-auto">
            Journey Through 4.6 Billion Years of Wonder
          </p>
        </motion.div>
        
        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 1.5 }}
          className="mb-16"
        >
          <p className="text-base md:text-lg text-blue-200/70 max-w-2xl mx-auto leading-relaxed">
            Discover the incredible story of our planet through an immersive 
            experience that brings Earth's magnificent history to life
          </p>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 2 }}
          className="mb-20"
        >
          <motion.button
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold rounded-full text-lg shadow-2xl shadow-blue-500/25 border border-blue-400/20"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(59, 130, 246, 0.4)"
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            Begin Exploration
          </motion.button>
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

      {/* Ambient Glow Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top glow */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        
        {/* Bottom glow */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        
        {/* Side glows */}
        <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-64 h-64 bg-blue-400/5 rounded-full blur-2xl" />
        <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-64 h-64 bg-blue-400/5 rounded-full blur-2xl" />
      </div>
    </section>
  );
};

export default Hero;