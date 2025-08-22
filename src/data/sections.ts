export interface SectionData {
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
}

export const sections: SectionData[] = [
  {
    id: 'hero',
    title: 'Earth',
    subtitle: 'Journey Through 4.6 Billion Years',
    description: 'Witness the incredible transformation of our planet from a molten ball of rock to the vibrant world we call home. Experience the epic story of Earth through an immersive, cinematic journey.',
    era: 'The Beginning',
    timeAgo: '4.6 Billion Years Ago',
    keyPoints: [
      'Formation from cosmic dust and debris',
      'Gravitational collapse creates our planet',
      'Differentiation into core, mantle, and crust',
      'Early atmosphere begins to form'
    ],
    cta: {
      text: 'Begin Journey',
      action: () => {
        const nextSection = document.getElementById('formation');
        nextSection?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  },
  {
    id: 'formation',
    title: 'Formation',
    subtitle: 'Birth of a Planet',
    description: 'In the violent early days of our solar system, Earth formed through the accretion of countless planetesimals. Intense heat from impacts and radioactive decay created a molten world, setting the stage for everything that would follow.',
    era: 'Hadean Eon',
    timeAgo: '4.6 - 4.0 Billion Years Ago',
    keyPoints: [
      'Accretion of planetesimals forms proto-Earth',
      'Giant impact creates the Moon',
      'Differentiation separates core from mantle',
      'Outgassing creates primitive atmosphere',
      'Surface begins to cool and solidify'
    ]
  },
  {
    id: 'ancient-life',
    title: 'Ancient Life',
    subtitle: 'The First Spark of Life',
    description: 'As Earth cooled, oceans formed and the first primitive life emerged. Simple microorganisms began the long journey of evolution, fundamentally changing our planet\'s atmosphere and setting the stage for all future life.',
    era: 'Archean Eon',
    timeAgo: '4.0 - 2.5 Billion Years Ago',
    keyPoints: [
      'Formation of stable oceans',
      'First prokaryotic life appears',
      'Cyanobacteria begin photosynthesis',
      'Great Oxidation Event transforms atmosphere',
      'Stromatolites preserve early life evidence'
    ]
  },
  {
    id: 'complex-life',
    title: 'Complex Life',
    subtitle: 'The Cambrian Explosion',
    description: 'Life exploded into incredible diversity during the Cambrian period. Complex multicellular organisms evolved rapidly, creating the foundation for all modern animal phyla in one of evolution\'s most remarkable chapters.',
    era: 'Phanerozoic Eon',
    timeAgo: '541 Million Years Ago - Present',
    keyPoints: [
      'Cambrian explosion of biodiversity',
      'First complex multicellular organisms',
      'Evolution of hard shells and skeletons',
      'Colonization of land by plants and animals',
      'Mass extinctions and recoveries'
    ]
  },
  {
    id: 'human-civilization',
    title: 'Human Era',
    subtitle: 'The Age of Civilization',
    description: 'In just the last few thousand years, humans have transformed from hunter-gatherers to a global civilization. Our species has become a geological force, ushering in what many call the Anthropocene epoch.',
    era: 'Anthropocene',
    timeAgo: '300,000 Years Ago - Present',
    keyPoints: [
      'Evolution of Homo sapiens',
      'Development of agriculture and cities',
      'Industrial revolution transforms society',
      'Global communication and technology',
      'Space exploration begins'
    ]
  },
  {
    id: 'future',
    title: 'The Future',
    subtitle: 'Earth\'s Next Chapter',
    description: 'As we look to the future, humanity faces both challenges and opportunities. Climate change, space exploration, and technological advancement will shape Earth\'s next chapter in ways we\'re only beginning to understand.',
    era: 'The Future',
    timeAgo: 'Present - Beyond',
    keyPoints: [
      'Sustainable technology development',
      'Climate change mitigation',
      'Interplanetary exploration',
      'Artificial intelligence integration',
      'Preservation of biodiversity'
    ],
    cta: {
      text: 'Explore More',
      action: () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }
];