import React, { useState } from 'react';
import { Mail, Send, Check, Phone, ShieldCheck, HelpCircle } from 'lucide-react';

interface FooterProps {
  onAdminClick: () => void;
  onCatalogClick: () => void;
}

export default function Footer({ onAdminClick, onCatalogClick }: FooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
    }, 2000);
  };

  return (
    <footer id="boutique-footer" className="bg-neutral-900 text-neutral-400 text-xs py-12 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 pb-12 border-b border-neutral-800">
        {/* Brand Column */}
        <div className="md:col-span-4 space-y-4 text-center md:text-left">
          <span className="text-xl sm:text-2xl font-normal text-white tracking-[0.2em]" style={{ fontFamily: 'Georgia, serif' }}>
            CRAFT<span className="text-neutral-500">+</span>
          </span>
          <p className="font-light leading-relaxed text-neutral-400 max-w-sm mx-auto md:mx-0">
            Tienda boutique de moda y accesorios importados para el público femenino de Ecuador, principalmente Quito. Ediciones limitadas con rotación total del catálogo cada 15 días.
          </p>
          <div className="flex items-center gap-2 justify-center md:justify-start pt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-[10px] text-neutral-400 uppercase tracking-widest">Tienda 100% Online</span>
          </div>
        </div>

        {/* Links Column */}
        <div className="md:col-span-2 space-y-3.5 text-center md:text-left">
          <h4 className="text-white text-[11px] font-semibold uppercase tracking-wider">Explorar</h4>
          <ul className="space-y-2 font-light">
            <li>
              <button
                onClick={onCatalogClick}
                className="hover:text-white transition-colors focus:outline-none"
              >
                Ver Catálogo
              </button>
            </li>
            <li>
              <a href="#testimonials-section" className="hover:text-white transition-colors">Testimonios</a>
            </li>
            <li>
              <a href="#experience-section" className="hover:text-white transition-colors">Experiencia CRAFT+</a>
            </li>
            <li>
              <button
                id="footer-admin-btn"
                onClick={onAdminClick}
                className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors flex items-center gap-1 mx-auto md:mx-0 focus:outline-none"
              >
                <span>Stock Manager</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Contact/Support Column */}
        <div className="md:col-span-3 space-y-3.5 text-center md:text-left">
          <h4 className="text-white text-[11px] font-semibold uppercase tracking-wider">Contacto y Soporte</h4>
          <ul className="space-y-2 font-light text-neutral-400">
            <li className="flex items-center justify-center md:justify-start gap-2">
              <Phone size={13} className="text-neutral-500" />
              <span>WhatsApp: 099 999 9999</span>
            </li>
            <li className="flex items-center justify-center md:justify-start gap-2">
              <Mail size={13} className="text-neutral-500" />
              <span>soporte@craftplus.ec</span>
            </li>
            <li className="flex items-center justify-center md:justify-start gap-2">
              <ShieldCheck size={13} className="text-neutral-500" />
              <span>Quito, Cumbayá (Bodega)</span>
            </li>
          </ul>
        </div>

        {/* Newsletter Subscription Column */}
        <div className="md:col-span-3 space-y-3.5 text-center md:text-left">
          <h4 className="text-white text-[11px] font-semibold uppercase tracking-wider">Newsletter de Lanzamientos</h4>
          <p className="font-light leading-relaxed text-neutral-400">
            Suscríbete para recibir un aviso de inmediato cada vez que rotemos el catálogo de importados (cada 15 días).
          </p>

          <form onSubmit={handleSubscribe} className="space-y-2">
            <div className="flex gap-2">
              <input
                id="footer-newsletter-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Tu correo electrónico"
                className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
              />
              <button
                id="footer-newsletter-submit"
                type="submit"
                disabled={subscribed}
                className="bg-white hover:bg-neutral-200 text-neutral-900 rounded-lg p-2 transition-colors flex items-center justify-center focus:outline-none"
              >
                {subscribed ? <Check size={13} className="text-emerald-600" /> : <Send size={13} />}
              </button>
            </div>
            {subscribed && (
              <p className="text-[10px] text-emerald-400 font-medium animate-pulse">
                ✓ ¡Listo! Te notificaremos en el próximo reabastecimiento.
              </p>
            )}
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
        <p className="text-center md:text-left">
          CRAFT+ © 2026. Todos los derechos reservados. Importaciones Exclusivas para Quito y Ecuador.
        </p>
        
        {/* Payment badges */}
        <div className="flex items-center gap-3">
          <span className="border border-neutral-800 px-2 py-0.5 rounded text-[10px] font-mono tracking-wider uppercase">PICHINCHA</span>
          <span className="border border-neutral-800 px-2 py-0.5 rounded text-[10px] font-mono tracking-wider uppercase">VISA/MASTERCARD</span>
          <span className="border border-neutral-800 px-2 py-0.5 rounded text-[10px] font-mono tracking-wider uppercase">PAYPAL</span>
        </div>
      </div>
    </footer>
  );
}
