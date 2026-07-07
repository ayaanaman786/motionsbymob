import React, { useState } from 'react';
import MOBLogo from './MOBLogo';
import { Mail, ArrowUpRight, Copy, Check, Instagram, Youtube, Phone } from 'lucide-react';

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const contactEmail = 'mobicoby@gmail.com';

  const handleCopy = () => {
    navigator.clipboard.writeText(contactEmail.toLowerCase());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const socialChannels = [
    {
      name: 'INSTAGRAM',
      handle: '@motionsbymob',
      url: 'https://instagram.com/motionsbymob',
      icon: <Instagram className="w-4 h-4 text-[#a50000]" />,
      desc: 'Daily visual notes, behind-the-scenes logs, and quick teasers.'
    },
    {
      name: 'WHATSAPP',
      handle: '+92 310 6552666',
      url: 'https://wa.me/923106552666',
      icon: <Phone className="w-4 h-4 text-[#a50000]" />,
      desc: 'Direct dispatch line for bookings and urgent inquiries.'
    }
  ];

  return (
    <section id="contact" className="bg-black py-24 md:py-32 px-4 md:px-8 relative border-t border-white/10 overflow-hidden">
      {/* Background soft red glow representing taillights in fog */}
      <div className="absolute bottom-0 inset-x-0 h-[400px] bg-gradient-to-t from-[#a50000]/3 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Panel: Slogans and details */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <div className="outfit-editorial text-[10px] text-[#a50000] mb-2 uppercase">
                [ EST_04 // COMMUNICATIONS ]
              </div>
              <h2 
                className="brutal text-3xl md:text-5xl tracking-tighter text-white uppercase font-black"
              >
                Channels<span className="text-[#a50000]">.</span>
              </h2>
            </div>

            <p 
              className="outfit-editorial text-xs sm:text-sm text-zinc-400 uppercase leading-relaxed max-w-md"
            >
              motionsbymob is an independent creative studio and digital archive documenting high-performance SUV culture, pristine factory proportions, and understated OEM+ design systems.
            </p>

            <div className="pt-6 border-t border-white/10 space-y-6">
              <div className="space-y-2">
                <span className="outfit-editorial text-[8px] text-zinc-500 uppercase block">
                  COORDINATION ACCESS
                </span>
                <p className="outfit-editorial text-[11px] text-zinc-300 leading-relaxed uppercase">
                  We are open to strategic collaborations, custom creative direction, and high-fidelity video curation projects with luxury brands, heritage syndicates, and premium collectors.
                </p>
              </div>

              {/* Status coordinate */}
              <div className="flex items-center gap-3 py-2 px-3 bg-[#141414]/40 border border-white/5 rounded-sm inline-flex">
                <span className="w-1.5 h-1.5 bg-[#a50000] rounded-full animate-ping" />
                <span className="outfit-editorial text-[8px] text-zinc-400 uppercase">
                  RECEPTION DESK: ACTIVE // COLD COMMS LOCKED
                </span>
              </div>
            </div>

            {/* Micro horizontal logo */}
            <div className="pt-8 border-t border-white/10 hidden lg:block">
              <MOBLogo variant="horizontal" className="opacity-65" />
            </div>
          </div>

          {/* Right Panel: Clean Interactive Connect Panel */}
          <div className="lg:col-span-7 bg-zinc-950/45 border border-white/10 p-8 md:p-10 relative">
            
            {/* Outline accent representing precision camera lines */}
            <div className="absolute top-0 right-10 w-24 h-[1px] bg-[#a50000] shadow-[0_0_8px_#a50000]" />
            
            <div className="mb-8">
              <div className="outfit-editorial text-[9px] text-[#a50000] mb-1">
                [ DIRECT DISPATCH CHANNELS ]
              </div>
              <h3 className="brutal text-2xl tracking-tight text-white mb-4">
                Secure Connection<span className="text-[#a50000]">_</span>
              </h3>
            </div>

            {/* Social Grid */}
            <div className="space-y-4 mb-8">
              {socialChannels.map((chan, idx) => (
                <a
                  key={idx}
                  href={chan.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group block p-5 bg-black/60 border border-white/10 hover:border-[#a50000]/40 hover:bg-[#a50000]/3 transition-all duration-300 relative overflow-hidden cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-sm bg-zinc-950 border border-white/10 flex items-center justify-center transition-colors group-hover:border-[#a50000]/30">
                        {chan.icon}
                      </div>
                      <div>
                        <span className="outfit-editorial text-[8px] text-zinc-500 uppercase block tracking-wider">
                          CHANNEL_0{idx + 1} // {chan.name}
                        </span>
                        <h4 className="outfit-editorial text-[11px] font-bold text-white uppercase tracking-wider group-hover:text-[#a50000] transition-colors duration-200">
                          {chan.handle}
                        </h4>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-zinc-600 group-hover:text-[#a50000] transition-all duration-300 transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </div>
                  <p className="outfit-editorial text-[8px] text-zinc-400 uppercase mt-3 leading-relaxed max-w-md opacity-80">
                    {chan.desc}
                  </p>
                </a>
              ))}
            </div>

            {/* Email copying widget */}
            <div className="bg-black border border-white/10 p-6 rounded-sm relative">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="outfit-editorial text-[7px] text-zinc-500 uppercase">
                    ENCRYPTED MAIL CHASSIS
                  </span>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-[#a50000]" />
                    <span className="outfit-editorial text-[12px] text-white font-bold tracking-widest selection:bg-[#a50000]">
                      {contactEmail}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={handleCopy}
                  className={`w-full sm:w-auto py-2.5 px-5 rounded-sm outfit-editorial text-[9px] font-bold uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer border ${
                    copied
                      ? 'bg-[#a50000]/15 border-[#a50000] text-white'
                      : 'bg-white hover:bg-[#a50000] text-black hover:text-white border-white'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-white" /> ADDRESS COPY_OK
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" /> COPY COMMS ADDR
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Minimal Footer */}
        <div className="mt-24 pt-12 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-6 outfit-editorial text-[9px] text-zinc-500 uppercase">
          <div>
            &copy; {new Date().getFullYear()} MOTIONS BY MOB. ALL RIGHTS SECURED.
          </div>
          <div className="flex gap-6 text-zinc-400">
            <a href="https://instagram.com/motionsbymob" target="_blank" rel="noreferrer" className="hover:text-white transition-colors duration-200 cursor-pointer flex items-center gap-1">
              [ INSTAGRAM <ArrowUpRight className="w-2.5 h-2.5 text-[#a50000]" /> ]
            </a>
            <a href="https://wa.me/923106552666" target="_blank" rel="noreferrer" className="hover:text-white transition-colors duration-200 cursor-pointer flex items-center gap-1">
              [ WHATSAPP <ArrowUpRight className="w-2.5 h-2.5 text-[#a50000]" /> ]
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
