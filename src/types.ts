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

export interface ServiceOffered {
  name: string;
  description?: string;
}

export interface Affiliation {
  id: string;
  partnerName: string;
  collaborationTitle: string;
  description: string;
  services: ServiceOffered[];
  logoUrl: string;
  imageUrls: string[];
}
