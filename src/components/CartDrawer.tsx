import React, { useState } from 'react';
import { CartItem } from '../types';
import { X, Trash2, ShoppingBag, Truck, Gift, Tag, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { QUITO_SECTORS } from '../data';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, selectedColor: string, quantity: number) => void;
  onRemoveItem: (productId: string, selectedColor: string) => void;
  selectedSector: string;
  onSelectSector: (sectorId: string) => void;
  promoCode: string;
  onApplyPromoCode: (code: string) => void;
  promoDiscount: number; // e.g., 0.1 for 10%
  onCheckoutClick: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  selectedSector,
  onSelectSector,
  promoCode,
  onApplyPromoCode,
  promoDiscount,
  onCheckoutClick,
}: CartDrawerProps) {
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState(promoCode ? true : false);

  if (!isOpen) return null;

  // Real-time calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountAmount = subtotal * promoDiscount;
  
  const sectorObj = QUITO_SECTORS.find((s) => s.id === selectedSector) || QUITO_SECTORS[0];
  const deliveryFee = subtotal > 0 ? sectorObj.fee : 0;
  const total = subtotal - discountAmount + deliveryFee;

  const handleApplyPromo = () => {
    const formattedCode = promoInput.trim().toUpperCase();
    if (formattedCode === 'CRAFTQUITO') {
      onApplyPromoCode('CRAFTQUITO');
      setPromoSuccess(true);
      setPromoError('');
    } else if (formattedCode === '') {
      setPromoError('Ingresa un código de descuento.');
    } else {
      setPromoError('Código inválido. Intenta con "CRAFTQUITO".');
      setPromoSuccess(false);
    }
  };

  return (
    <div id="shopping-cart-drawer" className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <motion.div
        id="cart-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black backdrop-blur-xs"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <motion.div
          id="cart-panel"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="w-screen max-w-md bg-brand-cream shadow-2xl flex flex-col border-l border-brand-dark/20 h-full"
        >
          {/* Header */}
          <div className="p-5 border-b border-brand-dark/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag size={18} className="text-brand-dark" />
              <h2 className="text-sm font-serif font-bold uppercase tracking-wider text-brand-dark">Tu Bolsa de Compras</h2>
              <span className="bg-brand-dark text-brand-cream text-[10px] px-2 py-0.5 rounded-none font-bold">
                {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            </div>
            <button
              id="close-cart-drawer-btn"
              onClick={onClose}
              className="p-2 -mr-2 text-brand-dark hover:text-brand-accent focus:outline-none"
            >
              <X size={18} className="stroke-[1.5]" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                <div className="p-4 bg-brand-beige rounded-none text-brand-dark/60 border border-brand-dark/10">
                  <ShoppingBag size={44} className="stroke-[1]" />
                </div>
                <div>
                  <h3 className="font-serif font-semibold text-brand-dark text-base">Tu bolsa está vacía</h3>
                  <p className="text-xs text-brand-dark/70 max-w-xs mt-1 leading-relaxed">
                    Explora nuestro catálogo exclusivo de importados y añade tus piezas favoritas antes de que se agoten.
                  </p>
                </div>
                <button
                  id="cart-continue-shopping-btn"
                  onClick={onClose}
                  className="px-6 py-3.5 border border-brand-dark text-brand-dark text-xs tracking-widest uppercase hover:bg-brand-dark hover:text-brand-cream transition-all rounded-none font-semibold"
                >
                  Seguir comprando
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item, index) => (
                  <motion.div
                    key={`${item.product.id}-${item.selectedColor}`}
                    id={`cart-item-${item.product.id}-${index}`}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex gap-4 p-3 border border-brand-dark/10 rounded-none bg-white"
                  >
                    {/* Item Image */}
                    <div className="w-20 h-20 bg-brand-cream rounded-none overflow-hidden flex-shrink-0 border border-brand-dark/5">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Item Description & Quantity */}
                    <div className="flex-1 flex flex-col justify-between py-0.5 text-left">
                      <div className="space-y-0.5">
                        <div className="flex justify-between items-start">
                          <h4 className="text-xs sm:text-sm font-serif font-bold text-brand-dark line-clamp-1 pr-2">
                            {item.product.name}
                          </h4>
                          <button
                            id={`remove-cart-item-${item.product.id}-${index}`}
                            onClick={() => onRemoveItem(item.product.id, item.selectedColor || '')}
                            className="text-brand-dark/40 hover:text-red-600 transition-colors focus:outline-none p-0.5"
                            title="Eliminar de la bolsa"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                        {item.selectedColor && (
                          <p className="text-[11px] text-brand-dark/70">
                            Color: <span className="font-semibold">{item.selectedColor}</span>
                          </p>
                        )}
                        <p className="text-[10px] text-brand-dark/50 uppercase tracking-wide font-medium">
                          Importado de {item.product.importedFrom}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        {/* Quantity Counter */}
                        <div className="flex items-center border border-brand-dark/20 rounded-none overflow-hidden bg-brand-cream">
                          <button
                            onClick={() =>
                              onUpdateQuantity(item.product.id, item.selectedColor || '', item.quantity - 1)
                            }
                            className="px-2 py-0.5 text-brand-dark hover:bg-brand-beige font-semibold"
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-semibold text-brand-dark font-mono">{item.quantity}</span>
                          <button
                            onClick={() =>
                              onUpdateQuantity(item.product.id, item.selectedColor || '', item.quantity + 1)
                            }
                            className="px-2 py-0.5 text-brand-dark hover:bg-brand-beige font-semibold"
                            disabled={item.quantity >= item.product.stock}
                          >
                            +
                          </button>
                        </div>

                        {/* Price Subtotal for Item */}
                        <span className="text-xs font-semibold font-mono text-brand-dark">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Footer with Calculations and Checkout */}
          {cartItems.length > 0 && (
            <div className="border-t border-brand-dark/10 p-5 bg-brand-light-beige space-y-4 text-left">
              {/* Promo Code Section */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-brand-dark/70 uppercase tracking-wider">
                  <Gift size={13} className="text-brand-dark/50" />
                  <span>Código de Descuento / Cupón</span>
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      id="promo-code-input"
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="Ej: CRAFTQUITO (10% off)"
                      className="w-full bg-white border border-brand-dark/20 rounded-none py-2 pl-8 pr-3 text-xs focus:ring-1 focus:ring-brand-dark focus:border-brand-dark focus:outline-none uppercase"
                    />
                    <Tag size={13} className="absolute left-3 top-3 text-brand-dark/40" />
                  </div>
                  <button
                    id="apply-promo-btn"
                    onClick={handleApplyPromo}
                    className="bg-brand-dark hover:bg-neutral-800 text-white text-xs px-4 py-2 rounded-none transition-colors focus:outline-none uppercase tracking-wider font-semibold"
                  >
                    Aplicar
                  </button>
                </div>
                {promoSuccess && (
                  <p className="text-[11px] text-emerald-700 font-medium">
                    ✓ ¡Código <strong>{promoCode}</strong> aplicado! Descuento del 10% activado.
                  </p>
                )}
                {promoError && (
                  <p className="text-[11px] text-red-600 font-medium">{promoError}</p>
                )}
              </div>

              {/* Delivery Zone Selector */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-brand-dark/70 uppercase tracking-wider">
                  <Truck size={13} className="text-brand-dark/50" />
                  <span>Zona de Entrega (Ecuador/Quito)</span>
                </div>
                <select
                  id="delivery-sector-select"
                  value={selectedSector}
                  onChange={(e) => onSelectSector(e.target.value)}
                  className="w-full bg-white border border-brand-dark/20 rounded-none py-2 px-3 text-xs text-brand-dark focus:ring-1 focus:ring-brand-dark focus:border-brand-dark focus:outline-none"
                >
                  {QUITO_SECTORS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} (+${s.fee.toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>

              {/* Checkout Calculation breakdown */}
              <div className="border-t border-brand-dark/10 pt-3 space-y-2 text-xs">
                <div className="flex justify-between text-brand-dark/60">
                  <span>Subtotal</span>
                  <span className="font-mono">${subtotal.toFixed(2)}</span>
                </div>
                {promoDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Descuento (10%)</span>
                    <span className="font-mono">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-brand-dark/60">
                  <span>Costo de envío ({sectorObj.id === 'provincia' ? 'Provincia' : 'Quito'})</span>
                  <span className="font-mono">${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="border-t border-brand-dark/20 pt-2 flex justify-between text-brand-dark font-bold text-sm sm:text-base">
                  <span>Total estimado</span>
                  <span className="font-mono">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Call To Action */}
              <button
                id="cart-checkout-action-btn"
                onClick={onCheckoutClick}
                className="w-full py-4 bg-brand-dark hover:bg-neutral-800 text-white text-xs font-bold tracking-[0.15em] uppercase rounded-none transition-all duration-300 shadow-md flex items-center justify-center gap-2 hover:-translate-y-0.5 focus:outline-none"
              >
                <span>Iniciar Compra</span>
                <ArrowRight size={14} />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-brand-dark/40 uppercase tracking-wider font-semibold">
                <ShieldCheck size={12} />
                <span>Compra segura por CRAFT+</span>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
