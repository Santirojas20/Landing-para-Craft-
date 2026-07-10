import React from 'react';
import { HERO_IMAGE_PATH } from '../data';
import { motion } from 'motion/react';
import { ArrowDown } from 'lucide-react';

interface HeroProps {
  onDiscoverClick: () => void;
  title: string;
  subtitle: string;
  description: string;
  tag: string;
  image: string;
  isAdminMode?: boolean;
  onEditClick?: () => void;
}

export default function Hero({ 
  onDiscoverClick,
  title,
  subtitle,
  description,
  tag,
  image,
  isAdminMode = false,
  onEditClick
}: HeroProps) {
  return (
    <section id="hero-section" className="relative bg-brand-cream overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Main Card Grid */}
        <div className="relative rounded-none overflow-hidden bg-brand-dark min-h-[580px] sm:min-h-[640px] md:min-h-[720px] flex items-center border border-brand-dark/20">
          
          {/* Admin Edit overlay indicator */}
          {isAdminMode && (
            <button
              onClick={onEditClick}
              className="absolute top-4 left-4 z-30 bg-brand-accent text-brand-dark border border-brand-dark font-sans text-[10px] uppercase font-black px-3 py-1.5 flex items-center gap-1.5 shadow-lg animate-pulse hover:bg-white transition-colors cursor-pointer"
            >
              <span>✏️ Editar Banner Hero</span>
            </button>
          )}

          {/* Background Image Container */}
          <div className="absolute inset-0 w-full h-full">
            <img
              src={image}
              alt="CRAFT+ Colección Exclusiva"
              className="w-full h-full object-cover object-[center_20%] md:object-[center_30%]"
              referrerPolicy="no-referrer"
            />
            {/* Elegant vignette gradient overlays to ensure text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/85 via-brand-dark/45 to-transparent sm:from-brand-dark/75" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/60 via-transparent to-brand-dark/30" />
          </div>

          {/* Floating Luxury Elements for aesthetic detail */}
          <div className="absolute top-6 right-6 hidden md:block">
            <div className="backdrop-blur-md bg-brand-cream/10 border border-brand-cream/20 rounded-none px-4 py-2 text-brand-cream text-xs tracking-widest uppercase font-serif">
              Importado de Europa y EE.UU.
            </div>
          </div>

          {/* Content Area */}
          <div className="relative z-10 w-full max-w-xl px-6 sm:px-12 md:px-16 text-brand-cream py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2">
                <span className="h-px w-8 bg-brand-accent" />
                <span className="text-xs sm:text-sm font-light tracking-[0.3em] text-brand-cream/80 uppercase">
                  {tag}
                </span>
              </div>

              <h1
                className="text-4xl sm:text-5xl md:text-6xl font-normal leading-tight tracking-tight text-brand-cream font-serif text-left"
              >
                {title.includes(subtitle) ? (
                  // If subtitle is part of title, output natively
                  title
                ) : (
                  <>
                    {title.replace(subtitle, '')}
                    <br />
                    <span className="italic font-light text-brand-accent">{subtitle}</span>
                  </>
                )}
              </h1>

              <p className="text-sm sm:text-base text-brand-cream/80 font-light leading-relaxed max-w-md text-left">
                {description}
              </p>

              <div className="pt-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <button
                  id="hero-cta-discover-btn"
                  onClick={onDiscoverClick}
                  className="bg-brand-cream hover:bg-brand-beige text-brand-dark font-serif font-bold px-8 py-4 text-xs sm:text-sm tracking-[0.18em] uppercase transition-all duration-300 rounded-none hover:-translate-y-0.5"
                >
                  Descubrir Ahora
                </button>
                
                <button
                  onClick={onDiscoverClick}
                  className="group flex items-center gap-2 text-xs sm:text-sm text-brand-cream/80 hover:text-brand-cream transition-colors py-3"
                >
                  <span className="font-serif italic tracking-wide">Ver catálogo actual</span>
                  <ArrowDown size={14} className="group-hover:translate-y-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          </div>

          {/* Days banner floating on the bottom right of the hero */}
          <div className="absolute bottom-6 right-6 hidden sm:flex items-center gap-3 backdrop-blur-md bg-brand-dark/60 border border-brand-cream/10 rounded-none p-4 text-brand-cream">
            <div className="w-2 h-2 bg-brand-accent rounded-full animate-pulse" />
            <div>
              <p className="text-[10px] uppercase tracking-widest text-brand-cream/60">Próxima renovación de stock</p>
              <p className="text-xs font-serif italic">Cada 15 días • Envío inmediato en Quito</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
