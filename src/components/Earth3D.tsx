import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Sphere, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Earth3DProps {
  section: 'hero' | 'history' | 'travel';
}

const Earth3D: React.FC<Earth3DProps> = ({ section }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();
  
  // Using a reliable Earth texture URL
  const earthTexture = useTexture('https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=2048&h=1024&fit=crop');
  
  useEffect(() => {
    if (!meshRef.current) return;

    const ctx = gsap.context(() => {
      // Base rotation animation (continuous)
      gsap.to(meshRef.current!.rotation, {
        y: Math.PI * 2,
        duration: 20,
        repeat: -1,
        ease: "none",
      });

      // Section-specific animations
      if (section === 'hero') {
        gsap.set(camera.position, { x: 0, y: 0, z: 5 });
        gsap.set(meshRef.current!.scale, { x: 1.5, y: 1.5, z: 1.5 });
      }

      if (section === 'history') {
        ScrollTrigger.create({
          trigger: '.history-section',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
          onUpdate: (self) => {
            const progress = self.progress;
            
            // Zoom in effect
            const scale = 1.5 + progress * 0.8;
            gsap.set(meshRef.current!.scale, { x: scale, y: scale, z: scale });
            
            // Camera movement
            gsap.set(camera.position, { 
              x: progress * 2,
              y: Math.sin(progress * Math.PI) * 0.5,
              z: 5 - progress * 1.5
            });
          }
        });
      }

      if (section === 'travel') {
        ScrollTrigger.create({
          trigger: '.travel-section',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
          onUpdate: (self) => {
            const progress = self.progress;
            
            // Dramatic rotation
            gsap.set(meshRef.current!.rotation, { 
              x: progress * Math.PI * 0.5,
              z: progress * Math.PI * 0.3
            });
            
            // Camera orbit
            const angle = progress * Math.PI * 2;
            gsap.set(camera.position, {
              x: Math.cos(angle) * 3,
              y: Math.sin(progress * Math.PI) * 1,
              z: Math.sin(angle) * 3 + 5
            });
            
            camera.lookAt(0, 0, 0);
          }
        });
      }
    });

    return () => ctx.revert();
  }, [section, camera]);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Add subtle floating animation
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
  });

  return (
    <group>
      {/* Ambient lighting */}
      <ambientLight intensity={0.2} color="#f0f8ff" />
      
      {/* Key light */}
      <directionalLight 
        position={[5, 5, 5]} 
        intensity={1}
        color="#ffffff"
        castShadow
      />
      
      {/* Rim light */}
      <directionalLight 
        position={[-5, 0, -5]} 
        intensity={0.3}
        color="#4169e1"
      />

      {/* Earth Sphere */}
      <Sphere ref={meshRef} args={[1, 64, 64]}>
        <meshPhongMaterial 
          map={earthTexture}
          bumpScale={0.05}
          shininess={100}
          specular={new THREE.Color('#4169e1')}
        />
      </Sphere>

      {/* Glow effect */}
      <Sphere args={[1.05, 32, 32]}>
        <meshBasicMaterial 
          color="#4169e1"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </Sphere>
    </group>
  );
};

export default Earth3D;