# The History of Earth - Interactive Journey

A cinematic, scroll-driven experience through Earth's 4.6 billion year history, built with React, Three.js, and smooth scrolling technologies.

## 🌍 Features

- **Immersive 3D Earth**: Real-time rotating planet with dynamic textures and atmospheric effects
- **Smooth Scrolling**: Buttery-smooth scroll experience powered by Lenis and GSAP
- **Cinematic Animations**: Framer Motion and GSAP-powered transitions and parallax effects
- **Responsive Design**: Optimized for all devices with performance-aware rendering
- **Accessibility**: Full keyboard navigation and reduced-motion support
- **Performance Optimized**: 60fps target with intelligent LOD and mobile optimizations

## 🚀 Tech Stack

- **React 18** + **TypeScript** + **Vite** - Modern development stack
- **Three.js** + **@react-three/fiber** + **@react-three/drei** - 3D rendering
- **Framer Motion** - UI animations and gestures
- **GSAP** + **ScrollTrigger** - Advanced scroll-based animations
- **@studio-freight/lenis** - Smooth scrolling engine
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

## ⚙️ Configuration

### Performance Settings

The app automatically adjusts quality based on device capabilities:

- **High Performance**: Full effects, 64-segment sphere, complex shaders
- **Medium Performance**: Reduced particles, 32-segment sphere
- **Low Performance**: Minimal effects, 16-segment sphere, basic materials

### Scroll Configuration

Lenis is configured for optimal smoothness:

```typescript
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true,
  normalizeWheel: true,
  syncTouch: true
});
```

### GSAP Integration

ScrollTrigger is properly synced with Lenis:

```typescript
ScrollTrigger.scrollerProxy(document.body, {
  scrollTop(value) {
    return arguments.length 
      ? lenis.scrollTo(value, { immediate: true })
      : window.scrollY;
  }
});
```

## 🎨 Customization

### Adding New Sections

1. Add section data to `src/data/sections.ts`:

```typescript
{
  id: 'new-era',
  title: 'New Era',
  subtitle: 'Subtitle here',
  description: 'Description...',
  era: 'Era Name',
  timeAgo: 'Time period',
  keyPoints: ['Point 1', 'Point 2']
}
```

2. The section will automatically render with animations

### Modifying Earth Appearance

Edit `src/components/3d/Earth.tsx`:

- Change textures by updating the texture URLs
- Modify shaders for different visual effects
- Adjust rotation speed and scale animations

### Customizing Animations

Edit `src/animations/timelines.ts`:

- Add new ScrollTrigger animations
- Modify parallax effects
- Create custom timeline sequences

## 🔧 Performance Optimization

### Automatic Optimizations

- **LOD System**: Geometry complexity scales with performance
- **Texture Compression**: Optimized texture loading and caching
- **Render Culling**: Off-screen elements are not rendered
- **Mobile Detection**: Reduced effects on mobile devices

### Manual Optimizations

```typescript
// Reduce particle count for better performance
const particleCount = window.innerWidth < 768 ? 500 : 2000;

// Disable expensive effects on low-end devices
const enableComplexShaders = navigator.hardwareConcurrency > 4;
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

2. **3D Earth not rendering**:
   - Check WebGL support in browser
   - Verify texture URLs are accessible
   - Check browser console for Three.js errors

3. **Animations not smooth**:
   - Reduce particle count in `ParticleField.tsx`
   - Lower geometry complexity in `Earth.tsx`
   - Check if `will-change` properties are properly set

### Performance Debugging

```typescript
// Enable performance monitoring
const stats = new Stats();
document.body.appendChild(stats.dom);

// Monitor frame rate
useFrame(() => {
  stats.update();
});
```

## 📱 Mobile Considerations

- Particle effects are automatically reduced on mobile
- Touch scrolling is optimized with `syncTouch: true`
- Texture resolution is lowered for better performance
- Complex shaders are simplified on low-end devices

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

---

Built with ❤️ for exploring our planet's incredible history.