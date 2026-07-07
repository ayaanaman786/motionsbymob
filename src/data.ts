import { GalleryItem, ManifestoParagraph, NavigationLink } from './types';

export const NAVIGATION_LINKS: NavigationLink[] = [
  { label: 'MANIFESTO', href: '#manifesto' },
  { label: 'ABOUT', href: '#about' },
  { label: 'COLOR DESK', href: '#colorist' },
  { label: 'REELS & FILMS', href: '#gallery' },
  { label: 'EXHAUST CONSOLE', href: '#exhaust-console' },
  { label: 'CONNECT', href: '#contact' },
];

export const MANIFESTO_PARAGRAPHS: ManifestoParagraph[] = [
  {
    highlight: "UNDERSTATED POWER. UNIFIED PRESENCE.",
    body: "We focus exclusively on clean luxury SUV culture. We capture the imposing silhouettes of Land Cruisers, Range Rovers, and Patrols, framed in high-contrast cinematic glory. We do not participate in cheap visual stunts."
  },
  {
    highlight: "A SEAMLESS SILHOUETTE OF GLASS AND METAL.",
    body: "The curves of factory-designed engineering are flawless. Our cameras trace the exact lines laid down by master artisans. Every shot is a study in weight, proportion, and motion."
  },
  {
    highlight: "QUIET AUTHORITY. NO LOUD WRAPS. NO RACING DECALS.",
    body: "We reject the chaotic noise of attention-seeking modifications. True power does not need to yell. It is built in the OEM+ details, the blacked-out chrome, the factory-correct stance, and the pure darkness of metallic paints."
  },
  {
    highlight: "WE DO NOT COMPETE FOR ATTENTION. WE SIMPLY COMMAND IT.",
    body: "Our films do not feature frantic quick-cuts or aggressive overlays. We capture the unyielding gravity of premium vehicles cruising under low-angle suns or parked in deep concrete monoliths."
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'film-01',
    title: 'THE MONOLITH',
    subtitle: 'A study of the L322 in brutalist concrete',
    imageUrl: '/images/black_revo.webp',
    videoUrl: '',
    category: 'feature',
    carModel: 'Toyota Revo Black',
    year: '2026'
  },
  {
    id: 'film-02',
    title: 'CHROME BLACKOUT',
    subtitle: 'OEM+ trim alignment and dark metallic reflections',
    imageUrl: '/images/80_road.webp',
    videoUrl: '',
    category: 'detail',
    carModel: 'Land Cruiser 80 Series',
    year: '2025'
  },
  {
    id: 'film-03',
    title: 'THE OUTLAW V8',
    subtitle: 'Uncompromising power cutting through rain-swept docks',
    imageUrl: '/images/IMG_2004.JPG.webp',
    category: 'cinematic',
    carModel: 'Mercedes-Benz G63',
    year: '2026'
  },
  {
    id: 'film-04',
    title: 'DESERT PATROL',
    subtitle: 'Understated dominance over rolling dunes at dusk',
    imageUrl: '/images/80_dirt.webp',
    category: 'oem',
    carModel: 'Land Cruiser 80 Series',
    year: '2026'
  },
  {
    id: 'film-05',
    title: 'TAILLIGHT GLOW',
    subtitle: 'The menacing rear profile under high-contrast spotlight',
    imageUrl: '/images/merc_rose.webp',
    category: 'detail',
    carModel: 'Mercedes Rose',
    year: '2025'
  },
  {
    id: 'film-06',
    title: 'DUSK ENFORCER',
    subtitle: 'Wide stance presence cruising the dark harbor line',
    imageUrl: '/images/IMG_4356.JPG.webp',
    category: 'cinematic',
    carModel: 'Toyota Land Cruiser LC200 V8',
    year: '2026'
  },
  {
    id: 'film-07',
    title: 'KINETIC PURSUIT',
    subtitle: 'Motion tracking on asphalt',
    imageUrl: '/images/80_moving.webp',
    category: 'feature',
    carModel: 'Land Cruiser 80 Series',
    year: '2026'
  },
  {
    id: 'film-08',
    title: 'TERRAIN DOMINANCE',
    subtitle: 'Unforgiving environmental conditions',
    imageUrl: '/images/80_mud.webp',
    category: 'cinematic',
    carModel: 'Land Cruiser 80 Series',
    year: '2026'
  },
  {
    id: 'film-09',
    title: 'STREET PRESENCE',
    subtitle: 'Urban camouflage and dark aesthetics',
    imageUrl: '/images/IMG_3362.JPG.webp',
    category: 'oem',
    carModel: 'Toyota Land Cruiser',
    year: '2025'
  },
  {
    id: 'film-10',
    title: 'NIGHT CRAWLER',
    subtitle: 'Ambient street lighting reflection',
    imageUrl: '/images/IMG_5247.JPG.webp',
    category: 'detail',
    carModel: 'Unknown',
    year: '2026'
  },
  {
    id: 'film-11',
    title: 'HEAVY METAL',
    subtitle: 'Industrial backdrop setting',
    imageUrl: '/images/IMG_5621.webp',
    category: 'cinematic',
    carModel: 'Unknown',
    year: '2026'
  },
  {
    id: 'film-12',
    title: 'SIDE PROFILE',
    subtitle: 'Aerodynamic flow and rigid lines',
    imageUrl: '/images/prado_mirror.webp',
    category: 'detail',
    carModel: 'Toyota Prado',
    year: '2025'
  },
  {
    id: 'film-13',
    title: 'THE VANGUARD',
    subtitle: 'Front fascia aggression',
    imageUrl: '/images/revo_1.webp',
    category: 'feature',
    carModel: 'Toyota Revo',
    year: '2026'
  },
  {
    id: 'film-14',
    title: 'TACTICAL STANCE',
    subtitle: 'Suspension and wheel gap perfection',
    imageUrl: '/images/revo_2.webp',
    category: 'oem',
    carModel: 'Toyota Revo',
    year: '2026'
  },
  {
    id: 'film-15',
    title: 'NIGHT VISION',
    subtitle: 'Low light optics calibration',
    imageUrl: '/images/revo_3.webp',
    category: 'cinematic',
    carModel: 'Toyota Revo',
    year: '2026'
  }
];
