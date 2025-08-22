export interface SectionData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  era: string;
  timeAgo: string;
  keyPoints: string[];
  icon?: string;
  color?: string;
  gradient?: string;
  image?: string;
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
    color: '#1e293b',
    gradient: 'from-slate-800 via-slate-700 to-slate-900',
    image: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=600&fit=crop&auto=format',
    cta: {
      text: 'Begin Journey',
      action: () => {
        const nextSection = document.getElementById('big-bang');
        nextSection?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  },
  {
    id: 'big-bang',
    title: 'The Beginning',
    subtitle: 'Universe Emerges from Singularity',
    description: 'In an infinitesimal moment, space and time exploded into existence. The fundamental forces separated, particles formed, and the cosmic dance began that would eventually lead to our planet.',
    era: 'Cosmic Genesis',
    timeAgo: '13.8 Billion Years Ago',
    keyPoints: [
      'Planck epoch - quantum gravity dominates',
      'Cosmic inflation expands spacetime',
      'First particles and antiparticles form',
      'Nucleosynthesis creates light elements'
    ],
    color: '#1e293b',
    gradient: 'from-slate-800 via-slate-700 to-slate-900',
    image: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=600&fit=crop&auto=format'
  },
  {
    id: 'stellar-formation',
    title: 'First Light',
    subtitle: 'Stars Illuminate the Void',
    description: 'Gravity sculpted the first massive stars from primordial hydrogen and helium. These stellar giants lived fast and died young, forging heavy elements in their nuclear cores.',
    era: 'Stellar Genesis',
    timeAgo: '13.6 Billion Years Ago',
    keyPoints: [
      'Population III stars ignite',
      'Nuclear fusion creates heavier elements',
      'Supernovae seed space with metals',
      'First galaxies begin to form'
    ],
    color: '#0f172a',
    gradient: 'from-slate-900 via-slate-800 to-gray-900',
    image: 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=800&h=600&fit=crop&auto=format'
  },
  {
    id: 'solar-formation',
    title: 'Our Star System',
    subtitle: 'From Nebula to Planetary System',
    description: 'A molecular cloud collapsed under its own gravity, igniting our Sun. The remaining disk of gas and dust gradually assembled into the planets, moons, and asteroids of our solar system.',
    era: 'Solar System Birth',
    timeAgo: '4.6 Billion Years Ago',
    keyPoints: [
      'Solar nebula gravitational collapse',
      'Protoplanetary disk formation',
      'Planetary accretion begins',
      'Late Heavy Bombardment shapes worlds'
    ],
    color: '#020617',
    gradient: 'from-slate-950 via-gray-900 to-slate-900',
    image: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=800&h=600&fit=crop&auto=format'
  },
  {
    id: 'formation',
    title: 'Planetary Genesis',
    subtitle: 'Earth Forms from Cosmic Debris',
    description: 'Countless planetesimals collided to build our world, generating immense heat. A Mars-sized impactor created the Moon, while volcanic outgassing began forming our first atmosphere.',
    era: 'Hadean Eon',
    timeAgo: '4.6 - 4.0 Billion Years Ago',
    keyPoints: [
      'Accretion creates proto-Earth',
      'Giant impact forms the Moon',
      'Magma ocean solidifies',
      'Water vapor condenses into oceans'
    ],
    color: '#0c0a09',
    gradient: 'from-stone-950 via-slate-950 to-gray-950',
    image: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=600&fit=crop&auto=format'
  },
  {
    id: 'archean',
    title: 'Life Awakens',
    subtitle: 'First Organisms Emerge',
    description: 'In warm, shallow seas, the first self-replicating molecules evolved into primitive cells. These early microbes began photosynthesis, forever changing our planet\'s chemistry.',
    era: 'Archean Eon',
    timeAgo: '4.0 - 2.5 Billion Years Ago',
    keyPoints: [
      'RNA world gives way to DNA life',
      'Prokaryotic cells dominate oceans',
      'Cyanobacteria evolve photosynthesis',
      'Stromatolites preserve ancient life'
    ],
    color: '#030712',
    gradient: 'from-gray-950 via-slate-950 to-stone-950',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop&auto=format'
  },
  {
    id: 'proterozoic',
    title: 'Oxygen Revolution',
    subtitle: 'Atmosphere Transforms',
    description: 'Photosynthetic bacteria flooded the atmosphere with oxygen, triggering Earth\'s first mass extinction. This toxic gas became the foundation for complex, oxygen-breathing life.',
    era: 'Proterozoic Eon',
    timeAgo: '2.5 - 0.54 Billion Years Ago',
    keyPoints: [
      'Great Oxidation Event transforms atmosphere',
      'Eukaryotic cells with nuclei evolve',
      'Snowball Earth ice ages occur',
      'Sexual reproduction develops'
    ],
    color: '#020617',
    gradient: 'from-slate-950 via-gray-950 to-stone-950',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop&auto=format'
  },
  {
    id: 'cambrian',
    title: 'Evolutionary Explosion',
    subtitle: 'Complex Life Emerges',
    description: 'In just 25 million years, life exploded into incredible diversity. Eyes evolved, predators emerged, and the arms race between hunter and prey began in earnest.',
    era: 'Cambrian Explosion',
    timeAgo: '541 - 485 Million Years Ago',
    keyPoints: [
      'Camera eyes evolve independently',
      'Mineralized shells and skeletons appear',
      'Predation drives evolutionary arms race',
      'All major animal body plans established'
    ],
    color: '#0c0a09',
    gradient: 'from-stone-950 via-slate-950 to-gray-950',
    image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&h=600&fit=crop&auto=format'
  },
  {
    id: 'ordovician',
    title: 'Marine Dominance',
    subtitle: 'Seas Teem with Life',
    description: 'Marine ecosystems reached new levels of complexity. Coral reefs flourished, cephalopods ruled as apex predators, and the first vertebrates with jaws evolved.',
    era: 'Ordovician Period',
    timeAgo: '485 - 444 Million Years Ago',
    keyPoints: [
      'Great Ordovician Biodiversification',
      'First coral reefs form',
      'Nautiloid cephalopods dominate',
      'Ordovician-Silurian extinction event'
    ],
    color: '#030712',
    gradient: 'from-gray-950 via-slate-950 to-stone-950',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop&auto=format'
  },
  {
    id: 'devonian',
    title: 'Age of Fishes',
    subtitle: 'Life Conquers Land',
    description: 'The first forests transformed barren landscapes while armored fish ruled the seas. Tetrapods took their first steps on land, beginning the vertebrate conquest of terrestrial environments.',
    era: 'Devonian Period',
    timeAgo: '419 - 359 Million Years Ago',
    keyPoints: [
      'First seed plants and forests evolve',
      'Armored placoderm fish dominate',
      'Tetrapods evolve from lobe-finned fish',
      'Late Devonian extinction reduces diversity'
    ],
    color: '#020617',
    gradient: 'from-slate-950 via-gray-950 to-stone-950',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop&auto=format'
  },
  {
    id: 'carboniferous',
    title: 'Coal Forest Era',
    subtitle: 'Oxygen-Rich World',
    description: 'Vast swamp forests covered the land, eventually forming coal deposits. High oxygen levels allowed giant insects to thrive, while the first reptiles evolved from amphibians.',
    era: 'Carboniferous Period',
    timeAgo: '359 - 299 Million Years Ago',
    keyPoints: [
      'Extensive coal swamp forests',
      'Oxygen levels reach 35%',
      'Giant arthropods evolve',
      'First reptiles appear'
    ],
    color: '#0c0a09',
    gradient: 'from-stone-950 via-slate-950 to-gray-950',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop&auto=format'
  },
  {
    id: 'permian',
    title: 'The Great Dying',
    subtitle: 'Life\'s Greatest Crisis',
    description: 'The Siberian Traps erupted for millions of years, triggering the most severe extinction in Earth\'s history. 96% of marine species vanished, resetting the evolutionary clock.',
    era: 'Permian-Triassic',
    timeAgo: '299 - 201 Million Years Ago',
    keyPoints: [
      'Siberian Traps flood basalt eruptions',
      'Permian-Triassic extinction event',
      '96% of marine species extinct',
      'Archosaurs begin to diversify'
    ],
    color: '#030712',
    gradient: 'from-gray-950 via-slate-950 to-stone-950',
    image: 'https://images.unsplash.com/photo-1541872703-74c5e44368e6?w=800&h=600&fit=crop&auto=format'
  },
  {
    id: 'mesozoic',
    title: 'Age of Reptiles',
    subtitle: 'Dinosaurs Rule the Earth',
    description: 'From the ashes of the Great Dying, dinosaurs rose to dominate land, sea, and sky. Flowering plants evolved, transforming terrestrial ecosystems and co-evolving with insects.',
    era: 'Mesozoic Era',
    timeAgo: '252 - 66 Million Years Ago',
    keyPoints: [
      'Dinosaurs diversify and dominate',
      'First mammals appear',
      'Flowering plants (angiosperms) evolve',
      'Pangaea breaks apart'
    ],
    color: '#020617',
    gradient: 'from-slate-950 via-gray-950 to-stone-950',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop&auto=format'
  },
  {
    id: 'cretaceous-extinction',
    title: 'Asteroid Impact',
    subtitle: 'End of the Dinosaur Age',
    description: 'A 10-kilometer asteroid struck the Yucatan Peninsula, ending the reign of non-avian dinosaurs. This catastrophe opened ecological niches for mammals to diversify and eventually dominate.',
    era: 'K-Pg Extinction',
    timeAgo: '66 Million Years Ago',
    keyPoints: [
      'Chicxulub asteroid impact',
      'Global firestorms and nuclear winter',
      'Non-avian dinosaurs extinct',
      'Mammalian radiation begins'
    ],
    color: '#0c0a09',
    gradient: 'from-stone-950 via-slate-950 to-gray-950',
    image: 'https://images.unsplash.com/photo-1541872703-74c5e44368e6?w=800&h=600&fit=crop&auto=format'
  },
  {
    id: 'cenozoic',
    title: 'Age of Mammals',
    subtitle: 'Rise of Modern Life',
    description: 'Mammals rapidly diversified to fill empty ecological niches. Grasses evolved, creating new ecosystems. Climate cooled, ice ages began, and eventually, primates appeared.',
    era: 'Cenozoic Era',
    timeAgo: '66 Million Years Ago - Present',
    keyPoints: [
      'Mammalian adaptive radiation',
      'Grasses and grasslands evolve',
      'Global cooling and ice ages',
      'Primate evolution begins'
    ],
    color: '#030712',
    gradient: 'from-gray-950 via-slate-950 to-stone-950',
    image: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=800&h=600&fit=crop&auto=format'
  },
  {
    id: 'human-evolution',
    title: 'Rise of Intelligence',
    subtitle: 'From Apes to Civilization',
    description: 'In Africa, apes descended from trees and began walking upright. Larger brains evolved, tools were crafted, and language developed, leading to the emergence of modern humans.',
    era: 'Human Evolution',
    timeAgo: '7 Million Years Ago - Present',
    keyPoints: [
      'Bipedalism evolves in hominins',
      'Brain size increases dramatically',
      'Stone tool technology develops',
      'Homo sapiens emerges in Africa'
    ],
    color: '#020617',
    gradient: 'from-slate-950 via-gray-950 to-stone-950',
    image: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=800&h=600&fit=crop&auto=format'
  },
  {
    id: 'anthropocene',
    title: 'Human Dominance',
    subtitle: 'Civilization Transforms Earth',
    description: 'Agriculture enabled permanent settlements and population growth. The Industrial Revolution accelerated human impact, making our species a geological force comparable to volcanoes and glaciers.',
    era: 'Anthropocene',
    timeAgo: '12,000 Years Ago - Present',
    keyPoints: [
      'Agricultural revolution begins',
      'Cities and civilizations emerge',
      'Industrial Revolution transforms society',
      'Human impact rivals geological forces'
    ],
    color: '#0c0a09',
    gradient: 'from-stone-950 via-slate-950 to-gray-950',
    image: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=800&h=600&fit=crop&auto=format',
    cta: {
      text: 'Explore Earth Today',
      action: () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }
];