import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { MotionValue } from 'framer-motion';
import * as THREE from 'three';

interface EarthProps {
  earthProgress: MotionValue<number>;
}

const Earth: React.FC<EarthProps> = ({ earthProgress }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [hasMovedForward, setHasMovedForward] = useState(false);
  const baseRotationSpeed = 0.5;
  
  // Load Earth texture with fallback
  let earthTexture;
  try {
    earthTexture = useLoader(TextureLoader, '/assets/earth.jpg');
  } catch (error) {
    console.warn('Earth texture failed to load, using fallback');
    earthTexture = null;
  }

  // Configure texture
  useMemo(() => {
    if (earthTexture) {
      earthTexture.wrapS = THREE.RepeatWrapping;
      earthTexture.wrapT = THREE.RepeatWrapping;
      earthTexture.anisotropy = 16;
    }
  }, [earthTexture]);

  // Create realistic Earth material
  const earthMaterial = useMemo(() => {
    if (earthTexture) {
      return new THREE.MeshStandardMaterial({
        map: earthTexture,
        roughness: 0.8,
        metalness: 0.1
      });
    } else {
      // Fallback material with Earth-like colors
      return new THREE.MeshStandardMaterial({
        color: '#4a90e2',
        roughness: 0.8,
        metalness: 0.1
      });
    }
  }, [earthTexture]);

  // Scroll detection for initial forward movement
  useEffect(() => {
    const handleScroll = () => {
      if (!hasMovedForward) {
        setHasMovedForward(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMovedForward]);

  // Animation loop
  useFrame((state) => {
    if (!meshRef.current || !groupRef.current) return;
    
    const time = state.clock.elapsedTime;
    const progress = earthProgress.get();
    
    // Continuous rotation on Y-axis, synced with timeline progress
    const rotationSpeed = baseRotationSpeed + (progress * 0.3); // Slightly faster as timeline progresses
    meshRef.current.rotation.y = time * rotationSpeed;
    
    // Forward movement based on scroll + subtle timeline-based positioning
    const baseZ = hasMovedForward ? 1.2 : 0;
    const timelineZ = progress * 0.3; // Additional subtle movement with timeline
    groupRef.current.position.z = baseZ + timelineZ;
    
    // Subtle rotation variations based on timeline progress
    groupRef.current.rotation.x = Math.sin(progress * Math.PI) * 0.05;
    groupRef.current.rotation.z = Math.cos(progress * Math.PI * 0.5) * 0.02;
  });

  return (
    <group ref={groupRef}>
      {/* Lighting for realistic Earth appearance */}
      <ambientLight intensity={0.2} />
      <directionalLight 
        position={[5, 3, 5]} 
        intensity={1.0}
        castShadow={false}
      />
      
      {/* Earth Sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 64, 32]} />
        <primitive object={earthMaterial} attach="material" />
      </mesh>
    </group>
  );
};

export default Earth;