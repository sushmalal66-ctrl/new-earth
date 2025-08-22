import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { MotionValue } from 'framer-motion';
import * as THREE from 'three';

interface EarthProps {
  earthProgress: MotionValue<number>;
  timelineProgress?: MotionValue<number>;
}

const Earth: React.FC<EarthProps> = ({ earthProgress, timelineProgress }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [targetZ, setTargetZ] = useState(0);
  const [currentZ, setCurrentZ] = useState(0);
  const [rotationSpeed, setRotationSpeed] = useState(0.5);
  
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

  // Determine sphere segments based on device performance
  const getSphereSegments = () => {
    if (window.innerWidth < 768 || navigator.hardwareConcurrency < 4) {
      return [32, 16]; // Medium performance
    } else if (navigator.hardwareConcurrency < 8) {
      return [64, 32]; // High performance
    }
    return [128, 64]; // Ultra performance
  };

  const [widthSegments, heightSegments] = useMemo(() => getSphereSegments(), []);

  // Drive forward movement based on earthProgress
  useEffect(() => {
    const unsubscribe = earthProgress.onChange((latestProgress) => {
      // Trigger forward movement when progress is greater than 0 (i.e., user has scrolled)
      if (latestProgress > 0 && targetZ === 0) {
        setTargetZ(1.2); // Move 20% closer
      }
    });
    return () => unsubscribe();
  }, [earthProgress, targetZ]);

  // Listen for timeline progress changes to adjust rotation speed
  useEffect(() => {
    if (timelineProgress) {
      const unsubscribe = timelineProgress.onChange((progress) => {
        // Vary rotation speed based on timeline progress (0.3 to 1.2)
        const newSpeed = 0.3 + (progress * 0.9);
        setRotationSpeed(newSpeed);
      });
      return () => unsubscribe();
    }
  }, [timelineProgress]);

  // Animation loop
  useFrame((state) => {
    if (!meshRef.current || !groupRef.current) return;
    
    const time = state.clock.elapsedTime;
    const progress = earthProgress.get();
    
    // Enhanced rotation synchronized with timeline progress
    // Base rotation + timeline-influenced rotation
    const baseRotation = time * rotationSpeed;
    const timelineRotation = progress * Math.PI * 4; // 4 full rotations across timeline
    meshRef.current.rotation.y = baseRotation + timelineRotation;
    
    // Subtle wobble effect based on timeline progress
    meshRef.current.rotation.x = Math.sin(time * 0.3) * 0.05 + (progress * 0.1);
    meshRef.current.rotation.z = Math.cos(time * 0.2) * 0.03;
    
    // Smooth forward movement when triggered
    if (currentZ < targetZ) {
      const newZ = THREE.MathUtils.lerp(currentZ, targetZ, 0.02);
      setCurrentZ(newZ);
      groupRef.current.position.z = newZ;
    }
    
    // Scale effect based on timeline progress
    const scaleMultiplier = 1 + (progress * 0.2); // Grow up to 20% larger
    groupRef.current.scale.setScalar(scaleMultiplier);
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
      {/* Additional rim lighting for dramatic effect */}
      <directionalLight 
        position={[-5, -3, -5]} 
        intensity={0.4}
        color="#4a90e2"
      />
      
      {/* Earth Sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, widthSegments, heightSegments]} />
        <primitive object={earthMaterial} attach="material" />
      </mesh>
      
      {/* Atmospheric glow effect */}
      <mesh scale={1.05}>
        <sphereGeometry args={[1, 32, 16]} />
        <meshBasicMaterial 
          color="#4a90e2" 
          transparent 
          opacity={0.1} 
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
};

export default Earth;