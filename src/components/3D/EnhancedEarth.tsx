import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame, useThree, useLoader } from '@react-three/fiber';
import { Sphere, useTexture, Stars, Cloud } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface EnhancedEarthProps {
  rotationSpeed?: number;
  scale?: number;
  position?: [number, number, number];
  showAtmosphere?: boolean;
  showClouds?: boolean;
  timeOfDay?: number; // 0-1, where 0 is day and 1 is night
}

const EnhancedEarth: React.FC<EnhancedEarthProps> = ({
  rotationSpeed = 0.005,
  scale = 1,
  position = [0, 0, 0],
  showAtmosphere = true,
  showClouds = true,
  timeOfDay = 0.5
}) => {
  const earthRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const { camera, scene } = useThree();

  // Load high-quality Earth textures
  const [dayTexture, nightTexture, cloudsTexture, normalTexture, specularTexture] = useTexture([
    'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=2048&h=1024&fit=crop', // Day texture
    'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=2048&h=1024&fit=crop', // Night texture  
    'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=2048&h=1024&fit=crop', // Clouds
    'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=2048&h=1024&fit=crop', // Normal map
    'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=2048&h=1024&fit=crop'  // Specular map
  ]);

  // Configure textures for optimal quality
  useMemo(() => {
    [dayTexture, nightTexture, cloudsTexture, normalTexture, specularTexture].forEach(texture => {
      if (texture) {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = true;
        texture.anisotropy = 16;
      }
    });
  }, [dayTexture, nightTexture, cloudsTexture, normalTexture, specularTexture]);

  // Advanced Earth shader material
  const earthMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        dayTexture: { value: dayTexture },
        nightTexture: { value: nightTexture },
        normalTexture: { value: normalTexture },
        specularTexture: { value: specularTexture },
        sunDirection: { value: new THREE.Vector3(1, 0, 0) },
        time: { value: 0 },
        timeOfDay: { value: timeOfDay },
        atmosphereColor: { value: new THREE.Color(0x87ceeb) },
        glowIntensity: { value: 0.3 }
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec3 vWorldPosition;
        
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D dayTexture;
        uniform sampler2D nightTexture;
        uniform sampler2D normalTexture;
        uniform sampler2D specularTexture;
        uniform vec3 sunDirection;
        uniform float time;
        uniform float timeOfDay;
        uniform vec3 atmosphereColor;
        uniform float glowIntensity;
        
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec3 vWorldPosition;
        
        void main() {
          // Sample textures
          vec3 dayColor = texture2D(dayTexture, vUv).rgb;
          vec3 nightColor = texture2D(nightTexture, vUv).rgb;
          vec3 normalMap = texture2D(normalTexture, vUv).rgb;
          float specular = texture2D(specularTexture, vUv).r;
          
          // Calculate lighting
          vec3 normal = normalize(vNormal);
          float sunDot = dot(normal, normalize(sunDirection));
          float dayNightMix = smoothstep(-0.1, 0.1, sunDot);
          
          // Mix day and night textures
          vec3 color = mix(nightColor * 0.3, dayColor, dayNightMix);
          
          // Add specular highlights for water
          float specularHighlight = pow(max(0.0, sunDot), 32.0) * specular;
          color += vec3(specularHighlight * 0.5);
          
          // Atmospheric scattering effect
          float atmosphere = pow(1.0 - abs(dot(normal, vec3(0.0, 0.0, 1.0))), 2.0);
          color = mix(color, atmosphereColor, atmosphere * glowIntensity * 0.1);
          
          gl_FragColor = vec4(color, 1.0);
        }
      `
    });
  }, [dayTexture, nightTexture, normalTexture, specularTexture, timeOfDay]);

  // Atmosphere shader material
  const atmosphereMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        opacity: { value: 0.15 },
        color: { value: new THREE.Color(0x87ceeb) }
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
        uniform vec3 color;
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          float intensity = pow(0.8 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          vec3 atmosphere = color * intensity;
          
          // Add subtle animation
          float pulse = sin(time * 0.5) * 0.1 + 0.9;
          
          gl_FragColor = vec4(atmosphere, opacity * intensity * pulse);
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
      opacity: 0.4,
      alphaMap: cloudsTexture,
      depthWrite: false
    });
  }, [cloudsTexture]);

  // Animation loop
  useFrame((state) => {
    if (!earthRef.current || !groupRef.current) return;
    
    const time = state.clock.elapsedTime;
    
    // Rotate Earth
    earthRef.current.rotation.y += rotationSpeed;
    
    // Rotate clouds slightly faster for realism
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += rotationSpeed * 1.1;
    }
    
    // Update shader uniforms
    if (earthMaterial.uniforms.time) {
      earthMaterial.uniforms.time.value = time;
    }
    
    if (atmosphereMaterial.uniforms.time) {
      atmosphereMaterial.uniforms.time.value = time;
    }
    
    // Update sun direction based on time
    const sunAngle = time * 0.1;
    earthMaterial.uniforms.sunDirection.value.set(
      Math.cos(sunAngle),
      Math.sin(sunAngle) * 0.5,
      Math.sin(sunAngle)
    );
    
    // Subtle floating animation
    groupRef.current.position.y = position[1] + Math.sin(time * 0.3) * 0.02;
  });

  // GSAP scroll animations
  useEffect(() => {
    if (!groupRef.current) return;

    const ctx = gsap.context(() => {
      // Scale animation on scroll
      gsap.to(groupRef.current!.scale, {
        scrollTrigger: {
          trigger: '.earth-container',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        },
        x: scale * 1.2,
        y: scale * 1.2,
        z: scale * 1.2
      });

      // Rotation animation on scroll
      gsap.to(groupRef.current!.rotation, {
        scrollTrigger: {
          trigger: '.earth-container',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 2
        },
        x: Math.PI * 0.1,
        z: Math.PI * 0.05
      });
    });

    return () => ctx.revert();
  }, [scale]);

  return (
    <group ref={groupRef} position={position} scale={[scale, scale, scale]}>
      {/* Enhanced lighting setup */}
      <ambientLight intensity={0.1} color="#f0f8ff" />
      
      {/* Main sun light */}
      <directionalLight 
        position={[10, 5, 5]} 
        intensity={1.5}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* Fill light from space */}
      <directionalLight 
        position={[-5, -2, -5]} 
        intensity={0.2}
        color="#4169e1"
      />
      
      {/* Rim light for atmosphere */}
      <pointLight 
        position={[0, 0, 8]} 
        intensity={0.3}
        color="#87ceeb"
        distance={20}
        decay={2}
      />

      {/* Main Earth Sphere with advanced materials */}
      <Sphere ref={earthRef} args={[1, 128, 64]} castShadow receiveShadow>
        <primitive object={earthMaterial} attach="material" />
      </Sphere>

      {/* Cloud layer */}
      {showClouds && (
        <Sphere ref={cloudsRef} args={[1.005, 64, 32]}>
          <primitive object={cloudsMaterial} attach="material" />
        </Sphere>
      )}

      {/* Atmosphere layers */}
      {showAtmosphere && (
        <>
          <Sphere ref={atmosphereRef} args={[1.01, 64, 32]}>
            <primitive object={atmosphereMaterial} attach="material" />
          </Sphere>
          
          {/* Outer glow */}
          <Sphere args={[1.03, 32, 16]}>
            <meshBasicMaterial 
              color="#87ceeb"
              transparent
              opacity={0.03}
              side={THREE.BackSide}
            />
          </Sphere>
        </>
      )}

      {/* Subtle particle system around Earth */}
      <Stars 
        radius={3}
        depth={50}
        count={200}
        factor={2}
        saturation={0}
        fade
        speed={0.5}
      />
    </group>
  );
};

export default EnhancedEarth;