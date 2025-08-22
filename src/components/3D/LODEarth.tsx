import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Sphere, useTexture } from '@react-three/drei';
import * as THREE from 'three';

interface LODEarthProps {
  position?: [number, number, number];
  rotationSpeed?: number;
  performanceLevel?: 'high' | 'medium' | 'low';
  showAtmosphere?: boolean;
  showClouds?: boolean;
  geologicalPeriod?: string;
}

const LODEarth: React.FC<LODEarthProps> = ({
  position = [0, 0, 0],
  rotationSpeed = 0.005,
  performanceLevel = 'high',
  showAtmosphere = true,
  showClouds = true,
  geologicalPeriod = 'cenozoic'
}) => {
  const earthRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  
  // Geometry and material caching for better performance
  const geometryCache = useRef<Map<string, THREE.BufferGeometry>>(new Map());
  const materialCache = useRef<Map<string, THREE.Material>>(new Map());

  // Load textures based on performance level and geological period
  const textureUrls = useMemo(() => {
    const baseUrl = 'https://images.unsplash.com/';
    const resolution = performanceLevel === 'high' ? '2048x1024' : 
                      performanceLevel === 'medium' ? '1024x512' : '512x256';
    
    // Different textures for different geological periods
    const periodTextures = {
      hadean: {
        day: `${baseUrl}photo-1446776653964-20c1d3a81b06?w=${resolution.split('x')[0]}&h=${resolution.split('x')[1]}&fit=crop`, // Molten/volcanic
        night: `${baseUrl}photo-1446776653964-20c1d3a81b06?w=${resolution.split('x')[0]}&h=${resolution.split('x')[1]}&fit=crop`,
        clouds: null
      },
      archean: {
        day: `${baseUrl}photo-1559827260-dc66d52bef19?w=${resolution.split('x')[0]}&h=${resolution.split('x')[1]}&fit=crop`, // Early ocean
        night: `${baseUrl}photo-1446776653964-20c1d3a81b06?w=${resolution.split('x')[0]}&h=${resolution.split('x')[1]}&fit=crop`,
        clouds: `${baseUrl}photo-1439066615861-d1af74d74000?w=${resolution.split('x')[0]}&h=${resolution.split('x')[1]}&fit=crop`
      },
      proterozoic: {
        day: `${baseUrl}photo-1441974231531-c6227db76b6e?w=${resolution.split('x')[0]}&h=${resolution.split('x')[1]}&fit=crop`, // Green/algae
        night: `${baseUrl}photo-1446776653964-20c1d3a81b06?w=${resolution.split('x')[0]}&h=${resolution.split('x')[1]}&fit=crop`,
        clouds: `${baseUrl}photo-1439066615861-d1af74d74000?w=${resolution.split('x')[0]}&h=${resolution.split('x')[1]}&fit=crop`
      },
      paleozoic: {
        day: `${baseUrl}photo-1583212292454-1fe6229603b7?w=${resolution.split('x')[0]}&h=${resolution.split('x')[1]}&fit=crop`, // Forest/land
        night: `${baseUrl}photo-1446776653964-20c1d3a81b06?w=${resolution.split('x')[0]}&h=${resolution.split('x')[1]}&fit=crop`,
        clouds: `${baseUrl}photo-1439066615861-d1af74d74000?w=${resolution.split('x')[0]}&h=${resolution.split('x')[1]}&fit=crop`
      },
      mesozoic: {
        day: `${baseUrl}photo-1500382017468-9049fed747ef?w=${resolution.split('x')[0]}&h=${resolution.split('x')[1]}&fit=crop`, // Dinosaur era
        night: `${baseUrl}photo-1446776653964-20c1d3a81b06?w=${resolution.split('x')[0]}&h=${resolution.split('x')[1]}&fit=crop`,
        clouds: `${baseUrl}photo-1439066615861-d1af74d74000?w=${resolution.split('x')[0]}&h=${resolution.split('x')[1]}&fit=crop`
      },
      cenozoic: {
        day: `${baseUrl}photo-1614730321146-b6fa6a46bcb4?w=${resolution.split('x')[0]}&h=${resolution.split('x')[1]}&fit=crop`, // Modern Earth
        night: `${baseUrl}photo-1446776653964-20c1d3a81b06?w=${resolution.split('x')[0]}&h=${resolution.split('x')[1]}&fit=crop`,
        clouds: `${baseUrl}photo-1439066615861-d1af74d74000?w=${resolution.split('x')[0]}&h=${resolution.split('x')[1]}&fit=crop`
      }
    };

    return periodTextures[geologicalPeriod as keyof typeof periodTextures] || periodTextures.cenozoic;
  }, [performanceLevel, geologicalPeriod]);

  const textures = useTexture([
    textureUrls.day,
    textureUrls.night,
    textureUrls.clouds || textureUrls.day
  ]);

  const [dayTexture, nightTexture, cloudsTexture] = textures;

  // Configure textures based on performance level
  useMemo(() => {
    const anisotropy = performanceLevel === 'high' ? 16 : performanceLevel === 'medium' ? 4 : 1;
    
    textures.forEach(texture => {
      if (texture) {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.anisotropy = anisotropy;
        texture.generateMipmaps = true;
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.magFilter = THREE.LinearFilter;
      }
    });
  }, [textures, performanceLevel]);

  // Earth material with LOD-based complexity
  const earthMaterial = useMemo(() => {
    if (performanceLevel === 'low') {
      return new THREE.MeshLambertMaterial({
        map: dayTexture,
        transparent: false
      });
    }

    return new THREE.ShaderMaterial({
      uniforms: {
        dayTexture: { value: dayTexture },
        nightTexture: { value: nightTexture },
        sunDirection: { value: new THREE.Vector3(1, 0, 0) },
        time: { value: 0 },
        atmosphereColor: { value: new THREE.Color(0x87ceeb) },
        periodIntensity: { value: geologicalPeriod === 'hadean' ? 2.0 : 1.0 }
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: performanceLevel === 'high' ? `
        uniform sampler2D dayTexture;
        uniform sampler2D nightTexture;
        uniform vec3 sunDirection;
        uniform float time;
        uniform vec3 atmosphereColor;
        uniform float periodIntensity;
        
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          vec3 dayColor = texture2D(dayTexture, vUv).rgb;
          vec3 nightColor = texture2D(nightTexture, vUv).rgb;
          
          vec3 normal = normalize(vNormal);
          float sunDot = dot(normal, normalize(sunDirection));
          float dayNightMix = smoothstep(-0.1, 0.1, sunDot);
          
          vec3 color = mix(nightColor * 0.3, dayColor, dayNightMix);
          
          // Add period-specific effects
          if (periodIntensity > 1.0) {
            // Hadean period - add volcanic glow
            float glow = sin(time * 2.0 + vPosition.x * 10.0) * 0.1 + 0.9;
            color *= vec3(1.2, 0.8, 0.6) * glow;
          }
          
          // Atmospheric scattering
          float atmosphere = pow(1.0 - abs(dot(normal, vec3(0.0, 0.0, 1.0))), 2.0);
          color = mix(color, atmosphereColor, atmosphere * 0.1);
          
          gl_FragColor = vec4(color, 1.0);
        }
      ` : `
        uniform sampler2D dayTexture;
        uniform sampler2D nightTexture;
        uniform vec3 sunDirection;
        uniform float periodIntensity;
        
        varying vec2 vUv;
        varying vec3 vNormal;
        
        void main() {
          vec3 dayColor = texture2D(dayTexture, vUv).rgb;
          vec3 nightColor = texture2D(nightTexture, vUv).rgb;
          
          float sunDot = dot(vNormal, normalize(sunDirection));
          float dayNightMix = smoothstep(-0.1, 0.1, sunDot);
          
          vec3 color = mix(nightColor * 0.3, dayColor, dayNightMix);
          
          if (periodIntensity > 1.0) {
            color *= vec3(1.2, 0.8, 0.6);
          }
          
          gl_FragColor = vec4(color, 1.0);
        }
      `
    });
  }, [dayTexture, nightTexture, performanceLevel, geologicalPeriod]);

  // Atmosphere material
  const atmosphereMaterial = useMemo(() => {
    if (!showAtmosphere || performanceLevel === 'low') return null;

    const atmosphereColors = {
      hadean: new THREE.Color(0xff4444),
      archean: new THREE.Color(0xff8844),
      proterozoic: new THREE.Color(0x44ff44),
      paleozoic: new THREE.Color(0x44ff88),
      mesozoic: new THREE.Color(0x4488ff),
      cenozoic: new THREE.Color(0x87ceeb)
    };

    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        opacity: { value: performanceLevel === 'high' ? 0.15 : 0.1 },
        color: { value: atmosphereColors[geologicalPeriod as keyof typeof atmosphereColors] || atmosphereColors.cenozoic }
      },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform float opacity;
        uniform vec3 color;
        varying vec3 vNormal;
        
        void main() {
          float intensity = pow(0.8 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          vec3 atmosphere = color * intensity;
          float pulse = sin(time * 0.5) * 0.1 + 0.9;
          gl_FragColor = vec4(atmosphere, opacity * intensity * pulse);
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true
    });
  }, [showAtmosphere, performanceLevel, geologicalPeriod]);

  // Clouds material
  const cloudsMaterial = useMemo(() => {
    if (!showClouds || performanceLevel === 'low' || geologicalPeriod === 'hadean') return null;

    return new THREE.MeshLambertMaterial({
      map: cloudsTexture,
      transparent: true,
      opacity: performanceLevel === 'high' ? 0.4 : 0.3,
      alphaMap: cloudsTexture,
      depthWrite: false
    });
  }, [cloudsTexture, showClouds, performanceLevel, geologicalPeriod]);

  // Geometry complexity based on performance level
  const sphereArgs = useMemo((): [number, number, number] => {
    switch (performanceLevel) {
      case 'high': return [1, 128, 64];
      case 'medium': return [1, 64, 32];
      case 'low': return [1, 32, 16];
    }
  }, [performanceLevel]);

  // Cached geometry creation
  const getSphereGeometry = useCallback((key: string, args: [number, number, number]) => {
    if (!geometryCache.current.has(key)) {
      const geometry = new THREE.SphereGeometry(...args);
      geometry.computeBoundingSphere();
      geometryCache.current.set(key, geometry);
    }
    return geometryCache.current.get(key)!;
  }, []);

  // Get optimized geometries
  const mainGeometry = getSphereGeometry('main', sphereArgs);
  const atmosphereGeometry = getSphereGeometry('atmosphere', [1.02, Math.floor(sphereArgs[1] / 2), Math.floor(sphereArgs[2] / 2)]);
  const cloudsGeometry = getSphereGeometry('clouds', [1.005, Math.floor(sphereArgs[1] / 2), Math.floor(sphereArgs[2] / 2)]);

  // Animation loop
  useFrame((state) => {
    if (!earthRef.current || !groupRef.current) return;
    
    const time = state.clock.elapsedTime;
    
    // Rotate Earth
    earthRef.current.rotation.y += rotationSpeed;
    
    // Rotate clouds slightly faster
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += rotationSpeed * 1.1;
    }
    
    // Update shader uniforms for advanced materials
    if (earthMaterial instanceof THREE.ShaderMaterial) {
      if (earthMaterial.uniforms.time) {
        earthMaterial.uniforms.time.value = time;
      }
      
      // Update sun direction
      const sunAngle = time * 0.1;
      earthMaterial.uniforms.sunDirection.value.set(
        Math.cos(sunAngle),
        Math.sin(sunAngle) * 0.5,
        Math.sin(sunAngle)
      );
    }
    
    if (atmosphereMaterial && atmosphereMaterial.uniforms.time) {
      atmosphereMaterial.uniforms.time.value = time;
    }
    
    // Subtle floating animation
    groupRef.current.position.y = position[1] + Math.sin(time * 0.3) * 0.02;
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Enhanced lighting setup */}
      <ambientLight intensity={0.1} color="#f0f8ff" />
      
      <directionalLight 
        position={[10, 5, 5]} 
        intensity={1.2}
        color="#ffffff"
        castShadow={performanceLevel === 'high'}
        shadow-mapSize-width={performanceLevel === 'high' ? 2048 : 1024}
        shadow-mapSize-height={performanceLevel === 'high' ? 2048 : 1024}
      />
      
      <directionalLight 
        position={[-5, -2, -5]} 
        intensity={0.3}
        color="#4169e1"
      />
      
      <pointLight 
        position={[0, 0, 8]} 
        intensity={0.5}
        color="#87ceeb"
        distance={20}
      />

      {/* Main Earth Sphere */}
      <mesh ref={earthRef} geometry={mainGeometry} castShadow={performanceLevel === 'high'} receiveShadow={performanceLevel === 'high'}>
        <primitive object={earthMaterial} attach="material" />
      </mesh>

      {/* Cloud layer */}
      {cloudsMaterial && (
        <mesh ref={cloudsRef} geometry={cloudsGeometry}>
          <primitive object={cloudsMaterial} attach="material" />
        </mesh>
      )}

      {/* Atmosphere layers */}
      {atmosphereMaterial && (
        <>
          <mesh ref={atmosphereRef} geometry={atmosphereGeometry}>
            <primitive object={atmosphereMaterial} attach="material" />
          </mesh>
          
          {performanceLevel === 'high' && (
            <mesh geometry={getSphereGeometry('outerAtmosphere', [1.03, 32, 16])}>
            <meshBasicMaterial 
              color={atmosphereMaterial.uniforms.color.value}
              transparent
              opacity={0.03}
              side={THREE.BackSide}
            />
            </mesh>
          )}
        </>
      )}
    </group>
  );
};

export default LODEarth;