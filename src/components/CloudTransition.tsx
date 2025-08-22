import React, { useRef, useMemo } from 'react';
import { motion, MotionValue } from 'framer-motion';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CloudTransitionProps {
  opacity: MotionValue<number>;
  isActive: boolean;
}

const CloudTransition: React.FC<CloudTransitionProps> = ({ opacity, isActive }) => {
  const cloudsRef = useRef<HTMLDivElement>(null);

  // Generate cloud layers
  const cloudLayers = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
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
      className="fixed inset-0 z-15 pointer-events-none"
      style={{ opacity }}
    >
      {/* Cloud Layers */}
      {cloudLayers.map((cloud) => (
        <motion.div
          key={cloud.id}
          className="cloud-layer absolute rounded-full bg-gradient-to-br from-slate-200/15 to-blue-200/8"
          style={{
            width: `${cloud.size}px`,
            height: `${cloud.size}px`,
            left: `${cloud.left}%`,
            top: `${cloud.top}%`,
            filter: `blur(${cloud.blur}px)`,
            opacity: cloud.opacity,
          }}
          animate={isActive ? {
            scale: [1, 1.2, 1],
            x: [0, 20, 0],
            y: [0, -10, 0],
          } : {}}
          transition={{
            duration: 8 + cloud.animationDelay,
            repeat: Infinity,
            ease: "easeInOut",
            delay: cloud.animationDelay
          }}
        />
      ))}

      {/* Particle Effects */}
      <div className="absolute inset-0">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-slate-300/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={isActive ? {
              y: [0, -50, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [0.5, 1, 0.5],
            } : {}}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Atmospheric Glow */}
      <motion.div
        className="absolute inset-0 bg-gradient-radial from-slate-400/8 via-transparent to-transparent"
        animate={isActive ? {
          scale: [1, 1.5, 1],
          opacity: [0.3, 0.6, 0.3],
        } : {}}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  );
};

export default CloudTransition;