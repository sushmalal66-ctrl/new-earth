import React, { Suspense } from 'react';
import { Stars, Environment } from '@react-three/drei';
import { MotionValue } from 'framer-motion';
import Earth from './Earth';
import ParticleField from './ParticleField';

interface SceneProps {
  earthProgress: MotionValue<number>;
  timelineProgress?: MotionValue<number>;
}

const Scene: React.FC<SceneProps> = ({ earthProgress, timelineProgress }) => {
  return (
    <Suspense fallback={null}>
      {/* Enhanced Star Field with timeline synchronization */}
      <Stars 
        radius={100} 
        depth={50} 
        count={3000} 
        factor={4} 
        saturation={0} 
        fade={true}
        speed={1}
      />
      
      {/* Particle Field for additional atmosphere */}
      <ParticleField earthProgress={earthProgress} />
      
      {/* Main Earth */}
      <Earth 
        earthProgress={earthProgress} 
        timelineProgress={timelineProgress}
      />
    </Suspense>
  );
};

export default Scene;