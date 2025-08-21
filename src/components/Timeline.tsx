import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Clock, Zap, Leaf, Users, Globe, Star, Mountain, Waves } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface TimelineEvent {
  id: number;
  year: string;
  title: string;
  subtitle: string;
  description: string;
  details: string[];
  icon: React.ComponentType<any>;
  color: string;
  position: 'left' | 'right';
  image?: string;
}

const Timeline: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [activeEvent, setActiveEvent] = useState<number>(0);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const timelineEvents: TimelineEvent[] = [
    {
      id: 0,
      year: "4.6 Billion Years Ago",
      title: "Birth of Earth",
      subtitle: "Formation from Cosmic Dust",
      description: "Earth formed from the gravitational collapse of dust and gas within the solar nebula, creating a molten world of incredible heat and chaos.",
      details: [
        "Temperature reached over 2,000°C",
        "Constant bombardment by asteroids and comets",
        "Formation of the first solid crust",
        "Beginning of atmospheric development"
      ],
      icon: Star,
      color: "from-orange-500 to-red-600",
      position: 'left',
      image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=600&fit=crop"
    },
    {
      id: 1,
      year: "4.4 Billion Years Ago",
      title: "The Great Cooling",
      subtitle: "Formation of Oceans",
      description: "As Earth cooled, water vapor condensed to form the first oceans, creating the foundation for all future life.",
      details: [
        "Surface temperature dropped below 100°C",
        "Massive rainfall lasted millions of years",
        "Formation of the first stable landmasses",
        "Chemical evolution began in primordial seas"
      ],
      icon: Waves,
      color: "from-blue-600 to-cyan-500",
      position: 'right',
      image: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&h=600&fit=crop"
    },
    {
      id: 2,
      year: "3.8 Billion Years Ago",
      title: "First Signs of Life",
      subtitle: "Emergence of Microorganisms",
      description: "Simple single-celled organisms emerged in Earth's oceans, marking the beginning of biological evolution.",
      details: [
        "First prokaryotic cells appeared",
        "Development of basic metabolic processes",
        "Formation of stromatolites",
        "Beginning of oxygen production"
      ],
      icon: Zap,
      color: "from-green-500 to-emerald-600",
      position: 'left',
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop"
    },
    {
      id: 3,
      year: "2.4 Billion Years Ago",
      title: "The Great Oxidation",
      subtitle: "Oxygen Revolution",
      description: "Cyanobacteria began producing oxygen through photosynthesis, fundamentally changing Earth's atmosphere and enabling complex life.",
      details: [
        "Atmospheric oxygen levels rose dramatically",
        "Mass extinction of anaerobic organisms",
        "Formation of the ozone layer",
        "Iron formations created in oceans"
      ],
      icon: Leaf,
      color: "from-teal-500 to-green-600",
      position: 'right',
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop"
    },
    {
      id: 4,
      year: "540 Million Years Ago",
      title: "Cambrian Explosion",
      subtitle: "Diversity of Complex Life",
      description: "A rapid diversification of life forms occurred, with most major animal phyla appearing in the fossil record.",
      details: [
        "Evolution of complex multicellular organisms",
        "Development of hard shells and exoskeletons",
        "First appearance of eyes and nervous systems",
        "Establishment of modern food webs"
      ],
      icon: Mountain,
      color: "from-purple-500 to-pink-600",
      position: 'left',
      image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&h=600&fit=crop"
    },
    {
      id: 5,
      year: "200,000 Years Ago",
      title: "Rise of Humanity",
      subtitle: "Homo Sapiens Emerge",
      description: "Modern humans evolved in Africa, beginning the journey that would lead to global civilization and technological advancement.",
      details: [
        "Development of advanced tool use",
        "Evolution of complex language",
        "Beginning of art and culture",
        "Migration out of Africa"
      ],
      icon: Users,
      color: "from-amber-500 to-orange-600",
      position: 'right',
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop"
    },
    {
      id: 6,
      year: "Present Day",
      title: "Modern Earth",
      subtitle: "The Anthropocene Era",
      description: "Humans have become a geological force, shaping the planet's climate, ecosystems, and future evolution.",
      details: [
        "Global population exceeds 8 billion",
        "Technological revolution and space exploration",
        "Climate change and environmental challenges",
        "Conservation efforts and sustainable development"
      ],
      icon: Globe,
      color: "from-blue-500 to-indigo-600",
      position: 'left',
      image: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=800&h=600&fit=crop"
    }
  ];

  const progressHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate timeline events on scroll
      timelineEvents.forEach((event, index) => {
        const eventElement = document.querySelector(`[data-event="${event.id}"]`);
        if (!eventElement) return;

        gsap.fromTo(eventElement,
          { 
            opacity: 0, 
            x: event.position === 'left' ? -100 : 100,
            y: 50,
            scale: 0.8
          },
          {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: eventElement,
              start: "top 80%",
              end: "top 20%",
              toggleActions: "play none none reverse",
              onEnter: () => setActiveEvent(event.id),
              onEnterBack: () => setActiveEvent(event.id)
            }
          }
        );
      });

      // Animate timeline line
      gsap.fromTo(timelineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            end: "bottom 20%",
            scrub: 1
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative py-32 bg-gradient-to-b from-black via-slate-900 to-black overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,69,19,0.1)_0%,transparent_50%)]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-blue-300 via-white to-blue-100 bg-clip-text text-transparent">
            Earth's Timeline
          </h2>
          <p className="text-xl text-blue-100/70 max-w-3xl mx-auto leading-relaxed">
            Journey through 4.6 billion years of our planet's incredible evolution, 
            from cosmic dust to the vibrant world we know today
          </p>
        </motion.div>

        {/* Timeline Container */}
        <div className="relative max-w-7xl mx-auto">
          {/* Central Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500 via-purple-500 to-orange-500 rounded-full">
            <motion.div 
              ref={timelineRef}
              className="w-full bg-gradient-to-b from-blue-400 to-orange-400 rounded-full origin-top"
              style={{ height: progressHeight }}
            />
          </div>

          {/* Timeline Events */}
          <div className="space-y-32">
            {timelineEvents.map((event, index) => {
              const IconComponent = event.icon;
              
              return (
                <motion.div
                  key={event.id}
                  data-event={event.id}
                  className={`flex items-center ${
                    event.position === 'left' 
                      ? 'flex-row' 
                      : 'flex-row-reverse'
                  }`}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                >
                  {/* Content Card */}
                  <div className={`w-5/12 ${event.position === 'left' ? 'pr-16' : 'pl-16'}`}>
                    <motion.div 
                      className="group relative bg-black/60 backdrop-blur-sm border border-blue-500/20 rounded-3xl p-8 hover:border-blue-400/40 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20"
                      whileHover={{ y: -10 }}
                    >
                      {/* Glow Effect */}
                      <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${event.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                      
                      {/* Year Badge */}
                      <div className={`inline-block px-4 py-2 rounded-full bg-gradient-to-r ${event.color} text-white text-sm font-semibold mb-4 shadow-lg`}>
                        <Clock className="w-4 h-4 inline mr-2" />
                        {event.year}
                      </div>

                      {/* Title */}
                      <h3 className="text-3xl font-bold text-white mb-2 group-hover:text-blue-100 transition-colors duration-300">
                        {event.title}
                      </h3>
                      
                      {/* Subtitle */}
                      <h4 className="text-xl text-blue-300 mb-4 font-medium">
                        {event.subtitle}
                      </h4>

                      {/* Description */}
                      <p className="text-blue-100/80 text-lg leading-relaxed mb-6">
                        {event.description}
                      </p>

                      {/* Details List */}
                      <ul className="space-y-2 mb-6">
                        {event.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start text-blue-100/70">
                            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${event.color} mt-2 mr-3 flex-shrink-0`} />
                            <span className="text-sm leading-relaxed">{detail}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Image */}
                      {event.image && (
                        <div className="rounded-xl overflow-hidden shadow-lg">
                          <img 
                            src={event.image} 
                            alt={event.title}
                            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                      )}
                    </motion.div>
                  </div>

                  {/* Timeline Node */}
                  <div className="relative z-20 flex items-center justify-center">
                    <motion.div 
                      className={`w-20 h-20 rounded-full bg-gradient-to-r ${event.color} flex items-center justify-center shadow-2xl border-4 border-black/50`}
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <IconComponent className="w-8 h-8 text-white" />
                    </motion.div>
                    
                    {/* Pulse Effect */}
                    <motion.div 
                      className={`absolute w-20 h-20 rounded-full bg-gradient-to-r ${event.color} opacity-30`}
                      animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>

                  {/* Spacer */}
                  <div className="w-5/12" />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Progress Indicator */}
        <motion.div 
          className="fixed right-8 top-1/2 transform -translate-y-1/2 z-30 bg-black/60 backdrop-blur-sm border border-blue-500/20 rounded-full p-4"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 }}
        >
          <div className="text-center">
            <div className="text-blue-300 text-sm font-medium mb-2">Progress</div>
            <div className="w-2 h-32 bg-blue-900/50 rounded-full relative">
              <motion.div 
                className="absolute bottom-0 w-full bg-gradient-to-t from-blue-400 to-blue-300 rounded-full"
                style={{ height: progressHeight }}
              />
            </div>
            <div className="text-blue-100/70 text-xs mt-2">
              Event {activeEvent + 1} of {timelineEvents.length}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Timeline;