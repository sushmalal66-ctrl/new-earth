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
  const [targetZ, setTargetZ] = useState(0);
  const [currentZ, setCurrentZ] = useState(0);
  
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

  // Scroll detection - move forward only once
  useEffect(() => {
    const handleScroll = () => {
      if (!hasMovedForward) {
        setHasMovedForward(true);
        setTargetZ(1.2); // Move 20% closer (from 0 to 1.2 units forward)
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMovedForward]);

  // Animation loop
  useFrame((state) => {
    if (!meshRef.current || !groupRef.current) return;
    
    const time = state.clock.elapsedTime;
    
    // Continuous rotation on Y-axis (vertical axis)
    meshRef.current.rotation.y = time * 0.5; // Smooth, consistent rotation
    
    // Smooth forward movement when triggered
    if (currentZ < targetZ) {
      const newZ = THREE.MathUtils.lerp(currentZ, targetZ, 0.02);
      setCurrentZ(newZ);
      groupRef.current.position.z = newZ;
    }
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