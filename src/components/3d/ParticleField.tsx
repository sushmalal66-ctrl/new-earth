import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { MotionValue } from 'framer-motion';
import * as THREE from 'three';

interface ParticleFieldProps {
  earthProgress: MotionValue<number>;
}

const ParticleField: React.FC<ParticleFieldProps> = ({ earthProgress }) => {
  const particlesRef = useRef<THREE.Points>(null);
  const nebulaRef = useRef<THREE.Points>(null);

  // Create particle geometry
  const [particleGeometry, nebulaGeometry] = useMemo(() => {
    // Main particles
    const particleCount = window.innerWidth < 768 ? 1000 : 2000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      // Spherical distribution
      const radius = 20 + Math.random() * 80;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // Particle colors
      const color = new THREE.Color();
      color.setHSL(0.6 + Math.random() * 0.2, 0.5, 0.5 + Math.random() * 0.5);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      sizes[i] = Math.random() * 2 + 0.5;
    }

    const pGeometry = new THREE.BufferGeometry();
    pGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    pGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Nebula particles (fewer, larger)
    const nebulaCount = window.innerWidth < 768 ? 200 : 500;
    const nebulaPositions = new Float32Array(nebulaCount * 3);
    const nebulaColors = new Float32Array(nebulaCount * 3);
    const nebulaSizes = new Float32Array(nebulaCount);

    for (let i = 0; i < nebulaCount; i++) {
      const radius = 30 + Math.random() * 100;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      nebulaPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      nebulaPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      nebulaPositions[i * 3 + 2] = radius * Math.cos(phi);

      // Nebula colors (cyan/blue theme)
      const color = new THREE.Color();
      color.setHSL(0.5 + Math.random() * 0.2, 0.8, 0.3 + Math.random() * 0.4);
      nebulaColors[i * 3] = color.r;
      nebulaColors[i * 3 + 1] = color.g;
      nebulaColors[i * 3 + 2] = color.b;

      nebulaSizes[i] = Math.random() * 8 + 2;
    }

    const nGeometry = new THREE.BufferGeometry();
    nGeometry.setAttribute('position', new THREE.BufferAttribute(nebulaPositions, 3));
    nGeometry.setAttribute('color', new THREE.BufferAttribute(nebulaColors, 3));
    nGeometry.setAttribute('size', new THREE.BufferAttribute(nebulaSizes, 1));

    return [pGeometry, nGeometry];
  }, []);

  // Particle materials
  const particleMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        progress: { value: 0 }
      },
      vertexShader: `
        attribute float size;
        uniform float time;
        uniform float progress;
        varying vec3 vColor;
        varying float vAlpha;
        
        void main() {
          vColor = color;
          
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          
          // Twinkling effect
          float twinkle = sin(time * 2.0 + position.x * 0.01) * 0.5 + 0.5;
          float progressTwinkle = 1.0 + progress * twinkle;
          
          gl_PointSize = size * progressTwinkle * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
          
          vAlpha = twinkle * (0.3 + progress * 0.7);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;
        
        void main() {
          float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
          float alpha = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
          
          gl_FragColor = vec4(vColor, alpha * vAlpha);
        }
      `,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true,
      vertexColors: true
    });
  }, []);

  const nebulaMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        progress: { value: 0 }
      },
      vertexShader: `
        attribute float size;
        uniform float time;
        uniform float progress;
        varying vec3 vColor;
        varying float vAlpha;
        
        void main() {
          vColor = color;
          
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          
          // Slower, more organic movement
          float wave = sin(time * 0.5 + position.y * 0.005) * 0.3 + 0.7;
          float progressWave = 1.0 + progress * wave * 0.5;
          
          gl_PointSize = size * progressWave * (500.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
          
          vAlpha = wave * (0.1 + progress * 0.3);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;
        
        void main() {
          float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
          float alpha = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
          
          // Soft glow effect
          float glow = 1.0 - smoothstep(0.0, 0.3, distanceToCenter);
          vec3 finalColor = vColor + vec3(glow * 0.3);
          
          gl_FragColor = vec4(finalColor, alpha * vAlpha);
        }
      `,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true,
      vertexColors: true
    });
  }, []);

  // Animation
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const progress = earthProgress.get();

    if (particlesRef.current) {
      particlesRef.current.rotation.y = time * 0.02;
      particlesRef.current.rotation.x = time * 0.01;
      
      // Update material uniforms
      (particlesRef.current.material as THREE.ShaderMaterial).uniforms.time.value = time;
      (particlesRef.current.material as THREE.ShaderMaterial).uniforms.progress.value = progress;
    }

    if (nebulaRef.current) {
      nebulaRef.current.rotation.y = -time * 0.01;
      nebulaRef.current.rotation.z = time * 0.005;
      
      // Update material uniforms
      (nebulaRef.current.material as THREE.ShaderMaterial).uniforms.time.value = time;
      (nebulaRef.current.material as THREE.ShaderMaterial).uniforms.progress.value = progress;
    }
  });

  return (
    <group>
      {/* Main particle field */}
      <points ref={particlesRef} geometry={particleGeometry} material={particleMaterial} />
      
      {/* Nebula particles */}
      <points ref={nebulaRef} geometry={nebulaGeometry} material={nebulaMaterial} />
    </group>
  );
};

export default ParticleField;