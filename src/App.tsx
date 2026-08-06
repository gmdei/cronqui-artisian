import React, { useState, useEffect, useMemo } from 'react';
import { SpoonableFlavor, CartItem, ThemeSettings } from './types';
import { SPOONABLES_FLAVORS, DEFAULT_THEME_SETTINGS } from './data/spoonables';
import { useLanguage } from './context/LanguageContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Story } from './components/Story';
import { FlavorFilter } from './components/FlavorFilter';
import { ProductGrid } from './components/ProductGrid';
import { FlavorDetailModal } from './components/FlavorDetailModal';
import { Newsletter } from './components/Newsletter';
import { Footer } from './components/Footer';
import { AdminModal } from './components/AdminModal';
import { CartDrawer } from './components/CartDrawer';

export default function App() {
  const { t } = useLanguage();

  // Theme Settings state with localStorage persistence
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>(() => {
    try {
      const saved = localStorage.getItem('crunqi_theme');
      return saved ? JSON.parse(saved) : DEFAULT_THEME_SETTINGS;
    } catch {
      return DEFAULT_THEME_SETTINGS;
    }
  });

  const validateFlavors = (data: any): SpoonableFlavor[] => {
    if (!Array.isArray(data)) return SPOONABLES_FLAVORS;
    return data.map((item: any) => {
      return {
        id: item.id || `custom-prod-${Date.now()}-${Math.random()}`,
        name: item.name || 'Postre sin nombre',
        badge: item.badge || '',
        isBestseller: !!item.isBestseller,
        isGlutenFree: !!item.isGlutenFree,
        category: ['fruit', 'citrus', 'rich', 'special'].includes(item.category) ? item.category : 'fruit',
        description: item.description || '',
        shortDescription: item.shortDescription || item.description?.slice(0, 60) || '',
        tags: Array.isArray(item.tags) ? item.tags : ['Artisanal'],
        layers: Array.isArray(item.layers) ? item.layers : ['Capa de Crema', 'Sponge', 'Crumble'],
        ingredients: Array.isArray(item.ingredients) ? item.ingredients : ['Ingredientes Selectos'],
        price: typeof item.price === 'number' && !isNaN(item.price) ? item.price : 9.50,
        image: item.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxo3zAuTOcfsSataHEVO0imunoM6gQyPsJ9Xn-EDC2vYI7NTXsaQKK4Eeir1na7O2HxrUF8jO5Y90uAMg2Au0WqEZjJ6rPacu4YiX-urVrqO1tgpNcBwf6E4KvVQVcRxR9T2saMtYYbxPA0u-fLNWX1cLZtzqW4NcEe30doKjYyJ_CCfOsZgTD9KVGaQ_Mlk3SboLJCNuwtG79GlzDkEA0GoBLSThxgQXYbRI0NGLxxE4b5xoSUPHh',
        calories: typeof item.calories === 'number' ? item.calories : 340,
        rating: typeof item.rating === 'number' ? item.rating : 5.0,
        reviewsCount: typeof item.reviewsCount === 'number' ? item.reviewsCount : 1,
        stock: typeof item.stock === 'number' ? item.stock : 12
      };
    });
  };

  // Flavors state with localStorage persistence
  const [flavors, setFlavors] = useState<SpoonableFlavor[]>(() => {
    try {
      const saved = localStorage.getItem('crunqi_flavors');
      return saved ? validateFlavors(JSON.parse(saved)) : SPOONABLES_FLAVORS;
    } catch {
      return SPOONABLES_FLAVORS;
    }
  });

  // Cart Items state with localStorage persistence
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('crunqi_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [activeFlavor, setActiveFlavor] = useState<SpoonableFlavor | null>(null);
  const [cartOpen, setCartOpen] = useState<boolean>(false);
  const [adminOpen, setAdminOpen] = useState<boolean>(false);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Persist Theme
  useEffect(() => {
    try {
      localStorage.setItem('crunqi_theme', JSON.stringify(themeSettings));
    } catch (e) {
      console.error("Failed to save theme settings to localStorage:", e);
    }
  }, [themeSettings]);

  // Persist Flavors Catalog
  useEffect(() => {
    try {
      localStorage.setItem('crunqi_flavors', JSON.stringify(flavors));
    } catch (e) {
      console.error("Failed to save flavors to localStorage:", e);
      if (e instanceof DOMException && (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
        alert("¡Error de espacio en el navegador! No se pudieron guardar todos los productos porque algunas imágenes de producto son demasiado grandes. Se ha activado la compresión en subidas nuevas para evitar esto.");
      }
    }
  }, [flavors]);

  // Persist Cart
  useEffect(() => {
    try {
      localStorage.setItem('crunqi_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error("Failed to save cart to localStorage:", e);
    }
  }, [cartItems]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Add to Cart handler
  const handleAddToCart = (
    flavor: SpoonableFlavor, 
    quantity: number = 1, 
    size: 'Mini (200ml)' | 'Standard (350ml)' | 'Grand (750ml)' = 'Standard (350ml)'
  ) => {
    setCartItems(prev => {
      const existingIdx = prev.findIndex(item => item.flavor.id === flavor.id && item.customization?.size === size);
      if (existingIdx > -1) {
        const copy = [...prev];
        copy[existingIdx].quantity += quantity;
        return copy;
      } else {
        return [...prev, { flavor, quantity, customization: { size } }];
      }
    });
    showToast(`¡Añadido ${quantity}x ${flavor.name} a tu bolsa!`);
  };

  const handleUpdateCartQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(index);
    } else {
      setCartItems(prev => prev.map((item, i) => i === index ? { ...item, quantity: newQty } : item));
    }
  };

  const handleRemoveCartItem = (index: number) => {
    setCartItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Filtered flavors for Spoonables collection
  const filteredFlavors = useMemo(() => {
    return flavors.filter(f => {
      if (selectedCategory === 'bestseller' && !f.isBestseller) return false;
      if (selectedCategory === 'gf' && !f.isGlutenFree) return false;
      if (['fruit', 'citrus', 'rich'].includes(selectedCategory) && f.category !== selectedCategory) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = f.name.toLowerCase().includes(query);
        const matchesDesc = f.description.toLowerCase().includes(query);
        const matchesTags = f.tags.some(t => t.toLowerCase().includes(query));
        const matchesLayers = f.layers.some(l => l.toLowerCase().includes(query));
        return matchesName || matchesDesc || matchesTags || matchesLayers;
      }

      return true;
    });
  }, [flavors, selectedCategory, searchQuery]);

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#fdf9f3] text-[#1c1c18] flex flex-col font-sans antialiased selection:bg-[#39c0d3] selection:text-white scroll-smooth">
      
      {/* Top Header */}
      <Header
        cartCount={totalCartCount}
        onOpenCart={() => setCartOpen(true)}
        onOpenAdmin={() => setAdminOpen(true)}
        whatsappNumber={themeSettings.whatsappNumber}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* Hero Section */}
        <Hero
          onExploreClick={() => {
            const el = document.getElementById('spoonables');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          whatsappNumber={themeSettings.whatsappNumber}
        />

        {/* Spoonables Collection Showcase */}
        <section id="spoonables" className="py-20 md:py-24 max-w-[1280px] mx-auto px-5 md:px-16 w-full scroll-mt-16">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-4xl sm:text-5xl font-serif font-bold text-[#26170c] tracking-tight">
              {t('spoonables.title')}
            </h2>
            <div className="w-24 h-1.5 bg-[#39c0d3] mx-auto rounded-full" />
            <p className="text-base sm:text-lg text-[#4f453f] max-w-2xl mx-auto leading-relaxed">
              {t('spoonables.subtitle')}
            </p>
          </div>

          <FlavorFilter
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          <ProductGrid
            flavors={filteredFlavors}
            onSelectFlavor={(flavor) => setActiveFlavor(flavor)}
            onAddToCart={(flavor) => handleAddToCart(flavor, 1)}
            whatsappNumber={themeSettings.whatsappNumber}
          />
        </section>

        {/* Story Section */}
        <Story 
          customPhotoUrl={themeSettings.heidiPhotoUrl}
          onUpdatePhotoUrl={(url) => setThemeSettings(prev => ({ ...prev, heidiPhotoUrl: url }))}
        />

        {/* Newsletter Signup */}
        <Newsletter />

      </main>

      {/* Footer */}
      <Footer
        onOpenAdmin={() => setAdminOpen(true)}
        whatsappNumber={themeSettings.whatsappNumber}
        instagramUrl={themeSettings.instagramUrl}
        facebookUrl={themeSettings.facebookUrl}
      />

      {/* Detail Modal */}
      <FlavorDetailModal
        flavor={activeFlavor}
        onClose={() => setActiveFlavor(null)}
        onAddToCart={(flavor, qty, size) => handleAddToCart(flavor, qty, size)}
        whatsappNumber={themeSettings.whatsappNumber}
      />



      {/* Cart Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        whatsappNumber={themeSettings.whatsappNumber}
      />

      {/* Admin / Control Panel Modal */}
      <AdminModal
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
        flavors={flavors}
        onUpdateFlavors={setFlavors}
        themeSettings={themeSettings}
        onUpdateThemeSettings={setThemeSettings}
      />

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#26170c] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-[#39c0d3]/40 animate-fade-in text-xs font-semibold">
          <span className="material-symbols-outlined text-[#39c0d3] text-[20px]">shopping_bag</span>
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-white/60 hover:text-white">
            ✕
          </button>
        </div>
      )}

    </div>
  );
}
