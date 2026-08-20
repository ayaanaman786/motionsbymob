import React, { useState, useEffect } from 'react';
import MOBLogo from './MOBLogo';
import { NAVIGATION_LINKS } from '../data';
import { Menu, X, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollTo = (id: string) => {
    setIsOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header className={`fixed inset-x-0 transition-all duration-300 ${isOpen ? 'z-50' : 'z-40'} ${
        isScrolled 
          ? 'top-0 bg-black/95 backdrop-blur-md py-3.5 border-b border-white/10' 
          : 'top-8 md:top-12 bg-black/85 backdrop-blur-md py-4 border-b border-white/5'
      }`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
          
          {/* Left: Horizontal Brand Logo Badge */}
          <a href="#" className="flex items-center gap-1 group">
            <MOBLogo variant="horizontal" className="scale-95 group-hover:scale-100 transition-transform duration-300" />
          </a>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {NAVIGATION_LINKS.map((link) => (
              <button
                key={link.label}
                onClick={() => handleScrollTo(link.href.slice(1))}
                className="outfit-editorial text-[11px] uppercase text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer relative group py-2"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white group-hover:w-full transition-all duration-300" />
              </button>
            ))}
          </nav>

          {/* Right: Consultation Trigger */}
          <div className="hidden lg:flex items-center">
            <button
              onClick={() => window.dispatchEvent(new Event('open-chat'))}
              className="outfit-editorial text-[10px] text-white uppercase tracking-[0.2em] border border-white/20 hover:border-white px-5 py-2 transition-all duration-300"
            >
              INQUIRE
            </button>
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer p-1"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>
      </header>

      {/* Mobile Drawer Overlay (Concept 1: Premium Right Slide-out Drawer) */}
      <AnimatePresence>
        {isOpen && (
          <div key="mobile-drawer-portal" className="fixed inset-0 z-[100] md:hidden">
            {/* Dark Backdrop with soft blur and click-to-close */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            />

            {/* Slide-out Panel from Right */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', ease: 'easeOut', duration: 0.25 }}
              className="absolute top-0 right-0 h-full w-[80vw] sm:w-[320px] bg-black border-l border-white/10 shadow-2xl flex flex-col justify-between p-6 overflow-y-auto"
            >
              {/* Header inside drawer */}
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-8">
                  <MOBLogo variant="horizontal" className="scale-90 origin-left" />
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-white hover:rotate-90 transition-all duration-300 p-1.5 bg-white/5 hover:bg-white/10 rounded-full cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>



                {/* Navigation Links inside Drawer */}
                <nav className="flex flex-col gap-2">
                  {NAVIGATION_LINKS.map((link, idx) => (
                    <motion.button
                      key={link.label}
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + idx * 0.04 }}
                      onClick={() => handleScrollTo(link.href.slice(1))}
                      className="group flex items-center justify-between py-3 px-4 rounded-sm border border-transparent hover:border-white/5 hover:bg-white/2 transition-all duration-300 text-left cursor-pointer w-full"
                    >
                      <span className="outfit-editorial text-[11px] tracking-[0.25em] text-gray-300 group-hover:text-white uppercase transition-colors duration-300">
                        {link.label}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-transparent group-hover:bg-white group-hover:shadow-[0_0_8px_white] transition-all duration-300" />
                    </motion.button>
                  ))}
                </nav>
              </div>

              {/* Mobile footer within drawer */}
              <div className="pt-8 border-t border-white/5 flex flex-col gap-6">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    window.dispatchEvent(new Event('open-chat'));
                  }}
                  className="w-full outfit-editorial text-[10px] text-white uppercase tracking-[0.2em] border border-white/20 hover:border-white py-3 transition-all duration-300"
                >
                  INQUIRE
                </button>
                <div className="text-[8px] text-zinc-600 uppercase tracking-widest text-center">
                  &copy; {new Date().getFullYear()} MOTIONS BY MOB.
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
