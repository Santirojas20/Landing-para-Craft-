import React, { useState, useEffect } from 'react';
import { Product, CartItem, Order } from './types';
import { INITIAL_PRODUCTS, TESTIMONIALS } from './data';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import AdminPanel from './components/AdminPanel';
import Testimonials from './components/Testimonials';
import ExperienceBanner from './components/ExperienceBanner';
import Footer from './components/Footer';
import EditorSidebar from './components/EditorSidebar';
import { Search, SlidersHorizontal, Eye, RefreshCw, Star, Heart, RotateCcw, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // Core view mode state ('client' or 'admin')
  const [viewMode, setViewMode] = useState<'client' | 'admin'>('client');

  // Customizer Landing Page States with local storage fallbacks
  const [heroTitle, setHeroTitle] = useState<string>(() => {
    return localStorage.getItem('craft_hero_title') || "Detalles que te definen.";
  });
  const [heroSubtitle, setHeroSubtitle] = useState<string>(() => {
    return localStorage.getItem('craft_hero_subtitle') || "te definen";
  });
  const [heroDesc, setHeroDesc] = useState<string>(() => {
    return localStorage.getItem('craft_hero_desc') || "Piezas exclusivas seleccionadas a mano que elevan tu estilo diario. Ediciones muy limitadas, actualizadas cada 15 días.";
  });
  const [heroTag, setHeroTag] = useState<string>(() => {
    return localStorage.getItem('craft_hero_tag') || "Nueva Colección Curada";
  });
  const [heroImage, setHeroImage] = useState<string>(() => {
    return localStorage.getItem('craft_hero_image') || '/src/assets/images/craft_hero_1783708160745.jpg';
  });

  const [featuresList, setFeaturesList] = useState<any[]>(() => {
    const saved = localStorage.getItem('craft_features');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'importados',
        title: 'PRODUCTOS IMPORTADOS',
        subtitle: 'Curaduría exclusiva de Europa y EE.UU.',
      },
      {
        id: 'limitadas',
        title: 'EDICIONES LIMITADAS',
        subtitle: 'Renovación de catálogo cada 15 días',
      },
      {
        id: 'pagos',
        title: 'PAGOS 100% SEGUROS',
        subtitle: 'Simulación segura o pago contra entrega',
      },
    ];
  });

  const [testimonialsList, setTestimonialsList] = useState<any[]>(() => {
    const saved = localStorage.getItem('craft_testimonials');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return TESTIMONIALS;
  });

  // Core e-commerce states with persistence
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('craft_products');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_PRODUCTS;
  });
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [savedProductIds, setSavedProductIds] = useState<string[]>([]);
  
  // Interaction overlays states
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [sortBy, setSortBy] = useState<string>('default');
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  // Dynamic renewal / simulation states
  const [daysRemaining, setDaysRemaining] = useState<number>(() => {
    const saved = localStorage.getItem('craft_days_remaining');
    return saved ? parseInt(saved) : 12;
  });
  const [simulatedSales, setSimulatedSales] = useState<number>(() => {
    const saved = localStorage.getItem('craft_simulated_sales');
    return saved ? parseFloat(saved) : 248.00;
  });
  const [selectedSector, setSelectedSector] = useState<string>('norte');
  const [promoCode, setPromoCode] = useState<string>(() => {
    return localStorage.getItem('craft_promo_code') || '';
  });
  const [promoDiscount, setPromoDiscount] = useState<number>(() => {
    const saved = localStorage.getItem('craft_promo_discount');
    return saved ? parseFloat(saved) : 0;
  });

  // Auto-save changes to localStorage
  useEffect(() => {
    localStorage.setItem('craft_hero_title', heroTitle);
  }, [heroTitle]);

  useEffect(() => {
    localStorage.setItem('craft_hero_subtitle', heroSubtitle);
  }, [heroSubtitle]);

  useEffect(() => {
    localStorage.setItem('craft_hero_desc', heroDesc);
  }, [heroDesc]);

  useEffect(() => {
    localStorage.setItem('craft_hero_tag', heroTag);
  }, [heroTag]);

  useEffect(() => {
    localStorage.setItem('craft_hero_image', heroImage);
  }, [heroImage]);

  useEffect(() => {
    localStorage.setItem('craft_features', JSON.stringify(featuresList));
  }, [featuresList]);

  useEffect(() => {
    localStorage.setItem('craft_testimonials', JSON.stringify(testimonialsList));
  }, [testimonialsList]);

  useEffect(() => {
    localStorage.setItem('craft_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('craft_days_remaining', daysRemaining.toString());
  }, [daysRemaining]);

  useEffect(() => {
    localStorage.setItem('craft_simulated_sales', simulatedSales.toString());
  }, [simulatedSales]);

  useEffect(() => {
    localStorage.setItem('craft_promo_code', promoCode);
  }, [promoCode]);

  useEffect(() => {
    localStorage.setItem('craft_promo_discount', promoDiscount.toString());
  }, [promoDiscount]);

  // Cart operations
  const handleAddToCart = (product: Product, quantity: number = 1, selectedColor: string = '') => {
    // Determine color choice if not provided
    const color = selectedColor || (product.colors && product.colors.length > 0 ? product.colors[0] : '');
    
    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => item.product.id === product.id && item.selectedColor === color
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];
        const newQty = updated[existingIndex].quantity + quantity;
        // Clamp to product maximum stock
        updated[existingIndex].quantity = Math.min(newQty, product.stock);
        return updated;
      } else {
        return [...prevItems, { product, quantity: Math.min(quantity, product.stock), selectedColor: color }];
      }
    });
  };

  // Quick direct cart button (desktop grid)
  const handleQuickAddToCart = (product: Product, event: React.MouseEvent) => {
    event.stopPropagation();
    handleAddToCart(product, 1);
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (productId: string, selectedColor: string, quantity: number) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    setCartItems((prevItems) => {
      return prevItems
        .map((item) => {
          if (item.product.id === productId && item.selectedColor === selectedColor) {
            return { ...item, quantity: Math.min(Math.max(1, quantity), product.stock) };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  const handleRemoveCartItem = (productId: string, selectedColor: string) => {
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) => !(item.product.id === productId && item.selectedColor === selectedColor)
      )
    );
  };

  // Wishlist/Favorites
  const handleToggleSave = (productId: string, event?: React.MouseEvent) => {
    if (event) event.stopPropagation();
    setSavedProductIds((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  // Admin backoffice simulation logic
  const handleUpdateStock = (productId: string, newStock: number) => {
    setProducts((prevProducts) =>
      prevProducts.map((p) => (p.id === productId ? { ...p, stock: newStock } : p))
    );
  };

  const handleUpdatePrice = (productId: string, newPrice: number) => {
    setProducts((prevProducts) =>
      prevProducts.map((p) => (p.id === productId ? { ...p, price: newPrice } : p))
    );
  };

  const handleAddProduct = (newProduct: Omit<Product, 'id'>) => {
    const nextId = (Math.max(...products.map((p) => parseInt(p.id)), 0) + 1).toString();
    const created: Product = { ...newProduct, id: nextId };
    setProducts((prev) => [created, ...prev]);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleResetDefaults = () => {
    if (window.confirm('¿Estás seguro de que deseas restablecer todo el contenido y catálogo de CRAFT+ a sus valores originales de fábrica? Perderás tus ediciones actuales.')) {
      localStorage.clear();
      setHeroTitle("Detalles que te definen.");
      setHeroSubtitle("te definen");
      setHeroDesc("Piezas exclusivas seleccionadas a mano que elevan tu estilo diario. Ediciones muy limitadas, actualizadas cada 15 días.");
      setHeroTag("Nueva Colección Curada");
      setHeroImage('/src/assets/images/craft_hero_1783708160745.jpg');
      setFeaturesList([
        {
          id: 'importados',
          title: 'PRODUCTOS IMPORTADOS',
          subtitle: 'Curaduría exclusiva de Europa y EE.UU.',
        },
        {
          id: 'limitadas',
          title: 'EDICIONES LIMITADAS',
          subtitle: 'Renovación de catálogo cada 15 días',
        },
        {
          id: 'pagos',
          title: 'PAGOS 100% SEGUROS',
          subtitle: 'Simulación segura o pago contra entrega',
        },
      ]);
      setTestimonialsList(TESTIMONIALS);
      setProducts(INITIAL_PRODUCTS);
      setDaysRemaining(12);
      setSimulatedSales(248.00);
      setPromoCode('');
      setPromoDiscount(0);
    }
  };

  // Simulate full 15-day catalog rotation
  const handleRotateCatalog = () => {
    setProducts((prevProducts) => {
      return prevProducts.map((p) => {
        // Restock random items
        const newStock = Math.floor(Math.random() * 8) + 3; // between 3 and 10
        // Price fluctuations +/- 5% due to import duties
        const changeFactor = 1 + (Math.random() * 0.1 - 0.05);
        const rawPrice = p.price * changeFactor;
        // Round to nearest dollar or fifty cents
        const adjustedPrice = Math.round(rawPrice * 2) / 2;

        // Toggle random visual badges to simulate new shipment arrivals
        const randomNew = Math.random() > 0.5;
        const randomLimited = Math.random() > 0.6;

        return {
          ...p,
          stock: newStock,
          price: adjustedPrice,
          isNew: randomNew,
          isLimited: randomLimited,
        };
      });
    });

    // Reset visual countdown timer
    setDaysRemaining(15);
  };

  // Completed successful checkout
  const handleOrderComplete = (order: Order) => {
    // Subtract stock levels
    setProducts((prevProducts) => {
      return prevProducts.map((p) => {
        const orderedItem = order.items.find((item) => item.productId === p.id);
        if (orderedItem) {
          const updatedStock = Math.max(0, p.stock - orderedItem.quantity);
          return { ...p, stock: updatedStock };
        }
        return p;
      });
    });

    // Accumulate sales total
    setSimulatedSales((prev) => prev + order.total);
    // Flush shopping cart
    setCartItems([]);
  };

  // Product Filter & Search lists
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.importedFrom.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
    const matchesSaved = !showSavedOnly || savedProductIds.includes(product.id);

    return matchesSearch && matchesCategory && matchesSaved;
  });

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    if (sortBy === 'limited') {
      if (a.isLimited && !b.isLimited) return -1;
      if (!a.isLimited && b.isLimited) return 1;
    }
    return 0; // default order
  });

  const categories = ['Todos', 'Bolsos', 'Joyería', 'Lentes', 'Accesorios'];

  return (
    <div className="min-h-screen bg-white text-neutral-800 flex flex-col font-sans antialiased selection:bg-neutral-900 selection:text-white">
      {/* Dynamic Announcement Bar */}
      <div id="announcement-bar" className="w-full bg-brand-dark text-brand-cream py-2 px-4 text-center text-[10px] sm:text-xs font-light tracking-[0.2em] uppercase z-50">
        <div className="flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 bg-brand-accent rounded-full animate-ping" />
          <span>Envíos a todo Ecuador • Entregas rápidas en Quito</span>
        </div>
      </div>

      {/* Elegant Role Switcher Workspace Header */}
      <div className="bg-brand-light-beige border-b border-brand-dark/15 py-3 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between text-xs font-sans text-brand-dark gap-3 z-45">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-dark animate-pulse" />
          <p className="font-light tracking-wide text-center md:text-left">
            Estás interactuando con el prototipo de <strong className="text-brand-dark font-black">CRAFT+</strong>. Selecciona la versión que deseas probar:
          </p>
        </div>
        <div className="flex items-center gap-1 bg-white border border-brand-dark/20 p-1 shadow-sm">
          <button
            onClick={() => setViewMode('client')}
            className={`px-4 py-1.5 text-[10px] uppercase tracking-wider font-bold transition-all cursor-pointer ${
              viewMode === 'client'
                ? 'bg-brand-dark text-white font-black'
                : 'text-brand-dark/60 hover:text-brand-dark'
            }`}
          >
            Vista Cliente Final
          </button>
          <button
            onClick={() => setViewMode('admin')}
            className={`px-4 py-1.5 text-[10px] uppercase tracking-wider font-bold transition-all cursor-pointer ${
              viewMode === 'admin'
                ? 'bg-brand-accent text-brand-dark font-black'
                : 'text-brand-dark/60 hover:text-brand-dark'
            }`}
          >
            Vista Administrador (Editar)
          </button>
        </div>
      </div>

      <div className={`flex flex-col lg:flex-row flex-1 ${viewMode === 'admin' ? 'lg:h-[calc(100vh-100px)] overflow-hidden' : ''}`}>
        
        {/* Unified Live Customizer & Stock Manager Sidebar */}
        {viewMode === 'admin' && (
          <EditorSidebar
            heroTitle={heroTitle}
            setHeroTitle={setHeroTitle}
            heroSubtitle={heroSubtitle}
            setHeroSubtitle={setHeroSubtitle}
            heroDesc={heroDesc}
            setHeroDesc={setHeroDesc}
            heroTag={heroTag}
            setHeroTag={setHeroTag}
            heroImage={heroImage}
            setHeroImage={setHeroImage}
            features={featuresList}
            setFeatures={setFeaturesList}
            testimonials={testimonialsList}
            setTestimonials={setTestimonialsList}
            products={products}
            onUpdateStock={handleUpdateStock}
            onUpdatePrice={handleUpdatePrice}
            onAddProduct={handleAddProduct}
            onDeleteProduct={handleDeleteProduct}
            daysRemaining={daysRemaining}
            setDaysRemaining={setDaysRemaining}
            simulatedSales={simulatedSales}
            setSimulatedSales={setSimulatedSales}
            promoCode={promoCode}
            setPromoCode={setPromoCode}
            promoDiscount={promoDiscount}
            setPromoDiscount={setPromoDiscount}
            onRotateCatalog={handleRotateCatalog}
            onResetDefaults={handleResetDefaults}
          />
        )}

        {/* Live Shop Preview Pane */}
        <div className={`flex-1 flex flex-col ${viewMode === 'admin' ? 'overflow-y-auto bg-neutral-100/30' : ''}`}>
          
          {/* Sticky Header */}
          <Header
            cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
            onCartClick={() => setIsCartOpen(true)}
            onAdminClick={() => {
              setViewMode(viewMode === 'admin' ? 'client' : 'admin');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onCatalogClick={() => {
              setSelectedCategory('Todos');
              setShowSavedOnly(false);
              document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            savedCount={savedProductIds.length}
            onSavedClick={() => {
              setShowSavedOnly((prev) => !prev);
              setSelectedCategory('Todos');
              document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            daysRemaining={daysRemaining}
          />

          {/* Hero Banner Section (Customized) */}
          <Hero
            title={heroTitle}
            subtitle={heroSubtitle}
            description={heroDesc}
            tag={heroTag}
            image={heroImage}
            isAdminMode={viewMode === 'admin'}
            onDiscoverClick={() => {
              document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
          />

          {/* Trust Badges Features Ribbon (Customized) */}
          <Features 
            items={featuresList}
            isAdminMode={viewMode === 'admin'}
          />

          {/* Curated Product Catalog Section */}
          <section id="catalog-section" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full scroll-mt-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-neutral-100 gap-4">
              {/* Header titles */}
              <div className="space-y-1.5 text-left">
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-neutral-400 block">EXCLUSIVIDAD GARANTIZADA</span>
                <h2 className="text-2xl sm:text-3xl font-normal text-neutral-900 tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
                  {showSavedOnly ? 'Tus Piezas Favoritas' : 'Seleccionado para ti'}
                </h2>
                <p className="text-xs text-neutral-500 font-light max-w-md">
                  Colección limitada de importaciones de alta gama. Stock limitado en Quito, se renueva cada 15 días.
                </p>
              </div>

              {/* Quick Clear controls */}
              <div className="flex flex-wrap items-center gap-3">
                {showSavedOnly && (
                  <button
                    id="view-all-favorites-btn"
                    onClick={() => {
                      setShowSavedOnly(false);
                      setSelectedCategory('Todos');
                    }}
                    className="text-xs font-semibold uppercase tracking-widest text-neutral-900 hover:text-neutral-500 border-b border-neutral-900 pb-1 flex items-center gap-1 transition-all"
                  >
                    <RotateCcw size={12} />
                    <span>Ver Todo el Catálogo</span>
                  </button>
                )}
                {!showSavedOnly && (
                  <button
                    id="quick-view-all-shortcut"
                    onClick={() => {
                      setSelectedCategory('Todos');
                      setSearchQuery('');
                      setSortBy('default');
                    }}
                    className="text-xs font-semibold uppercase tracking-widest text-neutral-900 hover:text-neutral-500 border-b border-neutral-900 pb-1 transition-all"
                  >
                    VER TODO
                  </button>
                )}
              </div>
            </div>

            {/* Filters and Search Bar Container */}
            <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-100 mb-8 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                {/* Search Input field */}
                <div className="relative flex-1 max-w-md">
                  <input
                    id="catalog-search-query-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar por artículo, país (Francia, Italia...)"
                    className="w-full bg-white border border-neutral-200 rounded-xl py-2.5 pl-10 pr-4 text-xs sm:text-sm text-neutral-800 placeholder-neutral-400 focus:ring-1 focus:ring-neutral-950 focus:border-neutral-950 focus:outline-none transition-all"
                  />
                  <Search size={16} className="absolute left-3.5 top-3 text-neutral-400" />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3.5 top-3 text-neutral-400 hover:text-neutral-900 text-xs"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Sorting choices */}
                <div className="flex items-center gap-3">
                  <span className="text-xs text-neutral-500 flex items-center gap-1.5 whitespace-nowrap">
                    <SlidersHorizontal size={13} />
                    <span>Ordenar por:</span>
                  </span>
                  <select
                    id="catalog-sorting-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-white border border-neutral-200 rounded-xl py-2 px-3 text-xs text-neutral-700 focus:ring-1 focus:ring-neutral-950 focus:border-neutral-950 focus:outline-none"
                  >
                    <option value="default">Predeterminado</option>
                    <option value="price_asc">Precio: Menor a Mayor</option>
                    <option value="price_desc">Precio: Mayor a Menor</option>
                    <option value="limited">Edición Limitada Primero</option>
                  </select>
                </div>
              </div>

              {/* Category Pill Tabs */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-neutral-200/50">
                {categories.map((cat) => {
                  const count = cat === 'Todos' 
                    ? products.length 
                    : products.filter((p) => p.category === cat).length;

                  return (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setShowSavedOnly(false);
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-medium tracking-wide transition-all focus:outline-none ${
                        selectedCategory === cat && !showSavedOnly
                          ? 'bg-neutral-950 text-white font-semibold shadow-md'
                          : 'bg-white hover:bg-neutral-100 text-neutral-600 border border-neutral-200/60'
                      }`}
                    >
                      {cat} <span className="opacity-60 text-[10px] ml-0.5">({count})</span>
                    </button>
                  );
                })}

                {/* Favorites Tab pill */}
                <button
                  id="wishlist-tab-pill"
                  onClick={() => {
                    setShowSavedOnly(true);
                    setSelectedCategory('Todos');
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-medium tracking-wide transition-all focus:outline-none flex items-center gap-1.5 ${
                    showSavedOnly
                      ? 'bg-red-500 text-white font-semibold shadow-md'
                      : 'bg-white hover:bg-neutral-100 text-red-500 border border-red-200'
                  }`}
                >
                  <Heart size={12} className={showSavedOnly ? 'fill-white stroke-white' : 'fill-red-500'} />
                  <span>Guardados ({savedProductIds.length})</span>
                </button>
              </div>
            </div>

            {/* Next Renovation Banner countdown */}
            <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 text-neutral-800">
              <div className="flex items-center gap-3 text-center sm:text-left">
                <RefreshCw className="text-amber-600 stroke-[1.5] animate-spin" style={{ animationDuration: '10s' }} size={20} />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-amber-900">Rotación quincenal del catálogo activo</p>
                  <p className="text-xs text-neutral-600 font-light leading-relaxed">
                    Nuestras piezas son de edición limitada de menos de 50 artículos. En <strong>{daysRemaining} días</strong> retiraremos el catálogo actual para importar la nueva colección.
                  </p>
                </div>
              </div>
              <button
                id="simulation-trigger-button-top"
                onClick={() => {
                  setViewMode('admin');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold tracking-wider uppercase transition-all whitespace-nowrap focus:outline-none cursor-pointer"
              >
                Configurar Campaña
              </button>
            </div>

            {/* Curated Products Grid */}
            <AnimatePresence mode="popLayout">
              {sortedProducts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-16 text-center space-y-4"
                >
                  <div className="text-neutral-300 flex justify-center">
                    <Search size={48} className="stroke-[1]" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-semibold text-neutral-800">No se encontraron artículos</h3>
                    <p className="text-xs text-neutral-400 font-light max-w-xs mx-auto">
                      Prueba reajustando tu filtro de categoría o escribe otra consulta de búsqueda.
                    </p>
                  </div>
                  <button
                    id="reset-filters-grid-btn"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('Todos');
                      setShowSavedOnly(false);
                    }}
                    className="px-5 py-2 border border-neutral-900 text-neutral-900 text-xs tracking-widest uppercase hover:bg-neutral-950 hover:text-white rounded-sm transition-all font-medium"
                  >
                    Limpiar Filtros
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
                >
                  {sortedProducts.map((product) => (
                    <div key={product.id} className="relative group">
                      <ProductCard
                        product={product}
                        onSelect={setSelectedProduct}
                        onAddToCart={handleQuickAddToCart}
                        isSaved={savedProductIds.includes(product.id)}
                        onToggleSave={handleToggleSave}
                      />
                      {viewMode === 'admin' && (
                        <div className="absolute top-2.5 left-2.5 z-20 flex gap-1.5">
                          <span className="bg-brand-dark/90 text-brand-accent text-[9px] uppercase font-bold tracking-wider px-2 py-1 border border-brand-accent/30 shadow-lg">
                            Stock: {product.stock}
                          </span>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="bg-red-600 hover:bg-red-700 text-white p-1 rounded-sm shadow-md"
                            title="Eliminar del catálogo"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* Customer Testimonials Slider (Customized) */}
          <Testimonials 
            items={testimonialsList}
            isAdminMode={viewMode === 'admin'}
          />

          {/* Brand Package Experience Story Banner */}
          <ExperienceBanner />

          {/* Footer Details with shortcuts */}
          <Footer
            onAdminClick={() => {
              setViewMode('admin');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onCatalogClick={() => {
              setSelectedCategory('Todos');
              setShowSavedOnly(false);
              document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
          />

        </div>
      </div>

      {/* Sub-panels Modals Render */}

      {/* Immersive Product Details screen modal */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onAddToCart={handleAddToCart}
            isSaved={savedProductIds.includes(selectedProduct.id)}
            onToggleSave={handleToggleSave}
          />
        )}
      </AnimatePresence>

      {/* Sliding Shop Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <CartDrawer
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveCartItem}
            selectedSector={selectedSector}
            onSelectSector={setSelectedSector}
            promoCode={promoCode}
            onApplyPromoCode={(code) => {
              setPromoCode(code);
              setPromoDiscount(0.1); // 10% off
            }}
            promoDiscount={promoDiscount}
            onCheckoutClick={() => {
              setIsCartOpen(false);
              setIsCheckoutOpen(true);
            }}
          />
        )}
      </AnimatePresence>

      {/* Elegant Checkout and payment simulation */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <CheckoutModal
            isOpen={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)}
            cartItems={cartItems}
            selectedSector={selectedSector}
            promoDiscount={promoDiscount}
            promoCode={promoCode}
            onOrderComplete={handleOrderComplete}
          />
        )}
      </AnimatePresence>

      {/* Administrative Stock & Catalog Manager backoffice dialog - Kept for secondary compatibility */}
      <AnimatePresence>
        {isAdminOpen && (
          <AdminPanel
            isOpen={isAdminOpen}
            onClose={() => setIsAdminOpen(false)}
            products={products}
            onUpdateStock={handleUpdateStock}
            onUpdatePrice={handleUpdatePrice}
            onRotateCatalog={handleRotateCatalog}
            onAddProduct={handleAddProduct}
            simulatedSales={simulatedSales}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
