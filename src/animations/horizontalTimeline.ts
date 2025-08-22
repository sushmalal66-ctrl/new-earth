import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const initializeHorizontalTimeline = (container: HTMLElement) => {
  // Clear existing ScrollTriggers
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());

  const timeline = container.querySelector('.horizontal-timeline');
  const sections = container.querySelectorAll('.timeline-section');
  
  if (!timeline || sections.length === 0) return;

  // Calculate total width needed for horizontal scroll
  const totalWidth = sections.length * window.innerWidth;
  
  // Set up horizontal scrolling container
  gsap.set(timeline, {
    width: totalWidth,
    height: '100vh',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  });

  // Set each section to full viewport width
  gsap.set(sections, {
    width: window.innerWidth,
    height: '100vh',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  });

  // Create horizontal scroll animation
  const horizontalScroll = gsap.to(timeline, {
    x: () => -(totalWidth - window.innerWidth),
    ease: 'none',
    scrollTrigger: {
      trigger: container,
      start: 'top top',
      end: () => `+=${totalWidth}`,
      scrub: 1,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      refreshPriority: -1,
      onUpdate: (self) => {
        // Dispatch progress for Earth rotation sync
        const progress = self.progress;
        window.dispatchEvent(new CustomEvent('timeline-progress', { 
          detail: { progress } 
        }));
        
        // Update CSS custom property for other animations
        document.documentElement.style.setProperty('--timeline-progress', progress.toString());
      }
    }
  });

  // Animate individual sections as they come into view
  sections.forEach((section, index) => {
    const content = section.querySelector('.section-content');
    const image = section.querySelector('.section-image');
    const title = section.querySelector('.section-title');
    const subtitle = section.querySelector('.section-subtitle');
    const description = section.querySelector('.section-description');
    const keyPoints = section.querySelectorAll('.key-point');

    if (!content) return;

    // Set initial states
    gsap.set([title, subtitle, description], { opacity: 0, y: 50 });
    gsap.set(keyPoints, { opacity: 0, x: -30 });
    gsap.set(image, { opacity: 0, scale: 0.8, rotationY: 15 });

    // Create entrance animation timeline
    const sectionTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'left 80%',
        end: 'left 20%',
        horizontal: true,
        containerAnimation: horizontalScroll,
        toggleActions: 'play none none reverse',
        onEnter: () => {
          // Trigger typing animation for title
          section.dispatchEvent(new CustomEvent('start-typing'));
        }
      }
    });

    // Animate content entrance
    sectionTl
      .to(image, {
        opacity: 1,
        scale: 1,
        rotationY: 0,
        duration: 1.2,
        ease: 'power2.out'
      }, 0)
      .to(title, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out'
      }, 0.2)
      .to(subtitle, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out'
      }, 0.4)
      .to(description, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out'
      }, 0.6)
      .to(keyPoints, {
        opacity: 1,
        x: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out'
      }, 0.8);

    // Parallax effect for images
    gsap.to(image, {
      x: -50,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'left right',
        end: 'right left',
        horizontal: true,
        containerAnimation: horizontalScroll,
        scrub: 1
      }
    });
  });

  // Refresh ScrollTrigger after setup
  setTimeout(() => {
    ScrollTrigger.refresh();
  }, 100);

  return horizontalScroll;
};

// Utility function to scroll to specific section
export const scrollToTimelineSection = (sectionIndex: number) => {
  const targetX = sectionIndex * window.innerWidth;
  gsap.to(window, {
    duration: 1.5,
    scrollTo: {
      y: targetX,
      offsetY: 0
    },
    ease: 'power2.inOut'
  });
};

// Clean up function
export const cleanupHorizontalTimeline = () => {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  gsap.killTweensOf('*');
};