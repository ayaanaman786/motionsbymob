export interface GalleryItem {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  videoUrl?: string; // Optional YouTube / Vimeo link or simulated video link
  category: 'feature' | 'oem' | 'cinematic' | 'detail';
  carModel: string;
  year: string;
}

export interface SpecItem {
  label: string;
  value: string;
  details?: string;
}

export interface ManifestoParagraph {
  highlight: string;
  body: string;
}

export interface NavigationLink {
  label: string;
  href: string;
}
