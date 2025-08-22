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
      era: 'Big Bang Era',
      timeAgo: '13.8 Billion Years Ago',
      title: 'Genesis of Everything',
      subtitle: 'The Universe Ignites',
      description: 'In a singular moment of infinite density and temperature, space and time itself began. The fundamental forces of nature separated, and the first particles formed in the cosmic soup of pure energy.',
      keyEvents: [
        'Planck epoch - quantum gravity dominates',
        'Inflation - exponential expansion',
        'Nucleosynthesis - first atoms form',
        'Cosmic microwave background emerges'
      ],
      icon: Star,
      color: '#64748b',
      gradient: 'from-slate-600 via-slate-500 to-gray-600',
      image: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=600&fit=crop'
    },
    {
      id: 'stellar-formation',
      era: 'Stellar Formation',
      timeAgo: '13.6 Billion Years Ago',
      title: 'Birth of the First Stars',
      subtitle: 'Lighting the Dark Universe',
      description: 'Gravity pulled together the first hydrogen and helium, forming massive stars that burned bright and fast. Their deaths in spectacular supernovae forged the heavier elements essential for planets and life.',
      keyEvents: [
        'First generation stars ignite',
        'Nuclear fusion begins element creation',
        'Supernova explosions scatter heavy elements',
        'Galactic structures start forming'
      ],
      icon: Sparkles,
      color: '#475569',
      gradient: 'from-slate-700 via-blue-600 to-slate-600',
      image: 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=800&h=600&fit=crop'
    },
    {
      id: 'solar-formation',
      era: 'Solar System Formation',
      timeAgo: '4.6 Billion Years Ago',
      title: 'Our Cosmic Neighborhood',
      subtitle: 'From Dust to Planets',
      description: 'Within a collapsing cloud of gas and dust, our Sun ignited. The remaining material swirled into a disk, gradually coalescing into the planets, moons, and asteroids that make up our solar system.',
      keyEvents: [
        'Solar nebula collapse begins',
        'Protoplanetary disk formation',
        'Planetary accretion process',
        'Late Heavy Bombardment period'
      ],
      icon: Globe,
      color: '#334155',
      gradient: 'from-slate-800 via-blue-700 to-slate-700',
      image: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=800&h=600&fit=crop'
    },
    {
      id: 'formation',
      era: 'Hadean Eon',
      timeAgo: '4.6 - 4.0 Billion Years Ago',
      title: 'Earth\'s Violent Birth',
      subtitle: 'From Molten Hell to Cooling World',
      description: 'Earth formed from cosmic collisions, creating a molten hellscape. The Moon was born from a Mars-sized impact, and slowly our planet began to cool as water vapor condensed into the first oceans.',
      keyEvents: [
        'Earth forms from planetesimal collisions',
        'Moon-forming impact event',
        'Atmospheric evolution begins',
        'First oceans condense from vapor'
      ],
      icon: Mountain,
      color: '#1e293b',
      gradient: 'from-slate-900 via-gray-800 to-slate-800',
      image: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=600&fit=crop'
    },
    {
      id: 'archean',
      era: 'Archean Eon',
      timeAgo: '4.0 - 2.5 Billion Years Ago',
      title: 'Dawn of Life',
      subtitle: 'First Living Cells Emerge',
      description: 'In primordial oceans, the first life forms appeared. Simple bacteria and archaea began the long journey of evolution, setting the stage for all future biological complexity.',
      keyEvents: [
        'First prokaryotic cells emerge',
        'Stromatolites form in shallow seas',
        'Photosynthesis begins to evolve',
        'Continental crust stabilizes'
      ],
      icon: Waves,
      color: '#0f172a',
      gradient: 'from-slate-950 via-blue-900 to-slate-900',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop'
    },
    {
      id: 'proterozoic',
      era: 'Proterozoic Eon',
      timeAgo: '2.5 - 0.54 Billion Years Ago',
      title: 'The Great Oxidation',
      subtitle: 'Oxygen Transforms Everything',
      description: 'Cyanobacteria revolutionized Earth by producing oxygen, causing a mass extinction but enabling complex life. The first eukaryotic cells evolved, leading to multicellular organisms.',
      keyEvents: [
        'Great Oxidation Event occurs',
        'First eukaryotic cells evolve',
        'Snowball Earth glaciation periods',
        'First multicellular life appears'
      ],
      icon: Leaf,
      color: '#0c0c0f',
      gradient: 'from-slate-950 via-blue-950 to-gray-950',
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop'
    },
    {
      id: 'cambrian',
      era: 'Cambrian Explosion',
      timeAgo: '541 - 485 Million Years Ago',
      title: 'Life\'s Great Experiment',
      subtitle: 'Biodiversity Explodes',
      description: 'In a geological instant, life exploded into countless forms. Eyes, shells, and complex body plans appeared for the first time, creating the foundation for all modern animal life.',
      keyEvents: [
        'Complex eyes and vision evolve',
        'Hard shells and exoskeletons develop',
        'Predator-prey relationships emerge',
        'Most modern animal phyla appear'
      ],
      icon: Shield,
      color: '#080808',
      gradient: 'from-black via-slate-900 to-gray-900',
      image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&h=600&fit=crop'
    },
    {
      id: 'devonian',
      era: 'Devonian Period',
      timeAgo: '419 - 359 Million Years Ago',
      title: 'Conquest of Land',
      subtitle: 'From Sea to Shore',
      description: 'Life made its first tentative steps onto land. Plants developed root systems and woody tissue, while the first amphibians evolved from fish, beginning the colonization of terrestrial environments.',
      keyEvents: [
        'First forests appear on land',
        'Fish develop primitive lungs',
        'Amphibians evolve from fish',
        'Soil ecosystems develop'
      ],
      icon: Mountain,
      color: '#050507',
      gradient: 'from-black via-slate-950 to-blue-950',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop'
    },
  {
  id: 'permian',
  era: 'Permian-Triassic',
  timeAgo: '299 - 201 Million Years Ago',
  title: 'The Great Dying',
  subtitle: 'Earth’s Most Severe Extinction',
  description: 'Massive volcanic eruptions and climate shifts led to the largest extinction event in history, wiping out 90% of species. This reset life on Earth and paved the way for dinosaurs.',
  keyEvents: [
    'Siberian Traps volcanic eruptions',
    '90% of species extinct',
    'Collapse of marine ecosystems',
    'Rise of archosaurs'
  ],
  icon: Zap,
  color: '#020617',
  gradient: 'from-slate-950 via-red-900 to-black',
  image: 'https://images.unsplash.com/photo-1541872703-74c5e44368e6?w=800&h=600&fit=crop'
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
                         loading="lazy" 
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