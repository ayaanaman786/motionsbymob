import React from 'react';
import { MANIFESTO_PARAGRAPHS } from '../data';
import { ShieldCheck, Eye, Sparkles, Scale } from 'lucide-react';

export default function Manifesto() {
  // Reusable icon mapping to give technical visual weight to manifesto sections
  const getSectionIcon = (index: number) => {
    switch (index) {
      case 0: return <Scale className="w-5 h-5 text-[#ff2a2a]" />;
      case 1: return <Sparkles className="w-5 h-5 text-[#ff2a2a]" />;
      case 2: return <ShieldCheck className="w-5 h-5 text-[#ff2a2a]" />;
      case 3: return <Eye className="w-5 h-5 text-[#ff2a2a]" />;
      default: return null;
    }
  };

  return (
    <section id="manifesto" className="bg-black py-24 md:py-32 px-4 md:px-8 relative overflow-hidden">
      {/* Absolute ambient lights */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-[#ff2a2a]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-white/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Technical Section Header */}
        <div className="border-b border-white/10 pb-8 mb-16 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="outfit-editorial text-[11px] text-[#ff2a2a] mb-2 uppercase">
              [ EST_01 // THE MANIFESTO ]
            </div>
            <h2 
              className="brutal text-3xl md:text-5xl tracking-tighter text-white uppercase font-black"
            >
              Quiet Authority<span className="text-[#ff2a2a]">.</span>
            </h2>
          </div>
          <p 
            className="outfit-editorial text-xs md:text-sm text-zinc-400 uppercase leading-relaxed max-w-sm"
          >
            We focus exclusively on clean luxury SUV culture.
            We do not compromise on factory-designed power.
          </p>
        </div>

        {/* Dynamic Bento-like Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          
          {/* Left Block: Image study with cinematically styled letterbox borders */}
          <div className="lg:col-span-5 relative group min-h-[350px] md:min-h-[500px] bg-[#090909] overflow-hidden border border-white/10 flex flex-col justify-between">
            {/* Dark glass layers */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black z-10" />
            
            {/* Cinematic Frame Bars */}
            <div className="absolute top-0 inset-x-0 h-6 bg-[#0a0a0a]/80 backdrop-blur-md z-20 border-b border-white/10 flex items-center px-4 text-[11px] tracking-[0.2em] text-gray-400">
              FRAME_REF_MERC_ROSE
            </div>
            
            <img
              src="/images/merc_rose.webp"
              alt="Mercedes Rose Cinematic Study"
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[4000ms] ease-out group-hover:scale-105"
              referrerPolicy="no-referrer"
            />

            <div className="absolute bottom-0 inset-x-0 h-10 bg-[#0a0a0a]/80 backdrop-blur-md z-20 border-t border-white/10 flex items-center justify-between px-4 text-[11px] tracking-[0.2em] text-gray-400">
              <span>COORD_LOCK // SECURE</span>
              <span>OEM+ ALIGNMENT</span>
            </div>
            
            {/* Glowing Red laser beam cutting through image container */}
            <div className="absolute top-1/2 left-0 w-1 h-20 bg-[#ff2a2a] z-20 shadow-[0_0_15px_#ff2a2a]" />
          </div>

          {/* Right Block: Manifesto Statements */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12">
              {MANIFESTO_PARAGRAPHS.map((item, index) => (
                <div 
                  key={index}
                  className="flex flex-col justify-between p-6 md:p-8 bg-zinc-900/60 border border-white/20 hover:border-white/30 transition-all duration-300 relative group shadow-lg"
                >
                  {/* Subtle red indicator on hover */}
                  <span className="absolute top-0 left-0 w-[2px] h-0 bg-[#ff2a2a] group-hover:h-full transition-all duration-500" />
                  
                  <div>
                    {/* Corner technical metrics */}
                    <div className="flex items-center justify-between mb-6">
                      <span className="outfit-editorial text-[11px] text-zinc-400">
                        SEC_0{index + 1} // COMPLIANCE
                      </span>
                      {getSectionIcon(index)}
                    </div>

                    <h3 
                      className="brutal text-md md:text-lg tracking-tight text-[#ff2a2a] mb-4 uppercase leading-relaxed transition-colors duration-300 group-hover:text-white"
                    >
                      {item.highlight}
                    </h3>
                    
                    <p 
                      className="outfit-editorial text-xs md:text-sm text-zinc-300 leading-relaxed font-light"
                    >
                      {item.body}
                    </p>
                  </div>

                  <div className="mt-8 pt-4 border-t border-white/20 flex justify-between items-center text-[11px] outfit-editorial text-zinc-400">
                    <span>STATUS: COMMANDING</span>
                    <span>WEIGHT: DENSE</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Huge cinematic overlay slogan */}
            <div className="border-t border-white/10 pt-8 mt-4">
              <p 
                className="brutal text-xl sm:text-2xl md:text-3xl tracking-tighter text-white text-center sm:text-left leading-relaxed pl-1"
              >
                "WE DO NOT COMPETE FOR ATTENTION.<br />
                <span className="text-[#ff2a2a] shadow-[0_0_20px_rgba(255,42,42,0.2)]">WE SIMPLY COMMAND IT.</span>"
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
