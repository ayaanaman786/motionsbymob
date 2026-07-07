import React, { useRef, useState, useEffect } from 'react';
import { GalleryItem } from '../types';
import { Play, Maximize2 } from 'lucide-react';

interface GalleryCardProps {
  key?: React.Key;
  item: GalleryItem;
  onClick: () => void;
}

export default function GalleryCard({ item, onClick }: GalleryCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [blurAmount, setBlurAmount] = useState(0);
  const [focusPercentage, setFocusPercentage] = useState(100);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const calculateDoF = () => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Calculate center coordinates
      const cardCenterY = rect.top + rect.height / 2;
      const viewportCenterY = viewportHeight / 2;
      
      // Distance from center
      const distanceFromCenter = Math.abs(cardCenterY - viewportCenterY);
      
      // Normalized screen distance (0 at center, up to 1.0 at outer viewport boundaries)
      const maxDistance = (viewportHeight + rect.height) / 2;
      const progress = Math.min(1, distanceFromCenter / maxDistance);
      
      // Set lens focus curve (keep a 20% center "sweet spot" fully sharp)
      let currentBlur = 0;
      if (progress > 0.2) {
        const blurFactor = (progress - 0.2) / 0.8;
        // Maximum optical aberration blur (up to 7.0 pixels of screen defocus)
        currentBlur = blurFactor * 7.0;
      }
      
      // Focus scale drops as distance increases
      const currentFocus = Math.max(20, Math.round(100 - progress * 80));
      
      setBlurAmount(currentBlur);
      setFocusPercentage(currentFocus);
    };

    // Run once on load
    calculateDoF();

    // Listen to scroll and resize
    window.addEventListener('scroll', calculateDoF, { passive: true });
    window.addEventListener('resize', calculateDoF, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', calculateDoF);
      window.removeEventListener('resize', calculateDoF);
    };
  }, []);

  // Determine active optical values
  // Hovering simulates a mechanical focus puller locking onto the element, pulling focus instantly to 100%
  const activeBlur = isHovered ? 0 : blurAmount;
  const activeFocus = isHovered ? 100 : focusPercentage;

  return (
    <div 
      ref={cardRef}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group bg-[#090909] border border-white/10 hover:border-[#a50000]/40 transition-all duration-500 cursor-pointer overflow-hidden flex flex-col relative"
    >
      {/* Outer visual bounding box */}
      <div className="aspect-[16/10] overflow-hidden relative bg-black">
        {/* Image plate with real-time blur/grayscale filters and custom easing transition */}
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
          style={{
            filter: `grayscale(${isHovered ? 0 : 0.85}) blur(${activeBlur.toFixed(2)}px)`,
            transition: isHovered 
              ? 'filter 0.45s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)' 
              : 'filter 0.15s ease-out, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          referrerPolicy="no-referrer"
        />

        {/* Dark atmospheric visual filters */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent opacity-80 group-hover:opacity-40 transition-opacity duration-500 z-10" />

        {/* Cinematic Letterbox effect on hover (simulates movie ratio cropping) */}
        <div className="absolute inset-x-0 top-0 h-0 group-hover:h-3 bg-black transition-all duration-300 z-20 border-b border-white/10" />
        <div className="absolute inset-x-0 bottom-0 h-0 group-hover:h-3 bg-black transition-all duration-300 z-20 border-t border-white/10" />

        {/* Micro trigger overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
          <div className="w-12 h-12 bg-black/80 border border-[#a50000] rounded-full flex items-center justify-center text-white shadow-[0_0_15px_#a50000]">
            {item.videoUrl ? <Play className="w-5 h-5 fill-white ml-0.5" /> : <Maximize2 className="w-5 h-5 text-white" />}
          </div>
        </div>

        {/* Decorative Tech Corners */}
        <div className="absolute top-4 left-4 outfit-editorial text-[8px] text-zinc-500 z-10 opacity-80 group-hover:opacity-0 transition-opacity duration-300">
          [REEL_0{item.id.slice(-1)}]
        </div>
        <div className="absolute top-4 right-4 bg-black/60 px-2 py-0.5 border border-white/10 outfit-editorial text-[8px] text-zinc-300 uppercase z-10">
          {item.category}
        </div>

        {/* Real-time Cinematic Lens HUD overlay (Dynamic Telemetry) */}
        <div className="absolute bottom-3 inset-x-4 z-20 flex justify-between items-center transition-all duration-300 pointer-events-none select-none">
          {/* Static state readout */}
          <div 
            className="bg-black/75 border border-white/10 px-2 py-0.5 rounded-sm outfit-editorial text-[7px] text-zinc-400 font-mono flex items-center gap-1.5 transition-all duration-300"
            style={{ 
              opacity: isHovered ? 0 : 1,
              transform: isHovered ? 'translateY(5px)' : 'translateY(0)'
            }}
          >
            <span className={`w-1 h-1 rounded-full ${activeFocus > 80 ? 'bg-green-500' : 'bg-[#a50000] animate-pulse'}`} />
            FOCUS: {activeFocus}%
          </div>
          <div 
            className="bg-black/75 border border-white/10 px-2 py-0.5 rounded-sm outfit-editorial text-[7px] text-zinc-400 font-mono transition-all duration-300"
            style={{ 
              opacity: isHovered ? 0 : 1,
              transform: isHovered ? 'translateY(5px)' : 'translateY(0)'
            }}
          >
            DoF: {activeBlur.toFixed(1)}px
          </div>

          {/* Active Hover readout (Focus rack confirmed) */}
          <div 
            className="absolute inset-x-0 flex justify-between items-center transition-all duration-300"
            style={{ 
              opacity: isHovered ? 1 : 0,
              transform: isHovered ? 'translateY(0)' : 'translateY(-5px)'
            }}
          >
            <div className="bg-black/80 border border-[#a50000]/30 px-2 py-0.5 rounded-sm outfit-editorial text-[7px] text-white font-mono flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#a50000]" />
              OPTICS LOCK // REC
            </div>
            <div className="bg-black/80 border border-[#a50000]/30 px-2 py-0.5 rounded-sm outfit-editorial text-[7px] text-white font-mono">
              F/1.4 PIN-SHARP
            </div>
          </div>
        </div>
      </div>

      {/* Text Meta Fields */}
      <div className="p-6 flex-grow flex flex-col justify-between border-t border-white/10 relative bg-black/20">
        {/* Custom left red glow dot */}
        <div className="absolute top-0 left-6 w-8 h-[2px] bg-[#a50000] transform -translate-y-1/2 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="outfit-editorial text-[9px] text-zinc-400 uppercase">
              {item.carModel}
            </span>
            <span className="outfit-editorial text-[9px] text-[#a50000] font-semibold">
              {item.year}
            </span>
          </div>

          <h3 
            className="brutal text-lg tracking-tight text-white group-hover:text-[#a50000] transition-colors duration-300 uppercase"
          >
            {item.title}
          </h3>

          <p 
            className="outfit-editorial text-xs text-zinc-400 mt-2 line-clamp-2"
          >
            {item.subtitle}
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[8px] outfit-editorial text-zinc-500 uppercase">
          <span>CLIP_ID: {item.id}</span>
          <span className="text-zinc-300 group-hover:text-white transition-colors duration-300 flex items-center gap-1">
            INSPECT ARCHIVE <Maximize2 className="w-2.5 h-2.5" />
          </span>
        </div>
      </div>
    </div>
  );
}
