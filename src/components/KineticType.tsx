import React, { useState, useEffect, useRef } from 'react';

interface SloganItem {
  title: string;
  subtitle: string;
  desc: string;
}

const SLOGANS: SloganItem[] = [
  {
    title: "UNDERSTATED POWER",
    subtitle: "UNIFIED PRESENCE",
    desc: "A SEAMLESS SILHOUETTE OF GLASS AND METAL"
  },
  {
    title: "TIMELESS PRECISION",
    subtitle: "FORGED IN CARBON",
    desc: "OEM+ DESIGN WITH THERMAL INTEGRITY"
  },
  {
    title: "SILENT DOMINANCE",
    subtitle: "CHRONO BALANCE",
    desc: "KINETIC CALIBRATION EXECUTED TO PERFECTION"
  }
];

const GLYPHS = ['0', '1', '[', ']', '_', '-', 'X', '/', '\\', '%', '*', '#', 'Ø', '▲', '▼', '◆', '⌘', '⌥'];

export default function KineticType() {
  const [scrollY, setScrollY] = useState(0);
  const smoothScrollY = useRef(0);
  const [activeState, setActiveState] = useState({
    index: 0,
    targetIndex: 0,
    factor: 0, // 0 to 1 transition progress between index and targetIndex
    isGlitching: false,
    glitchSeverity: 0 // 0 to 1 strength of the glitch
  });

  const requestRef = useRef<number | null>(null);

  // Sync window scroll value
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Butter-smooth spring interpolation for scroll
  useEffect(() => {
    const animateScroll = () => {
      // 0.1 interpolation factor for a heavy, high-end weighted "slow motion" feel
      smoothScrollY.current += (scrollY - smoothScrollY.current) * 0.1;
      
      // We map scroll from 0 to 500px to progress 0 to 1
      const progress = Math.max(0, Math.min(1, smoothScrollY.current / 550));
      
      let index = 0;
      let targetIndex = 0;
      let factor = 0;
      let isGlitching = false;
      let glitchSeverity = 0;

      // Define transition checkpoints
      // Slogan 1: 0.00 -> 0.28
      // Transition 1->2: 0.28 -> 0.40 (duration 0.12)
      // Slogan 2: 0.40 -> 0.68
      // Transition 2->3: 0.68 -> 0.80 (duration 0.12)
      // Slogan 3: 0.80 -> 1.00
      if (progress < 0.28) {
        index = 0;
        targetIndex = 0;
        factor = 0;
      } else if (progress >= 0.28 && progress < 0.40) {
        index = 0;
        targetIndex = 1;
        factor = (progress - 0.28) / 0.12;
        isGlitching = true;
        // Peak glitch intensity in the middle of transition
        glitchSeverity = Math.sin(factor * Math.PI);
      } else if (progress >= 0.40 && progress < 0.68) {
        index = 1;
        targetIndex = 1;
        factor = 0;
      } else if (progress >= 0.68 && progress < 0.80) {
        index = 1;
        targetIndex = 2;
        factor = (progress - 0.68) / 0.12;
        isGlitching = true;
        glitchSeverity = Math.sin(factor * Math.PI);
      } else {
        index = 2;
        targetIndex = 2;
        factor = 0;
      }

      // Add small micro-glitching triggered randomly when scroll is actively changing
      const scrollVelocity = Math.abs(scrollY - smoothScrollY.current);
      if (scrollVelocity > 2 && !isGlitching) {
        isGlitching = true;
        glitchSeverity = Math.min(0.25, scrollVelocity * 0.015);
      }

      setActiveState(prev => {
        if (prev.index === index && prev.targetIndex === targetIndex && prev.factor === factor && prev.isGlitching === isGlitching && prev.glitchSeverity === glitchSeverity) {
          return prev;
        }
        return { index, targetIndex, factor, isGlitching, glitchSeverity };
      });

      requestRef.current = requestAnimationFrame(animateScroll);
    };

    requestRef.current = requestAnimationFrame(animateScroll);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [scrollY]);

  // Deterministic/Random character scramble utility
  const getScrambledText = (textA: string, textB: string, factor: number, isGlitching: boolean, severity: number) => {
    if (!isGlitching || severity < 0.02) {
      return factor > 0.5 ? textB : textA;
    }

    const maxLen = Math.max(textA.length, textB.length);
    let result = '';

    for (let i = 0; i < maxLen; i++) {
      const charA = textA[i] || ' ';
      const charB = textB[i] || ' ';

      // Determine which base letter is primary
      const baseChar = factor > 0.5 ? charB : charA;

      // When glitching, we replace letters with numbers or technical symbols based on severity
      // Higher severity means higher chance of character breakdown
      const randomChance = Math.random();
      if (randomChance < severity * 0.48) {
        const glyphIdx = Math.floor(Math.abs(Math.sin(i + scrollY)) * GLYPHS.length) % GLYPHS.length;
        result += GLYPHS[glyphIdx];
      } else {
        result += baseChar;
      }
    }

    return result;
  };

  const { index, targetIndex, factor, isGlitching, glitchSeverity } = activeState;

  // Compute scrambled strings
  const currentSloganA = SLOGANS[index];
  const currentSloganB = SLOGANS[targetIndex];

  const scrambledTitle = getScrambledText(currentSloganA.title, currentSloganB.title, factor, isGlitching, glitchSeverity);
  const scrambledSubtitle = getScrambledText(currentSloganA.subtitle, currentSloganB.subtitle, factor, isGlitching, glitchSeverity);
  const scrambledDesc = getScrambledText(currentSloganA.desc, currentSloganB.desc, factor, isGlitching, glitchSeverity * 0.5);

  // Compute styling translations for split sheer glitches
  // Slices will move in opposite directions
  const shiftAmountX = isGlitching ? (glitchSeverity * 24 * Math.sin(scrollY * 0.05)) : 0;
  const shiftAmountY = isGlitching ? (glitchSeverity * 4 * Math.cos(scrollY * 0.1)) : 0;

  // Rotating angle for watch chronograph bezel (1 scrollpx = 0.45deg rotation)
  const circularBezelAngle = smoothScrollY.current * 0.45;

  return (
    <div className="w-full flex flex-col items-center relative py-4 sm:py-6">
      
      {/* Decorative Luxury Bezel Backdrop & Chrono Dial */}
      <div className="absolute -top-12 opacity-15 pointer-events-none select-none z-0 overflow-hidden">
        <svg 
          viewBox="0 0 400 400" 
          className="w-72 h-72 md:w-96 md:h-96 text-white"
          style={{ transform: `rotate(${circularBezelAngle}deg)` }}
        >
          {/* Bezel Outer Ring */}
          <circle cx="200" cy="200" r="180" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3,12" />
          <circle cx="200" cy="200" r="172" fill="none" stroke="currentColor" strokeWidth="0.5" />
          {/* Chronograph markers */}
          <circle cx="200" cy="200" r="150" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="1,29" />
          
          {/* Inner dial indices */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angleDeg = (i * 30) * (Math.PI / 180);
            const x1 = 200 + 130 * Math.cos(angleDeg);
            const y1 = 200 + 130 * Math.sin(angleDeg);
            const x2 = 200 + 145 * Math.cos(angleDeg);
            const y2 = 200 + 145 * Math.sin(angleDeg);
            return (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth={i % 3 === 0 ? "2" : "1"} />
            );
          })}
          
          {/* Circular Metadata Tagging */}
          <path id="curve" d="M 60,200 A 140,140 0 1,1 340,200" fill="none" />
          <text className="font-mono text-[7px] tracking-widest text-zinc-400 fill-current">
            <textPath href="#curve" startOffset="25%">
              KINETIC CHRONO SYSTEM // CALIBRE 8800 // AP1
            </textPath>
          </text>
        </svg>
      </div>

      {/* Main Responsive Kinetic Content Bracket */}
      <div className="relative w-full max-w-4xl text-center px-4 flex flex-col md:flex-row items-center justify-between gap-12 z-10">
        
        {/* Left Side: Analog Telemetry Column (Watches & High End Cameras vibe) */}
        <div className="hidden md:flex flex-col items-start space-y-4 text-left border-l border-white/10 pl-6 h-36 justify-between select-none">
          <div className="space-y-1">
            <span className="outfit-editorial text-[8px] text-[#a50000] tracking-widest block font-bold">
              CALIBRATION BEZEL
            </span>
            <div className="font-mono text-[9px] text-zinc-500 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#a50000] animate-pulse" />
              INDEX: [0{index + 1}] // 0{SLOGANS.length}
            </div>
          </div>

          {/* Micro ticking slider */}
          <div className="space-y-1.5 w-32">
            <div className="flex justify-between font-mono text-[7px] text-zinc-600">
              <span>0.00K NT</span>
              <span>1.00K NT</span>
            </div>
            <div className="h-[2px] w-full bg-zinc-900 rounded-full overflow-hidden relative">
              <div 
                className="h-full bg-white transition-all duration-75"
                style={{ width: `${(smoothScrollY.current / 550) * 100}%` }}
              />
            </div>
          </div>

          <div className="font-mono text-[7px] text-zinc-600 uppercase leading-relaxed">
            SYSTEM SHIFT ENGINES ACTUATED<br />
            LAG_FACTOR: 0.10s FLUID WEIGHT
          </div>
        </div>

        {/* Center Section: The Glitching Slogan Canvas */}
        <div className="flex-1 flex flex-col items-center justify-center h-[160px] sm:h-[200px] md:h-[240px] select-none w-full">
          <div className="relative group w-full">
            
            {/* Top Slash Sheared Glitch Component (Clip top 50%) */}
            <h2 
              className="brutal text-4xl sm:text-6xl md:text-[84px] leading-[0.85] tracking-tighter text-white font-black absolute inset-0 select-none pointer-events-none opacity-90 transition-transform duration-75"
              style={{
                clipPath: 'inset(0 0 50% 0)',
                transform: `translate(${shiftAmountX}px, ${shiftAmountY}px)`,
                textShadow: isGlitching ? '2px 0 0 #00a5cf, -2px 0 0 #a50000' : 'none'
              }}
            >
              {scrambledTitle}<br />
              <span className="text-white/90">{scrambledSubtitle}</span>
            </h2>

            {/* Bottom Slash Sheared Glitch Component (Clip bottom 50%) */}
            <h2 
              className="brutal text-4xl sm:text-6xl md:text-[84px] leading-[0.85] tracking-tighter text-white font-black absolute inset-0 select-none pointer-events-none opacity-90 transition-transform duration-75"
              style={{
                clipPath: 'inset(50% 0 0 0)',
                transform: `translate(${-shiftAmountX}px, ${-shiftAmountY}px)`,
                textShadow: isGlitching ? '-2px 0 0 #00a5cf, 2px 0 0 #a50000' : 'none'
              }}
            >
              {scrambledTitle}<br />
              <span className="text-white/90">{scrambledSubtitle}</span>
            </h2>

            {/* Core Reference Layer (Invisible or low opacity to reserve vertical layout space) */}
            <h2 
              className="brutal text-4xl sm:text-6xl md:text-[84px] leading-[0.85] tracking-tighter text-white font-black transition-opacity duration-200"
              style={{
                opacity: isGlitching ? 0.05 : 1
              }}
            >
              {scrambledTitle}<br />
              <span className="text-white/90">{scrambledSubtitle}</span>
            </h2>

          </div>

          {/* Subtitle / Descriptive Slogan Under */}
          <div className="relative mt-6 overflow-hidden min-h-[16px] flex items-center justify-center">
            <p 
              className={`outfit-editorial text-[9px] sm:text-[10px] md:text-xs text-zinc-400 uppercase tracking-widest text-center transition-all duration-75`}
              style={{
                transform: isGlitching ? `translateX(${shiftAmountX * 0.2}px)` : 'none',
                opacity: isGlitching ? 0.4 + (1 - glitchSeverity) * 0.6 : 1
              }}
            >
              {scrambledDesc}
            </p>
          </div>

        </div>

        {/* Right Side: Bezel Technical Readouts */}
        <div className="hidden md:flex flex-col items-end space-y-4 text-right border-r border-white/10 pr-6 h-36 justify-between select-none">
          <div className="space-y-1">
            <span className="outfit-editorial text-[8px] text-[#a50000] tracking-widest block font-bold">
              KINETIC ANGLE
            </span>
            <div className="font-mono text-[9px] text-zinc-500 uppercase">
              {circularBezelAngle.toFixed(1)}&deg; ROT // {Math.round((smoothScrollY.current / 550) * 100)}% DEPTH
            </div>
          </div>

          <div className="space-y-1 text-right">
            <span className="outfit-editorial text-[8px] text-zinc-500 tracking-widest block">
              STATUS
            </span>
            <span className="font-mono text-[8px] px-2 py-0.5 border border-[#a50000]/40 text-white inline-block">
              {isGlitching ? `GLITCH_MOD_ACTIVE // ${(glitchSeverity * 100).toFixed(0)}%` : "DAMPING_CALIBRATED"}
            </span>
          </div>

          <div className="font-mono text-[7px] text-zinc-600 uppercase">
            CALIBRE.8800 // MOVEMENT CERTIFIED<br />
            GENEVA STANDARDS SPEC 48A
          </div>
        </div>

      </div>

    </div>
  );
}
