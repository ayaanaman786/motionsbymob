import React, { useState, useRef, useEffect } from 'react';
import { Sliders, RefreshCw, Eye, EyeOff, LayoutGrid } from 'lucide-react';

export default function ColoristSlider() {
  const [sliderPosition, setSliderPosition] = useState(50); // percentage 0-100
  const [isDragging, setIsDragging] = useState(false);
  const [activePreset, setActivePreset] = useState<'aces' | 'monolith' | 'stealth'>('aces');
  const [showMetadata, setShowMetadata] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Active comparison image - a menacing V8 G-Wagon in a docklands setting
  const imageSrc = '/images/80_moving.webp';

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  // Get filter classes for the selected grading preset
  const getGradeClass = () => {
    switch (activePreset) {
      case 'monolith':
        return 'contrast-[1.14] saturate-[0.75] sepia-[15%] hue-rotate-[10deg] brightness-[0.92]';
      case 'stealth':
        return 'grayscale contrast-[1.28] brightness-[0.82]';
      case 'aces':
      default:
        return 'contrast-[1.12] saturate-[1.24] brightness-[0.96] hue-rotate-[-3deg]';
    }
  };

  // Get human-readable description for the active grading LUT
  const getPresetInfo = () => {
    switch (activePreset) {
      case 'monolith':
        return {
          name: 'MOB MONOLITH COLD TEAL',
          gamma: 'Rec.709 Cineon',
          temp: '4800K',
          lutID: 'LUT_MN_098'
        };
      case 'stealth':
        return {
          name: 'STEALTH SILHOUETTE MONO',
          gamma: 'Rec.709 High Contrast',
          temp: '6500K',
          lutID: 'LUT_ST_042'
        };
      case 'aces':
      default:
        return {
          name: 'MOB ACES AUTOMOTIVE V1',
          gamma: 'ACEScc AP1',
          temp: '5600K',
          lutID: 'LUT_AC_304'
        };
    }
  };

  const currentPreset = getPresetInfo();

  return (
    <section id="colorist" className="bg-[#030303] py-24 md:py-32 px-4 md:px-8 relative border-t border-white/5 overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-b from-[#ff2a2a]/3 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="border-b border-white/10 pb-8 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="outfit-editorial text-[11px] text-[#ff2a2a] mb-2 uppercase">
              [ ARCHIVE_01 // GRADING SUITE ]
            </div>
            <h2 className="brutal text-3xl md:text-5xl tracking-tighter text-white uppercase font-black">
              Colorist Desk<span className="text-[#ff2a2a]">.</span>
            </h2>
          </div>
          <p className="outfit-editorial text-[11px] sm:text-xs text-zinc-400 uppercase leading-relaxed max-w-sm">
            Slide the vertical reticle to compare raw uncompressed sensor footage with our master graded lookup curves.
          </p>
        </div>

        {/* Colorist Simulator Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Main Interactive Screen Panel */}
          <div className="lg:col-span-9 flex flex-col space-y-4">
            
            {/* Split Screen Container */}
            <div 
              ref={containerRef}
              className="relative aspect-[16/9] bg-black border border-white/10 select-none overflow-hidden group cursor-ew-resize"
              onMouseDown={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                setSliderPosition((x / rect.width) * 100);
                setIsDragging(true);
              }}
            >
              
              {/* Layer 1: Left Side - Flat RAW/LOG Sensor Image */}
              <div className="absolute inset-0 w-full h-full">
                <img 
                  src={imageSrc} 
                  alt="RAW Sensor Image" 
                  className="w-full h-full object-cover saturate-[0.30] contrast-[0.72] brightness-[1.12] sepia-[10%]"
                  referrerPolicy="no-referrer"
                />
                {/* Floating Indicator */}
                <div className="absolute bottom-4 left-6 z-20 bg-black/75 px-3 py-1 border border-white/10 outfit-editorial text-[11px] text-zinc-400">
                  SECURE_RAW_LOG // REDLOG3G10
                </div>
              </div>

              {/* Layer 2: Right Side - Fully Graded Image (Clipped) */}
              <div 
                className="absolute inset-y-0 right-0 overflow-hidden"
                style={{ left: `${sliderPosition}%` }}
              >
                {/* We offset the image to keep it aligned with the background layer */}
                <div 
                  className="absolute inset-y-0 right-0 w-full"
                  style={{ 
                    width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100vw',
                    transform: 'none'
                  }}
                >
                  <img 
                    src={imageSrc} 
                    alt="Cinema Graded Image" 
                    className={`absolute inset-0 w-full h-full object-cover ${getGradeClass()}`}
                    style={{ 
                      width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%',
                    }}
                    referrerPolicy="no-referrer"
                  />
                </div>
                {/* Floating Indicator */}
                <div className="absolute bottom-4 right-6 z-20 bg-black/75 px-3 py-1 border border-[#ff2a2a]/40 outfit-editorial text-[11px] text-white">
                  GRADED_MASTER // {currentPreset.name}
                </div>
              </div>

              {/* Slider Divider bar and central handle dial */}
              <div 
                className="absolute inset-y-0 z-30 w-[1px] bg-[#ff2a2a]"
                style={{ left: `${sliderPosition}%` }}
              >
                {/* Central Handle */}
                <div 
                  onMouseDown={handleMouseDown}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black border border-[#ff2a2a] flex flex-col items-center justify-center shadow-[0_0_15px_#ff2a2a] cursor-grab active:cursor-grabbing transition-transform duration-200 group-hover:scale-105"
                >
                  <Sliders className="w-4 h-4 text-white rotate-90" />
                  <span className="outfit-editorial text-[5px] text-zinc-400 font-bold tracking-widest mt-0.5">TUNE</span>
                </div>

                {/* Vertical dash coordinate markings */}
                <div className="absolute top-4 left-2 outfit-editorial text-[7px] text-[#ff2a2a] tracking-widest bg-black/80 px-1 rounded-sm">
                  RETICLE_0{Math.round(sliderPosition)}
                </div>
              </div>

              {/* Viewfinder Crosshair Overlay (Adds heavy cinematic mood) */}
              <div className="absolute inset-4 border border-white/5 pointer-events-none">
                {/* Center crosshair */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center opacity-40">
                  <div className="w-full h-[1px] bg-white absolute" />
                  <div className="h-full w-[1px] bg-white absolute" />
                </div>
                {/* Corner bracket styling */}
                <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-zinc-500" />
                <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-zinc-500" />
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-zinc-500" />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-zinc-500" />
              </div>

              {/* Dynamic HUD Metadata Readouts overlay */}
              {showMetadata && (
                <div className="absolute top-6 inset-x-6 flex justify-between pointer-events-none outfit-editorial text-[11px] text-zinc-400">
                  <div className="flex gap-4 bg-black/60 p-2 border border-white/5">
                    <span>FOCAL: 50MM</span>
                    <span>APERTURE: T1.5</span>
                    <span>ISO: 800</span>
                  </div>
                  <div className="flex gap-4 bg-black/60 p-2 border border-white/5">
                    <span>SHUTTER: 172.8&deg;</span>
                    <span>TEMP: {currentPreset.temp}</span>
                    <span>FPS: 24.00</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick interactive utility bar below slider */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-t border-white/10 pt-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowMetadata(!showMetadata)}
                  className="flex items-center gap-1.5 py-1.5 px-3 border border-white/10 hover:border-white/30 rounded-sm text-[11px] outfit-editorial text-zinc-400 hover:text-white uppercase transition-all duration-200 cursor-pointer"
                >
                  {showMetadata ? (
                    <>
                      <EyeOff className="w-3 h-3 text-[#ff2a2a]" /> HIDE TELEMETRY HUD
                    </>
                  ) : (
                    <>
                      <Eye className="w-3 h-3" /> SHOW TELEMETRY HUD
                    </>
                  )}
                </button>

                <button
                  onClick={() => setSliderPosition(50)}
                  className="flex items-center gap-1.5 py-1.5 px-3 border border-white/10 hover:border-white/30 rounded-sm text-[11px] outfit-editorial text-zinc-400 hover:text-white uppercase transition-all duration-200 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" /> RESET RETICLE
                </button>
              </div>

              {/* Progress visual bar */}
              <div className="flex items-center gap-3 outfit-editorial text-[11px] text-zinc-400 uppercase">
                <span>0% RAW</span>
                <div className="w-24 h-1 bg-zinc-900 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#ff2a2a] h-full"
                    style={{ width: `${sliderPosition}%` }}
                  />
                </div>
                <span>100% GRADED</span>
              </div>
            </div>

          </div>

          {/* Colorist Parameters / Presets Side Panel */}
          <div className="lg:col-span-3 bg-zinc-900/60 border border-white/10 p-6 flex flex-col justify-between space-y-6">
            
            <div className="space-y-6">
              <div>
                <span className="outfit-editorial text-[11px] text-zinc-400 uppercase block tracking-widest mb-1">
                  SECURE CONTROL MATRIX
                </span>
                <h4 className="brutal text-lg text-white font-black tracking-tight uppercase">
                  LUT Selection
                </h4>
              </div>

              {/* Selector Presets List */}
              <div className="space-y-3">
                {(['aces', 'monolith', 'stealth'] as const).map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setActivePreset(preset)}
                    className={`w-full text-left p-4 border transition-all duration-300 relative cursor-pointer ${
                      activePreset === preset
                        ? 'bg-[#ff2a2a]/5 border-[#ff2a2a] shadow-[0_0_15px_rgba(165,0,0,0.1)]'
                        : 'bg-black border-white/5 hover:border-white/15'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="outfit-editorial text-[11px] font-bold text-white uppercase tracking-wider">
                        {preset === 'aces' ? 'ACES CINEMA' : preset === 'monolith' ? 'MONOLITH COLD' : 'STEALTH MONO'}
                      </span>
                      {activePreset === preset && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ff2a2a] animate-pulse" />
                      )}
                    </div>
                    <span className="block outfit-editorial text-[7px] text-zinc-400 uppercase">
                      {preset === 'aces' ? 'WARM FLARE & SATURATED FLUIDITY' : preset === 'monolith' ? 'BRUTALIST TEAL & DESATURATED METALS' : 'AGRESSIVE MONOCHROME CONTRAST'}
                    </span>
                  </button>
                ))}
              </div>

              {/* Technical Telemetry Readout */}
              <div className="border-t border-white/10 pt-5 space-y-3">
                <span className="outfit-editorial text-[11px] text-zinc-400 uppercase block tracking-wider">
                  ACTIVE_LUT PARAMETERS
                </span>
                <div className="space-y-2 outfit-editorial text-[11px] text-zinc-400">
                  <div className="flex justify-between">
                    <span>VECTOR INDEX:</span>
                    <span className="text-white font-bold">{currentPreset.lutID}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>COLOR MATRIX:</span>
                    <span className="text-white font-bold">{currentPreset.gamma}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>WHITE BALANCE:</span>
                    <span className="text-white font-bold">{currentPreset.temp}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>BLACK POINT:</span>
                    <span className="text-[#ff2a2a] font-bold">LOG SCALE (0.012)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Micro aesthetic footprint */}
            <div className="border-t border-white/5 pt-4 outfit-editorial text-[7px] text-zinc-600 leading-normal uppercase">
              <span>LUT MATRIX ENGINES COMPLIANT // NO COMPRESSED CLIP LOSS REGISTERED.</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
