import React, { useState } from 'react';
import { Menu, ShoppingBag, X, Calendar, Globe, Award, Sparkles, BookOpen, Clock, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
  onAdminClick: () => void;
  onCatalogClick: () => void;
  savedCount: number;
  onSavedClick: () => void;
  daysRemaining: number;
}

export default function Header({
  cartCount,
  onCartClick,
  onAdminClick,
  onCatalogClick,
  savedCount,
  onSavedClick,
  daysRemaining,
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header id="main-header" className="sticky top-0 z-40 w-full bg-brand-cream/95 backdrop-blur-md border-b border-brand-dark/10">
      {/* Dynamic Announcement Bar */}
      <div id="announcement-bar" className="w-full bg-brand-dark text-brand-cream py-2 px-4 text-center text-[10px] sm:text-xs font-light tracking-[0.2em] uppercase">
        <div className="flex items-center justify-center gap-2">
          <Sparkles size={11} className="text-brand-accent animate-pulse" />
          <span>Envíos a todo Ecuador • Entregas rápidas en Quito</span>
          <Sparkles size={11} className="text-brand-accent animate-pulse" />
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Menu Button */}
          <div className="flex items-center">
            <button
              id="menu-toggle-btn"
              onClick={() => setIsMenuOpen(true)}
              className="p-2 -ml-2 text-brand-dark hover:text-brand-accent transition-colors focus:outline-none"
              aria-label="Open menu"
            >
              <Menu size={24} className="stroke-[1.5]" />
            </button>
            <button
              id="header-nav-admin-shortcut"
              onClick={onAdminClick}
              className="hidden sm:inline-flex ml-4 items-center gap-1.5 px-3 py-1 text-[10px] uppercase tracking-widest border border-brand-dark/20 text-brand-dark hover:bg-brand-dark hover:text-white transition-all font-medium"
            >
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
              <span>Stock Manager</span>
            </button>
          </div>

          {/* Logo */}
          <div className="flex-1 text-center">
            <a
              id="brand-logo-link"
              href="#"
              className="inline-flex flex-col items-center justify-center hover:opacity-85 transition-opacity"
            >
              <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.3em] font-semibold opacity-60 -mb-1">Ecuador · Quito</span>
              <span className="text-3xl sm:text-4xl font-serif font-black tracking-tighter text-brand-dark">
                CRAFT+
              </span>
            </a>
          </div>

          {/* Utility Icons */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Wishlist Button */}
            <button
              id="wishlist-btn"
              onClick={onSavedClick}
              className="relative p-2 text-brand-dark hover:text-red-600 transition-colors focus:outline-none"
              aria-label="Wishlist"
            >
              <Heart size={21} className={`stroke-[1.5] ${savedCount > 0 ? 'fill-red-600 stroke-red-600 text-red-600' : ''}`} />
              {savedCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full" />
              )}
            </button>

            {/* Shopping Cart Button */}
            <button
              id="cart-toggle-btn"
              onClick={onCartClick}
              className="relative p-2 text-brand-dark hover:text-brand-accent transition-colors focus:outline-none"
              aria-label="Shopping Cart"
            >
              <ShoppingBag size={21} className="stroke-[1.5]" />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    id="cart-badge-count"
                    key={cartCount}
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.6, opacity: 0 }}
                    className="absolute -top-1 -right-1 bg-brand-dark text-brand-cream text-[9px] font-bold w-4.5 h-4.5 flex items-center justify-center rounded-full border border-brand-cream"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {/* Hamburger Drawer Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              id="menu-drawer-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black z-50"
            />

            {/* Drawer */}
            <motion.div
              id="menu-drawer-content"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-full max-w-sm bg-white shadow-2xl z-50 flex flex-col p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="text-xl font-normal tracking-widest text-neutral-950" style={{ fontFamily: 'Georgia, serif' }}>CRAFT+</span>
                <button
                  id="close-menu-btn"
                  onClick={() => setIsMenuOpen(false)}
                  className="p-1 text-neutral-600 hover:text-neutral-900 focus:outline-none"
                >
                  <X size={24} className="stroke-[1.5]" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 space-y-6">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">Comprar</h3>
                  <ul className="space-y-3.5">
                    <li>
                      <a
                        href="#catalog-section"
                        onClick={() => {
                          setIsMenuOpen(false);
                          onCatalogClick();
                        }}
                        className="text-base text-neutral-800 hover:text-neutral-900 hover:translate-x-1 inline-flex items-center gap-2 transition-all font-light"
                      >
                        <BookOpen size={16} className="text-neutral-400" />
                        Ver Catálogo Completo
                      </a>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          onCatalogClick();
                        }}
                        className="text-base text-neutral-800 hover:text-neutral-900 hover:translate-x-1 inline-flex items-center gap-2 transition-all font-light text-left"
                      >
                        <Award size={16} className="text-neutral-400" />
                        Ediciones Limitadas
                      </button>
                    </li>
                  </ul>
                </div>

                <div className="border-t border-neutral-100 pt-6">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">Rotación de Catálogo</h3>
                  <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                    <div className="flex items-center gap-2.5 text-neutral-800 mb-1.5 font-medium text-sm">
                      <Clock size={16} className="text-neutral-600" />
                      <span>Renovación cada 15 días</span>
                    </div>
                    <p className="text-xs text-neutral-500 leading-relaxed">
                      Curamos un catálogo exclusivo de menos de 50 piezas importadas. En <strong className="text-neutral-900">{daysRemaining} días</strong> se renovará la colección. ¡Compra antes de que se agoten!
                    </p>
                  </div>
                </div>

                <div className="border-t border-neutral-100 pt-6">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">Herramientas</h3>
                  <ul className="space-y-3">
                    <li>
                      <button
                        id="admin-panel-trigger-drawer"
                        onClick={() => {
                          setIsMenuOpen(false);
                          onAdminClick();
                        }}
                        className="text-sm text-neutral-700 hover:text-neutral-900 flex items-center gap-2 font-light"
                      >
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        Admin Stock & Catalog Manager
                      </button>
                    </li>
                  </ul>
                </div>
              </nav>

              <div className="border-t border-neutral-100 pt-6 mt-auto">
                <div className="space-y-3 text-xs text-neutral-500">
                  <div className="flex items-center gap-2">
                    <Globe size={14} />
                    <span>Importaciones exclusivas de Europa y EE.UU.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    <span>Envío exprés en Quito (24h)</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-2 text-center">
                    CRAFT+ © 2026 • Quito, Ecuador
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
