import React, { useState } from 'react';
import { CRAFT_BOX_PATH } from '../data';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Heart, ShieldCheck, Gift } from 'lucide-react';

export default function ExperienceBanner() {
  const [isStoryOpen, setIsStoryOpen] = useState(false);

  return (
    <section id="experience-section" className="bg-white py-12 sm:py-16 border-t border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center rounded-2xl overflow-hidden bg-neutral-50/50 p-6 sm:p-8 md:p-12">
          {/* Left Side: Brand Packaging Image */}
          <div className="relative aspect-video sm:aspect-4/3 md:aspect-auto md:h-[380px] overflow-hidden rounded-xl shadow-md group">
            <img
              src={CRAFT_BOX_PATH}
              alt="Experiencia de Empaque CRAFT+"
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
            {/* Soft overlay */}
            <div className="absolute inset-0 bg-neutral-900/5 group-hover:bg-transparent transition-colors" />
          </div>

          {/* Right Side: Narrative */}
          <div className="space-y-5">
            <span className="text-[10px] sm:text-xs font-semibold tracking-[0.25em] text-neutral-400 uppercase block">
              Experiencia CRAFT+
            </span>

            <h3
              className="text-2xl sm:text-3xl font-normal leading-tight text-neutral-900"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Más que compras, <br />
              <span className="italic font-light text-neutral-600">es tu momento</span>.
            </h3>

            <p className="text-sm text-neutral-600 font-light leading-relaxed">
              Desde el primer clic hasta que lo recibes en tus manos. Así de especial. Cuidamos cada detalle del empaque para que abrir tu pedido de CRAFT+ sea una experiencia de lujo en sí misma, con tarjetas personalizadas y aromas florales importados.
            </p>

            <div className="pt-2">
              <button
                id="know-more-experience-btn"
                onClick={() => setIsStoryOpen(true)}
                className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-neutral-900 hover:text-neutral-500 border-b border-neutral-900 pb-1.5 transition-all inline-flex items-center gap-1.5 focus:outline-none hover:gap-2"
              >
                <span>Conoce Más</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Story Details Modal Overlay */}
      <AnimatePresence>
        {isStoryOpen && (
          <div id="story-details-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              id="story-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsStoryOpen(false)}
              className="fixed inset-0 bg-black backdrop-blur-xs"
            />

            {/* Modal Box */}
            <motion.div
              id="story-modal-box"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white w-full max-w-lg rounded-2xl p-6 sm:p-8 shadow-2xl z-10 space-y-6"
            >
              <button
                onClick={() => setIsStoryOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900 transition-colors focus:outline-none"
              >
                <X size={20} />
              </button>

              <div className="text-center space-y-2">
                <Gift className="mx-auto text-neutral-800" size={32} />
                <h4 className="text-lg font-normal text-neutral-900" style={{ fontFamily: 'Georgia, serif' }}>
                  El Ritual del Desempaque
                </h4>
                <p className="text-xs text-neutral-400 uppercase tracking-wider">Unboxing Curado por Expertos</p>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-neutral-600 font-light leading-relaxed">
                <p>
                  En <strong className="text-neutral-900 font-medium">CRAFT+</strong>, creemos que la emoción de adquirir una pieza exclusiva no termina al hacer clic en "Comprar". Nuestro ritual de empaque está diseñado para consentirte desde que la caja de envío llega a tu puerta en Quito.
                </p>
                
                <div className="grid grid-cols-1 gap-3 pt-2">
                  <div className="flex gap-3 items-start bg-neutral-50 p-3 rounded-xl border border-neutral-100">
                    <Sparkles className="text-yellow-500 mt-0.5 flex-shrink-0" size={16} />
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      <strong>Caja Signature Rígida:</strong> Protege tu pieza de manera impecable con acabados texturizados de lujo en negro mate.
                    </p>
                  </div>
                  <div className="flex gap-3 items-start bg-neutral-50 p-3 rounded-xl border border-neutral-100">
                    <Heart className="text-red-500 mt-0.5 flex-shrink-0" size={16} />
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      <strong>Tarjetas de Agradecimiento:</strong> Una dedicatoria manuscrita personalizada que exalta lo único de tu estilo.
                    </p>
                  </div>
                  <div className="flex gap-3 items-start bg-neutral-50 p-3 rounded-xl border border-neutral-100">
                    <ShieldCheck className="text-emerald-500 mt-0.5 flex-shrink-0" size={16} />
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      <strong>Certificado de Importación:</strong> Respaldamos la autenticidad y procedencia limitada de cada bolso, joya o lente.
                    </p>
                  </div>
                </div>

                <p className="text-center text-xs text-neutral-400 italic pt-2">
                  "Gracias por elegir lo que te hace única."
                </p>
              </div>

              <button
                onClick={() => setIsStoryOpen(false)}
                className="w-full py-3 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold tracking-widest uppercase rounded-lg transition-colors focus:outline-none"
              >
                Regresar a la Tienda
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
