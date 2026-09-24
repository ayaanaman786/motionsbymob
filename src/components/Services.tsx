import React from 'react';
import { motion } from 'motion/react';
import { SERVICES_DATA } from '../data';

export default function Services() {
  return (
    <section id="services" className="py-32 bg-black relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        <div className="mb-20">
          <h2 className="outfit-editorial text-[10px] text-zinc-500 uppercase tracking-[0.4em] mb-4">
            AFFILIATIONS // SERVICES
          </h2>
          <h3 className="text-4xl md:text-6xl font-light tracking-tighter uppercase">
            ELEVATED <span className="text-zinc-600 italic">PARTNERSHIPS</span>
          </h3>
        </div>

        <div className="flex flex-col gap-32">
          {SERVICES_DATA.map((affiliation, index) => (
            <div key={affiliation.id} className={`flex flex-col ${index % 2 !== 0 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 lg:gap-24 items-center`}>
              
              {/* Image Grid */}
              <div className="w-full lg:w-1/2 grid grid-cols-2 gap-4">
                {affiliation.imageUrls.map((img, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: i * 0.2 }}
                    className={`relative overflow-hidden bg-zinc-900 ${i === 0 ? 'mt-12 aspect-[4/5]' : i === 1 ? 'aspect-[4/5]' : 'col-span-2 aspect-[21/9]'}`}
                  >
                    <img src={img} alt={`${affiliation.partnerName} service ${i+1}`} className="w-full h-full object-cover transition-opacity duration-700" />
                  </motion.div>
                ))}
              </div>

              {/* Text Content */}
              <div className="w-full lg:w-1/2">
                <motion.div 
                  initial={{ opacity: 0, x: index % 2 !== 0 ? 20 : -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <img src={affiliation.logoUrl} alt={affiliation.partnerName} className="h-24 mb-8 object-contain" />
                  <h4 className="text-2xl md:text-3xl font-light tracking-widest mb-6">
                    {affiliation.collaborationTitle}
                  </h4>
                  <p className="text-zinc-400 font-light leading-relaxed mb-10 max-w-lg">
                    {affiliation.description}
                  </p>
                  
                  <div className="space-y-6">
                    <div className="outfit-editorial text-[9px] text-zinc-600 uppercase tracking-[0.3em] border-b border-white/10 pb-2">
                      SERVICES OFFERED
                    </div>
                    <ul className="space-y-4">
                      {affiliation.services.map((service, i) => (
                        <li key={i} className="group">
                          <h5 className="text-white text-sm tracking-widest uppercase mb-1">{service.name}</h5>
                          {service.description && (
                            <p className="text-zinc-500 text-xs font-light">{service.description}</p>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
