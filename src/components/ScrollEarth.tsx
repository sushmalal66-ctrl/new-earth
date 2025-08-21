import React, { useRef, useMemo, useImperativeHandle, forwardRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';

interface ScrollEarthProps {
  scrollProgress: number;
  isInCloudTransition: boolean;
}

interface ScrollEarthRef {
  updateScroll: (progress: number) => void;
}

const ScrollEarth = forwardRef<ScrollEarthRef, ScrollEarthProps>(({ 
  scrollProgress, 
  isInCloudTransition 
}, ref) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const scrollProgressRef = useRef(0);

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

  // Enhanced Earth material with scroll-responsive effects
  const earthMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        earthTexture: { value: earthTexture },
        time: { value: 0 },
        scrollProgress: { value: 0 },
        sunDirection: { value: new THREE.Vector3(1, 0.5, 0.5) },
        atmosphereColor: { value: new THREE.Color(0x87ceeb) },
        cloudTransition: { value: 0 }
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
          
          // Add subtle vertex displacement based on scroll
          vec3 pos = position;
          float displacement = sin(position.x * 10.0 + time + scrollProgress * 5.0) * 0.01 * scrollProgress;
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
        uniform float cloudTransition;
        
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec3 vWorldPosition;
        
        void main() {
          // Sample Earth texture
          vec3 earthColor = texture2D(earthTexture, vUv).rgb;
          
          // Calculate lighting
          vec3 normal = normalize(vNormal);
          float sunDot = dot(normal, normalize(sunDirection));
          float lighting = max(0.3, sunDot);
          
          // Apply lighting to Earth color
          vec3 color = earthColor * lighting;
          
          // Add scroll-based color enhancement
          float enhancement = 1.0 + scrollProgress * 0.3;
          color *= enhancement;
          
          // Add atmospheric scattering effect
          float atmosphere = pow(1.0 - abs(dot(normal, vec3(0.0, 0.0, 1.0))), 2.0);
          color = mix(color, atmosphereColor, atmosphere * 0.1 * (1.0 + scrollProgress));
          
          // Add cloud transition effect
          if (cloudTransition > 0.0) {
            float cloudEffect = sin(vUv.x * 20.0 + time * 2.0) * sin(vUv.y * 20.0 + time * 1.5);
            color = mix(color, vec3(1.0), cloudEffect * cloudTransition * 0.3);
          }
          
          gl_FragColor = vec4(color, 1.0);
        }
      `
    });
  }, [earthTexture]);

  // Dynamic atmosphere material
  const atmosphereMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        scrollProgress: { value: 0 },
        opacity: { value: 0.15 },
        color: { value: new THREE.Color(0x87ceeb) }
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        uniform float time;
        uniform float scrollProgress;
        
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          
          // Add scroll-based vertex animation
          vec3 pos = position * (1.0 + scrollProgress * 0.05);
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
          
          // Add scroll-based intensity changes
          float scrollIntensity = 1.0 + scrollProgress * 2.0;
          
          // Add subtle animation
          float pulse = sin(time * 0.5 + scrollProgress * 3.0) * 0.2 + 0.8;
          
          gl_FragColor = vec4(atmosphere, opacity * intensity * pulse * scrollIntensity);
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true
    });
  }, []);

  // Outer glow material with scroll responsiveness
  const glowMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        scrollProgress: { value: 0 },
        glowColor: { value: new THREE.Color(0x4169e1) }
      },
      vertexShader: `
        varying vec3 vNormal;
        uniform float time;
        uniform float scrollProgress;
        
        void main() {
          vNormal = normalize(normalMatrix * normal);
          
          // Expand glow based on scroll
          vec3 pos = position * (1.0 + scrollProgress * 0.2 + sin(time * 0.5) * 0.02);
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
          float pulse = sin(time * 0.6 + scrollProgress * 2.0) * 0.3 + 0.7;
          float scrollGlow = 1.0 + scrollProgress * 3.0;
          
          gl_FragColor = vec4(glowColor, intensity * 0.1 * pulse * scrollGlow);
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true
    });
  }, []);

  // Animation loop with scroll integration
  useFrame((state) => {
    if (!meshRef.current || !groupRef.current) return;
    
    const time = state.clock.elapsedTime;
    const progress = scrollProgressRef.current;
    
    // Continuous Earth rotation with scroll influence
    const baseRotation = time * 0.002;
    const scrollRotation = progress * Math.PI * 0.5;
    meshRef.current.rotation.y = baseRotation + scrollRotation;
    
    // Dynamic atmosphere rotation
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y = baseRotation * 1.1 + scrollRotation * 0.8;
    }
    
    // Counter-rotating glow
    if (glowRef.current) {
      glowRef.current.rotation.y = -baseRotation * 0.5 + scrollRotation * 0.3;
    }
    
    // Update shader uniforms
    earthMaterial.uniforms.time.value = time;
    earthMaterial.uniforms.scrollProgress.value = progress;
    earthMaterial.uniforms.cloudTransition.value = isInCloudTransition ? 1.0 : 0.0;
    
    atmosphereMaterial.uniforms.time.value = time;
    atmosphereMaterial.uniforms.scrollProgress.value = progress;
    
    glowMaterial.uniforms.time.value = time;
    glowMaterial.uniforms.scrollProgress.value = progress;
    
    // Dynamic positioning based on scroll
    const floatY = Math.sin(time * 0.3) * 0.02;
    const scrollY = -progress * 2;
    groupRef.current.position.y = floatY + scrollY;
    
    // Scale changes based on scroll
    const scrollScale = 1 + progress * 2;
    groupRef.current.scale.setScalar(scrollScale);
  });

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    updateScroll: (progress: number) => {
      scrollProgressRef.current = progress;
    }
  }));

  return (
    <group ref={groupRef}>
      {/* Enhanced Lighting Setup */}
      <ambientLight intensity={0.2} color="#f0f8ff" />
      
      {/* Main sun light with scroll-responsive intensity */}
      <directionalLight 
        position={[10, 5, 5]} 
        intensity={1.5 + scrollProgress * 0.5}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      
      {/* Fill light */}
      <directionalLight 
        position={[-8, -3, -5]} 
        intensity={0.3 + scrollProgress * 0.2}
        color="#4169e1"
      />
      
      {/* Dynamic rim light */}
      <pointLight 
        position={[0, 0, 8]} 
        intensity={0.6 + scrollProgress * 0.4}
        color="#87ceeb"
        distance={25}
        decay={2}
      />

      {/* Main Earth Sphere */}
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

      {/* Additional glow layers for depth */}
      <Sphere args={[1.15, 16, 8]}>
        <meshBasicMaterial 
          color="#4169e1"
          transparent
          opacity={0.02 + scrollProgress * 0.03}
          side={THREE.BackSide}
        />
      </Sphere>
    </group>
  );
});

ScrollEarth.displayName = 'ScrollEarth';

export default ScrollEarth;