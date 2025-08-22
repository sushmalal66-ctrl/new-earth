import React, { Suspense } from 'react';
import { Stars, Environment } from '@react-three/drei';
import { MotionValue } from 'framer-motion';
import Earth from './Earth';
import ParticleField from './ParticleField';

interface SceneProps {
  earthProgress: MotionValue<number>;
}

const Scene: React.FC<SceneProps> = ({ earthProgress }) => {
  return (
    <Suspense fallback={null}>
      {/* Sparse Star Field */}
      <Stars 
        radius={100} 
        depth={50} 
        count={2000} 
        factor={4} 
        saturation={0} 
        fade={true}
        speed={0.5}
      />
      
      {/* Main Earth */}
      <Earth earthProgress={earthProgress} />
    </Suspense>
  );
};

export default Scene;