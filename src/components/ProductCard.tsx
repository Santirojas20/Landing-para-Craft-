import React from 'react';
import { Product } from '../types';
import { Heart, ShoppingCart, Globe, Tag } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onAddToCart: (product: Product, event: React.MouseEvent) => void;
  isSaved: boolean;
  onToggleSave: (productId: string, event?: React.MouseEvent) => void;
}

export default function ProductCard({
  product,
  onSelect,
  onAddToCart,
  isSaved,
  onToggleSave,
}: ProductCardProps) {
  const isOutOfStock = product.stock === 0;

  return (
    <motion.div
      id={`product-card-${product.id}`}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="group bg-white rounded-none border border-brand-dark/10 flex flex-col h-full cursor-pointer transition-shadow hover:shadow-lg"
      onClick={() => onSelect(product)}
    >
      {/* Product Image Section */}
      <div className="relative aspect-square overflow-hidden bg-brand-cream">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />

        {/* Floating Hearts & Actions */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
          <button
            id={`save-btn-${product.id}`}
            onClick={(e) => onToggleSave(product.id, e)}
            className="p-2.5 rounded-none bg-brand-cream/90 hover:bg-brand-cream text-brand-dark hover:text-red-600 border border-brand-dark/15 shadow-sm transition-colors focus:outline-none"
            aria-label="Guardar en favoritos"
          >
            <Heart
              size={15}
              className={`transition-all ${
                isSaved ? 'fill-red-600 stroke-red-600 text-red-600' : 'stroke-[1.5]'
              }`}
            />
          </button>
        </div>

        {/* Dynamic Status Badges */}
        <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5 z-10">
          {product.isNew && (
            <span className="bg-brand-dark text-brand-cream text-[9px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-none">
              Nuevo
            </span>
          )}
          {product.isLimited && (
            <span className="bg-brand-accent text-brand-dark border border-brand-dark/15 text-[9px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-none">
              Exclusivo
            </span>
          )}
          {product.stock <= 3 && product.stock > 0 && (
            <span className="bg-red-600 text-white text-[9px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-none">
              Últimas {product.stock}
            </span>
          )}
          {isOutOfStock && (
            <span className="bg-brand-beige text-brand-dark/60 text-[9px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-none">
              Agotado
            </span>
          )}
        </div>

        {/* Origin Overlay Label on Hover */}
        <div className="absolute inset-0 bg-brand-dark/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="bg-brand-cream/95 text-brand-dark text-[10px] tracking-widest uppercase px-4 py-2 font-serif font-semibold border border-brand-dark/15">
            Ver Detalles
          </span>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          {/* Imported tag */}
          <div className="flex items-center gap-1 text-brand-dark/50 text-[9px] uppercase tracking-wider font-semibold">
            <Globe size={10} />
            <span>Importado de {product.importedFrom}</span>
          </div>

          <h3 className="text-sm font-serif font-bold text-brand-dark group-hover:opacity-80 line-clamp-1">
            {product.name}
          </h3>

          <p className="text-xs text-brand-dark/70 line-clamp-2 font-light leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="pt-4 flex items-center justify-between border-t border-brand-dark/5 mt-3">
          {/* Price Layout */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold font-mono text-brand-dark">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-brand-dark/40 line-through font-mono">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Quick Add To Cart Button */}
          <button
            id={`quick-add-btn-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              if (!isOutOfStock) onAddToCart(product, e);
            }}
            disabled={isOutOfStock}
            className={`p-2 rounded-none border transition-all ${
              isOutOfStock
                ? 'bg-brand-beige border-brand-beige/50 text-brand-dark/40 cursor-not-allowed'
                : 'bg-brand-cream border-brand-dark/20 text-brand-dark hover:bg-brand-dark hover:border-brand-dark hover:text-white'
            }`}
            title="Agregar al carrito"
          >
            <ShoppingCart size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
