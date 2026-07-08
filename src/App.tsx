import React, { useState } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Manifesto from './components/Manifesto';
import About from './components/About';
import ColoristSlider from './components/ColoristSlider';
import Gallery from './components/Gallery';

import EngineAcoustics from './components/EngineAcoustics';
import Contact from './components/Contact';
import CinematicControls from './components/CinematicControls';
import GeminiChatbot from './components/GeminiChatbot';

export default function App() {
  const [lutGrade, setLutGrade] = useState('raw');
  const [aspectRatio, setAspectRatio] = useState('free');

  // Define lookup table visual filters using explicit CSS for reliability
  const getLutStyle = (): React.CSSProperties => {
    switch (lutGrade) {
      case 'aces':
        return { filter: 'contrast(1.05) saturate(1.15) brightness(1.0)' };
      case 'monolith':
        return { filter: 'contrast(1.08) saturate(0.82) sepia(0.15) hue-rotate(12deg) brightness(0.98)' };
      case 'stealth':
        return { filter: 'grayscale(1) contrast(1.10) brightness(0.96)' };
      case 'raw':
      default:
        return { filter: 'none' };
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-[#ff2a2a] selection:text-white">
      {/* Cinematic Crop Overlays (Top/Bottom/Sides Matte Bars) */}
      {/* Top bar */}
      <div 
        className="fixed inset-x-0 top-0 bg-black z-50 transition-all duration-700 ease-in-out pointer-events-none flex items-end justify-center pb-1.5"
        style={{ 
          height: aspectRatio === 'anamorphic' ? '10vh' : aspectRatio === 'standard' ? '6vh' : '0vh',
          borderBottom: aspectRatio !== 'free' && aspectRatio !== 'vertical' ? '1px solid rgba(255,255,255,0.08)' : 'none'
        }}
      >
        {aspectRatio !== 'free' && aspectRatio !== 'vertical' && (
          <span className="outfit-editorial text-[7px] text-zinc-400 uppercase tracking-[0.3em]">
            [ CAMERA_REC_PREVIEW // {aspectRatio === 'anamorphic' ? '2.39:1 ANAMORPHIC' : '16:9 WIDESCREEN'} ]
          </span>
        )}
      </div>

      {/* Bottom bar */}
      <div 
        className="fixed inset-x-0 bottom-0 bg-black z-50 transition-all duration-700 ease-in-out pointer-events-none flex items-start justify-center pt-1.5"
        style={{ 
          height: aspectRatio === 'anamorphic' ? '10vh' : aspectRatio === 'standard' ? '6vh' : '0vh',
          borderTop: aspectRatio !== 'free' && aspectRatio !== 'vertical' ? '1px solid rgba(255,255,255,0.08)' : 'none'
        }}
      >
        {aspectRatio !== 'free' && aspectRatio !== 'vertical' && (
          <span className="outfit-editorial text-[7px] text-zinc-600 uppercase tracking-[0.3em]">
            MOTIONSBYMOB // 24.00 FPS // SAFE_CRITERION
          </span>
        )}
      </div>

      {/* Left side bar for Vertical 9:16 Crop */}
      <div 
        className="fixed inset-y-0 left-0 bg-black z-50 transition-all duration-700 ease-in-out pointer-events-none flex items-center justify-end pr-2"
        style={{ 
          width: aspectRatio === 'vertical' ? '28%' : '0%',
          borderRight: aspectRatio === 'vertical' ? '1px solid rgba(255,255,255,0.08)' : 'none'
        }}
      >
        {aspectRatio === 'vertical' && (
          <div className="outfit-editorial text-[6px] text-zinc-600 -rotate-90 uppercase tracking-widest whitespace-nowrap">
            9:16 VERTICAL REEL PREVIEW
          </div>
        )}
      </div>

      {/* Right side bar for Vertical 9:16 Crop */}
      <div 
        className="fixed inset-y-0 right-0 bg-black z-50 transition-all duration-700 ease-in-out pointer-events-none flex items-center justify-start pl-2"
        style={{ 
          width: aspectRatio === 'vertical' ? '28%' : '0%',
          borderLeft: aspectRatio === 'vertical' ? '1px solid rgba(255,255,255,0.08)' : 'none'
        }}
      >
        {aspectRatio === 'vertical' && (
          <div className="outfit-editorial text-[6px] text-zinc-600 rotate-90 uppercase tracking-widest whitespace-nowrap">
            INTELLIGENT FRAMING MATTE
          </div>
        )}
      </div>

      {/* Global Navigation Header - Kept out of filter so it's always crisp and fixed */}
      <Navigation />

      {/* Content wrapper where the Cinematic LUT filter is actually applied */}
      <div className="transition-all duration-700" style={getLutStyle()}>
        {/* Primary Scroll Sections */}
        <main>
          {/* Cinematic Hero Segment */}
          <Hero />

          {/* Brand Values & Statement */}
          <Manifesto />

          {/* The Studio & Collective About section */}
          <About />

          {/* Interactive Colorist Calibration Desk */}
          <ColoristSlider />

          {/* Gallery Archive Catalog */}
          <Gallery />

          {/* Interactive Audio Exhaust Acoustics Console */}
          <EngineAcoustics />

          {/* Connect & Distro Desk */}
          <Contact />
        </main>
      </div>

      {/* Premium Cinematic Tuning Controls */}
      <CinematicControls 
        lutGrade={lutGrade} 
        setLutGrade={setLutGrade} 
        aspectRatio={aspectRatio} 
        setAspectRatio={setAspectRatio} 
      />

      {/* Premium Automotive Cinema Chatbot Consultant */}
      <GeminiChatbot />
    </div>
  );
}
