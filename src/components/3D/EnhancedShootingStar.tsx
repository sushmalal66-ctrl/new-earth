import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion-3d';

interface EnhancedShootingStarProps {
  position: [number, number, number];
  velocity: [number, number, number];
  color?: string;
  size?: number;
  trailLength?: number;
  lifespan?: number;
  intensity?: number;
  onComplete?: () => void;
}

const EnhancedShootingStar: React.FC<EnhancedShootingStarProps> = ({
  position,
  velocity,
  color = '#ffffff',
  size = 0.02,
  trailLength = 50,
  lifespan = 8,
  intensity = 1.0,
  onComplete
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const trailRef = useRef<THREE.Points>(null);
  const groupRef = useRef<THREE.Group>(null);
  const startTime = useRef(Date.now());
  const initialPosition = useRef([...position]);
  const trailPositions = useRef<number[]>([]);

  // Create advanced particle system for trail effect
  const { trailGeometry, trailMaterial } = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(trailLength * 3);
    const colors = new Float32Array(trailLength * 3);
    const sizes = new Float32Array(trailLength);
    const alphas = new Float32Array(trailLength);

    const colorObj = new THREE.Color(color);
    
    for (let i = 0; i < trailLength; i++) {
      // Initialize positions
      positions[i * 3] = position[0];
      positions[i * 3 + 1] = position[1];
      positions[i * 3 + 2] = position[2];

      // Color gradient along trail
      const factor = i / trailLength;
      colors[i * 3] = colorObj.r * (1 - factor * 0.5);
      colors[i * 3 + 1] = colorObj.g * (1 - factor * 0.5);
      colors[i * 3 + 2] = colorObj.b * (1 - factor * 0.5);

      // Size gradient
      sizes[i] = size * (1 - factor) * 2;
      
      // Alpha gradient
      alphas[i] = (1 - factor) * intensity;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        opacity: { value: 1.0 },
        pixelRatio: { value: window.devicePixelRatio }
      },
      vertexShader: `
        attribute float size;
        attribute float alpha;
        uniform float time;
        uniform float pixelRatio;
        varying vec3 vColor;
        varying float vAlpha;
        
        void main() {
          vColor = color;
          vAlpha = alpha;
          
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          
          // Add sparkle effect
          float sparkle = sin(time * 10.0 + position.x * 100.0) * 0.3 + 0.7;
          gl_PointSize = size * sparkle * pixelRatio * (300.0 / -mvPosition.z);
          
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform float opacity;
        varying vec3 vColor;
        varying float vAlpha;
        
        void main() {
          // Create circular particle with soft edges
          float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
          float alpha = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
          
          // Add core brightness
          float core = 1.0 - smoothstep(0.0, 0.2, distanceToCenter);
          vec3 finalColor = vColor + vec3(core * 0.5);
          
          gl_FragColor = vec4(finalColor, alpha * vAlpha * opacity);
        }
      `,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true,
      vertexColors: true
    });

    return { trailGeometry: geometry, trailMaterial: material };
  }, [color, size, trailLength, intensity, position]);

  // Main shooting star material with enhanced effects
  const starMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(color) },
        intensity: { value: intensity }
      },
      vertexShader: `
        uniform float time;
        varying vec3 vPosition;
        varying vec3 vNormal;
        
        void main() {
          vPosition = position;
          vNormal = normal;
          
          // Add subtle pulsing
          vec3 pos = position * (1.0 + sin(time * 20.0) * 0.1);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color;
        uniform float intensity;
        varying vec3 vPosition;
        varying vec3 vNormal;
        
        void main() {
          // Create bright core with outer glow
          float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          vec3 finalColor = color * (1.0 + fresnel * 2.0) * intensity;
          
          // Add sparkle effect
          float sparkle = sin(time * 15.0 + vPosition.x * 50.0) * 0.2 + 0.8;
          finalColor *= sparkle;
          
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
      transparent: false
    });
  }, [color, intensity]);

  useFrame((state) => {
    if (!meshRef.current || !groupRef.current || !trailRef.current) return;

    const elapsed = (Date.now() - startTime.current) / 1000;
    const time = state.clock.elapsedTime;
    
    // Update position based on velocity with slight curve
    const curve = Math.sin(elapsed * 2) * 0.1;
    const newPosition = [
      initialPosition.current[0] + velocity[0] * elapsed,
      initialPosition.current[1] + velocity[1] * elapsed + curve,
      initialPosition.current[2] + velocity[2] * elapsed
    ];

    meshRef.current.position.set(newPosition[0], newPosition[1], newPosition[2]);

    // Update trail positions
    const positions = trailGeometry.attributes.position.array as Float32Array;
    
    // Shift existing positions
    for (let i = positions.length - 3; i >= 3; i -= 3) {
      positions[i] = positions[i - 3];
      positions[i + 1] = positions[i - 2];
      positions[i + 2] = positions[i - 1];
    }
    
    // Add new position at front
    positions[0] = newPosition[0];
    positions[1] = newPosition[1];
    positions[2] = newPosition[2];
    
    trailGeometry.attributes.position.needsUpdate = true;

    // Update material uniforms
    trailMaterial.uniforms.time.value = time;
    starMaterial.uniforms.time.value = time;

    // Fade out over lifespan
    const opacity = Math.max(0, 1 - elapsed / lifespan);
    trailMaterial.uniforms.opacity.value = opacity;

    // Remove when lifespan is over
    if (elapsed > lifespan && onComplete) {
      onComplete();
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main shooting star core */}
      <Sphere ref={meshRef} args={[size, 8, 8]} position={position}>
        <primitive object={starMaterial} attach="material" />
      </Sphere>

      {/* Particle trail */}
      <points ref={trailRef} geometry={trailGeometry} material={trailMaterial} />

      {/* Outer glow effect */}
      <Sphere args={[size * 4, 8, 8]} position={position}>
        <meshBasicMaterial 
          color={color}
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Lens flare effect */}
      <Sphere args={[size * 8, 6, 6]} position={position}>
        <meshBasicMaterial 
          color={color}
          transparent
          opacity={0.05}
          side={THREE.BackSide}
        />
      </Sphere>
    </group>
  );
};

export default EnhancedShootingStar;