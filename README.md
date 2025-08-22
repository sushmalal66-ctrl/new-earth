# The History of Earth - Interactive Journey

A cinematic, **horizontal timeline** experience through Earth's 4.6 billion year history, built with React, Three.js, and advanced scroll-based animations.

## 🌍 Features

- **Immersive 3D Earth**: Real-time rotating planet with dynamic textures and atmospheric effects
- **Horizontal Timeline**: Revolutionary horizontal scrolling timeline with vertical scroll input
- **Typing Animations**: Futuristic typing effects for section titles using react-type-animation
- **Smooth Scrolling**: Buttery-smooth scroll experience powered by Lenis and GSAP ScrollTrigger
- **Cinematic Animations**: Framer Motion and GSAP-powered transitions and parallax effects
- **Synchronized Earth Rotation**: Planet rotation synchronized with timeline progress
- **Responsive Design**: Optimized for all devices with performance-aware rendering
- **Accessibility**: Full keyboard navigation and reduced-motion support
- **Performance Optimized**: 60fps target with intelligent LOD and mobile optimizations

## 🚀 Tech Stack

- **React 18** + **TypeScript** + **Vite** - Modern development stack
- **Three.js** + **@react-three/fiber** + **@react-three/drei** - 3D rendering
- **Framer Motion** - UI animations and gestures
- **GSAP** + **ScrollTrigger** - Advanced scroll-based animations
- **@studio-freight/lenis** - Smooth scrolling engine
- **react-type-animation** - Typing animation effects
- **Tailwind CSS** - Utility-first styling

## 📦 Installation

```bash
# Clone the repository
git clone <repository-url>
cd earth-history

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🏗️ Project Structure

```
src/
├── components/
│   ├── 3d/
│   │   ├── Earth.tsx          # Main 3D Earth component
│   │   ├── Scene.tsx          # 3D scene setup and lighting
│   │   └── ParticleField.tsx  # Space particles and effects
│   ├── HorizontalTimeline.tsx # Horizontal scrolling timeline
│   └── ui/
│       └── Section.tsx        # Reusable section component
├── hooks/
│   └── useLenisGsapSync.ts   # Lenis + GSAP integration
├── animations/
│   └── timelines.ts          # GSAP animation timelines
├── data/
│   └── sections.ts           # Content data for all sections
├── pages/
│   └── Home.tsx              # Main page component
└── styles/
    └── index.css             # Global styles and utilities
```

## 🎬 New Features

### Horizontal Timeline Scrolling

The application now features a revolutionary horizontal timeline that responds to vertical scroll input:

- **Natural Scroll Behavior**: Vertical mouse/trackpad scrolling moves content horizontally
- **GSAP ScrollTrigger Integration**: Seamless integration with Lenis for smooth, bug-free scrolling
- **Timeline Cards**: Each era is presented as a full-screen horizontal card
- **Earth Synchronization**: Planet rotation speed and scale change based on timeline progress
- **Parallax Effects**: Background elements move at different speeds for depth

### Typing Animations

Section titles now feature futuristic typing effects:

- **react-type-animation**: Professional typing animation library
- **Trigger on View**: Animations start when sections come into viewport
- **Customizable Speed**: Different typing speeds for titles and subtitles
- **Gradient Text**: Animated text with beautiful gradient effects

## ⚙️ Configuration

### Horizontal Scroll Setup

The horizontal timeline is configured in `src/components/HorizontalTimeline.tsx`:

```typescript
// Create horizontal scroll animation
const horizontalScroll = gsap.to(timeline, {
  x: -totalWidth,
  ease: "none",
  scrollTrigger: {
    trigger: container,
    start: "top top",
    end: () => `+=${totalWidth}`,
    scrub: 1,
    pin: true,
    anticipatePin: 1,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      const progress = self.progress;
      earthProgress.set(progress);
      // Synchronize Earth rotation with timeline
    }
  }
});
```

### Typing Animation Configuration

Typing effects are configured per section:

```typescript
<TypeAnimation
  sequence={[
    '', // Start with empty string
    500, // Wait 500ms
    era.title, // Type the title
  ]}
  wrapper="span"
  speed={50}
  repeat={0}
/>
```

### Performance Settings

The app automatically adjusts quality based on device capabilities:

- **High Performance**: Full effects, 64-segment sphere, complex shaders
- **Medium Performance**: Reduced particles, 32-segment sphere
- **Low Performance**: Minimal effects, 16-segment sphere, basic materials

### Scroll Configuration

Lenis is configured for optimal smoothness with horizontal scroll support:

```typescript
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true,
  normalizeWheel: true,
  syncTouch: true,
  lerp: 0.1,
  wheelMultiplier: 1,
  touchInertiaMultiplier: 35
});
```

### GSAP Integration

ScrollTrigger is properly synced with Lenis for horizontal scrolling:

```typescript
ScrollTrigger.scrollerProxy(document.body, {
  scrollTop(value) {
    return arguments.length 
      ? lenis.scrollTo(value, { immediate: true })
      : window.scrollY;
  }
});

// Enhanced settings for horizontal scroll
ScrollTrigger.defaults({ 
  scroller: document.body,
  refreshPriority: 0,
  anticipatePin: 1
});
```

## 🎨 Customization

### Adding New Timeline Eras

1. Add era data to `src/components/HorizontalTimeline.tsx`:

```typescript
{
  id: 'new-era',
  era: 'New Era',
  timeAgo: 'X Million Years Ago',
  title: 'Era Title',
  subtitle: 'Era Subtitle',
  description: 'Era description...',
  keyEvents: ['Event 1', 'Event 2'],
  icon: IconComponent,
  color: '#color',
  gradient: 'from-color-to-color',
  image: 'image-url',
  position: 0.5 // Position along timeline (0-1)
}
```

2. The era will automatically render with typing animations

### Modifying Earth Appearance

Edit `src/components/3d/Earth.tsx`:

- Change textures by updating the texture URLs
- Modify shaders for different visual effects
- Adjust rotation speed and scale animations based on timeline progress

### Customizing Typing Animations

Edit typing sequences in `HorizontalTimeline.tsx`:

```typescript
// Customize typing speed and delays
<TypeAnimation
  sequence={[
    '', 
    customDelay,
    text,
  ]}
  speed={customSpeed}
  style={customStyles}
/>
```

### Customizing Animations

Edit horizontal scroll animations:

- Modify scroll trigger points
- Adjust parallax speeds
- Create custom card entrance animations

## 🔧 Performance Optimization

### Automatic Optimizations

- **LOD System**: Geometry complexity scales with performance
- **Texture Compression**: Optimized texture loading and caching
- **Render Culling**: Off-screen elements are not rendered
- **Mobile Detection**: Reduced effects on mobile devices
- **Horizontal Scroll Optimization**: GPU-accelerated transforms
- **Animation Batching**: Grouped animations for better performance

### Manual Optimizations

```typescript
// Reduce particle count for better performance
const particleCount = window.innerWidth < 768 ? 500 : 2000;

// Disable expensive effects on low-end devices
const enableComplexShaders = navigator.hardwareConcurrency > 4;

// Optimize horizontal scroll for mobile
const enableHorizontalScroll = window.innerWidth > 768;
```

## 🎯 Browser Support

- **Chrome/Edge**: Full support with all features
- **Firefox**: Full support with minor shader differences
- **Safari**: Full support with WebGL optimizations
- **Mobile**: Optimized experience with reduced effects

## 🐛 Troubleshooting

### Common Issues

1. **Scroll feels laggy**:
   - Check if other smooth scroll libraries are conflicting
   - Ensure `scroll-behavior: auto` is set in CSS
   - Verify Lenis is properly initialized
   - Check horizontal scroll performance settings

2. **3D Earth not rendering**:
   - Check WebGL support in browser
   - Verify texture URLs are accessible
   - Check browser console for Three.js errors

3. **Horizontal scroll not working**:
   - Verify GSAP ScrollTrigger is properly registered
   - Check container dimensions and scroll distances
   - Ensure Lenis and ScrollTrigger are synchronized

4. **Typing animations not triggering**:
   - Check viewport intersection logic
   - Verify react-type-animation is properly installed
   - Check animation trigger conditions

5. **Animations not smooth**:
   - Reduce particle count in `ParticleField.tsx`
   - Lower geometry complexity in `Earth.tsx`
   - Check if `will-change` properties are properly set
   - Disable complex animations on low-end devices

### Performance Debugging

```typescript
// Enable performance monitoring
const stats = new Stats();
document.body.appendChild(stats.dom);

// Monitor frame rate
useFrame(() => {
  stats.update();
});

// Debug horizontal scroll performance
ScrollTrigger.addEventListener("refresh", () => {
  console.log("ScrollTrigger refreshed");
});
```

## 📱 Mobile Considerations

- Particle effects are automatically reduced on mobile
- Touch scrolling is optimized with `syncTouch: true`
- Texture resolution is lowered for better performance
- Complex shaders are simplified on low-end devices
- Horizontal scroll is optimized for touch devices
- Typing animations are simplified on mobile

## 🌟 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Earth textures from Unsplash
- Three.js community for excellent documentation
- GSAP team for powerful animation tools
- Lenis team for smooth scrolling innovation
- react-type-animation for typing effects

---

Built with ❤️ for exploring our planet's incredible history through innovative web technologies.