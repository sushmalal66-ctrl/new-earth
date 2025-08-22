import React, { useRef, useMemo, useImperativeHandle, forwardRef, useCallback,useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';


interface ScrollEarthProps {
  scrollProgress: number;
  isInCloudTransition: boolean;
  performanceLevel?: 'high' | 'medium' | 'low';
}

interface ScrollEarthRef {
  updateScroll: (progress: number) => void;
}

const ScrollEarth = forwardRef<ScrollEarthRef, ScrollEarthProps>(({ 
  scrollProgress,
  isInCloudTransition,
  performanceLevel = 'high'
}, ref) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  
  // Performance optimization refs
  const scrollProgressRef = useRef(0);
  const lastUpdateTime = useRef(0);
  const rotationTime = useRef(0);
  
  // Memoized geometry to prevent recreation
  const geometryCache = useRef<Map<string, THREE.BufferGeometry>>(new Map());
  const materialCache = useRef<Map<string, THREE.Material>>(new Map());
  
  // Scroll following configuration
  const scrollConfig = {
    // Distance bounds (camera distance units)
    minDistance: 4.0,
    maxDistance: 6.0,
    // Y position bounds (world units)
    minY: -0.5,
    maxY: 0.5,
    // Smooth following parameters
    followSpeed: 0.05,
    easingFactor: 0.08
  };

  // Rotation configuration
  const rotationConfig = {
    // Base rotation speed (radians per second for 45-second full rotation)
    baseSpeed: (Math.PI * 2) / 45,
    // Atmosphere rotation offset multiplier
    atmosphereMultiplier: 1.03,
    // Glow counter-rotation multiplier
    glowMultiplier: -0.7
  };

  // Load Earth texture with optimization
  const earthTexture = useLoader(THREE.TextureLoader, '/assets/earth.jpg');
  
  // Configure texture for optimal performance
  useMemo(() => {
    if (earthTexture) {
      earthTexture.wrapS = THREE.RepeatWrapping;
      earthTexture.wrapT = THREE.RepeatWrapping;
      earthTexture.minFilter = THREE.LinearMipmapLinearFilter;
      earthTexture.magFilter = THREE.LinearFilter;
      earthTexture.generateMipmaps = true;
      earthTexture.anisotropy = Math.min(16, window.devicePixelRatio * 4);
    }
  }, [earthTexture]);

  // Optimized geometry creation with caching
  const getOptimizedGeometry = useCallback((key: string, segments: [number, number, number]) => {
    if (!geometryCache.current.has(key)) {
      const geometry = new THREE.SphereGeometry(...segments);
      // Optimize geometry
      geometry.computeBoundingSphere();
      geometry.computeBoundingBox();
      geometryCache.current.set(key, geometry);
    }
    return geometryCache.current.get(key)!;
  }, []);

  // Cleanup geometry cache on unmount
  useEffect(() => {
    return () => {
      geometryCache.current.forEach(geometry => geometry.dispose());
      materialCache.current.forEach(material => material.dispose());
    };
  }, []);

  // Define sphere geometry arguments based on performance level
  const sphereArgs = useMemo((): [number, number, number] => {
    switch (performanceLevel) {
      case 'high':
        return [1, 64, 32];
      case 'medium':
        return [1, 32, 16];
      case 'low':
        return [1, 16, 8];
      default:
        return [1, 32, 16];
    }
  }, [performanceLevel]);

  // Enhanced Earth material with scroll-responsive effects
  const earthMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        earthTexture: { value: earthTexture },
        time: { value: 0 },
        scrollProgress: { value: 0 },
        sunDirection: { value: new THREE.Vector3(1, 0.5, 0.5) },
        atmosphereColor: { value: new THREE.Color(0x6b7280) },
        cloudTransition: { value: 0 },
        cinematicTint: { value: new THREE.Color(0x4b5563) },
        performanceLevel: { value: performanceLevel === 'high' ? 1.0 : performanceLevel === 'medium' ? 0.5 : 0.0 }
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec3 vWorldPosition;
        uniform float time;
        uniform float scrollProgress;
        uniform float performanceLevel;
        
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
          
          // Conditional vertex displacement based on performance
          if (performanceLevel > 0.5) {
            // Only apply expensive vertex displacement on high performance
          vec3 pos = position;
          float displacement = sin(position.x * 8.0 + time * 0.5 + scrollProgress * 2.0) * 0.003 * scrollProgress;
          pos += normal * displacement;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          } else {
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        }
      `,
      fragmentShader: performanceLevel === 'high' ? `
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
          vec3 earthColor = texture2D(earthTexture, vUv).rgb;
          earthColor = mix(earthColor, earthColor * cinematicTint, 0.3);
          
          vec3 normal = normalize(vNormal);
          float sunDot = dot(normal, normalize(sunDirection));
          float lighting = max(0.4, sunDot * 1.2);
          
          vec3 color = earthColor * lighting;
          
          // Enhanced color during scroll interaction
          float enhancement = 1.0 + scrollProgress * 0.4;
          color *= enhancement;
          
          // Atmospheric rim lighting
          float atmosphere = pow(1.0 - abs(dot(normal, vec3(0.0, 0.0, 1.0))), 2.0);
          color = mix(color, atmosphereColor * 0.8, atmosphere * 0.15 * (1.0 + scrollProgress));
          
          // Cloud transition effects
          if (cloudTransition > 0.0) {
            float cloudEffect = sin(vUv.x * 15.0 + time * 1.5) * sin(vUv.y * 15.0 + time * 1.2);
            vec3 cloudColor = mix(vec3(0.9, 0.95, 1.0), atmosphereColor, 0.3);
            color = mix(color, cloudColor, cloudEffect * cloudTransition * 0.25);
          }
          
          gl_FragColor = vec4(color, 1.0);
        }
      ` : `
        // Simplified fragment shader for medium/low performance
        uniform sampler2D earthTexture;
        uniform float scrollProgress;
        uniform vec3 sunDirection;
        uniform vec3 cinematicTint;
        
        varying vec2 vUv;
        varying vec3 vNormal;
        
        void main() {
          vec3 earthColor = texture2D(earthTexture, vUv).rgb;
          earthColor = mix(earthColor, earthColor * cinematicTint, 0.3);
          
          float sunDot = dot(vNormal, normalize(sunDirection));
          float lighting = max(0.4, sunDot * 1.2);
          
          vec3 color = earthColor * lighting;
          float enhancement = 1.0 + scrollProgress * 0.4;
          color *= enhancement;
          
          gl_FragColor = vec4(color, 1.0);
        }
      `
    });
  }, [earthTexture, performanceLevel]);

  // Atmosphere material with scroll-responsive glow
  const atmosphereMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        scrollProgress: { value: 0 },
        opacity: { value: 0.2 },
        color: { value: new THREE.Color(0x6b7280) }
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        uniform float time;
        uniform float scrollProgress;
        
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          // Subtle scale animation based on scroll
          vec3 pos = position * (1.0 + scrollProgress * 0.02);
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
          
          // Enhanced glow during scroll interaction
          float scrollIntensity = 1.0 + scrollProgress * 1.5;
          float pulse = sin(time * 0.4 + scrollProgress * 2.0) * 0.15 + 0.85;
          
          gl_FragColor = vec4(atmosphere, opacity * intensity * pulse * scrollIntensity);
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
        scrollProgress: { value: 0 },
        glowColor: { value: new THREE.Color(0x4b5563) }
      },
      vertexShader: `
        varying vec3 vNormal;
        uniform float time;
        uniform float scrollProgress;
        
        void main() {
          vNormal = normalize(normalMatrix * normal);
          // Dynamic scaling based on scroll and time
          vec3 pos = position * (1.0 + scrollProgress * 0.1 + sin(time * 0.3) * 0.008);
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
          
          gl_FragColor = vec4(glowColor, intensity * 0.06 * pulse * scrollGlow);
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true
    });
  }, []);

  // Smooth easing function for natural motion
  const easeOutCubic = useCallback((t: number): number => {
    return 1 - Math.pow(1 - t, 3);
  }, []);

  // Calculate optimal position based on scroll progress
  const calculateScrollPosition = useCallback((progress: number) => {
    // Keep Earth more centered with minimal movement
    const targetDistance = scrollConfig.minDistance + (scrollConfig.maxDistance - scrollConfig.minDistance) * (1 - progress * 0.3);
    const targetY = scrollConfig.minY + (scrollConfig.maxY - scrollConfig.minY) * progress * 0.2;
    
    return { distance: targetDistance, y: targetY };
  }, [easeOutCubic]);

  // Optimized animation loop with 60fps targeting
  useFrame((state) => {
    if (!meshRef.current || !groupRef.current) return;
    
    const currentTime = state.clock.elapsedTime;
    const deltaTime = currentTime - lastUpdateTime.current;
    
    // Adaptive frame rate based on performance level
    const targetFrameTime = performanceLevel === 'high' ? 0.016 : 
                           performanceLevel === 'medium' ? 0.033 : 0.066;
    
    if (deltaTime < targetFrameTime) return;
    lastUpdateTime.current = currentTime;
    
    const progress = scrollProgressRef.current;
    
    // === CONTINUOUS ROTATION (Independent of scroll) ===
    rotationTime.current += deltaTime;
    const baseRotation = rotationTime.current * rotationConfig.baseSpeed;
    
    // Apply rotation to Earth
    meshRef.current.rotation.y = baseRotation;
    
    // Apply offset rotation to atmosphere for depth
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y = baseRotation * rotationConfig.atmosphereMultiplier;
    }
    
    // Apply counter-rotation to glow for dynamic effect
    if (glowRef.current) {
      glowRef.current.rotation.y = baseRotation * rotationConfig.glowMultiplier;
    }
    
    // === SCROLL FOLLOWING BEHAVIOR ===
    const scrollPosition = calculateScrollPosition(progress);
    
    // Smooth position interpolation using lerp
    const currentY = groupRef.current.position.y;
    const targetY = scrollPosition.y + Math.sin(currentTime * 0.2) * 0.003; // Reduced floating
    
    groupRef.current.position.y = THREE.MathUtils.lerp(
      currentY,
      targetY,
      scrollConfig.followSpeed
    );
    
    // Keep scale more stable
    const currentScale = groupRef.current.scale.x;
    const targetScale = 1.0 + progress * 0.2; // Subtle scale increase
    
    const newScale = THREE.MathUtils.lerp(
      currentScale,
      targetScale,
      scrollConfig.easingFactor
    );
    
    groupRef.current.scale.setScalar(newScale);
    
    // === SHADER UNIFORM UPDATES ===
    // Only update if progress changed significantly (performance optimization)
    if (Math.abs(progress - (meshRef.current as any).lastProgress || 0) > 0.003) {
      (meshRef.current as any).lastProgress = progress;
      
      // Update all shader uniforms
      earthMaterial.uniforms.time.value = currentTime;
      earthMaterial.uniforms.scrollProgress.value = progress;
      earthMaterial.uniforms.cloudTransition.value = isInCloudTransition ? 1.0 : 0.0;
      
      atmosphereMaterial.uniforms.time.value = currentTime;
      atmosphereMaterial.uniforms.scrollProgress.value = progress;
      
      glowMaterial.uniforms.time.value = currentTime;
      glowMaterial.uniforms.scrollProgress.value = progress;
    }
    
    // Invalidate frame to trigger re-render only when needed
    state.invalidate();
  });

  // Expose scroll update method to parent component
  useImperativeHandle(ref, () => ({
    updateScroll: (progress: number) => {
      // Clamp progress to valid range
      scrollProgressRef.current = Math.max(0, Math.min(1, progress));
    }
  }));

  // Get cached geometries
  const mainSphereGeometry = getOptimizedGeometry('main', sphereArgs);
  const atmosphereGeometry = getOptimizedGeometry('atmosphere', [1.02, Math.floor(sphereArgs[1] / 2), Math.floor(sphereArgs[2] / 2)]);
  const glowGeometry = getOptimizedGeometry('glow', [1.08, Math.floor(sphereArgs[1] / 4), Math.floor(sphereArgs[2] / 4)]);

  return (
    <group ref={groupRef}>
      {/* Optimized Lighting Setup */}
      <ambientLight intensity={0.2} color="#e5e7eb" />
      
      {/* Main directional light (sun) */}
      <directionalLight 
        position={[10, 5, 5]} 
        intensity={1.5}
        color="#d1d5db"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* Fill light */}
      <directionalLight 
        position={[-8, -3, -5]} 
        intensity={0.4}
        color="#6b7280"
      />
      
      {/* Rim light for atmosphere */}
      <pointLight 
        position={[0, 0, 8]} 
        intensity={0.8}
        color="#9ca3af"
        distance={25}
        decay={2}
      />

      {/* Main Earth Sphere */}
      <mesh ref={meshRef} geometry={mainSphereGeometry} castShadow={performanceLevel === 'high'} receiveShadow={performanceLevel === 'high'}>
        <primitive object={earthMaterial} attach="material" />
      </mesh>

      {/* Atmosphere Layer */}
      <mesh ref={atmosphereRef} geometry={atmosphereGeometry}>
        <primitive object={atmosphereMaterial} attach="material" />
      </mesh>

      {/* Outer Glow Effect */}
      <mesh ref={glowRef} geometry={glowGeometry}>
        <primitive object={glowMaterial} attach="material" />
      </mesh>

      {/* Additional subtle glow layers for depth */}
      {performanceLevel === 'high' && (
        <>
          <mesh geometry={getOptimizedGeometry('glow1', [1.15, 16, 8])}>
        <meshBasicMaterial 
          color="#6b7280"
          transparent
          opacity={0.025}
          side={THREE.BackSide}
        />
          </mesh>
      
          <mesh geometry={getOptimizedGeometry('glow2', [1.25, 12, 6])}>
        <meshBasicMaterial 
          color="#9ca3af"
          transparent
          opacity={0.015}
          side={THREE.BackSide}
        />
          </mesh>
        </>
      )}
    </group>
  );
});

ScrollEarth.displayName = 'ScrollEarth';

export default ScrollEarth;