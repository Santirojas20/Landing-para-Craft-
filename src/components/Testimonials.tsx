import React, { useState, useEffect } from 'react';
import { Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TestimonialItem {
  id: number;
  quote: string;
  author: string;
  location: string;
}

interface TestimonialsProps {
  items: TestimonialItem[];
  isAdminMode?: boolean;
  onEditClick?: () => void;
}

export default function Testimonials({ items, isAdminMode = false, onEditClick }: TestimonialsProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Safely clamp activeIndex if length changes
  useEffect(() => {
    if (activeIndex >= items.length) {
      setActiveIndex(Math.max(0, items.length - 1));
    }
  }, [items.length, activeIndex]);

  useEffect(() => {
    if (items.length === 0) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [items.length]);

  if (items.length === 0) return null;

  return (
    <section id="testimonials-section" className="relative bg-neutral-50/70 border-t border-neutral-100 py-16 px-4">
      
      {/* Admin Edit overlay indicator */}
      {isAdminMode && (
        <button
          onClick={onEditClick}
          className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-30 bg-brand-accent text-brand-dark border border-brand-dark font-sans text-[9px] uppercase font-bold px-2.5 py-1 flex items-center gap-1 shadow-md hover:bg-white transition-colors cursor-pointer"
        >
          <span>✏️ Editar Testimonios</span>
        </button>
      )}

      <div className="max-w-3xl mx-auto text-center space-y-6">
        {/* Quote Icon */}
        <div className="flex justify-center">
          <Quote size={32} className="text-neutral-300 stroke-[1.5] rotate-180" />
        </div>

        {/* Carousel Content */}
        <div className="min-h-[100px] relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <p className="text-sm sm:text-base md:text-lg text-neutral-700 font-light leading-relaxed italic max-w-2xl mx-auto">
                "{items[activeIndex]?.quote}"
              </p>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-800 block">
                  — {items[activeIndex]?.author}
                </span>
                <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-mono">
                  {items[activeIndex]?.location}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel Dots */}
        <div className="flex justify-center gap-2 pt-2">
          {items.map((t, idx) => (
            <button
              key={t.id}
              onClick={() => setActiveIndex(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all focus:outline-none ${
                activeIndex === idx ? 'bg-neutral-800 w-5' : 'bg-neutral-200 hover:bg-neutral-300'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
