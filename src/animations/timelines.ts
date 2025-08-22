import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const initializeTimelines = (container: HTMLElement) => {
  // Clear existing ScrollTriggers
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());

  // Main timeline for Earth transformations
  const earthTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      invalidateOnRefresh: true,
      refreshPriority: 1
    }
  });

  // Section-based animations
  const sections = container.querySelectorAll('[data-section]');
  
  sections.forEach((section, index) => {
    const sectionElement = section as HTMLElement;
    
    // Parallax effects for each section
    gsap.set(sectionElement, { willChange: 'transform' });
    
    // Section entrance animation
    ScrollTrigger.create({
      trigger: sectionElement,
      start: "top 80%",
      end: "top 20%",
      onEnter: () => {
        gsap.to(sectionElement, {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power2.out"
        });
      },
      onLeave: () => {
        gsap.to(sectionElement, {
          opacity: 0.7,
          duration: 0.5
        });
      },
      onEnterBack: () => {
        gsap.to(sectionElement, {
          opacity: 1,
          duration: 0.5
        });
      }
    });

    // Parallax for background elements
    const bgElements = sectionElement.querySelectorAll('[class*="absolute"]');
    bgElements.forEach((element, bgIndex) => {
      const speed = 0.5 + (bgIndex * 0.2);
      
      gsap.to(element, {
        y: -100 * speed,
        ease: "none",
        scrollTrigger: {
          trigger: sectionElement,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true
        }
      });
    });

    // Text reveal animations
    const textElements = sectionElement.querySelectorAll('h2, h3, p');
    textElements.forEach((text, textIndex) => {
      gsap.set(text, { willChange: 'transform' });
      
      ScrollTrigger.create({
        trigger: text,
        start: "top 85%",
        onEnter: () => {
          gsap.fromTo(text, 
            { 
              opacity: 0, 
              y: 50,
              rotationX: 15
            },
            {
              opacity: 1,
              y: 0,
              rotationX: 0,
              duration: 1,
              delay: textIndex * 0.1,
              ease: "power2.out"
            }
          );
        }
      });
    });
  });

  // Smooth section transitions
  ScrollTrigger.create({
    trigger: container,
    start: "top top",
    end: "bottom bottom",
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

  // Performance optimization: batch DOM updates
  ScrollTrigger.batch('[data-animate]', {
    onEnter: (elements) => {
      gsap.fromTo(elements, 
        { 
          opacity: 0, 
          y: 100,
          scale: 0.95
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          stagger: 0.1,
          ease: "power2.out",
          overwrite: "auto"
        }
      );
    },
    onLeave: (elements) => {
      gsap.to(elements, {
        opacity: 0.3,
        scale: 0.98,
        duration: 0.3,
        overwrite: "auto"
      });
    },
    onEnterBack: (elements) => {
      gsap.to(elements, {
        opacity: 1,
        scale: 1,
        duration: 0.3,
        overwrite: "auto"
      });
    }
  });

  // Refresh ScrollTrigger after setup
  ScrollTrigger.refresh();
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
export const cleanupTimelines = () => {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  gsap.killTweensOf("*");
};