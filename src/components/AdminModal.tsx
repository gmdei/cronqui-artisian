import React, { useState, useEffect } from 'react';
import { SpoonableFlavor, BatchInfo, ThemeSettings } from '../types';
import { CURRENT_BATCH } from '../data/spoonables';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  flavors: SpoonableFlavor[];
  onUpdateFlavors: (flavors: SpoonableFlavor[]) => void;
  themeSettings: ThemeSettings;
  onUpdateThemeSettings: (settings: ThemeSettings) => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  flavors,
  onUpdateFlavors,
  themeSettings,
  onUpdateThemeSettings
}) => {
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState<'theme' | 'products' | 'whatsapp' | 'batch'>('theme');
  const [batch, setBatch] = useState<BatchInfo>(CURRENT_BATCH);

  // New product form state
  const [newProduct, setNewProduct] = useState<Partial<SpoonableFlavor>>({
    name: '',
    price: 9.50,
    category: 'fruit',
    description: '',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxo3zAuTOcfsSataHEVO0imunoM6gQyPsJ9Xn-EDC2vYI7NTXsaQKK4Eeir1na7O2HxrUF8jO5Y90uAMg2Au0WqEZjJ6rPacu4YiX-urVrqO1tgpNcBwf6E4KvVQVcRxR9T2saMtYYbxPA0u-fLNWX1cLZtzqW4NcEe30doKjYyJ_CCfOsZgTD9KVGaQ_Mlk3SboLJCNuwtG79GlzDkEA0GoBLSThxgQXYbRI0NGLxxE4b5xoSUPHh',
    badge: 'Nuevo Postre',
    tags: ['Artisanal', 'Fresh'],
    layers: ['Crema Terciopelo', 'Capa de Bizcocho', 'Crujiente Topping'],
    ingredients: ['Crema Mascarpone', 'Azúcar Orgánica'],
    rating: 5.0,
    reviewsCount: 1
  });

  // Editing product state
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'l') {
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === 'crunqi-artisan' || passcode.trim() === 'admin' || passcode.trim() === '1234') {
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  const handleToggleBestseller = (id: string) => {
    const updated = flavors.map(f => f.id === id ? { ...f, isBestseller: !f.isBestseller } : f);
    onUpdateFlavors(updated);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este producto del catálogo?')) {
      const updated = flavors.filter(f => f.id !== id);
      onUpdateFlavors(updated);
    }
  };

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;

    const createdItem: SpoonableFlavor = {
      id: `custom-prod-${Date.now()}`,
      name: newProduct.name || 'Postre Artesanal',
      price: Number(newProduct.price) || 9.50,
      category: (newProduct.category as any) || 'fruit',
      description: newProduct.description || 'Delicioso postre en frasco en capas de crema y crujiente.',
      shortDescription: newProduct.description?.slice(0, 60),
      image: newProduct.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxo3zAuTOcfsSataHEVO0imunoM6gQyPsJ9Xn-EDC2vYI7NTXsaQKK4Eeir1na7O2HxrUF8jO5Y90uAMg2Au0WqEZjJ6rPacu4YiX-urVrqO1tgpNcBwf6E4KvVQVcRxR9T2saMtYYbxPA0u-fLNWX1cLZtzqW4NcEe30doKjYyJ_CCfOsZgTD9KVGaQ_Mlk3SboLJCNuwtG79GlzDkEA0GoBLSThxgQXYbRI0NGLxxE4b5xoSUPHh',
      badge: newProduct.badge || 'Nuevo',
      tags: newProduct.tags || ['Artisanal'],
      layers: newProduct.layers || ['Capa de Crema', 'Sponge', 'Crumble'],
      ingredients: newProduct.ingredients || ['Ingredientes Selectos'],
      rating: 5.0,
      reviewsCount: 1
    };

    onUpdateFlavors([createdItem, ...flavors]);
    setNewProduct({
      name: '',
      price: 9.50,
      category: 'fruit',
      description: '',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxo3zAuTOcfsSataHEVO0imunoM6gQyPsJ9Xn-EDC2vYI7NTXsaQKK4Eeir1na7O2HxrUF8jO5Y90uAMg2Au0WqEZjJ6rPacu4YiX-urVrqO1tgpNcBwf6E4KvVQVcRxR9T2saMtYYbxPA0u-fLNWX1cLZtzqW4NcEe30doKjYyJ_CCfOsZgTD9KVGaQ_Mlk3SboLJCNuwtG79GlzDkEA0GoBLSThxgQXYbRI0NGLxxE4b5xoSUPHh',
      badge: 'Nuevo Postre'
    });
    alert('¡Producto añadido con éxito al catálogo!');
  };

  return (
    <div id="adminPanel" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div 
        className="bg-[#fdf9f3] w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden border border-[#39c0d3]/40 max-h-[90vh] flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="px-6 py-4 bg-[#26170c] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#39c0d3] text-2xl">admin_panel_settings</span>
            <div>
              <h3 className="font-serif font-bold text-lg">CRUNQI™ Panel de Control Administrable</h3>
              <p className="text-[10px] text-[#e6e2dc] uppercase tracking-widest">CRUD Catálogo & Theme Engine Interactivo</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Auth or Portal Tabs Body */}
        {!isAuthenticated ? (
          <div className="p-8 overflow-y-auto text-[#1c1c18] flex items-center justify-center min-h-[350px]">
            <form onSubmit={handleLogin} className="space-y-4 max-w-sm w-full text-center">
              <span className="material-symbols-outlined text-5xl text-[#39c0d3]">lock</span>
              <h4 className="text-2xl font-serif font-bold">Acceso a Cocina & Administración</h4>
              <p className="text-xs text-[#81756e]">
                Ingresa el Token de seguridad (clave: <code className="bg-[#e6e2dc] px-1.5 py-0.5 rounded text-[#26170c] font-mono font-bold">crunqi-artisan</code>) para personalizar la web en tiempo real:
              </p>

              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Token de Acceso..."
                className="w-full bg-white border border-[#39c0d3]/40 rounded-2xl p-3.5 text-center font-mono text-sm focus:ring-2 focus:ring-[#39c0d3] outline-none shadow-inner"
              />

              {error && (
                <p className="text-xs text-[#d61219] font-medium">Clave incorrecta. Reintenta con "crunqi-artisan".</p>
              )}

              <button
                type="submit"
                className="w-full bg-[#39c0d3] text-[#26170c] py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider hover:bg-[#26170c] hover:text-white transition-colors shadow-md"
              >
                Autenticar Panel
              </button>
            </form>
          </div>
        ) : (
          <div className="flex flex-col flex-1 overflow-hidden">
            
            {/* Top Module Navigation Bar */}
            <div className="bg-[#f7f3ed] border-b border-[#39c0d3]/20 px-6 py-2.5 flex items-center gap-2 overflow-x-auto shrink-0">
              <button
                onClick={() => setActiveTab('theme')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'theme' 
                    ? 'bg-[#39c0d3] text-[#26170c] shadow-xs' 
                    : 'text-[#4f453f] hover:bg-white'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">palette</span>
                <span>1. Personalización Estética (Theme)</span>
              </button>

              <button
                onClick={() => setActiveTab('products')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'products' 
                    ? 'bg-[#39c0d3] text-[#26170c] shadow-xs' 
                    : 'text-[#4f453f] hover:bg-white'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">inventory_2</span>
                <span>2. Catálogo (CRUD Productos)</span>
              </button>

              <button
                onClick={() => setActiveTab('whatsapp')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'whatsapp' 
                    ? 'bg-[#39c0d3] text-[#26170c] shadow-xs' 
                    : 'text-[#4f453f] hover:bg-white'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">chat</span>
                <span>3. Config WhatsApp</span>
              </button>

              <button
                onClick={() => setActiveTab('batch')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'batch' 
                    ? 'bg-[#39c0d3] text-[#26170c] shadow-xs' 
                    : 'text-[#4f453f] hover:bg-white'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">cooking</span>
                <span>4. Lote de Cocina</span>
              </button>
            </div>

            {/* Tab Contents Area */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-[#1c1c18]">
              
              {/* TAB 1: Theme Engine Customizer */}
              {activeTab === 'theme' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="border-b border-[#39c0d3]/20 pb-3">
                    <h4 className="text-base font-serif font-bold text-[#26170c]">Módulo 1: Theme Engine (Personalización Estética)</h4>
                    <p className="text-xs text-[#81756e]">Cambia los colores de acento, fuentes de títulos y banner en tiempo real.</p>
                  </div>

                  {/* Palette Accent Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#26170c] block">
                      1. Paleta de Colores Principal
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { id: 'turquoise', name: 'Turquoise / Teal', color: '#39c0d3' },
                        { id: 'chocolate', name: 'Rich Chocolate', color: '#26170c' },
                        { id: 'berry', name: 'Berry Velvet Red', color: '#d61219' },
                        { id: 'cream', name: 'Artisan Warm Cream', color: '#e6e2dc' }
                      ].map((p) => (
                        <button
                          key={p.id}
                          onClick={() => onUpdateThemeSettings({ ...themeSettings, primaryPalette: p.id as any })}
                          className={`p-3 rounded-2xl border text-left flex items-center gap-2 transition-all ${
                            themeSettings.primaryPalette === p.id 
                              ? 'bg-white border-[#39c0d3] ring-2 ring-[#39c0d3]' 
                              : 'bg-white/60 border-gray-200 hover:border-[#39c0d3]'
                          }`}
                        >
                          <span className="w-5 h-5 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: p.color }} />
                          <span className="text-xs font-semibold text-[#26170c]">{p.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Title Typography Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#26170c] block">
                      2. Tipografía de Títulos Principal
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { name: 'Playfair Display', fontClass: 'font-serif' },
                        { name: 'Cormorant Garamond', fontClass: 'font-serif' },
                        { name: 'Cinzel', fontClass: 'font-serif uppercase' }
                      ].map((f) => (
                        <button
                          key={f.name}
                          onClick={() => onUpdateThemeSettings({ ...themeSettings, titleFont: f.name as any })}
                          className={`p-4 rounded-2xl border text-center transition-all ${
                            themeSettings.titleFont === f.name 
                              ? 'bg-[#26170c] text-white border-[#26170c]' 
                              : 'bg-white text-[#4f453f] border-gray-200 hover:border-[#39c0d3]'
                          }`}
                        >
                          <span className={`block text-base font-bold mb-1`} style={{ fontFamily: `'${f.name}', serif` }}>
                            CRUNQI
                          </span>
                          <span className="text-[10px] opacity-80 block">{f.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Hero Banner Manager */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#26170c] block">
                      3. Imagen de Banner / Portada (URL)
                    </label>
                    <input
                      type="text"
                      value={themeSettings.heroBannerImage || ''}
                      onChange={(e) => onUpdateThemeSettings({ ...themeSettings, heroBannerImage: e.target.value })}
                      placeholder="Ej. https://images.unsplash.com/photo-1579372786545-d24232daf58c"
                      className="w-full bg-white border border-[#39c0d3]/30 rounded-xl p-3 text-xs text-[#1c1c18] focus:ring-2 focus:ring-[#39c0d3] outline-none"
                    />
                  </div>

                  {/* Heidi Saratxaga Photo Manager */}
                  <div className="space-y-2 pt-2 border-t border-[#39c0d3]/15">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#26170c] block">
                      4. Foto de Heidi Saratxaga (Nuestra Historia)
                    </label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={themeSettings.heidiPhotoUrl || ''}
                        onChange={(e) => onUpdateThemeSettings({ ...themeSettings, heidiPhotoUrl: e.target.value })}
                        placeholder="URL de la imagen o selecciona un archivo..."
                        className="flex-1 bg-white border border-[#39c0d3]/30 rounded-xl p-3 text-xs text-[#1c1c18] focus:ring-2 focus:ring-[#39c0d3] outline-none"
                      />
                      <label className="bg-[#26170c] hover:bg-[#39c0d3] hover:text-[#26170c] text-white px-4 py-3 rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5 shrink-0">
                        <span className="material-symbols-outlined text-[16px]">upload</span>
                        <span>Subir Foto</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                const dataUrl = event.target?.result as string;
                                onUpdateThemeSettings({ ...themeSettings, heidiPhotoUrl: dataUrl });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="bg-[#39c0d3]/10 p-3 rounded-xl border border-[#39c0d3]/30 text-xs text-[#26170c] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#39c0d3]">check_circle</span>
                    <span>Los cambios estéticos se aplican instantáneamente en todo el entorno web.</span>
                  </div>
                </div>
              )}

              {/* TAB 2: Product Catalog CRUD */}
              {activeTab === 'products' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="border-b border-[#39c0d3]/20 pb-3 flex justify-between items-center">
                    <div>
                      <h4 className="text-base font-serif font-bold text-[#26170c]">Módulo 2: Gestión de Catálogo (CRUD)</h4>
                      <p className="text-xs text-[#81756e]">Añade, edita, destaca o elimina productos de la línea Spoonables™.</p>
                    </div>
                  </div>

                  {/* Add Product Form */}
                  <form onSubmit={handleAddProductSubmit} className="bg-white p-5 rounded-2xl border border-[#39c0d3]/30 space-y-4 shadow-xs">
                    <h5 className="text-xs font-bold uppercase text-[#39c0d3] tracking-wider flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">add_circle</span>
                      Añadir Nuevo Producto al Catálogo
                    </h5>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[10px] font-bold uppercase text-[#81756e]">Nombre del Producto</label>
                        <input
                          type="text"
                          required
                          value={newProduct.name || ''}
                          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                          placeholder="Ej. Pistachio Silk Jar"
                          className="w-full bg-[#fdf9f3] border border-[#39c0d3]/20 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-[#39c0d3] outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold uppercase text-[#81756e]">Precio ($ USD)</label>
                        <input
                          type="number"
                          step="0.05"
                          required
                          value={newProduct.price || 9.50}
                          onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                          className="w-full bg-[#fdf9f3] border border-[#39c0d3]/20 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-[#39c0d3] outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold uppercase text-[#81756e]">Categoría</label>
                        <select
                          value={newProduct.category || 'fruit'}
                          onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value as any })}
                          className="w-full bg-[#fdf9f3] border border-[#39c0d3]/20 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-[#39c0d3] outline-none"
                        >
                          <option value="fruit">Frutales (fruit)</option>
                          <option value="citrus">Cítricos (citrus)</option>
                          <option value="rich">Chocolates / Ricos (rich)</option>
                          <option value="special">Edición Especial (special)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase text-[#81756e]">Descripción Corta</label>
                      <input
                        type="text"
                        value={newProduct.description || ''}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        placeholder="Ej. Tiramisú de pistacho con crema mascarpone y coulis de frambuesa."
                        className="w-full bg-[#fdf9f3] border border-[#39c0d3]/20 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-[#39c0d3] outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase text-[#81756e]">URL Fotografía del Producto</label>
                      <input
                        type="text"
                        value={newProduct.image || ''}
                        onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                        className="w-full bg-[#fdf9f3] border border-[#39c0d3]/20 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-[#39c0d3] outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="bg-[#26170c] text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-[#39c0d3] hover:text-[#26170c] transition-colors flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">add</span>
                      <span>Guardar Nuevo Producto</span>
                    </button>
                  </form>

                  {/* List of Existing Products */}
                  <div className="space-y-3">
                    <h5 className="text-xs font-bold uppercase text-[#26170c] tracking-wider">
                      Lista de Productos Activos ({flavors.length})
                    </h5>

                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                      {flavors.map((flavor) => (
                        <div 
                          key={flavor.id}
                          className="flex items-center justify-between p-3.5 bg-white rounded-2xl border border-[#39c0d3]/20 text-xs shadow-xs"
                        >
                          <div className="flex items-center gap-3">
                            <img src={flavor.image} alt={flavor.name} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-serif font-bold text-[#26170c] text-sm">{flavor.name}</span>
                                {flavor.isBestseller && (
                                  <span className="bg-[#d61219] text-white text-[9px] font-bold px-1.5 py-0.2 rounded uppercase">
                                    ★ Bestseller
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] font-bold text-[#39c0d3]">${flavor.price.toFixed(2)}</span>
                              <span className="text-[10px] text-[#81756e] block truncate max-w-xs">{flavor.description}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => handleToggleBestseller(flavor.id)}
                              className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase transition-colors ${
                                flavor.isBestseller 
                                  ? 'bg-[#d61219] text-white' 
                                  : 'bg-[#f7f3ed] text-[#4f453f] hover:bg-[#39c0d3] hover:text-white'
                              }`}
                            >
                              {flavor.isBestseller ? '★ Bestseller' : '+ Destacar'}
                            </button>

                            <button
                              onClick={() => handleDeleteProduct(flavor.id)}
                              className="p-1.5 text-[#81756e] hover:text-[#d61219] hover:bg-[#d61219]/10 rounded-lg transition-colors"
                              title="Eliminar producto"
                            >
                              <span className="material-symbols-outlined text-[18px]">delete</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: WhatsApp Configurator */}
              {activeTab === 'whatsapp' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="border-b border-[#39c0d3]/20 pb-3">
                    <h4 className="text-base font-serif font-bold text-[#26170c]">Módulo 3: Configuración WhatsApp Business</h4>
                    <p className="text-xs text-[#81756e]">Actualiza el número receptor de pedidos y personaliza la plantilla de mensaje predeterminada.</p>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-[#39c0d3]/30 space-y-4">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-[#26170c] block mb-1">
                        Número Receptor de WhatsApp
                      </label>
                      <input
                        type="text"
                        value={themeSettings.whatsappNumber}
                        onChange={(e) => onUpdateThemeSettings({ ...themeSettings, whatsappNumber: e.target.value })}
                        placeholder="+15551234567"
                        className="w-full bg-[#fdf9f3] border border-[#39c0d3]/30 rounded-xl p-3 text-xs font-mono font-bold text-[#26170c] focus:ring-2 focus:ring-[#39c0d3] outline-none"
                      />
                      <p className="text-[10px] text-[#81756e] mt-1">
                        Formato internacional con código de país (ej. +15551234567 o +34612345678).
                      </p>
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-[#26170c] block mb-1">
                        Plantilla de Mensaje Predeterminado
                      </label>
                      <textarea
                        rows={4}
                        value={themeSettings.whatsappMessageTemplate}
                        onChange={(e) => onUpdateThemeSettings({ ...themeSettings, whatsappMessageTemplate: e.target.value })}
                        className="w-full bg-[#fdf9f3] border border-[#39c0d3]/30 rounded-xl p-3 text-xs text-[#1c1c18] focus:ring-2 focus:ring-[#39c0d3] outline-none leading-relaxed font-sans"
                      />
                      <p className="text-[10px] text-[#81756e] mt-1">
                        Usa las variables <code className="bg-[#e6e2dc] px-1 font-mono">{'{items}'}</code> y <code className="bg-[#e6e2dc] px-1 font-mono">{'{total}'}</code> para sustituir los productos del carrito automáticamente.
                      </p>
                    </div>

                    <div className="pt-2">
                      <a
                        href={`https://wa.me/${themeSettings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent("Prueba de mensaje desde el Panel Admin CRUNQI")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-[#d61219] text-white px-4 py-2.5 rounded-xl font-bold text-xs hover:bg-[#b00e14] transition-colors"
                      >
                        <span className="material-symbols-outlined text-[16px]">chat</span>
                        <span>Probar Enlace de WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: Batch Info */}
              {activeTab === 'batch' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="border-b border-[#39c0d3]/20 pb-3">
                    <h4 className="text-base font-serif font-bold text-[#26170c]">Módulo 4: Control de Lote Activo</h4>
                    <p className="text-xs text-[#81756e]">Monitorea la producción diaria y el stock disponible de frascos.</p>
                  </div>

                  <div className="bg-[#f7f3ed] p-5 rounded-2xl border border-[#39c0d3]/30 space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                      <div>
                        <span className="text-[#81756e] block text-[10px] font-bold uppercase">ID Lote:</span>
                        <input
                          type="text"
                          value={batch.batchNumber}
                          onChange={(e) => setBatch({ ...batch, batchNumber: e.target.value })}
                          className="w-full bg-white border border-[#39c0d3]/20 rounded-lg p-2 font-mono font-bold"
                        />
                      </div>
                      <div>
                        <span className="text-[#81756e] block text-[10px] font-bold uppercase">Fecha Preparado:</span>
                        <input
                          type="text"
                          value={batch.datePrepared}
                          onChange={(e) => setBatch({ ...batch, datePrepared: e.target.value })}
                          className="w-full bg-white border border-[#39c0d3]/20 rounded-lg p-2 font-semibold"
                        />
                      </div>
                      <div>
                        <span className="text-[#81756e] block text-[10px] font-bold uppercase">Maestra Repostera:</span>
                        <input
                          type="text"
                          value={batch.masterPastryChef}
                          onChange={(e) => setBatch({ ...batch, masterPastryChef: e.target.value })}
                          className="w-full bg-white border border-[#39c0d3]/20 rounded-lg p-2 font-semibold"
                        />
                      </div>
                      <div>
                        <span className="text-[#81756e] block text-[10px] font-bold uppercase">Stock Frascos:</span>
                        <input
                          type="number"
                          value={batch.jarsAvailable}
                          onChange={(e) => setBatch({ ...batch, jarsAvailable: parseInt(e.target.value) || 0 })}
                          className="w-full bg-white border border-[#39c0d3]/20 rounded-lg p-2 font-bold text-[#d61219]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#f7f3ed] border-t border-[#39c0d3]/20 flex items-center justify-between shrink-0">
              <span className="text-[10px] text-[#81756e] flex items-center gap-1 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Persistencia local activa (localStorage)</span>
              </span>

              <button
                onClick={() => setIsAuthenticated(false)}
                className="text-xs font-bold text-[#81756e] hover:text-[#d61219] underline"
              >
                Bloquear Portal y Salir
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};
