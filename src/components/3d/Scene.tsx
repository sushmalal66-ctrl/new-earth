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
      {/* Lighting Setup */}
      <ambientLight intensity={0.2} color="#f0f8ff" />
      <directionalLight 
        position={[10, 5, 5]} 
        intensity={1.5}
        color="#ffffff"
        castShadow={false}
      />
      <directionalLight 
        position={[-5, -2, -5]} 
        intensity={0.3}
        color="#4169e1"
      />
      <pointLight 
        position={[0, 0, 8]} 
        intensity={0.5}
        color="#87ceeb"
        distance={20}
      />

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