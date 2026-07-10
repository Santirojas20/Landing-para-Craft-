import React, { useState } from 'react';
import { Product } from '../types';
import { X, Sliders, Play, RotateCw, Plus, PackageCheck, TrendingUp, AlertTriangle, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onUpdateStock: (productId: string, newStock: number) => void;
  onUpdatePrice: (productId: string, newPrice: number) => void;
  onRotateCatalog: () => void;
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  simulatedSales: number;
}

export default function AdminPanel({
  isOpen,
  onClose,
  products,
  onUpdateStock,
  onUpdatePrice,
  onRotateCatalog,
  onAddProduct,
  simulatedSales,
}: AdminPanelProps) {
  if (!isOpen) return null;

  // Tab state
  const [activeTab, setActiveTab] = useState<'inventory' | 'add_product' | 'config'>('inventory');

  // Add Product form states
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState<'Bolsos' | 'Joyería' | 'Lentes' | 'Accesorios'>('Bolsos');
  const [newStock, setNewStock] = useState('5');
  const [newOrigin, setNewOrigin] = useState('Italia');
  const [newIsLimited, setNewIsLimited] = useState(false);
  const [newColorInput, setNewColorInput] = useState('');

  const [formSuccess, setFormSuccess] = useState(false);
  const [rotationSuccess, setRotationSuccess] = useState(false);

  // Computed stats
  const totalItems = products.length;
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 3).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPrice || !newStock) return;

    const colors = newColorInput
      ? newColorInput.split(',').map((c) => c.trim())
      : ['Único'];

    onAddProduct({
      name: newName,
      description: newDesc || 'Producto de importación exclusiva curado para CRAFT+.',
      price: parseFloat(newPrice),
      stock: parseInt(newStock),
      category: newCategory,
      importedFrom: newOrigin,
      image: `https://picsum.photos/seed/${newName.replace(/\s+/g, '')}/600/600`, // beautiful high quality lifestyle placeholder
      isNew: true,
      isLimited: newIsLimited,
      colors: colors,
    });

    // Reset Form
    setNewName('');
    setNewDesc('');
    setNewPrice('');
    setNewStock('5');
    setNewColorInput('');
    setNewIsLimited(false);

    setFormSuccess(true);
    setTimeout(() => setFormSuccess(false), 2500);
  };

  const triggerRotationSimulation = () => {
    onRotateCatalog();
    setRotationSuccess(true);
    setTimeout(() => setRotationSuccess(false), 2500);
  };

  return (
    <div id="admin-management-panel" className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        id="admin-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-brand-dark/80 backdrop-blur-xs"
      />

      {/* Panel Container */}
      <motion.div
        id="admin-container"
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative bg-brand-cream w-full max-w-5xl rounded-none overflow-hidden shadow-2xl z-10 flex flex-col h-[90vh] border border-brand-dark/20"
      >
        {/* Header Banner */}
        <div className="bg-brand-dark text-brand-cream p-5 flex items-center justify-between border-b border-brand-dark/25">
          <div className="flex items-center gap-2.5 text-left">
            <Sliders size={20} className="text-brand-accent" />
            <div>
              <h2 className="text-base font-serif font-black tracking-wider uppercase">CRAFT+ Backoffice</h2>
              <p className="text-[10px] text-brand-cream/70 font-light">
                Consola Administrativa de Simulación de Stock y Renovación Quincenal
              </p>
            </div>
          </div>
          <button
            id="close-admin-panel-btn"
            onClick={onClose}
            className="p-2 rounded-none hover:bg-white/10 text-brand-cream/80 hover:text-white border border-white/10 transition-colors focus:outline-none"
          >
            <X size={18} />
          </button>
        </div>

        {/* Dashboard KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 border-b border-brand-dark/10 bg-white p-4 gap-3.5 text-xs text-left">
          <div className="bg-brand-cream p-3 rounded-none border border-brand-dark/15 shadow-none flex items-center gap-3">
            <PackageCheck size={20} className="text-brand-dark/70" />
            <div>
              <span className="text-[10px] text-brand-dark/60 block uppercase tracking-wider font-bold">Catálogo Activo</span>
              <strong className="text-sm font-serif font-bold text-brand-dark">{totalItems} productos</strong>
            </div>
          </div>

          <div className="bg-brand-cream p-3 rounded-none border border-brand-dark/15 shadow-none flex items-center gap-3">
            <AlertTriangle size={20} className="text-amber-700" />
            <div>
              <span className="text-[10px] text-brand-dark/60 block uppercase tracking-wider font-bold">Stock Bajo (≤3)</span>
              <strong className="text-sm font-serif font-bold text-amber-800">{lowStockCount} ítems</strong>
            </div>
          </div>

          <div className="bg-brand-cream p-3 rounded-none border border-brand-dark/15 shadow-none flex items-center gap-3">
            <ShieldAlert size={20} className="text-red-700" />
            <div>
              <span className="text-[10px] text-brand-dark/60 block uppercase tracking-wider font-bold">Agotados</span>
              <strong className="text-sm font-serif font-bold text-red-700">{outOfStockCount} ítems</strong>
            </div>
          </div>

          <div className="bg-brand-cream p-3 rounded-none border border-brand-dark/15 shadow-none flex items-center gap-3">
            <TrendingUp size={20} className="text-emerald-700" />
            <div>
              <span className="text-[10px] text-brand-dark/60 block uppercase tracking-wider font-bold">Ventas Simuladas</span>
              <strong className="text-sm font-mono font-bold text-emerald-800">${simulatedSales.toFixed(2)}</strong>
            </div>
          </div>
        </div>

        {/* Main Workspace split */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Tabs Sidebar Selector */}
          <div className="w-full md:w-56 border-b md:border-b-0 md:border-r border-brand-dark/10 bg-brand-beige/30 p-4 space-y-2 flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible">
            <button
              onClick={() => setActiveTab('inventory')}
              className={`w-full text-left px-4 py-3 rounded-none text-xs font-bold uppercase tracking-wider flex items-center gap-2.5 transition-all focus:outline-none ${
                activeTab === 'inventory'
                  ? 'bg-brand-dark text-white border border-brand-dark'
                  : 'text-brand-dark/70 hover:bg-brand-beige border border-transparent'
              }`}
            >
              <span>📦 Gestionar Stock</span>
            </button>
            <button
              onClick={() => setActiveTab('add_product')}
              className={`w-full text-left px-4 py-3 rounded-none text-xs font-bold uppercase tracking-wider flex items-center gap-2.5 transition-all focus:outline-none ${
                activeTab === 'add_product'
                  ? 'bg-brand-dark text-white border border-brand-dark'
                  : 'text-brand-dark/70 hover:bg-brand-beige border border-transparent'
              }`}
            >
              <span>➕ Importar Producto</span>
            </button>
            <button
              onClick={() => setActiveTab('config')}
              className={`w-full text-left px-4 py-3 rounded-none text-xs font-bold uppercase tracking-wider flex items-center gap-2.5 transition-all focus:outline-none ${
                activeTab === 'config'
                  ? 'bg-brand-dark text-white border border-brand-dark'
                  : 'text-brand-dark/70 hover:bg-brand-beige border border-transparent'
              }`}
            >
              <span>🔄 Rotación Quincenal</span>
            </button>
          </div>

          {/* Right Workspace Side: Tab details */}
          <div className="flex-1 p-6 sm:p-8 overflow-y-auto bg-white">
            {activeTab === 'inventory' && (
              <div className="space-y-4 text-left">
                <div className="flex justify-between items-center border-b border-brand-dark/10 pb-2">
                  <h3 className="text-xs font-bold uppercase text-brand-dark/60 tracking-wider">
                    Modificar Existencias y Precios
                  </h3>
                  <p className="text-[10px] text-brand-dark/50 uppercase tracking-wider font-semibold">Edición en tiempo real</p>
                </div>

                {/* Inventory grid Table */}
                <div className="border border-brand-dark/15 rounded-none overflow-hidden bg-white shadow-xs">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-brand-cream border-b border-brand-dark/15 text-brand-dark/60 font-bold text-[10px] uppercase tracking-wider">
                        <th className="p-3">Producto</th>
                        <th className="p-3">Categoría</th>
                        <th className="p-3">Precio USD</th>
                        <th className="p-3 text-center">Existencias</th>
                        <th className="p-3 text-right">Origen</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-dark/10 text-brand-dark">
                      {products.map((prod) => (
                        <tr key={prod.id} className="hover:bg-brand-cream/50 transition-colors">
                          <td className="p-3 flex items-center gap-3">
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="w-10 h-10 object-cover rounded-none bg-brand-cream border border-brand-dark/10"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <span className="font-serif font-bold text-brand-dark block">{prod.name}</span>
                              <span className="text-[10px] text-brand-dark/50 block font-mono">ID: #{prod.id}</span>
                            </div>
                          </td>
                          <td className="p-3 text-brand-dark/70 text-xs">
                            <span className="px-2 py-0.5 bg-brand-beige text-brand-dark uppercase text-[10px] font-bold tracking-wider">{prod.category}</span>
                          </td>
                          <td className="p-3">
                            <input
                              type="number"
                              step="1"
                              value={prod.price}
                              onChange={(e) => onUpdatePrice(prod.id, parseFloat(e.target.value) || 0)}
                              className="w-16 border border-brand-dark/20 rounded-none px-1.5 py-0.5 font-mono font-medium focus:outline-none focus:ring-1 focus:ring-brand-dark focus:border-brand-dark text-center bg-white"
                            />
                          </td>
                          <td className="p-3">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => onUpdateStock(prod.id, Math.max(0, prod.stock - 1))}
                                className="w-6 h-6 border border-brand-dark/20 bg-white hover:bg-brand-beige rounded-none flex items-center justify-center font-bold text-brand-dark/60 focus:outline-none"
                              >
                                -
                              </button>
                              <span
                                className={`w-6 text-center font-mono font-semibold ${
                                  prod.stock === 0 ? 'text-red-600 font-bold' : prod.stock <= 3 ? 'text-amber-700' : 'text-brand-dark'
                                }`}
                              >
                                {prod.stock}
                              </span>
                              <button
                                onClick={() => onUpdateStock(prod.id, prod.stock + 1)}
                                className="w-6 h-6 border border-brand-dark/20 bg-white hover:bg-brand-beige rounded-none flex items-center justify-center font-bold text-brand-dark/60 focus:outline-none"
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="p-3 text-right text-brand-dark/50 text-[10px] uppercase tracking-wider font-bold">
                            {prod.importedFrom}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'add_product' && (
              <div className="space-y-4 max-w-xl text-left">
                <div className="space-y-1 border-b border-brand-dark/10 pb-2">
                  <h3 className="text-xs font-bold uppercase text-brand-dark/60 tracking-wider">
                    Importar Nuevo Producto
                  </h3>
                  <p className="text-[10px] text-brand-dark/50 uppercase tracking-wide font-medium">
                    Añade un nuevo ítem exclusivo al catálogo de CRAFT+
                  </p>
                </div>

                {formSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-none flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600" />
                    <span className="font-semibold uppercase tracking-wider text-[10px]">¡Producto importado y agregado al catálogo con éxito!</span>
                  </div>
                )}

                <form onSubmit={handleAddProductSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-brand-dark/70 mb-1">Nombre del Producto *</label>
                      <input
                        type="text"
                        required
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Ej. Gafas de Sol Saint-Tropez"
                        className="w-full border border-brand-dark/20 rounded-none p-2 focus:ring-1 focus:ring-brand-dark focus:border-brand-dark focus:outline-none bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-brand-dark/70 mb-1">Precio USD *</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value)}
                        placeholder="79.00"
                        className="w-full border border-brand-dark/20 rounded-none p-2 focus:ring-1 focus:ring-brand-dark focus:border-brand-dark focus:outline-none bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-brand-dark/70 mb-1">Categoría *</label>
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value as any)}
                        className="w-full border border-brand-dark/20 rounded-none p-2 focus:ring-1 focus:ring-brand-dark focus:border-brand-dark focus:outline-none bg-white"
                      >
                        <option value="Bolsos">Bolsos</option>
                        <option value="Joyería">Joyería</option>
                        <option value="Lentes">Lentes</option>
                        <option value="Accesorios">Accesorios</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-brand-dark/70 mb-1">Existencias Iniciales *</label>
                      <input
                        type="number"
                        required
                        value={newStock}
                        onChange={(e) => setNewStock(e.target.value)}
                        className="w-full border border-brand-dark/20 rounded-none p-2 focus:ring-1 focus:ring-brand-dark focus:border-brand-dark focus:outline-none bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-brand-dark/70 mb-1">País de Origen *</label>
                      <select
                        value={newOrigin}
                        onChange={(e) => setNewOrigin(e.target.value)}
                        className="w-full border border-brand-dark/20 rounded-none p-2 focus:ring-1 focus:ring-brand-dark focus:border-brand-dark focus:outline-none bg-white"
                      >
                        <option value="Italia">Italia</option>
                        <option value="Francia">Francia</option>
                        <option value="España">España</option>
                        <option value="EE.UU.">EE.UU.</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-brand-dark/70 mb-1">Variantes / Colores (separados por coma)</label>
                      <input
                        type="text"
                        value={newColorInput}
                        onChange={(e) => setNewColorInput(e.target.value)}
                        placeholder="Negro, Café, Crema"
                        className="w-full border border-brand-dark/20 rounded-none p-2 focus:ring-1 focus:ring-brand-dark focus:border-brand-dark focus:outline-none bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-bold text-brand-dark/70 mb-1">Descripción Corta</label>
                    <textarea
                      rows={2}
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      placeholder="Breve reseña del producto para la boutique..."
                      className="w-full border border-brand-dark/20 rounded-none p-2 focus:ring-1 focus:ring-brand-dark focus:border-brand-dark focus:outline-none bg-white resize-none"
                    />
                  </div>

                  <div className="flex items-center gap-2 py-2">
                    <input
                      type="checkbox"
                      id="is-limited-cb"
                      checked={newIsLimited}
                      onChange={(e) => setNewIsLimited(e.target.checked)}
                      className="w-4 h-4 text-brand-dark focus:ring-brand-dark border-brand-dark/20 rounded-none"
                    />
                    <label htmlFor="is-limited-cb" className="font-bold text-brand-dark/70 uppercase text-[10px] tracking-wider select-none">
                      Marcar como "Edición Exclusiva / Limitada"
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-brand-dark hover:bg-neutral-800 text-white font-bold uppercase tracking-widest rounded-none transition-colors flex items-center justify-center gap-2 shadow-sm focus:outline-none border border-brand-dark"
                  >
                    <Plus size={14} />
                    <span>Importar Producto</span>
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'config' && (
              <div className="space-y-5 max-w-xl text-left">
                <div className="space-y-1 border-b border-brand-dark/10 pb-2">
                  <h3 className="text-xs font-bold uppercase text-brand-dark/60 tracking-wider">
                    Simular Rotación Quincenal del Catálogo
                  </h3>
                  <p className="text-[10px] text-brand-dark/50 uppercase tracking-wide font-medium">
                    Renovación de stock y precios de importación automáticos
                  </p>
                </div>

                {rotationSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-none flex items-center gap-2 animate-pulse">
                    <CheckCircle2 size={16} className="text-emerald-600" />
                    <span className="font-semibold uppercase tracking-wider text-[10px]">✓ ¡Catálogo renovado! Stock restablecido, precios actualizados de acuerdo a importaciones.</span>
                  </div>
                )}

                <div className="bg-brand-cream border border-brand-dark/15 p-5 rounded-none space-y-4">
                  <div className="flex items-start gap-3 text-xs text-brand-dark leading-relaxed font-light">
                    <RotateCw className="text-brand-dark/80 mt-0.5 flex-shrink-0 animate-spin" style={{ animationDuration: '4s' }} size={16} />
                    <div>
                      <p className="font-serif font-bold text-brand-dark text-sm mb-1">¿Qué ocurre al rotar el catálogo?</p>
                      <ul className="list-disc pl-4 space-y-1 text-xs text-brand-dark/80 font-light">
                        <li>Se restablece el stock de las piezas que se agotaron.</li>
                        <li>Se actualizan los precios de importación de forma inteligente (+/- 5%).</li>
                        <li>Se seleccionan de forma aleatoria nuevos artículos destacados como "Nuevos".</li>
                        <li>Se simula la importación de nuevas ediciones limitadas.</li>
                      </ul>
                    </div>
                  </div>

                  <button
                    id="admin-rotate-catalog-btn"
                    onClick={triggerRotationSimulation}
                    className="w-full py-4 bg-brand-dark hover:bg-neutral-800 text-white text-xs font-bold tracking-widest uppercase rounded-none transition-all flex items-center justify-center gap-2 shadow-md focus:outline-none border border-brand-dark"
                  >
                    <Play size={12} className="fill-white" />
                    <span>Ejecutar Rotación de 15 Días</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
