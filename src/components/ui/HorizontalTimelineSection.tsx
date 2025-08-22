import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';

interface HorizontalTimelineSectionProps {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  era: string;
  timeAgo: string;
  keyPoints: string[];
  color?: string;
  gradient?: string;
  image?: string;
  index: number;
}

const HorizontalTimelineSection: React.FC<HorizontalTimelineSectionProps> = ({
  id,
  title,
  subtitle,
  description,
  era,
  timeAgo,
  keyPoints,
  color,
  gradient,
  image,
  index
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [startTyping, setStartTyping] = useState(false);
  const [typingKey, setTypingKey] = useState(0);

  const getGradientClass = (index: number) => {
    if (gradient) return gradient;
    
    const gradients = [
      'from-cyan-400 to-blue-500',
      'from-orange-400 to-red-500',
      'from-green-400 to-emerald-500',
      'from-purple-400 to-pink-500',
      'from-blue-400 to-indigo-500',
      'from-yellow-400 to-orange-500'
    ];
    return gradients[index % gradients.length];
  };

  // Listen for typing trigger event
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleStartTyping = () => {
      setStartTyping(true);
      // Reset typing animation by changing key
      setTypingKey(prev => prev + 1);
    };

    section.addEventListener('start-typing', handleStartTyping);
    return () => section.removeEventListener('start-typing', handleStartTyping);
  }, []);

  return (
    <div 
      ref={sectionRef}
      className="timeline-section relative"
      data-section={index}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${getGradientClass(index)} opacity-5`} />
        
        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-cyan-400/20 rounded-full"
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

      <div className="section-content relative z-10 max-w-7xl mx-auto px-6 h-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center h-full">
          {/* Content Side */}
          <div className={`space-y-8 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
            {/* Era Badge */}
            <div className="inline-flex items-center px-6 py-3 bg-black/40 backdrop-blur-sm border border-cyan-500/30 rounded-full">
              <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getGradientClass(index)} mr-3`} />
              <span className="text-cyan-300 font-medium">{era}</span>
              <span className="text-slate-400 ml-3 text-sm">{timeAgo}</span>
            </div>

            {/* Title with Typing Animation */}
            <div>
              <h2 className="section-title text-5xl md:text-7xl font-bold mb-4 leading-tight min-h-[1.2em]">
                <span className={`bg-gradient-to-r ${getGradientClass(index)} bg-clip-text text-transparent`}>
                  {startTyping ? (
                    <TypeAnimation
                      key={typingKey}
                      sequence={[
                        '', // Start with empty string
                        500, // Wait 500ms
                        title, // Type the title
                      ]}
                      wrapper="span"
                      speed={50}
                      style={{ display: 'inline-block' }}
                      repeat={0}
                      cursor={true}
                      omitDeletionAnimation={true}
                    />
                  ) : (
                    <span style={{ opacity: 0 }}>{title}</span>
                  )}
                </span>
              </h2>
              <h3 className="section-subtitle text-2xl md:text-3xl text-slate-300 font-light">
                {subtitle}
              </h3>
            </div>

            {/* Description */}
            <p className="section-description text-lg text-slate-300 leading-relaxed max-w-2xl">
              {description}
            </p>

            {/* Key Points */}
            <div className="space-y-4">
              <h4 className="text-xl font-semibold text-white mb-4">Key Developments</h4>
              <div className="grid gap-3">
                {keyPoints.map((point, pointIndex) => (
                  <div
                    key={pointIndex}
                    className="key-point flex items-start space-x-3 p-4 bg-black/20 backdrop-blur-sm border border-slate-700/30 rounded-xl hover:border-cyan-500/40 transition-all duration-300"
                  >
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${getGradientClass(index)} mt-2 flex-shrink-0`} />
                    <span className="text-slate-300">{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Visual Side */}
          <div className={`relative ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
            <div className="section-image relative">
              {image ? (
                <div className="relative group">
                  <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                    <img 
                      src={image}
                      alt={title}
                      loading="lazy" 
                      className="w-full h-80 md:h-96 object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                    
                    {/* Fallback content */}
                    <div className="hidden absolute inset-0 bg-black/40 backdrop-blur-sm rounded-3xl items-center justify-center">
                      <div className="text-center space-y-4">
                        <div className={`w-16 h-16 mx-auto bg-gradient-to-r ${getGradientClass(index)} rounded-2xl flex items-center justify-center`}>
                          <span className="text-2xl font-bold text-white">{index + 1}</span>
                        </div>
                        <p className="text-slate-400 text-sm">
                          Era visualization<br />
                          <span className="text-cyan-300">{era}</span>
                        </p>
                      </div>
                    </div>
                    
                    {/* Image Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-t ${getGradientClass(index)} opacity-20 group-hover:opacity-30 transition-opacity duration-500`} />
                    
                    {/* Era Badge on Image */}
                    <div className="absolute top-6 right-6">
                      <div className={`w-16 h-16 bg-gradient-to-r ${getGradientClass(index)} rounded-2xl flex items-center justify-center shadow-lg backdrop-blur-sm`}>
                        <span className="text-xl font-bold text-white">{index + 1}</span>
                      </div>
                    </div>
                    
                    {/* Stats Overlay */}
                    <div className="absolute bottom-6 left-6 right-6 bg-black/70 backdrop-blur-md border border-gray-700/20 rounded-2xl p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-gray-100 font-semibold text-lg">{era}</div>
                          <div className="text-gray-400 text-sm">{timeAgo}</div>
                        </div>
                        <div className={`w-12 h-12 bg-gradient-to-r ${getGradientClass(index)} rounded-xl flex items-center justify-center`}>
                          <span className="text-lg font-bold text-white">{index + 1}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Decorative Elements */}
                  <div className="absolute -top-4 -left-4 w-24 h-24 bg-gray-500/10 rounded-full blur-xl" />
                  <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gray-600/10 rounded-full blur-xl" />
                </div>
              ) : (
                /* Fallback Decorative Frame */
                <div className="relative p-8">
                  <div className={`absolute inset-0 bg-gradient-to-br ${getGradientClass(index)} opacity-10 rounded-3xl`} />
                  <div className="absolute inset-0 border border-cyan-500/20 rounded-3xl" />
                  
                  <div className="relative z-10 aspect-square bg-black/40 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className={`w-16 h-16 mx-auto bg-gradient-to-r ${getGradientClass(index)} rounded-2xl flex items-center justify-center`}>
                        <span className="text-2xl font-bold text-white">{index + 1}</span>
                      </div>
                      <p className="text-slate-400 text-sm">
                        Era visualization<br />
                        <span className="text-cyan-300">{era}</span>
                      </p>
                      
                      <div className="w-full h-32 bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent rounded-lg flex items-center justify-center">
                        <div className={`w-12 h-12 bg-gradient-to-r ${getGradientClass(index)} rounded-full animate-pulse`} />
                      </div>
                    </div>
                  </div>

                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl animate-pulse" />
                  <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HorizontalTimelineSection;