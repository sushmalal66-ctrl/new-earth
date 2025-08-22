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

  // Create a simple night texture procedurally
  const nightTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Create a dark blue gradient
      const gradient = ctx.createLinearGradient(0, 0, 512, 256);
      gradient.addColorStop(0, '#001122');
      gradient.addColorStop(0.5, '#002244');
      gradient.addColorStop(1, '#001122');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 512, 256);
      
      // Add some city lights
      ctx.fillStyle = '#ffaa00';
      for (let i = 0; i < 50; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 256;
        ctx.fillRect(x, y, 1, 1);
      }
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }, []);

  // Create a simple clouds texture procedurally
  const cloudsTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, 512, 256);
      
      // Add cloud patterns
      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = 0.3;
      for (let i = 0; i < 100; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 256;
        const size = Math.random() * 20 + 5;
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

  // Create a simple normal texture procedurally
  const normalTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Create a neutral normal map (pointing up)
      ctx.fillStyle = '#8080ff';
      ctx.fillRect(0, 0, 512, 256);
      
      // Add some subtle variations
      ctx.globalAlpha = 0.1;
      for (let i = 0; i < 200; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 256;
        const size = Math.random() * 10 + 2;
        ctx.fillStyle = Math.random() > 0.5 ? '#9090ff' : '#7070ff';
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

  // Earth material with shader
  const earthMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        dayTexture: { value: earthTexture },
        nightTexture: { value: nightTexture },
        normalTexture: { value: normalTexture },
        sunDirection: { value: new THREE.Vector3(1, 0.5, 0.5) },
        time: { value: 0 },
        progress: { value: 0 },
        atmosphereColor: { value: new THREE.Color(0x87ceeb) }
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        uniform float time;
        uniform float progress;
        
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          
          // Subtle vertex displacement based on progress
          vec3 pos = position;
          float displacement = sin(position.x * 10.0 + time) * 0.002 * progress;
          pos += normal * displacement;
          
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
        
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          vec3 dayColor = texture2D(dayTexture, vUv).rgb;
          vec3 nightColor = texture2D(nightTexture, vUv).rgb * 0.3;
          vec3 normal = normalize(vNormal);
          
          // Enhanced normal mapping
          vec3 normalMap = texture2D(normalTexture, vUv).rgb * 2.0 - 1.0;
          normal = normalize(normal + normalMap * 0.1);
          
          // Day/night transition
          float sunDot = dot(normal, normalize(sunDirection));
          float dayNightMix = smoothstep(-0.1, 0.1, sunDot);
          
          vec3 color = mix(nightColor, dayColor, dayNightMix);
          
          // Progress-based enhancement
          float enhancement = 1.0 + progress * 0.3;
          color *= enhancement;
          
          // Atmospheric rim lighting
          float atmosphere = pow(1.0 - abs(dot(normal, vec3(0.0, 0.0, 1.0))), 2.0);
          color = mix(color, atmosphereColor * 0.8, atmosphere * 0.1 * (1.0 + progress));
          
          // Subtle glow effect during transitions
          if (progress > 0.2) {
            float glow = sin(time * 2.0 + vPosition.x * 5.0) * 0.1 + 0.9;
            color *= glow;
          }
          
          gl_FragColor = vec4(color, 1.0);
        }
      `
    });
  }, [earthTexture, nightTexture, normalTexture]);

  // Atmosphere material
  const atmosphereMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        progress: { value: 0 },
        opacity: { value: 0.15 },
        color: { value: new THREE.Color(0x87ceeb) }
      },
      vertexShader: `
        varying vec3 vNormal;
        uniform float progress;
        
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec3 pos = position * (1.0 + progress * 0.02);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform float progress;
        uniform float opacity;
        uniform vec3 color;
        varying vec3 vNormal;
        
        void main() {
          float intensity = pow(0.8 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          vec3 atmosphere = color * intensity;
          
          float pulse = sin(time * 0.5 + progress * 2.0) * 0.2 + 0.8;
          float progressIntensity = 1.0 + progress * 2.0;
          
          gl_FragColor = vec4(atmosphere, opacity * intensity * pulse * progressIntensity);
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true
    });
  }, []);

  // Clouds material
  const cloudsMaterial = useMemo(() => {
    return new THREE.MeshLambertMaterial({
      map: cloudsTexture,
      transparent: true,
      opacity: 0.3,
      alphaMap: cloudsTexture,
      depthWrite: false
    });
  }, [cloudsTexture]);

  // Animation loop
  useFrame((state) => {
    if (!meshRef.current || !groupRef.current) return;
    
    const time = state.clock.elapsedTime;
    const progress = earthProgress.get();
    
    // Continuous rotation
    meshRef.current.rotation.y = time * 0.1;
    
    // Clouds rotate slightly faster
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y = time * 0.12;
    }
    
    // Atmosphere counter-rotation
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y = time * 0.08;
    }
    
    // Scale and position based on progress
    const scale = 1.0 + progress * 0.3;
    groupRef.current.scale.setScalar(scale);
    
    // Subtle floating animation
    groupRef.current.position.y = Math.sin(time * 0.3) * 0.05;
    
    // Camera distance based on progress
    state.camera.position.z = 5 - progress * 1.5;
    
    // Update shader uniforms
    earthMaterial.uniforms.time.value = time;
    earthMaterial.uniforms.progress.value = progress;
    
    atmosphereMaterial.uniforms.time.value = time;
    atmosphereMaterial.uniforms.progress.value = progress;
    
    // Update sun direction for different eras
    const sunAngle = progress * Math.PI * 0.5;
    earthMaterial.uniforms.sunDirection.value.set(
      Math.cos(sunAngle),
      Math.sin(sunAngle) * 0.5,
      Math.sin(sunAngle)
    );
  });

  // Handle hover effects (desktop only)
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!groupRef.current || window.innerWidth < 768) return;
      
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      
      groupRef.current.rotation.x = y * 0.1;
      groupRef.current.rotation.z = x * 0.1;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <group ref={groupRef}>
      {/* Main Earth Sphere */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <sphereGeometry args={[1, 64, 32]} />
        <primitive object={earthMaterial} attach="material" />
      </mesh>

      {/* Cloud Layer */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[1.005, 32, 16]} />
        <primitive object={cloudsMaterial} attach="material" />
      </mesh>

      {/* Atmosphere */}
      <mesh ref={atmosphereRef}>
        <sphereGeometry args={[1.02, 32, 16]} />
        <primitive object={atmosphereMaterial} attach="material" />
      </mesh>

      {/* Outer Glow */}
      <mesh>
        <sphereGeometry args={[1.08, 16, 8]} />
        <meshBasicMaterial 
          color="#87ceeb"
          transparent
          opacity={0.03}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
};

export default Earth;