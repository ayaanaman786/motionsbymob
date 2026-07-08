import React, { useState } from 'react';
import { GALLERY_ITEMS } from '../data';
import { GalleryItem } from '../types';
import { Play, Maximize2, X, Film, Info, Calendar } from 'lucide-react';
import GalleryCard from './GalleryCard';

export default function Gallery() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'feature' | 'oem' | 'cinematic' | 'detail'>('all');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Filter gallery items based on click state
  const filteredItems = activeFilter === 'all' 
    ? GALLERY_ITEMS 
    : GALLERY_ITEMS.filter(item => item.category === activeFilter);

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
        <div className="border-b border-white/10 pb-8 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="outfit-editorial text-[11px] text-[#ff2a2a] mb-2 uppercase">
              [ EST_02 // THE WORK ]
            </div>
            <h2 
              className="brutal text-3xl md:text-5xl tracking-tighter text-white uppercase font-black"
            >
              Film Archive<span className="text-[#ff2a2a]">.</span>
            </h2>
          </div>

          {/* Minimalist Filter Navigation */}
          <div className="flex flex-wrap gap-2 md:gap-4">
            {(['all', 'feature', 'oem', 'cinematic', 'detail'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`py-2 px-4 border text-[11px] tracking-widest transition-all duration-300 cursor-pointer uppercase outfit-editorial ${
                  activeFilter === filter
                    ? 'bg-[#ff2a2a] border-[#ff2a2a] text-white shadow-[0_0_10px_rgba(165,0,0,0.4)]'
                    : 'bg-black/40 border-white/10 text-gray-400 hover:text-white hover:border-white/30'
                }`}
              >
                {filter === 'all' ? 'ALL ARCHIVES' : `${filter}S`}
              </button>
            ))}
          </div>
        </div>

        {/* CSS Grid Gallery (Highly Performant, Mobile-First Stacking) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredItems.map((item) => (
            <GalleryCard 
              key={item.id}
              item={item}
              onClick={() => setSelectedItem(item)}
            />
          ))}
        </div>

        {/* Empty State if no filters matched */}
        {filteredItems.length === 0 && (
          <div className="text-center py-20 border border-white/10 bg-zinc-900/40">
            <Film className="w-10 h-10 text-gray-600 mx-auto mb-4" />
            <p className="outfit-editorial text-[11px] text-gray-400 uppercase">No files logged under this classification.</p>
          </div>
        )}

      </div>

      {/* Cinematic Modal (Lightbox / Video Frame player) */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 cursor-pointer" 
            onClick={() => setSelectedItem(null)} 
          />
          
          <div className="relative w-full max-w-5xl bg-[#090909] border border-white/10 z-10 flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden">
            
            {/* Modal Header */}
            <div className="bg-black p-4 md:px-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="outfit-editorial text-[11px] text-zinc-400">
                  [ ARCHIVE_ID: {selectedItem.id} ]
                </span>
                <span className="hidden sm:inline-block h-4 w-[1px] bg-white/10" />
                <span className="outfit-editorial text-[11px] text-[#ff2a2a] font-semibold uppercase bg-[#ff2a2a]/10 px-2 py-0.5 border border-[#ff2a2a]/30">
                  {getCategoryLabel(selectedItem.category)}
                </span>
              </div>
              <button 
                onClick={() => setSelectedItem(null)}
                className="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="grid grid-cols-1 lg:grid-cols-12">
              
              {/* Media View Frame */}
              <div className="lg:col-span-8 bg-black aspect-video relative flex items-center justify-center">
                {selectedItem.videoUrl ? (
                  /* YouTube/Vimeo embed frame */
                  <iframe
                    src={`${selectedItem.videoUrl}?autoplay=1&mute=1&loop=1`}
                    title={selectedItem.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full border-0"
                  />
                ) : (
                  /* Fallback to inspect high contrast photo */
                  <div className="absolute inset-0 group">
                    <img 
                      src={selectedItem.imageUrl} 
                      alt={selectedItem.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-60" />
                    <button 
                      onClick={() => setIsFullscreen(true)}
                      className="absolute inset-0 w-full h-full flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-zoom-in"
                    >
                      <div className="bg-black/90 border border-white/20 px-6 py-3 flex items-center gap-3">
                        <Maximize2 className="w-5 h-5 text-white" />
                        <span className="outfit-editorial text-[11px] text-white tracking-widest uppercase">Fullscreen Inspect</span>
                      </div>
                    </button>
                    <div className="absolute bottom-4 left-4 bg-black/80 px-3 py-1 border border-white/10 outfit-editorial text-[11px] text-gray-300 pointer-events-none">
                      SIMULATED INTERACTIVE VIEW // PRE-RENDER
                    </div>
                  </div>
                )}
              </div>

              {/* Technical File Specifications side panel */}
              <div className="lg:col-span-4 p-6 md:p-8 flex flex-col justify-between bg-black border-t lg:border-t-0 lg:border-l border-white/10">
                <div>
                  <div className="mb-6">
                    <div className="outfit-editorial text-[11px] text-[#ff2a2a] uppercase mb-1">
                      {selectedItem.carModel}
                    </div>
                    <h3 
                      className="brutal text-2xl md:text-3xl text-white font-black uppercase"
                    >
                      {selectedItem.title}
                    </h3>
                  </div>

                  <p 
                    className="outfit-editorial text-xs text-zinc-400 leading-relaxed mb-8"
                  >
                    {selectedItem.subtitle}
                  </p>

                  <div className="space-y-4 border-t border-white/10 pt-6">
                    <div className="flex justify-between items-center text-xs">
                      <span className="outfit-editorial text-[11px] text-zinc-400">CLASSIFICATION:</span>
                      <span className="outfit-editorial text-[11px] text-white font-semibold uppercase">{selectedItem.category}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="outfit-editorial text-[11px] text-zinc-400">CHASSIS / ENGINE:</span>
                      <span className="outfit-editorial text-[11px] text-white font-semibold uppercase">{selectedItem.carModel}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="outfit-editorial text-[11px] text-zinc-400">RELEASE CYCLE:</span>
                      <span className="outfit-editorial text-[11px] text-white font-semibold uppercase">{selectedItem.year}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="outfit-editorial text-[11px] text-zinc-400">SOURCE ACQUISITION:</span>
                      <span className="outfit-editorial text-[11px] text-[#ff2a2a] font-bold">8K COMPRESSED LOG</span>
                    </div>
                  </div>
                </div>

                <div className="mt-12 pt-6 border-t border-white/10 flex gap-4">
                  <button 
                    onClick={() => {
                      setSelectedItem(null);
                      const el = document.getElementById('contact');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="flex-1 py-3 bg-[#ff2a2a] hover:bg-[#ff4d4d] text-white outfit-editorial text-[11px] uppercase transition-all duration-300 text-center cursor-pointer"
                  >
                    ACQUIRE FOR PROJECT
                  </button>
                </div>

              </div>

            </div>
          </div>
        </div>
      )}

      {/* True Fullscreen Uncropped Image Viewer */}
      {isFullscreen && selectedItem && !selectedItem.videoUrl && (
        <div className="fixed inset-0 z-[60] bg-black flex items-center justify-center p-4 md:p-12 animate-fade-in">
          <div 
            className="absolute inset-0 cursor-zoom-out" 
            onClick={() => setIsFullscreen(false)} 
          />
          <img 
            src={selectedItem.imageUrl} 
            alt={selectedItem.title} 
            className="relative z-10 w-full h-full object-contain pointer-events-none drop-shadow-[0_0_50px_rgba(255,42,42,0.15)]"
            referrerPolicy="no-referrer"
          />
          <button 
            onClick={() => setIsFullscreen(false)}
            className="absolute top-6 right-6 z-20 text-white/50 hover:text-white bg-black/50 hover:bg-black p-3 rounded-full transition-all duration-300 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
          
          {/* Subtle Telemetry Overlay */}
          <div className="absolute bottom-6 left-6 z-20 outfit-editorial text-[11px] text-zinc-500 tracking-widest uppercase pointer-events-none">
            [ RAW DATA // FULLSCALE UNCOMPRESSED ]
          </div>
        </div>
      )}
    </section>
  );
}
