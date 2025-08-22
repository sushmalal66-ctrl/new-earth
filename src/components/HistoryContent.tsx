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
  Sparkles,
  Shield
} from 'lucide-react';
gsap.registerPlugin(ScrollTrigger);

interface HistoryContentProps {
  scrollProgress: number;
}

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

const HistoryContent: React.FC<HistoryContentProps> = ({ scrollProgress }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const periodsRef = useRef<(HTMLDivElement | null)[]>([]);
const historyPeriods: HistoryPeriod[] = [
  {
    id: 'big-bang',
    era: 'Cosmic Genesis',
    timeAgo: '13.8 Billion Years Ago',
    title: 'The Beginning',
    subtitle: 'Universe Emerges',
    description: 'Space and time burst into existence. Matter, energy, and the fundamental forces were born, setting the stage for galaxies, stars, and eventually Earth.',
    keyEvents: [
      'Big Bang & cosmic inflation',
      'First particles and light elements',
      'Formation of galaxies begins'
    ],
    icon: Star,
    color: '#1e293b',
    gradient: 'from-slate-800 via-slate-700 to-slate-900',
    image: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=600&fit=crop'
  },
  {
    id: 'stellar-formation',
    era: 'First Stars',
    timeAgo: '13.6 Billion Years Ago',
    title: 'First Light',
    subtitle: 'Stars Ignite',
    description: 'Gravity forged the first stars from hydrogen and helium. These giants lived fast, died young, and seeded the cosmos with heavy elements.',
    keyEvents: [
      'First stars (Pop III) ignite',
      'Supernovae enrich the cosmos',
      'Galaxies assemble'
    ],
    icon: Sparkles,
    color: '#0f172a',
    gradient: 'from-slate-900 via-slate-800 to-gray-900',
    image: 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=800&h=600&fit=crop'
  },
  {
    id: 'solar-formation',
    era: 'Solar Birth',
    timeAgo: '4.6 Billion Years Ago',
    title: 'Our Solar System',
    subtitle: 'From Dust to Planets',
    description: 'A collapsing nebula formed the Sun, with planets, moons, and asteroids emerging from the leftover disk of dust and gas.',
    keyEvents: [
      'Sun ignites',
      'Planets accrete from disk',
      'Late Heavy Bombardment reshapes worlds'
    ],
    icon: Globe,
    color: '#020617',
    gradient: 'from-slate-950 via-gray-900 to-slate-900',
    image: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=800&h=600&fit=crop'
  },
  {
    id: 'hadean',
    era: 'Hadean Eon',
    timeAgo: '4.6 - 4.0 Billion Years Ago',
    title: 'Earth Forms',
    subtitle: 'A Fiery Birth',
    description: 'Colliding planetesimals created Earth. A Mars-sized impact birthed the Moon, while early oceans condensed from volcanic steam.',
    keyEvents: [
      'Moon-forming impact',
      'Magma oceans cool',
      'First oceans appear'
    ],
    icon: Mountain,
    color: '#0c0a09',
    gradient: 'from-stone-950 via-slate-950 to-gray-950',
    image: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=600&fit=crop'
  },
  {
    id: 'archean',
    era: 'Archean Eon',
    timeAgo: '4.0 - 2.5 Billion Years Ago',
    title: 'Life Begins',
    subtitle: 'Cells Emerge',
    description: 'In Earth’s early oceans, simple microbes evolved. Cyanobacteria learned photosynthesis, slowly oxygenating the atmosphere.',
    keyEvents: [
      'First cells evolve',
      'Stromatolites form',
      'Oxygenation begins'
    ],
    icon: Waves,
    color: '#030712',
    gradient: 'from-gray-950 via-slate-950 to-stone-950',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop'
  },
  {
    id: 'proterozoic',
    era: 'Proterozoic Eon',
    timeAgo: '2.5 - 0.54 Billion Years Ago',
    title: 'Oxygen Revolution',
    subtitle: 'Atmosphere Transforms',
    description: 'Oxygen flooded the air, triggering extinctions but enabling complex life. Eukaryotes and sexual reproduction evolved, paving the way for animals.',
    keyEvents: [
      'Great Oxidation Event',
      'Eukaryotic cells evolve',
      'Snowball Earth glaciations'
    ],
    icon: Leaf,
    color: '#020617',
    gradient: 'from-slate-950 via-gray-950 to-stone-950',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop'
  },
  {
    id: 'cambrian',
    era: 'Cambrian Explosion',
    timeAgo: '541 - 485 Million Years Ago',
    title: 'Animal Explosion',
    subtitle: 'Complex Life Emerges',
    description: 'Animal diversity exploded. Eyes evolved, predators appeared, and most modern body plans were established.',
    keyEvents: [
      'Cambrian Explosion',
      'Predators evolve',
      'Shells & skeletons appear'
    ],
    icon: Shield,
    color: '#0c0a09',
    gradient: 'from-stone-950 via-slate-950 to-gray-950',
    image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&h=600&fit=crop'
  },
  {
    id: 'devonian',
    era: 'Devonian Period',
    timeAgo: '419 - 359 Million Years Ago',
    title: 'Life Conquers Land',
    subtitle: 'Forests & Tetrapods',
    description: 'Fish dominated oceans, while the first forests appeared. Vertebrates took their first steps onto land.',
    keyEvents: [
      'First forests grow',
      'Tetrapods evolve',
      'Late Devonian extinction'
    ],
    icon: Leaf,
    color: '#020617',
    gradient: 'from-slate-950 via-gray-950 to-stone-950',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop'
  },
  {
    id: 'permian',
    era: 'Permian',
    timeAgo: '299 - 252 Million Years Ago',
    title: 'The Great Dying',
    subtitle: 'Mass Extinction',
    description: 'Massive volcanic eruptions caused Earth’s worst extinction event, wiping out 90% of species.',
    keyEvents: [
      'Siberian Traps eruptions',
      'Permian-Triassic extinction',
      'Archosaurs diversify'
    ],
    icon: Zap,
    color: '#030712',
    gradient: 'from-gray-950 via-slate-950 to-stone-950',
    image: 'https://images.unsplash.com/photo-1541872703-74c5e44368e6?w=800&h=600&fit=crop'
  },
  {
    id: 'mesozoic',
    era: 'Mesozoic Era',
    timeAgo: '252 - 66 Million Years Ago',
    title: 'Age of Dinosaurs',
    subtitle: 'Reptiles Rule',
    description: 'Dinosaurs, pterosaurs, and giant reptiles ruled land, sea, and sky. Flowering plants and mammals first appeared.',
    keyEvents: [
      'Dinosaurs dominate',
      'First mammals evolve',
      'Flowering plants emerge'
    ],
    icon: Shield,
    color: '#020617',
    gradient: 'from-slate-950 via-gray-950 to-stone-950',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop'
  },
  {
    id: 'cretaceous-extinction',
    era: 'K-Pg Extinction',
    timeAgo: '66 Million Years Ago',
    title: 'Dinosaur Doom',
    subtitle: 'Asteroid Impact',
    description: 'A massive asteroid struck Earth, ending the dinosaur age and clearing the stage for mammals.',
    keyEvents: [
      'Chicxulub impact',
      'Dinosaurs wiped out',
      'Mammals rise'
    ],
    icon: Zap,
    color: '#0c0a09',
    gradient: 'from-stone-950 via-slate-950 to-gray-950',
    image: 'https://images.unsplash.com/photo-1541872703-74c5e44368e6?w=800&h=600&fit=crop'
  },
  {
    id: 'cenozoic',
    era: 'Cenozoic',
    timeAgo: '66 Million Years Ago - Present',
    title: 'Age of Mammals',
    subtitle: 'Modern Ecosystems',
    description: 'Mammals, birds, and flowering plants flourished. Ice ages shaped the land, while primates evolved into humans.',
    keyEvents: [
      'Mammalian radiation',
      'Ice ages shape climate',
      'Primates evolve'
    ],
    icon: Users,
    color: '#030712',
    gradient: 'from-gray-950 via-slate-950 to-stone-950',
    image: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=800&h=600&fit=crop'
  },
  {
    id: 'human-evolution',
    era: 'Human Evolution',
    timeAgo: '7 Million Years Ago - Present',
    title: 'Rise of Humans',
    subtitle: 'Intelligence Emerges',
    description: 'Bipedal apes evolved into toolmakers with large brains. Homo sapiens emerged in Africa, eventually building civilizations.',
    keyEvents: [
      'Bipedalism',
      'Stone tools',
      'Homo sapiens evolve'
    ],
    icon: Users,
    color: '#020617',
    gradient: 'from-slate-950 via-gray-950 to-stone-950',
    image: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=800&h=600&fit=crop'
  },
  {
    id: 'anthropocene',
    era: 'Anthropocene',
    timeAgo: '12,000 Years Ago - Present',
    title: 'Human Dominance',
    subtitle: 'Planet Shapers',
    description: 'Agriculture, cities, and industry transformed Earth. Humanity became a geological force, reshaping the biosphere and climate.',
    keyEvents: [
      'Agriculture & cities',
      'Industrial Revolution',
      'Climate change impact'
    ],
    icon: Globe,
    color: '#0c0a09',
    gradient: 'from-stone-950 via-slate-950 to-gray-950',
    image: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=800&h=600&fit=crop'
  }
];
  useEffect(() => {
    if (!contentRef.current) return;

    // Debounce ScrollTrigger setup
    const setupScrollTrigger = () => {
      // Optimize ScrollTrigger performance
      ScrollTrigger.config({
        autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
        limitCallbacks: true
      });

      const ctx = gsap.context(() => {
        // Use ScrollTrigger.batch for better performance
        const validPeriods = periodsRef.current.filter(Boolean);
        
        if (validPeriods.length === 0) return;
        
        ScrollTrigger.batch(validPeriods, {
          onEnter: (elements) => {
            gsap.fromTo(elements,
              { 
                opacity: 0, 
                y: 100,
                scale: 0.9
              },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 1,
                ease: "power2.out",
                stagger: 0.1,
                overwrite: "auto",
                force3D: true
              }
            );
          },
          onLeave: (elements) => {
            gsap.to(elements, {
              opacity: 0.5,
              scale: 0.98,
              duration: 0.3,
              overwrite: "auto",
              force3D: true
            });
          },
          onEnterBack: (elements) => {
            gsap.to(elements, {
              opacity: 1,
              scale: 1,
              duration: 0.3,
              overwrite: "auto",
              force3D: true
            });
          },
          start: "top 80%",
          end: "top 20%",
          refreshPriority: -1
        });

        // Simplified parallax for images (only on high performance)
        if (window.innerWidth > 768) {
          validPeriods.forEach((period, index) => {
            const image = period?.querySelector('.period-image');
            if (image) {
              gsap.set(image, { willChange: "transform" });
              gsap.to(image, {
                y: -30,
                ease: "none",
                scrollTrigger: {
                  trigger: period,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 1,
                  refreshPriority: -2,
                  invalidateOnRefresh: true
                }
              });
            }
          });
        }

        // Simplified floating animation
        gsap.to('.floating-element', {
          y: -15,
          rotation: 3,
          duration: 4,
          ease: "power2.inOut",
          repeat: -1,
          yoyo: true,
          stagger: 0.3,
          force3D: true
        });

      }, contentRef);

      return () => ctx.revert();
    };
    
    // Delay setup to avoid blocking scroll
    const timeoutId = setTimeout(setupScrollTrigger, 100);
    
    return () => {
      clearTimeout(timeoutId);
    };
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
            <span className="bg-gradient-to-r from-slate-100 via-gray-200 to-slate-300 bg-clip-text text-transparent">
              Earth's Epic Story
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-400 max-w-4xl mx-auto leading-relaxed">
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
                    className={`inline-flex items-center px-6 py-3 bg-gradient-to-r ${period.gradient} rounded-full shadow-lg border border-gray-700/30`}
                    whileHover={{ scale: 1.05 }}
                  >
                    <IconComponent className="w-5 h-5 text-gray-100 mr-3" />
                    <span className="text-gray-100 font-semibold">{period.era}</span>
                  </motion.div>

                  {/* Time Indicator */}
                  <div className="text-gray-500 text-lg font-medium">
                    {period.timeAgo}
                  </div>

                  {/* Title */}
                  <div>
                    <h3 className="text-4xl md:text-5xl font-bold text-gray-100 mb-4 leading-tight">
                      {period.title}
                    </h3>
                    <h4 className="text-xl md:text-2xl text-gray-300 font-medium mb-6">
                      {period.subtitle}
                    </h4>
                  </div>

                  {/* Description */}
                  <p className="text-lg text-gray-300 leading-relaxed max-w-2xl">
                    {period.description}
                  </p>

                  {/* Key Events */}
                  <div className="space-y-4">
                    <h5 className="text-lg font-semibold text-gray-100 flex items-center">
                      <Sparkles className="w-5 h-5 mr-2 text-gray-400" />
                      Key Developments
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {period.keyEvents.map((event, eventIndex) => (
                        <motion.div
                          key={eventIndex}
                          className="flex items-start space-x-3 p-4 bg-gray-900/40 backdrop-blur-sm border border-gray-800/30 rounded-xl hover:border-gray-600/50 transition-all duration-300"
                          whileHover={{ scale: 1.02, x: 5 }}
                        >
                          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${period.gradient} mt-2 flex-shrink-0`} />
                          <span className="text-gray-400 text-sm leading-relaxed">{event}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Learn More Button */}
                  <motion.button
                    className={`inline-flex items-center px-8 py-4 bg-gradient-to-r ${period.gradient} hover:shadow-lg text-gray-100 font-semibold rounded-xl transition-all duration-300 border border-gray-700/20`}
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
                         loading="lazy" 
                        className="period-image w-full h-80 md:h-96 object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                          // Fallback if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.src = `https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=600&fit=crop&auto=format`;
                          target.onerror = null; // Prevent infinite loop
                        }}
                      />
                      
                      {/* Image Overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-t ${period.gradient} opacity-100 group-hover:opacity-90 transition-opacity duration-500`} />
                      
                      {/* Floating Icon */}
                      <div className="absolute top-6 right-6">
                        <div className={`floating-element w-16 h-16 bg-gradient-to-r ${period.gradient} rounded-2xl flex items-center justify-center shadow-lg backdrop-blur-sm`}>
                          <IconComponent className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute -top-4 -left-4 w-24 h-24 bg-gray-500/10 rounded-full blur-xl" />
                    <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gray-600/10 rounded-full blur-xl" />
                    
                    {/* Stats Overlay */}
                    <motion.div 
                      className="absolute bottom-6 left-6 right-6 bg-black/70 backdrop-blur-md border border-gray-700/20 rounded-2xl p-6"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-gray-100 font-semibold text-lg">{period.era}</div>
                          <div className="text-gray-400 text-sm">{period.timeAgo}</div>
                        </div>
                        <div className={`w-12 h-12 bg-gradient-to-r ${period.gradient} rounded-xl flex items-center justify-center`}>
                          <IconComponent className="w-6 h-6 text-gray-100" />
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
          className="text-center mt-32 pt-16 border-t border-gray-800/30"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl md:text-4xl font-bold text-gray-100 mb-6">
            The Story Continues
          </h3>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
            Earth's journey is far from over. Every day brings new discoveries, 
            challenges, and opportunities to shape our planet's future.
          </p>
          
          <motion.button
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-gray-100 font-semibold rounded-xl shadow-lg transition-all duration-300 border border-gray-700/30"
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
            className="absolute w-2 h-2 bg-gray-500/20 rounded-full"
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