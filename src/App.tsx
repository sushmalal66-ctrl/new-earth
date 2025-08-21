import React, { useEffect } from 'react';
import Lenis from '@studio-freight/lenis'
import Hero from './components/Hero';
import History from './components/History';
import TravelBack from './components/TravelBack';
import EnhancedFooter from './components/EnhancedFooter';
import './index.css';

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: true,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="relative bg-black text-white overflow-x-hidden">
      <Hero />
      <History />
      <TravelBack />
      <EnhancedFooter />
    </div>
  );
}

export default App;