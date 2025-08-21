import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Loader2, CheckCircle } from 'lucide-react';

interface LoadingScreenProps {
  isLoading: boolean;
  progress: number;
  currentTask: string;
  onComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  isLoading,
  progress,
  currentTask,
  onComplete
}) => {
  const [displayProgress, setDisplayProgress] = useState(0);
  const [loadingTasks] = useState([
    'Initializing 3D Engine...',
    'Loading Earth Textures...',
    'Generating Star Field...',
    'Creating Atmosphere...',
    'Loading Geological Data...',
    'Optimizing Performance...',
    'Ready to Explore!'
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setDisplayProgress(prev => {
        const diff = progress - prev;
        return prev + diff * 0.1;
      });
    }, 16);

    return () => clearInterval(timer);
  }, [progress]);

  useEffect(() => {
    if (progress >= 100) {
      const timer = setTimeout(onComplete, 1000);
      return () => clearTimeout(timer);
    }
  }, [progress, onComplete]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.2
      }
    },
    exit: { 
      opacity: 0,
      scale: 1.1,
      transition: { duration: 0.8 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    }
  };

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-50 bg-gradient-to-b from-black via-slate-900 to-black flex items-center justify-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Animated Background */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full opacity-30"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0.1, 0.8, 0.1],
                  scale: [0.5, 1.2, 0.5],
                }}
                transition={{
                  duration: 2 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          <div className="relative z-10 text-center max-w-md mx-auto px-6">
            {/* Logo/Icon */}
            <motion.div
              className="mb-8"
              variants={itemVariants}
            >
              <motion.div
                className="w-24 h-24 mx-auto bg-gradient-to-r from-blue-500 to-blue-300 rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/30"
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity }
                }}
              >
                <Globe className="w-12 h-12 text-white" />
              </motion.div>
            </motion.div>

            {/* Title */}
            <motion.h1
              className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-300 via-white to-blue-100 bg-clip-text text-transparent"
              variants={itemVariants}
            >
              EARTH
            </motion.h1>

            <motion.p
              className="text-xl text-blue-100/80 mb-12 font-light"
              variants={itemVariants}
            >
              Journey Through Time
            </motion.p>

            {/* Progress Bar */}
            <motion.div
              className="mb-8"
              variants={itemVariants}
            >
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-blue-200 font-medium">
                  Loading Experience
                </span>
                <span className="text-sm text-blue-300 font-mono">
                  {Math.round(displayProgress)}%
                </span>
              </div>
              
              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-300 rounded-full relative"
                  initial={{ width: 0 }}
                  animate={{ width: `${displayProgress}%` }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                >
                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </motion.div>
              </div>
            </motion.div>

            {/* Current Task */}
            <motion.div
              className="mb-8"
              variants={itemVariants}
            >
              <div className="flex items-center justify-center space-x-3">
                {progress < 100 ? (
                  <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                )}
                <span className="text-blue-200 font-medium">
                  {currentTask}
                </span>
              </div>
            </motion.div>

            {/* Loading Tasks List */}
            <motion.div
              className="space-y-2"
              variants={itemVariants}
            >
              {loadingTasks.map((task, index) => {
                const taskProgress = Math.max(0, Math.min(100, (displayProgress - index * 14.3) / 14.3 * 100));
                const isCompleted = taskProgress >= 100;
                const isActive = taskProgress > 0 && taskProgress < 100;
                
                return (
                  <motion.div
                    key={index}
                    className={`flex items-center space-x-3 text-sm transition-colors duration-300 ${
                      isCompleted 
                        ? 'text-green-400' 
                        : isActive 
                          ? 'text-blue-300' 
                          : 'text-gray-500'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="w-4 h-4 flex items-center justify-center">
                      {isCompleted ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : isActive ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-gray-600" />
                      )}
                    </div>
                    <span>{task}</span>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Tips */}
            <motion.div
              className="mt-12 p-4 bg-blue-900/20 border border-blue-500/20 rounded-xl"
              variants={itemVariants}
            >
              <p className="text-xs text-blue-200/70 leading-relaxed">
                <strong className="text-blue-200">Tip:</strong> Use your mouse to rotate the Earth, 
                scroll to zoom, and explore different geological periods through the timeline.
              </p>
            </motion.div>
          </div>

          {/* Floating Particles */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-blue-400/20 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.2, 0.8, 0.2],
                  scale: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;