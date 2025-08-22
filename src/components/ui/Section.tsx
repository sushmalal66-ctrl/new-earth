import React from 'react';
import { motion } from 'framer-motion';

interface SectionProps {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  era: string;
  timeAgo: string;
  keyPoints: string[];
  cta?: {
    text: string;
    action: () => void;
  };
  index: number;
  isFirst: boolean;
  isLast: boolean;
}

const Section: React.FC<SectionProps> = ({
  id,
  title,
  subtitle,
  description,
  era,
  timeAgo,
  keyPoints,
  cta,
  index,
  isFirst,
  isLast
}) => {
  const sectionVariants = {
    hidden: { 
      opacity: 0, 
      y: 100,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 1.2,
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const getGradientClass = (index: number) => {
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

  return (
    <section 
      id={id}
      className={`relative min-h-screen flex items-center justify-center px-6 py-20 ${
        isFirst ? 'pt-0' : ''
      }`}
      data-section={index}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Gradient overlay specific to section */}
        <div className={`absolute inset-0 bg-gradient-to-br ${getGradientClass(index)} opacity-5`} />
        
        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
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

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          className="grid lg:grid-cols-2 gap-16 items-center"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Content Side */}
          <div className={`space-y-8 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
            {/* Era Badge */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center px-6 py-3 bg-black/40 backdrop-blur-sm border border-cyan-500/30 rounded-full"
            >
              <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getGradientClass(index)} mr-3`} />
              <span className="text-cyan-300 font-medium">{era}</span>
              <span className="text-slate-400 ml-3 text-sm">{timeAgo}</span>
            </motion.div>

            {/* Title */}
            <motion.div variants={itemVariants}>
              <h2 className="text-5xl md:text-7xl font-bold mb-4 leading-tight">
                <span className={`bg-gradient-to-r ${getGradientClass(index)} bg-clip-text text-transparent`}>
                  {title}
                </span>
              </h2>
              <h3 className="text-2xl md:text-3xl text-slate-300 font-light">
                {subtitle}
              </h3>
            </motion.div>

            {/* Description */}
            <motion.p 
              variants={itemVariants}
              className="text-lg text-slate-300 leading-relaxed max-w-2xl"
            >
              {description}
            </motion.p>

            {/* Key Points */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h4 className="text-xl font-semibold text-white mb-4">Key Developments</h4>
              <div className="grid gap-3">
                {keyPoints.map((point, pointIndex) => (
                  <motion.div
                    key={pointIndex}
                    className="flex items-start space-x-3 p-4 bg-black/20 backdrop-blur-sm border border-slate-700/30 rounded-xl hover:border-cyan-500/40 transition-all duration-300"
                    whileHover={{ scale: 1.02, x: 10 }}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: pointIndex * 0.1 }}
                  >
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${getGradientClass(index)} mt-2 flex-shrink-0`} />
                    <span className="text-slate-300">{point}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* CTA Button */}
            {cta && (
              <motion.div variants={itemVariants}>
                <motion.button
                  onClick={cta.action}
                  className={`inline-flex items-center px-8 py-4 bg-gradient-to-r ${getGradientClass(index)} hover:shadow-lg hover:shadow-cyan-500/25 text-white font-semibold rounded-xl transition-all duration-300`}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {cta.text}
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </motion.button>
              </motion.div>
            )}
          </div>

          {/* Visual Side */}
          <div className={`relative ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
            <motion.div
              variants={itemVariants}
              className="relative"
            >
              {/* Decorative Frame */}
              <div className="relative p-8">
                <div className={`absolute inset-0 bg-gradient-to-br ${getGradientClass(index)} opacity-10 rounded-3xl`} />
                <div className="absolute inset-0 border border-cyan-500/20 rounded-3xl" />
                
                {/* Content Placeholder */}
                <div className="relative z-10 aspect-square bg-black/40 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className={`w-16 h-16 mx-auto bg-gradient-to-r ${getGradientClass(index)} rounded-2xl flex items-center justify-center`}>
                      <span className="text-2xl font-bold text-white">{index + 1}</span>
                    </div>
                    <p className="text-slate-400 text-sm">
                      Era visualization<br />
                      <span className="text-cyan-300">{era}</span>
                    </p>
                    
                    {/* Simple visual representation */}
                    <div className="w-full h-32 bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent rounded-lg flex items-center justify-center">
                      <div className={`w-12 h-12 bg-gradient-to-r ${getGradientClass(index)} rounded-full animate-pulse`} />
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl animate-pulse" />
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Section Divider */}
      {!isLast && (
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
          <div className="w-px h-20 bg-gradient-to-b from-cyan-500/50 to-transparent" />
        </div>
      )}
    </section>
  );
};

export default Section;