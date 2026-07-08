import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Activity, ShieldCheck, Zap, Sliders, RefreshCw } from 'lucide-react';

interface EnginePreset {
  id: string;
  name: string;
  desc: string;
  baseFreq: number;
  type1: OscillatorType;
  type2: OscillatorType;
  filterFreq: number;
  detune: number;
  accentColor: string;
}

export default function EngineAcoustics() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeEngine, setActiveEngine] = useState<string>('v8');
  const [throttle, setThrottle] = useState<number>(0); // 0 (idle) to 100 (redline)
  const [activeGear, setActiveGear] = useState<number>(1);
  const [isShifting, setIsShifting] = useState(false);

  // Web Audio Nodes references
  const audioCtxRef = useRef<AudioContext | null>(null);
  const osc1Ref = useRef<OscillatorNode | null>(null);
  const osc2Ref = useRef<OscillatorNode | null>(null);
  const subOscRef = useRef<OscillatorNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const engines: EnginePreset[] = [
    {
      id: 'v8',
      name: 'Twin-Turbo V8 Block',
      desc: 'Deep mechanical rumble. Focused on low 38Hz structural sub-vibrations representing classical internal combustion.',
      baseFreq: 38,
      type1: 'sawtooth',
      type2: 'triangle',
      filterFreq: 85,
      detune: 0.6,
      accentColor: '#ff2a2a'
    },
    {
      id: 'v10',
      name: 'High-Rev V10 Screamer',
      desc: 'Aggressive racing scream. Naturally aspirated metallic pitch with a sharp mid-range resonance.',
      baseFreq: 68,
      type1: 'sawtooth',
      type2: 'sawtooth',
      filterFreq: 190,
      detune: 1.5,
      accentColor: '#e04300'
    },
    {
      id: 'ev',
      name: 'HV Electric Stator',
      desc: 'Futuristic hyper-drive hum. High-frequency digital magnetics and turbine whines mimicking high-voltage setups.',
      baseFreq: 110,
      type1: 'sine',
      type2: 'triangle',
      filterFreq: 340,
      detune: 2.5,
      accentColor: '#00a5cf'
    }
  ];

  const currentEngine = engines.find(e => e.id === activeEngine) || engines[0];

  // Stop audio synthesis
  const stopSynthesis = () => {
    try {
      osc1Ref.current?.stop();
      osc2Ref.current?.stop();
      subOscRef.current?.stop();
      audioCtxRef.current?.close();
    } catch (e) {
      console.log('Error stopping synthesis:', e);
    }
    osc1Ref.current = null;
    osc2Ref.current = null;
    subOscRef.current = null;
    audioCtxRef.current = null;
    setIsPlaying(false);
    setThrottle(0);
    setActiveGear(1);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  // Start audio synthesis based on current preset and throttle
  const startSynthesis = () => {
    if (isPlaying) return;

    try {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const ctx = audioCtxRef.current;

      osc1Ref.current = ctx.createOscillator();
      osc2Ref.current = ctx.createOscillator();
      subOscRef.current = ctx.createOscillator();
      filterRef.current = ctx.createBiquadFilter();
      masterGainRef.current = ctx.createGain();
      analyserRef.current = ctx.createAnalyser();

      const o1 = osc1Ref.current;
      const o2 = osc2Ref.current;
      const sub = subOscRef.current;
      const f = filterRef.current;
      const g = masterGainRef.current;
      const analyser = analyserRef.current;

      // Pitch definitions
      o1.type = currentEngine.type1;
      o1.frequency.value = currentEngine.baseFreq;

      o2.type = currentEngine.type2;
      o2.frequency.value = currentEngine.baseFreq + currentEngine.detune;

      sub.type = 'sine';
      sub.frequency.value = currentEngine.baseFreq / 2; // sub-bass rumble

      // Biquad filter setup (warms up the sawtooth waves)
      f.type = 'lowpass';
      f.frequency.value = currentEngine.filterFreq;
      f.Q.value = currentEngine.id === 'v10' ? 4.5 : 2.5;

      // Connect nodes
      o1.connect(f);
      o2.connect(f);
      sub.connect(f);
      f.connect(analyser);
      analyser.connect(g);
      g.connect(ctx.destination);

      // Low default gain for safe listening
      g.gain.setValueAtTime(0.06, ctx.currentTime);

      o1.start();
      o2.start();
      sub.start();
      
      setIsPlaying(true);
      drawOscilloscope();
    } catch (err) {
      console.warn('Web Audio synthesis failed to boot:', err);
    }
  };

  // Update synthesized frequencies when throttle or gear changes
  useEffect(() => {
    if (!isPlaying || !audioCtxRef.current) return;

    const ctx = audioCtxRef.current;
    const t = throttle / 100; // 0.0 to 1.0

    // Gear scaling factor (higher gears have slightly lower baseline pitch but broader range)
    const gearFactor = 1 + (activeGear - 1) * 0.15;

    // Pitch rises exponentially as throttle is applied
    const targetFreq = currentEngine.baseFreq * (1 + t * 1.8 * gearFactor);
    const targetDetune = currentEngine.baseFreq + currentEngine.detune * (1 + t * 2.5);

    // Warm up the lowpass filter frequency as throttle opens (more exhaust air volume = brighter sound)
    const targetFilter = currentEngine.filterFreq * (1 + t * 3.2);

    const time = ctx.currentTime;

    osc1Ref.current?.frequency.setValueAtTime(targetFreq, time);
    osc2Ref.current?.frequency.setValueAtTime(targetDetune, time);
    subOscRef.current?.frequency.setValueAtTime(targetFreq / 2, time);
    
    if (filterRef.current) {
      filterRef.current.frequency.setValueAtTime(targetFilter, time);
    }

    // Gain matches throttle load (louder under load)
    if (masterGainRef.current) {
      const targetGain = (0.04 + t * 0.14) * (currentEngine.id === 'ev' ? 0.6 : 1.0);
      masterGainRef.current.gain.setValueAtTime(targetGain, time);
    }
  }, [throttle, activeGear, activeEngine, isPlaying]);

  // Handle sudden DCT gear upshift
  const triggerGearShift = () => {
    if (!isPlaying || isShifting || activeGear >= 6) return;

    setIsShifting(true);
    const prevThrottle = throttle;

    // Simulated DCT ignition cut (revs drop instantly)
    setThrottle(prev => Math.max(15, prev * 0.4));
    setActiveGear(prev => prev + 1);

    setTimeout(() => {
      // Throttle returns with launch power
      setThrottle(prevThrottle);
      setIsShifting(false);
    }, 180);
  };

  // Draw real-time oscillating waveforms
  const drawOscilloscope = () => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!canvas || !analyserRef.current) return;
      animationFrameRef.current = requestAnimationFrame(draw);

      analyserRef.current.getByteTimeDomainData(dataArray);

      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw horizontal baseline
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();

      // Dynamic electric waveform style
      ctx.strokeStyle = currentEngine.accentColor;
      ctx.shadowColor = currentEngine.accentColor;
      ctx.shadowBlur = throttle > 50 ? 5 : 2;
      ctx.lineWidth = throttle > 70 ? 2 : 1.5;

      ctx.beginPath();
      const sliceWidth = canvas.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        // Apply vertical visual scale based on active throttle
        const y = (v * canvas.height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
      ctx.shadowBlur = 0; // Reset shadow
    };

    draw();
  };

  // Clean up audio nodes on unmount
  useEffect(() => {
    return () => {
      if (osc1Ref.current) {
        stopSynthesis();
      }
    };
  }, []);

  return (
    <section id="exhaust-console" className="bg-[#030303] py-24 md:py-32 px-4 md:px-8 relative border-t border-white/5 overflow-hidden">
      <div className="absolute bottom-0 inset-x-0 h-96 bg-gradient-to-t from-[#ff2a2a]/3 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="border-b border-white/10 pb-8 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="outfit-editorial text-[11px] text-[#ff2a2a] mb-2 uppercase">
              [ ARCHIVE_03 // ACOUSTICS CENTER ]
            </div>
            <h2 className="brutal text-3xl md:text-5xl tracking-tighter text-white uppercase font-black">
              Exhaust Console<span className="text-[#ff2a2a]">.</span>
            </h2>
          </div>
          <p className="outfit-editorial text-[11px] sm:text-xs text-zinc-300 uppercase leading-relaxed max-w-sm">
            Engage real-time synthesized engine harmonics. Adjust the throttle dial and shift through the gearbox to feel the raw frequencies.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Bento Left: Engine Selector */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              <div>
                <span className="outfit-editorial text-[11px] text-zinc-400 uppercase block tracking-wider mb-1">
                  MOTOR ARCHITECTURE
                </span>
                <h3 className="brutal text-xl text-white font-black uppercase">
                  Select Powertrain
                </h3>
              </div>

              {/* Selector List */}
              <div className="space-y-3">
                {engines.map((eng) => (
                  <button
                    key={eng.id}
                    disabled={isPlaying && activeEngine !== eng.id}
                    onClick={() => {
                      setActiveEngine(eng.id);
                    }}
                    className={`w-full text-left p-4 border transition-all duration-300 relative rounded-sm ${
                      activeEngine === eng.id
                        ? 'bg-zinc-900/90 text-white shadow-[0_0_20px_rgba(0,0,0,0.8)]'
                        : 'bg-black border-white/5 text-zinc-400 hover:text-zinc-200 hover:border-white/15'
                    } ${
                      isPlaying && activeEngine !== eng.id ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
                    }`}
                    style={{
                      borderColor: activeEngine === eng.id ? eng.accentColor : undefined
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="outfit-editorial text-[11px] font-bold uppercase tracking-wider">
                        {eng.name}
                      </span>
                      {activeEngine === eng.id && (
                        <span 
                          className="w-1.5 h-1.5 rounded-full animate-pulse" 
                          style={{ backgroundColor: eng.accentColor }}
                        />
                      )}
                    </div>
                    <span className="block outfit-editorial text-[7px] text-zinc-600 uppercase mt-1 leading-normal">
                      {eng.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Master Toggle Power Button */}
            <div>
              {isPlaying ? (
                <button
                  onClick={stopSynthesis}
                  className="w-full py-4 bg-[#ff2a2a] hover:bg-[#ff4d4d] text-white rounded-sm outfit-editorial text-[11px] uppercase font-bold tracking-widest transition-all duration-300 shadow-[0_0_15px_rgba(255,42,42,0.3)] cursor-pointer flex items-center justify-center gap-2"
                >
                  <VolumeX className="w-4 h-4 animate-spin" /> DISENGAGE SYSTEM
                </button>
              ) : (
                <button
                  onClick={startSynthesis}
                  className="w-full py-4 bg-white hover:bg-zinc-200 text-black rounded-sm outfit-editorial text-[11px] uppercase font-bold tracking-widest transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Volume2 className="w-4 h-4" /> IGNITION SYSTEM [START]
                </button>
              )}
            </div>

          </div>

          {/* Bento Center: Large Live Oscilloscope Visualizer & Gear Box */}
          <div className="lg:col-span-5 bg-black border border-white/10 p-6 flex flex-col justify-between relative overflow-hidden">
            
            {/* Outline accent representing precision camera lines */}
            <div 
              className="absolute top-0 right-10 w-24 h-[1px] transition-colors duration-500" 
              style={{ backgroundColor: currentEngine.accentColor }}
            />

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="outfit-editorial text-[11px] text-zinc-300 uppercase tracking-widest flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" style={{ color: currentEngine.accentColor }} />
                  ACOUSTIC SPECTRUM WAVEFORM
                </span>
                <span className="outfit-editorial text-[11px] text-zinc-400 font-mono">
                  ACTIVE_LINK_OK
                </span>
              </div>

              {/* Large Oscilloscope screen */}
              <div className="h-44 w-full bg-[#050505] rounded-sm overflow-hidden relative border border-white/5">
                {!isPlaying && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2 opacity-55">
                    <span className="outfit-editorial text-[11px] text-zinc-600 tracking-widest uppercase">
                      SYSTEM DISENGAGED // WAVEFORM MUTED
                    </span>
                    <span className="outfit-editorial text-[6px] text-zinc-700 uppercase">
                      PRESS IGNITION TO ENGAGE ACOUSTIC LOOPS
                    </span>
                  </div>
                )}
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={176}
                  className="w-full h-full block"
                />
              </div>
            </div>

            {/* Gearbox Panel */}
            <div className="mt-6 space-y-4">
              <span className="outfit-editorial text-[11px] text-zinc-400 uppercase block tracking-wider">
                TRANSMISSION GEAR_BAY
              </span>
              
              <div className="grid grid-cols-6 gap-2">
                {[1, 2, 3, 4, 5, 6].map((g) => (
                  <div
                    key={g}
                    className={`py-2 text-center rounded-sm border transition-all duration-300 font-mono text-[11px] ${
                      activeGear === g
                        ? 'bg-[#141414] border-white text-white font-black'
                        : 'bg-black border-white/5 text-zinc-600'
                    }`}
                  >
                    G{g}
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  disabled={!isPlaying || isShifting || activeGear >= 6}
                  onClick={triggerGearShift}
                  className="flex-1 py-3 border border-white/10 hover:border-white/30 hover:bg-white/10 text-white outfit-editorial text-[11px] uppercase font-bold tracking-widest transition-all duration-300 rounded-sm cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isShifting ? 'SHIFTING...' : 'DCT UPSHIFT [GEAR +]'}
                </button>
                <button
                  disabled={!isPlaying || activeGear <= 1}
                  onClick={() => setActiveGear(prev => Math.max(1, prev - 1))}
                  className="py-3 px-4 border border-white/10 hover:border-white/30 hover:bg-white/5 text-zinc-300 hover:text-white outfit-editorial text-[11px] uppercase transition-all duration-300 rounded-sm cursor-pointer disabled:opacity-30"
                >
                  DOWNSHIFT
                </button>
              </div>
            </div>

          </div>

          {/* Bento Right: Throttle Controller & Specs */}
          <div className="lg:col-span-3 bg-[#171717]/60 border border-white/20 p-6 flex flex-col justify-between space-y-6">
            
            <div className="space-y-6">
              <div>
                <span className="outfit-editorial text-[11px] text-zinc-400 uppercase block tracking-wider mb-1">
                  THROTTLE COMMAND
                </span>
                <h4 className="brutal text-lg text-white font-black tracking-tight uppercase">
                  Rev Load
                </h4>
              </div>

              {/* Throttle Slider dial */}
              <div className="space-y-4 bg-black/60 border border-white/10 p-4 rounded-sm">
                <div className="flex items-center justify-between">
                  <span className="outfit-editorial text-[11px] text-zinc-300 uppercase tracking-widest">
                    THROTTLE POSITION
                  </span>
                  <span className="outfit-editorial text-[11px] font-mono text-white font-black">
                    {throttle}%
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="outfit-editorial text-[6px] text-zinc-600 font-bold">IDLE</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="2"
                    value={throttle}
                    onChange={(e) => setThrottle(parseInt(e.target.value))}
                    disabled={!isPlaying}
                    className="flex-1 accent-white h-[2px] bg-zinc-800 rounded-lg appearance-none cursor-pointer disabled:opacity-30"
                    style={{
                      accentColor: isPlaying ? currentEngine.accentColor : undefined
                    }}
                  />
                  <span className="outfit-editorial text-[6px] text-zinc-600 font-bold" style={{ color: isPlaying && throttle > 85 ? currentEngine.accentColor : undefined }}>R_LINE</span>
                </div>

                {/* Instant rev spike tap trigger button */}
                <button
                  onMouseDown={() => {
                    if (isPlaying) setThrottle(95);
                  }}
                  onMouseUp={() => {
                    if (isPlaying) setThrottle(0);
                  }}
                  onMouseLeave={() => {
                    if (isPlaying) setThrottle(0);
                  }}
                  onTouchStart={() => {
                    if (isPlaying) setThrottle(95);
                  }}
                  onTouchEnd={() => {
                    if (isPlaying) setThrottle(0);
                  }}
                  disabled={!isPlaying}
                  className="w-full py-2 bg-zinc-900 hover:bg-zinc-800 active:bg-white active:text-black border border-white/5 text-zinc-300 rounded-sm outfit-editorial text-[11px] uppercase font-bold tracking-widest transition-colors duration-150 disabled:opacity-30"
                >
                  TAP THROTTLE PEDAL [REV]
                </button>
              </div>

              {/* Technical Acoustic readout parameters */}
              <div className="space-y-3 pt-2">
                <span className="outfit-editorial text-[11px] text-zinc-400 uppercase block tracking-wider">
                  REAL-TIME MATRIX ENGINE
                </span>
                <div className="space-y-2 outfit-editorial text-[11px] text-zinc-300">
                  <div className="flex justify-between">
                    <span>SYNTHESIS RATE:</span>
                    <span className="text-white font-bold font-mono">48.0 KHZ</span>
                  </div>
                  <div className="flex justify-between">
                    <span>FUNDAMENTAL FREQ:</span>
                    <span className="text-white font-bold font-mono">{(currentEngine.baseFreq * (1 + (throttle / 100) * 1.8 * (1 + (activeGear - 1) * 0.15))).toFixed(1)} HZ</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ACCENT COLOR:</span>
                    <span className="font-bold uppercase" style={{ color: currentEngine.accentColor }}>{currentEngine.id} COLOR_MATRIX</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Micro verification badge */}
            <div className="flex items-center gap-2 border-t border-white/10 pt-4 text-[11px] outfit-editorial text-zinc-400 uppercase">
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-600" />
              <span>STEREO SYNTHESIS APPROVED</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
