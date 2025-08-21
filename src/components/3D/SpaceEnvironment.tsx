import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars, Cloud } from '@react-three/drei';
import * as THREE from 'three';
import ShootingStar from './ShootingStar';

interface SpaceEnvironmentProps {
  starCount?: number;
  shootingStarFrequency?: number;
  nebulaDensity?: number;
}

const SpaceEnvironment: React.FC<SpaceEnvironmentProps> = ({
  starCount = 5000,
  shootingStarFrequency = 0.02,
  nebulaDensity = 0.3
}) => {
  const [shootingStars, setShootingStars] = useState<Array<{
    id: string;
    position: [number, number, number];
    velocity: [number, number, number];
    color: string;
    size: number;
  }>>([]);

  const nebulaRef = useRef<THREE.Group>(null);
  const starFieldRef = useRef<THREE.Points>(null);

  // Create custom star field with varying sizes and colors
  const starGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);

    const starColors = [
      new THREE.Color('#ffffff'),
      new THREE.Color('#ffffcc'),
      new THREE.Color('#ccccff'),
      new THREE.Color('#ffcccc'),
      new THREE.Color('#ccffcc')
    ];

    for (let i = 0; i < starCount; i++) {
      // Random spherical distribution
      const radius = 50 + Math.random() * 100;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // Random star color
      const color = starColors[Math.floor(Math.random() * starColors.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      // Random star size
      sizes[i] = Math.random() * 2 + 0.5;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    return geometry;
  }, [starCount]);

  const starMaterial = useMemo(() => {
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
        
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          
          // Add subtle twinkling
          float twinkle = sin(time * 2.0 + position.x * 0.01) * 0.3 + 0.7;
          gl_PointSize = size * twinkle * pixelRatio * (300.0 / -mvPosition.z);
          
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
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
      vertexColors: true
    });
  }, []);

  // Create nebula clouds
  const nebulaClouds = useMemo(() => {
    const clouds = [];
    const cloudCount = Math.floor(nebulaDensity * 20);
    
    for (let i = 0; i < cloudCount; i++) {
      const position: [number, number, number] = [
        (Math.random() - 0.5) * 200,
        (Math.random() - 0.5) * 200,
        (Math.random() - 0.5) * 200
      ];
      
      const scale = Math.random() * 20 + 10;
      const color = new THREE.Color().setHSL(
        Math.random() * 0.3 + 0.5, // Hue: blue to purple
        0.3 + Math.random() * 0.4,  // Saturation
        0.1 + Math.random() * 0.2   // Lightness
      );
      
      clouds.push({
        id: i,
        position,
        scale,
        color: color.getHexString()
      });
    }
    
    return clouds;
  }, [nebulaDensity]);

  // Generate shooting stars periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < shootingStarFrequency) {
        const newStar = {
          id: Date.now().toString() + Math.random(),
          position: [
            (Math.random() - 0.5) * 50,
            (Math.random() - 0.5) * 50,
            (Math.random() - 0.5) * 50
          ] as [number, number, number],
          velocity: [
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2
          ] as [number, number, number],
          color: ['#ffffff', '#ffffcc', '#ccccff', '#ffcccc'][Math.floor(Math.random() * 4)],
          size: Math.random() * 0.03 + 0.01
        };
        
        setShootingStars(prev => [...prev, newStar]);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [shootingStarFrequency]);

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
    
    // Slowly rotate the entire star field
    if (starFieldRef.current) {
      starFieldRef.current.rotation.y = time * 0.001;
      starFieldRef.current.rotation.x = time * 0.0005;
    }
    
    // Animate nebula clouds
    if (nebulaRef.current) {
      nebulaRef.current.rotation.y = time * 0.0002;
      nebulaRef.current.children.forEach((cloud, index) => {
        cloud.rotation.z = time * 0.0001 * (index + 1);
        cloud.position.y += Math.sin(time * 0.0001 * (index + 1)) * 0.001;
      });
    }
  });

  return (
    <group>
      {/* Custom star field */}
      <points ref={starFieldRef} geometry={starGeometry} material={starMaterial} />
      
      {/* Nebula clouds */}
      <group ref={nebulaRef}>
        {nebulaClouds.map((cloud) => (
          <Cloud
            key={cloud.id}
            position={cloud.position}
            scale={cloud.scale}
            color={`#${cloud.color}`}
            opacity={0.1}
            speed={0.1}
            width={10}
            depth={1.5}
            segments={20}
          />
        ))}
      </group>
      
      {/* Shooting stars */}
      {shootingStars.map((star) => (
        <ShootingStar
          key={star.id}
          position={star.position}
          velocity={star.velocity}
          color={star.color}
          size={star.size}
          trailLength={3}
          lifespan={6}
          onComplete={() => handleShootingStarComplete(star.id)}
        />
      ))}
      
      {/* Ambient space lighting */}
      <ambientLight intensity={0.05} color="#000033" />
      
      {/* Distant star light */}
      <directionalLight
        position={[100, 100, 100]}
        intensity={0.1}
        color="#ffffff"
      />
    </group>
  );
};

export default SpaceEnvironment;