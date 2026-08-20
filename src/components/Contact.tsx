import React, { useState } from 'react';
import MOBLogo from './MOBLogo';
import { Mail, ArrowUpRight, Copy, CheckCircle2, Instagram, Phone } from 'lucide-react';

const CONTACT_LINKS = [
  {
    platform: 'Instagram',
    handle: '@motionsbymob',
    href: 'https://instagram.com/motionsbymob',
    icon: <Instagram className="w-4 h-4 text-white" />,
  },
  {
    platform: 'Direct Line',
    handle: '+92 310 6552666',
    href: 'https://wa.me/923106552666',
    icon: <Phone className="w-4 h-4 text-white" />,
  }
];

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const contactEmail = 'mobicoby@gmail.com';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(contactEmail.toLowerCase());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" className="bg-[#050505] py-24 md:py-32 px-4 md:px-8 relative overflow-hidden border-t border-white/5">
      
      {/* Dark Ambient Floor gradient */}
      <div className="absolute bottom-0 inset-x-0 h-[400px] bg-gradient-to-t from-white/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Left Column: Direct Links & Brand Info */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="outfit-editorial text-xs text-zinc-500 mb-4 uppercase tracking-[0.3em]">
                — INQUIRIES
              </div>
              <h2 className="brutal text-3xl md:text-5xl tracking-tight text-white uppercase font-light mb-8">
                Channels.
              </h2>
              
              <div className="flex items-center gap-3 outfit-editorial text-[11px] text-zinc-400 uppercase tracking-widest mb-12">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                <span>ACCEPTING COMMISSIONED WORKS</span>
              </div>
            </div>

            <div className="hidden lg:block space-y-2 outfit-editorial text-[10px] text-zinc-600 uppercase tracking-widest">
              <p>OPERATING GLOBALLY // BASED IN LAHORE</p>
              <p>AUTOMOTIVE CINEMATOGRAPHY & ARCHIVAL</p>
            </div>
          </div>

          {/* Right Column: Interactive Links & Email Copier */}
          <div className="lg:col-span-7 bg-[#090909]/60 border border-white/5 p-6 sm:p-10 relative">
            <div className="absolute top-0 right-10 w-24 h-[1px] bg-white/20" />
            
            <div className="flex flex-col h-full justify-between gap-12">
              
              {/* Top half: Quick links */}
              <div>
                <div className="outfit-editorial text-[10px] text-zinc-500 mb-2 uppercase tracking-[0.2em]">
                  — DIRECT COMMS
                </div>
                <div className="space-y-3">
                  {CONTACT_LINKS.map((link) => (
                    <a 
                      key={link.platform}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block p-5 bg-black border border-white/5 hover:border-white/20 hover:bg-white/5 transition-all duration-300 relative overflow-hidden cursor-pointer"
                    >
                      <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-sm bg-zinc-900 border border-white/10 flex items-center justify-center transition-colors group-hover:border-white/30">
                            {link.icon}
                          </div>
                          <div>
                            <h4 className="outfit-editorial text-[11px] font-medium text-white uppercase tracking-wider transition-colors duration-200">
                              {link.platform}
                            </h4>
                            <span className="outfit-editorial text-[10px] text-zinc-500 font-mono mt-0.5 block group-hover:text-zinc-400 transition-colors">
                              {link.handle}
                            </span>
                          </div>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-all duration-300 transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Bottom half: Primary Email Block */}
              <div className="pt-8 border-t border-white/5">
                <div className="outfit-editorial text-[10px] text-zinc-500 mb-4 uppercase tracking-[0.2em]">
                  — OFFICIAL INBOX
                </div>
                
                <div className="flex flex-col sm:flex-row items-stretch gap-3">
                  <div className="flex-1 bg-black border border-white/5 p-4 flex items-center gap-3">
                    <Mail className="w-3.5 h-3.5 text-zinc-400" />
                    <span className="outfit-editorial text-[12px] text-white font-medium tracking-widest selection:bg-white/20">
                      {contactEmail}
                    </span>
                  </div>
                  
                  <button
                    onClick={handleCopyEmail}
                    className={`px-6 py-4 border transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer uppercase outfit-editorial text-[10px] tracking-widest ${
                      copied 
                        ? 'bg-white/10 border-white text-white'
                        : 'bg-white hover:bg-zinc-200 text-black border-white'
                    }`}
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        COPIED
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        COPY ADDRESS
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
        
        {/* Mobile footer note */}
        <div className="mt-16 lg:hidden border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <div className="space-y-1 outfit-editorial text-[10px] text-zinc-600 uppercase tracking-widest">
            <p>OPERATING GLOBALLY</p>
            <p>BASED IN LAHORE, PK</p>
          </div>
          <div className="flex gap-4 outfit-editorial text-[10px] text-zinc-500 tracking-widest">
            <a href="https://instagram.com/motionsbymob" className="hover:text-white transition-colors flex items-center gap-1">
              INSTAGRAM <ArrowUpRight className="w-2.5 h-2.5 text-white" />
            </a>
            <a href="tel:+923106552666" className="hover:text-white transition-colors flex items-center gap-1">
              WHATSAPP <ArrowUpRight className="w-2.5 h-2.5 text-white" />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
