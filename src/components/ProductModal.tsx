import React, { useState } from 'react';
import { Product } from '../types';
import { X, Globe, ShoppingCart, ShieldCheck, Truck, RefreshCw, Check, Heart } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, selectedColor: string) => void;
  isSaved: boolean;
  onToggleSave: (productId: string) => void;
}

export default function ProductModal({
  product,
  onClose,
  onAddToCart,
  isSaved,
  onToggleSave,
}: ProductModalProps) {
  if (!product) return null;

  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(
    product.colors && product.colors.length > 0 ? product.colors[0] : ''
  );
  const [addedAnimation, setAddedAnimation] = useState(false);

  const isOutOfStock = product.stock === 0;

  const handleIncrement = () => {
    if (quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAdd = () => {
    onAddToCart(product, quantity, selectedColor);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      onClose();
    }, 1000);
  };

  return (
    <div id="product-detail-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        id="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black backdrop-blur-xs"
      />

      {/* Modal Container */}
      <motion.div
        id="modal-container"
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 250 }}
        className="relative bg-white w-full max-w-4xl rounded-none overflow-hidden shadow-2xl z-10 flex flex-col md:flex-row max-h-[90vh] md:max-h-[85vh] border border-brand-dark/20"
      >
        {/* Close Button */}
        <button
          id="close-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-none bg-brand-cream text-brand-dark hover:bg-brand-beige border border-brand-dark/15 shadow-sm transition-colors focus:outline-none"
        >
          <X size={18} className="stroke-[1.5]" />
        </button>

        {/* Left Side: Image */}
        <div className="w-full md:w-1/2 bg-brand-cream relative aspect-square md:aspect-auto md:h-full overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          {/* Wishlist floating toggle */}
          <button
            id={`modal-wishlist-toggle-${product.id}`}
            onClick={() => onToggleSave(product.id)}
            className="absolute bottom-4 right-4 p-3 rounded-none bg-brand-cream/95 text-brand-dark hover:text-red-600 shadow-md border border-brand-dark/10 transition-all focus:outline-none"
          >
            <Heart
              size={18}
              className={isSaved ? 'fill-red-600 stroke-red-600 text-red-600' : 'stroke-[1.5]'}
            />
          </button>
        </div>

        {/* Right Side: Product Details */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[45vh] md:max-h-full">
          <div className="space-y-5">
            {/* Country of Origin Tag & Brand */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-semibold tracking-[0.25em] text-brand-dark/60 uppercase">CRAFT+ COLLECTION</span>
              <div className="flex items-center gap-1 bg-brand-beige text-brand-dark text-[10px] px-2.5 py-1.5 rounded-none uppercase tracking-wider font-semibold border border-brand-dark/10">
                <Globe size={11} />
                <span>Importado de {product.importedFrom}</span>
              </div>
            </div>

            {/* Title & Price */}
            <div className="space-y-1.5 text-left">
              <h2 className="text-xl sm:text-2xl font-serif font-black text-brand-dark">
                {product.name}
              </h2>
              <div className="flex items-baseline gap-2.5">
                <span className="text-lg sm:text-xl font-bold font-mono text-brand-dark">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-brand-dark/40 line-through font-mono">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
                <span className="text-[9px] text-brand-dark bg-brand-beige border border-brand-dark/10 px-2 py-0.5 rounded-none font-semibold uppercase tracking-wider">
                  100% Importado
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-brand-dark/10" />

            {/* Description */}
            <div className="space-y-1.5 text-left">
              <span className="text-xs font-bold text-brand-dark/50 uppercase tracking-wider block">Descripción</span>
              <p className="text-sm text-brand-dark/80 font-light leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Custom Color Selector (Tactile Buttons) */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-2 text-left">
                <span className="text-xs font-bold text-brand-dark/50 uppercase tracking-wider block">
                  Color / Variante seleccionado: <strong className="text-brand-dark font-semibold">{selectedColor}</strong>
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 text-xs border rounded-none transition-all focus:outline-none ${
                        selectedColor === color
                          ? 'border-brand-dark bg-brand-dark text-white font-medium shadow-sm'
                          : 'border-brand-dark/15 hover:border-brand-dark text-brand-dark bg-white'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock Availability Indicator */}
            <div className="space-y-1 text-left">
              <span className="text-xs font-bold text-brand-dark/50 uppercase tracking-wider block">Disponibilidad en Stock</span>
              {isOutOfStock ? (
                <div className="text-xs text-red-700 bg-red-50 p-3 rounded-none border border-red-100 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-none bg-red-600 animate-pulse"></span>
                  <span>Agotado temporalmente. Se reabastecerá en la próxima renovación (cada 15 días).</span>
                </div>
              ) : product.stock <= 3 ? (
                <div className="text-xs text-brand-dark bg-brand-accent/30 p-3 rounded-none border border-brand-dark/10 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-none bg-brand-dark animate-ping"></span>
                  <span className="font-medium">¡Edición limitada! Solo quedan <strong>{product.stock} unidades</strong> importadas en Quito.</span>
                </div>
              ) : (
                <div className="text-xs text-emerald-800 bg-emerald-50 p-3 rounded-none border border-emerald-100 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-none bg-emerald-600"></span>
                  <span>En Stock ({product.stock} disponibles para envío inmediato a Quito y Ecuador).</span>
                </div>
              )}
            </div>
          </div>

          {/* Add to Cart Actions */}
          <div className="pt-6 border-t border-brand-dark/10 mt-6 space-y-4">
            {!isOutOfStock && (
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-dark/70">Cantidad</span>
                <div className="flex items-center border border-brand-dark/20 rounded-none overflow-hidden bg-brand-cream">
                  <button
                    onClick={handleDecrement}
                    className="px-3.5 py-1.5 text-brand-dark/60 hover:bg-brand-beige hover:text-brand-dark font-semibold transition-colors focus:outline-none"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-4 text-sm font-semibold text-brand-dark font-mono">{quantity}</span>
                  <button
                    onClick={handleIncrement}
                    className="px-3.5 py-1.5 text-brand-dark/60 hover:bg-brand-beige hover:text-brand-dark font-semibold transition-colors focus:outline-none"
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                id="add-to-cart-action-btn"
                onClick={handleAdd}
                disabled={isOutOfStock || addedAnimation}
                className={`flex-1 py-4 px-6 rounded-none text-xs tracking-widest uppercase font-bold transition-all flex items-center justify-center gap-2.5 focus:outline-none ${
                  isOutOfStock
                    ? 'bg-brand-beige text-brand-dark/40 cursor-not-allowed border border-brand-dark/10'
                    : addedAnimation
                    ? 'bg-emerald-600 text-white'
                    : 'bg-brand-dark hover:bg-neutral-800 text-white hover:-translate-y-0.5'
                }`}
              >
                {addedAnimation ? (
                  <>
                    <Check size={16} />
                    <span>¡Agregado con éxito!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart size={16} />
                    <span>{isOutOfStock ? 'Sin existencias' : 'Agregar al carrito'}</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Guarantees */}
            <div className="grid grid-cols-3 gap-2 text-center text-[10px] uppercase tracking-wider font-semibold text-brand-dark/50 pt-3 border-t border-brand-dark/5">
              <div className="flex flex-col items-center gap-1">
                <Truck size={14} className="text-brand-dark/40" />
                <span>Envío express Quito</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck size={14} className="text-brand-dark/40" />
                <span>Pago 100% Seguro</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <RefreshCw size={14} className="text-brand-dark/40" />
                <span>Rotación quincenal</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
