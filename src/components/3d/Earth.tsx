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
  
  // Load textures - using local earth.jpg asset with error handling
  let earthTexture;
  try {
    earthTexture = useLoader(TextureLoader, '/assets/earth.jpg');
  } catch (error) {
    console.warn('Earth texture failed to load:', error);
    earthTexture = null;
  }

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
    [earthTexture, nightTexture, cloudsTexture, normalTexture].filter(Boolean).forEach(texture => {
      if (texture) {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.anisotropy = 16;
        texture.generateMipmaps = true;
      }
    });
  }, [earthTexture, nightTexture, cloudsTexture, normalTexture]);

  // Enhanced Earth material - simplified for better rotation visibility
  const earthMaterial = useMemo(() => {
    // Fallback to simple material if texture loading fails
    if (!earthTexture) {
      return new THREE.MeshStandardMaterial({
        color: '#4a90e2',
        roughness: 0.7,
        metalness: 0.1,
        map: nightTexture
      });
    }

    return new THREE.ShaderMaterial({
      uniforms: {
        dayTexture: { value: earthTexture },
        nightTexture: { value: nightTexture },
        normalTexture: { value: normalTexture },
        sunDirection: { value: new THREE.Vector3(1, 0.5, 0.5) },
        time: { value: 0 },
        progress: { value: 0 },
        atmosphereColor: { value: new THREE.Color(0x00ffff) },
        glowIntensity: { value: 0.2 } // Reduced intensity
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
          
          // Minimal vertex displacement to preserve texture clarity
          vec3 pos = position;
          float subtleEffect = sin(position.x * 4.0 + time * 1.0) * 0.001 * progress;
          pos += normal * subtleEffect;
          
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
          vec3 nightColor = texture2D(nightTexture, vUv).rgb * 0.6;
          vec3 normal = normalize(vNormal);
          
          // Simple normal mapping
          vec3 normalMap = texture2D(normalTexture, vUv + time * 0.005).rgb * 2.0 - 1.0;
          normal = normalize(normal + normalMap * 0.1);
          
          // Day/night transition
          vec3 sunDir = normalize(sunDirection);
          float sunDot = dot(normal, sunDir);
          float dayNightMix = smoothstep(-0.1, 0.1, sunDot);
          
          // Base color mixing with better contrast
          vec3 color = mix(nightColor, dayColor, dayNightMix);
          
          // Subtle enhancement
          float enhancement = 1.0 + progress * 0.3;
          color *= enhancement;
          
          // Reduced atmospheric effects for better texture visibility
          vec3 viewDirection = normalize(vWorldPosition - cameraPosition);
          float rim = 1.0 - abs(dot(viewDirection, normal));
          float atmosphere = pow(rim, 3.0);
          color = mix(color, atmosphereColor * 0.8, atmosphere * glowIntensity * (0.2 + progress * 0.2));
          
          gl_FragColor = vec4(color, 1.0);
        }
      `
    });
  }, [earthTexture, nightTexture, normalTexture]);

  // Enhanced atmosphere material with reduced intensity
  const atmosphereMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        progress: { value: 0 },
        opacity: { value: 0.15 }, // Reduced opacity
        color: { value: new THREE.Color(0x00ffff) },
        pulseIntensity: { value: 0.8 } // Reduced pulse
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        uniform float progress;
        uniform float time;
        
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          
          // Subtle scaling
          float pulse = sin(time * 1.5) * 0.03 + 1.0;
          vec3 pos = position * (1.0 + progress * 0.03 * pulse);
          
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
          float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          
          // Gentle pulsing
          float pulse = sin(time * 1.0 + vPosition.y * 1.0) * 0.2 + 0.8;
          float progressIntensity = 1.0 + progress * 1.5;
          
          vec3 atmosphere = color * intensity * pulse * progressIntensity;
          
          gl_FragColor = vec4(atmosphere, opacity * intensity * pulse * progressIntensity * pulseIntensity);
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
        opacity: { value: 0.3 } // Reduced opacity
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
          vec2 animatedUv = vUv + vec2(time * 0.015, sin(time * 0.008) * 0.008);
          vec3 clouds = texture2D(cloudsTexture, animatedUv).rgb;
          
          // Subtle turbulence
          float turbulence = sin(animatedUv.x * 15.0 + time * 0.8) * sin(animatedUv.y * 12.0 + time * 0.5);
          clouds *= (0.85 + turbulence * 0.15);
          
          // Progress-based enhancement
          float enhancement = 1.0 + progress * 0.3;
          clouds *= enhancement;
          
          // Blue tint for futuristic look
          clouds *= vec3(0.8, 0.95, 1.2);
          
          float alpha = clouds.r * opacity * (0.5 + progress * 0.3);
          gl_FragColor = vec4(clouds, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending
    });
  }, [cloudsTexture]);

  // CLEAR and OBVIOUS spinning animation
  useFrame((state) => {
    if (!meshRef.current || !groupRef.current) return;
    
    const time = state.clock.elapsedTime;
    const progress = earthProgress.get();
    
    // CONTINUOUS SPINNING - Very clear rotation
    const baseSpeed = 0.6; // Increased from 0.4 for better visibility
    const progressMultiplier = 1 + progress * 0.8;
    
    // Main Earth spinning - ALWAYS rotating
    meshRef.current.rotation.y = time * baseSpeed * progressMultiplier;
    meshRef.current.rotation.x = Math.sin(time * 0.1) * 0.03;
    
    // Clouds rotate independently
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y = time * (baseSpeed + 0.2) * progressMultiplier;
      cloudsRef.current.rotation.z = Math.sin(time * 0.15) * 0.02;
    }
    
    // Atmosphere rotates with subtle variations
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y = time * (baseSpeed - 0.1) * progressMultiplier;
      atmosphereRef.current.rotation.x = Math.cos(time * 0.12) * 0.015;
    }
    
    // Subtle group animations
    groupRef.current.rotation.x = Math.sin(time * 0.08) * 0.02;
    groupRef.current.rotation.z = Math.cos(time * 0.1) * 0.015;
    
    // Scaling and floating
    const scale = 1.0 + progress * 0.15;
    const pulse = Math.sin(time * 1.2) * 0.008 + 1;
    groupRef.current.scale.setScalar(scale * pulse);
    
    // Gentle floating motion
    groupRef.current.position.y = Math.sin(time * 0.25) * 0.03;
    groupRef.current.position.x = Math.sin(time * 0.2) * 0.015;
    
    // Update shader uniforms
    if (earthMaterial.uniforms) {
      earthMaterial.uniforms.time.value = time;
      earthMaterial.uniforms.progress.value = progress;
      earthMaterial.uniforms.glowIntensity.value = 0.2 + progress * 0.3;
    }
    
    atmosphereMaterial.uniforms.time.value = time;
    atmosphereMaterial.uniforms.progress.value = progress;
    atmosphereMaterial.uniforms.pulseIntensity.value = 0.8 + Math.sin(time * 1.2) * 0.2;
    
    cloudsMaterial.uniforms.time.value = time;
    cloudsMaterial.uniforms.progress.value = progress;
    
    // Dynamic sun direction
    const sunAngle = progress * Math.PI + time * 0.03;
    if (earthMaterial.uniforms) {
      earthMaterial.uniforms.sunDirection.value.set(
        Math.cos(sunAngle),
        Math.sin(sunAngle * 0.6) * 0.7,
        Math.sin(sunAngle) * 0.5
      );
    }
  });

  // Reduced mouse interaction to not interfere with rotation
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!groupRef.current || window.innerWidth < 768) return;
      
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      
      // Very subtle mouse interaction
      groupRef.current.rotation.x += y * 0.02;
      groupRef.current.rotation.z += x * 0.02;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <group ref={groupRef}>
      {/* NO LIGHTING HERE - All lighting handled in Scene.tsx */}
      
      {/* Main Earth Sphere */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <sphereGeometry args={[1, 64, 32]} />
        <primitive object={earthMaterial} attach="material" />
      </mesh>

      {/* Cloud Layer */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[1.006, 32, 16]} />
        <primitive object={cloudsMaterial} attach="material" />
      </mesh>

      {/* Atmosphere */}
      <mesh ref={atmosphereRef}>
        <sphereGeometry args={[1.015, 32, 16]} />
        <primitive object={atmosphereMaterial} attach="material" />
      </mesh>

      {/* Subtle outer atmosphere */}
      <mesh>
        <sphereGeometry args={[1.03, 16, 8]} />
        <meshBasicMaterial 
          color="#00ffff"
          transparent
          opacity={0.03}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
};

export default Earth;