import React, { useRef, useMemo } from 'react';
import { motion, MotionValue } from 'framer-motion';

interface CloudTransitionProps {
  opacity: MotionValue<number>;
  isActive: boolean;
}

const CloudTransition: React.FC<CloudTransitionProps> = ({ opacity, isActive }) => {
  const cloudsRef = useRef<HTMLDivElement>(null);

  // Reduced cloud layers for better performance
  const cloudLayers = useMemo(() => {
    return Array.from({ length: 4 }, (_, i) => ({
      id: i,
      size: 150 + i * 80,
      left: Math.random() * 100,
      top: Math.random() * 100,
      animationDelay: i * 0.8,
      opacity: 0.08 + (i * 0.03),
      blur: 15 + i * 8
    }));
  }, []);

  return (
    <motion.div
      ref={cloudsRef}
      className="fixed inset-0 z-15 pointer-events-none will-change-transform"
      style={{ opacity }}
    >
      {/* Reduced Cloud Layers */}
      {cloudLayers.map((cloud) => (
        <motion.div
          key={cloud.id}
          className="cloud-layer absolute rounded-full bg-gradient-to-br from-slate-200/10 to-blue-200/5"
          style={{
            width: `${cloud.size}px`,
            height: `${cloud.size}px`,
            left: `${cloud.left}%`,
            top: `${cloud.top}%`,
            filter: `blur(${cloud.blur}px)`,
            opacity: cloud.opacity,
          }}
          animate={isActive ? {
            scale: [1, 1.1, 1],
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

      {/* Reduced Particle Effects */}
      <div className="absolute inset-0">
        {Array.from({ length: 15 }).map((_, i) => (
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
              duration: 2.5 + Math.random() * 1.5,
              repeat: Infinity,
              delay: Math.random() * 1.5,
            }}
          />
        ))}
      </div>

      {/* Simplified Atmospheric Glow */}
      <motion.div
        className="absolute inset-0 bg-gradient-radial from-slate-400/5 via-transparent to-transparent"
        animate={isActive ? {
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        } : {}}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  );
};

export default CloudTransition;