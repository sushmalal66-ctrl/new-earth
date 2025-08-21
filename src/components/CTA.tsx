import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Globe, Sparkles, Zap } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const CTA: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const ctaItems = [
    {
      icon: Globe,
      title: "Explore More",
      description: "Discover the wonders of our planet through interactive experiences",
      action: "Start Journey"
    },
    {
      icon: Sparkles,
      title: "Learn & Discover",
      description: "Dive deep into Earth's fascinating history and natural phenomena",
      action: "Begin Learning"
    },
    {
      icon: Zap,
      title: "Get Involved",
      description: "Join the movement to protect and preserve our beautiful planet",
      action: "Take Action"
    }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, index) => {
        if (!card) return;

        gsap.fromTo(card,
          { 
            opacity: 0, 
            y: 100,
            rotateX: -15,
            scale: 0.9
          },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            scale: 1,
            duration: 1.2,
            delay: index * 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
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
      className="relative min-h-screen py-20 bg-gradient-to-b from-black via-slate-800 to-black flex items-center"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1)_0%,transparent_50%)]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-300 via-white to-blue-100 bg-clip-text text-transparent">
            Ready to Begin?
          </h2>
          <p className="text-xl text-blue-100/70 max-w-2xl mx-auto">
            Choose your path to explore, learn, and connect with our amazing planet
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {ctaItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={index}
                ref={el => cardsRef.current[index] = el}
                className="group relative bg-gradient-to-b from-black/60 to-black/80 backdrop-blur-sm border border-blue-500/20 rounded-3xl p-8 hover:border-blue-400/40 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20 cursor-pointer"
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 5,
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Icon */}
                <div className="relative z-10 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-300 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-100 transition-colors duration-300">
                    {item.title}
                  </h3>
                  
                  <p className="text-blue-100/70 text-lg leading-relaxed mb-8">
                    {item.description}
                  </p>

                  {/* CTA Button */}
                  <motion.button 
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-400/40"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {item.action}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer */}
        <motion.div 
          className="text-center mt-20 pt-10 border-t border-blue-500/20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <p className="text-blue-100/50 text-lg">
            Built with ❤️ for our incredible planet Earth
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;