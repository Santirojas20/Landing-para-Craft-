import React, { useState } from 'react';
import { Product, PaymentMethod } from '../types';
import { 
  Sliders, 
  Sparkles, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Tag, 
  Quote, 
  TrendingUp, 
  Check, 
  Smartphone, 
  Package, 
  Gift, 
  ChevronRight, 
  ChevronDown, 
  RefreshCw, 
  Eye, 
  FileText 
} from 'lucide-react';

interface EditorSidebarProps {
  // Live states
  heroTitle: string;
  setHeroTitle: (val: string) => void;
  heroSubtitle: string;
  setHeroSubtitle: (val: string) => void;
  heroDesc: string;
  setHeroDesc: (val: string) => void;
  heroTag: string;
  setHeroTag: (val: string) => void;
  heroImage: string;
  setHeroImage: (val: string) => void;

  features: { id: string; title: string; subtitle: string }[];
  setFeatures: (val: { id: string; title: string; subtitle: string }[]) => void;

  testimonials: { id: number; quote: string; author: string; location: string }[];
  setTestimonials: (val: { id: number; quote: string; author: string; location: string }[]) => void;

  products: Product[];
  onUpdateStock: (id: string, qty: number) => void;
  onUpdatePrice: (id: string, price: number) => void;
  onAddProduct: (prod: Omit<Product, 'id'>) => void;
  onDeleteProduct: (id: string) => void;

  daysRemaining: number;
  setDaysRemaining: (val: number) => void;
  simulatedSales: number;
  setSimulatedSales: (val: number) => void;
  promoCode: string;
  setPromoCode: (val: string) => void;
  promoDiscount: number;
  setPromoDiscount: (val: number) => void;

  onRotateCatalog: () => void;
  onResetDefaults: () => void;
}

export default function EditorSidebar({
  heroTitle,
  setHeroTitle,
  heroSubtitle,
  setHeroSubtitle,
  heroDesc,
  setHeroDesc,
  heroTag,
  setHeroTag,
  heroImage,
  setHeroImage,

  features,
  setFeatures,

  testimonials,
  setTestimonials,

  products,
  onUpdateStock,
  onUpdatePrice,
  onAddProduct,
  onDeleteProduct,

  daysRemaining,
  setDaysRemaining,
  simulatedSales,
  setSimulatedSales,
  promoCode,
  setPromoCode,
  promoDiscount,
  setPromoDiscount,

  onRotateCatalog,
  onResetDefaults,
}: EditorSidebarProps) {
  const [activeTab, setActiveTab] = useState<'content' | 'inventory' | 'reviews' | 'campaign'>('content');
  const [collapsedSection, setCollapsedSection] = useState<string | null>(null);

  // New product form states
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdStock, setNewProdStock] = useState('5');
  const [newProdCategory, setNewProdCategory] = useState<'Bolsos' | 'Joyería' | 'Lentes' | 'Accesorios'>('Bolsos');
  const [newProdOrigin, setNewProdOrigin] = useState('Italia');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdColors, setNewProdColors] = useState('Negro, Café, Arena');
  const [newProdImage, setNewProdImage] = useState('');
  const [isLimited, setIsLimited] = useState(true);
  const [showAddSuccess, setShowAddSuccess] = useState(false);

  // Preset boutique images for hero selection
  const heroPresets = [
    { name: 'Studio Minimal', url: '/src/assets/images/craft_hero_1783708160745.jpg' },
    { name: 'Vogue Interior', url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop' },
    { name: 'Lafayette Style', url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1200&auto=format&fit=crop' },
    { name: 'Atelier Gold', url: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200&auto=format&fit=crop' }
  ];

  const handleCreateProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice) return;

    // Use a high-quality fallback image based on category
    const imageFallbacks = {
      Bolsos: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=600&auto=format&fit=crop',
      Joyería: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600&auto=format&fit=crop',
      Lentes: 'https://images.unsplash.com/photo-1511599767150-a48a237f0083?q=80&w=600&auto=format&fit=crop',
      Accesorios: 'https://images.unsplash.com/photo-1624222247344-550fb8ecf7db?q=80&w=600&auto=format&fit=crop'
    };

    onAddProduct({
      name: newProdName,
      price: parseFloat(newProdPrice) || 45.0,
      stock: parseInt(newProdStock) || 5,
      category: newProdCategory,
      importedFrom: newProdOrigin,
      description: newProdDesc || 'Detalle curado importado con acabados artesanales de alta costura.',
      colors: newProdColors.split(',').map(c => c.trim()).filter(Boolean),
      image: newProdImage || imageFallbacks[newProdCategory],
      isNew: true,
      isLimited: isLimited
    });

    setNewProdName('');
    setNewProdPrice('');
    setNewProdStock('5');
    setNewProdDesc('');
    setNewProdImage('');
    setShowAddSuccess(true);
    setTimeout(() => setShowAddSuccess(false), 3000);
  };

  const handleFeatureChange = (index: number, field: 'title' | 'subtitle', value: string) => {
    const updated = [...features];
    updated[index] = { ...updated[index], [field]: value };
    setFeatures(updated);
  };

  const handleTestimonialChange = (index: number, field: 'quote' | 'author' | 'location', value: string) => {
    const updated = [...testimonials];
    updated[index] = { ...updated[index], [field]: value };
    setTestimonials(updated);
  };

  const handleAddTestimonial = () => {
    const nextId = testimonials.length > 0 ? Math.max(...testimonials.map(t => t.id)) + 1 : 1;
    const updated = [
      ...testimonials,
      {
        id: nextId,
        quote: "Las piezas de CRAFT+ son una verdadera obra de arte. La atención personalizada y el despacho rápido en Quito hacen toda la diferencia.",
        author: "Paula M.",
        location: "Quito, Cumbayá"
      }
    ];
    setTestimonials(updated);
  };

  const handleDeleteTestimonial = (id: number) => {
    setTestimonials(testimonials.filter(t => t.id !== id));
  };

  return (
    <aside className="w-full lg:w-[410px] bg-brand-dark text-brand-cream border-r border-brand-dark/30 flex flex-col h-full z-20 flex-shrink-0 select-none">
      
      {/* Title Header */}
      <div className="p-5 border-b border-white/10 flex flex-col justify-between bg-black/40">
        <div className="flex items-center gap-2 mb-1">
          <Sliders size={18} className="text-brand-accent" />
          <h2 className="text-sm font-serif font-black tracking-widest uppercase text-white">Live Customizer</h2>
        </div>
        <p className="text-[10px] text-brand-cream/60 leading-relaxed font-light">
          Modifica el contenido visual, catálogo de productos y simula campañas. Los cambios se actualizan al instante en el previsualizador de la derecha.
        </p>
      </div>

      {/* Editor Tab Switcher */}
      <div className="grid grid-cols-4 border-b border-white/10 bg-black/25 text-[10px] font-bold tracking-wider uppercase">
        <button
          onClick={() => setActiveTab('content')}
          className={`py-3.5 text-center border-b-2 transition-all focus:outline-none ${
            activeTab === 'content'
              ? 'border-brand-accent text-white bg-white/5'
              : 'border-transparent text-brand-cream/60 hover:text-white'
          }`}
        >
          Contenido
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`py-3.5 text-center border-b-2 transition-all focus:outline-none ${
            activeTab === 'inventory'
              ? 'border-brand-accent text-white bg-white/5'
              : 'border-transparent text-brand-cream/60 hover:text-white'
          }`}
        >
          Catálogo
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`py-3.5 text-center border-b-2 transition-all focus:outline-none ${
            activeTab === 'reviews'
              ? 'border-brand-accent text-white bg-white/5'
              : 'border-transparent text-brand-cream/60 hover:text-white'
          }`}
        >
          Reseñas
        </button>
        <button
          onClick={() => setActiveTab('campaign')}
          className={`py-3.5 text-center border-b-2 transition-all focus:outline-none ${
            activeTab === 'campaign'
              ? 'border-brand-accent text-white bg-white/5'
              : 'border-transparent text-brand-cream/60 hover:text-white'
          }`}
        >
          Campaña
        </button>
      </div>

      {/* Scrollable Workspace Forms */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin scrollbar-thumb-white/10">
        
        {/* TAB 1: CONTENT EDITOR */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            
            {/* HERO SECTION BLOCK */}
            <div className="space-y-4 border-b border-white/5 pb-5 text-left">
              <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                <span className="text-[10px] uppercase tracking-widest text-brand-accent font-bold flex items-center gap-1.5">
                  <ImageIcon size={12} />
                  <span>Sección Hero (Banner Principal)</span>
                </span>
              </div>
              
              <div className="space-y-3.5">
                <div>
                  <label className="block text-[9px] uppercase tracking-wider font-bold text-brand-cream/60 mb-1">Badge de Campaña</label>
                  <input
                    type="text"
                    value={heroTag}
                    onChange={(e) => setHeroTag(e.target.value)}
                    className="w-full bg-black/30 border border-white/15 rounded-none px-3 py-1.5 text-xs text-white focus:border-brand-accent focus:outline-none font-sans"
                  />
                </div>

                <div>
                  <label className="block text-[9px] uppercase tracking-wider font-bold text-brand-cream/60 mb-1">Título de Banner (HTML Soportado)</label>
                  <input
                    type="text"
                    value={heroTitle}
                    onChange={(e) => setHeroTitle(e.target.value)}
                    className="w-full bg-black/30 border border-white/15 rounded-none px-3 py-1.5 text-xs text-white focus:border-brand-accent focus:outline-none font-serif"
                    placeholder="Detalles que te definen."
                  />
                </div>

                <div>
                  <label className="block text-[9px] uppercase tracking-wider font-bold text-brand-cream/60 mb-1">Frase En Itálica (Resaltada)</label>
                  <input
                    type="text"
                    value={heroSubtitle}
                    onChange={(e) => setHeroSubtitle(e.target.value)}
                    className="w-full bg-black/30 border border-white/15 rounded-none px-3 py-1.5 text-xs text-white focus:border-brand-accent focus:outline-none font-serif italic"
                    placeholder="te definen"
                  />
                </div>

                <div>
                  <label className="block text-[9px] uppercase tracking-wider font-bold text-brand-cream/60 mb-1">Descripción de Introducción</label>
                  <textarea
                    rows={3}
                    value={heroDesc}
                    onChange={(e) => setHeroDesc(e.target.value)}
                    className="w-full bg-black/30 border border-white/15 rounded-none px-3 py-1.5 text-xs text-white focus:border-brand-accent focus:outline-none font-light leading-normal resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[9px] uppercase tracking-wider font-bold text-brand-cream/60 mb-1.5">Fondo del Hero (Presets Exclusivos)</label>
                  <div className="grid grid-cols-2 gap-2">
                    {heroPresets.map((p) => (
                      <button
                        key={p.name}
                        onClick={() => setHeroImage(p.url)}
                        className={`p-2 text-left text-[9px] tracking-wide uppercase transition-all border ${
                          heroImage === p.url
                            ? 'border-brand-accent bg-brand-accent text-brand-dark font-black'
                            : 'border-white/15 hover:border-white/35 bg-transparent text-brand-cream/80'
                        }`}
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                  <div className="mt-2.5">
                    <label className="block text-[8px] uppercase tracking-wider font-bold text-brand-cream/40 mb-1">O URL de imagen personalizada</label>
                    <input
                      type="text"
                      value={heroImage}
                      onChange={(e) => setHeroImage(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-black/30 border border-white/15 rounded-none px-3 py-1.5 text-[10px] text-white focus:border-brand-accent focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* TRUST BADGES SECTION */}
            <div className="space-y-4 text-left">
              <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                <span className="text-[10px] uppercase tracking-widest text-brand-accent font-bold flex items-center gap-1.5">
                  <Gift size={12} />
                  <span>3 Pilares & Beneficios (Features)</span>
                </span>
              </div>

              <div className="space-y-4">
                {features.map((feat, index) => (
                  <div key={feat.id} className="p-3 bg-black/15 border border-white/5 space-y-2.5">
                    <span className="text-[9px] font-mono font-bold text-brand-accent/70 uppercase">Pilar #{index + 1} ({feat.id})</span>
                    <div>
                      <label className="block text-[8px] uppercase tracking-wider font-semibold text-brand-cream/50 mb-0.5">Título del Beneficio</label>
                      <input
                        type="text"
                        value={feat.title}
                        onChange={(e) => handleFeatureChange(index, 'title', e.target.value)}
                        className="w-full bg-black/30 border border-white/10 rounded-none px-2 py-1 text-xs text-white focus:border-brand-accent focus:outline-none font-sans uppercase tracking-wider"
                      />
                    </div>
                    <div>
                      <label className="block text-[8px] uppercase tracking-wider font-semibold text-brand-cream/50 mb-0.5">Bajada o Subtítulo</label>
                      <input
                        type="text"
                        value={feat.subtitle}
                        onChange={(e) => handleFeatureChange(index, 'subtitle', e.target.value)}
                        className="w-full bg-black/30 border border-white/10 rounded-none px-2 py-1 text-xs text-white focus:border-brand-accent focus:outline-none font-light"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: INVENTORY & STOCK MANAGER */}
        {activeTab === 'inventory' && (
          <div className="space-y-6 text-left">
            
            {/* ADD PRODUCT FORM */}
            <div className="p-4 bg-black/20 border border-white/10 rounded-none space-y-4">
              <span className="text-[10px] uppercase tracking-widest text-brand-accent font-bold flex items-center gap-1.5 border-b border-white/10 pb-1.5">
                <Plus size={12} />
                <span>Importar Nueva Pieza Exclusiva</span>
              </span>

              {showAddSuccess && (
                <div className="p-2 bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-[10px] uppercase font-bold tracking-wider text-center">
                  ¡Producto importado con éxito!
                </div>
              )}

              <form onSubmit={handleCreateProductSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-brand-cream/60 mb-0.5">Nombre de la Pieza *</label>
                  <input
                    type="text"
                    required
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    placeholder="Ej. Cartera de Cuero Noir Atelier"
                    className="w-full bg-black/40 border border-white/15 rounded-none px-2.5 py-1 text-xs text-white focus:border-brand-accent focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[9px] uppercase tracking-wider text-brand-cream/60 mb-0.5">Precio (USD) *</label>
                    <input
                      type="number"
                      required
                      step="0.01"
                      value={newProdPrice}
                      onChange={(e) => setNewProdPrice(e.target.value)}
                      placeholder="95.00"
                      className="w-full bg-black/40 border border-white/15 rounded-none px-2.5 py-1 text-xs text-white focus:border-brand-accent focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase tracking-wider text-brand-cream/60 mb-0.5">Stock Inicial *</label>
                    <input
                      type="number"
                      required
                      value={newProdStock}
                      onChange={(e) => setNewProdStock(e.target.value)}
                      placeholder="5"
                      className="w-full bg-black/40 border border-white/15 rounded-none px-2.5 py-1 text-xs text-white focus:border-brand-accent focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[9px] uppercase tracking-wider text-brand-cream/60 mb-0.5">Categoría *</label>
                    <select
                      value={newProdCategory}
                      onChange={(e) => setNewProdCategory(e.target.value as any)}
                      className="w-full bg-black/40 border border-white/15 rounded-none px-2 py-1 text-xs text-white focus:border-brand-accent focus:outline-none"
                    >
                      <option value="Bolsos">Bolsos</option>
                      <option value="Joyería">Joyería</option>
                      <option value="Lentes">Lentes</option>
                      <option value="Accesorios">Accesorios</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase tracking-wider text-brand-cream/60 mb-0.5">Origen de Importación</label>
                    <select
                      value={newProdOrigin}
                      onChange={(e) => setNewProdOrigin(e.target.value)}
                      className="w-full bg-black/40 border border-white/15 rounded-none px-2 py-1 text-xs text-white focus:border-brand-accent focus:outline-none"
                    >
                      <option value="Italia">Italia</option>
                      <option value="Francia">Francia</option>
                      <option value="España">España</option>
                      <option value="EE.UU.">EE.UU.</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-brand-cream/60 mb-0.5">Variantes (Colores, separados por coma)</label>
                  <input
                    type="text"
                    value={newProdColors}
                    onChange={(e) => setNewProdColors(e.target.value)}
                    placeholder="Negro, Café, Arena"
                    className="w-full bg-black/40 border border-white/15 rounded-none px-2.5 py-1 text-xs text-white focus:border-brand-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-brand-cream/60 mb-0.5">URL de Imagen (Opcional, tiene por defecto)</label>
                  <input
                    type="text"
                    value={newProdImage}
                    onChange={(e) => setNewProdImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-black/40 border border-white/15 rounded-none px-2.5 py-1 text-[10px] text-white focus:border-brand-accent focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1 select-none">
                  <input
                    type="checkbox"
                    id="editor-limited"
                    checked={isLimited}
                    onChange={(e) => setIsLimited(e.target.checked)}
                    className="accent-brand-accent"
                  />
                  <label htmlFor="editor-limited" className="text-[10px] tracking-wide uppercase font-bold text-brand-cream/70 cursor-pointer">
                    Marcar como Edición Exclusiva / Limitada
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-brand-accent text-brand-dark font-bold uppercase tracking-widest rounded-none hover:bg-white transition-colors text-[10px] border border-transparent"
                >
                  Importar Pieza al Catálogo
                </button>
              </form>
            </div>

            {/* LIST OF CURRENT INVENTORY */}
            <div className="space-y-3.5">
              <span className="text-[10px] uppercase tracking-widest text-brand-accent font-bold flex items-center gap-1.5 border-b border-white/10 pb-1.5">
                <Package size={12} />
                <span>Inventario Activo ({products.length} productos)</span>
              </span>

              <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                {products.map((p) => (
                  <div key={p.id} className="p-3 bg-black/20 border border-white/10 flex items-start gap-3.5">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-10 h-10 object-cover bg-white/5 border border-white/10 flex-shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-serif font-black text-xs text-white truncate">{p.name}</h4>
                        <button
                          onClick={() => onDeleteProduct(p.id)}
                          className="text-red-400 hover:text-red-300 p-0.5 focus:outline-none"
                          title="Eliminar producto"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                      <p className="text-[9px] uppercase text-brand-cream/50 tracking-wider font-semibold mb-2">
                        {p.category} • {p.importedFrom}
                      </p>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[8px] uppercase tracking-wider text-brand-cream/40 mb-0.5">Precio USD</label>
                          <input
                            type="number"
                            value={p.price}
                            onChange={(e) => onUpdatePrice(p.id, parseFloat(e.target.value) || 0)}
                            className="w-full bg-black/40 border border-white/10 rounded-none px-1.5 py-0.5 text-xs text-white font-mono text-center focus:border-brand-accent focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] uppercase tracking-wider text-brand-cream/40 mb-0.5">Stock</label>
                          <div className="flex items-center bg-black/40 border border-white/10">
                            <button
                              onClick={() => onUpdateStock(p.id, Math.max(0, p.stock - 1))}
                              className="px-1.5 text-brand-cream/60 hover:text-white font-bold"
                            >
                              -
                            </button>
                            <span className="flex-1 text-center font-mono text-xs text-white">{p.stock}</span>
                            <button
                              onClick={() => onUpdateStock(p.id, p.stock + 1)}
                              className="px-1.5 text-brand-cream/60 hover:text-white font-bold"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: CUSTOMER REVIEWS / TESTIMONIALS */}
        {activeTab === 'reviews' && (
          <div className="space-y-6 text-left">
            <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
              <span className="text-[10px] uppercase tracking-widest text-brand-accent font-bold flex items-center gap-1.5">
                <Quote size={12} />
                <span>Testimonios de Clientes (Carrusel)</span>
              </span>
              <button
                onClick={handleAddTestimonial}
                className="text-[9px] uppercase tracking-widest bg-brand-accent text-brand-dark px-2 py-0.5 font-bold hover:bg-white transition-colors"
              >
                + Añadir
              </button>
            </div>

            <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
              {testimonials.map((t, index) => (
                <div key={t.id} className="p-3 bg-black/20 border border-white/10 space-y-2.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-mono font-bold text-brand-accent/70">Testimonio #{index + 1}</span>
                    <button
                      onClick={() => handleDeleteTestimonial(t.id)}
                      className="text-red-400 hover:text-red-300 p-0.5 focus:outline-none"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  <div>
                    <label className="block text-[8px] uppercase tracking-wider font-semibold text-brand-cream/50 mb-0.5">Cita / Reseña</label>
                    <textarea
                      rows={2}
                      value={t.quote}
                      onChange={(e) => handleTestimonialChange(index, 'quote', e.target.value)}
                      className="w-full bg-black/30 border border-white/10 rounded-none px-2 py-1 text-xs text-white focus:border-brand-accent focus:outline-none font-light leading-normal resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[8px] uppercase tracking-wider font-semibold text-brand-cream/50 mb-0.5">Autor</label>
                      <input
                        type="text"
                        value={t.author}
                        onChange={(e) => handleTestimonialChange(index, 'author', e.target.value)}
                        className="w-full bg-black/30 border border-white/10 rounded-none px-2 py-1 text-xs text-white focus:border-brand-accent focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[8px] uppercase tracking-wider font-semibold text-brand-cream/50 mb-0.5">Ubicación</label>
                      <input
                        type="text"
                        value={t.location}
                        onChange={(e) => handleTestimonialChange(index, 'location', e.target.value)}
                        className="w-full bg-black/30 border border-white/10 rounded-none px-2 py-1 text-xs text-white focus:border-brand-accent focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: STORE CAMPAIGN & ROTATION SIMULATOR */}
        {activeTab === 'campaign' && (
          <div className="space-y-6 text-left">
            
            {/* ROTATION ACTION BUTTON */}
            <div className="p-4 bg-black/20 border border-white/10 rounded-none space-y-3">
              <span className="text-[10px] uppercase tracking-widest text-brand-accent font-bold flex items-center gap-1.5 border-b border-white/10 pb-1.5">
                <RefreshCw size={12} />
                <span>Renovación Quincenal de Catálogo</span>
              </span>
              <p className="text-[10px] text-brand-cream/70 font-light leading-normal">
                En CRAFT+ la landing se actualiza cada 15 días renovando existencias, introduciendo nuevas piezas destacadas y ajustando sutilmente precios por aranceles.
              </p>
              <button
                onClick={onRotateCatalog}
                className="w-full py-3 bg-brand-accent hover:bg-white text-brand-dark font-serif font-bold text-xs uppercase tracking-[0.18em] transition-all flex items-center justify-center gap-2 border border-transparent"
              >
                <RefreshCw size={14} className="animate-spin" style={{ animationDuration: '6s' }} />
                <span>Simular Rotación de 15 Días</span>
              </button>
            </div>

            {/* GENERAL CAMPAIGN VARIABLES */}
            <div className="space-y-4">
              <span className="text-[10px] uppercase tracking-widest text-brand-accent font-bold flex items-center gap-1.5 border-b border-white/10 pb-1.5">
                <TrendingUp size={12} />
                <span>Variables de Simulación & Ofertas</span>
              </span>

              <div className="space-y-3.5">
                <div>
                  <div className="flex justify-between text-[9px] uppercase tracking-wider font-bold text-brand-cream/60 mb-1">
                    <span>Días para Próxima Renovación</span>
                    <span className="text-white font-mono text-xs">{daysRemaining} días</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="15"
                    value={daysRemaining}
                    onChange={(e) => setDaysRemaining(parseInt(e.target.value))}
                    className="w-full accent-brand-accent bg-white/10 h-1.5 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-[9px] uppercase tracking-wider font-bold text-brand-cream/60 mb-1">Ventas Acumuladas Simuladas (USD)</label>
                  <input
                    type="number"
                    value={simulatedSales}
                    onChange={(e) => setSimulatedSales(parseFloat(e.target.value) || 0)}
                    className="w-full bg-black/40 border border-white/15 rounded-none px-3 py-1.5 text-xs text-white font-mono focus:border-brand-accent focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[9px] uppercase tracking-wider font-bold text-brand-cream/60 mb-1">Cupón de Descuento</label>
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      className="w-full bg-black/40 border border-white/15 rounded-none px-3 py-1.5 text-xs text-white uppercase focus:border-brand-accent focus:outline-none font-mono"
                      placeholder="CRAFT10"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase tracking-wider font-bold text-brand-cream/60 mb-1">Descuento (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="1"
                      value={promoDiscount}
                      onChange={(e) => setPromoDiscount(parseFloat(e.target.value) || 0)}
                      className="w-full bg-black/40 border border-white/15 rounded-none px-3 py-1.5 text-xs text-white focus:border-brand-accent focus:outline-none font-mono"
                      placeholder="0.10"
                    />
                    <span className="text-[8px] text-brand-cream/50 mt-0.5 block">0.10 equivale al 10%</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Persistent Reset Footer */}
      <div className="p-4 border-t border-white/10 bg-black/45 flex gap-2.5">
        <button
          onClick={onResetDefaults}
          className="flex-1 py-2 border border-white/15 hover:border-brand-accent text-brand-cream hover:text-white text-[10px] uppercase font-bold tracking-widest transition-all"
        >
          Reestablecer Valores
        </button>
      </div>

    </aside>
  );
}
