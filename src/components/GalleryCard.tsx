import React, { useState } from 'react';
import { GalleryItem } from '../types';
import { Play, Maximize2 } from 'lucide-react';

interface GalleryCardProps {
  key?: React.Key;
  item: GalleryItem;
  priority?: boolean;
  onClick: () => void;
}

export default function GalleryCard({ item, priority = false, onClick }: GalleryCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <div 
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`View ${item.title}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      className="group bg-[#090909] border border-white/10 hover:border-white/30 focus:border-white/30 focus:outline-none transition-all duration-500 cursor-pointer overflow-hidden flex flex-col relative"
    >
      {/* Outer visual bounding box */}
      <div className="aspect-[16/10] overflow-hidden relative bg-black transform-gpu">
        {/* Loading Skeleton */}
        {!isImageLoaded && (
          <div className="absolute inset-0 bg-zinc-900 animate-pulse z-0 flex items-center justify-center">
            <span className="outfit-editorial text-[9px] text-zinc-600 uppercase tracking-widest">Awaiting Optics...</span>
          </div>
        )}

        {/* Image plate with real-time blur/grayscale filters and custom easing transition */}
        <img
          src={item.imageUrl}
          alt={item.title}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          onLoad={() => setIsImageLoaded(true)}
          className={`w-full h-full object-cover scale-100 group-hover:scale-105 group-focus:scale-105 transition-transform duration-700 ease-out relative z-10 will-change-transform ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
          style={{
            filter: `grayscale(${isHovered ? 0 : 0.85})`,
            transition: 'filter 0.45s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          referrerPolicy="no-referrer"
        />

        {/* Dark atmospheric visual filters */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent opacity-80 group-hover:opacity-40 transition-opacity duration-500 z-10 pointer-events-none" />

        {/* Clean subtle trigger overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none">
          <div className="w-12 h-12 bg-black/60 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white">
            {item.videoUrl ? <Play className="w-5 h-5 fill-white ml-0.5" /> : <Maximize2 className="w-5 h-5 text-white" />}
          </div>
        </div>
      </div>

    </div>
  );
}
