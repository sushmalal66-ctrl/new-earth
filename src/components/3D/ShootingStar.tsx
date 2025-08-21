import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Trail, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion-3d';

interface ShootingStarProps {
  position: [number, number, number];
  velocity: [number, number, number];
  color?: string;
  size?: number;
  trailLength?: number;
  lifespan?: number;
  onComplete?: () => void;
}

const ShootingStar: React.FC<ShootingStarProps> = ({
  position,
  velocity,
  color = '#ffffff',
  size = 0.02,
  trailLength = 2,
  lifespan = 5,
  onComplete
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const startTime = useRef(Date.now());
  const initialPosition = useRef(position);

  // Create particle system for trail effect
  const particleGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(100 * 3);
    const colors = new Float32Array(100 * 3);
    const sizes = new Float32Array(100);

    for (let i = 0; i < 100; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;

      const colorObj = new THREE.Color(color);
      colors[i * 3] = colorObj.r;
      colors[i * 3 + 1] = colorObj.g;
      colors[i * 3 + 2] = colorObj.b;

      sizes[i] = Math.random() * 0.01 + 0.005;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    return geometry;
  }, [color]);

  const particleMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        opacity: { value: 1.0 }
      },
      vertexShader: `
        attribute float size;
        varying vec3 vColor;
        uniform float time;
        
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        uniform float opacity;
        
        void main() {
          float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
          float alpha = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
          gl_FragColor = vec4(vColor, alpha * opacity);
        }
      `,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true,
      vertexColors: true
    });
  }, []);

  useFrame((state) => {
    if (!meshRef.current || !groupRef.current) return;

    const elapsed = (Date.now() - startTime.current) / 1000;
    
    // Update position based on velocity
    const newPosition = [
      initialPosition.current[0] + velocity[0] * elapsed,
      initialPosition.current[1] + velocity[1] * elapsed,
      initialPosition.current[2] + velocity[2] * elapsed
    ];

    meshRef.current.position.set(newPosition[0], newPosition[1], newPosition[2]);

    // Update particle trail
    const positions = particleGeometry.attributes.position.array as Float32Array;
    for (let i = positions.length - 3; i >= 3; i -= 3) {
      positions[i] = positions[i - 3];
      positions[i + 1] = positions[i - 2];
      positions[i + 2] = positions[i - 1];
    }
    
    positions[0] = newPosition[0];
    positions[1] = newPosition[1];
    positions[2] = newPosition[2];
    
    particleGeometry.attributes.position.needsUpdate = true;

    // Update material opacity based on lifespan
    const opacity = Math.max(0, 1 - elapsed / lifespan);
    particleMaterial.uniforms.opacity.value = opacity;
    particleMaterial.uniforms.time.value = state.clock.elapsedTime;

    // Remove when lifespan is over
    if (elapsed > lifespan && onComplete) {
      onComplete();
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main shooting star */}
      <Sphere ref={meshRef} args={[size, 8, 8]} position={position}>
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={0.9}
          emissive={color}
          emissiveIntensity={0.5}
        />
      </Sphere>

      {/* Particle trail */}
      <points geometry={particleGeometry} material={particleMaterial} />

      {/* Glow effect */}
      <Sphere args={[size * 3, 8, 8]} position={position}>
        <meshBasicMaterial 
          color={color}
          transparent
          opacity={0.2}
          side={THREE.BackSide}
        />
      </Sphere>
    </group>
  );
};

export default ShootingStar;