import React, { useState } from 'react';
import { GALLERY_ITEMS } from '../data';
import { GalleryItem } from '../types';
import { Play, Maximize2, X, Film, Info, Calendar } from 'lucide-react';
import GalleryCard from './GalleryCard';

export default function Gallery() {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'feature': return 'FEATURE CUT';
      case 'oem': return 'OEM+ SPEC';
      case 'cinematic': return 'CINEMATIC REEL';
      case 'detail': return 'CLOSE-UP STUDY';
      default: return 'FILM';
    }
  };

  return (
    <section id="gallery" className="bg-[#030303] py-24 md:py-32 px-4 md:px-8 relative border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        
        {/* Gallery Header */}
        <div className="border-b border-white/5 pb-12 mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <div className="outfit-editorial text-xs text-zinc-500 mb-4 uppercase tracking-[0.3em]">
              — THE ARCHIVE
            </div>
            <h2 
              className="brutal text-3xl md:text-5xl tracking-tight text-white uppercase font-light"
            >
              Film Archive.
            </h2>
          </div>

        </div>

        {/* CSS Grid Gallery (Highly Performant, Mobile-First Stacking) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {GALLERY_ITEMS.map((item, index) => (
            <GalleryCard 
              key={item.id}
              item={item}
              priority={index < 6}
              onClick={() => setSelectedItem(item)}
            />
          ))}
        </div>

      </div>

      {/* Pure Fullscreen Lightbox */}
      {selectedItem && (
        <div className="fixed inset-0 z-[60] bg-black flex items-center justify-center animate-fade-in">
          {/* Backdrop click to close */}
          <div 
            className="absolute inset-0 cursor-zoom-out" 
            onClick={() => setSelectedItem(null)} 
          />

          {/* Close Button */}
          <button 
            onClick={() => setSelectedItem(null)}
            className="absolute top-6 right-6 z-20 text-white/50 hover:text-white bg-black/50 hover:bg-black p-3 rounded-full transition-all duration-300 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Media Content */}
          <div className="relative z-10 w-full h-full flex items-center justify-center p-4 md:p-12 pointer-events-none">
            {selectedItem.videoUrl ? (
              <iframe
                src={`${selectedItem.videoUrl}?autoplay=1&mute=1&loop=1`}
                title={selectedItem.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full max-w-7xl aspect-video border-0 pointer-events-auto shadow-[0_0_50px_rgba(255,42,42,0.15)]"
              />
            ) : (
              <img 
                src={selectedItem.imageUrl} 
                alt={selectedItem.title} 
                className="w-full h-full object-contain drop-shadow-[0_0_50px_rgba(255,42,42,0.15)]"
                referrerPolicy="no-referrer"
              />
            )}
          </div>
          
          {/* Subtle Telemetry Overlay */}
          <div className="absolute bottom-6 left-6 z-20 outfit-editorial text-[11px] text-zinc-500 tracking-widest uppercase pointer-events-none">
            [ {selectedItem.title} // {selectedItem.carModel} ]
          </div>
        </div>
      )}
    </section>
  );
}
