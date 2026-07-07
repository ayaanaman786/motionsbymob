import React, { useState } from 'react';
import MOBLogo from './MOBLogo';
import KineticType from './KineticType';
import { Play, Volume2, VolumeX, ChevronDown } from 'lucide-react';

export default function Hero() {
  const [muted, setMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black flex flex-col justify-between select-none">
      {/* Background Visual Plate (Atmospheric and Cinematic zoom) */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Dark overlay gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black z-10" />
        <div className="absolute inset-0 bg-black/20 z-10" />
        
        {/* Subtle scanline overlay for camera viewfinder vibe */}
        <div className="absolute inset-0 scanlines z-10" />

        {/* Ambient Dark SUV Visual Plate */}
        <img
          src="/images/IMG_5621.webp"
          alt="Cinematic Black Revo Silhoutte"
          className="w-full h-full object-cover object-center scale-105 animate-ambient transition-transform duration-[10000ms]"
          referrerPolicy="no-referrer"
        />
        
        {/* Subtle horizontal red laser lens flare in background */}
        <div className="absolute top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[2px] bg-[#a50000] opacity-40 z-10 blur-[1px]">
          <div className="absolute inset-0 w-full h-[6px] -top-[2px] bg-[#a50000] blur-md opacity-60" />
        </div>
      </div>

      {/* Cinematic Top Letterbox */}
      <div className="w-full h-8 md:h-12 bg-black z-20 border-b border-white/10 flex items-center justify-between px-4 md:px-8 outfit-editorial text-[10px] text-gray-500 uppercase">
        <div>SYS_ONLINE // MOTIONS BY MOB</div>
        <div className="hidden sm:block text-right">OEM+ AUTOMOTIVE VIDEOGRAPHY</div>
        <div className="block sm:hidden text-right">M.O.B. REELS</div>
      </div>

      {/* Main Hero Content Frame */}
      <div className="relative z-20 flex-grow flex flex-col items-center justify-center px-4 pt-28 md:pt-36 pb-12">
        <div className="max-w-5xl w-full flex flex-col items-center">
          
          {/* Main Logo Container with a subtle fade-in and hover lift */}
          <div className="transform hover:scale-[1.01] transition-transform duration-700 ease-out mb-6">
            <MOBLogo variant="full" className="drop-shadow-[0_10px_25px_rgba(0,0,0,0.95)]" />
          </div>

          {/* Key Brand Copy - Scroll-Linked Kinetic Typography */}
          <KineticType />



        </div>
      </div>

      {/* Cinematic Bottom Letterbox */}
      <div className="w-full h-14 bg-black z-20 border-t border-white/10 flex items-center justify-between px-4 md:px-8">
        {/* Left Side: Video Loop Indicator */}
        <div className="flex items-center gap-3">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#a50000] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#a50000]"></span>
          </span>
          <span className="outfit-editorial text-[9px] text-gray-400 uppercase">
            LIVE FEED // ACTIVE PREVIEW
          </span>
        </div>

        {/* Center: Scroll Prompt */}
        <button 
          onClick={() => handleScrollTo('manifesto')}
          className="flex flex-col items-center text-gray-500 hover:text-[#a50000] transition-colors duration-300 cursor-pointer pl-6 sm:pl-0"
        >
          <span className="outfit-editorial text-[8px] uppercase mb-0.5">SCROLL TO ENTER</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </button>

        {/* Right Side: Aspect Ratio Badge */}
        <div className="outfit-editorial text-[9px] text-gray-500">
          2.39:1 CINEMATIC FRAME
        </div>
      </div>
    </section>
  );
}
