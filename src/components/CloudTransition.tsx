import React, { useRef, useMemo } from 'react';
import { motion, MotionValue } from 'framer-motion';

interface CloudTransitionProps {
  opacity: MotionValue<number>;
  isActive: boolean;
}

const CloudTransition: React.FC<CloudTransitionProps> = ({ opacity, isActive }) => {
  const cloudsRef = useRef<HTMLDivElement>(null);

  // Minimal cloud layers for optimal performance
  const cloudLayers = useMemo(() => {
    return Array.from({ length: 2 }, (_, i) => ({
      id: i,
      size: 200 + i * 100,
      left: Math.random() * 100,
      top: Math.random() * 100,
      animationDelay: i * 0.5,
      opacity: 0.1 + (i * 0.05),
      blur: 20 + i * 10
    }));
  }, []);

  return (
    <motion.div
      ref={cloudsRef}
      className="fixed inset-0 z-15 pointer-events-none will-change-opacity"
      style={{ opacity }}
    >
      {/* Minimal Cloud Layers */}
      {cloudLayers.map((cloud) => (
        <motion.div
          key={cloud.id}
          className="absolute rounded-full bg-gradient-to-br from-slate-200/10 to-blue-200/5 will-change-transform"
          style={{
            width: `${cloud.size}px`,
            height: `${cloud.size}px`,
            left: `${cloud.left}%`,
            top: `${cloud.top}%`,
            filter: `blur(${cloud.blur}px)`,
            opacity: cloud.opacity,
          }}
          animate={isActive ? {
            scale: [1, 1.05, 1],
            x: [0, 15, 0],
            y: [0, -8, 0],
          } : {}}
          transition={{
            duration: 6 + cloud.animationDelay,
            repeat: Infinity,
            ease: "easeInOut",
            delay: cloud.animationDelay
          }}
        />
      ))}

      {/* Minimal Particle Effects */}
      <div className="absolute inset-0">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-0.5 h-0.5 bg-slate-300/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={isActive ? {
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [0.3, 0.8, 0.3],
            } : {}}
            transition={{
              duration: 2 + Math.random() * 1,
              repeat: Infinity,
              delay: Math.random() * 1,
            }}
          />
        ))}
      </div>

      {/* Minimal Atmospheric Glow */}
      <motion.div
        className="absolute inset-0 bg-gradient-radial from-slate-400/3 via-transparent to-transparent will-change-transform"
        animate={isActive ? {
          scale: [1, 1.1, 1],
          opacity: [0.1, 0.2, 0.1],
        } : {}}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  );
};

export default CloudTransition;