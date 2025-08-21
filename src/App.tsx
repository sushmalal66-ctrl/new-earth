import React from 'react';
import Hero from './components/Hero';
import ScrollEarthSection from './components/ScrollEarthSection';
import './index.css';

function App() {
  return (
    <div className="relative bg-black text-white">
      <Hero />
      <ScrollEarthSection />
    </div>
  );
}

export default App;