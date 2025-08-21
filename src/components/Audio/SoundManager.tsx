import React, { useEffect, useRef, useState } from 'react';
import { Howl, Howler } from 'howler';

interface SoundManagerProps {
  volume: number;
  isEnabled: boolean;
  currentPeriod: string;
}

interface SoundEffect {
  id: string;
  sound: Howl;
  loop: boolean;
}

const SoundManager: React.FC<SoundManagerProps> = ({
  volume,
  isEnabled,
  currentPeriod
}) => {
  const soundsRef = useRef<Map<string, SoundEffect>>(new Map());
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize sound effects
  useEffect(() => {
    if (!isEnabled) return;

    const initializeSounds = () => {
      // Ambient space sounds
      const ambientSpace = new Howl({
        src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT']}),
        loop: true,
        volume: 0.3
      });

      // Earth rotation sound
      const earthRotation = new Howl({
        src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT']}),
        loop: true,
        volume: 0.1
      });

      // Shooting star sound
      const shootingStar = new Howl({
        src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT']}),
        loop: false,
        volume: 0.2
      });

      // UI interaction sounds
      const uiClick = new Howl({
        src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT']}),
        loop: false,
        volume: 0.15
      });

      const uiHover = new Howl({
        src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT']}),
        loop: false,
        volume: 0.1
      });

      // Period-specific ambient sounds
      const periodSounds = {
        hadean: new Howl({
          src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT']}),
          loop: true,
          volume: 0.2
        }),
        archean: new Howl({
          src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT']}),
          loop: true,
          volume: 0.15
        }),
        cenozoic: new Howl({
          src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT']}),
          loop: true,
          volume: 0.1
        })
      };

      // Store sounds in ref
      soundsRef.current.set('ambient', { id: 'ambient', sound: ambientSpace, loop: true });
      soundsRef.current.set('rotation', { id: 'rotation', sound: earthRotation, loop: true });
      soundsRef.current.set('shootingStar', { id: 'shootingStar', sound: shootingStar, loop: false });
      soundsRef.current.set('uiClick', { id: 'uiClick', sound: uiClick, loop: false });
      soundsRef.current.set('uiHover', { id: 'uiHover', sound: uiHover, loop: false });
      
      Object.entries(periodSounds).forEach(([period, sound]) => {
        soundsRef.current.set(`period_${period}`, { id: `period_${period}`, sound, loop: true });
      });

      setIsInitialized(true);
    };

    // Initialize sounds on first user interaction
    const handleFirstInteraction = () => {
      initializeSounds();
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('keydown', handleFirstInteraction);

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };
  }, [isEnabled]);

  // Update volume
  useEffect(() => {
    if (!isInitialized) return;

    Howler.volume(volume);
  }, [volume, isInitialized]);

  // Handle period changes
  useEffect(() => {
    if (!isInitialized || !isEnabled) return;

    // Stop all period sounds
    soundsRef.current.forEach((soundEffect) => {
      if (soundEffect.id.startsWith('period_')) {
        soundEffect.sound.stop();
      }
    });

    // Start current period sound
    const currentPeriodSound = soundsRef.current.get(`period_${currentPeriod}`);
    if (currentPeriodSound) {
      currentPeriodSound.sound.play();
    }
  }, [currentPeriod, isInitialized, isEnabled]);

  // Start/stop ambient sounds based on enabled state
  useEffect(() => {
    if (!isInitialized) return;

    const ambientSound = soundsRef.current.get('ambient');
    const rotationSound = soundsRef.current.get('rotation');

    if (isEnabled) {
      ambientSound?.sound.play();
      rotationSound?.sound.play();
    } else {
      ambientSound?.sound.stop();
      rotationSound?.sound.stop();
      
      // Stop all period sounds
      soundsRef.current.forEach((soundEffect) => {
        if (soundEffect.id.startsWith('period_')) {
          soundEffect.sound.stop();
        }
      });
    }
  }, [isEnabled, isInitialized]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      soundsRef.current.forEach((soundEffect) => {
        soundEffect.sound.unload();
      });
      soundsRef.current.clear();
    };
  }, []);

  // Expose sound playing functions globally
  useEffect(() => {
    if (!isInitialized) return;

    // Add sound functions to window for global access
    (window as any).playSound = (soundId: string) => {
      if (!isEnabled) return;
      
      const soundEffect = soundsRef.current.get(soundId);
      if (soundEffect && !soundEffect.loop) {
        soundEffect.sound.play();
      }
    };

    (window as any).playShootingStar = () => {
      if (!isEnabled) return;
      
      const shootingStarSound = soundsRef.current.get('shootingStar');
      if (shootingStarSound) {
        shootingStarSound.sound.play();
      }
    };

    return () => {
      delete (window as any).playSound;
      delete (window as any).playShootingStar;
    };
  }, [isInitialized, isEnabled]);

  return null;
};

export default SoundManager;