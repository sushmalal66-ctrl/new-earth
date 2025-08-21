import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  Settings, 
  Info,
  Volume2,
  VolumeX,
  Menu,
  X,
  Monitor,
  Cpu,
  Activity
} from 'lucide-react';

interface NavigationControlsProps {
  rotationSpeed: number;
  onRotationSpeedChange: (speed: number) => void;
  isPlaying: boolean;
  onPlayPause: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  volume: number;
  onVolumeChange: (volume: number) => void;
  currentPeriod: string;
  onPeriodChange: (period: string) => void;
  showAtmosphere: boolean;
  onAtmosphereToggle: (show: boolean) => void;
  showClouds: boolean;
  onCloudsToggle: (show: boolean) => void;
  showShootingStars: boolean;
  onShootingStarsToggle: (show: boolean) => void;
  fps?: number;
  memoryUsage?: number;
}

const NavigationControls: React.FC<NavigationControlsProps> = ({
  rotationSpeed,
  onRotationSpeedChange,
  isPlaying,
  onPlayPause,
  onZoomIn,
  onZoomOut,
  onReset,
  volume,
  onVolumeChange,
  currentPeriod,
  onPeriodChange,
  showAtmosphere,
  onAtmosphereToggle,
  showClouds,
  onCloudsToggle,
  showShootingStars,
  onShootingStarsToggle,
  fps = 60,
  memoryUsage = 0
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPerformance, setShowPerformance] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const geologicalPeriods = [
    { id: 'hadean', name: 'Hadean Eon', years: '4.6-4.0 Ga', color: '#ff4444' },
    { id: 'archean', name: 'Archean Eon', years: '4.0-2.5 Ga', color: '#ff8844' },
    { id: 'proterozoic', name: 'Proterozoic Eon', years: '2.5-0.54 Ga', color: '#ffaa44' },
    { id: 'paleozoic', name: 'Paleozoic Era', years: '541-252 Ma', color: '#44ff44' },
    { id: 'mesozoic', name: 'Mesozoic Era', years: '252-66 Ma', color: '#4444ff' },
    { id: 'cenozoic', name: 'Cenozoic Era', years: '66 Ma-Present', color: '#44ffff' }
  ];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const controlVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  const getPerformanceColor = (value: number, threshold: number) => {
    if (value >= threshold) return 'text-green-400';
    if (value >= threshold * 0.7) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <>
      {/* Mobile Menu Toggle */}
      {isMobile && (
        <motion.button
          className="fixed top-6 right-6 z-50 w-12 h-12 bg-black/60 backdrop-blur-sm border border-blue-500/30 rounded-full flex items-center justify-center text-white hover:bg-blue-500/20 transition-colors duration-300"
          onClick={() => setIsExpanded(!isExpanded)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Toggle navigation menu"
        >
          {isExpanded ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </motion.button>
      )}

      {/* Main Controls Panel */}
      <AnimatePresence>
        {(!isMobile || isExpanded) && (
          <motion.div
            className={`fixed ${isMobile ? 'top-20 right-6 left-6' : 'top-6 right-6'} z-40 bg-black/60 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-6 shadow-2xl max-w-sm`}
            variants={controlVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {/* Header */}
            <motion.div 
              className="flex items-center justify-between mb-6"
              variants={itemVariants}
            >
              <h3 className="text-lg font-semibold text-white flex items-center">
                <Settings className="w-5 h-5 mr-2 text-blue-400" />
                Earth Controls
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowPerformance(!showPerformance)}
                  className="p-2 hover:bg-blue-500/20 rounded-lg transition-colors duration-300"
                  aria-label="Toggle performance monitor"
                >
                  <Monitor className="w-4 h-4 text-blue-300" />
                </button>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 hover:bg-blue-500/20 rounded-lg transition-colors duration-300"
                  aria-label="Toggle advanced settings"
                >
                  <Info className="w-4 h-4 text-blue-300" />
                </button>
              </div>
            </motion.div>

            {/* Playback Controls */}
            <motion.div 
              className="grid grid-cols-2 gap-3 mb-6"
              variants={itemVariants}
            >
              <motion.button
                onClick={onPlayPause}
                className="flex items-center justify-center p-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-medium transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={isPlaying ? "Pause rotation" : "Start rotation"}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span className="ml-2">{isPlaying ? 'Pause' : 'Play'}</span>
              </motion.button>

              <motion.button
                onClick={onReset}
                className="flex items-center justify-center p-3 bg-gray-600 hover:bg-gray-500 rounded-xl text-white font-medium transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Reset view"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="ml-2">Reset</span>
              </motion.button>
            </motion.div>

            {/* Zoom Controls */}
            <motion.div 
              className="grid grid-cols-2 gap-3 mb-6"
              variants={itemVariants}
            >
              <motion.button
                onClick={onZoomIn}
                className="flex items-center justify-center p-3 bg-green-600 hover:bg-green-500 rounded-xl text-white font-medium transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Zoom in"
              >
                <ZoomIn className="w-4 h-4" />
                <span className="ml-2">Zoom In</span>
              </motion.button>

              <motion.button
                onClick={onZoomOut}
                className="flex items-center justify-center p-3 bg-orange-600 hover:bg-orange-500 rounded-xl text-white font-medium transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Zoom out"
              >
                <ZoomOut className="w-4 h-4" />
                <span className="ml-2">Zoom Out</span>
              </motion.button>
            </motion.div>

            {/* Rotation Speed Control */}
            <motion.div 
              className="mb-6"
              variants={itemVariants}
            >
              <label className="block text-sm font-medium text-blue-200 mb-3">
                Rotation Speed: {rotationSpeed.toFixed(3)}
              </label>
              <div className="flex items-center space-x-3">
                <RotateCcw className="w-4 h-4 text-blue-300" />
                <input
                  type="range"
                  min="0"
                  max="0.05"
                  step="0.001"
                  value={rotationSpeed}
                  onChange={(e) => onRotationSpeedChange(parseFloat(e.target.value))}
                  className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(rotationSpeed / 0.05) * 100}%, #374151 ${(rotationSpeed / 0.05) * 100}%, #374151 100%)`
                  }}
                  aria-label="Rotation speed control"
                />
                <RotateCw className="w-4 h-4 text-blue-300" />
              </div>
            </motion.div>

            {/* Volume Control */}
            <motion.div 
              className="mb-6"
              variants={itemVariants}
            >
              <label className="block text-sm font-medium text-blue-200 mb-3">
                Volume: {Math.round(volume * 100)}%
              </label>
              <div className="flex items-center space-x-3">
                <VolumeX className="w-4 h-4 text-blue-300" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                  className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${volume * 100}%, #374151 ${volume * 100}%, #374151 100%)`
                  }}
                  aria-label="Volume control"
                />
                <Volume2 className="w-4 h-4 text-blue-300" />
              </div>
            </motion.div>

            {/* Geological Periods */}
            <motion.div 
              className="mb-6"
              variants={itemVariants}
            >
              <label className="block text-sm font-medium text-blue-200 mb-3">
                Geological Period
              </label>
              <div className="space-y-2">
                {geologicalPeriods.map((period) => (
                  <motion.button
                    key={period.id}
                    onClick={() => onPeriodChange(period.id)}
                    className={`w-full p-3 rounded-xl text-left transition-all duration-300 ${
                      currentPeriod === period.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-3"
                        style={{ backgroundColor: period.color }}
                      />
                      <div>
                        <div className="font-medium">{period.name}</div>
                        <div className="text-xs opacity-70">{period.years}</div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Performance Monitor */}
            <AnimatePresence>
              {showPerformance && (
                <motion.div
                  className="mb-6 p-4 bg-gray-800/50 rounded-xl border border-gray-600"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h4 className="text-sm font-medium text-blue-200 mb-3 flex items-center">
                    <Activity className="w-4 h-4 mr-2" />
                    Performance Monitor
                  </h4>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">FPS:</span>
                      <span className={getPerformanceColor(fps, 50)}>
                        {fps.toFixed(0)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Memory:</span>
                      <span className={getPerformanceColor(100 - memoryUsage, 70)}>
                        {memoryUsage.toFixed(1)}MB
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(fps / 60 * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Advanced Settings */}
            <AnimatePresence>
              {showSettings && (
                <motion.div
                  className="pt-6 border-t border-gray-600"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h4 className="text-sm font-medium text-blue-200 mb-4">Visual Settings</h4>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Show Atmosphere</span>
                      <motion.button
                        onClick={() => onAtmosphereToggle(!showAtmosphere)}
                        className={`w-12 h-6 rounded-full transition-colors duration-300 ${
                          showAtmosphere ? 'bg-blue-500' : 'bg-gray-600'
                        }`}
                        whileTap={{ scale: 0.95 }}
                      >
                        <motion.div
                          className="w-5 h-5 bg-white rounded-full shadow-md"
                          animate={{ x: showAtmosphere ? 24 : 2 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      </motion.button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Show Clouds</span>
                      <motion.button
                        onClick={() => onCloudsToggle(!showClouds)}
                        className={`w-12 h-6 rounded-full transition-colors duration-300 ${
                          showClouds ? 'bg-blue-500' : 'bg-gray-600'
                        }`}
                        whileTap={{ scale: 0.95 }}
                      >
                        <motion.div
                          className="w-5 h-5 bg-white rounded-full shadow-md"
                          animate={{ x: showClouds ? 24 : 2 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      </motion.button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Shooting Stars</span>
                      <motion.button
                        onClick={() => onShootingStarsToggle(!showShootingStars)}
                        className={`w-12 h-6 rounded-full transition-colors duration-300 ${
                          showShootingStars ? 'bg-blue-500' : 'bg-gray-600'
                        }`}
                        whileTap={{ scale: 0.95 }}
                      >
                        <motion.div
                          className="w-5 h-5 bg-white rounded-full shadow-md"
                          animate={{ x: showShootingStars ? 24 : 2 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard Shortcuts Help */}
      <motion.div
        className="fixed bottom-6 left-6 z-30 bg-black/60 backdrop-blur-sm border border-blue-500/20 rounded-xl p-4 text-xs text-blue-200 max-w-xs"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
      >
        <h4 className="font-medium mb-2">Keyboard Shortcuts</h4>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span>Space</span>
            <span>Play/Pause</span>
          </div>
          <div className="flex justify-between">
            <span>R</span>
            <span>Reset View</span>
          </div>
          <div className="flex justify-between">
            <span>+/-</span>
            <span>Zoom In/Out</span>
          </div>
          <div className="flex justify-between">
            <span>←/→</span>
            <span>Rotate Speed</span>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default NavigationControls;