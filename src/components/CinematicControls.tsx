import React, { useState, useEffect, useRef } from 'react';
import { Sliders, Volume2, VolumeX, Eye, HelpCircle, Activity, X } from 'lucide-react';

interface CinematicControlsProps {
  lutGrade: string;
  setLutGrade: (lut: string) => void;
  aspectRatio: string;
  setAspectRatio: (ratio: string) => void;
}

// Low-frequency V8 mechanical drone synthesizer using HTML5 Web Audio API
class V8Drone {
  private ctx: AudioContext | null = null;
  private osc1: OscillatorNode | null = null;
  private osc2: OscillatorNode | null = null;
  private subOsc: OscillatorNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private gainNode: GainNode | null = null;
  private lfo: OscillatorNode | null = null;
  private lfoGain: GainNode | null = null;
  public analyser: AnalyserNode | null = null;

  start() {
    try {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      this.osc1 = this.ctx.createOscillator();
      this.osc2 = this.ctx.createOscillator();
      this.subOsc = this.ctx.createOscillator();
      this.filter = this.ctx.createBiquadFilter();
      this.gainNode = this.ctx.createGain();
      this.analyser = this.ctx.createAnalyser();
      
      this.lfo = this.ctx.createOscillator();
      this.lfoGain = this.ctx.createGain();

      // Configure frequencies for a deep, satisfying V8 engine idle hum
      this.osc1.type = 'sawtooth';
      this.osc1.frequency.value = 38; // 38Hz mechanical hum

      this.osc2.type = 'triangle';
      this.osc2.frequency.value = 38.6; // Slight detune for phasing rumble

      this.subOsc.type = 'sine';
      this.subOsc.frequency.value = 19; // Ultra low sub rumble

      // LFO for periodic idling throttle sweep (rev variation)
      this.lfo.type = 'sine';
      this.lfo.frequency.value = 1.6; // 1.6Hz motor vibration
      this.lfoGain.gain.value = 12; // frequency sweep depth

      // Warm lowpass filter to keep sound rich, soft, and deep
      this.filter.type = 'lowpass';
      this.filter.frequency.value = 75; // filter high noise
      this.filter.Q.value = 2.5;

      // Connect Sweeps
      this.lfo.connect(this.lfoGain);
      this.lfoGain.connect(this.filter.frequency);

      // Connect sources to filter
      this.osc1.connect(this.filter);
      this.osc2.connect(this.filter);
      this.subOsc.connect(this.filter);

      // Connect filter to analyser for the oscilloscope visualizer
      this.filter.connect(this.analyser);

      // Connect to master gain and destination
      this.analyser.connect(this.gainNode);
      this.gainNode.connect(this.ctx.destination);
      
      // Default to an extremely low safe volume
      this.gainNode.gain.setValueAtTime(0.08, this.ctx.currentTime);

      this.osc1.start();
      this.osc2.start();
      this.subOsc.start();
      this.lfo.start();
    } catch (err) {
      console.warn('Web Audio V8 engine synthesis failed to initialize:', err);
    }
  }

  setVolume(vol: number) {
    if (this.gainNode && this.ctx) {
      // safe multiplier to prevent high volume outputs
      const targetVol = vol * 0.18;
      this.gainNode.gain.setValueAtTime(targetVol, this.ctx.currentTime);
    }
  }

  stop() {
    try {
      this.osc1?.stop();
      this.osc2?.stop();
      this.subOsc?.stop();
      this.lfo?.stop();
      this.ctx?.close();
    } catch (e) {
      console.log(e);
    }
  }
}

export default function CinematicControls({
  lutGrade,
  setLutGrade,
  aspectRatio,
  setAspectRatio
}: CinematicControlsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const [showTooltip, setShowTooltip] = useState(true);

  const synthRef = useRef<V8Drone | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Sound Engine Setup
  useEffect(() => {
    return () => {
      if (synthRef.current) {
        synthRef.current.stop();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const toggleAudio = () => {
    if (isAudioPlaying) {
      synthRef.current?.stop();
      synthRef.current = null;
      setIsAudioPlaying(false);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    } else {
      const drone = new V8Drone();
      drone.start();
      drone.setVolume(volume);
      synthRef.current = drone;
      setIsAudioPlaying(true);
      drawOscilloscope(drone);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    synthRef.current?.setVolume(vol);
  };

  // Live Oscilloscope Visualizer loop
  const drawOscilloscope = (drone: V8Drone) => {
    const canvas = canvasRef.current;
    if (!canvas || !drone.analyser) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = drone.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!canvas || !drone.analyser) return;
      animationFrameRef.current = requestAnimationFrame(draw);

      drone.analyser.getByteTimeDomainData(dataArray);

      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw target mechanical grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(canvas.width / 2, canvas.height);
      ctx.stroke();

      // Draw active electrical/motor wave
      ctx.strokeStyle = '#ff2a2a';
      ctx.shadowColor = '#ff2a2a';
      ctx.shadowBlur = 4;
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      const sliceWidth = canvas.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
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
      ctx.shadowBlur = 0; // reset
    };

    draw();
  };

  const luts = [
    { id: 'raw', name: 'RAW SENSOR', desc: 'Slight uncompressed profile' },
    { id: 'aces', name: 'ACES CINEMA', desc: 'Lustrous contrast & warm flare' },
    { id: 'monolith', name: 'MONOLITH', desc: 'Brutalist cold teal & concrete' },
    { id: 'stealth', name: 'STEALTH MONO', desc: 'Aggressive monochrome & red' },
  ];

  const aspectRatios = [
    { id: 'free', name: 'UNBOUND', desc: 'Default layout' },
    { id: 'anamorphic', name: '2.39:1', desc: 'Anamorphic crop' },
    { id: 'standard', name: '16:9', desc: 'Cinema widescreen' },
    { id: 'vertical', name: '9:16', desc: 'Social vertical' },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 select-none">
      {/* Mini introductory floating badge */}
      {showTooltip && !isOpen && (
        <div className="absolute bottom-16 right-0 w-64 bg-zinc-900/90 border border-white/20 p-3 shadow-2xl rounded-sm transition-all duration-300">
          <div className="flex items-start justify-between">
            <span className="outfit-editorial text-[11px] text-[#ff2a2a] tracking-widest uppercase">
              [ TECHNICAL PORTFOLIO SUITE ]
            </span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowTooltip(false);
              }}
              className="text-zinc-600 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          <p className="outfit-editorial text-[11px] text-zinc-300 uppercase leading-relaxed mt-1.5">
            TUNE ASPECT RATIOS, SIMULATE CAMERA LUT COLOUR WORKFLOWS, AND ENGAGE THE ENGINE drone.
          </p>
          <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-zinc-900/90 border-r border-b border-white/10 rotate-45" />
        </div>
      )}

      {/* Primary Floating Action Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setShowTooltip(false);
        }}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer border ${
          isOpen
            ? 'bg-[#ff2a2a] border-[#ff2a2a] text-white rotate-90 shadow-[0_0_20px_#ff2a2a]'
            : 'bg-zinc-900/90 hover:bg-black border-white/15 text-zinc-300 hover:text-white shadow-[0_4px_24px_rgba(0,0,0,0.8)]'
        }`}
      >
        <Sliders className="w-5 h-5" />
      </button>

      {/* Expanded Tuning deck */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 bg-[#171717]/95 border border-white/20 p-5 shadow-[0_10px_40px_rgba(0,0,0,0.9)] backdrop-blur-md rounded-sm space-y-6">
          
          {/* Header indicator */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ff2a2a] animate-pulse" />
              <span className="outfit-editorial text-[11px] text-white tracking-widest uppercase font-bold">
                CINEMATIC TUNING DECK
              </span>
            </div>
            <span className="outfit-editorial text-[7px] text-zinc-400 uppercase">
              VER_2.36
            </span>
          </div>

          {/* Module 1: LUT Color grading filters */}
          <div className="space-y-2">
            <label className="outfit-editorial text-[11px] text-zinc-400 uppercase block">
              A // LUT COLOR_GRADE FILTER
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {luts.map((lut) => (
                <button
                  key={lut.id}
                  onClick={() => setLutGrade(lut.id)}
                  className={`py-1.5 px-3 text-left border rounded-sm transition-all duration-200 cursor-pointer ${
                    lutGrade === lut.id
                      ? 'bg-[#ff2a2a]/10 border-[#ff2a2a] text-white'
                      : 'bg-black border-white/5 text-zinc-400 hover:text-zinc-200 hover:border-white/15'
                  }`}
                >
                  <div className="outfit-editorial text-[11px] font-bold tracking-wider">{lut.name}</div>
                  <div className="outfit-editorial text-[11px] text-zinc-400 mt-0.5">{lut.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Module 2: Aspect Ratios framing overlay */}
          <div className="space-y-2">
            <label className="outfit-editorial text-[11px] text-zinc-400 uppercase block">
              B // ASPECT RATIO BOUNDS
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {aspectRatios.map((ratio) => (
                <button
                  key={ratio.id}
                  onClick={() => setAspectRatio(ratio.id)}
                  className={`py-1.5 px-3 text-left border rounded-sm transition-all duration-200 cursor-pointer ${
                    aspectRatio === ratio.id
                      ? 'bg-[#ff2a2a]/10 border-[#ff2a2a] text-white'
                      : 'bg-black border-white/5 text-zinc-400 hover:text-zinc-200 hover:border-white/15'
                  }`}
                >
                  <div className="outfit-editorial text-[11px] font-bold tracking-wider">{ratio.name}</div>
                  <div className="outfit-editorial text-[11px] text-zinc-400 mt-0.5">{ratio.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Module 3: V8 Engine sound generator */}
          <div className="space-y-3 bg-black/60 border border-white/5 p-3 rounded-sm">
            <div className="flex items-center justify-between">
              <span className="outfit-editorial text-[11px] text-zinc-300 uppercase tracking-widest flex items-center gap-1.5">
                <Activity className="w-3 h-3 text-[#ff2a2a]" />
                C // V8 ENGINE DRONE
              </span>
              <button
                onClick={toggleAudio}
                className={`py-1 px-2 border rounded-sm text-[11px] outfit-editorial tracking-widest uppercase transition-all duration-200 cursor-pointer flex items-center gap-1 ${
                  isAudioPlaying
                    ? 'bg-[#ff2a2a] border-[#ff2a2a] text-white animate-pulse'
                    : 'bg-zinc-900 border-white/10 text-zinc-300 hover:text-white'
                }`}
              >
                {isAudioPlaying ? (
                  <>
                    <Volume2 className="w-2.5 h-2.5" /> RUNNING
                  </>
                ) : (
                  <>
                    <VolumeX className="w-2.5 h-2.5" /> OFFLINE
                  </>
                )}
              </button>
            </div>

            {/* Oscilloscope canvas display */}
            <div className="h-10 w-full bg-zinc-900/80 rounded-sm overflow-hidden relative border border-white/5">
              {!isAudioPlaying && (
                <div className="absolute inset-0 flex items-center justify-center outfit-editorial text-[11px] text-zinc-400 tracking-widest">
                  OSCILLOSCOPE_OFFLINE
                </div>
              )}
              <canvas
                ref={canvasRef}
                width={270}
                height={40}
                className="w-full h-full block"
              />
            </div>

            {/* Volume control */}
            <div className="flex items-center gap-3">
              <span className="outfit-editorial text-[11px] text-zinc-400 uppercase">VOL</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={handleVolumeChange}
                disabled={!isAudioPlaying}
                className="flex-1 accent-[#ff2a2a] h-[2px] bg-zinc-800 rounded-lg appearance-none cursor-pointer disabled:opacity-30"
              />
              <span className="outfit-editorial text-[11px] text-zinc-300 font-bold w-6 text-right">
                {Math.round(volume * 100)}%
              </span>
            </div>
          </div>

          {/* Micro spec guidelines indicator */}
          <div className="outfit-editorial text-[7px] text-zinc-600 leading-normal border-t border-white/5 pt-2 flex justify-between">
            <span>PROJ_COMPLIANCE: ACTIVE</span>
            <span>MOTIONSBYMOB // LUXE</span>
          </div>

        </div>
      )}
    </div>
  );
}
