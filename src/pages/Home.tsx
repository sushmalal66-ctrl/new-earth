import React, { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion } from 'framer-motion';
import Scene from '../components/3d/Scene';
import Section from '../components/ui/Section';
import HistoryContent from '../components/HistoryContent';
import { useLenisGsapSync } from '../hooks/useLenisGsapSync';
import { initializeTimelines } from '../animations/timelines';
import { sections } from '../data/sections';

const Home: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const { scrollProgress, earthProgress, scrollTo } = useLenisGsapSync();

  useEffect(() => {
    if (containerRef.current) {
      initializeTimelines(containerRef.current);
    }
  }, []);

  return (
    <div ref={containerRef} className="relative bg-black text-white overflow-x-hidden">
      {/* Fixed 3D Canvas */}
      <div 
        ref={canvasRef}
        className="fixed inset-0 z-10 pointer-events-none"
        style={{ willChange: 'transform' }}
      >
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          gl={{ 
            powerPreference: 'high-performance', 
            antialias: true,
            alpha: true,
            stencil: false
          }}
          dpr={[1, 2]}
          shadows={false}

          performance={{ min: 0.5 }}
        >
          <Scene earthProgress={earthProgress} />
        </Canvas>
      </div>

      {/* Scrollable Content */}
      <div className="relative z-20">
        {/* Hero Section */}
        <Section
          key={sections[0].id}
          {...sections[0]}
          index={0}
          isFirst={true}
          isLast={false}
        />
        
        {/* History Content Component */}
        <HistoryContent scrollProgress={scrollProgress.get()} />
        
        {/* Remaining sections */}
        {sections.slice(1).map((section, index) => (
          <Section
            key={section.id}
            {...section}
            index={index + 1}
            isFirst={false}
            isLast={index === sections.length - 2}
          />
        ))}
      </div>

      {/* Scroll Progress Indicator */}
      <motion.div
        className="fixed top-1/2 right-8 transform -translate-y-1/2 z-30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <div className="w-1 h-32 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className="w-full bg-gradient-to-t from-cyan-400 to-blue-400 rounded-full origin-bottom"
            style={{ 
              scaleY: scrollProgress,
              transformOrigin: 'bottom'
            }}
          />
        </div>
        <div className="text-slate-400 text-xs mt-2 text-center font-mono">
          {Math.round(scrollProgress.get() * 100)}%
        </div>
      </motion.div>

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/20 via-transparent to-slate-900/20" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
    </div>
  );
};

export default Home;