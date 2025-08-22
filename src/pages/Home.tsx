import React, { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion } from 'framer-motion';
import Scene from '../components/3d/Scene';
import HorizontalTimeline from '../components/HorizontalTimeline';
import { useLenisGsapSync } from '../hooks/useLenisGsapSync';

const Home: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const { scrollProgress, earthProgress, timelineProgress, scrollToTimelinePosition } = useLenisGsapSync();

  // Handle timeline progress changes
  const handleTimelineProgressChange = (progress: number) => {
    // Additional logic for timeline progress changes can be added here
    console.log('Timeline progress:', progress);
  };

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
            stencil: false,
            preserveDrawingBuffer: false
          }}
          dpr={[1, 2]}
          shadows={false}
          performance={{ min: 0.5 }}
          frameloop="demand"
        >
          <Scene 
            earthProgress={earthProgress} 
            timelineProgress={timelineProgress}
          />
        </Canvas>
      </div>

      {/* Scrollable Content */}
      <div className="relative z-20">
        {/* Hero Introduction */}
        <motion.section 
          className="h-screen flex items-center justify-center relative overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        >
          <div className="text-center z-10 max-w-4xl mx-auto px-6">
            <motion.h1 
              className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              The History of Earth
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 1 }}
            >
              Journey through 4.6 billion years of our planet's incredible story
            </motion.p>
            
            <motion.div
              className="text-gray-400 text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
            >
              Scroll down to begin the timeline
              <div className="mt-4">
                <motion.div
                  className="w-6 h-10 border-2 border-gray-400 rounded-full mx-auto relative"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <motion.div
                    className="w-1 h-3 bg-gray-400 rounded-full absolute left-1/2 top-2 transform -translate-x-1/2"
                    animate={{ y: [0, 12, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>
          
          {/* Background gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60" />
        </motion.section>

        {/* Horizontal Timeline */}
        <HorizontalTimeline 
          earthProgress={earthProgress}
          onProgressChange={handleTimelineProgressChange}
        />
        
        {/* Conclusion Section */}
        <motion.section 
          className="h-screen flex items-center justify-center relative"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <div className="text-center max-w-4xl mx-auto px-6">
            <motion.h2 
              className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1 }}
              viewport={{ once: true }}
            >
              The Story Continues
            </motion.h2>
            
            <motion.p 
              className="text-xl text-gray-300 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 1 }}
              viewport={{ once: true }}
            >
              Earth's journey is far from over. Every day brings new discoveries, 
              challenges, and opportunities to shape our planet's future. 
              The next chapter of this incredible story is being written by us.
            </motion.p>
            
            <motion.button
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              viewport={{ once: true }}
              onClick={() => scrollToTimelinePosition(0)}
            >
              Explore Again
            </motion.button>
          </div>
        </motion.section>
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
        
        {/* Enhanced background effects */}
        <motion.div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.6, 0.3, 0.6]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        
        <motion.div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/5 rounded-full blur-3xl"
          animate={{ 
            rotate: [0, 360],
            scale: [0.8, 1.1, 0.8]
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>
    </div>
  );
};

export default Home;