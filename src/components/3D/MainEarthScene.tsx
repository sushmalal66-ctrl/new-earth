import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import LODEarth from './LODEarth';
import EnhancedSpaceEnvironment from './EnhancedSpaceEnvironment';
import PerformanceMonitor from './PerformanceMonitor';
import EnhancedNavigationControls from '../UI/EnhancedNavigationControls';
import LoadingScreen from '../UI/LoadingScreen';
import SoundManager from '../Audio/SoundManager';

interface MainEarthSceneProps {
  className?: string;
}

interface PerformanceData {
  fps: number;
  frameTime: number;
  memoryUsage: number;
  drawCalls: number;
  triangles: number;
}

const MainEarthScene: React.FC<MainEarthSceneProps> = ({ className }) => {
  // State management
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState('Initializing 3D Engine...');
  const [rotationSpeed, setRotationSpeed] = useState(0.005);
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(0.3);
  const [currentPeriod, setCurrentPeriod] = useState('cenozoic');
  const [showAtmosphere, setShowAtmosphere] = useState(true);
  const [showClouds, setShowClouds] = useState(true);
  const [showShootingStars, setShowShootingStars] = useState(true);
  const [performanceLevel, setPerformanceLevel] = useState<'high' | 'medium' | 'low'>('high');
  const [performanceData, setPerformanceData] = useState<PerformanceData>({
    fps: 60,
    frameTime: 16.67,
    memoryUsage: 0,
    drawCalls: 0,
    triangles: 0
  });

  const controlsRef = useRef<any>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  // Loading simulation
  useEffect(() => {
    const tasks = [
      'Initializing 3D Engine...',
      'Loading Earth Textures...',
      'Generating Star Field...',
      'Creating Atmosphere...',
      'Loading Geological Data...',
      'Optimizing Performance...',
      'Ready to Explore!'
    ];

    let currentTaskIndex = 0;
    let progress = 0;

    const loadingInterval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      
      if (progress >= 100) {
        progress = 100;
        setCurrentTask('Ready to Explore!');
        setLoadingProgress(100);
        clearInterval(loadingInterval);
        return;
      }

      const taskIndex = Math.floor((progress / 100) * tasks.length);
      if (taskIndex !== currentTaskIndex && taskIndex < tasks.length) {
        currentTaskIndex = taskIndex;
        setCurrentTask(tasks[taskIndex]);
      }

      setLoadingProgress(progress);
    }, 200);

    return () => clearInterval(loadingInterval);
  }, []);

  // Control handlers
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleZoomIn = () => {
    if (controlsRef.current) {
      controlsRef.current.dollyIn(0.8);
      controlsRef.current.update();
    }
  };

  const handleZoomOut = () => {
    if (controlsRef.current) {
      controlsRef.current.dollyOut(0.8);
      controlsRef.current.update();
    }
  };

  const handleReset = () => {
    if (controlsRef.current && cameraRef.current) {
      controlsRef.current.reset();
      cameraRef.current.position.set(0, 0, 5);
      controlsRef.current.update();
    }
  };

  const handlePerformanceUpdate = (data: PerformanceData) => {
    setPerformanceData(data);
    
    // Auto-adjust performance level based on FPS
    if (data.fps < 30 && performanceLevel !== 'low') {
      setPerformanceLevel('low');
    } else if (data.fps < 45 && performanceLevel === 'high') {
      setPerformanceLevel('medium');
    } else if (data.fps > 55 && performanceLevel !== 'high') {
      setPerformanceLevel('high');
    }
  };

  const handleLoadingComplete = () => {
    setTimeout(() => setIsLoading(false), 500);
  };

  return (
    <div className={`relative w-full h-screen bg-black overflow-hidden ${className}`}>
      {/* Loading Screen */}
      <LoadingScreen
        isLoading={isLoading}
        progress={loadingProgress}
        currentTask={currentTask}
        onComplete={handleLoadingComplete}
      />

      {/* Main 3D Scene */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 1 }}
      >
        <Canvas
          gl={{
            antialias: performanceLevel === 'high',
            alpha: true,
            powerPreference: "high-performance",
            stencil: false,
            depth: true
          }}
          camera={{ position: [0, 0, 5], fov: 50, near: 0.1, far: 1000 }}
          onCreated={({ gl, camera }) => {
            // Optimize renderer settings
            gl.setClearColor(0x000000, 0);
            gl.shadowMap.enabled = performanceLevel === 'high';
            gl.shadowMap.type = performanceLevel === 'high' ? THREE.PCFSoftShadowMap : THREE.BasicShadowMap;
            gl.setPixelRatio(Math.min(window.devicePixelRatio, performanceLevel === 'high' ? 2 : 1));
            
            // Store camera reference
            if (camera instanceof THREE.PerspectiveCamera) {
              (cameraRef as any).current = camera;
            }
          }}
        >
          <Suspense fallback={null}>
            {/* Performance Monitor */}
            <PerformanceMonitor
              onUpdate={handlePerformanceUpdate}
              enableLOD={true}
              targetFPS={60}
            />

            {/* Camera Controls */}
            <OrbitControls
              ref={controlsRef}
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minDistance={2}
              maxDistance={20}
              autoRotate={false}
              enableDamping={true}
              dampingFactor={0.05}
              rotateSpeed={0.5}
              zoomSpeed={0.8}
              panSpeed={0.8}
            />

            {/* Enhanced Space Environment */}
            <EnhancedSpaceEnvironment
              starCount={performanceLevel === 'high' ? 8000 : performanceLevel === 'medium' ? 5000 : 2000}
              shootingStarFrequency={0.03}
              nebulaDensity={0.4}
              showShootingStars={showShootingStars}
              performanceLevel={performanceLevel}
              geologicalPeriod={currentPeriod}
            />

            {/* Main Earth with LOD */}
            <LODEarth
              position={[0, 0, 0]}
              rotationSpeed={isPlaying ? rotationSpeed : 0}
              performanceLevel={performanceLevel}
              showAtmosphere={showAtmosphere}
              showClouds={showClouds}
              timeOfDay={0.5}
              geologicalPeriod={currentPeriod}
            />

            {/* Enhanced Lighting Setup */}
            <ambientLight intensity={0.1} color="#f0f8ff" />
            
            <directionalLight
              position={[10, 5, 5]}
              intensity={1.5}
              color="#ffffff"
              castShadow={performanceLevel === 'high'}
              shadow-mapSize-width={performanceLevel === 'high' ? 2048 : 1024}
              shadow-mapSize-height={performanceLevel === 'high' ? 2048 : 1024}
              shadow-camera-far={50}
              shadow-camera-left={-10}
              shadow-camera-right={10}
              shadow-camera-top={10}
              shadow-camera-bottom={-10}
            />
            
            <directionalLight
              position={[-5, -2, -5]}
              intensity={0.3}
              color="#4169e1"
            />
            
            <pointLight
              position={[0, 0, 8]}
              intensity={0.4}
              color="#87ceeb"
              distance={25}
              decay={2}
            />
          </Suspense>
        </Canvas>
      </motion.div>

      {/* Enhanced Navigation Controls */}
      {!isLoading && (
        <EnhancedNavigationControls
          rotationSpeed={rotationSpeed}
          onRotationSpeedChange={setRotationSpeed}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onReset={handleReset}
          volume={volume}
          onVolumeChange={setVolume}
          currentPeriod={currentPeriod}
          onPeriodChange={setCurrentPeriod}
          showAtmosphere={showAtmosphere}
          onAtmosphereToggle={setShowAtmosphere}
          showClouds={showClouds}
          onCloudsToggle={setShowClouds}
          showShootingStars={showShootingStars}
          onShootingStarsToggle={setShowShootingStars}
          performanceLevel={performanceLevel}
          onPerformanceLevelChange={setPerformanceLevel}
          fps={performanceData.fps}
          memoryUsage={performanceData.memoryUsage}
        />
      )}

      {/* Sound Manager */}
      <SoundManager
        volume={volume}
        isEnabled={volume > 0}
        currentPeriod={currentPeriod}
      />

      {/* Accessibility Features */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {isLoading ? `Loading: ${currentTask} ${Math.round(loadingProgress)}%` : 
         `Earth History Explorer. Current period: ${currentPeriod}. Rotation ${isPlaying ? 'playing' : 'paused'}.`}
      </div>
    </div>
  );
};

export default MainEarthScene;