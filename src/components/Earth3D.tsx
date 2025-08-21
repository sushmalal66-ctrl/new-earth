import React, { useRef, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';

const Earth3D: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  // Load Earth texture
  const earthTexture = useLoader(THREE.TextureLoader, '/assets/earth.jpg');
  
  // Configure texture for optimal quality
  useMemo(() => {
    if (earthTexture) {
      earthTexture.wrapS = THREE.RepeatWrapping;
      earthTexture.wrapT = THREE.RepeatWrapping;
      earthTexture.minFilter = THREE.LinearMipmapLinearFilter;
      earthTexture.magFilter = THREE.LinearFilter;
      earthTexture.generateMipmaps = true;
      earthTexture.anisotropy = 16;
    }
  }, [earthTexture]);

  // Enhanced Earth material with realistic lighting
  const earthMaterial = useMemo(() => {
    return new THREE.MeshPhongMaterial({
      map: earthTexture,
      bumpScale: 0.05,
      shininess: 100,
      specular: new THREE.Color(0x4169e1),
      transparent: false,
    });
  }, [earthTexture]);

  // Atmosphere shader material for realistic glow
  const atmosphereMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        opacity: { value: 0.2 },
        glowColor: { value: new THREE.Color(0x87ceeb) }
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
        uniform vec3 glowColor;
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          float intensity = pow(0.8 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          vec3 atmosphere = glowColor * intensity;
          
          // Add subtle animation
          float pulse = sin(time * 0.8) * 0.1 + 0.9;
          
          gl_FragColor = vec4(atmosphere, opacity * intensity * pulse);
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true
    });
  }, []);

  // Outer glow material
  const glowMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        glowColor: { value: new THREE.Color(0x4169e1) }
      },
      vertexShader: `
        varying vec3 vNormal;
        uniform float time;
        
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec3 pos = position * (1.0 + sin(time * 0.5) * 0.01);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 glowColor;
        varying vec3 vNormal;
        
        void main() {
          float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
          float pulse = sin(time * 0.6) * 0.2 + 0.8;
          gl_FragColor = vec4(glowColor, intensity * 0.15 * pulse);
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true
    });
  }, []);

  // Smooth rotation animation
  useFrame((state) => {
    if (!meshRef.current || !atmosphereRef.current || !glowRef.current) return;
    
    const time = state.clock.elapsedTime;
    
    // Smooth Earth rotation
    meshRef.current.rotation.y += 0.003;
    
    // Slightly faster atmosphere rotation for depth
    atmosphereRef.current.rotation.y = meshRef.current.rotation.y * 1.02;
    
    // Counter-rotating glow for dynamic effect
    glowRef.current.rotation.y = -meshRef.current.rotation.y * 0.5;
    
    // Subtle floating animation
    const floatY = Math.sin(time * 0.4) * 0.05;
    meshRef.current.position.y = floatY;
    atmosphereRef.current.position.y = floatY;
    glowRef.current.position.y = floatY;
    
    // Update shader uniforms
    if (atmosphereMaterial.uniforms.time) {
      atmosphereMaterial.uniforms.time.value = time;
    }
    if (glowMaterial.uniforms.time) {
      glowMaterial.uniforms.time.value = time;
    }
  });

  return (
    <group>
      {/* Enhanced Lighting Setup */}
      <ambientLight intensity={0.15} color="#f0f8ff" />
      
      {/* Main directional light (sun) */}
      <directionalLight 
        position={[10, 5, 5]} 
        intensity={1.8}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* Fill light from opposite side */}
      <directionalLight 
        position={[-8, -3, -5]} 
        intensity={0.4}
        color="#4169e1"
      />
      
      {/* Rim light for atmosphere effect */}
      <pointLight 
        position={[0, 0, 8]} 
        intensity={0.6}
        color="#87ceeb"
        distance={25}
        decay={2}
      />

      {/* Additional accent lights */}
      <pointLight 
        position={[5, 5, 0]} 
        intensity={0.3}
        color="#ffffff"
        distance={15}
      />
      
      <pointLight 
        position={[-5, -5, 0]} 
        intensity={0.2}
        color="#4169e1"
        distance={15}
      />

      {/* Main Earth Sphere */}
      <Sphere ref={meshRef} args={[1.8, 128, 64]} castShadow receiveShadow>
        <primitive object={earthMaterial} attach="material" />
      </Sphere>

      {/* Atmosphere Layer */}
      <Sphere ref={atmosphereRef} args={[1.85, 64, 32]}>
        <primitive object={atmosphereMaterial} attach="material" />
      </Sphere>

      {/* Outer Glow Effect */}
      <Sphere ref={glowRef} args={[1.95, 32, 16]}>
        <primitive object={glowMaterial} attach="material" />
      </Sphere>

      {/* Additional subtle glow layers */}
      <Sphere args={[2.1, 16, 8]}>
        <meshBasicMaterial 
          color="#4169e1"
          transparent
          opacity={0.03}
          side={THREE.BackSide}
        />
      </Sphere>
      
      <Sphere args={[2.3, 12, 6]}>
        <meshBasicMaterial 
          color="#87ceeb"
          transparent
          opacity={0.02}
          side={THREE.BackSide}
        />
      </Sphere>
    </group>
  );
};

export default Earth3D;