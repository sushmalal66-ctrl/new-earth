import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { MotionValue } from 'framer-motion';
import * as THREE from 'three';

interface EarthProps {
  earthProgress: MotionValue<number>;
}

const Earth: React.FC<EarthProps> = ({ earthProgress }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  
  // Load textures - using local earth.jpg asset
  const earthTexture = useLoader(TextureLoader, '/assets/earth.jpg');

  // Configure textures
  useMemo(() => {
    if (earthTexture) {
      earthTexture.wrapS = THREE.RepeatWrapping;
      earthTexture.wrapT = THREE.RepeatWrapping;
      earthTexture.anisotropy = 16;
      earthTexture.generateMipmaps = true;
    }
  }, [earthTexture]);

  // Create a futuristic night texture with neon city lights
  const nightTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Dark space background
      const gradient = ctx.createLinearGradient(0, 0, 1024, 512);
      gradient.addColorStop(0, '#0a0a0f');
      gradient.addColorStop(0.5, '#1a1a2e');
      gradient.addColorStop(1, '#0a0a0f');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1024, 512);
      
      // Add futuristic city lights in cyan/blue spectrum
      const lightColors = ['#00ffff', '#0080ff', '#004080', '#80ffff'];
      ctx.globalCompositeOperation = 'lighter';
      
      for (let i = 0; i < 200; i++) {
        const x = Math.random() * 1024;
        const y = Math.random() * 512;
        const size = Math.random() * 3 + 1;
        const color = lightColors[Math.floor(Math.random() * lightColors.length)];
        
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        
        // Add glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = color;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }, []);

  // Create futuristic clouds texture
  const cloudsTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, 512, 256);
      
      // Add semi-transparent cloud patterns with blue tint
      ctx.fillStyle = '#80a0ff';
      ctx.globalAlpha = 0.2;
      for (let i = 0; i < 80; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 256;
        const size = Math.random() * 25 + 10;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }, []);

  // Create enhanced normal texture
  const normalTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Base normal map (pointing up)
      ctx.fillStyle = '#8080ff';
      ctx.fillRect(0, 0, 512, 256);
      
      // Add more dramatic variations for depth
      ctx.globalAlpha = 0.3;
      for (let i = 0; i < 300; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 256;
        const size = Math.random() * 8 + 3;
        ctx.fillStyle = Math.random() > 0.5 ? '#a0a0ff' : '#6060ff';
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }, []);

  // Configure all textures
  useMemo(() => {
    [earthTexture, nightTexture, cloudsTexture, normalTexture].forEach(texture => {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.anisotropy = 16;
      texture.generateMipmaps = true;
    });
  }, [earthTexture, nightTexture, cloudsTexture, normalTexture]);

  // Enhanced Earth material with futuristic shader
  const earthMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        dayTexture: { value: earthTexture },
        nightTexture: { value: nightTexture },
        normalTexture: { value: normalTexture },
        sunDirection: { value: new THREE.Vector3(1, 0.5, 0.5) },
        time: { value: 0 },
        progress: { value: 0 },
        atmosphereColor: { value: new THREE.Color(0x00ffff) },
        glowIntensity: { value: 0.3 }
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec3 vWorldPosition;
        uniform float time;
        uniform float progress;
        
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
          
          // Enhanced vertex displacement with spinning effect
          vec3 pos = position;
          float spinEffect = sin(position.x * 8.0 + time * 2.0) * 0.003 * (1.0 + progress);
          float waveEffect = cos(position.y * 6.0 + time * 1.5) * 0.002 * progress;
          pos += normal * (spinEffect + waveEffect);
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D dayTexture;
        uniform sampler2D nightTexture;
        uniform sampler2D normalTexture;
        uniform vec3 sunDirection;
        uniform float time;
        uniform float progress;
        uniform vec3 atmosphereColor;
        uniform float glowIntensity;
        
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec3 vWorldPosition;
        
        void main() {
          vec3 dayColor = texture2D(dayTexture, vUv).rgb;
          vec3 nightColor = texture2D(nightTexture, vUv).rgb * 0.8;
          vec3 normal = normalize(vNormal);
          
          // Enhanced normal mapping with animation
          vec3 normalMap = texture2D(normalTexture, vUv + time * 0.01).rgb * 2.0 - 1.0;
          normal = normalize(normal + normalMap * 0.2);
          
          // Dynamic day/night transition
          vec3 sunDir = normalize(sunDirection);
          float sunDot = dot(normal, sunDir);
          float dayNightMix = smoothstep(-0.2, 0.2, sunDot);
          
          // Base color mixing
          vec3 color = mix(nightColor, dayColor, dayNightMix);
          
          // Futuristic enhancements
          float enhancement = 1.0 + progress * 0.5;
          color *= enhancement;
          
          // Atmospheric rim lighting with cyan tint
          vec3 viewDirection = normalize(vWorldPosition - cameraPosition);
          float rim = 1.0 - abs(dot(viewDirection, normal));
          float atmosphere = pow(rim, 2.0);
          color = mix(color, atmosphereColor * 1.5, atmosphere * glowIntensity * (0.3 + progress * 0.4));
          
          // Dynamic glow effects during transitions
          if (progress > 0.1) {
            float glow = sin(time * 3.0 + vPosition.x * 8.0) * 0.15 + 0.85;
            float pulseGlow = sin(time * 1.5) * 0.1 + 0.9;
            color *= glow * pulseGlow;
          }
          
          // Add subtle blue tint for futuristic feel
          color = mix(color, color * vec3(0.9, 0.95, 1.1), 0.1);
          
          gl_FragColor = vec4(color, 1.0);
        }
      `
    });
  }, [earthTexture, nightTexture, normalTexture]);

  // Enhanced atmosphere material with futuristic effects
  const atmosphereMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        progress: { value: 0 },
        opacity: { value: 0.2 },
        color: { value: new THREE.Color(0x00ffff) },
        pulseIntensity: { value: 1.0 }
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        uniform float progress;
        uniform float time;
        
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          
          // Dynamic scaling based on progress with pulsing effect
          float pulse = sin(time * 2.0) * 0.05 + 1.0;
          vec3 pos = position * (1.0 + progress * 0.05 * pulse);
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform float progress;
        uniform float opacity;
        uniform vec3 color;
        uniform float pulseIntensity;
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
          
          // Multi-layered pulsing effect
          float pulse1 = sin(time * 1.0 + vPosition.y * 2.0) * 0.3 + 0.7;
          float pulse2 = cos(time * 1.5 + vPosition.x * 1.5) * 0.2 + 0.8;
          float combinedPulse = pulse1 * pulse2;
          
          // Progress-based intensity multiplier
          float progressIntensity = 1.0 + progress * 3.0;
          
          vec3 atmosphere = color * intensity * combinedPulse * progressIntensity;
          
          // Add scanning lines effect
          float scanlines = sin(vPosition.y * 50.0 + time * 5.0) * 0.05 + 0.95;
          atmosphere *= scanlines;
          
          gl_FragColor = vec4(atmosphere, opacity * intensity * combinedPulse * progressIntensity * pulseIntensity);
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true
    });
  }, []);

  // Enhanced clouds material
  const cloudsMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        cloudsTexture: { value: cloudsTexture },
        time: { value: 0 },
        progress: { value: 0 },
        opacity: { value: 0.4 }
      },
      vertexShader: `
        varying vec2 vUv;
        uniform float time;
        
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D cloudsTexture;
        uniform float time;
        uniform float progress;
        uniform float opacity;
        varying vec2 vUv;
        
        void main() {
          // Animated cloud movement
          vec2 animatedUv = vUv + vec2(time * 0.02, sin(time * 0.01) * 0.01);
          vec3 clouds = texture2D(cloudsTexture, animatedUv).rgb;
          
          // Add some turbulence
          float turbulence = sin(animatedUv.x * 20.0 + time) * sin(animatedUv.y * 15.0 + time * 0.7);
          clouds *= (0.8 + turbulence * 0.2);
          
          // Progress-based enhancement
          float enhancement = 1.0 + progress * 0.5;
          clouds *= enhancement;
          
          // Blue tint for futuristic look
          clouds *= vec3(0.7, 0.9, 1.3);
          
          float alpha = clouds.r * opacity * (0.6 + progress * 0.4);
          gl_FragColor = vec4(clouds, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending
    });
  }, [cloudsTexture]);

  // Enhanced animation loop with continuous spinning
  useFrame((state) => {
    if (!meshRef.current || !groupRef.current) return;
    
    const time = state.clock.elapsedTime;
    const progress = earthProgress.get();
    
    // CONTINUOUS SPINNING - Always rotating regardless of scroll
    const baseSpeed = 0.4; // Steady rotation speed
    const progressMultiplier = 1 + progress * 1.5; // Moderate speed increase with scroll
    
    // Main Earth spinning - ALWAYS rotating
    meshRef.current.rotation.y = time * baseSpeed * progressMultiplier;
    meshRef.current.rotation.x = Math.sin(time * 0.1) * 0.05; // Subtle wobble
    
    // Clouds rotate independently for dynamic layering
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y = time * 0.6 * progressMultiplier; // Same direction, different speed
      cloudsRef.current.rotation.z = Math.sin(time * 0.2) * 0.03;
    }
    
    // Atmosphere rotates with subtle variations
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y = time * 0.3 * progressMultiplier;
      atmosphereRef.current.rotation.x = Math.cos(time * 0.15) * 0.02;
    }
    
    // Subtle orbital movement for the entire group
    groupRef.current.rotation.x = Math.sin(time * 0.1) * 0.03;
    groupRef.current.rotation.z = Math.cos(time * 0.12) * 0.02;
    
    // Gentle scaling and floating animation
    const scale = 1.0 + progress * 0.2;
    const pulse = Math.sin(time * 1.5) * 0.01 + 1;
    groupRef.current.scale.setScalar(scale * pulse);
    
    // Gentle floating motion
    groupRef.current.position.y = Math.sin(time * 0.3) * 0.05 + Math.cos(time * 0.4) * 0.02;
    groupRef.current.position.x = Math.sin(time * 0.25) * 0.02;
    
    // Subtle camera movement for cinematic effect
    const cameraDistance = 5 - progress * 1;
    state.camera.position.z = cameraDistance + Math.sin(time * 0.08) * 0.1;
    
    // Update shader uniforms
    earthMaterial.uniforms.time.value = time;
    earthMaterial.uniforms.progress.value = progress;
    earthMaterial.uniforms.glowIntensity.value = 0.3 + progress * 0.5;
    
    atmosphereMaterial.uniforms.time.value = time;
    atmosphereMaterial.uniforms.progress.value = progress;
    atmosphereMaterial.uniforms.pulseIntensity.value = 1.0 + Math.sin(time * 1.5) * 0.3;
    
    cloudsMaterial.uniforms.time.value = time;
    cloudsMaterial.uniforms.progress.value = progress;
    
    // Dynamic sun direction with more movement
    const sunAngle = progress * Math.PI + time * 0.05;
    earthMaterial.uniforms.sunDirection.value.set(
      Math.cos(sunAngle),
      Math.sin(sunAngle * 0.7) * 0.8,
      Math.sin(sunAngle) * 0.6
    );
  });

  // Enhanced hover effects for desktop
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!groupRef.current || window.innerWidth < 768) return;
      
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      
      // More responsive mouse interaction
      groupRef.current.rotation.x += y * 0.05;
      groupRef.current.rotation.z += x * 0.05;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <group ref={groupRef}>
      {/* Enhanced lighting setup */}
      <ambientLight intensity={0.1} color="#001122" />
      
      <directionalLight 
        position={[10, 5, 5]} 
        intensity={1.8}
        color="#ffffff"
        castShadow={false}
      />
      
      <directionalLight 
        position={[-5, -2, -5]} 
        intensity={0.5}
        color="#00aaff"
      />
      
      <pointLight 
        position={[0, 0, 8]} 
        intensity={0.8}
        color="#00ffff"
        distance={25}
      />

      {/* Main Earth Sphere with enhanced geometry */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <sphereGeometry args={[1, 128, 64]} />
        <primitive object={earthMaterial} attach="material" />
      </mesh>

      {/* Enhanced Cloud Layer */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[1.008, 64, 32]} />
        <primitive object={cloudsMaterial} attach="material" />
      </mesh>

      {/* Enhanced Atmosphere */}
      <mesh ref={atmosphereRef}>
        <sphereGeometry args={[1.025, 64, 32]} />
        <primitive object={atmosphereMaterial} attach="material" />
      </mesh>

      {/* Secondary Atmosphere Layer */}
      <mesh>
        <sphereGeometry args={[1.04, 32, 16]} />
        <meshBasicMaterial 
          color="#00ffff"
          transparent
          opacity={0.05}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Outer Energy Field */}
      <mesh>
        <sphereGeometry args={[1.15, 16, 8]} />
        <meshBasicMaterial 
          color="#0080ff"
          transparent
          opacity={0.02}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
};

export default Earth;
