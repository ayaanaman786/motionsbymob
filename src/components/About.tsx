import React from 'react';
import { Layers, Eye, Target } from 'lucide-react';

export default function About() {
  return (
    <section id="about" className="bg-[#050505] py-24 md:py-32 px-4 md:px-8 relative overflow-hidden border-t border-white/10">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-[#a50000]/3 rounded-full blur-[150px] pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-white/1 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        
        {/* Section Technical Header */}
        <div className="border-b border-white/10 pb-8 mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="outfit-editorial text-[10px] text-[#a50000] mb-2 uppercase tracking-widest font-bold">
              [ EST_02 // THE STUDIO & FOUNDER ]
            </div>
            <h2 className="brutal text-3xl md:text-5xl tracking-tighter text-white uppercase font-black">
              UNDERSTATED POWER<span className="text-[#a50000]">.</span>
            </h2>
          </div>
          <p className="outfit-editorial text-xs md:text-sm text-zinc-400 uppercase leading-relaxed max-w-md">
            Motions by MOB is a boutique creative syndicate. We do not shoot commercial ads. We create unyielding, permanent visual archives of pure automotive presence.
          </p>
        </div>

        {/* Studio DNA Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Heritage narrative & metrics */}
          <div className="lg:col-span-6 space-y-10">
            <div className="space-y-6">
              <span className="outfit-editorial text-[9px] text-zinc-500 uppercase tracking-wider block">
                [ THE MANIFESTO ]
              </span>
              <h3 className="brutal text-xl text-white tracking-tight uppercase">
                UNIFIED PRESENCE.
              </h3>
              <p className="outfit-editorial text-xs sm:text-sm text-zinc-300 leading-relaxed font-light">
                MOB is an exercise in quiet authority. Inspired by the clean luxury SUV culture of cities like Moscow and Dubai, we reject loud modifications in favor of OEM+ perfection. Our fleet is built on a single philosophy of simplicity, precision, and presence.
              </p>
              <p className="outfit-editorial text-xs sm:text-sm text-zinc-400 leading-relaxed font-light">
                When our vehicles arrive together, they create a seamless silhouette of glass and metal. We do not compete for attention. We simply command it.
              </p>
            </div>

            {/* Micro Technical counters */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
              <div className="bg-black/40 border border-white/5 p-4 relative">
                <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-[#a50000]/40 rounded-full m-3" />
                <span className="font-mono text-xl md:text-3xl text-white font-bold block">
                  6M+
                </span>
                <span className="outfit-editorial text-[8px] text-zinc-500 uppercase tracking-widest mt-1 block">
                  TOTAL ARCHIVE VIEWS
                </span>
              </div>

              <div className="bg-black/40 border border-white/5 p-4 relative">
                <span className="font-mono text-xl md:text-3xl text-[#a50000] font-bold block">
                  700K+
                </span>
                <span className="outfit-editorial text-[8px] text-zinc-500 uppercase tracking-widest mt-1 block">
                  AUTHENTIC LIKES
                </span>
              </div>
            </div>

            {/* Collaborations */}
            <div className="pt-6 border-t border-white/10">
              <span className="outfit-editorial text-[9px] text-zinc-500 uppercase tracking-wider block mb-4">
                [ COLLABORATIONS ]
              </span>
              <div className="flex flex-wrap gap-3">
                {['FIORE', 'ELEVEN DETAILING STUDIO', 'THE VOWS'].map(collab => (
                  <span key={collab} className="px-3 py-1.5 bg-black/40 border border-white/10 text-zinc-400 text-[10px] outfit-editorial tracking-widest">
                    {collab}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Profile Distorted Effect Module */}
          <div className="lg:col-span-6 bg-[#090909]/80 border border-white/10 p-6 sm:p-8 relative cursor-crosshair">
            <div className="absolute top-0 right-0 h-[2px] w-24 bg-[#a50000]" />
            
            <div className="flex items-center justify-between mb-6 relative z-10">
              <span className="outfit-editorial text-[9px] text-[#a50000] uppercase tracking-widest font-bold">
                [ FOUNDER // SYNDICATE LEAD ]
              </span>
              <span className="outfit-editorial text-[8px] text-zinc-500 font-mono">
                MOHIB_01
              </span>
            </div>

            {/* Profile Image Container with Hover Distortion Effect */}
            <div className="relative w-full aspect-[4/5] bg-black mb-6 overflow-hidden border border-white/5 group">
              {/* Base Image */}
              <img 
                src="/images/mohib_profile.webp" 
                alt="Mohib - Founder of MOB" 
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-out z-10 group-hover:opacity-0"
              />
              {/* Distorted Image (Revealed on Hover) */}
              <img 
                src="/images/mohib_profile_distorted.webp" 
                alt="Mohib Distorted Artistic Portrait" 
                className="absolute inset-0 w-full h-full object-cover z-0"
              />
              {/* Scanline / Grain Overlay */}
              <div className="absolute inset-0 scanlines opacity-50 z-20 pointer-events-none" />
            </div>

            <div className="flex items-center gap-3">
              <div>
                <h4 className="brutal text-2xl text-white font-bold tracking-tight uppercase">
                  MOHIB
                </h4>
                <span className="outfit-editorial text-[9px] text-zinc-400 tracking-wider uppercase font-mono block">
                  FOUNDER / LEAD PRODUCER
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
