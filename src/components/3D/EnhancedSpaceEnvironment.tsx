import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars, Cloud } from '@react-three/drei';
import * as THREE from 'three';
import EnhancedShootingStar from './EnhancedShootingStar';

interface EnhancedSpaceEnvironmentProps {
  starCount?: number;
  shootingStarFrequency?: number;
  nebulaDensity?: number;
  showShootingStars?: boolean;
  performanceLevel?: 'high' | 'medium' | 'low';
  geologicalPeriod?: string;
}

const EnhancedSpaceEnvironment: React.FC<EnhancedSpaceEnvironmentProps> = ({
  starCount = 5000,
  shootingStarFrequency = 0.02,
  nebulaDensity = 0.3,
  showShootingStars = true,
  performanceLevel = 'high',
  geologicalPeriod = 'cenozoic'
}) => {
  const [shootingStars, setShootingStars] = useState<Array<{
    id: string;
    position: [number, number, number];
    velocity: [number, number, number];
    color: string;
    size: number;
    intensity: number;
  }>>([]);

  const nebulaRef = useRef<THREE.Group>(null);
  const starFieldRef = useRef<THREE.Points>(null);

  // Adjust counts based on performance level
  const adjustedStarCount = useMemo(() => {
    switch (performanceLevel) {
      case 'high': return starCount;
      case 'medium': return Math.floor(starCount * 0.6);
      case 'low': return Math.floor(starCount * 0.3);
    }
  }, [starCount, performanceLevel]);

  const adjustedNebulaDensity = useMemo(() => {
    switch (performanceLevel) {
      case 'high': return nebulaDensity;
      case 'medium': return nebulaDensity * 0.7;
      case 'low': return nebulaDensity * 0.4;
    }
  }, [nebulaDensity, performanceLevel]);

  // Create custom star field with varying sizes and colors
  const starGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(adjustedStarCount * 3);
    const colors = new Float32Array(adjustedStarCount * 3);
    const sizes = new Float32Array(adjustedStarCount);
    
    // Use instanced rendering for better performance
    const instancedGeometry = new THREE.InstancedBufferGeometry();
    instancedGeometry.instanceCount = adjustedStarCount;

    // Period-specific star colors
    const periodStarColors = {
      hadean: [
        new THREE.Color('#ff6666'), // Red-orange
        new THREE.Color('#ff9966'),
        new THREE.Color('#ffcc66')
      ],
      archean: [
        new THREE.Color('#ffaa66'),
        new THREE.Color('#ffffff'),
        new THREE.Color('#ccccff')
      ],
      proterozoic: [
        new THREE.Color('#66ff66'),
        new THREE.Color('#ffffff'),
        new THREE.Color('#ccffcc')
      ],
      paleozoic: [
        new THREE.Color('#66ffaa'),
        new THREE.Color('#ffffff'),
        new THREE.Color('#aaffcc')
      ],
      mesozoic: [
        new THREE.Color('#6666ff'),
        new THREE.Color('#ffffff'),
        new THREE.Color('#ccccff')
      ],
      cenozoic: [
        new THREE.Color('#ffffff'),
        new THREE.Color('#ffffcc'),
        new THREE.Color('#ccccff'),
        new THREE.Color('#ffcccc'),
        new THREE.Color('#ccffcc')
      ]
    };

    const starColors = periodStarColors[geologicalPeriod as keyof typeof periodStarColors] || periodStarColors.cenozoic;

    for (let i = 0; i < adjustedStarCount; i++) {
      // Random spherical distribution
      const radius = 50 + Math.random() * 150;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // Random star color based on period
      const color = starColors[Math.floor(Math.random() * starColors.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      // Random star size with some bright stars
      const isBrightStar = Math.random() < 0.05;
      sizes[i] = isBrightStar ? Math.random() * 4 + 2 : Math.random() * 2 + 0.5;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    // Optimize geometry
    geometry.computeBoundingSphere();

    return geometry;
  }, [adjustedStarCount, geologicalPeriod]);

  const starMaterial = useMemo(() => {
    const complexity = performanceLevel === 'high' ? 'high' : 'low';
    
    // Use shader material for better performance
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        pixelRatio: { value: window.devicePixelRatio }
      },
      vertexShader: `
        attribute float size;
        uniform float time;
        uniform float pixelRatio;
        varying vec3 vColor;
        varying float vSize;
        
        void main() {
          vColor = color;
          vSize = size;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          
          ${complexity === 'high' ? `
          // Add subtle twinkling
          float twinkle = sin(time * 2.0 + position.x * 0.01) * 0.3 + 0.7;
          gl_PointSize = size * twinkle * pixelRatio * (300.0 / -mvPosition.z);
          ` : `
          gl_PointSize = size * pixelRatio * (300.0 / -mvPosition.z);
          `}
          
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: complexity === 'high' ? `
        varying vec3 vColor;
        varying float vSize;
        
        void main() {
          float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
          float alpha = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
          
          // Add bright core for larger stars
          float core = 1.0 - smoothstep(0.0, 0.1, distanceToCenter);
          vec3 finalColor = vColor + vec3(core * 0.5);
          
          gl_FragColor = vec4(finalColor, alpha);
        }
      ` : `
        varying vec3 vColor;
        
        void main() {
          float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
          float alpha = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true,
      alphaTest: 0.1, // Discard transparent pixels for better performance
      vertexColors: true
    });
  }, [performanceLevel]);

  // Create nebula clouds with period-specific colors
  const nebulaClouds = useMemo(() => {
    const clouds = [];
    // Reduce cloud count for better performance
    const cloudCount = Math.floor(adjustedNebulaDensity * 20);
    
    const periodNebulaColors = {
      hadean: ['#ff4444', '#ff6644', '#ff8844'],
      archean: ['#ff8844', '#ffaa44', '#ffcc44'],
      proterozoic: ['#44ff44', '#66ff66', '#88ff88'],
      paleozoic: ['#44ff88', '#66ffaa', '#88ffcc'],
      mesozoic: ['#4444ff', '#6666ff', '#8888ff'],
      cenozoic: ['#4488ff', '#66aaff', '#88ccff']
    };

    const nebulaColors = periodNebulaColors[geologicalPeriod as keyof typeof periodNebulaColors] || periodNebulaColors.cenozoic;
    
    for (let i = 0; i < cloudCount; i++) {
      const position: [number, number, number] = [
        (Math.random() - 0.5) * 300,
        (Math.random() - 0.5) * 300,
        (Math.random() - 0.5) * 300
      ];
      
      const scale = Math.random() * 30 + 15;
      const colorHex = nebulaColors[Math.floor(Math.random() * nebulaColors.length)];
      
      clouds.push({
        id: i,
        position,
        scale,
        color: colorHex
      });
    }
    
    return clouds;
  }, [adjustedNebulaDensity, geologicalPeriod]);

  // Generate shooting stars periodically
  useEffect(() => {
    if (!showShootingStars) return;

    const adjustedFrequency = performanceLevel === 'low' ? shootingStarFrequency * 0.5 : shootingStarFrequency;
    
    const interval = setInterval(() => {
      if (Math.random() < adjustedFrequency) {
        const colors = ['#ffffff', '#ffffcc', '#ccccff', '#ffcccc', '#ccffcc'];
        const newStar = {
          id: Date.now().toString() + Math.random(),
          position: [
            (Math.random() - 0.5) * 100,
            (Math.random() - 0.5) * 100,
            (Math.random() - 0.5) * 100
          ] as [number, number, number],
          velocity: [
            (Math.random() - 0.5) * 3,
            (Math.random() - 0.5) * 3,
            (Math.random() - 0.5) * 3
          ] as [number, number, number],
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 0.04 + 0.01,
          intensity: Math.random() * 0.5 + 0.5
        };
        
        setShootingStars(prev => [...prev, newStar]);
        
        // Play shooting star sound
        (window as any).playShootingStar?.();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [shootingStarFrequency, showShootingStars, performanceLevel]);

  // Remove completed shooting stars
  const handleShootingStarComplete = (id: string) => {
    setShootingStars(prev => prev.filter(star => star.id !== id));
  };

  // Animation loop
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    // Update star material
    if (starMaterial.uniforms.time) {
      starMaterial.uniforms.time.value = time;
    }
    
    // Only update if performance allows
    if (performanceLevel === 'low' && time % 2 > 1) return;
    
    // Slowly rotate the entire star field
    if (starFieldRef.current) {
      starFieldRef.current.rotation.y = time * 0.0005;
      starFieldRef.current.rotation.x = time * 0.0002;
    }
    
    // Animate nebula clouds
    if (nebulaRef.current && performanceLevel !== 'low') {
      nebulaRef.current.rotation.y = time * 0.0001;
      nebulaRef.current.children.forEach((cloud, index) => {
        cloud.rotation.z = time * 0.00005 * (index + 1);
        cloud.position.y += Math.sin(time * 0.0001 * (index + 1)) * 0.001;
      });
    }
  });

  // Cleanup function
  useEffect(() => {
    return () => {
      starGeometry.dispose();
      starMaterial.dispose();
    };
  }, [starGeometry, starMaterial]);

  return (
    <group>
      {/* Custom star field */}
      <points ref={starFieldRef} geometry={starGeometry} material={starMaterial} />
      
      {/* Nebula clouds */}
      {performanceLevel !== 'low' && (
        <group ref={nebulaRef}>
          {nebulaClouds.map((cloud) => (
            <Cloud
              key={cloud.id}
              position={cloud.position}
              scale={cloud.scale}
              color={cloud.color}
              opacity={0.08}
              speed={0.05}
              width={8}
              depth={1}
              segments={performanceLevel === 'high' ? 20 : 10}
            />
          ))}
        </group>
      )}
      
      {/* Enhanced shooting stars */}
      {showShootingStars && shootingStars.map((star) => (
        <EnhancedShootingStar
          key={star.id}
          position={star.position}
          velocity={star.velocity}
          color={star.color}
          size={star.size}
          intensity={star.intensity}
          trailLength={performanceLevel === 'high' ? 50 : performanceLevel === 'medium' ? 30 : 20}
          lifespan={8}
          onComplete={() => handleShootingStarComplete(star.id)}
        />
      ))}
      
      {/* Ambient space lighting */}
      <ambientLight intensity={0.03} color="#000033" />
      
      {/* Distant star light */}
      <directionalLight
        position={[200, 200, 200]}
        intensity={0.05}
        color="#ffffff"
      />
      
      {/* Period-specific ambient lighting */}
      {geologicalPeriod === 'hadean' && (
        <pointLight
          position={[0, 0, 0]}
          intensity={0.3}
          color="#ff4444"
          distance={100}
        />
      )}
    </group>
  );
};

export default EnhancedSpaceEnvironment;