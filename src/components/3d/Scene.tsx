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
      {/* Simplified Lighting Setup - Remove duplicates from Earth component */}
      <ambientLight intensity={0.15} color="#001122" />
      
      <directionalLight 
        position={[10, 5, 5]} 
        intensity={1.2}
        color="#ffffff"
        castShadow={false}
      />
      
      <directionalLight 
        position={[-5, -2, -5]} 
        intensity={0.4}
        color="#00aaff"
      />

      {/* Environment for better contrast */}
      <Environment preset="night" />
      
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
      
      {/* Particle Field */}
      <ParticleField earthProgress={earthProgress} />
      
      {/* Main Earth */}
      <Earth earthProgress={earthProgress} />
    </Suspense>
  );
};

export default Scene;