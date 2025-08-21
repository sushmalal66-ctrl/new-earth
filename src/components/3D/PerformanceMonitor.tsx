import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface PerformanceData {
  fps: number;
  frameTime: number;
  memoryUsage: number;
  drawCalls: number;
  triangles: number;
}

interface PerformanceMonitorProps {
  onUpdate: (data: PerformanceData) => void;
  enableLOD?: boolean;
  targetFPS?: number;
}

const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  onUpdate,
  enableLOD = true,
  targetFPS = 60
}) => {
  const { gl, scene, camera } = useThree();
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const fpsHistory = useRef<number[]>([]);
  const [performanceLevel, setPerformanceLevel] = useState<'high' | 'medium' | 'low'>('high');

  // Performance tracking
  useFrame(() => {
    frameCount.current++;
    const currentTime = performance.now();
    const deltaTime = currentTime - lastTime.current;

    // Calculate FPS every second
    if (deltaTime >= 1000) {
      const fps = (frameCount.current * 1000) / deltaTime;
      const frameTime = deltaTime / frameCount.current;
      
      // Update FPS history
      fpsHistory.current.push(fps);
      if (fpsHistory.current.length > 60) {
        fpsHistory.current.shift();
      }

      // Calculate average FPS
      const avgFPS = fpsHistory.current.reduce((a, b) => a + b, 0) / fpsHistory.current.length;

      // Get memory usage (if available)
      let memoryUsage = 0;
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        memoryUsage = memory.usedJSHeapSize / 1024 / 1024; // Convert to MB
      }

      // Get render info
      const renderInfo = gl.info.render;
      
      const performanceData: PerformanceData = {
        fps: Math.round(fps),
        frameTime: Math.round(frameTime * 100) / 100,
        memoryUsage: Math.round(memoryUsage * 100) / 100,
        drawCalls: renderInfo.calls,
        triangles: renderInfo.triangles
      };

      onUpdate(performanceData);

      // Adjust performance level based on FPS
      if (enableLOD) {
        if (avgFPS < targetFPS * 0.6) {
          setPerformanceLevel('low');
        } else if (avgFPS < targetFPS * 0.8) {
          setPerformanceLevel('medium');
        } else {
          setPerformanceLevel('high');
        }
      }

      // Reset counters
      frameCount.current = 0;
      lastTime.current = currentTime;
    }
  });

  // Apply performance optimizations based on level
  useEffect(() => {
    const applyOptimizations = () => {
      switch (performanceLevel) {
        case 'low':
          // Reduce shadow quality
          gl.shadowMap.type = THREE.BasicShadowMap;
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 1));
          
          // Reduce anisotropy
          scene.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material) {
              const materials = Array.isArray(child.material) ? child.material : [child.material];
              materials.forEach((material) => {
                if (material instanceof THREE.MeshStandardMaterial || 
                    material instanceof THREE.MeshPhysicalMaterial) {
                  if (material.map) material.map.anisotropy = 1;
                  if (material.normalMap) material.normalMap.anisotropy = 1;
                  if (material.roughnessMap) material.roughnessMap.anisotropy = 1;
                }
              });
            }
          });
          break;

        case 'medium':
          gl.shadowMap.type = THREE.PCFShadowMap;
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
          
          scene.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material) {
              const materials = Array.isArray(child.material) ? child.material : [child.material];
              materials.forEach((material) => {
                if (material instanceof THREE.MeshStandardMaterial || 
                    material instanceof THREE.MeshPhysicalMaterial) {
                  if (material.map) material.map.anisotropy = 4;
                  if (material.normalMap) material.normalMap.anisotropy = 4;
                  if (material.roughnessMap) material.roughnessMap.anisotropy = 4;
                }
              });
            }
          });
          break;

        case 'high':
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
          
          scene.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material) {
              const materials = Array.isArray(child.material) ? child.material : [child.material];
              materials.forEach((material) => {
                if (material instanceof THREE.MeshStandardMaterial || 
                    material instanceof THREE.MeshPhysicalMaterial) {
                  if (material.map) material.map.anisotropy = 16;
                  if (material.normalMap) material.normalMap.anisotropy = 16;
                  if (material.roughnessMap) material.roughnessMap.anisotropy = 16;
                }
              });
            }
          });
          break;
      }
    };

    applyOptimizations();
  }, [performanceLevel, gl, scene]);

  return null;
};

export default PerformanceMonitor;