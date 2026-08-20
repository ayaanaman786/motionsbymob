import React from 'react';
import { MANIFESTO_PARAGRAPHS } from '../data';
import { ShieldCheck, Eye, Sparkles, Scale } from 'lucide-react';

export default function Manifesto() {
  // Reusable icon mapping to give technical visual weight to manifesto sections
  const getSectionIcon = (index: number) => {
    switch (index) {
      case 0: return <Scale className="w-5 h-5 text-[white]" />;
      case 1: return <Sparkles className="w-5 h-5 text-[white]" />;
      case 2: return <ShieldCheck className="w-5 h-5 text-[white]" />;
      case 3: return <Eye className="w-5 h-5 text-[white]" />;
      default: return null;
    }
  };

  return (
    <section id="manifesto" className="bg-black py-24 md:py-32 px-4 md:px-8 relative overflow-hidden">
      {/* Absolute ambient lights */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-white/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-white/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Technical Section Header */}
        <div className="border-b border-white/5 pb-12 mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="outfit-editorial text-xs text-zinc-500 mb-4 uppercase tracking-[0.3em]">
              — THE MANIFESTO
            </div>
            <h2 
              className="brutal text-3xl md:text-5xl tracking-tight text-white uppercase font-light"
            >
              Absolute.
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
          <div className="lg:col-span-5 relative group min-h-[350px] md:min-h-[500px] bg-[#090909] overflow-hidden flex flex-col justify-between">
            {/* Dark glass layers */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black z-10 opacity-30" />
            
            <img
              src="/images/merc_rose.webp"
              alt="Mercedes Rose Cinematic Study"
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[4000ms] ease-out group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Right Block: Manifesto Statements */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12">
              {MANIFESTO_PARAGRAPHS.map((item, index) => (
                <div 
                  key={index}
                  className="flex flex-col justify-between p-6 md:p-8 bg-zinc-900/60 border border-white/20 hover:border-white/30 transition-all duration-300 relative group shadow-lg"
                >
                  {/* Subtle white indicator on hover */}
                  <span className="absolute top-0 left-0 w-[2px] h-0 bg-white group-hover:h-full transition-all duration-500" />
                  
                  <div>
                    {/* Corner technical metrics */}
                    <div className="flex items-center justify-between mb-8">
                      <span className="outfit-editorial text-[10px] text-zinc-500 uppercase tracking-widest">
                        0{index + 1}
                      </span>
                      {getSectionIcon(index)}
                    </div>

                    <h3 
                      className="brutal text-md md:text-lg tracking-tight text-white mb-4 uppercase leading-relaxed transition-colors duration-300"
                    >
                      {item.highlight}
                    </h3>
                    
                    <p 
                      className="outfit-editorial text-xs md:text-sm text-zinc-400 leading-relaxed font-light"
                    >
                      {item.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Huge cinematic overlay slogan */}
            <div className="border-t border-white/5 pt-12 mt-8">
              <p 
                className="brutal text-xl sm:text-2xl md:text-3xl tracking-tight text-zinc-500 text-center sm:text-left leading-relaxed pl-1"
              >
                "WE DO NOT COMPETE FOR ATTENTION.<br />
                <span className="text-white">WE SIMPLY COMMAND IT.</span>"
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
