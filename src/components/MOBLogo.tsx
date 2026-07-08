import React from 'react';

interface MOBLogoProps {
  variant?: 'full' | 'horizontal' | 'emblem';
  className?: string;
  glow?: boolean;
}

export default function MOBLogo({ variant = 'full', className = '', glow = true }: MOBLogoProps) {
  // SVG or HTML representation of the emblem (2 bars stacked: top short white, bottom medium white)
  const renderEmblem = (sizeClass = 'w-16 h-4', topWidth = 'w-4', bottomWidth = 'w-8') => (
    <div className={`flex flex-col items-center justify-center gap-1.5 ${sizeClass}`}>
      {/* Top line: short white with soft glow */}
      <div className={`${topWidth} h-[2px] bg-white opacity-85 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.7)]`} />
      {/* Bottom line: medium white with soft glow */}
      <div className={`${bottomWidth} h-[2px] bg-white opacity-95 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]`} />
    </div>
  );

  if (variant === 'emblem') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        {renderEmblem()}
      </div>
    );
  }

  if (variant === 'horizontal') {
    return (
      <div className={`inline-flex items-center gap-3 ${className}`}>
        {renderEmblem('w-12 h-4', 'w-3', 'w-6')}
        <span 
          className="brutal text-2xl tracking-[0.05em] text-white antialiased"
        >
          МОБ
        </span>
      </div>
    );
  }

  // Full stacked logo variant
  return (
    <div className={`flex flex-col items-center text-center select-none ${className}`}>
      {/* Emblem on top (Two white glowing bars, shifted slightly right to center perfectly over the 'О' since 'М' is wider than 'Б') */}
      <div className="translate-x-1.5 md:translate-x-2.5">
        {renderEmblem('w-28 h-5 mb-1', 'w-8', 'w-16')}
      </div>
      
      {/* Main "МОБ" Text with exact spacing and height */}
      <h1 
        className="brutal text-5xl sm:text-6xl md:text-8xl leading-none text-center tracking-[0.08em] text-white pl-[0.08em]"
      >
        МОБ
      </h1>

      {/* Underline Red Glow Bar (Taillight Glow) */}
      <div className="w-full max-w-[220px] md:max-w-[280px] h-[3px] bg-[#ff2a2a] my-4 shadow-[0_0_15px_#ff2a2a,0_0_6px_#ff2a2a] rounded-full" />

      {/* Motions by MOB secondary brand text (Luxury wide-spaced serif) */}
      <span 
        className="outfit-editorial text-[11px] md:text-xs text-gray-400 font-light tracking-[0.2em] pl-[0.45em]"
      >
        MOTIONS BY MOB
      </span>
    </div>
  );
}
