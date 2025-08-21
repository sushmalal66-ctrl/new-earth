import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Earth3D from './Earth3D';

gsap.registerPlugin(ScrollTrigger);

const History: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);

  const historyData = [
    {
      year: "4.6 Billion Years Ago",
      title: "Formation",
      content: "Earth formed from cosmic dust and debris, becoming a molten world that would cool over millions of years."
    },
    {
      year: "3.8 Billion Years Ago", 
      title: "First Life",
      content: "Simple single-celled organisms emerged in Earth's primordial oceans, marking the beginning of life."
    },
    {
      year: "500 Million Years Ago",
      title: "Complex Life",
      content: "The Cambrian explosion brought forth complex multicellular life forms and diverse ecosystems."
    },
    {
      year: "Present Day",
      title: "Modern Earth",
      content: "A vibrant, living planet supporting millions of species and human civilization."
    }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      panelRefs.current.forEach((panel, index) => {
        if (!panel) return;

        gsap.fromTo(panel,
          { 
            opacity: 0, 
            x: index % 2 === 0 ? -100 : 100,
            y: 50 
          },
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: panel,
              start: "top 80%",
              end: "top 20%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="history-section relative min-h-screen py-20 bg-gradient-to-b from-black via-slate-900 to-black"
    >
      {/* Background 3D Earth */}
      <div className="absolute inset-0 opacity-60">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
        >
          <Earth3D section="history" />
        </Canvas>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
            Earth's History
          </h2>
          <p className="text-xl text-blue-100/70 max-w-2xl mx-auto">
            Journey through billions of years of our planet's incredible story
          </p>
        </motion.div>

        <div className="grid gap-16 max-w-6xl mx-auto">
          {historyData.map((item, index) => (
            <div
              key={index}
              ref={el => panelRefs.current[index] = el}
              className={`flex flex-col md:flex-row items-center gap-8 ${
                index % 2 === 1 ? 'md:flex-row-reverse' : ''
              }`}
            >
              <div className="flex-1 bg-black/40 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-8 hover:border-blue-400/40 transition-all duration-500 hover:scale-105">
                <div className="text-blue-300 text-sm font-medium mb-2 tracking-wide">
                  {item.year}
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">
                  {item.title}
                </h3>
                <p className="text-blue-100/80 text-lg leading-relaxed">
                  {item.content}
                </p>
              </div>
              
              <div className="w-20 h-20 flex-shrink-0 rounded-full bg-gradient-to-r from-blue-500 to-blue-300 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default History;