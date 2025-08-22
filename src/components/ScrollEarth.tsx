import React, { useRef, useMemo, useImperativeHandle, forwardRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import { MotionValue } from 'framer-motion';
import * as THREE from 'three';

interface ScrollEarthProps {
  scrollProgress: number;
  isInCloudTransition: boolean;
  opacity: MotionValue<number>;
}

interface ScrollEarthRef {
  updateScroll: (progress: number) => void;
}

const ScrollEarth = forwardRef<ScrollEarthRef, ScrollEarthProps>(({ 
  scrollProgress, 
  isInCloudTransition,
  opacity
}, ref) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const scrollProgressRef = useRef(0);

  // Load Earth texture from assets
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

  // Enhanced Earth material with cinematic blue/gray color scheme
  const earthMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        earthTexture: { value: earthTexture },
        time: { value: 0 },
        scrollProgress: { value: 0 },
        sunDirection: { value: new THREE.Vector3(1, 0.5, 0.5) },
        atmosphereColor: { value: new THREE.Color(0x94a3b8) }, // Slate-400
        cloudTransition: { value: 0 },
        cinematicTint: { value: new THREE.Color(0x64748b) } // Slate-500
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec3 vWorldPosition;
        uniform float time;
        uniform float scrollProgress;
        
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
          
          // Subtle vertex displacement for organic feel
          vec3 pos = position;
          float displacement = sin(position.x * 8.0 + time * 0.5 + scrollProgress * 2.0) * 0.005 * scrollProgress;
          pos += normal * displacement;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D earthTexture;
        uniform float time;
        uniform float scrollProgress;
        uniform vec3 sunDirection;
        uniform vec3 atmosphereColor;
        uniform vec3 cinematicTint;
        uniform float cloudTransition;
        
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec3 vWorldPosition;
        
        void main() {
          // Sample Earth texture
          vec3 earthColor = texture2D(earthTexture, vUv).rgb;
          
          // Apply cinematic blue/gray tinting
          earthColor = mix(earthColor, earthColor * cinematicTint, 0.3);
          
          // Calculate lighting with enhanced contrast
          vec3 normal = normalize(vNormal);
          float sunDot = dot(normal, normalize(sunDirection));
          float lighting = max(0.4, sunDot * 1.2);
          
          // Apply lighting to Earth color
          vec3 color = earthColor * lighting;
          
          // Scroll-based enhancement with cinematic feel
          float enhancement = 1.0 + scrollProgress * 0.4;
          color *= enhancement;
          
          // Atmospheric scattering with blue tint
          float atmosphere = pow(1.0 - abs(dot(normal, vec3(0.0, 0.0, 1.0))), 2.0);
          color = mix(color, atmosphereColor * 0.8, atmosphere * 0.15 * (1.0 + scrollProgress));
          
          // Cloud transition effect with cinematic colors
          if (cloudTransition > 0.0) {
            float cloudEffect = sin(vUv.x * 15.0 + time * 1.5) * sin(vUv.y * 15.0 + time * 1.2);
            vec3 cloudColor = mix(vec3(0.9, 0.95, 1.0), atmosphereColor, 0.3);
            color = mix(color, cloudColor, cloudEffect * cloudTransition * 0.25);
          }
          
          gl_FragColor = vec4(color, 1.0);
        }
      `
    });
  }, [earthTexture]);

  // Cinematic atmosphere material with blue/gray theme
  const atmosphereMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        scrollProgress: { value: 0 },
        opacity: { value: 0.2 },
        color: { value: new THREE.Color(0x94a3b8) } // Slate-400
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        uniform float time;
        uniform float scrollProgress;
        
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          
          // Scroll-based expansion
          vec3 pos = position * (1.0 + scrollProgress * 0.03);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform float scrollProgress;
        uniform float opacity;
        uniform vec3 color;
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          float intensity = pow(0.8 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          vec3 atmosphere = color * intensity;
          
          // Enhanced scroll-based intensity
          float scrollIntensity = 1.0 + scrollProgress * 1.5;
          
          // Cinematic pulsing
          float pulse = sin(time * 0.4 + scrollProgress * 2.0) * 0.15 + 0.85;
          
          gl_FragColor = vec4(atmosphere, opacity * intensity * pulse * scrollIntensity);
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true
    });
  }, []);

  // Enhanced glow material with cinematic colors
  const glowMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        scrollProgress: { value: 0 },
        glowColor: { value: new THREE.Color(0x64748b) } // Slate-500
      },
      vertexShader: `
        varying vec3 vNormal;
        uniform float time;
        uniform float scrollProgress;
        
        void main() {
          vNormal = normalize(normalMatrix * normal);
          
          // Dynamic glow expansion
          vec3 pos = position * (1.0 + scrollProgress * 0.15 + sin(time * 0.3) * 0.01);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform float scrollProgress;
        uniform vec3 glowColor;
        varying vec3 vNormal;
        
        void main() {
          float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
          float pulse = sin(time * 0.5 + scrollProgress * 1.5) * 0.2 + 0.8;
          float scrollGlow = 1.0 + scrollProgress * 2.0;
          
          gl_FragColor = vec4(glowColor, intensity * 0.08 * pulse * scrollGlow);
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true
    });
  }, []);

  // Optimized animation loop with proper bounds
  useFrame((state) => {
    if (!meshRef.current || !groupRef.current) return;
    
    const time = state.clock.elapsedTime;
    const progress = Math.max(0, Math.min(1, scrollProgressRef.current));
    
    // Smooth Earth rotation with scroll influence
    const baseRotation = time * 0.003;
    const scrollRotation = progress * Math.PI * 0.3;
    meshRef.current.rotation.y = baseRotation + scrollRotation;
    
    // Atmosphere rotation with slight offset
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y = baseRotation * 1.05 + scrollRotation * 0.9;
    }
    
    // Counter-rotating glow for depth
    if (glowRef.current) {
      glowRef.current.rotation.y = -baseRotation * 0.7 + scrollRotation * 0.4;
    }
    
    // Update shader uniforms
    earthMaterial.uniforms.time.value = time;
    earthMaterial.uniforms.scrollProgress.value = progress;
    earthMaterial.uniforms.cloudTransition.value = isInCloudTransition ? 1.0 : 0.0;
    
    atmosphereMaterial.uniforms.time.value = time;
    atmosphereMaterial.uniforms.scrollProgress.value = progress;
    
    glowMaterial.uniforms.time.value = time;
    glowMaterial.uniforms.scrollProgress.value = progress;
    
    // Controlled positioning with proper bounds
    const floatY = Math.sin(time * 0.2) * 0.01;
    const scrollY = -progress * 1.5; // Reduced for better visibility
    groupRef.current.position.y = floatY + scrollY;
    
    // Controlled scale changes with bounds
    const scrollScale = Math.max(0.8, Math.min(3.5, 1 + progress * 1.8));
    groupRef.current.scale.setScalar(scrollScale);
    
    // Ensure Earth never gets too close or disappears
    const minDistance = 2;
    const maxDistance = 8;
    const currentDistance = groupRef.current.position.z;
    if (currentDistance < minDistance || currentDistance > maxDistance) {
      groupRef.current.position.z = THREE.MathUtils.clamp(currentDistance, minDistance, maxDistance);
    }
  });

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    updateScroll: (progress: number) => {
      scrollProgressRef.current = Math.max(0, Math.min(1, progress));
    }
  }));

  return (
    <group ref={groupRef}>
      {/* Enhanced Lighting Setup with cinematic colors */}
      <ambientLight intensity={0.25} color="#f1f5f9" /> {/* Slate-100 */}
      
      {/* Main sun light with blue tint */}
      <directionalLight 
        position={[10, 5, 5]} 
        intensity={1.8}
        color="#e2e8f0" // Slate-200
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      
      {/* Fill light with cinematic blue */}
      <directionalLight 
        position={[-8, -3, -5]} 
        intensity={0.4}
        color="#64748b" // Slate-500
      />
      
      {/* Rim light for atmosphere */}
      <pointLight 
        position={[0, 0, 8]} 
        intensity={0.8}
        color="#94a3b8" // Slate-400
        distance={25}
        decay={2}
      />

      {/* Main Earth Sphere - SINGLE INSTANCE */}
      <Sphere ref={meshRef} args={[1, 128, 64]} castShadow receiveShadow>
        <primitive object={earthMaterial} attach="material" />
      </Sphere>

      {/* Atmosphere Layer */}
      <Sphere ref={atmosphereRef} args={[1.02, 64, 32]}>
        <primitive object={atmosphereMaterial} attach="material" />
      </Sphere>

      {/* Outer Glow Effect */}
      <Sphere ref={glowRef} args={[1.08, 32, 16]}>
        <primitive object={glowMaterial} attach="material" />
      </Sphere>

      {/* Additional cinematic glow layers */}
      <Sphere args={[1.15, 16, 8]}>
        <meshBasicMaterial 
          color="#64748b" // Slate-500
          transparent
          opacity={0.03}
          side={THREE.BackSide}
        />
      </Sphere>
      
      <Sphere args={[1.25, 12, 6]}>
        <meshBasicMaterial 
          color="#94a3b8" // Slate-400
          transparent
          opacity={0.02}
          side={THREE.BackSide}
        />
      </Sphere>
    </group>
  );
});

ScrollEarth.displayName = 'ScrollEarth';

export default ScrollEarth;