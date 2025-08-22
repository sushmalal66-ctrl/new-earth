import React, { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
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
  Shield,
  Rocket
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface TimelineEra {
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
  position: number; // Position along timeline (0-1)
}

interface HorizontalTimelineProps {
  earthProgress: any; // MotionValue from parent
}

const HorizontalTimeline: React.FC<HorizontalTimelineProps> = ({ 
  earthProgress, 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [activeEra, setActiveEra] = useState(0);
  const [showTyping, setShowTyping] = useState<{ [key: number]: boolean }>({});
  
  // Timeline eras data
  const timelineEras: TimelineEra[] = [
    {
      id: 'formation',
      era: 'Formation',
      timeAgo: '4.6 Billion Years Ago',
      title: 'Birth of Earth',
      subtitle: 'From Cosmic Dust to Planet',
      description: 'Gravitational forces pulled together cosmic debris, forming our molten planet. The Moon was born from a massive collision, and the first oceans began to form.',
      keyEvents: [
        'Solar nebula collapse',
        'Planetary accretion',
        'Moon-forming impact',
        'First oceans condense'
      ],
      icon: Mountain,
      color: '#dc2626',
      gradient: 'from-red-600 via-orange-500 to-yellow-400',
      image: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=600&fit=crop',
      position: 0
    },
    {
      id: 'life-begins',
      era: 'Life Begins',
      timeAgo: '3.8 Billion Years Ago',
      title: 'First Life Forms',
      subtitle: 'Microbes Rule the Seas',
      description: 'Simple single-celled organisms emerged in primordial oceans. Cyanobacteria began photosynthesis, slowly transforming the atmosphere with oxygen.',
      keyEvents: [
        'First prokaryotic cells',
        'RNA world evolution',
        'Photosynthesis develops',
        'Oxygen begins accumulating'
      ],
      icon: Waves,
      color: '#059669',
      gradient: 'from-emerald-600 via-teal-500 to-cyan-400',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop',
      position: 0.2
    },
    {
      id: 'complex-life',
      era: 'Complex Life',
      timeAgo: '540 Million Years Ago',
      title: 'Cambrian Explosion',
      subtitle: 'Animals Diversify Rapidly',
      description: 'Life exploded into incredible diversity. Eyes evolved, predators emerged, and the foundation for all modern animal body plans was established.',
      keyEvents: [
        'Cambrian explosion',
        'First eyes evolve',
        'Shells and skeletons',
        'Predator-prey arms race'
      ],
      icon: Shield,
      color: '#7c3aed',
      gradient: 'from-purple-600 via-violet-500 to-indigo-400',
      image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&h=600&fit=crop',
      position: 0.4
    },
    {
      id: 'dinosaurs',
      era: 'Age of Dinosaurs',
      timeAgo: '252-66 Million Years Ago',
      title: 'Mesozoic Era',
      subtitle: 'Reptiles Dominate Earth',
      description: 'Dinosaurs ruled land, sea, and sky for over 180 million years. Flowering plants evolved, and the first mammals appeared in their shadow.',
      keyEvents: [
        'Dinosaur diversification',
        'First flowering plants',
        'Pterosaurs take flight',
        'Early mammals evolve'
      ],
      icon: Zap,
      color: '#ea580c',
      gradient: 'from-orange-600 via-amber-500 to-yellow-400',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop',
      position: 0.6
    },
    {
      id: 'humans',
      era: 'Rise of Humans',
      timeAgo: '7 Million Years Ago - Present',
      title: 'Human Evolution',
      subtitle: 'Intelligence Emerges',
      description: 'After the dinosaurs\' extinction, mammals diversified. Primates evolved, leading to humans who developed tools, language, and civilization.',
      keyEvents: [
        'Mammalian radiation',
        'Primate evolution',
        'Bipedalism develops',
        'Agriculture & cities'
      ],
      icon: Users,
      color: '#2563eb',
      gradient: 'from-blue-600 via-indigo-500 to-purple-400',
      image: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=800&h=600&fit=crop',
      position: 0.8
    },
    {
      id: 'future',
      era: 'Future Earth',
      timeAgo: 'Present - Beyond',
      title: 'Space Age & Beyond',
      subtitle: 'Humanity Reaches for the Stars',
      description: 'Humans become a spacefaring species, developing sustainable technology and exploring the cosmos while protecting Earth\'s biosphere.',
      keyEvents: [
        'Space exploration',
        'Sustainable technology',
        'Climate restoration',
        'Interplanetary colonies'
      ],
      icon: Rocket,
      color: '#06b6d4',
      gradient: 'from-cyan-600 via-sky-500 to-blue-400',
      image: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=800&h=600&fit=crop',
      position: 1
    }
  ];

  useEffect(() => {
    if (!containerRef.current || !timelineRef.current) return;

    const container = containerRef.current;
    const timeline = timelineRef.current;
    
    // Calculate total scroll distance for horizontal movement
    const totalWidth = timeline.scrollWidth - window.innerWidth;
    
    // Kill existing ScrollTriggers for this container
    ScrollTrigger.getAll().forEach(trigger => {
      if (trigger.vars.trigger === container) {
        trigger.kill();
      }
    });
    
    // Create horizontal scroll animation
    const horizontalScroll = gsap.timeline();
    horizontalScroll.to(timeline, {
      x: -totalWidth,
      ease: "none",
      duration: 1
    });

    // Create ScrollTrigger separately for better control
    ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: () => `+=${totalWidth}`,
      scrub: 1,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      animation: horizontalScroll,
      onUpdate: (self) => {
        const progress = self.progress;
        
        // Update Earth rotation based on scroll progress
        earthProgress.set(progress);
        onProgressChange(progress);
        
        // Determine active era based on scroll progress
        const newActiveEra = Math.floor(progress * (timelineEras.length - 1));
        if (newActiveEra !== activeEra) {
          setActiveEra(newActiveEra);
          
          // Trigger typing animation for new era
          setShowTyping(prev => ({
            ...prev,
            [newActiveEra]: true
          }));
        }
        
        // Update CSS custom property for other animations
        document.documentElement.style.setProperty('--timeline-progress', progress.toString());
      }
    });

    // Individual card animations
    timelineEras.forEach((era, index) => {
      const card = container.querySelector(`[data-era="${era.id}"]`);
      if (!card) return;

      // Card entrance animation
      gsap.fromTo(card, 
        { 
          opacity: 0, 
          y: 100,
          scale: 0.8
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "left 80%",
            end: "left 20%",
            horizontal: true,
            toggleActions: "play none none reverse",
            containerAnimation: horizontalScroll,
            refreshPriority: -1
          }
        }
      );

      // Parallax effect for card images
      const image = card.querySelector('.era-image');
      if (image) {
        gsap.to(image, {
          x: -50,
          ease: "none",
          scrollTrigger: {
            trigger: card,
            start: "left right",
            end: "right left",
            scrub: 1,
            horizontal: true,
            containerAnimation: horizontalScroll,
            refreshPriority: -1
          }
        });
      }
    });

    // Refresh ScrollTrigger after setup
    ScrollTrigger.refresh();

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === container || trigger.vars.containerAnimation === horizontalScroll) {
          trigger.kill();
        }
      }, [activeEra, timelineEras.length]); // Removed earthProgress and onProgressChange from dependencies
    };
  }, [earthProgress, onProgressChange, activeEra, timelineEras.length]);

  // Initialize typing animations for first era
  useEffect(() => {
    setShowTyping({ 0: true });
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative h-screen overflow-hidden bg-gradient-to-r from-slate-900 via-gray-900 to-slate-900"
    >
      {/* Timeline Container */}
      <div 
        ref={timelineRef}
        className="flex h-full items-center"
        style={{ width: `${timelineEras.length * 100}vw` }}
      >
        {timelineEras.map((era, index) => {
          const IconComponent = era.icon;
          const isActive = index === activeEra;
          
          return (
            <div
              key={era.id}
              data-era={era.id}
              className="flex-shrink-0 w-screen h-full flex items-center justify-center px-8 lg:px-16"
            >
              <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center h-full py-20">
                {/* Content Side */}
                <div className={`space-y-8 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                  {/* Era Badge */}
                  <motion.div
                    className={`inline-flex items-center px-6 py-3 bg-gradient-to-r ${era.gradient} rounded-full shadow-lg`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <IconComponent className="w-5 h-5 text-white mr-3" />
                    <span className="text-white font-semibold">{era.era}</span>
                  </motion.div>

                  {/* Time Indicator */}
                  <motion.div 
                    className="text-gray-400 text-lg font-medium"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {era.timeAgo}
                  </motion.div>

                  {/* Animated Title */}
                  <div>
                    <h2 className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight min-h-[1.2em]">
                      {showTyping[index] ? (
                        <TypeAnimation
                          sequence={[
                            '', // Start with empty string
                            500, // Wait 500ms
                            era.title, // Type the title
                          ]}
                          wrapper="span"
                          speed={50}
                          style={{ 
                            display: 'inline-block',
                            background: `linear-gradient(45deg, ${era.color}, #ffffff)`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                          }}
                          repeat={0}
                        />
                      ) : (
                        <span 
                          style={{ 
                            background: `linear-gradient(45deg, ${era.color}, #ffffff)`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                          }}
                        >
                          {era.title}
                        </span>
                      )}
                    </h2>
                    
                    <h3 className="text-2xl md:text-3xl text-gray-300 font-light min-h-[1.2em]">
                      {showTyping[index] ? (
                        <TypeAnimation
                          sequence={[
                            '', // Start with empty string
                            1000, // Wait for title to finish + 500ms
                            era.subtitle, // Type the subtitle
                          ]}
                          wrapper="span"
                          speed={60}
                          style={{ display: 'inline-block' }}
                          repeat={0}
                        />
                      ) : (
                        era.subtitle
                      )}
                    </h3>
                  </div>

                  {/* Description */}
                  <motion.p 
                    className="text-lg text-gray-300 leading-relaxed max-w-2xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    {era.description}
                  </motion.p>

                  {/* Key Events */}
                  <motion.div 
                    className="space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                  >
                    <h5 className="text-lg font-semibold text-white flex items-center">
                      <Sparkles className="w-5 h-5 mr-2 text-gray-400" />
                      Key Developments
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {era.keyEvents.map((event, eventIndex) => (
                        <motion.div
                          key={eventIndex}
                          className={`flex items-start space-x-3 p-4 bg-black/40 backdrop-blur-sm border border-gray-700/30 rounded-xl hover:border-gray-500/50 transition-all duration-300`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.2 + eventIndex * 0.1 }}
                          whileHover={{ scale: 1.02, x: 5 }}
                        >
                          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${era.gradient} mt-2 flex-shrink-0`} />
                          <span className="text-gray-300 text-sm leading-relaxed">{event}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Progress Indicator */}
                  <motion.div 
                    className="flex items-center space-x-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                  >
                    <div className="flex space-x-2">
                      {timelineEras.map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            i === index 
                              ? `bg-gradient-to-r ${era.gradient}` 
                              : 'bg-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-gray-400 text-sm">
                      {index + 1} of {timelineEras.length}
                    </span>
                  </motion.div>
                </div>

                {/* Visual Side */}
                <div className={`relative ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <motion.div
                    className="relative group"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    {/* Main Image */}
                    <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                      <img 
                        src={era.image}
                        alt={era.title}
                        loading="lazy"
                        className="era-image w-full h-80 md:h-96 object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=600&fit=crop';
                        }}
                      />
                      
                      {/* Image Overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-t ${era.gradient} opacity-20 group-hover:opacity-30 transition-opacity duration-500`} />
                      
                      {/* Floating Icon */}
                      <div className="absolute top-6 right-6">
                        <div className={`w-16 h-16 bg-gradient-to-r ${era.gradient} rounded-2xl flex items-center justify-center shadow-lg backdrop-blur-sm animate-float`}>
                          <IconComponent className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute -top-4 -left-4 w-24 h-24 bg-gray-500/10 rounded-full blur-xl animate-pulse" />
                    <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gray-600/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />
                    
                    {/* Stats Overlay */}
                    <motion.div 
                      className="absolute bottom-6 left-6 right-6 bg-black/70 backdrop-blur-md border border-gray-700/20 rounded-2xl p-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white font-semibold text-lg">{era.era}</div>
                          <div className="text-gray-400 text-sm">{era.timeAgo}</div>
                        </div>
                        <div className={`w-12 h-12 bg-gradient-to-r ${era.gradient} rounded-xl flex items-center justify-center`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
      >
        <div className="text-gray-400 text-sm mb-2">Scroll to explore timeline</div>
        <div className="flex items-center space-x-2">
          <ArrowRight className="w-4 h-4 text-gray-400 animate-pulse" />
          <div className="w-16 h-1 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full"
              style={{ 
                scaleX: earthProgress,
                transformOrigin: 'left'
              }}
            />
          </div>
        </div>
      </motion.div>

      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Animated background particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gray-500/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              opacity: [0.3, 1, 0.3],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 4,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default HorizontalTimeline;