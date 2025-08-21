import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame, useThree, useLoader } from '@react-three/fiber';
import { Sphere, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Earth3DProps {
  section: 'hero' | 'history' | 'travel';
  scrollProgress?: number;
  timelineProgress?: number;
}

const Earth3D: React.FC<Earth3DProps> = ({ section, scrollProgress = 0, timelineProgress = 0 }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const { camera, scene } = useThree();
  
  // Load Earth texture from assets
  const earthTexture = useTexture('/assets/earth.jpg');
  
  // Configure texture for better quality
  useMemo(() => {
    if (earthTexture) {
      earthTexture.wrapS = THREE.RepeatWrapping;
      earthTexture.wrapT = THREE.RepeatWrapping;
      earthTexture.minFilter = THREE.LinearMipmapLinearFilter;
      earthTexture.magFilter = THREE.LinearFilter;
      earthTexture.generateMipmaps = true;
    }
  }, [earthTexture]);

  // Create atmosphere material
  const atmosphereMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        opacity: { value: 0.15 }
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform float opacity;
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          vec3 atmosphere = vec3(0.3, 0.6, 1.0) * intensity;
          gl_FragColor = vec4(atmosphere, opacity * intensity);
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true
    });
  }, []);

  useEffect(() => {
    if (!meshRef.current) return;

    const ctx = gsap.context(() => {
      // Section-specific initial setup
      if (section === 'hero') {
        gsap.set(meshRef.current!.scale, { x: 1.8, y: 1.8, z: 1.8 });
        gsap.set(meshRef.current!.position, { x: 0, y: 0, z: 0 });
        gsap.set(meshRef.current!.rotation, { x: 0, y: 0, z: 0 });
      }

      if (section === 'history') {
        // Timeline-based Earth positioning and rotation
        ScrollTrigger.create({
          trigger: '.history-section',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
          onUpdate: (self) => {
            const progress = self.progress;
            
            // Dynamic scaling based on scroll
            const scale = 1.2 + progress * 1.5;
            gsap.set(meshRef.current!.scale, { x: scale, y: scale, z: scale });
            
            // Rotate to show different regions for different timeline events
            const rotationY = progress * Math.PI * 2;
            const rotationX = Math.sin(progress * Math.PI) * 0.3;
            gsap.set(meshRef.current!.rotation, { 
              x: rotationX, 
              y: rotationY, 
              z: Math.sin(progress * Math.PI * 2) * 0.1 
            });
            
            // Position adjustments
            gsap.set(meshRef.current!.position, { 
              x: Math.sin(progress * Math.PI) * 0.5,
              y: Math.cos(progress * Math.PI * 2) * 0.2,
              z: 0
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
            
            // Dramatic cinematic movement
            const scale = 0.8 + progress * 2.2;
            gsap.set(meshRef.current!.scale, { x: scale, y: scale, z: scale });
            
            // Complex rotation for cinematic effect
            gsap.set(meshRef.current!.rotation, { 
              x: progress * Math.PI * 0.8,
              y: progress * Math.PI * 3,
              z: Math.sin(progress * Math.PI * 4) * 0.2
            });
            
            // Dynamic positioning
            gsap.set(meshRef.current!.position, {
              x: Math.cos(progress * Math.PI * 2) * 1.2,
              y: Math.sin(progress * Math.PI * 3) * 0.8,
              z: Math.sin(progress * Math.PI) * 0.5
            });
          }
        });
      }
    });

    return () => ctx.revert();
  }, [section]);

  // Continuous rotation and floating animation
  useFrame((state) => {
    if (!meshRef.current || !atmosphereRef.current) return;
    
    const time = state.clock.elapsedTime;
    
    // Base rotation (slow)
    meshRef.current.rotation.y += 0.002;
    
    // Subtle floating animation
    meshRef.current.position.y += Math.sin(time * 0.5) * 0.001;
    
    // Atmosphere animation
    atmosphereRef.current.rotation.y = meshRef.current.rotation.y * 1.1;
    
    // Update atmosphere shader time
    if (atmosphereMaterial.uniforms.time) {
      atmosphereMaterial.uniforms.time.value = time;
    }
  });

  return (
    <group>
      {/* Enhanced lighting setup */}
      <ambientLight intensity={0.15} color="#f0f8ff" />
      
      {/* Main sun light */}
      <directionalLight 
        position={[10, 5, 5]} 
        intensity={1.2}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      
      {/* Fill light */}
      <directionalLight 
        position={[-5, -2, -5]} 
        intensity={0.3}
        color="#4169e1"
      />
      
      {/* Rim light for atmosphere */}
      <pointLight 
        position={[0, 0, 8]} 
        intensity={0.5}
        color="#87ceeb"
        distance={20}
      />

      {/* Main Earth Sphere */}
      <Sphere ref={meshRef} args={[1, 128, 64]} castShadow receiveShadow>
        <meshPhongMaterial 
          map={earthTexture}
          bumpScale={0.02}
          shininess={50}
          specular={new THREE.Color('#4169e1')}
          transparent={false}
        />
      </Sphere>

      {/* Atmosphere Layer */}
      <Sphere ref={atmosphereRef} args={[1.05, 64, 32]}>
        <primitive object={atmosphereMaterial} attach="material" />
      </Sphere>

      {/* Outer glow */}
      <Sphere args={[1.08, 32, 16]}>
        <meshBasicMaterial 
          color="#4169e1"
          transparent
          opacity={0.05}
          side={THREE.BackSide}
        />
      </Sphere>
    </group>
  );
};

export default Earth3D;