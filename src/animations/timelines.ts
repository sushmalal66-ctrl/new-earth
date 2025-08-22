import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const initializeTimelines = (container: HTMLElement) => {
  // Clear existing ScrollTriggers for this container only
  ScrollTrigger.getAll().forEach(trigger => {
    if (trigger.vars.trigger === container || container.contains(trigger.vars.trigger as Element)) {
      trigger.kill();
    }
  });

  // Section-based animations
  const sections = container.querySelectorAll('[data-section]');
  
  let ctx = gsap.context(() => {
    sections.forEach((section, index) => {
      const sectionElement = section as HTMLElement;
      
      // Set initial state
      gsap.set(sectionElement, { 
        willChange: 'transform',
        opacity: 0,
        y: 50
      });
      
      // Section entrance animation
      ScrollTrigger.create({
        trigger: sectionElement,
        start: "top 80%",
        end: "top 20%",
        toggleActions: "play none none reverse",
        refreshPriority: 0,
        onEnter: () => {
          gsap.to(sectionElement, {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power2.out",
            overwrite: "auto"
          });
        },
        onLeave: () => {
          gsap.to(sectionElement, {
            opacity: 0.7,
            duration: 0.5,
            overwrite: "auto"
          });
        },
        onEnterBack: () => {
          gsap.to(sectionElement, {
            opacity: 1,
            duration: 0.5,
            overwrite: "auto"
          });
        }
      });

      // Text reveal animations
      const textElements = sectionElement.querySelectorAll('h2, h3, p');
      textElements.forEach((text, textIndex) => {
        gsap.set(text, { 
          willChange: 'transform',
          opacity: 0,
          y: 30
        });
        
        ScrollTrigger.create({
          trigger: text,
          start: "top 85%",
          toggleActions: "play none none reverse",
          refreshPriority: -1,
          onEnter: () => {
            gsap.fromTo(text, 
              { 
                opacity: 0, 
                y: 30
              },
              {
                opacity: 1,
                y: 0,
                duration: 1,
                delay: textIndex * 0.1,
                ease: "power2.out",
                overwrite: "auto"
              }
            );
          }
        });
      });
    });
  }, container);

  // Global scroll progress tracking
  ScrollTrigger.create({
    trigger: container,
    start: "top top",
    end: "bottom bottom",
    scrub: true,
    refreshPriority: 1,
    onUpdate: (self) => {
      const progress = self.progress;
      
      // Update CSS custom properties for smooth transitions
      document.documentElement.style.setProperty('--scroll-progress', progress.toString());
      
      // Dispatch custom event for React components
      window.dispatchEvent(new CustomEvent('scroll-progress', { 
        detail: { progress } 
      }));
    }
  });

  return ctx;
};

// Utility function to create smooth scroll-to animations
export const scrollToSection = (sectionId: string) => {
  const target = document.getElementById(sectionId);
  if (target) {
    gsap.to(window, {
      duration: 1.5,
      scrollTo: {
        y: target,
        offsetY: 0
      },
      ease: "power2.inOut"
    });
  }
};

// Clean up function
export const cleanupTimelines = (container?: HTMLElement) => {
  if (container) {
    ScrollTrigger.getAll().forEach(trigger => {
      if (trigger.vars.trigger === container || container.contains(trigger.vars.trigger as Element)) {
        trigger.kill();
      }
    });
  } else {
    ScrollTrigger.killAll();
  }
  gsap.killTweensOf("*");
};