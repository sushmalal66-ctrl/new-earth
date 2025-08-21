import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Globe, 
  Heart, 
  Mail, 
  Github, 
  Twitter, 
  Linkedin,
  MapPin,
  Phone,
  ExternalLink,
  Leaf,
  Users,
  Award
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const EnhancedFooter: React.FC = () => {
  const footerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  const stats = [
    { icon: Globe, value: "4.6B", label: "Years of History", color: "from-blue-500 to-cyan-400" },
    { icon: Leaf, value: "8.7M", label: "Species", color: "from-green-500 to-emerald-400" },
    { icon: Users, value: "8B+", label: "People", color: "from-purple-500 to-pink-400" },
    { icon: Award, value: "1", label: "Unique Planet", color: "from-orange-500 to-red-400" }
  ];

  const links = {
    explore: [
      { name: "Earth's Timeline", href: "#timeline" },
      { name: "Climate Data", href: "#climate" },
      { name: "Biodiversity", href: "#biodiversity" },
      { name: "Conservation", href: "#conservation" }
    ],
    resources: [
      { name: "Educational Content", href: "#education" },
      { name: "Research Papers", href: "#research" },
      { name: "Interactive Maps", href: "#maps" },
      { name: "Data Visualizations", href: "#data" }
    ],
    connect: [
      { name: "Newsletter", href: "#newsletter" },
      { name: "Community", href: "#community" },
      { name: "Events", href: "#events" },
      { name: "Partnerships", href: "#partners" }
    ]
  };

  const socialLinks = [
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Mail, href: "#", label: "Email" }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate stats on scroll
      gsap.fromTo(statsRef.current?.children || [],
        { opacity: 0, y: 50, scale: 0.8 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 80%",
            end: "top 20%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Animate footer sections
      const footerSections = footerRef.current?.querySelectorAll('.footer-section');
      gsap.fromTo(footerSections || [],
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 90%",
            end: "top 50%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer 
      ref={footerRef}
      className="relative bg-gradient-to-b from-black via-slate-900 to-black border-t border-blue-500/20"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(59,130,246,0.1)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(139,69,19,0.1)_0%,transparent_50%)]" />
      </div>

      {/* Stats Section */}
      <div className="relative z-10 py-20 border-b border-blue-500/10">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-300 to-white bg-clip-text text-transparent">
              Our Planet in Numbers
            </h3>
            <p className="text-blue-100/70 text-lg max-w-2xl mx-auto">
              Discover the incredible statistics that make Earth unique in the universe
            </p>
          </motion.div>

          <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <motion.div
                  key={index}
                  className="text-center group cursor-pointer"
                  whileHover={{ scale: 1.05, y: -10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${stat.color} flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-shadow duration-300`}>
                    <IconComponent className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:text-blue-100 transition-colors duration-300">
                    {stat.value}
                  </div>
                  <div className="text-blue-100/70 text-sm font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative z-10 py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-2 footer-section">
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-300 rounded-xl flex items-center justify-center mr-4">
                    <Globe className="w-7 h-7 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold text-white">EARTH</h4>
                </div>
                
                <p className="text-blue-100/80 text-lg leading-relaxed mb-6">
                  Exploring our planet's incredible 4.6 billion year journey through 
                  immersive 3D experiences and interactive storytelling.
                </p>

                <div className="space-y-3 text-blue-100/70">
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-3 text-blue-400" />
                    <span>Planet Earth, Solar System</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 mr-3 text-blue-400" />
                    <span>+1 (555) EARTH-01</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 mr-3 text-blue-400" />
                    <span>hello@earth-timeline.com</span>
                  </div>
                </div>
              </motion.div>

              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => {
                  const IconComponent = social.icon;
                  return (
                    <motion.a
                      key={index}
                      href={social.href}
                      className="w-12 h-12 bg-blue-900/30 hover:bg-blue-500 border border-blue-500/20 hover:border-blue-400 rounded-xl flex items-center justify-center transition-all duration-300 group"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <IconComponent className="w-5 h-5 text-blue-300 group-hover:text-white transition-colors duration-300" />
                    </motion.a>
                  );
                })}
              </div>
            </div>

            {/* Links Sections */}
            {Object.entries(links).map(([category, categoryLinks], categoryIndex) => (
              <div key={category} className="footer-section">
                <h5 className="text-xl font-semibold text-white mb-6 capitalize">
                  {category}
                </h5>
                <ul className="space-y-3">
                  {categoryLinks.map((link, linkIndex) => (
                    <motion.li 
                      key={linkIndex}
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <a 
                        href={link.href}
                        className="text-blue-100/70 hover:text-blue-300 transition-colors duration-300 flex items-center group"
                      >
                        <span>{link.name}</span>
                        <ExternalLink className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="relative z-10 py-12 border-t border-blue-500/10">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              <h4 className="text-2xl font-bold text-white mb-4">
                Stay Connected with Earth's Story
              </h4>
              <p className="text-blue-100/70 mb-8">
                Get the latest updates on our planet's incredible journey and new discoveries
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-blue-900/20 border border-blue-500/30 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:border-blue-400 transition-colors duration-300"
                />
                <motion.button
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/25"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Subscribe
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative z-10 py-8 border-t border-blue-500/10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <motion.p 
              className="text-blue-100/60 text-sm mb-4 md:mb-0 flex items-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              Built with <Heart className="w-4 h-4 mx-2 text-red-400" /> for our incredible planet Earth
            </motion.p>
            
            <motion.div 
              className="flex items-center space-x-6 text-blue-100/60 text-sm"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <a href="#" className="hover:text-blue-300 transition-colors duration-300">Privacy Policy</a>
              <a href="#" className="hover:text-blue-300 transition-colors duration-300">Terms of Service</a>
              <span>© 2024 Earth Timeline. All rights reserved.</span>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default EnhancedFooter;