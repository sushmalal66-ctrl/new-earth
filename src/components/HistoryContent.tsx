import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Clock, 
  Zap, 
  Leaf, 
  Users, 
  Globe, 
  Star, 
  Mountain, 
  Waves,
  ArrowRight,
  Sparkles
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface HistoryContentProps {}

interface HistoryPeriod {
  id: string;
  era: string;
  timeAgo: string;
  title: string;
  subtitle: string;
  description: string;
  keyEvents: string[];
  icon: React.ComponentType<any>;
  color: string;
  gradient: string;
  image: string;
}

const HistoryContent: React.FC<HistoryContentProps> = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const periodsRef = useRef<(HTMLDivElement | null)[]>([]);

  const historyPeriods: HistoryPeriod[] = [
    {
      id: 'formation',
      era: 'Hadean Eon',
      timeAgo: '4.6 Billion Years Ago',
      title: 'Birth of Our World',
      subtitle: 'From Cosmic Dust to Molten Planet',
      description: 'Earth formed from the gravitational collapse of dust and gas within the solar nebula. This was a time of incredible heat, constant bombardment, and the formation of our planet\'s basic structure.',
      keyEvents: [
        'Formation from solar nebula',
        'Differentiation into core and mantle',
        'Formation of the Moon',
        'Development of early atmosphere'
      ],
      icon: Star,
      color: '#64748b',
      gradient: 'from-slate-600 to-slate-500',
      image: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=600&fit=crop'
    },
    {
      id: 'oceans',
      era: 'Archean Eon',
      timeAgo: '4.0 Billion Years Ago',
      title: 'The Great Waters',
      subtitle: 'Birth of Earth\'s Oceans',
      description: 'As Earth cooled, water vapor condensed to form vast oceans. This marked the beginning of the water cycle and created the conditions necessary for life to emerge.',
      keyEvents: [
        'Formation of stable oceans',
        'Development of water cycle',
        'First continental crust',
        'Emergence of hydrothermal vents'
      ],
      icon: Waves,
      color: '#475569',
      gradient: 'from-slate-700 to-blue-600',
      image: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&h=600&fit=crop'
    },
    {
      id: 'life',
      era: 'Proterozoic Eon',
      timeAgo: '2.5 Billion Years Ago',
      title: 'The Oxygen Revolution',
      subtitle: 'Life Transforms the Planet',
      description: 'Cyanobacteria began producing oxygen through photosynthesis, fundamentally changing Earth\'s atmosphere and paving the way for complex life forms.',
      keyEvents: [
        'Great Oxidation Event',
        'Formation of ozone layer',
        'First eukaryotic cells',
        'Snowball Earth periods'
      ],
      icon: Leaf,
      color: '#334155',
      gradient: 'from-slate-800 to-blue-700',
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop'
    },
    {
      id: 'complex',
      era: 'Phanerozoic Eon',
      timeAgo: '541 Million Years Ago',
      title: 'Explosion of Life',
      subtitle: 'The Cambrian Revolution',
      description: 'The Cambrian explosion saw the rapid diversification of life forms, with most major animal phyla appearing in the fossil record within a relatively short time.',
      keyEvents: [
        'Cambrian explosion of species',
        'Evolution of complex organisms',
        'Development of ecosystems',
        'First vertebrates appear'
      ],
      icon: Mountain,
      color: '#1e293b',
      gradient: 'from-slate-900 to-blue-800',
      image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&h=600&fit=crop'
    },
    {
      id: 'modern',
      era: 'Anthropocene',
      timeAgo: 'Present Day',
      title: 'Age of Humanity',
      subtitle: 'Shaping Our Planet\'s Future',
      description: 'Humans have become a geological force, influencing climate, ecosystems, and the planet\'s future evolution. We now hold the responsibility for Earth\'s stewardship.',
      keyEvents: [
        'Global civilization emerges',
        'Technological revolution',
        'Climate change awareness',
        'Space exploration begins'
      ],
      icon: Users,
      color: '#0f172a',
      gradient: 'from-slate-950 to-blue-900',
      image: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=800&h=600&fit=crop'
    }
  ];

  useEffect(() => {
    if (!contentRef.current) return;

    // Optimize ScrollTrigger performance
    ScrollTrigger.config({
      autoRefreshEvents: "visibilitychange,DOMContentLoaded,load"
    });
    
    // Use RAF for better performance
    ScrollTrigger.config({ autoRefreshEvents: "visibilitychange,DOMContentLoaded,load,resize" });
    ScrollTrigger.refresh();

    const ctx = gsap.context(() => {
      // Use ScrollTrigger.batch for better performance
      const validPeriods = periodsRef.current.filter(Boolean);
      
      ScrollTrigger.batch(validPeriods, {
        onEnter: (elements) => {
          gsap.fromTo(elements,
            { 
              opacity: 0, 
              y: 150,
              scale: 0.8,
              rotateX: -20
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              rotateX: 0,
              duration: 1.5,
              ease: "power3.out",
              stagger: 0.2,
              overwrite: "auto", // Prevent animation conflicts
              force3D: true
            }
          );
        },
        onLeave: (elements) => {
          gsap.to(elements, {
            opacity: 0.3,
            scale: 0.95,
            duration: 0.5,
            overwrite: "auto",
            force3D: true
          });
        },
        onEnterBack: (elements) => {
          gsap.to(elements, {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            overwrite: "auto",
            force3D: true
          });
        },
        start: "top 85%",
        end: "top 15%"
      });

      // Separate parallax animations for images
      validPeriods.forEach((period) => {
        const image = period.querySelector('.period-image');
        if (image) {
          // Use will-change for better performance
          gsap.set(image, { willChange: "transform" });
          gsap.to(image, {
            y: -50,
            scale: 1.1,
            ease: "none",
            scrollTrigger: {
              trigger: period,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.5,
              refreshPriority: -1, // Lower priority for parallax
              invalidateOnRefresh: true
            }
          });
        }
      });

      // Floating animation for decorative elements
      gsap.to('.floating-element', {
        y: -20,
        rotation: 5,
        duration: 3,
        ease: "power2.inOut",
        repeat: -1,
        yoyo: true,
        stagger: 0.5,
        paused: false,
        force3D: true
      });

    }, contentRef);

    return () => ctx.revert();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div ref={contentRef} className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-24"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center px-6 py-3 bg-blue-500/10 border border-blue-500/20 rounded-full mb-8"
            whileHover={{ scale: 1.05 }}
          >
            <Clock className="w-5 h-5 text-blue-400 mr-2" />
            <span className="text-blue-300 font-medium">Journey Through Time</span>
          </motion.div>
          
          <h2 className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-blue-300 via-white to-blue-100 bg-clip-text text-transparent">
            <span className="bg-gradient-to-r from-slate-200 via-blue-200 to-slate-300 bg-clip-text text-transparent">
              Earth's Epic Story
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
            Witness the incredible transformation of our planet through 4.6 billion years 
            of evolution, from a molten ball of rock to the vibrant world we call home
          </p>
        </motion.div>

        {/* History Periods */}
        <div className="space-y-32">
          {historyPeriods.map((period, index) => {
            const IconComponent = period.icon;
            const isEven = index % 2 === 0;
            
            return (
              <motion.div
                key={period.id}
                ref={el => periodsRef.current[index] = el}
                className={`history-item flex flex-col ${
                  isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
                } items-center gap-16 lg:gap-24`}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                {/* Content Side */}
                <div className="flex-1 space-y-8">
                  {/* Era Badge */}
                  <motion.div
                    className={`inline-flex items-center px-6 py-3 bg-gradient-to-r ${period.gradient} rounded-full shadow-lg`}
                    whileHover={{ scale: 1.05 }}
                  >
                    <IconComponent className="w-5 h-5 text-white mr-3" />
                    <span className="text-slate-100 font-semibold">{period.era}</span>
                  </motion.div>

                  {/* Time Indicator */}
                  <div className="text-slate-400 text-lg font-medium">
                    {period.timeAgo}
                  </div>

                  {/* Title */}
                  <div>
                    <h3 className="text-4xl md:text-5xl font-bold text-slate-100 mb-4 leading-tight">
                      {period.title}
                    </h3>
                    <h4 className="text-xl md:text-2xl text-slate-300 font-medium mb-6">
                      {period.subtitle}
                    </h4>
                  </div>

                  {/* Description */}
                  <p className="text-lg text-slate-300 leading-relaxed max-w-2xl">
                    {period.description}
                  </p>

                  {/* Key Events */}
                  <div className="space-y-4">
                    <h5 className="text-lg font-semibold text-slate-100 flex items-center">
                      <Sparkles className="w-5 h-5 mr-2 text-slate-400" />
                      Key Developments
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {period.keyEvents.map((event, eventIndex) => (
                        <motion.div
                          key={eventIndex}
                          className="flex items-start space-x-3 p-4 bg-slate-900/30 backdrop-blur-sm border border-slate-700/20 rounded-xl hover:border-slate-500/40 transition-all duration-300"
                          whileHover={{ scale: 1.02, x: 5 }}
                        >
                          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${period.gradient} mt-2 flex-shrink-0`} />
                          <span className="text-slate-400 text-sm leading-relaxed">{event}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Learn More Button */}
                  <motion.button
                    className={`inline-flex items-center px-8 py-4 bg-gradient-to-r ${period.gradient} hover:shadow-lg text-slate-100 font-semibold rounded-xl transition-all duration-300`}
                    whileHover={{ scale: 1.05, x: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Explore This Era
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </motion.button>
                </div>

                {/* Visual Side */}
                <div className="flex-1 relative">
                  <motion.div
                    className="relative group"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {/* Main Image */}
                    <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                      <img 
                        src={period.image}
                        alt={period.title}
                        className="period-image w-full h-80 md:h-96 object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      
                      {/* Image Overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-t ${period.gradient} opacity-20 group-hover:opacity-30 transition-opacity duration-500`} />
                      
                      {/* Floating Icon */}
                      <div className="absolute top-6 right-6">
                        <div className={`floating-element w-16 h-16 bg-gradient-to-r ${period.gradient} rounded-2xl flex items-center justify-center shadow-lg backdrop-blur-sm`}>
                          <IconComponent className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-500/10 rounded-full blur-xl" />
                    <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-purple-500/10 rounded-full blur-xl" />
                    
                    {/* Stats Overlay */}
                    <motion.div 
                      className="absolute bottom-6 left-6 right-6 bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl p-6"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white font-semibold text-lg">{period.era}</div>
                          <div className="text-blue-200/70 text-sm">{period.timeAgo}</div>
                        </div>
                        <div className={`w-12 h-12 bg-gradient-to-r ${period.gradient} rounded-xl flex items-center justify-center`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Section Footer */}
        <motion.div 
          className="text-center mt-32 pt-16 border-t border-slate-700/30"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl md:text-4xl font-bold text-slate-100 mb-6">
            The Story Continues
          </h3>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-8">
            Earth's journey is far from over. Every day brings new discoveries, 
            challenges, and opportunities to shape our planet's future.
          </p>
          
          <motion.button
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-slate-600 to-blue-600 hover:from-slate-500 hover:to-blue-500 text-slate-100 font-semibold rounded-xl shadow-lg transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Globe className="w-5 h-5 mr-2" />
            Explore Earth Today
            <ArrowRight className="w-5 h-5 ml-2" />
          </motion.button>
        </motion.div>
      </div>

      {/* Floating Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-slate-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default HistoryContent;